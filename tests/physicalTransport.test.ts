import assert from 'node:assert/strict'
import { Triangle, Vector3 } from 'three'
import { CONSIST_REGISTRY, buildTrainConsistCars } from '../src/core/models/consistManager'
import type { SchemaFace } from '../src/core/schema/papercraftSchema'
import type { PaperSurface } from '../src/core/paper/types'
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-5,`${a} != ${b}`)
const v=(p:number[])=>new Vector3(...p as [number,number,number])
const model=(id:string)=>{const c=CONSIST_REGISTRY.find(c=>c.id===id)!,schema=c.carDefinitions.head.schema,paper=buildTrainConsistCars(c)[0].modelData.paperModel!;return {schema,paper,part:(id:string)=>schema.parts.find(p=>p.id===id)!,surface:(id:string)=>paper.surfaces.find(s=>s.id===id)!}}
function onSurface(p:Vector3,s:PaperSurface) {
  return s.triangles.some(t=>{const tri=new Triangle(...t.vertices.map(p=>new Vector3(p.x,p.y,p.z)) as [Vector3,Vector3,Vector3]);return tri.closestPointToPoint(p,new Vector3()).distanceTo(p)<1e-5})
}
let pads=0
function contact(face:SchemaFace,target:PaperSurface) {
  const points=face.vertices3D.map(v),centre=points.reduce((a,p)=>a.add(p),new Vector3()).divideScalar(points.length)
  for(const p of [centre,...points,...points.map((p,i)=>p.clone().lerp(points[(i+1)%points.length],.5))])assert.ok(onSurface(p,target),`${face.id} misses ${target.id} at ${p.toArray()}`)
  pads++
}
for(const id of ['compact-hatchback-consist','utility-pickup-consist']) {
  const m=model(id),pickup=id.startsWith('utility'),body=m.part(pickup?'pickup-chassis':'hatchback-body'),frame=m.part(pickup?'pickup-frame':'hatchback-frame')
  const profile=body.faces[0].vertices3D.map(([,y,z])=>[z,y]),inside=(z:number,y:number)=>{let yes=false;for(let i=0,j=profile.length-1;i<profile.length;j=i++){const a=profile[i],b=profile[j];if((a[1]>y)!==(b[1]>y)&&z<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])yes=!yes}return yes}
  const wheels=m.schema.parts.filter(p=>p.id.startsWith('wheel-'));assert.equal(wheels.length,4)
  for(const wheel of wheels) {
    const cap=wheel.faces.find(f=>f.id==='inner')!,ring=cap.vertices3D
    near(Math.min(...ring.map(p=>p[1])),0);near(Math.max(...ring.map(p=>p[1])),20)
    assert.ok(m.surface(wheel.id).edges.every(e=>e.faces.length===2),'Wheel is a closed physical cylinder')
    for(let i=0;i<ring.length;i++)for(let t=0;t<=20;t++){const p=v(ring[i]).lerp(v(ring[(i+1)%ring.length]),t/20);assert.ok(!inside(p.z,p.y),`${wheel.id}: tyre enters body at ${p.toArray()}`)}
    const mount=frame.faces.find(f=>f.slotName===`wheel_mount_${wheel.id.slice(6)}`)!
    assert.ok(mount);near(Math.max(...mount.vertices3D.map(p=>p[1]))-Math.min(...mount.vertices3D.map(p=>p[1])),7)
    contact(mount,m.surface(wheel.id))
  }
  assert.ok(frame.faces.flatMap(f=>f.vertices3D).every(p=>p[1]>=6),'Underframe has real ground clearance')
  assert.ok(body.faces.flatMap(f=>f.vertices3D).every(p=>p[1]>=13),'Body is supported above ground')
  if(pickup){const deck=body.faces.find(f=>f.slotName==='pickup_deck')!;assert.ok(deck.vertices3D.every(p=>p[1]===27));contact(m.part('pickup-cab').faces.find(f=>f.slotName==='bottom')!,m.surface('pickup-chassis'));contact(m.part('pickup-bed').faces.find(f=>f.id==='floor')!,m.surface('pickup-chassis'))}
}
for(const id of ['travel-propeller-plane-consist','twin-float-seaplane-consist']) {
  const m=model(id),hub=m.part('plane-hub'),blade=m.part('plane-propeller').faces[0],all=blade.vertices3D
  assert.ok(Math.max(...all.map(p=>p[0]))-Math.min(...all.map(p=>p[0]))>43,'Long blades have real span')
  assert.ok(Math.min(...all.map(p=>p[1]))>8,'Propeller clears ground and floats')
  contact(hub.faces.find(f=>f.id==='wall-0')!,m.surface('plane-fuselage'))
  contact(hub.faces.find(f=>f.id==='wall-2')!,m.surface('plane-propeller'))
  near(all[0][2]-80,6)
}
const jet=model('twin-engine-airliner-consist')
for(const side of ['left','right']) {
  contact(jet.part(`jet-${side}-wing`).faces.find(f=>f.id==='mount')!,jet.surface('jet-fuselage'))
  contact(jet.part(`jet-${side}-tailplane`).faces.find(f=>f.id==='mount')!,jet.surface('jet-fuselage'))
  const pylon=jet.part(`jet-${side}-pylon`)
  contact(pylon.faces.find(f=>f.id==='bottom')!,jet.surface(`jet-${side}-engine`))
  contact(pylon.faces.find(f=>f.id==='top')!,jet.surface(`jet-${side}-wing`))
  assert.ok(jet.surface(`jet-${side}-engine`).vertices.every(p=>p.y>=7-1e-5),'Engine has ground clearance')
  assert.ok(jet.surface(`jet-${side}-engine`).edges.every(e=>e.faces.length===2),'Engine pod is closed')
}
contact(jet.part('jet-fin').faces.find(f=>f.id==='mount')!,jet.surface('jet-fuselage'))
contact(jet.part('jet-stand-post').faces.find(f=>f.id==='top')!,jet.surface('jet-fuselage'))
contact(jet.part('jet-stand-post').faces.find(f=>f.id==='bottom')!,jet.surface('jet-stand-base'))
const heli=model('rescue-helicopter-consist')
contact(heli.part('heli-boom').faces.find(f=>f.id==='root')!,heli.surface('heli-cabin'))
contact(heli.part('heli-mast').faces.find(f=>f.id==='bottom')!,heli.surface('heli-cabin'))
contact(heli.part('heli-mast').faces.find(f=>f.id==='top')!,heli.surface('heli-main-hub'))
contact(heli.part('heli-main-hub').faces.find(f=>f.id==='top')!,heli.surface('heli-main-rotor'))
contact(heli.part('heli-tail-hub').faces.find(f=>f.id==='root')!,heli.surface('heli-boom'))
contact(heli.part('heli-fin').faces.find(f=>f.id==='mount')!,heli.surface('heli-boom'))
assert.ok(heli.surface('heli-tail-rotor').triangles.every(t=>t.normal.x<0),'Tail rotor artwork faces outwards')
assert.ok(heli.surface('heli-main-rotor').vertices.every(p=>p.y>58),'Main rotor clears tail fin')
for(const sign of [-1,1])for(const z of [-18,18]){
  const leg=heli.part(`heli-leg-${sign}-${z}`);contact(leg.faces.find(f=>f.id==='top')!,heli.surface('heli-cabin'));contact(leg.faces.find(f=>f.id==='bottom')!,heli.surface(`heli-crossbar-${z}`))
  const bar=heli.surface(`heli-crossbar-${z}`)
  for(const x of [sign*20-3,sign*20+3])for(const dz of [-3,3])assert.ok(onSurface(new Vector3(x,6,z+dz),bar),'Full skid-width contact under crossbar')
}
const float=model('twin-float-seaplane-consist')
for(const side of ['left','right'])for(const end of ['front','rear']){
  const s=float.part(`float-${side}-strut-${end}`);contact(s.faces.find(f=>f.id==='top')!,float.surface('plane-fuselage'));contact(s.faces.find(f=>f.id==='bottom')!,float.surface(`float-${side}`))
}
// Reported dimensions include accessories, and no part sinks below its support plane.
for(const c of CONSIST_REGISTRY.slice(-6)) {
  const m=model(c.id),vertices=m.paper.surfaces.flatMap(s=>s.vertices)
  near(Math.max(...vertices.map(v=>v.z))-Math.min(...vertices.map(v=>v.z)),m.schema.dimensions.length)
  near(Math.max(...vertices.map(v=>v.x))-Math.min(...vertices.map(v=>v.x)),m.schema.dimensions.width)
  near(Math.max(...vertices.map(v=>v.y))-Math.min(...vertices.map(v=>v.y)),m.schema.dimensions.height)
  assert.ok(vertices.every(p=>p.y>=-1e-5),'No support penetrates the ground')
}
console.log(`PASS physical transport: ${pads} sampled attachment pads, closed wheels/pods, arch clearance, support planes, rotor direction, propeller span and full accessory dimensions`)
