import type { BakeOptions } from './textureBaker'

export interface ProfessionalLiveryDecorations {
  side(ctx:CanvasRenderingContext2D,width:number,height:number,isLeft:boolean,middle:boolean):void
  front(ctx:CanvasRenderingContext2D,width:number,height:number):void
}

type Paint = {primary:string;secondary:string;accent:string;roof:string;window:string;frame:string}
const roles=['head','middle','middle_1','middle_2','tail']

/** Paint in physical millimetres, using the same planar coordinates as the authored shell UVs. */
export function bakeProfessionalTrainLivery(options:BakeOptions,decorations?:ProfessionalLiveryDecorations):Map<string,HTMLCanvasElement>|null {
  const haruka=options.consistId==='haruka-281-pro-consist'
  if(!haruka&&options.consistId!=='rapit-50000-pro-consist')return null
  const sakura=haruka&&options.theme.liveryStyle==='shinkansen-haruka-kitty'
  const color:Paint={...options.theme.colors,...(options.useCustomColors?options.customColors:{})}
  const slots=new Map<string,HTMLCanvasElement>()
  function canvas(width:number,height:number,base:string,paint:(ctx:CanvasRenderingContext2D)=>void) {
    const c=document.createElement('canvas');c.width=Math.ceil(width*8);c.height=Math.ceil(height*8)
    const ctx=c.getContext('2d')!;ctx.scale(c.width/width,c.height/height)
    ctx.fillStyle=base;ctx.fillRect(0,0,width,height)
    ctx.translate(0,height);ctx.scale(1,-1);ctx.lineJoin='round'
    paint(ctx);return c
  }
  function polygon(ctx:CanvasRenderingContext2D,points:number[][],fill:string,stroke?:string) {
    ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=fill;ctx.fill()
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.3;ctx.stroke()}
  }
  function box(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,fill:string,stroke?:string,r=.5) {
    ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill()
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.25;ctx.stroke()}
  }
  function text(ctx:CanvasRenderingContext2D,value:string,x:number,y:number,size:number,fill:string,maxWidth:number,mirror=false) {
    ctx.save();ctx.translate(x,y);ctx.scale(mirror?-1:1,-1);ctx.font=`500 ${size}px sans-serif`;ctx.textAlign='center';ctx.fillStyle=fill;ctx.fillText(value,0,0,maxWidth);ctx.restore()
  }
  for(const role of roles) {
    const middle=role.startsWith('middle'),length=middle?180:184,height=middle?36:haruka?37:38,maxZ=middle?90:94
    // Opposite side normals reverse the planar UV handedness; compensate lettering only.
    const side=(mirror:boolean)=>canvas(length,height,color.primary,ctx=>{
      if(haruka){
        if(sakura)box(ctx,0,5.5,length,.8,color.secondary,undefined,0)
        else {box(ctx,0,2.5,length,7,color.accent,undefined,0);box(ctx,0,10.2,length,.8,color.secondary,undefined,0)}
      }
      else {box(ctx,0,0,length,4,color.roof,undefined,0)}
      if(sakura&&decorations){
        ctx.save();ctx.translate(0,height);ctx.scale(length/1024,-height/280)
        decorations.side(ctx,1024,280,!mirror,middle);ctx.restore()
      }
      // Locations follow the longitudinal body coordinates; windows stay behind the cab transition.
      const centres=middle?[-62,-40,-18,4,26,48,70]:[-64,-43,-22,-1,20,39]
      for(const z of centres) {
        const x=maxZ-z
        if(haruka)box(ctx,x-7,16,14,8.5,color.window,color.frame,.7)
        else {ctx.beginPath();ctx.ellipse(x,23,6,6.3,0,0,Math.PI*2);ctx.fillStyle=color.window;ctx.fill();ctx.lineWidth=.45;ctx.strokeStyle=color.frame;ctx.stroke()}
      }
      for(const z of middle?[-79,81]:[-79,49]) {
        const x=maxZ-z
        box(ctx,x-3.3,6,6.6,22,color.primary,color.frame,.6)
        box(ctx,x-2.1,19,4.2,7,color.window,color.frame,.45)
        box(ctx,x+1.8,13,.6,1.3,color.frame,undefined,.1)
      }
      if(!middle) {
        if(haruka)polygon(ctx,[[maxZ-57,25],[maxZ-57,30],[maxZ-76,30],[maxZ-85,25]],color.window,color.frame)
        else {
          polygon(ctx,[[maxZ-57,28],[maxZ-58,33],[maxZ-65,33],[maxZ-76,28]],color.window,color.frame)
          ctx.strokeStyle=color.accent;ctx.lineWidth=.22
          for(const z of [46,48,50,52]){ctx.beginPath();ctx.moveTo(maxZ-z,29);ctx.lineTo(maxZ-z,34);ctx.stroke()}
        }
      }
      if(!sakura)text(ctx,haruka?'HARUKA':'rapi:t',length*.55,12,2.4,haruka?color.secondary:color.accent,28,mirror)
      text(ctx,haruka?'281':'50000',length-16,3.5,1.7,color.accent,12,mirror)
      if(options.customText.enabled) {
        const t=options.customText,value=[t.trainNumber,t.destination,t.kidName].filter(Boolean).join(' · ')
        const x=length*.55+(t.offsetX||0)*length/100,y=13+(t.offsetY||0)*height/100
        if(value){box(ctx,x-24,y-1,48,4,t.bgColor||color.primary,undefined,.4);text(ctx,value,x,y,2.5,t.textColor||color.accent,46,mirror)}
      }
    })
    const front=canvas(28,height,color.primary,ctx=>{
      if(sakura&&decorations){
        ctx.save();ctx.translate(0,height);ctx.scale(28/280,-height/320)
        decorations.front(ctx,280,320);ctx.restore()
      }
      if(middle) {
        box(ctx,9,4,10,26,color.primary,color.frame);box(ctx,10.5,20,7,8,color.window,color.frame)
      } else if(haruka) {
        box(ctx,1,2,26,sakura?2:6,sakura?color.secondary:color.accent,undefined,0)
        polygon(ctx,[[3.3,27],[4.5,33.8],[23.5,33.8],[24.7,27]],color.window,color.frame)
        box(ctx,11,8,6,22,color.primary,color.frame,.4);box(ctx,11.7,25.5,4.6,4.5,color.window,color.frame,.3)
        for(const x of [4.5,23.5]){box(ctx,x-1.8,9,3.6,2.3,'#f7f3d4',color.frame,.6);box(ctx,x-1.5,6,3,1,color.accent,undefined,.3)}
        if(!sakura)text(ctx,'HARUKA',14,18,1.7,color.secondary,10,true)
      } else {
        polygon(ctx,[[2.1,26],[5.5,33],[22.5,33],[25.9,26]],color.window,color.frame)
        box(ctx,13.8,26.2,.4,6.1,color.frame,undefined,0)
        polygon(ctx,[[4,20],[24,20],[22,15],[6,15]],color.roof)
        for(const x of [5,23])box(ctx,x-1.5,13,3,1.8,'#f4edcc',color.frame,.7)
        box(ctx,11,3,6,4,color.roof,color.frame,.4)
        text(ctx,'rapi:t',14,9,2.1,color.accent,12,true)
      }
    })
    const roof=canvas(28,length,color.primary,ctx=>{
      // Only the constant crown behind the cab carries roof equipment colouring.
      box(ctx,9,0,10,middle?length:haruka?138:132,color.roof,undefined,0)
    })
    const back=canvas(28,height,color.primary,ctx=>{box(ctx,9,4,10,26,color.primary,color.frame);box(ctx,10.5,20,7,8,color.window,color.frame)})
    const bottom=canvas(28,length,'#475569',ctx=>{
      for(const y of [32,length-32]){box(ctx,2,y-10,24,20,'#1e293b',undefined,.7);box(ctx,6,y-7,16,14,'#64748b',undefined,.5)}
    })
    const ac=canvas(14,34,color.roof,ctx=>{
      box(ctx,1,1,12,32,color.roof,color.frame)
      ctx.strokeStyle=color.frame;ctx.lineWidth=.35
      for(let y=3;y<32;y+=2){ctx.beginPath();ctx.moveTo(2,y);ctx.lineTo(12,y);ctx.stroke()}
    })
    const acSide=canvas(34,5,color.roof,ctx=>{ctx.strokeStyle=color.frame;ctx.lineWidth=.25;ctx.strokeRect(.5,.5,33,4)})
    const surfaces={side_left:side(false),side_right:side(true),front,back,roof,bottom,ac_unit:ac,ac_unit_side:acSide}
    for(const [slot,c] of Object.entries(surfaces)){
      slots.set(`${slot}_${role}_3d`,c);slots.set(`${slot}_${role}`,c)
      if(role===(options.carType||'head')){slots.set(`${slot}_3d`,c);slots.set(slot,c)}
    }
  }
  return slots
}
