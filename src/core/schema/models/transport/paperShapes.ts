import { ShapeUtils, Vector2 } from 'three'
import type { SchemaFace, SchemaPart } from '../../papercraftSchema'
export type Vertex = [number, number, number]

/** Planar polygon with an explicit artwork projection; physical units are millimetres. */
export function panel(id:string,slotName:string,vertices3D:Vertex[],uvCoords:[number,number][],name=id):SchemaFace {
  const a=vertices3D[0],b=vertices3D[1],c=vertices3D[2]
  const ab=b.map((v,i)=>v-a[i]),ac=c.map((v,i)=>v-a[i])
  const n=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]]
  const axis=n.map(Math.abs).indexOf(Math.max(...n.map(Math.abs)))
  const points=vertices3D.map(v=>new Vector2(v[(axis+1)%3],v[(axis+2)%3]))
  return {id,name,slotName,vertices3D,vertices2D:[],uvCoords:uvCoords.map(([u,v])=>[1-u,v]),indices:ShapeUtils.triangulateShape(points,[]).flat()}
}

/** Closed extruded silhouette. The two side UVs have opposite longitudinal directions. */
export function profilePrism(id:string,name:string,halfWidth:number,profile:[number,number][],slots?:string[],frame?:{minZ:number;maxZ:number;minY:number;maxY:number}):SchemaPart {
  const minZ=frame?.minZ??Math.min(...profile.map(p=>p[0])),maxZ=frame?.maxZ??Math.max(...profile.map(p=>p[0]))
  const minY=frame?.minY??Math.min(...profile.map(p=>p[1])),maxY=frame?.maxY??Math.max(...profile.map(p=>p[1]))
  const sides=[-1,1].map(sign=>panel(sign<0?'left':'right','side_'+(sign<0?'left':'right'),profile.map(([z,y]):Vertex=>[sign*halfWidth,y,z]),profile.map(([z,y]):[number,number]=>[sign<0?(maxZ-z)/(maxZ-minZ):(z-minZ)/(maxZ-minZ),(y-minY)/(maxY-minY)]),name))
  const edges=profile.map(([z,y],i)=>{
    const [q,r]=profile[(i+1)%profile.length],slot=slots?.[i]||(y===minY&&r===minY?'bottom':y===maxY&&r===maxY?'roof':q===z?(z===maxZ?'front':'back'):'roof')
    return panel(`edge-${i}`,slot,[[-halfWidth,y,z],[halfWidth,y,z],[halfWidth,r,q],[-halfWidth,r,q]],[[1,0],[0,0],[0,1],[1,1]],name)
  })
  return {id,name,faces:[...sides,...edges]}
}

/** A sheet wing and its real 6 mm mounting flange share a scored root edge. */
export function mountedWing(id:string,name:string,sign:number,span:number,rootFront:number,rootRear:number,tipFront:number,tipRear:number):SchemaPart {
  const root=12,y=15,height=6
  const points:Vertex[]=[[sign*root,y,rootFront],[sign*span,y,tipFront],[sign*span,y,tipRear],[sign*root,y,rootRear]]
  return {id,name,isAccessory:true,faces:[
    panel('wing','wing',points,points.map(([x,,z]):[number,number]=>[(x+75)/150,(z+80)/160]),name),
    panel('mount','wing_mount',[[sign*root,y,rootRear],[sign*root,y,rootFront],[sign*root,y+height,rootFront],[sign*root,y+height,rootRear]],(sign<0?[[1,0],[0,0],[0,1],[1,1]]:[[0,0],[1,0],[1,1],[0,1]]),'安装翼 / Mounting flange')
  ],unfoldRegions:undefined}
}
