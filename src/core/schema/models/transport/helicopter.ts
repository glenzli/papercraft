import type { PapercraftModelSchema, SchemaPart } from '../../papercraftSchema'
import { profilePrism, type Vertex } from './paperShapes'
import { mappedPanel, boxPart, singleTransport } from './physicalParts'

export const boomHalf=(z:number)=>5+2*(z+45)/67
export const boomTop=(z:number)=>36-9*(z+45)/67
export const boomBottom=(z:number)=>26-13*(z+45)/67
const cross=(tip:number,half:number,centre:number):[number,number][]=>[[-half,-tip],[half,-tip],[centre,-centre],[tip,-half],[tip,half],[centre,centre],[half,tip],[-half,tip],[-centre,centre],[-tip,half],[-tip,-half],[-centre,-centre]]
const a:Vertex[]=[[-5,26,-45],[5,26,-45],[5,36,-45],[-5,36,-45]],b:Vertex[]=[[-3,39,-112],[3,39,-112],[3,45,-112],[-3,45,-112]]
const boomFaces=[mappedPanel('root','heli_boom',a),mappedPanel('tip','heli_boom',[...b].reverse()),...a.map((p,i)=>{const j=(i+1)%4;return mappedPanel(`side-${i}`,'heli_boom',[a[j],p,b[i],b[j]])})]
// The boom runs toward -Z, so its cross-section winding is reversed for outward faces.
const tailHub:SchemaPart={id:'heli-tail-hub',name:'尾桨安装座 / Tail rotor mount',faces:[]}
const z0=-109,z1=-103
const r=(z:number,y:number):Vertex=>[-boomHalf(z),y,z],o=(z:number,y:number):Vertex=>[-9,y,z]
tailHub.faces=[
  mappedPanel('root','air_mount',[r(z0,boomBottom(z0)),r(z1,boomBottom(z1)),r(z1,boomTop(z1)),r(z0,boomTop(z0))]),
  mappedPanel('outer','heli_hub',[o(z1,boomBottom(z1)),o(z0,boomBottom(z0)),o(z0,boomTop(z0)),o(z1,boomTop(z1))]),
  mappedPanel('bottom','heli_hub',[r(z1,boomBottom(z1)),r(z0,boomBottom(z0)),o(z0,boomBottom(z0)),o(z1,boomBottom(z1))]),
  mappedPanel('top','heli_hub',[r(z0,boomTop(z0)),r(z1,boomTop(z1)),o(z1,boomTop(z1)),o(z0,boomTop(z0))]),
  mappedPanel('rear','heli_hub',[r(z0,boomBottom(z0)),r(z0,boomTop(z0)),o(z0,boomTop(z0)),o(z0,boomBottom(z0))]),
  mappedPanel('front','heli_hub',[r(z1,boomTop(z1)),r(z1,boomBottom(z1)),o(z1,boomBottom(z1)),o(z1,boomTop(z1))])
]
tailHub.faces=tailHub.faces.map(f=>mappedPanel(f.id,f.slotName,[...f.vertices3D].reverse(),f.name))
const mast=boxPart('heli-mast','旋翼桅杆 / Rotor mast',-3,3,49,58,-4,4,'heli_hub')
for(const f of mast.faces)f.vertices3D=f.vertices3D.map(([x,y,z])=>[x,y===49?49+(z+21)/29:y,z])
export const helicopterSchema:PapercraftModelSchema={
  version:'2.0',id:'rescue-helicopter',name:'救援直升机',nameEn:'Rescue helicopter',category:'aircraft',difficulty:'hard',recommendedAge:'14+',estimatedTime:'100–140 分钟',
  description:'独立座舱、长尾梁、主旋翼与侧尾桨，落在真实滑橇与支柱上。',descriptionEn:'Separate cabin, long tail boom, main rotor and side tail rotor supported by real skids and posts.',dimensions:{length:195,width:156,height:64},
  parts:[
    profilePrism('heli-cabin','座舱 / Cabin',15,[[-45,22],[45,22],[45,36],[31,46],[8,50],[-21,49],[-45,36]],undefined,{minZ:-45,maxZ:45,minY:0,maxY:50}),
    {id:'heli-boom',name:'尾梁 / Tail boom',faces:boomFaces},
    ...[-1,1].map(sign=>boxPart(`heli-${sign<0?'left':'right'}-skid`,'滑橇 / Skid',sign*20-3,sign*20+3,0,6,-43,42,'heli_skid')),
    ...[-18,18].map(z=>boxPart(`heli-crossbar-${z}`,'横梁 / Crossbar',-23,23,6,12,z-3,z+3,'heli_skid')),
    ...[-1,1].flatMap(sign=>[-18,18].map(z=>boxPart(`heli-leg-${sign}-${z}`,'座舱支柱 / Cabin leg',sign*12-2.5,sign*12+2.5,12,22,z-3,z+3,'heli_skid'))),
    mast,boxPart('heli-main-hub','主旋翼座 / Main rotor hub',-5,5,58,64,-5,5,'heli_hub'),
    {id:'heli-main-rotor',name:'四叶主旋翼 / Four-blade main rotor',isAccessory:true,faces:[mappedPanel('rotor','heli_rotor',cross(78,3.5,5).reverse().map(([x,z])=>[x,64,z]))]},
    {id:'heli-fin',name:'尾鳍 / Tail fin',isAccessory:true,faces:[mappedPanel('fin','heli_fin',[[0,boomTop(-110),-110],[0,boomTop(-94),-94],[0,58,-106]]),mappedPanel('mount','air_mount',[[0,boomTop(-94),-94],[0,boomTop(-110),-110],[2.5,boomTop(-110),-110],[2.5,boomTop(-94),-94]])]},
    tailHub,{id:'heli-tail-rotor',name:'四叶尾桨 / Four-blade tail rotor',isAccessory:true,faces:[mappedPanel('rotor','heli_tail_rotor',cross(11,1.5,2).map(([z,y])=>[-9,41.5+y,-106+z]))]}
  ],
  assemblySteps:[
    {text:'闭合座舱与尾梁，尾梁宽端贴到座舱后墙中央，顶面朝上。尾鳍安装翼贴尾梁斜顶，尾桨安装座的斜内面贴尾梁左侧末端。',textEn:'Close cabin and boom. Glue the wide boom end to the cabin rear centre, top up. Fit the fin flange to the sloped boom roof and the tail rotor mount’s sloped inner face to the left end of the boom.'},
    {text:'两根滑橇平底落地，两根横梁跨接其顶面，前后距中心各 18 mm。四根座舱支柱从横梁升到机腹（左右距中心各 12 mm）；先试装所有接触面再粘合。',textEn:'Stand both skids on their flat bottoms. Fit crossbars on top, 18 mm fore/aft of centre. Four cabin legs rise from crossbars to belly, 12 mm left/right. Dry-fit every contact before gluing.'},
    {text:'桅杆斜底贴合座舱顶中央，上端粘主旋翼座。主旋翼先用同形余纸背面补强，再将中央 10×10 mm 区粘到旋翼座。尾桨中央 4×4 mm 区粘尾桨座外面。',textEn:'Glue the mast’s sloped bottom to the cabin roof centre and the main hub on top. Reinforce the rotor with a matching offcut, then glue its 10×10 mm centre to the hub. Glue the tail rotor’s 4×4 mm centre to its outer mount.'},
    {text:'两组旋翼均固定，不可旋转或飞行。使用 200–220 g/m² 纸；长旋翼的下垂及胶接强度需要实物试装。完全干燥后再展示。',textEn:'Both rotors are fixed; this model cannot fly. Use 200–220 gsm stock. Long rotor sag and glue strength need a physical build. Let every joint dry before display.'}
  ]
}
export const helicopterConsist=singleTransport(helicopterSchema,'rescue-helicopter-consist','heli-rescue')
