import type { SchemaAccessory, SchemaFace, PapercraftModelSchema } from '../papercraftSchema'

/** Flexible paper joint, not a pin bearing: six side pleats and a narrow underside strap.
 * 24 mm installed gap, 36 mm side developed length, 30 mm underside developed length.
 * End flanges are part of the sheet; topology generates their folds from the installed pose.
 */
export const ARTICULATED_GAP_MM=24
export const ARTICULATED_TRIAL_ANGLE_DEG=15
export function articulatedJointAccessories(frontLength:number):SchemaAccessory[] {
  const frontZ=-frontLength/2,rearZ=frontZ-ARTICULATED_GAP_MM
  const quad=(id:string,slot:string,vertices3D:[number,number,number][],u:number,length:number,total:number,height:number):SchemaFace=>({
    id,name:id,slotName:slot,vertices3D,vertices2D:[[u,0],[u+length,0],[u+length,height],[u,height]],uvCoords:[[u/total,0],[(u+length)/total,0],[(u+length)/total,1],[u/total,1]],indices:[0,1,2,0,2,3]
  })
  const sides=[-1,1].map(sign=>{
    const faces:SchemaFace[]=[],height=38,total=54
    const segment=(id:string,slot:string,a:[number,number],b:[number,number],u:number,length:number)=>faces.push(quad(id,slot,[[a[0],3,a[1]],[b[0],3,b[1]],[b[0],41,b[1]],[a[0],41,a[1]]],u,length,total,height))
    segment('front-mount','joint_front',[sign*7,frontZ],[sign*16,frontZ],0,9)
    for(let i=0;i<6;i++) {
      const x=(n:number)=>sign*(16+(n%2)*Math.sqrt(20))
      segment(`pleat-${i+1}`,'joint_pleats',[x(i),frontZ-4*i],[x(i+1),frontZ-4*(i+1)],9+6*i,6)
    }
    segment('rear-mount','joint_rear',[sign*16,rearZ],[sign*7,rearZ],45,9)
    // Open sheets cannot be oriented by closed volume; explicitly print their outer side.
    if(sign<0)for(const face of faces){face.indices=[0,2,1,0,3,2];face.uvCoords=face.uvCoords.map(([u,v])=>[u,1-v])}
    return {id:`bus-joint-${sign<0?'left':'right'}`,name:sign<0?'左折棚（两端粘贴）/ Left bellows':'右折棚（两端粘贴）/ Right bellows',slotName:'joint_pleats',position3D:[0,0,0] as [number,number,number],vertices3D:[],uvCoords:[],indices:[],faces}
  })
  const faces:SchemaFace[]=[],total=50
  const segment=(id:string,slot:string,a:[number,number],b:[number,number],u:number,length:number)=>faces.push(quad(id,slot,[[-6,a[0],a[1]],[-6,b[0],b[1]],[6,b[0],b[1]],[6,a[0],a[1]]],u,length,total,12))
  segment('front-mount','joint_strap_front',[0,frontZ+10],[0,frontZ],0,10)
  for(let i=0;i<6;i++)segment(`pleat-${i+1}`,'joint_strap',[-(i%2)*3,frontZ-4*i],[-((i+1)%2)*3,frontZ-4*(i+1)],10+5*i,5)
  segment('rear-mount','joint_strap_rear',[0,rearZ],[0,rearZ-10],40,10)
  return [...sides,{id:'bus-joint-strap',name:'底部柔性连接 / Flexible underside strap',slotName:'joint_strap',position3D:[0,0,0],vertices3D:[],uvCoords:[],indices:[],faces}]
}
export function withArticulatedJoint(schema:PapercraftModelSchema):PapercraftModelSchema {
  return {...schema,accessories:[...(schema.accessories||[]),...articulatedJointAccessories(schema.dimensions.length)]}
}
