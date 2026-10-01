import type { PapercraftModelSchema, SchemaPart } from '../../papercraftSchema'
import { travelPlaneSchema } from './travelPlane'
import { profilePrism } from './paperShapes'
import { mappedPanel, translated, singleTransport } from './physicalParts'

function floatStrut(sign:number,z:number):SchemaPart {
  const bx=sign*20,tx=sign*3,b0=bx-2.5,b1=bx+2.5,t0=tx-2.5,t1=tx+2.5,z0=z-3,z1=z+3
  return {id:`float-${sign<0?'left':'right'}-strut-${z>0?'front':'rear'}`,name:'浮筒支撑 / Float strut',faces:[
    mappedPanel('bottom','air_mount',[[b0,8,z0],[b1,8,z0],[b1,8,z1],[b0,8,z1]]),
    mappedPanel('top','air_mount',[[t0,20,z1],[t1,20,z1],[t1,20,z0],[t0,20,z0]]),
    mappedPanel('left','float_strut',[[b0,8,z0],[b0,8,z1],[t0,20,z1],[t0,20,z0]]),
    mappedPanel('right','float_strut',[[b1,8,z1],[b1,8,z0],[t1,20,z0],[t1,20,z1]]),
    mappedPanel('front','float_strut',[[b0,8,z1],[b1,8,z1],[t1,20,z1],[t0,20,z1]]),
    mappedPanel('rear','float_strut',[[b1,8,z0],[b0,8,z0],[t0,20,z0],[t1,20,z0]])
  ]}
}
const floats=[-1,1].map(sign=>{const p=profilePrism(`float-${sign<0?'left':'right'}`,'浮筒 / Pontoon',7,[[-60,2],[-50,0],[40,0],[55,2],[55,8],[-60,8]],['float_bottom','float_bottom','float_nose','float_nose','float_roof','float_tail']);return {...p,faces:p.faces.map(f=>({...f,slotName:f.slotName.startsWith('side')?'float_side':f.slotName,vertices3D:f.vertices3D.map(([x,y,z])=>[x+sign*20,y,z] as [number,number,number])}))}})
export const floatplaneSchema:PapercraftModelSchema={
  ...travelPlaneSchema,id:'twin-float-seaplane',name:'双浮筒水上飞机',nameEn:'Twin-float seaplane',difficulty:'hard',recommendedAge:'14+',estimatedTime:'90–120 分钟',
  description:'升高的旅行机身、双实体浮筒与四根斜支撑，带长双叶螺旋桨。',descriptionEn:'Raised touring fuselage with two real pontoons, four diagonal struts and a long two-blade propeller.',dimensions:{length:166,width:150,height:67},
  parts:[...travelPlaneSchema.parts.map(p=>translated(p,17)),...floats,...[-1,1].flatMap(sign=>[-20,20].map(z=>floatStrut(sign,z)))],
  assemblySteps:[
    ...travelPlaneSchema.assemblySteps!.slice(0,3),
    {text:'分别闭合两个浮筒，平底朝下、翘头朝车头 +Z。四根斜支撑下端 5×6 mm 面粘浮筒顶，上端同尺寸面贴机腹平底：前后距中心各 20 mm，左右距中心各 3 mm。先试合再粘接，保持双筒平行。',textEn:'Close both pontoons with flat bottoms down and raised bows forward (+Z). Glue each strut’s 5×6 mm bottom to a pontoon roof, and its matching top to the flat belly: 20 mm fore/aft and 3 mm left/right of centre. Dry-fit and keep pontoons parallel.'},
    {text:'此纸模供桌面展示，不防水、不保证漂浮，也不能飞行。使用 200–220 g/m² 纸，翼面和支撑胶合强度需要实物试装。',textEn:'This desktop display model is not waterproof or certified to float, and cannot fly. Use 200–220 gsm stock; test wing and strut strength in a physical build.'}
  ]
}
export const floatplaneConsist=singleTransport(floatplaneSchema,'twin-float-seaplane-consist','float-retro')
