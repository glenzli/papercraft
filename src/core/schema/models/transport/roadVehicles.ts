import type { TrainModelConsist } from '../../consistSchema'
import type { PapercraftModelSchema } from '../../papercraftSchema'
import { panel, profilePrism } from './paperShapes'

export const compactCarSchema:PapercraftModelSchema={
  version:'2.0',id:'compact-hatchback',name:'城市两厢车',nameEn:'City hatchback',category:'vehicle',difficulty:'easy',recommendedAge:'10+',estimatedTime:'25–35 分钟',
  description:'斜风挡、短车尾的一体折面车壳。轮胎为侧面印刷图案。',descriptionEn:'One faceted shell with a raked windshield and short tail. Wheels are printed artwork.',
  dimensions:{length:110,width:42,height:38},
  parts:[profilePrism('hatchback-body','两厢车壳 / Hatchback shell',21,[[-55,0],[55,0],[55,18],[32,23],[15,38],[-28,38],[-55,24]],['bottom','front','hood','windshield','roof','rear_window','back'])],
  assemblySteps:[
    {text:'先压折风挡、车顶与引擎盖，再按编号粘合左右侧墙。轮胎印在侧墙上，无转轴。',textEn:'Score windshield, roof and hood first, then join the side walls by seam number. Wheels are printed; there are no axles.'},
    {text:'保留底板最后闭合，便于从内侧压实车头和车尾粘合翼。',textEn:'Close the floor last so you can press the nose and rear glue tabs from inside.'}
  ]
}

export const pickupSchema:PapercraftModelSchema={
  version:'2.0',id:'utility-pickup',name:'开放货斗皮卡',nameEn:'Open-bed pickup',category:'vehicle',difficulty:'medium',recommendedAge:'12+',estimatedTime:'40–55 分钟',
  description:'独立驾驶室与真正开放的折纸货斗，安装在封闭底盘上。',descriptionEn:'Separate cab and genuinely open cargo bed mounted on a closed chassis.',
  dimensions:{length:132,width:48,height:44},
  parts:[
    profilePrism('pickup-chassis','底盘 / Chassis',24,[[-66,0],[66,0],[66,14],[-66,14]],['bottom','front','pickup_deck','back'],{minZ:-66,maxZ:66,minY:0,maxY:44}),
    profilePrism('pickup-cab','驾驶室 / Cab',24,[[-15,14],[66,14],[66,24],[42,24],[24,44],[-15,44]],['bottom','front','hood','windshield','roof','cab_back'],{minZ:-66,maxZ:66,minY:0,maxY:44}),
    {id:'pickup-bed',name:'开放货斗 / Open cargo bed',isAccessory:true,faces:[
      panel('floor','bed_floor',[[-24,14,-66],[24,14,-66],[24,14,-15],[-24,14,-15]],[[0,0],[1,0],[1,1],[0,1]]),
      panel('left','bed_side',[[-24,14,-15],[-24,14,-66],[-24,30,-66],[-24,30,-15]],[[0,0],[1,0],[1,1],[0,1]]),
      panel('right','bed_side',[[24,14,-66],[24,14,-15],[24,30,-15],[24,30,-66]],[[0,0],[1,0],[1,1],[0,1]]),
      panel('rear','bed_side',[[-24,14,-66],[24,14,-66],[24,30,-66],[-24,30,-66]],[[0,0],[1,0],[1,1],[0,1]]),
      panel('front','bed_side',[[24,14,-15],[-24,14,-15],[-24,30,-15],[24,30,-15]],[[0,0],[1,0],[1,1],[0,1]])
    ]}
  ],
  assemblySteps:[
    {text:'分别闭合底盘与驾驶室，驾驶室底面粘在底盘标注 CAB 的前部（车头 +Z）。',textEn:'Close chassis and cab separately. Glue the cab floor to the forward CAB area on the chassis (+Z nose).'},
    {text:'货斗四壁沿底板折起，图案朝内，按同号接缝粘合角部，顶部保持开放。外侧为白色纸背，可自行上色。',textEn:'Fold bed walls up with artwork inside and join numbered corners. Leave the top open. The outside is the white paper back; color it by hand if desired.'},
    {text:'货斗底面粘在底盘 BED 区，与驾驶室后墙对齐。轮胎为印刷图案。',textEn:'Glue the bed floor onto BED, flush with the cab rear wall. Wheels are printed artwork.'}
  ]
}

function single(schema:PapercraftModelSchema,id:string,theme:string):TrainModelConsist {
  return {id,name:schema.name,nameEn:schema.nameEn,category:'vehicle',difficulty:schema.difficulty,recommendedAge:schema.recommendedAge,estimatedTimePerCar:schema.estimatedTime,description:schema.description,descriptionEn:schema.descriptionEn,defaultThemeId:theme,assembly:{type:'single',allowConsistCount:false,defaultMiddleCarCount:0,maxMiddleCars:0},carDefinitions:{head:{type:'head',name:schema.name,nameEn:schema.nameEn,description:schema.description,descriptionEn:schema.descriptionEn,schema}}}
}
export const compactCarConsist=single(compactCarSchema,'compact-hatchback-consist','hatchback-coral')
export const pickupConsist=single(pickupSchema,'utility-pickup-consist','pickup-forest')
