import type { BakeOptions } from './textureBaker'
import type { TextureTheme } from './types'
export const TRANSPORT_THEMES:TextureTheme[]=[
  {id:'hatchback-coral',name:'珊瑚橙',nameEn:'Coral',category:'custom',liveryStyle:'custom',compatibleCategories:['vehicle'],targetConsistIds:['compact-hatchback-consist'],description:'珊瑚橙车壳与深色车顶。',descriptionEn:'Coral shell and dark roof.',colors:{primary:'#ea7056',secondary:'#ffe6c9',accent:'#f6bd60',roof:'#334155',window:'#16334a',frame:'#475569'},stripes:{style:'none',width:0}},
  {id:'pickup-forest',name:'森林绿',nameEn:'Forest',category:'custom',liveryStyle:'custom',compatibleCategories:['vehicle'],targetConsistIds:['utility-pickup-consist'],description:'深绿车身与原木色开放货斗。',descriptionEn:'Forest body with a wood-colored open bed.',colors:{primary:'#397568',secondary:'#bed8c5',accent:'#e2b575',roof:'#e4e6df',window:'#173445',frame:'#334155'},stripes:{style:'none',width:0}},
  {id:'plane-sky',name:'天空蓝白',nameEn:'Sky blue & white',category:'custom',liveryStyle:'custom',compatibleCategories:['all'],targetConsistIds:['travel-propeller-plane-consist'],description:'白色机身与蓝色翼面，带安装位置标记。',descriptionEn:'White fuselage and blue wings with mounting locations.',colors:{primary:'#f8fafc',secondary:'#2895bd',accent:'#f2bb52',roof:'#f8fafc',window:'#163b54',frame:'#526c7b'},stripes:{style:'single',width:3}}
]
const canvas=(w:number,h:number,fill:string,paint:(ctx:CanvasRenderingContext2D)=>void)=>{
  const c=document.createElement('canvas');c.width=Math.ceil(w*10);c.height=Math.ceil(h*10)
  const ctx=c.getContext('2d')!;ctx.scale(c.width/w,c.height/h);ctx.fillStyle=fill;ctx.fillRect(0,0,w,h);paint(ctx);return c
}
const text=(ctx:CanvasRenderingContext2D,value:string,x:number,y:number,size:number,color='#334155',width=40,mirror=false)=>{ctx.save();if(mirror){ctx.translate(x*2,0);ctx.scale(-1,1)}ctx.font=`600 ${size}px sans-serif`;ctx.textAlign='center';ctx.fillStyle=color;ctx.fillText(value,x,y,width);ctx.restore()}
const box=(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,fill:string)=>{ctx.fillStyle=fill;ctx.fillRect(x,y,w,h)}
const line=(ctx:CanvasRenderingContext2D,x:number,y:number,a:number,b:number,color:string,width=.3)=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(a,b);ctx.lineWidth=width;ctx.strokeStyle=color;ctx.stroke()}

/** Aircraft and road geometry have their own artwork, rather than inheriting train windows. */
export function bakeTransportLivery(options:BakeOptions):Map<string,HTMLCanvasElement>|null {
  const id=options.consistId,car=id==='compact-hatchback-consist',pickup=id==='utility-pickup-consist',plane=id==='travel-propeller-plane-consist'
  if(!car&&!pickup&&!plane)return null
  const color={...options.theme.colors,...(options.useCustomColors?options.customColors:{})},slots=new Map<string,HTMLCanvasElement>()
  const length=car?110:pickup?132:160,height=car?38:pickup?44:24
  const store=(name:string,c:HTMLCanvasElement)=>{slots.set(name,c);slots.set(`${name}_3d`,c)}
  for(const side of ['left','right']) {
    const mirror=side==='left'
    store(`side_${side}`,canvas(length,height,color.primary,ctx=>{
      // Coordinates follow the side-specific UV direction, so letters stay upright in both nets.
      const position=(z:number)=>mirror?z+length/2:length/2-z
      if(plane) {
        box(ctx,0,13,length,3,color.secondary)
        box(ctx,Math.min(position(20),position(50)),3,30,7,color.window)
        for(const [z,label,w] of [[1,'WING',38],[-36,'TAIL',16]] as const){const x=Math.min(position(z+w/2),position(z-w/2));box(ctx,x,6,w,6,color.roof);text(ctx,label,x+w/2,10,2,color.frame,w-1)}
        text(ctx,'PC-160',position(-5),21,3,color.secondary,40)
      } else {
        for(const z of car?[-33,35]:[-44,44]) {
          const x=position(z);ctx.beginPath();ctx.arc(x,height-7,7,0,Math.PI*2);ctx.fillStyle='#1e293b';ctx.fill();ctx.beginPath();ctx.arc(x,height-7,3,0,Math.PI*2);ctx.fillStyle='#cbd5e1';ctx.fill()
        }
        box(ctx,Math.min(position(-24),position(14)),car?5:4,car?38:36,car?11:15,color.window)
        line(ctx,position(-6),4,position(-6),height-10,color.frame)
        if(pickup){box(ctx,Math.min(position(-66),position(-15)),height-30,51,16,color.primary);line(ctx,position(-66),height-30,position(-15),height-30,color.accent)}
      }
      if(options.customText.enabled)text(ctx,options.customText.kidName,position(0),height-3,2.5,options.customText.textColor||color.accent,50)
    }))
  }
  for(const [slot,fill] of Object.entries({roof:color.roof,hood:color.primary,windshield:color.window,rear_window:color.window,front:color.primary,back:color.primary,bottom:'#64748b',cab_back:color.primary})) {
    store(slot,canvas(48,48,fill,ctx=>{
      if(slot==='front'||slot==='back'){
        for(const x of [7,35])box(ctx,x,28,6,3,slot==='front'?'#fff3c4':'#dc6652')
        if(!plane){box(ctx,17,32,14,4,'#eef2f6');text(ctx,'PC',24,35,2)}
      }
      if(slot==='roof'&&plane){box(ctx,14,31.8,10,6.6,color.secondary);text(ctx,'FIN',19,36,2,'#fff',9)}
    }))
  }
  store('pickup_deck',canvas(48,132,color.roof,ctx=>{box(ctx,0,0,48,51,'#c5aa81');text(ctx,'BED',24,26,4);text(ctx,'CAB',24,95,4)}))
  store('bed_floor',canvas(48,51,'#c5aa81',ctx=>{for(let x=6;x<48;x+=6)line(ctx,x,0,x,51,'#957452')}))
  store('bed_side',canvas(51,16,color.primary,ctx=>line(ctx,0,1,51,1,color.accent,.6)))
  store('wing',canvas(150,160,color.secondary,ctx=>{for(const x of [7,132])box(ctx,x,0,11,160,color.accent)}))
  store('wing_mount',canvas(38,6,'#e2e8f0',ctx=>text(ctx,'GLUE',19,4,2)))
  store('fin',canvas(26,23,color.secondary,ctx=>box(ctx,0,0,26,3,color.accent)))
  store('fin_mount',canvas(26,5,'#e2e8f0',ctx=>text(ctx,'GLUE',13,3.5,2)))
  store('propeller',canvas(4,23,'#475569',ctx=>box(ctx,0,0,4,3,color.accent)))
  return slots
}

/** Same mounting labels in 3D, SVG, PNG and PDF; the wings are physically part of each strip. */
export function jointLivery():Map<string,HTMLCanvasElement> {
  const slots=new Map<string,HTMLCanvasElement>()
  for(const [slot,width,height] of [['joint_front',54,38],['joint_rear',54,38],['joint_pleats',54,38],['joint_strap',50,12],['joint_strap_front',50,12],['joint_strap_rear',50,12],['joint_partition',40,44]] as const) {
    const c=canvas(width,height,slot==='joint_partition'?'#64748b':'#94a3b8',ctx=>{
      if(slot==='joint_front'||slot==='joint_rear'){box(ctx,0,0,width,height,'#e2e8f0');text(ctx,slot==='joint_front'?'FRONT':'REAR',slot==='joint_front'?width*.083:width*.917,height*.5,1.7,'#334155',8)}
      if(slot==='joint_strap_front'||slot==='joint_strap_rear'){box(ctx,0,0,width,height,'#e2e8f0');text(ctx,slot==='joint_strap_front'?'FRONT':'REAR',slot==='joint_strap_front'?5:45,7,1.7,'#334155',9)}
      if(slot==='joint_pleats')for(let x=9;x<=45;x+=6)line(ctx,x,0,x,height,'#475569',.2)
    })
    slots.set(slot,c);slots.set(`${slot}_3d`,c)
  }
  return slots
}
