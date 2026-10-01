import type { PapercraftModelSchema, SchemaFace, SchemaPart } from '../../papercraftSchema'
import { mappedPanel, boxPart, singleTransport } from './physicalParts'
import { panel, type Vertex } from './paperShapes'

export const JET_RADIUS=14,JET_ROOT=14*Math.cos(Math.PI/12),JET_BELLY=30-JET_ROOT,JET_ROOF=30+JET_ROOT
export const jetWingHeight=(x:number)=>27+(Math.abs(x)-JET_ROOT)*4.5/(98-JET_ROOT)
const ring=(z:number):Vertex[]=>Array.from({length:12},(_,i)=>{const a=Math.PI/12+i*Math.PI/6;return [14*Math.cos(a),30+14*Math.sin(a),z]})
const rear=ring(-68),front=ring(70),bodyFaces:SchemaFace[]=[]
for(let i=0;i<12;i++) {
  const j=(i+1)%12
  const left=i>=3&&i<=7,vs=[rear[i],rear[j],front[j],front[i]]
  bodyFaces.push(i===2||i===8?panel(`body-${i}`,i===2?'jet_roof':'jet_belly',vs,vs.map(([x,,z])=>[1-(i===2?(14*Math.sin(Math.PI/12)-x)/(28*Math.sin(Math.PI/12)):(x+14*Math.sin(Math.PI/12))/(28*Math.sin(Math.PI/12))),(z+68)/138])):panel(`body-${i}`,left?'jet_left':'jet_right',vs,vs.map(([,y,z])=>[1-(left?(z+68)/138:(70-z)/138),(y-16)/28])))
  bodyFaces.push(mappedPanel(`nose-${i}`,i>=1&&i<=3?'jet_cockpit':'jet_nose',[front[i],front[j],[0,30,110]]))
  bodyFaces.push(mappedPanel(`tail-${i}`,'jet_tail',[rear[j],rear[i],[0,30,-110]]))
}
// Rectangular belly and roof get accurate physical mounting artwork.
bodyFaces.find(f=>f.id==='body-2')!.slotName='jet_roof'
bodyFaces.find(f=>f.id==='body-8')!.slotName='jet_belly'

function wing(sign:number,tail=false):SchemaPart {
  const span=tail?43:98,rf=tail?-42:40,rr=tail?-64:-20,tf=tail?-65:-8,tr=tail?-79:-35,ty=tail?29:31.5
  let v:Vertex[]=[[sign*JET_ROOT,27,rf],[sign*span,ty,tf],[sign*span,ty,tr],[sign*JET_ROOT,27,rr]]
  if(sign<0)v=v.reverse()
  const mount:Vertex[]=[[sign*JET_ROOT,27,rr],[sign*JET_ROOT,27,rf],[sign*JET_ROOT,33,rf],[sign*JET_ROOT,33,rr]]
  const faces=[mappedPanel('sheet',tail?'jet_tailplane':'jet_wing',v),mappedPanel('mount','air_mount',sign>0?mount.reverse():mount)]
  if(!tail){const tip:Vertex[]=[[sign*span,ty,tr],[sign*span,ty,tf],[sign*span,ty+12,tf-3],[sign*span,ty+12,tr-3]];faces.push(mappedPanel('winglet','jet_winglet',sign<0?tip.reverse():tip))}
  return {id:`jet-${sign<0?'left':'right'}-${tail?'tailplane':'wing'}`,name:`${sign<0?'左':'右'}${tail?'平尾':'主翼'} / ${sign<0?'Left':'Right'} ${tail?'tailplane':'wing'}`,isAccessory:true,faces}
}
function engine(sign:number):SchemaPart {
  const r=8/Math.cos(Math.PI/8),cx=sign*40
  const contour=(z:number):Vertex[]=>Array.from({length:8},(_,i)=>{const a=Math.PI/8+i*Math.PI/4;return [cx+r*Math.cos(a),15+r*Math.sin(a),z]})
  const a=contour(4),b=contour(36),faces=[mappedPanel('exhaust','jet_exhaust',[...a].reverse()),mappedPanel('intake','jet_intake',b)]
  for(let i=0;i<8;i++){const j=(i+1)%8;faces.push(mappedPanel(`pod-${i}`,'jet_engine',[a[i],a[j],b[j],b[i]]))}
  return {id:`jet-${sign<0?'left':'right'}-engine`,name:`${sign<0?'左':'右'}发动机 / ${sign<0?'Left':'Right'} engine`,faces}
}
function pylon(sign:number):SchemaPart {
  const x0=sign*40-2.5,x1=sign*40+2.5,z0=10,z1=22,b=23,t0=jetWingHeight(x0),t1=jetWingHeight(x1)
  const faces=[
    mappedPanel('bottom','air_mount',[[x0,b,z0],[x1,b,z0],[x1,b,z1],[x0,b,z1]]),
    mappedPanel('top','air_mount',[[x0,t0,z1],[x1,t1,z1],[x1,t1,z0],[x0,t0,z0]]),
    mappedPanel('left','jet_pylon',[[x0,b,z0],[x0,b,z1],[x0,t0,z1],[x0,t0,z0]]),
    mappedPanel('right','jet_pylon',[[x1,b,z1],[x1,b,z0],[x1,t1,z0],[x1,t1,z1]]),
    mappedPanel('front','jet_pylon',[[x0,b,z1],[x1,b,z1],[x1,t1,z1],[x0,t0,z1]]),
    mappedPanel('back','jet_pylon',[[x1,b,z0],[x0,b,z0],[x0,t0,z0],[x1,t1,z0]])
  ]
  return {id:`jet-${sign<0?'left':'right'}-pylon`,name:'发动机吊架 / Engine pylon',faces}
}
const standBase=boxPart('jet-stand-base','展示底座 / Stand base',-35,35,0,5,-35,35,'stand')
const top=standBase.faces.find(f=>f.id==='top')!.vertices3D
standBase.faces[1]=panel('top','stand_top',top,top.map(([x,,z])=>[1-(x+35)/70,(35-z)/70]))
export const jetAirlinerSchema:PapercraftModelSchema={
  version:'2.0',id:'twin-engine-airliner',name:'双发窄体喷气客机',nameEn:'Twin-engine jet airliner',category:'aircraft',difficulty:'hard',recommendedAge:'14+',estimatedTime:'100–140 分钟',
  description:'十二面圆筒机身、后掠翼与翼梢、真实翼下双发动机及吊架，配稳定展示底座。',descriptionEn:'Twelve-sided round fuselage, swept wings and winglets, two real underwing engine pods and pylons, with a stable display stand.',dimensions:{length:220,width:196,height:68},
  parts:[
    {id:'jet-fuselage',name:'圆筒机身 / Round fuselage',faces:bodyFaces,unfoldRegions:['body','nose','tail'].map(id=>({id,name:id==='body'?'机身 / Fuselage':id==='nose'?'机头 / Nose':'机尾 / Tail',faces:bodyFaces.filter(f=>f.id.startsWith(id)).map(f=>({faceId:f.id}))}))},
    wing(-1),wing(1),wing(-1,true),wing(1,true),
    {id:'jet-fin',name:'垂直尾翼 / Fin',isAccessory:true,faces:[mappedPanel('fin','jet_fin',[[0,JET_ROOF,-66],[0,JET_ROOF,-42],[0,68,-62]]),mappedPanel('mount','air_mount',[[0,JET_ROOF,-42],[0,JET_ROOF,-66],[3,JET_ROOF,-66],[3,JET_ROOF,-42]])]},
    engine(-1),engine(1),pylon(-1),pylon(1),
    standBase,boxPart('jet-stand-post','支柱 / Stand post',-3,3,5,JET_BELLY,-12,12,'stand_post')
  ],
  assemblySteps:[
    {text:'先卷合十二面机身段，再分别拼合机头和机尾锥，按同号接缝连接。不要把两个锥尖剪平；先试合后再闭合最后一条缝。',textEn:'Close the twelve-panel barrel, then assemble nose and tail cones and match seam numbers. Keep cone tips intact. Dry-fit before closing the final seam.'},
    {text:'主翼先用同形余纸从背面粘合补强，避开根部安装翼与翼梢折线。根部 6 mm 安装翼向上折，贴合机身 WING 区并保持翼面微向上倾斜；翼梢向上折，平尾和垂尾按标记安装。',textEn:'Bond a matching offcut behind each main wing, leaving root flange and winglet folds free. Fold 6 mm root flanges up flush onto WING, preserving the slight upward wing slope. Fold winglets up; attach tailplanes and fin at their marks.'},
    {text:'每个发动机先围合八面外壳，再粘进气口与尾盖。吊架下端 5×12 mm 面粘在发动机平顶中央，上端斜面贴合主翼白色背面，从根部量出 26.5 mm 定位。吊架前缘位于机翼前缘后方。',textEn:'Close each eight-panel engine pod, then fit inlet and exhaust caps. Glue its 5×12 mm pylon bottom to the flat engine top. The sloped upper face fits the wing underside, 26.5 mm out from the root; keep it behind the leading edge.'},
    {text:'底座与支柱分别闭合，支柱下端居中粘在底座，上端 6×24 mm 面贴合机腹 STAND 区。等机翼补强层与全部连接处完全干燥再展示。没有起落架，底座是真实承重结构。',textEn:'Close base and post separately. Centre the post on the base and glue its 6×24 mm top onto belly STAND. Let wing reinforcement and all joints dry fully. This model uses a load-bearing stand instead of landing gear.'},
    {text:'使用 200–220 g/m² 纸。发动机重量、翼面下垂与胶合强度仍需实物试装验证；固定展示模型不可投掷飞行。',textEn:'Use 200–220 gsm stock. Engine weight, wing sag and glue strength require a physical trial. This fixed display model must not be thrown or flown.'}
  ]
}
export const jetAirlinerConsist=singleTransport(jetAirlinerSchema,'twin-engine-airliner-consist','jet-ocean')
