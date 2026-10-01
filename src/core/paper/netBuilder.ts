import type { Point2D, UnfoldedFace, UnfoldedPart } from '../types'
import type { PaperDiagnostic, PaperEdge, PaperSeam, PaperSurface, Triple } from './types'
import { LENGTH_EPS, attachTriangle, bounds2, centroid2, dist2, flattenTriangle, isIsometric, overlaps, signedArea } from './geometry'

export interface NetOptions {
  tabWidth?: number
  tabAngle?: number
  rootFaceId?: string
  /** Core area reserves room for tabs; never scale individual pieces to fit. */
  maxWidth?: number
  maxHeight?: number
}
interface Island {
  faces: Map<number,Triple<Point2D>>
  parents: Map<number,number>
}
const printFaceUp=(points:Triple<Point2D>):Triple<Point2D>=>signedArea(points)<0?points:points.map(p=>({x:-p.x,y:p.y})) as Triple<Point2D>
const fit=(polys:Point2D[][],w:number,h:number)=>{
  const b=bounds2(polys)
  return (b.width<=w+LENGTH_EPS&&b.height<=h+LENGTH_EPS)||(b.width<=h+LENGTH_EPS&&b.height<=w+LENGTH_EPS)
}

const canKeep=(surface:PaperSurface,edge:PaperEdge)=>!edge.forceCut&&edge.faces.length===2&&
  surface.triangles[edge.faces[0].faceIndex].unfoldRegion?.id===surface.triangles[edge.faces[1].faceIndex].unfoldRegion?.id

function sharedInPlane(surface:PaperSurface,edge:PaperEdge,faces:Map<number,Triple<Point2D>>):boolean {
  if(!canKeep(surface,edge))return false
  const [a,b]=edge.faces,pa=faces.get(a.faceIndex),pb=faces.get(b.faceIndex)
  if(!pa||!pb)return false
  const fa=surface.triangles[a.faceIndex],fb=surface.triangles[b.faceIndex]
  return edge.vertexIds.every(id=>dist2(pa[fa.vertexIds.indexOf(id)],pb[fb.vertexIds.indexOf(id)])<LENGTH_EPS*10)
}

function templateIslands(surface:PaperSurface,w:number,h:number):Island[]|null {
  if(surface.triangles.some(f=>!f.layoutHint||!isIsometric(f.vertices,f.layoutHint)))return null
  const positions=new Map(surface.triangles.map((f,i)=>[i,f.layoutHint!]))
  for(let i=0;i<surface.triangles.length;i++) for(let j=0;j<i;j++) {
    if(overlaps(positions.get(i)!,positions.get(j)!))return null
  }
  const adjacency=surface.triangles.map(()=>[] as number[])
  surface.edges.forEach(e=>{if(sharedInPlane(surface,e,positions)) {
    const [a,b]=e.faces;adjacency[a.faceIndex].push(b.faceIndex);adjacency[b.faceIndex].push(a.faceIndex)
  }})
  const seen=new Set<number>(),islands:Island[]=[]
  for(let seed=0;seed<surface.triangles.length;seed++) {
    if(seen.has(seed))continue
    const queue=[seed],faces=new Map<number,Triple<Point2D>>(),parents=new Map<number,number>();seen.add(seed)
    for(let k=0;k<queue.length;k++) {
      const index=queue[k];faces.set(index,positions.get(index)!)
      for(const next of adjacency[index])if(!seen.has(next)){seen.add(next);parents.set(next,index);queue.push(next)}
    }
    if(!fit([...faces.values()],w,h))return null
    const winding=Math.sign(signedArea(faces.values().next().value!))
    if([...faces.values()].some(p=>Math.sign(signedArea(p))!==winding))return null
    // Reflect a whole island, never individual faces, so authored shared edges stay joined.
    if(signedArea(faces.values().next().value!)>0)for(const [i,p] of faces)faces.set(i,p.map(v=>({x:-v.x,y:v.y})) as Triple<Point2D>)
    islands.push({faces,parents})
  }
  return islands
}

function growIslands(surface:PaperSurface,w:number,h:number,variant:number,rootFaceId?:string):Island[] {
  const unplaced=new Set(surface.triangles.map((_,i)=>i)),islands:Island[]=[]
  const areas=surface.triangles.map(t=>Math.abs(signedArea(flattenTriangle(t.vertices))))
  const edgeScore=(e:PaperEdge)=>{
    const [a,b]=e.faces
    const same=b&&surface.triangles[a.faceIndex].sourceFaceId===surface.triangles[b.faceIndex].sourceFaceId
    return (Math.abs(e.foldAngle)<1e-5?100000:0)+(e.preferKeep?20000:0)+(same?10000:0)+e.length*(variant%2?2:1)-Math.abs(e.foldAngle)*5
  }
  while(unplaced.size) {
    const candidates=[...unplaced].sort((a,b)=>{
      const fa=surface.triangles[a],fb=surface.triangles[b]
      const score=(f:typeof fa,i:number)=>(f.textureSlot==='roof'?100000:0)+areas[i]
      return score(fb,b)-score(fa,a)||a-b
    })
    const requested=surface.triangles.findIndex(f=>f.id===rootFaceId)
    const seed=islands.length===0&&unplaced.has(requested)?requested:candidates[Math.min(islands.length===0?variant:0,candidates.length-1)]
    const triangle=surface.triangles[seed]
    const root=printFaceUp(triangle.layoutHint&&isIsometric(triangle.vertices,triangle.layoutHint)?triangle.layoutHint:flattenTriangle(triangle.vertices))
    if(!fit([root],w,h))throw new Error(`${surface.id}/${triangle.id}: a single face is larger than the printable area; reduce the model scale`)
    const faces=new Map<number,Triple<Point2D>>([[seed,root]]),parents=new Map<number,number>()
    unplaced.delete(seed)
    let progressed=true
    while(progressed) {
      progressed=false
      const frontier=surface.edges.filter(e=>canKeep(surface,e)&&e.faces.some(f=>faces.has(f.faceIndex))&&e.faces.some(f=>unplaced.has(f.faceIndex))).sort((a,b)=>edgeScore(b)-edgeScore(a)||a.id.localeCompare(b.id))
      for(const edge of frontier) {
        const parent=edge.faces.find(f=>faces.has(f.faceIndex))!,child=edge.faces.find(f=>unplaced.has(f.faceIndex))
        if(!child)continue
        const pf=surface.triangles[parent.faceIndex],cf=surface.triangles[child.faceIndex],pp=faces.get(parent.faceIndex)!
        const a=cf.vertexIds[child.edgeIndex],b=cf.vertexIds[(child.edgeIndex+1)%3]
        const points=attachTriangle(cf.vertices,child.edgeIndex,pp[pf.vertexIds.indexOf(a)],pp[pf.vertexIds.indexOf(b)],centroid2(pp))
        if(!fit([...faces.values(),points],w,h)||[...faces.values()].some(p=>overlaps(p,points)))continue
        faces.set(child.faceIndex,points);parents.set(child.faceIndex,parent.faceIndex);unplaced.delete(child.faceIndex)
        progressed=true
        break // Rebuild frontier after every placement; rejected faces may use another hinge.
      }
    }
    islands.push({faces,parents})
  }
  return islands
}

const scoreIslands=(surface:PaperSurface,islands:Island[])=>{
  const cutLength=surface.edges.filter(e=>e.faces.length===2&&!islands.some(i=>sharedInPlane(surface,e,i.faces))).reduce((s,e)=>s+e.length,0)
  return islands.length*10000+cutLength+islands.reduce((s,i)=>{const b=bounds2([...i.faces.values()]);return s+b.width*b.height/10000},0)
}

function makeTab(p1:Point2D,p2:Point2D,face:Point2D[],width:number,angle:number):Point2D[] {
  const length=dist2(p1,p2),ux=(p2.x-p1.x)/length,uy=(p2.y-p1.y)/length
  const sign=signedArea(face)>=0?-1:1,indent=Math.min(width/Math.tan(angle*Math.PI/180),length*0.25)
  return [{...p1},{x:p1.x+ux*indent-sign*uy*width,y:p1.y+uy*indent+sign*ux*width},{x:p2.x-ux*indent-sign*uy*width,y:p2.y-uy*indent+sign*ux*width},{...p2}]
}

/** Deterministic, length-preserving nets with explicit cut pairs and validated tab geometry. */
export function buildNets(surface:PaperSurface,partNumber:number,diagnostics:PaperDiagnostic[],options:NetOptions={}):{parts:UnfoldedPart[];seams:PaperSeam[]} {
  const tabWidth=options.tabWidth??6,tabAngle=options.tabAngle??45,w=options.maxWidth??176,h=options.maxHeight??249
  if(!Number.isFinite(tabWidth)||tabWidth<0||!Number.isFinite(tabAngle)||tabAngle<=0||tabAngle>=90)throw new Error('Invalid glue-tab dimensions')
  const template=templateIslands(surface,w,h)
  let islands=template
  if(!islands) {
    const attempts=Array.from({length:Math.min(4,surface.triangles.length)},(_,i)=>growIslands(surface,w,h,i,options.rootFaceId))
    islands=attempts.sort((a,b)=>scoreIslands(surface,a)-scoreIslands(surface,b))[0]||[]
    diagnostics.push({code:'computed-net',severity:'info',partId:surface.id,message:'Computed a rigid unfolding from the 3D surface.'})
  }
  const parts:UnfoldedPart[]=islands.map((island,index)=>({
    id:`${surface.id}:island:${index+1}`,sourcePartId:surface.id,kind:'surface',
    name:surface.triangles[island.faces.keys().next().value!].unfoldRegion?.name ?? (islands!.length>1?`${surface.name} (${index+1}/${islands!.length})`:surface.name),isAccessory:surface.isAccessory,
    faces:[...island.faces].map(([i,polygon2D]):UnfoldedFace=>{
      const f=surface.triangles[i]
      return {id:f.id,name:f.name,sourceFaceId:f.sourceFaceId,polygon2D:polygon2D.map(p=>({...p})),vertices3D:f.vertices.map(p=>({...p})),uvCoords:f.uvs.map(p=>({...p})),textureSlot:f.textureSlot,textureSpace:'surface',creases:[],glueTabs:[],parentFaceId:island.parents.has(i)?surface.triangles[island.parents.get(i)!].id:undefined}
    }),bounds:bounds2([...island.faces.values()])
  }))
  const location=new Map<number,{part:UnfoldedPart;face:UnfoldedFace;island:Island}>()
  islands.forEach((island,i)=>[...island.faces.keys()].forEach((fi,j)=>location.set(fi,{part:parts[i],face:parts[i].faces[j],island})))
  const seams:PaperSeam[]=[]
  for(const edge of surface.edges) {
    const [a,b]=edge.faces,la=location.get(a.faceIndex)!
    const segment=(ref:typeof a)=>{
      const f=location.get(ref.faceIndex)!.face
      return [f.polygon2D[ref.edgeIndex],f.polygon2D[(ref.edgeIndex+1)%3]] as [Point2D,Point2D]
    }
    if(b&&sharedInPlane(surface,edge,la.island.faces)) {
      if(Math.abs(edge.foldAngle)>1e-5) {
        const [p1,p2]=segment(a)
        la.face.creases.push({type:edge.foldAngle>0?'mountain':'valley',p1,p2,edgeId:edge.id})
      }
      continue
    }
    if(!b) {
      const [p1,p2]=segment(a);la.face.creases.push({type:'cut',p1,p2,edgeId:edge.id})
      continue
    }
    const lb=location.get(b.faceIndex)!,number=seams.length+1,label=`${partNumber}.${number}`,seamId=`${surface.id}/seam/${edge.id}`
    const seam:PaperSeam={id:seamId,label,surfaceId:surface.id,edgeId:edge.id,length:edge.length,attachment:'strip',sides:[{partId:la.part.id,faceId:la.face.id,edgeIndex:a.edgeIndex},{partId:lb.part.id,faceId:lb.face.id,edgeIndex:b.edgeIndex}]}
    const refs=[a,b]
    let tabOwner:typeof a|undefined
    // Prefer authored tab width, then shrink, then swap sides; never just flip into another face.
    for(const width of [...new Set([Math.min(tabWidth,edge.length/3),4,3,2].filter(v=>v<=tabWidth&&v<=edge.length/2&&v>=2))].sort((x,y)=>y-x)) {
      for(const ref of refs) {
        const local=location.get(ref.faceIndex)!,other=ref===a?lb:la,[p1,p2]=segment(ref)
        const polygon=makeTab(p1,p2,local.face.polygon2D,width,tabAngle)
        const occupied=local.part.faces.flatMap(f=>[f.polygon2D,...f.glueTabs.map(t=>t.polygon2D!)])
        if(occupied.some(p=>overlaps(polygon,p))||!fit([...occupied,polygon],190,263))continue
        local.face.glueTabs.push({id:`${seamId}/tab`,label,edgeIndex:ref.edgeIndex,p1,p2,tabWidth:width,angle:tabAngle,targetPartId:other.part.id,targetFaceId:other.face.id,targetEdgeIndex:ref===a?b.edgeIndex:a.edgeIndex,seamId,polygon2D:polygon})
        tabOwner=ref;seam.attachment='tab';break
      }
      if(tabOwner)break
    }
    for(const ref of refs) {
      const [p1,p2]=segment(ref)
      location.get(ref.faceIndex)!.face.creases.push({type:ref===tabOwner?(edge.foldAngle<0?'valley':'mountain'):'cut',p1,p2,label:ref===tabOwner?undefined:label,seamId,edgeId:edge.id})
    }
    if(!tabOwner) {
      // A narrow concave corner may leave no usable tab on either side. Supply a separate
      // backing strip, carrying the same seam number on both halves.
      const length=edge.length,width=Math.min(3,length/3)
      const polygon2D=[{x:0,y:0},{x:length,y:0},{x:length,y:2*width},{x:0,y:2*width}]
      const id=`${seamId}/strip`
      parts.push({id,sourcePartId:surface.id,kind:'join-strip',name:`${label} · 接缝连接条 / Joining strip`,isAccessory:true,bounds:bounds2([polygon2D]),faces:[{id,name:label,textureSlot:'',polygon2D,uvCoords:[],creases:[...polygon2D.map((p,i)=>({type:'cut' as const,p1:p,p2:polygon2D[(i+1)%4]})),{type:edge.foldAngle<0?'mountain':'valley',p1:{x:0,y:width},p2:{x:length,y:width},label,seamId}],glueTabs:[]}]})
      if(width<1.5)diagnostics.push({code:'small-join',severity:'warning',partId:surface.id,message:`Seam ${label} needs a narrow backing strip (${width.toFixed(1)} mm).`})
    }
    seams.push(seam)
  }
  for(const part of parts)part.bounds=bounds2(part.faces.flatMap(f=>[f.polygon2D,...f.glueTabs.map(t=>t.polygon2D!)]))
  return {parts,seams}
}
