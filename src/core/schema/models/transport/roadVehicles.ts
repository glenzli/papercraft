import type { PapercraftModelSchema } from '../../papercraftSchema'
import { panel, profilePrism } from './paperShapes'
import { wheelArchProfile, wheelPart, underframe, singleTransport } from './physicalParts'
const wheels=(inner:number,z:number)=>['fl','fr','rl','rr'].map(label=>wheelPart(label,label.endsWith('l')?-1:1,inner,label.startsWith('f')?z:-z))
const wheelSteps=[
  {text:'每个车轮由八片胎面与两张轮片组成。先围合胎面，再粘外轮片，内轮片最后封口。FL/FR 为前左/前右，RL/RR 为后左/后右。',textEn:'Each wheel has an eight-panel tread belt and two discs. Join the belt, fit the outer disc, then close the inner disc. FL/FR are front left/right; RL/RR are rear left/right.'},
  {text:'底架上表面只粘车壳平直底面，轮拱下方留空。将四个 7×7 mm 支臂端面粘到对应内轮片中心标记处。轮胎底部平面朝下，四轮同时落地。',textEn:'Glue the underframe top to the flat shell underside, leaving the arches open. Glue each 7×7 mm arm end to the matching inner-disc pad. Keep flat tread faces down and all four wheels on the ground.'},
  {text:'车轮是静态粘合结构，无旋转轴。使用 180–220 g/m² 纸；先试装轮拱间隙与四轮水平，胶干后再移动。',textEn:'Wheels are glued static parts without rotating axles. Use 180–220 gsm stock. Dry-fit arch clearance and four-wheel alignment, then let the glue dry before handling.'}
]
export const compactCarSchema:PapercraftModelSchema={
  version:'2.0',id:'compact-hatchback',name:'城市两厢车',nameEn:'City hatchback',category:'vehicle',difficulty:'medium',recommendedAge:'12+',estimatedTime:'55–75 分钟',
  description:'实体轮拱、离地底架与四个独立八角纸轮的折面两厢车。',descriptionEn:'Faceted hatchback with real wheel arches, raised underframe and four separate octagonal paper wheels.',dimensions:{length:110,width:50,height:42},
  parts:[profilePrism('hatchback-body','两厢车壳 / Hatchback shell',21,[...wheelArchProfile(110,[-33,33]),[55,24],[32,29],[15,42],[-28,42],[-55,29]],undefined,{minZ:-55,maxZ:55,minY:0,maxY:42}),underframe('hatchback-frame',12,17,[-33,33],48),...wheels(17,33)],
  assemblySteps:[{text:'先压折风挡、车顶与引擎盖，再按编号粘合左右侧墙。轮拱是向内折起的实体凹口，底部各平直段最后粘合。',textEn:'Score windshield, roof and hood, then join side walls by seam number. Fold the real recessed arch panels inward. Close the flat underside segments last.'},...wheelSteps]
}
export const pickupSchema:PapercraftModelSchema={
  version:'2.0',id:'utility-pickup',name:'开放货斗皮卡',nameEn:'Open-bed pickup',category:'vehicle',difficulty:'medium',recommendedAge:'12+',estimatedTime:'70–95 分钟',
  description:'开放货斗、独立驾驶室与实体轮拱，四个独立纸轮安装在离地底架支臂上。',descriptionEn:'Open cargo bed, separate cab and real wheel arches; four paper wheels attach to raised underframe arms.',dimensions:{length:132,width:56,height:54},
  parts:[
    profilePrism('pickup-chassis','轮拱底盘 / Arched chassis',24,[...wheelArchProfile(132,[-44,44]),[66,27],[-66,27]],undefined,{minZ:-66,maxZ:66,minY:0,maxY:54}),
    profilePrism('pickup-cab','驾驶室 / Cab',24,[[-15,27],[66,27],[66,34],[42,34],[24,54],[-15,54]],['bottom','front','hood','windshield','roof','cab_back'],{minZ:-66,maxZ:66,minY:0,maxY:54}),
    {id:'pickup-bed',name:'开放货斗 / Open cargo bed',isAccessory:true,faces:[
      panel('floor','bed_floor',[[-24,27,-66],[24,27,-66],[24,27,-15],[-24,27,-15]],[[0,0],[1,0],[1,1],[0,1]]),
      panel('left','bed_side',[[-24,27,-15],[-24,27,-66],[-24,42,-66],[-24,42,-15]],[[0,0],[1,0],[1,1],[0,1]]),
      panel('right','bed_side',[[24,27,-66],[24,27,-15],[24,42,-15],[24,42,-66]],[[0,0],[1,0],[1,1],[0,1]]),
      panel('rear','bed_side',[[-24,27,-66],[24,27,-66],[24,42,-66],[-24,42,-66]],[[0,0],[1,0],[1,1],[0,1]]),
      panel('front','bed_side',[[24,27,-15],[-24,27,-15],[-24,42,-15],[24,42,-15]],[[0,0],[1,0],[1,1],[0,1]])
    ]},underframe('pickup-frame',14,20,[-44,44],60),...wheels(20,44)
  ],
  assemblySteps:[
    {text:'闭合带轮拱的底盘与驾驶室。驾驶室底面粘在顶板 CAB 前部（车头 +Z），货斗底面粘在 BED 后部。轮拱上方保留 4 mm 连接带。',textEn:'Close the arched chassis and cab. Glue the cab floor to the forward CAB deck (+Z nose), and the bed to rear BED. Preserve the 4 mm web above each arch.'},
    {text:'货斗四壁沿底板折起，图案朝内，按同号接缝粘合角部，顶部保持开放。外侧为白色纸背，可自行上色。',textEn:'Fold bed walls up with artwork inside, then join numbered corners. Leave the top open. The outside is the white paper back; color it by hand if desired.'},...wheelSteps
  ]
}
export const compactCarConsist=singleTransport(compactCarSchema,'compact-hatchback-consist','hatchback-coral')
const hatchFaces=compactCarSchema.parts[0].faces
hatchFaces.slice(2,-6).forEach(f=>{f.slotName='bottom'})
;['front','hood','windshield','roof','rear_window','back'].forEach((slot,i)=>{hatchFaces[hatchFaces.length-6+i].slotName=slot})
const chassisFaces=pickupSchema.parts[0].faces
chassisFaces.slice(2,-3).forEach(f=>{f.slotName='bottom'})
chassisFaces.at(-2)!.slotName='pickup_deck'
export const pickupConsist=singleTransport(pickupSchema,'utility-pickup-consist','pickup-forest')
