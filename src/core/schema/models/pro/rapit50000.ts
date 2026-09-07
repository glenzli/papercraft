import type { PapercraftModelSchema } from '../../papercraftSchema'
import type { TrainModelConsist } from '../../consistSchema'
import { buildFacetedTrainBody, roofEquipment, type ProfileRow } from './facetedTrainBody'

// Reference: https://www.nankai.co.jp/traffic/express/rapit.html
const section=(z:number):ProfileRow[]=>[
  {halfWidth:10,y:0,z},{halfWidth:14,y:5,z},{halfWidth:14,y:18,z},
  {halfWidth:13,y:25,z},{halfWidth:10,y:31,z},{halfWidth:5,y:36,z}
]
const cab=section(55).map((p,i)=>({...p,y:p.y+(i>=3?2:0)}))
const nose:ProfileRow[]=[
  {halfWidth:10,y:0,z:94},{halfWidth:13,y:5,z:93},{halfWidth:13,y:17,z:87},
  {halfWidth:12,y:27,z:77},{halfWidth:10,y:31,z:67},{halfWidth:5,y:38,z:60}
]
function schema(head:boolean):PapercraftModelSchema {
  const id=`rapit-50000-pro-${head?'head':'middle'}`
  return {
    version:'2.0',id,name:head?'Rapi:t 50000 精细版先头车':'Rapi:t 50000 精细版中间车',
    nameEn:head?'Rapi:t 50000 Pro Head Car':'Rapi:t 50000 Pro Middle Car',category:'shinkansen',difficulty:'hard',
    recommendedAge:'12+',estimatedTime:head?'50–70 分钟':'30–40 分钟',
    description:'圆拱车体、隆起驾驶室与弯曲前脸的分面纸模；舷窗采用椭圆形贴图。',
    descriptionEn:'Faceted paper model with an arched body, domed cab, bowed nose and oval portholes.',
    dimensions:{length:head?184:180,width:28,height:head?38:36},
    parts:[buildFacetedTrainBody({id:`${id}-body`,name:'Rapi:t 50000 车体 / Body',
      rear:section(-90),bodyFront:section(head?42:90),
      ...(head?{cab,nose,noseBow:[0,2.5,6,5,2.5,0],frontRegions:['front-lower','front-lower','front-upper','front-upper','front-brow']}:{}),
      length:head?184:180,width:28,height:head?38:36})],
    accessories:[roofEquipment(`${id}-ac`,-25,36)]
  }
}
export const rapit50000ProHead=schema(true)
export const rapit50000ProMiddle=schema(false)
export const rapit50000ProConsist:TrainModelConsist={
  id:'rapit-50000-pro-consist',name:"南海 Rapi:t 50000系 · 精细版",nameEn:"Nankai Rapi:t 50000 · Detailed",
  category:'shinkansen',difficulty:'hard',recommendedAge:'12+',estimatedTimePerCar:'50–70 分钟',
  description:"大舷窗、圆拱车体与中央凸起的前鼻，俗称“黑武士”。",
  descriptionEn:"Large portholes, arched body and a projecting central nose ridge.",
  defaultThemeId:'nankai-rapit',assembly:{type:'consist',allowConsistCount:true,defaultMiddleCarCount:1,maxMiddleCars:6},
  carDefinitions:{
    head:{type:'head',name:'50000 系先头车',nameEn:'50000 Head',description:'圆拱驾驶室与前脸分片',descriptionEn:'Domed cab and nose panels',schema:rapit50000ProHead},
    middle:{type:'middle',name:'50000 系中间车',nameEn:'50000 Middle',description:'椭圆舷窗圆拱车体',descriptionEn:'Arched coach with oval portholes',schema:rapit50000ProMiddle},
    tail:{type:'tail',name:'50000 系尾车',nameEn:'50000 Tail',description:'反向先头车',descriptionEn:'Reversed driving car',schema:rapit50000ProHead}
  }
}
