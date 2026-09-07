import type { SchemaAccessory, SchemaFace, SchemaPart, SchemaUnfoldRegion } from '../../papercraftSchema'

export type Vertex = [number, number, number]
/** One row of a symmetric cross-section, ordered from the floor to the crown. */
export interface ProfileRow { halfWidth:number; y:number; z:number }
export interface BodyProfile {
  id:string
  name:string
  rear:ProfileRow[]
  bodyFront:ProfileRow[]
  cab?:ProfileRow[]
  nose?:ProfileRow[]
  /** Extra forward bow of the nose centre at each height; zero at the two ends. */
  noseBow?:number[]
  frontRegions?:string[]
  length:number
  width:number
  height:number
}

const contour=(rows:ProfileRow[]):Vertex[]=>[
  ...rows.map(({halfWidth,y,z}):Vertex=>[-halfWidth,y,z]),
  ...rows.slice().reverse().map(({halfWidth,y,z}):Vertex=>[halfWidth,y,z])
]

/** Authored longitudinal sections become one closed surface with corner-based planar UVs.
 * Regions are construction boundaries, never disconnected decorative 3D meshes. */
export function buildFacetedTrainBody(profile:BodyProfile):SchemaPart {
  const {id,name,length,width,height}=profile
  const rows=profile.rear.length,last=rows-1
  const sections=[profile.rear,profile.bodyFront,...(profile.cab?[profile.cab]:[]),...(profile.nose?[profile.nose]:[])]
  if(sections.some(s=>s.length!==rows||s.some((p,i)=>p.halfWidth<=0||(i>0&&p.y<=s[i-1].y))))throw new Error(`${id}: invalid train cross-section`)
  const minZ=Math.min(...sections.flatMap(s=>s.map(p=>p.z))),maxZ=minZ+length
  const faces:SchemaFace[]=[],regions=new Map<string,SchemaUnfoldRegion>()
  const regionNames:Record<string,string>={
    body:'车体与后壁 / Body and rear',
    'cab-roof':'驾驶室顶壳 / Cab roof',
    'cab-left':'驾驶室左侧 / Cab left',
    'cab-right':'驾驶室右侧 / Cab right',
    'collar-roof':'驾驶室后顶 / Cab rear roof',
    'collar-left':'驾驶室左后侧 / Cab rear left',
    'collar-right':'驾驶室右后侧 / Cab rear right',
    front:profile.nose?'车头前面 / Nose face':'车厢前壁 / Front wall',
    'front-upper':'前额与风挡 / Brow and windshield',
    'front-lower':'前鼻与下裙 / Nose and skirt',
    'front-brow':'驾驶室前额 / Cab brow',
  }
  const add=(faceId:string,slotName:string,vertices:Vertex[],indices:number[],region:string)=>{
    const uvCoords=vertices.map(([x,y,z]):[number,number]=>
      slotName.startsWith('side_')?[(maxZ-z)/length,y/height]:
      slotName==='roof'||slotName==='bottom'?[(x+width/2)/width,(maxZ-z)/length]:
      [(x+width/2)/width,y/height])
    faces.push({id:faceId,name:regionNames[region]||region,slotName,vertices3D:vertices,vertices2D:[],uvCoords,indices})
    if(!regions.has(region))regions.set(region,{id:region,name:regionNames[region]||region,faces:[]})
    regions.get(region)!.faces.push({faceId})
  }
  for(let section=0;section<sections.length-1;section++) {
    const a=contour(sections[section]),b=contour(sections[section+1])
    for(let edge=0;edge<a.length;edge++) {
      const next=(edge+1)%a.length,isBottom=edge===a.length-1
      const isRoof=edge>=last-1&&edge<=last+1
      const side=edge<last?'left':'right'
      const slot=isBottom?'bottom':edge===last?'roof':`side_${side}`
      const sectionName=section===1?'collar':'cab'
      const region=section===0||isBottom?'body':isRoof?`${sectionName}-roof`:`${sectionName}-${side}`
      // Mirrored diagonals retain the same physical facets on the two sides.
      const indices=edge<last?[0,1,2,0,2,3]:[0,1,3,1,2,3]
      add(`shell-${section}-${edge}`,slot,[a[edge],a[next],b[next],b[edge]],indices,region)
    }
  }
  const rear=contour(profile.rear)
  const rearCentre:Vertex=[0,height/2,profile.rear[0].z]
  add('back','back',[...rear,rearCentre],rear.flatMap((_,i)=>[rear.length,i,(i+1)%rear.length]),'body')

  const front=sections[sections.length-1],bow=profile.noseBow||front.map(()=>0)
  if(bow.length!==rows||bow[0]!==0||bow[last]!==0)throw new Error(`${id}: nose centre must meet the shell at both ends`)
  for(let row=0;row<last;row++) {
    const vertices=[front[row],front[row+1]].flatMap(({halfWidth,y,z},j):Vertex[]=>[
      [-halfWidth,y,z],[0,y,z+bow[row+j]],[halfWidth,y,z]
    ])
    add(`front-${row}`,profile.nose?'front':'back',vertices,[0,1,3,1,4,3,1,2,4,2,5,4],profile.frontRegions?.[row]||'front')
  }
  const bottom=faces.filter(f=>f.slotName==='bottom')
  const zSlots=profile.nose?[minZ+12]:[minZ+12,maxZ-12]
  for(const z of zSlots) {
    const face=bottom.find(f=>Math.min(...f.vertices3D.map(p=>p[2]))<=z&&Math.max(...f.vertices3D.map(p=>p[2]))>=z)!
    face.cuts3D=[...(face.cuts3D||[]),[[-4.5,0,z],[4.5,0,z]]]
  }
  return {id,name,faces,unfoldRegions:[...regions.values()]}
}

/** A printable shallow equipment enclosure with face-local UVs. */
export function roofEquipment(id:string,z:number,roofY:number):SchemaAccessory {
  const x=7,l=17,h=5
  const face=(id:string,slotName:string,vertices3D:Vertex[]):SchemaFace=>({id,name:'车顶空调 / Roof AC',slotName,vertices3D,vertices2D:[],uvCoords:[[0,0],[1,0],[1,1],[0,1]],indices:[0,1,2,0,2,3]})
  const faces=[
    face('top','ac_unit',[[-x,h,-l],[x,h,-l],[x,h,l],[-x,h,l]]),
    face('left','ac_unit_side',[[-x,0,-l],[-x,h,-l],[-x,h,l],[-x,0,l]]),
    face('right','ac_unit_side',[[x,h,-l],[x,0,-l],[x,0,l],[x,h,l]]),
    face('rear','ac_unit_side',[[x,0,-l],[x,h,-l],[-x,h,-l],[-x,0,-l]]),
    face('front','ac_unit_side',[[-x,0,l],[-x,h,l],[x,h,l],[x,0,l]])
  ]
  return {id,name:'车顶空调 / Roof AC',slotName:'ac_unit',position3D:[0,roofY,z],vertices3D:[],indices:[],uvCoords:[],faces}
}
