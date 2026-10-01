import type { TextureTheme } from './types'
import type { BakeOptions } from './textureBaker'
const theme=(id:string,name:string,nameEn:string,target:string,primary:string,secondary:string,accent:string):TextureTheme=>({id,name,nameEn,category:'custom',liveryStyle:'custom',compatibleCategories:['all'],targetConsistIds:[target],description:'原创展示涂装，保留安装位置。',descriptionEn:'Original display livery with mounting locations.',colors:{primary,secondary,accent,roof:primary,window:'#163445',frame:'#475569'},stripes:{style:'single',width:3}})
export const AIRCRAFT_THEMES:TextureTheme[]=[
  theme('plane-retro','奶油复古红','Cream & vintage red','travel-propeller-plane-consist','#fff4d9','#ae423a','#e3b25c'),
  theme('plane-rescue','山地救援黄','Mountain rescue yellow','travel-propeller-plane-consist','#f4cb52','#dc5639','#334155'),
  theme('jet-ocean','海洋蓝白','Ocean blue & white','twin-engine-airliner-consist','#fafafa','#167caa','#5dc3c1'),
  theme('jet-sunset','日落橙紫','Sunset orange & plum','twin-engine-airliner-consist','#fff8ed','#a24d77','#f28c49'),
  theme('jet-retro','复古奶油绿','Vintage cream & green','twin-engine-airliner-consist','#fff1d5','#397568','#d9a94d'),
  theme('heli-rescue','橙白救援','Orange & white rescue','rescue-helicopter-consist','#ee853d','#f8fafc','#164963'),
  theme('heli-medical','蓝白医疗','Blue & white medical','rescue-helicopter-consist','#f8fafc','#2895bd','#de6051'),
  theme('heli-forest','森林作业绿','Forest utility green','rescue-helicopter-consist','#407767','#dfd8bc','#f3bc52'),
  theme('float-retro','湖畔复古红','Lakeside vintage red','twin-float-seaplane-consist','#fff4d9','#ad4940','#e1b757'),
  theme('float-coast','海岸救援黄','Coastal rescue yellow','twin-float-seaplane-consist','#f6cc4c','#237a9b','#f7f4e7')
]
const canvas=(w:number,h:number,fill:string,paint:(c:CanvasRenderingContext2D)=>void=()=>{})=>{const c=document.createElement('canvas');c.width=Math.ceil(w*10);c.height=Math.ceil(h*10);const ctx=c.getContext('2d')!;ctx.scale(c.width/w,c.height/h);ctx.fillStyle=fill;ctx.fillRect(0,0,w,h);paint(ctx);return c}
const box=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)}
const text=(c:CanvasRenderingContext2D,s:string,x:number,y:number,size=2,width=40)=>{c.fillStyle='#475569';c.font=`600 ${size}px sans-serif`;c.textAlign='center';c.fillText(s,x,y,width)}
export function bakeAircraftLivery(o:BakeOptions):Map<string,HTMLCanvasElement>|null {
  const jet=o.consistId==='twin-engine-airliner-consist',heli=o.consistId==='rescue-helicopter-consist'
  if(!jet&&!heli)return null
  const c={...o.theme.colors,...(o.useCustomColors?o.customColors:{})},map=new Map<string,HTMLCanvasElement>()
  const put=(name:string,art:HTMLCanvasElement)=>{map.set(name,art);map.set(`${name}_3d`,art)}
  if(jet) {
    for(const side of ['left','right'])put(`jet_${side}`,canvas(138,28,c.primary,ctx=>{
      const pos=(z:number)=>side==='left'?z+68:70-z
      box(ctx,0,15,138,3,c.secondary)
      for(let z=-51;z<=55;z+=7)box(ctx,pos(z)-1.5,8,3,3,c.window)
      for(const z of [-59,61]){box(ctx,pos(z)-2.5,7,5,13,c.frame);box(ctx,pos(z)-2.1,7.4,4.2,12.2,c.primary);box(ctx,pos(z)-1,9,2,2,c.window)}
      const root=Math.min(pos(-20),pos(40));box(ctx,root,11,60,6,'#e2e8f0');text(ctx,'WING',root+30,15,2.5,55)
      const tail=Math.min(pos(-64),pos(-42));box(ctx,tail,11,22,6,'#e2e8f0');text(ctx,'TAIL',tail+11,15,2,20)
      text(ctx,o.customText.enabled?o.customText.kidName:'PAPER AIR',pos(4),24,3,60)
    }))
    put('jet_cockpit',canvas(30,25,c.primary,ctx=>{box(ctx,3,7,24,9,c.window);box(ctx,14,7,2,9,c.primary)}))
    for(const slot of ['jet_nose','jet_tail','jet_engine','jet_pylon'])put(slot,canvas(30,30,c.primary,ctx=>box(ctx,0,24,30,3,c.secondary)))
    const hw=14*Math.sin(Math.PI/12),pad=(hw-3)*8/(2*hw),pw=3*8/(2*hw)
    put('jet_roof',canvas(8,138,c.primary,ctx=>{box(ctx,pad,112,pw,24,'#e2e8f0');text(ctx,'FIN',pad+pw/2,125,1.5,pw)}))
    put('jet_belly',canvas(8,138,c.primary,ctx=>{box(ctx,pad,58,8-2*pad,24,'#e2e8f0');text(ctx,'STAND',4,72,1.5,6)}))
    for(const slot of ['jet_wing','jet_tailplane','jet_winglet','jet_fin'])put(slot,canvas(60,60,c.secondary,ctx=>box(ctx,0,0,60,5,c.accent)))
    for(const slot of ['jet_intake','jet_exhaust'])put(slot,canvas(16,16,'#334155',ctx=>{ctx.beginPath();ctx.arc(8,8,6,0,Math.PI*2);ctx.fillStyle='#0f172a';ctx.fill();ctx.strokeStyle='#94a3b8';ctx.lineWidth=.7;for(let i=0;i<10;i++){const a=i*Math.PI/5;ctx.beginPath();ctx.moveTo(8,8);ctx.lineTo(8+5*Math.cos(a),8+5*Math.sin(a));ctx.stroke()}}))
    put('stand',canvas(70,70,'#e2e8f0'))
    put('stand_top',canvas(70,70,'#e2e8f0',ctx=>{box(ctx,32,23,6,24,'#cbd5e1');text(ctx,'POST',35,37,2,20)}))
    put('stand_post',canvas(24,12,'#cbd5e1'))
  } else {
    for(const side of ['left','right'])put(`side_${side}`,canvas(90,50,c.primary,ctx=>{
      const pos=(z:number)=>side==='left'?z+45:45-z
      box(ctx,0,32,90,4,c.secondary)
      box(ctx,Math.min(pos(-17),pos(25)),7,42,13,c.window)
      box(ctx,pos(6)-1,7,2,13,c.primary)
      text(ctx,o.customText.enabled?o.customText.kidName:'RESCUE',pos(-3),29,4,45)
    }))
    for(const [slot,fill] of Object.entries({roof:c.primary,front:c.window,back:c.primary,bottom:'#64748b',heli_boom:c.primary,heli_hub:c.accent,heli_skid:'#475569',heli_fin:c.secondary}))put(slot,canvas(40,40,fill))
    for(const slot of ['heli_rotor','heli_tail_rotor'])put(slot,canvas(60,60,'#475569',ctx=>{box(ctx,0,0,5,60,c.accent);box(ctx,55,0,5,60,c.accent);box(ctx,0,0,60,5,c.accent);box(ctx,0,55,60,5,c.accent)}))
  }
  put('air_mount',canvas(24,6,'#e2e8f0',ctx=>text(ctx,'GLUE',12,4,2,20)))
  return map
}
