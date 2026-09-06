import type { Point2D, Point3D } from '../types'
import type { PaperDiagnostic, PaperEdge, PaperSurface, PaperTriangle, Triple } from './types'
import { AREA_EPS, LENGTH_EPS, cross3, dist2, dist3, dot3, norm3, sub3, triangleNormal, unit3 } from './geometry'

export interface TriangleInput {
  id: string
  sourceFaceId: string
  name: string
  textureSlot: string
  unfoldRegion?: { id: string; name: string }
  vertices: Triple<Point3D>
  uvs: Triple<Point2D>
  layoutHint?: Triple<Point2D>
}

export interface SurfaceInput {
  id: string
  name: string
  isAccessory: boolean
  triangles: TriangleInput[]
  cutEdges?: [Point3D,Point3D][]
}

const key = (a: number,b: number) => a<b?`${a}:${b}`:`${b}:${a}`

/** Geometry identity is separate from material/UV identity, including across T junctions. */
export function buildSurface(input: SurfaceInput,diagnostics: PaperDiagnostic[]): PaperSurface {
  const vertices: Point3D[]=[]
  const vertexId=(p: Point3D) => {
    const found=vertices.findIndex(v=>dist3(v,p)<LENGTH_EPS)
    if(found>=0) return found
    vertices.push({...p});return vertices.length-1
  }
  const triangles: PaperTriangle[]=[]
  const seen=new Set<string>()
  for(const f of input.triangles) {
    if(f.vertices.some(v=>![v.x,v.y,v.z].every(Number.isFinite))) throw new Error(`${input.id}/${f.id}: invalid 3D coordinates`)
    if(norm3(cross3(sub3(f.vertices[1],f.vertices[0]),sub3(f.vertices[2],f.vertices[0])))<AREA_EPS) {
      diagnostics.push({code:'degenerate-triangle',severity:'warning',partId:input.id,faceId:f.id,message:'Removed a zero-area triangle.'})
      continue
    }
    const ids=f.vertices.map(vertexId) as Triple<number>
    const idKey=ids.slice().sort((a,b)=>a-b).join(':')
    if(seen.has(idKey)) {
      diagnostics.push({code:'duplicate-triangle',severity:'warning',partId:input.id,faceId:f.id,message:'Removed a duplicate surface triangle.'})
      continue
    }
    seen.add(idKey)
    triangles.push({...f,vertexIds:ids,normal:triangleNormal(f.vertices)})
  }

  // A long boundary may meet several shorter edges. Subdivide it without moving the surface
  // or changing its UV field. The fan centre stays inside the original triangle.
  const refined: PaperTriangle[]=[]
  const originalVertices=vertices.slice()
  for(const t of triangles) {
    const ring: {id:number;uv:Point2D;hint?:Point2D}[]=[]
    for(let i=0;i<3;i++) {
      const j=(i+1)%3,a=t.vertices[i],b=t.vertices[j],ab=sub3(b,a),length2=dot3(ab,ab)
      const interior: {id:number;weight:number}[]=[]
      for(let id=0;id<originalVertices.length;id++) {
        if(id===t.vertexIds[i]||id===t.vertexIds[j])continue
        const v=originalVertices[id],weight=dot3(sub3(v,a),ab)/length2
        if(weight<=LENGTH_EPS||weight>=1-LENGTH_EPS)continue
        if(norm3(cross3(sub3(v,a),ab))/Math.sqrt(length2)<LENGTH_EPS)interior.push({id,weight})
      }
      ring.push({id:t.vertexIds[i],uv:t.uvs[i],hint:t.layoutHint?.[i]})
      for(const {id,weight} of interior.sort((x,y)=>x.weight-y.weight)) {
        const mix=(p:Point2D,q:Point2D)=>({x:p.x+weight*(q.x-p.x),y:p.y+weight*(q.y-p.y)})
        ring.push({id,uv:mix(t.uvs[i],t.uvs[j]),hint:t.layoutHint?mix(t.layoutHint[i],t.layoutHint[j]):undefined})
      }
    }
    if(ring.length===3){refined.push(t);continue}
    const centre={x:t.vertices.reduce((s,p)=>s+p.x,0)/3,y:t.vertices.reduce((s,p)=>s+p.y,0)/3,z:t.vertices.reduce((s,p)=>s+p.z,0)/3}
    const cid=vertexId(centre)
    const average=(ps:Point2D[])=>({x:ps.reduce((s,p)=>s+p.x,0)/3,y:ps.reduce((s,p)=>s+p.y,0)/3})
    for(let i=0;i<ring.length;i++) {
      const a=ring[i],b=ring[(i+1)%ring.length]
      const ids:Triple<number>=[a.id,b.id,cid]
      refined.push({...t,id:`${t.id}.${i}`,vertexIds:ids,vertices:ids.map(id=>vertices[id]) as Triple<Point3D>,uvs:[a.uv,b.uv,average(t.uvs)],layoutHint:t.layoutHint?[a.hint!,b.hint!,average(t.layoutHint)]:undefined})
    }
  }

  const collectEdges=():PaperEdge[]=>{
    const edges=new Map<string,PaperEdge>()
    refined.forEach((f,faceIndex)=>{
      for(let i=0;i<3;i++) {
        const a=f.vertexIds[i],b=f.vertexIds[(i+1)%3],id=key(a,b)
        if(!edges.has(id))edges.set(id,{id,vertexIds:[a,b],faces:[],length:dist3(vertices[a],vertices[b]),foldAngle:0,preferKeep:false,forceCut:false})
        edges.get(id)!.faces.push({faceIndex,edgeIndex:i})
      }
    })
    return [...edges.values()]
  }
  let edges=collectEdges()
  const adjacency=refined.map(()=>[] as {other:number,sameDirection:boolean}[])
  for(const edge of edges) {
    if(edge.faces.length>2)throw new Error(`${input.id}: non-manifold edge ${edge.id} (${edge.faces.length} faces)`)
    if(edge.faces.length!==2)continue
    const [a,b]=edge.faces,fa=refined[a.faceIndex],fb=refined[b.faceIndex]
    const sameDirection=fa.vertexIds[a.edgeIndex]===fb.vertexIds[b.edgeIndex]
    adjacency[a.faceIndex].push({other:b.faceIndex,sameDirection})
    adjacency[b.faceIndex].push({other:a.faceIndex,sameDirection})
  }
  // Orient whole connected components consistently, preserving every corner's UV and hint.
  const flips=new Map<number,boolean>()
  const components:number[][]=[]
  for(let start=0;start<refined.length;start++) {
    if(flips.has(start))continue
    const queue=[start],component:number[]=[];flips.set(start,false)
    for(let n=0;n<queue.length;n++) {
      const current=queue[n];component.push(current)
      for(const {other,sameDirection} of adjacency[current]) {
        const flip=Boolean(flips.get(current)) !== sameDirection
        if(flips.has(other)) {
          if(flips.get(other)!==flip)throw new Error(`${input.id}: surface is not orientable`)
        } else {flips.set(other,flip);queue.push(other)}
      }
    }
    components.push(component)
  }
  const flipFace=(f:PaperTriangle)=>{
    const swap=<T>(v:Triple<T>):Triple<T>=>[v[0],v[2],v[1]]
    f.vertices=swap(f.vertices);f.vertexIds=swap(f.vertexIds);f.uvs=swap(f.uvs)
    if(f.layoutHint)f.layoutHint=swap(f.layoutHint)
    f.normal=triangleNormal(f.vertices)
  }
  flips.forEach((flip,i)=>{if(flip)flipFace(refined[i])})
  for(const component of components) {
    const volume=component.reduce((s,i)=>{const v=refined[i].vertices;return s+dot3(v[0],cross3(v[1],v[2]))},0)
    const members=new Set(component)
    const closed=edges.filter(e=>e.faces.some(f=>members.has(f.faceIndex))).every(e=>e.faces.length===2)
    if(closed&&volume<-AREA_EPS)component.forEach(i=>flipFace(refined[i]))
  }
  edges=collectEdges()
  for(const edge of edges) {
    const [a,b]=edge.faces
    if(b) {
      const fa=refined[a.faceIndex],fb=refined[b.faceIndex]
      const direction=unit3(sub3(fa.vertices[(a.edgeIndex+1)%3],fa.vertices[a.edgeIndex]))
      edge.foldAngle=Math.atan2(dot3(direction,cross3(fa.normal,fb.normal)),Math.max(-1,Math.min(1,dot3(fa.normal,fb.normal))))
      if(fa.layoutHint&&fb.layoutHint) {
        const pairs=edge.vertexIds.map(id=>[fa.layoutHint![fa.vertexIds.indexOf(id)],fb.layoutHint![fb.vertexIds.indexOf(id)]])
        edge.preferKeep=pairs.every(([p,q])=>dist2(p,q)<LENGTH_EPS*10)
      }
    }
    edge.forceCut=(input.cutEdges||[]).some(([p,q])=>{
      const [v,w]=edge.vertexIds.map(id=>vertices[id])
      const d=sub3(q,p),length=norm3(d)
      const onSegment=(r:Point3D)=>length>LENGTH_EPS&&norm3(cross3(sub3(r,p),d))/length<LENGTH_EPS&&dot3(sub3(r,p),d)>=-LENGTH_EPS&&dot3(sub3(r,q),d)<=LENGTH_EPS
      return onSegment(v)&&onSegment(w)
    })
  }
  return {id:input.id,name:input.name,isAccessory:input.isAccessory,triangles:refined,edges,vertices}
}
