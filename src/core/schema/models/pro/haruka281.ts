import type { PapercraftModelSchema } from '../../papercraftSchema'
import type { TrainModelConsist } from '../../consistSchema'
import { buildFacetedTrainBody, roofEquipment, type ProfileRow } from './facetedTrainBody'

// Paper dimensions are an interpretation of the reference silhouette, not a certified scale drawing.
// Reference: https://www.jr-odekake.net/railroad/train/haruka/
const section=(z:number):ProfileRow[]=>[
  {halfWidth:10,y:0,z},{halfWidth:14,y:5,z},{halfWidth:14,y:24,z},
  {halfWidth:11,y:31,z},{halfWidth:6,y:36,z}
]
const cab=section(61).map((p,i)=>({...p,y:p.y+(i>=3?1:0)}))
const nose:ProfileRow[]=[
  {halfWidth:10,y:0,z:90},{halfWidth:13.5,y:5,z:94},{halfWidth:13.5,y:24,z:94},
  {halfWidth:11,y:31,z:83},{halfWidth:6,y:37,z:76}
]

function schema(head:boolean):PapercraftModelSchema {
  const id=`haruka-281-pro-${head?'head':'middle'}`
  return {
    version:'2.0',id,name:head?'Haruka 281 精细版先头车':'Haruka 281 精细版中间车',
    nameEn:head?'Haruka 281 Pro Head Car':'Haruka 281 Pro Middle Car',category:'shinkansen',difficulty:'hard',
    recommendedAge:'12+',estimatedTime:head?'45–60 分钟':'25–35 分钟',
    description:'圆肩车体、抬高驾驶室与后倾风挡的折面纸模。按编号先拼车头，再与车体闭合。',
    descriptionEn:'Faceted paper body with rounded shoulders, raised cab and raked windshield. Assemble the nose panels before closing the body.',
    dimensions:{length:head?184:180,width:28,height:head?37:36},
    parts:[buildFacetedTrainBody({id:`${id}-body`,name:'Haruka 281 车体 / Body',
      rear:section(-90),bodyFront:section(head?48:90),...(head?{cab,nose}:{}),
      length:head?184:180,width:28,height:head?37:36})],
    accessories:[roofEquipment(`${id}-ac`,-25,36)]
  }
}
export const haruka281ProHead=schema(true)
export const haruka281ProMiddle=schema(false)
export const haruka281ProConsist:TrainModelConsist={
  id:'haruka-281-pro-consist',name:"Haruka 281系 · 精细版",nameEn:"Haruka 281 · Detailed",
  category:'shinkansen',difficulty:'hard',recommendedAge:'12+',estimatedTimePerCar:'45–60 分钟',
  description:"圆肩车体、抬高驾驶室与后倾风挡，可选白蓝或樱花涂装。",
  descriptionEn:"Faceted shoulders, raised cab and raked windshield; classic or Sakura liveries.",
  defaultThemeId:'haruka-classic-jr',assembly:{type:'consist',allowConsistCount:true,defaultMiddleCarCount:1,maxMiddleCars:6},
  carDefinitions:{
    head:{type:'head',name:'281 系先头车',nameEn:'281 Head',description:'带高位驾驶室的先头车',descriptionEn:'Raised driving cab',schema:haruka281ProHead},
    middle:{type:'middle',name:'281 系中间车',nameEn:'281 Middle',description:'圆肩客车体',descriptionEn:'Faceted coach body',schema:haruka281ProMiddle},
    tail:{type:'tail',name:'281 系尾车',nameEn:'281 Tail',description:'反向先头车',descriptionEn:'Reversed driving car',schema:haruka281ProHead}
  }
}
