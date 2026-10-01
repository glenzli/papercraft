import { ShapeUtils, Vector2 } from 'three'
import type { SchemaAccessory, SchemaFace } from '../papercraftSchema'

// The cutting outline is also the actual 3D surface; there is no substitute cuboid.
function drawbarFace(number:number,positionZ:number):SchemaFace {
  const outline:[number,number][]=[[-9,-14],[9,-14],[9,-8],[3,-8],[3,8],[9,8],[9,14],[-9,14],[-9,8],[-3,8],[-3,-8],[-9,-8]]
  return {id:`coupler_tongue_${number}`,name:`工字活动牵引挂钩 (${number})`,slotName:'coupler',
    vertices3D:outline.map(([x,z])=>[x,1,z+positionZ]),vertices2D:outline.map(([x,z])=>[x+10+(number-1)*22,z+16]),
    uvCoords:outline.map(([x,z])=>[(x+9)/18,(14-z)/28]),indices:ShapeUtils.triangulateShape(outline.map(([x,y])=>new Vector2(x,y)),[]).flat()}
}
const drawbars=[drawbarFace(1,-22),drawbarFace(2,22)]
export const couplerDrawbarAccessory:SchemaAccessory={
  id:'coupler_drawbar_pair',name:'T型活动牵引挂钩 (2枚)',slotName:'coupler',position3D:[0,2,0],
  vertices3D:drawbars.flatMap(f=>f.vertices3D),uvCoords:drawbars.flatMap(f=>f.uvCoords),
  indices:drawbars.flatMap((f,i)=>f.indices.map(v=>v+i*12)),faces:drawbars,
  layout2D:{x:170,y:70,width:44,height:30}
}
