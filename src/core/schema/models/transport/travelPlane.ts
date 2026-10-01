import type { PapercraftModelSchema, SchemaFace } from '../../papercraftSchema'
import type { TrainModelConsist } from '../../consistSchema'
import { panel, mountedWing, type Vertex } from './paperShapes'

const sections=[{z:-80,w:8,y:7,h:16},{z:-50,w:12,y:3,h:24},{z:50,w:12,y:3,h:24},{z:80,w:8,y:7,h:16}]
const contours=sections.map(({z,w,y,h}):Vertex[]=>[[-w/2,y,z],[w/2,y,z],[w,y+h/4,z],[w,y+3*h/4,z],[w/2,y+h,z],[-w/2,y+h,z],[-w,y+3*h/4,z],[-w,y+h/4,z]])
const faces:SchemaFace[]=contours.slice(0,-1).flatMap((a,s)=>a.map((p,i)=>{
  const j=(i+1)%8,vs=[p,a[j],contours[s+1][j],contours[s+1][i]]
  const slot=i===0?'bottom':i===4?'roof':i<4?'side_right':'side_left'
  // Individual triangles remain planar even on the tapered loft.
  return {id:`shell-${s}-${i}`,name:'折面机身 / Fuselage',slotName:slot,vertices3D:vs,vertices2D:[],uvCoords:vs.map(([x,y,z]):[number,number]=>slot==='roof'||slot==='bottom'?[(12-x)/24,(z+80)/160]:[slot==='side_left'?(z+80)/160:(80-z)/160,(y-3)/24]),indices:[0,1,2,0,2,3]}
}))
faces.push(panel('rear','back',contours[0],contours[0].map(([x,y]):[number,number]=>[(x+8)/16,(y-7)/16])),panel('nose','front',contours[3],contours[3].map(([x,y]):[number,number]=>[(8-x)/16,(y-7)/16])))

export const travelPlaneSchema:PapercraftModelSchema={
  version:'2.0',id:'travel-propeller-plane',name:'旅行螺旋桨飞机',nameEn:'Touring propeller plane',category:'aircraft',difficulty:'medium',recommendedAge:'12+',estimatedTime:'50–70 分钟',
  description:'收尖八面机身、掠形机翼、尾翼与固定螺旋桨的展示纸模。',descriptionEn:'Tapered octagonal fuselage, swept wings, tail surfaces and a fixed propeller for display.',
  dimensions:{length:160,width:150,height:47},
  parts:[
    {id:'plane-fuselage',name:'机身 / Fuselage',faces,unfoldRegions:[{id:'shell',name:'机身壳 / Fuselage shell',faces:faces.filter(f=>f.id.startsWith('shell')).map(f=>({faceId:f.id}))},{id:'nose',name:'机头端盖 / Nose cap',faces:[{faceId:'nose'}]},{id:'rear',name:'尾部端盖 / Tail cap',faces:[{faceId:'rear'}]}]},
    mountedWing('plane-left-wing','左主翼 / Left wing',-1,75,20,-18,0,-20),
    mountedWing('plane-right-wing','右主翼 / Right wing',1,75,20,-18,0,-20),
    mountedWing('plane-left-tail','左平尾 / Left tailplane',-1,38,-28,-44,-36,-50),
    mountedWing('plane-right-tail','右平尾 / Right tailplane',1,38,-28,-44,-36,-50),
    {id:'plane-fin',name:'垂直尾翼 / Fin',isAccessory:true,faces:[
      panel('fin','fin',[[0,27,-48],[0,27,-26],[0,50,-45]],[[0,0],[1,0],[.14,1]]),
      panel('mount','fin_mount',[[0,27,-26],[0,27,-48],[5,27,-48],[5,27,-26]],[[0,0],[1,0],[1,1],[0,1]],'安装翼 / Mounting flange')
    ]},
    {id:'plane-propeller',name:'固定螺旋桨 / Fixed propeller',isAccessory:true,faces:[panel('propeller','propeller',[[-2,4,80],[2,4,80],[2,27,80],[-2,27,80]],[[0,0],[1,0],[1,1],[0,1]])]}
  ],
  assemblySteps:[
    {text:'先拼收尖机头和机尾，再闭合机身侧缝，保留底部最后粘合。',textEn:'Join tapered nose and tail first, then the fuselage side seam. Close the belly last.'},
    {text:'左右主翼根部安装翼向上折 90°，沿机身 WING 标记粘贴；左右尾翼同样沿 TAIL 标记安装。仅在安装翼上涂胶。',textEn:'Fold wing mounting flanges up 90° and glue to WING marks on the fuselage; fit tailplanes at TAIL. Apply glue only to mounting flanges.'},
    {text:'垂直尾翼安装翼折 90°，粘在机顶 FIN 区；螺旋桨中心粘在机头，不可旋转。',textEn:'Fold the fin flange 90° onto the roof FIN area. Glue the propeller centre to the nose; it is fixed.'},
    {text:'建议使用 180–220 g/m² 纸，翼面可用同形余纸从背面补强。此模型只供展示，不能作为飞行玩具。',textEn:'Use 180–220 gsm stock; reinforce wings with matching offcuts if needed. This is a display model, not a flying toy.'}
  ]
}
export const travelPlaneConsist:TrainModelConsist={
  id:'travel-propeller-plane-consist',name:travelPlaneSchema.name,nameEn:travelPlaneSchema.nameEn,category:'aircraft',difficulty:'medium',recommendedAge:'12+',estimatedTimePerCar:travelPlaneSchema.estimatedTime,
  description:travelPlaneSchema.description,descriptionEn:travelPlaneSchema.descriptionEn,defaultThemeId:'plane-sky',assembly:{type:'single',allowConsistCount:false,defaultMiddleCarCount:0,maxMiddleCars:0},
  carDefinitions:{head:{type:'head',name:travelPlaneSchema.name,nameEn:travelPlaneSchema.nameEn,description:travelPlaneSchema.description,descriptionEn:travelPlaneSchema.descriptionEn,schema:travelPlaneSchema}}
}
