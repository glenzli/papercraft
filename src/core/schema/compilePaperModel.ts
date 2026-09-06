import { ShapeUtils, Vector2 } from 'three'
import type { Point2D, Point3D } from '../types'
import type { PaperDiagnostic, PaperModel, Triple } from '../paper/types'
import { bounds2, cross3, signedArea, sub3 } from '../paper/geometry'
import { buildSurface, type SurfaceInput, type TriangleInput } from '../paper/topology'
import { projectPhysicalMark, transferMark } from '../paper/interiorMarks'
import { buildNets } from '../paper/netBuilder'
import { assignUnfoldRegions } from '../paper/unfoldRegions'
import type { PapercraftModelSchema, SchemaFace, SchemaUnfoldRegion } from './papercraftSchema'

const point3=(v:number[]):Point3D=>({x:v[0],y:v[1],z:v[2]})
const point2=(v:number[]):Point2D=>({x:v[0],y:v[1]})

/** Per-corner UV repair only when the legacy asset omitted an invertible UV triangle. */
function projectedUvs(vertices:Triple<Point3D>):Triple<Point2D> {
  const normal=cross3(sub3(vertices[1],vertices[0]),sub3(vertices[2],vertices[0]))
  const axis=Math.abs(normal.x)>Math.abs(normal.y)?(Math.abs(normal.x)>Math.abs(normal.z)?'x':'z'):(Math.abs(normal.y)>Math.abs(normal.z)?'y':'z')
  const ps=vertices.map(p=>axis==='x'?{x:p.z,y:p.y}:axis==='y'?{x:p.x,y:p.z}:{x:p.x,y:p.y})
  const b=bounds2([ps])
  return ps.map(p=>({x:(p.x-b.minX)/(b.width||1),y:(p.y-b.minY)/(b.height||1)})) as Triple<Point2D>
}

function faceTriangles(face:SchemaFace,partId:string,offset:Point3D,diagnostics:PaperDiagnostic[]):TriangleInput[] {
  if(!Array.isArray(face.vertices3D)||face.vertices3D.length<3)throw new Error(`${partId}/${face.id}: missing surface vertices`)
  let indices=face.indices
  if(!indices?.length) {
    // New polygon-only assets may omit tessellation; triangulate their planar projection.
    const p=face.vertices3D.map(point3),n=cross3(sub3(p[1],p[0]),sub3(p[2],p[0]))
    const axis=Math.abs(n.y)>Math.abs(n.x)&&Math.abs(n.y)>Math.abs(n.z)?'y':Math.abs(n.x)>Math.abs(n.z)?'x':'z'
    const contour=p.map(v=>new Vector2(axis==='x'?v.z:v.x,axis==='y'?v.z:v.y))
    indices=ShapeUtils.triangulateShape(contour,[]).flat()
  }
  if(indices.length%3)throw new Error(`${partId}/${face.id}: triangle indices must be a multiple of three`)
  const result:TriangleInput[]=[]
  let repairedUv=false
  for(let i=0;i<indices.length;i+=3) {
  const ids=indices.slice(i,i+3)
    if(ids.some(id=>!Number.isInteger(id)||id<0||id>=face.vertices3D.length))throw new Error(`${partId}/${face.id}: triangle index is outside the vertex array`)
    const vertices=ids.map(id=>{const p=point3(face.vertices3D[id]);return {x:p.x+offset.x,y:p.y+offset.y,z:p.z+offset.z}}) as Triple<Point3D>
    let uvs=ids.map(id=>face.uvCoords?.[id]?point2(face.uvCoords[id]):{x:NaN,y:NaN}) as Triple<Point2D>
    if(uvs.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y))||Math.abs(signedArea(uvs))<1e-10){uvs=projectedUvs(vertices);repairedUv=true}
    const layoutHint=face.vertices2D?.length===face.vertices3D.length?ids.map(id=>point2(face.vertices2D[id])) as Triple<Point2D>:undefined
    result.push({id:`${partId}/${face.id}/${i/3}`,sourceFaceId:face.id,name:face.name,textureSlot:face.slotName,vertices,uvs,layoutHint})
  }
  if(repairedUv)diagnostics.push({code:'generated-uv',severity:'info',partId,faceId:face.id,message:'Generated corner UVs for a missing or degenerate legacy mapping.'})
  return result
}

/** Transfer interior cut/score marks only through a valid per-triangle layout correspondence.
 * Outer cuts, hinges, tabs and pair numbers are always derived from the physical topology. */
function transferInteriorMarks(faces:SchemaFace[],model:PaperModel,surfaceId:string,offset:Point3D) {
  const surface=model.surfaces.find(s=>s.id===surfaceId)!
  for(const source of faces) {
    const candidates=model.parts.filter(p=>p.sourcePartId===surfaceId).flatMap(p=>p.faces).filter(f=>f.sourceFaceId===source.id)
    for(const target of candidates) {
      const triangle=surface.triangles.find(t=>t.id===target.id)!
      if(triangle.layoutHint)for(const crease of source.creases||[]) {
        // Physical cuts supersede the legacy 2D slot coordinates on this face.
        if(crease.type!=='cut'||source.cuts3D?.length)continue
        transferMark(crease.p1,crease.p2,triangle.layoutHint,target,crease.type)
      }
      for(const cut of source.cuts3D||[]) {
        const points=cut.map(v=>projectPhysicalMark({x:v[0]+offset.x,y:v[1]+offset.y,z:v[2]+offset.z},triangle))
        if(points[0]&&points[1])transferMark(points[0],points[1],[{x:0,y:0},{x:1,y:0},{x:0,y:1}],target,'cut',true)
      }
    }
  }
}

/** One compilation owns topology, 3D surfaces, UV correspondence and printable pieces. */
export function compilePaperModel(schema:PapercraftModelSchema):PaperModel {
  if(!schema.parts?.length)throw new Error('A paper model requires at least one part')
  if(!schema.dimensions||![schema.dimensions.length,schema.dimensions.width,schema.dimensions.height].every(v=>Number.isFinite(v)&&v>0))throw new Error('Model dimensions must be positive millimetres')
  const ids=[...schema.parts,...(schema.accessories||[])].map(p=>p.id)
  if(new Set(ids).size!==ids.length)throw new Error('Duplicate physical part ID')
  for(const part of [...schema.parts,...(schema.accessories||[])])if(part.faces&&new Set(part.faces.map(f=>f.id)).size!==part.faces.length)throw new Error(`${part.id}: duplicate source face ID`)
  const model:PaperModel={surfaces:[],parts:[],seams:[],diagnostics:[]}
  const compile=(id:string,name:string,isAccessory:boolean,faces:SchemaFace[],offset:Point3D={x:0,y:0,z:0},regions?:SchemaUnfoldRegion[])=>{
    const input:SurfaceInput={id,name,isAccessory,triangles:faces.flatMap(f=>faceTriangles(f,id,offset,model.diagnostics)),cutEdges:faces.flatMap(f=>(f.cutEdges||[]).map(([a,b]):[Point3D,Point3D]=>[a,b].map(i=>{const p=point3(f.vertices3D[i]);return{x:p.x+offset.x,y:p.y+offset.y,z:p.z+offset.z}}) as [Point3D,Point3D]))}
    assignUnfoldRegions(id,input.triangles,regions)
    const surface=buildSurface(input,model.diagnostics)
    if(!surface.triangles.length)throw new Error(`${id}: no non-degenerate paper surface`)
    model.surfaces.push(surface)
    const net=buildNets(surface,model.surfaces.length,model.diagnostics)
    model.parts.push(...net.parts);model.seams.push(...net.seams)
    transferInteriorMarks(faces,model,id,offset)
  }
  schema.parts.forEach((part,i)=>compile(part.id,part.name,part.isAccessory??i>0,part.faces,undefined,part.unfoldRegions))
  for(const acc of schema.accessories||[]) {
    // Accessory faces are the actual construction, not a separate decorative mesh.
    const faces=acc.faces?.length?acc.faces:[{id:acc.id,name:acc.name,slotName:acc.slotName,vertices3D:acc.vertices3D,vertices2D:[],indices:acc.indices,uvCoords:acc.uvCoords}]
    compile(acc.id,acc.name,true,faces,point3(acc.position3D||[0,0,0]))
  }
  return model
}
