import assert from 'node:assert/strict'
import { Vector3 } from 'three'
import { CONSIST_REGISTRY, buildTrainConsistCars } from '../src/core/models/consistManager'
import { ARTICULATED_GAP_MM, ARTICULATED_TRIAL_ANGLE_DEG } from '../src/core/schema/accessories/articulatedJoint'
import { PRINT_AREA, packConsistToA4Pages } from '../src/core/unfoldEngine'
import { overlaps, signedArea } from '../src/core/paper/geometry'
import { getPrintMarks } from '../src/core/paper/printMarks'
import { trainConsistToPackage, packageToTrainConsist, buildPapercraftZipPackage, parsePapercraftZipPackage } from '../src/core/schema/papercraftFormat'
import { compactCarConsist, pickupConsist } from '../src/core/schema/models/transport/roadVehicles'
import { travelPlaneConsist } from '../src/core/schema/models/transport/travelPlane'
import { bakeTransportLivery, jointLivery } from '../src/texture/transportLivery'
import { PRESET_THEMES } from '../src/texture/presetThemes'
import { AffineTextureProjector } from '../src/core/unfolder/AffineTextureProjector'
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-5,`${a} != ${b}`)
const bus=CONSIST_REGISTRY.find(c=>c.id==='articulated-bus-consist')!,[front,rear]=buildTrainConsistCars(bus)
near((front.spacingOffsetZ-front.modelData.dimensions.length*.005)-(rear.spacingOffsetZ+rear.modelData.dimensions.length*.005),ARTICULATED_GAP_MM*.01)
assert.equal(rear.rotationY,0,'A bus rear keeps its forward-facing joining partition')
const fz=-front.schema.dimensions.length/2,rz=fz-ARTICULATED_GAP_MM
for(const id of ['bus-joint-left','bus-joint-right','bus-joint-strap']) {
  const s=front.modelData.paperModel!.surfaces.find(s=>s.id===id)!,p=front.modelData.paperModel!.parts.filter(p=>p.sourcePartId===id)
  assert.equal(p.length,1,'Each joint strip remains one integral sheet')
  assert.equal(p[0].kind,'surface');assert.equal(p[0].faces.length,16)
  assert.equal(s.edges.filter(e=>e.faces.length===2&&Math.abs(e.foldAngle)>1e-5).length,7)
  const folds=getPrintMarks(p[0]).lines.filter(l=>l.type!=='cut')
  assert.equal(folds.length,7);assert.ok(folds.some(f=>f.type==='mountain')&&folds.some(f=>f.type==='valley'))
  const pleatAngles=s.edges.filter(e=>e.faces.length===2&&Math.abs(e.foldAngle)>1e-5&&e.faces.every(f=>s.triangles[f.faceIndex].sourceFaceId.startsWith('pleat'))).map(e=>e.foldAngle)
  assert.equal(pleatAngles.length,5)
  for(let i=1;i<pleatAngles.length;i++)assert.ok(pleatAngles[i]*pleatAngles[i-1]<0,'Accordion folds alternate')
  const mounts=s.triangles.filter(t=>t.sourceFaceId.endsWith('mount'))
  assert.equal(mounts.length,4,'Two full end flanges are present')
  if(!id.endsWith('strap'))assert.ok(mounts.every(t=>t.vertices.every(v=>Math.abs(v.z-fz)<1e-5||Math.abs(v.z-rz)<1e-5)),'Side flanges touch the actual end partitions')
  else assert.ok(mounts.every(t=>t.vertices.every(v=>Math.abs(v.y)<1e-5)),'Strap flanges contact the actual underside plane')
  if(!id.endsWith('strap'))assert.ok(s.triangles.filter(t=>t.sourceFaceId.startsWith('pleat')).every(t=>id.endsWith('left')?t.normal.x<0:t.normal.x>0),'Bellows print on both outer sides')
}
// Rigid body clearance and available developed paper length, not a physical flex/strength proof.
for(const degrees of [-ARTICULATED_TRIAL_ANGLE_DEG,0,ARTICULATED_TRIAL_ANGLE_DEG]) {
  const angle=degrees*Math.PI/180,pivot=fz-ARTICULATED_GAP_MM/2
  const turn=(x:number,z:number)=>({x:x*Math.cos(angle)+(z-pivot)*Math.sin(angle),z:pivot-x*Math.sin(angle)+(z-pivot)*Math.cos(angle)})
  assert.ok(Math.max(...[-20,20].map(x=>turn(x,rz).z))<fz-15,'Rear corners leave turning clearance')
  for(const x of [-16,16]){const end=turn(x,rz);assert.ok(Math.hypot(end.x-x,end.z-fz)<36,'Side pleats have extension reserve')}
  const end=turn(0,rz);assert.ok(Math.hypot(end.x,end.z-fz)<30,'Underside strap has extension reserve')
}
for(const c of [compactCarConsist,pickupConsist,travelPlaneConsist,bus]) {
  const schema=c.carDefinitions.head.schema,paper=buildTrainConsistCars(c)[0].modelData.paperModel!
  assert.ok(schema.assemblySteps?.every(s=>s.text&&s.textEn),'Both languages have assembly steps')
  assert.ok(!paper.diagnostics.some(d=>d.severity!=='info'),'No discarded faces or impractically small joining strips')
  for(const s of paper.surfaces)for(const t of s.triangles) {
    const a=new Vector3(t.vertices[0].x,t.vertices[0].y,t.vertices[0].z),b=new Vector3(t.vertices[1].x,t.vertices[1].y,t.vertices[1].z),d=new Vector3(t.vertices[2].x,t.vertices[2].y,t.vertices[2].z)
    const n=b.sub(a).cross(d.sub(a)).normalize();near(n.x,t.normal.x);near(n.y,t.normal.y);near(n.z,t.normal.z)
  }
  const clone=packageToTrainConsist(JSON.parse(JSON.stringify(trainConsistToPackage(c))))
  assert.deepEqual(clone.carDefinitions.head.schema.assemblySteps,schema.assemblySteps)
  const zip=await buildPapercraftZipPackage(c),parsed=await parsePapercraftZipPackage(await zip.arrayBuffer())
  assert.ok(parsed.success,parsed.error);assert.deepEqual(parsed.consist!.carDefinitions.head.schema.assemblySteps,schema.assemblySteps)
}
const pickup=buildTrainConsistCars(pickupConsist)[0].modelData.paperModel!
assert.ok(pickup.surfaces.slice(0,2).every(s=>s.edges.every(e=>e.faces.length===2)),'Cab and chassis are closed')
const bed=pickup.surfaces.find(s=>s.id==='pickup-bed')!
assert.equal(bed.edges.filter(e=>e.faces.length===1).length,4,'The cargo bed is genuinely open on top')
assert.ok(bed.edges.filter(e=>e.faces.length===1).every(e=>e.vertexIds.every(i=>bed.vertices[i].y===30)))
const plane=buildTrainConsistCars(travelPlaneConsist)[0].modelData.paperModel!
assert.equal(buildTrainConsistCars(travelPlaneConsist,0,'en-US')[0].modelData.name,'Touring propeller plane')
assert.equal(buildTrainConsistCars(travelPlaneConsist,0,'zh-CN')[0].modelData.name,'旅行螺旋桨飞机','Language switches must not mutate cached model names')
assert.ok(plane.surfaces[0].edges.every(e=>e.faces.length===2),'Aircraft fuselage is closed')
for(const id of ['plane-left-wing','plane-right-wing','plane-left-tail','plane-right-tail','plane-fin']) {
  const parts=plane.parts.filter(p=>p.sourcePartId===id)
  assert.equal(parts.length,1,'Mounting flanges stay attached to their wing')
  assert.equal(getPrintMarks(parts[0]).lines.filter(l=>l.type!=='cut').length,1)
}
// Reconstruct the crease from its printed label with the artwork face toward the viewer.
// Comparing signed volume detects a reflected assembly that edge lengths alone cannot catch.
let reconstructedFolds=0
const vec=(p:{x:number;y:number;z:number})=>new Vector3(p.x,p.y,p.z)
const volume=(a:Vector3,b:Vector3,c:Vector3,d:Vector3)=>b.clone().sub(a).cross(c.clone().sub(a)).dot(d.clone().sub(a))
for(const consist of CONSIST_REGISTRY)for(const car of buildTrainConsistCars(consist,1)) {
  const paper=car.modelData.paperModel!
  for(const surface of paper.surfaces) {
    const faces=paper.parts.filter(p=>p.sourcePartId===surface.id&&p.kind==='surface').flatMap(p=>p.faces)
    for(const face of faces)assert.ok(signedArea(face.polygon2D)<0,`${consist.id}/${face.id}: printed face winding`)
    for(const edge of surface.edges) {
      if(edge.faces.length!==2||Math.abs(Math.sin(edge.foldAngle))<1e-5)continue
      const [ar,br]=edge.faces,at=surface.triangles[ar.faceIndex],bt=surface.triangles[br.faceIndex]
      const af=faces.find(f=>f.id===at.id)!,bf=faces.find(f=>f.id===bt.id)!
      const tab=faces.flatMap(f=>f.creases).find(c=>c.edgeId===edge.id&&c.seamId&&c.type!=='cut')
      if(tab)assert.equal(tab.type,edge.foldAngle<0?'valley':'mountain',`${consist.id}: concave/convex tab fold`)
      const crease=af.creases.find(c=>c.edgeId===edge.id&&!c.seamId)
      if(!crease)continue
      const ai=ar.edgeIndex,bi=(ai+1)%3,ci=(ai+2)%3,di=bt.vertexIds.findIndex(id=>!edge.vertexIds.includes(id))
      const embed=(p:{x:number;y:number})=>new Vector3(p.x,-p.y,0)
      const a=embed(af.polygon2D[ai]),b=embed(af.polygon2D[bi]),c=embed(af.polygon2D[ci]),d=embed(bf.polygon2D[di])
      const axis=b.clone().sub(a).normalize(),foot=a.clone().addScaledVector(axis,d.clone().sub(a).dot(axis)),r=d.clone().sub(foot)
      const sign=Math.sign(axis.clone().cross(r).z),angle=(crease.type==='valley'?1:-1)*sign*Math.abs(edge.foldAngle)
      const folded=foot.add(r.applyAxisAngle(axis,angle)),expected=volume(vec(at.vertices[ai]),vec(at.vertices[bi]),vec(at.vertices[ci]),vec(bt.vertices[di]))
      const actual=volume(a,b,c,folded)
      assert.ok(Math.abs(actual-expected)<=Math.max(1,Math.abs(expected))*1e-5,`${consist.id}/${surface.id}/${edge.id}: reflected printed fold`)
      reconstructedFolds++
    }
  }
}
console.log(`PASS printed folding: ${reconstructedFolds} retained dihedrals reconstruct the intended 3D handedness; concave tab signs match`)
// Record real text transforms; composition with each printed UV map detects reversed lettering.
const previous=Object.getOwnPropertyDescriptor(globalThis,'document'),records=new WeakMap<HTMLCanvasElement,{text:string;det:number}[]>()
Object.defineProperty(globalThis,'document',{configurable:true,value:{createElement:()=>{
  let det=1;const stack:number[]=[],glyphs:{text:string;det:number}[]=[]
  const ctx=new Proxy({scale:(x:number,y:number)=>{det*=x*y},save:()=>stack.push(det),restore:()=>{det=stack.pop()!},fillText:(text:string)=>glyphs.push({text,det})},{get:(o,k)=>Reflect.get(o,k)||(()=>{})})
  const c={width:0,height:0,getContext:()=>ctx} as unknown as HTMLCanvasElement;records.set(c,glyphs);return c
}}})
try {
  for(const c of [compactCarConsist,pickupConsist,travelPlaneConsist,bus]) {
    const theme=PRESET_THEMES.find(t=>t.id===c.defaultThemeId)!,slots=c===bus?jointLivery():bakeTransportLivery({consistId:c.id,theme,customText:{enabled:true,kidName:'PAPER TEST'}})!
    for(const part of buildTrainConsistCars(c)[0].modelData.paperModel!.parts)for(const f of part.faces) {
      const texture=slots.get(f.textureSlot);if(!texture||f.polygon2D.length!==3)continue
      const [a,b,d]=f.polygon2D,[u,v,w]=f.uvCoords,m=AffineTextureProjector.computeAffineMatrix(a,b,d,u,v,w,texture.width,texture.height)!
      for(const glyph of records.get(texture)!)assert.ok((m.a*m.d-m.b*m.c)*glyph.det>0,`${c.id}/${part.id}/${f.textureSlot}: mirrored ${glyph.text}`)
    }
  }
} finally {if(previous)Object.defineProperty(globalThis,'document',previous);else Reflect.deleteProperty(globalThis,'document')}
console.log('PASS transport: integral accordion mounts, yaw clearance/extension, open bed, wing flanges, normals, package instructions and printed lettering')

let boundaryConfigurations=0
for(const c of CONSIST_REGISTRY) {
  for(const count of new Set([0,c.assembly?.maxMiddleCars??5])) {
    const cars=buildTrainConsistCars(c,count),pages=packConsistToA4Pages(cars)
    assert.equal(pages.flatMap(p=>p.placements).length,cars.reduce((n,c)=>n+c.modelData.partsCount,0))
    for(const page of pages){const occupied:{x:number;y:number}[][]=[];for(const p of page.placements){
      for(const poly of p.part.faces.flatMap(f=>[f.polygon2D,...f.glueTabs.map(t=>t.polygon2D!)])) {
        const points=poly.map(v=>({x:v.x+p.x,y:v.y+p.y}))
        assert.ok(points.every(v=>v.x>=PRINT_AREA.minX-1e-5&&v.x<=PRINT_AREA.maxX+1e-5&&v.y>=PRINT_AREA.minY-1e-5&&v.y<=PRINT_AREA.maxY+1e-5))
        assert.ok(occupied.every(old=>!overlaps(points,old)),`${c.id}/${count}: page overlap`);occupied.push(points)
      }
    }}
    boundaryConfigurations++
  }
  assert.equal(buildTrainConsistCars(c,-2).length,buildTrainConsistCars(c,0).length)
  assert.equal(buildTrainConsistCars(c,NaN).length,buildTrainConsistCars(c,0).length)
  assert.equal(buildTrainConsistCars(c,999).length,buildTrainConsistCars(c,c.assembly?.maxMiddleCars??5).length)
}
console.log(`PASS consists: ${boundaryConfigurations} min/max print configurations and bounded invalid counts`)
