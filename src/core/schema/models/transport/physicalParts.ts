import type { SchemaFace, SchemaPart, PapercraftModelSchema } from '../../papercraftSchema'
import type { TrainModelConsist } from '../../consistSchema'
import { panel, type Vertex } from './paperShapes'

/** Local artwork axes with positive UV winding; useful for outward solid faces. */
export function mappedPanel(id:string,slot:string,v:Vertex[],name=id):SchemaFace {
  const n=[0,0,0]
  v.forEach((a,i)=>{const b=v[(i+1)%v.length];n[0]+=(a[1]-b[1])*(a[2]+b[2]);n[1]+=(a[2]-b[2])*(a[0]+b[0]);n[2]+=(a[0]-b[0])*(a[1]+b[1])})
  const axis=n.map(Math.abs).indexOf(Math.max(...n.map(Math.abs))),a=(axis+1)%3,b=(axis+2)%3
  const loA=Math.min(...v.map(p=>p[a])),loB=Math.min(...v.map(p=>p[b])),da=Math.max(...v.map(p=>p[a]))-loA,db=Math.max(...v.map(p=>p[b]))-loB
  const uv=v.map(p=>[(p[a]-loA)/da,(p[b]-loB)/db] as [number,number])
  if(n[axis]<0)uv.forEach(p=>{p[0]=1-p[0]})
  const face=panel(id,slot,v,uv.map(([u,w])=>[1-u,w]),name)
  // Earcut chooses projection winding. Preserve the authored 3D normal explicitly.
  const [i,j,k]=face.indices!,a0=v[i],b0=v[j],c0=v[k],ab=b0.map((x,a)=>x-a0[a]),ac=c0.map((x,a)=>x-a0[a])
  const tn=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]]
  if(tn.reduce((s,x,a)=>s+x*n[a],0)<0)for(let a=0;a<face.indices!.length;a+=3)[face.indices![a+1],face.indices![a+2]]=[face.indices![a+2],face.indices![a+1]]
  return face
}

/** Horizontal footprint extruded vertically, including concave integral wheel arms. */
export function footprintSolid(id:string,name:string,foot:[number,number][],bottom:number,top:number,slot='frame',edgeSlots?:string[]):SchemaPart {
  // Positive X/Z polygon: bottom outward -Y, top outward +Y.
  const area=foot.reduce((s,p,i)=>{const q=foot[(i+1)%foot.length];return s+p[0]*q[1]-q[0]*p[1]},0)
  const p=area>0?foot:[...foot].reverse()
  const faces=[mappedPanel('bottom',slot,p.map(([x,z])=>[x,bottom,z])),mappedPanel('top',slot,[...p].reverse().map(([x,z])=>[x,top,z]))]
  p.forEach(([x,z],i)=>{const [u,w]=p[(i+1)%p.length];faces.push(mappedPanel(`wall-${i}`,edgeSlots?.[i]||slot,[[u,bottom,w],[x,bottom,z],[x,top,z],[u,top,w]]))})
  return {id,name,faces}
}
export function boxPart(id:string,name:string,x0:number,x1:number,y0:number,y1:number,z0:number,z1:number,slot='frame'):SchemaPart {
  return footprintSolid(id,name,[[x0,z0],[x1,z0],[x1,z1],[x0,z1]],y0,y1,slot)
}

/** Eight-sided tyre with a flat ground-contact tread and two real closing discs. */
export function wheelPart(label:string,sign:number,inner:number,cz:number):SchemaPart {
  const radius=10/Math.cos(Math.PI/8),x0=sign*inner,x1=sign*(inner+8)
  const ring=(x:number):Vertex[]=>Array.from({length:8},(_,i)=>{const a=Math.PI/8+i*Math.PI/4;return [x,10+radius*Math.cos(a),cz+radius*Math.sin(a)]})
  const innerRing=ring(x0),outerRing=ring(x1),faces:SchemaFace[]=[]
  faces.push(mappedPanel('inner',`wheel_inner_${label}`,sign>0?[...innerRing].reverse():innerRing),mappedPanel('outer','wheel_hub',sign>0?outerRing:[...outerRing].reverse()))
  const iv=faces[0].vertices3D
  faces[0]=panel('inner',`wheel_inner_${label}`,iv,iv.map(([,y,z])=>[1-(.5+sign*(z-cz)/20),y/20]))
  for(let i=0;i<8;i++){const j=(i+1)%8;faces.push(mappedPanel(`tread-${i}`,'wheel_tread',sign>0?[innerRing[i],innerRing[j],outerRing[j],outerRing[i]]:[innerRing[j],innerRing[i],outerRing[i],outerRing[j]]))}
  return {id:`wheel-${label}`,name:`车轮 ${label.toUpperCase()} / Wheel ${label.toUpperCase()}`,faces,unfoldRegions:[{id:'belt',name:'胎面 / Tread belt',faces:faces.filter(f=>f.id.startsWith('tread')).map(f=>({faceId:f.id}))},{id:'inner',name:'内轮片 / Inner disc',faces:[{faceId:'inner'}]},{id:'outer',name:'外轮片 / Outer disc',faces:[{faceId:'outer'}]}]}
}
export function underframe(id:string,half:number,mount:number,centres:number[],length:number):SchemaPart {
  const right:[number,number][]=[[half,-length]]
  for(const z of [...centres].sort((a,b)=>a-b))right.push([half,z-3.5],[mount,z-3.5],[mount,z+3.5],[half,z+3.5])
  right.push([half,length])
  const foot=[...right,...[...right].reverse().map(([x,z])=>[-x,z] as [number,number])]
  const result=footprintSolid(id,'离地底架 / Raised underframe',foot,6,13)
  for(const face of result.faces) {
    const vs=face.vertices3D,x=vs[0][0],zs=vs.map(p=>p[2])
    if(vs.every(p=>p[0]===x)&&Math.abs(x)===mount){const z=(Math.min(...zs)+Math.max(...zs))/2;face.slotName=`wheel_mount_${z>0?'f':'r'}${x<0?'l':'r'}`}
  }
  return result
}
export function wheelArchProfile(length:number,centres:number[]):[number,number][] {
  const p:[number,number][]=[[-length/2,13]]
  for(const z of [...centres].sort((a,b)=>a-b))p.push([z-13,13],[z-10,19],[z,23],[z+10,19],[z+13,13])
  p.push([length/2,13]);return p
}
export function translated(part:SchemaPart,dy:number):SchemaPart {
  return {...part,faces:part.faces.map(f=>({...f,vertices3D:f.vertices3D.map(([x,y,z])=>[x,y+dy,z])}))}
}
export function singleTransport(schema:PapercraftModelSchema,id:string,theme:string):TrainModelConsist {
  return {id,name:schema.name,nameEn:schema.nameEn,category:schema.category,difficulty:schema.difficulty,recommendedAge:schema.recommendedAge,estimatedTimePerCar:schema.estimatedTime,description:schema.description,descriptionEn:schema.descriptionEn,defaultThemeId:theme,assembly:{type:'single',allowConsistCount:false,defaultMiddleCarCount:0,maxMiddleCars:0},carDefinitions:{head:{type:'head',name:schema.name,nameEn:schema.nameEn,description:schema.description,descriptionEn:schema.descriptionEn,schema}}}
}
