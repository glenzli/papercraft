import assert from 'node:assert/strict'
import { bakeProfessionalTrainLivery } from '../src/texture/professionalTrainLivery'
import { PRESET_THEMES } from '../src/texture/presetThemes'
import { CONSIST_REGISTRY, buildTrainConsistCars } from '../src/core/models/consistManager'
import { AffineTextureProjector } from '../src/core/unfolder/AffineTextureProjector'

// Record Canvas text transforms without rasterizing: composing them with the real unfolded
// triangle projection must preserve glyph handedness on both sides and the raked nose.
const previous=Object.getOwnPropertyDescriptor(globalThis,'document')
const records=new WeakMap<HTMLCanvasElement,{text:string;det:number}[]>()
const ellipses=new WeakMap<HTMLCanvasElement,number[][]>()
Object.defineProperty(globalThis,'document',{configurable:true,value:{createElement:()=>{
  let det=1
  const stack:number[]=[],glyphs:{text:string;det:number}[]=[],ovals:number[][]=[]
  const methods={
    scale:(x:number,y:number)=>{det*=x*y},save:()=>stack.push(det),restore:()=>{det=stack.pop()!},
    fillText:(text:string)=>glyphs.push({text,det}),
    ellipse:(x:number,y:number,rx:number,ry:number)=>ovals.push([x,y,rx,ry])
  }
  const ctx=new Proxy(methods,{get:(target,key)=>Reflect.get(target,key)||(()=>{})})
  const canvas={width:0,height:0,getContext:()=>ctx} as unknown as HTMLCanvasElement
  records.set(canvas,glyphs);ellipses.set(canvas,ovals);return canvas
}}})
try {
  for(const id of ['haruka-281-pro-consist','rapit-50000-pro-consist']) {
    const consist=CONSIST_REGISTRY.find(c=>c.id===id)!,theme=PRESET_THEMES.find(t=>t.id===consist.defaultThemeId)!
    const slots=bakeProfessionalTrainLivery({consistId:id,theme,customText:{enabled:true,kidName:'GLYPH TEST',destination:'AIRPORT',trainNumber:'42'}})!
    for(const car of buildTrainConsistCars(consist,1)) {
      const paper=car.modelData.paperModel!
      for(const triangle of paper.surfaces[0].triangles) {
        const canvas=slots.get(`${triangle.textureSlot}_${car.carType}_3d`)!
        const glyphs=records.get(canvas)!
        if(!glyphs.length)continue
        const face=paper.parts.flatMap(p=>p.faces).find(f=>f.id===triangle.id)!
        const [a,b,c]=face.polygon2D,[u,v,w]=face.uvCoords
        const m=AffineTextureProjector.computeAffineMatrix(a,b,c,u,v,w,canvas.width,canvas.height)!
        for(const glyph of glyphs)assert.ok((m.a*m.d-m.b*m.c)*glyph.det>0,`${id}: mirrored ${glyph.text} on ${triangle.textureSlot}`)
      }
    }
    if(id==='rapit-50000-pro-consist') {
      const windows=ellipses.get(slots.get('side_left_head_3d')!)!
      assert.ok(windows.length>=6)
      for(const [,,rx,ry] of windows){assert.ok(ry/rx>=1&&ry/rx<=1.1,'Portholes are nearly circular');assert.ok(rx*2>=12&&ry*2>=12,'Large portholes dominate the side wall')}
    }
    assert.ok(records.get(slots.get('side_left_head_3d')!)!.some(g=>g.text.includes('GLYPH TEST')),'Custom text reaches the professional artwork')
  }
  console.log('PASS professional lettering: both sides, front face, all car roles and custom text')
} finally {
  if(previous)Object.defineProperty(globalThis,'document',previous)
  else Reflect.deleteProperty(globalThis,'document')
}
