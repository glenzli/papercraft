import { ParametricTrainMeshFactory } from '../src/core/unfolder/parametricTrainMesh'
import assert from 'node:assert/strict'
import { BoxGeometry, BufferGeometry, Float32BufferAttribute } from 'three'
import { ThreeMeshUnfolder } from '../src/core/unfolder/ThreeMeshUnfolder'
import { CONSIST_REGISTRY, buildTrainConsistCars } from '../src/core/models/consistManager'
import { PRINT_AREA, packConsistToA4Pages, rotateUnfoldedPart, packPartsToA4 } from '../src/core/unfoldEngine'
import { dist2, isIsometric, overlaps } from '../src/core/paper/geometry'
import { AffineTextureProjector } from '../src/core/unfolder/AffineTextureProjector'
import { buildSurface, type TriangleInput } from '../src/core/paper/topology'
import { compilePaperModel } from '../src/core/schema/compilePaperModel'
import { cr400HeadMasterSchema } from '../src/core/schema/models/consistCR400Master'
import { clipSegment } from '../src/core/paper/interiorMarks'
import { getPrintMarks, partCaptionPolygon } from '../src/core/paper/printMarks'
import { drawPageVectors } from '../src/export/pdfExporter'
import { jsPDF } from 'jspdf'
import type { PaperModel, Triple } from '../src/core/paper/types'
import type { Point2D, Point3D } from '../src/core/types'

const near=(a:number,b:number,eps=1e-5)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`)
function checkModel(model:PaperModel) {
  const triangles=model.surfaces.flatMap(s=>s.triangles)
  const printed=model.parts.filter(p=>p.kind==='surface').flatMap(p=>p.faces)
  assert.deepEqual(printed.map(f=>f.id).sort(),triangles.map(t=>t.id).sort(),'Every physical triangle appears exactly once')
  for(const part of model.parts) {
    const polygons=part.faces.flatMap(f=>[f.polygon2D,...f.glueTabs.map(t=>t.polygon2D!)])
    for(let i=0;i<polygons.length;i++)for(let j=0;j<i;j++)assert.ok(!overlaps(polygons[i],polygons[j]),`${part.id}: paper/tab overlap`)
    for(const face of part.faces) {
      if(!face.vertices3D)continue
      assert.ok(isIsometric(face.vertices3D as Triple<Point3D>,face.polygon2D as Triple<Point2D>),face.id)
      for(const rotated of [face,rotateUnfoldedPart(part,90).faces.find(f=>f.id===face.id)!]) {
        const [a,b,c]=rotated.polygon2D,[u,v,w]=rotated.uvCoords
        const m=AffineTextureProjector.computeAffineMatrix(a,b,c,u,v,w,1024,512)!
        assert.ok(m,`Invertible UV: ${face.id}`)
        rotated.uvCoords.forEach((uv,i)=>{
          near(m.a*uv.x*1024+m.c*(1-uv.y)*512+m.e,rotated.polygon2D[i].x)
          near(m.b*uv.x*1024+m.d*(1-uv.y)*512+m.f,rotated.polygon2D[i].y)
        })
      }
    }
  }
  for(const seam of model.seams) {
    const sides=seam.sides.map(side=>{
      const part=model.parts.find(p=>p.id===side.partId)!,face=part.faces.find(f=>f.id===side.faceId)!
      assert.ok(face)
      near(dist2(face.polygon2D[side.edgeIndex],face.polygon2D[(side.edgeIndex+1)%3]),seam.length)
      return face
    })
    const tabs=sides.flatMap(f=>f.glueTabs.filter(t=>t.seamId===seam.id))
    if(seam.attachment==='tab') {
      assert.equal(tabs.length,1)
      const target=seam.sides.find(s=>s.faceId===tabs[0].targetFaceId)!
      assert.equal(target.partId,tabs[0].targetPartId);assert.equal(target.edgeIndex,tabs[0].targetEdgeIndex)
    } else {assert.equal(tabs.length,0);assert.equal(model.parts.filter(p=>p.id===`${seam.id}/strip`).length,1)}
    assert.ok(sides.some(f=>f.creases.some(c=>c.label===seam.label&&c.seamId===seam.id)))
  }
}

assert.equal(ParametricTrainMeshFactory.createBoxCar().unfold().flatMap(i=>i.faces).filter(f=>f.face3DId>=0).length,12,'Polygon factory shares the same engine')
assert.ok(ParametricTrainMeshFactory.createHarukaHead().unfold().length>0)
const cube=new ThreeMeshUnfolder().loadFromBufferGeometry(new BoxGeometry(20,20,20)).unfold()
assert.equal(cube.flatMap(i=>i.faces).filter(f=>f.face3DId>=0).length,12,'UV seams must not lose box faces')
assert.equal(cube.length,1,'A simple cube remains one piece')
const unindexed=new ThreeMeshUnfolder().loadFromBufferGeometry(new BoxGeometry(20,20,20).toNonIndexed()).unfold()
assert.equal(unindexed.flatMap(i=>i.faces).filter(f=>f.face3DId>=0).length,12)
const disconnected=new BufferGeometry().setAttribute('position',new Float32BufferAttribute([0,0,0,10,0,0,0,10,0,30,0,0,40,0,0,30,10,0],3))
assert.equal(new ThreeMeshUnfolder().loadFromBufferGeometry(disconnected).unfold().length,2)
const t=(id:string,points:number[][]):TriangleInput=>({id,sourceFaceId:id,name:id,textureSlot:'test',vertices:points.map(([x,y,z])=>({x,y,z})) as Triple<Point3D>,uvs:[{x:0,y:0},{x:1,y:0},{x:0,y:1}]})
assert.throws(()=>buildSurface({id:'bad',name:'bad',isAccessory:false,triangles:[t('a',[[0,0,0],[10,0,0],[0,10,0]]),t('b',[[0,0,0],[10,0,0],[0,0,10]]),t('c',[[0,0,0],[10,0,0],[0,-10,0]])]},[]),/non-manifold/)
const tee=buildSurface({id:'tee',name:'tee',isAccessory:false,triangles:[t('long',[[0,0,0],[10,0,0],[0,10,0]]),t('short',[[0,0,0],[5,0,0],[0,-10,0]])],cutEdges:[[{x:0,y:0,z:0},{x:10,y:0,z:0}]]},[])
assert.ok(tee.triangles.length>2,'T junction is subdivided')
assert.equal(tee.edges.filter(e=>e.forceCut).length,2,'Explicit cut survives subdivision')
const clipped=clipSegment({x:-1,y:2},{x:9,y:2},[{x:0,y:0},{x:10,y:0},{x:0,y:10}])!
near(clipped[0].x,0);near(clipped[1].x,8)

let totalTriangles=0,totalParts=0,totalPages=0
for(const consist of CONSIST_REGISTRY) {
  const cars=buildTrainConsistCars(consist,1),pages=packConsistToA4Pages(cars)
  for(const car of cars) {checkModel(car.modelData.paperModel!);totalTriangles+=car.modelData.paperModel!.surfaces.reduce((n,s)=>n+s.triangles.length,0);totalParts+=car.modelData.partsCount}
  const expected=cars.flatMap(c=>c.modelData.generateUnfoldedParts().map(p=>`${c.carIndex}:${p.id}`)).sort()
  assert.deepEqual(pages.flatMap(p=>p.placements.map(p=>`${p.carIndex}:${p.part.id}`)).sort(),expected)
  for(const page of pages) {
    const carIds=new Set(page.placements.map(p=>p.carIndex))
    if(carIds.size>1) {
      assert.equal(page.car,undefined,'Mixed sheets must not use a single-car PDF heading')
      assert.ok(page.pageTitle.includes('Shared parts'))
    }
    const occupied:Point2D[][]=[]
    for(const placement of page.placements) {
      const polys=placement.part.faces.flatMap(f=>[f.polygon2D,...f.glueTabs.map(t=>t.polygon2D!)]).map(p=>p.map(v=>({x:v.x+placement.x,y:v.y+placement.y})))
      for(const poly of polys) {
        for(const v of poly)assert.ok(v.x>=PRINT_AREA.minX-1e-5&&v.x<=PRINT_AREA.maxX+1e-5&&v.y>=PRINT_AREA.minY-1e-5&&v.y<=PRINT_AREA.maxY+1e-5,`${consist.id}: outside A4`)
        assert.ok(occupied.every(other=>!overlaps(poly,other)),`${consist.id}: placement collision`)
      }
      const caption=partCaptionPolygon(placement.part,placement.carIndex).map(p=>({x:p.x+placement.x,y:p.y+placement.y}))
      assert.ok(occupied.every(other=>!overlaps(caption,other)),`${consist.id}: caption collision`)
      occupied.push(...polys,caption)
    }
  }
  if(consist.id==='cr400-master-consist') {
    assert.equal(pages.length,4,'Spare nose panels share sheets across the consist')
    assert.ok(pages.some(p=>new Set(p.placements.filter(p=>!p.part.isAccessory).map(p=>p.carIndex)).size>1),'Construction panels from different cars can share a sheet')
    const paper=cars[0].modelData.paperModel!,body=paper.surfaces[0]
    assert.equal(body.edges.filter(e=>e.faces.length!==2).length,0,'CR400 body is closed')
    const bodyParts=paper.parts.filter(p=>p.sourcePartId===body.id)
    assert.equal(bodyParts.length,6,'Six construction panels without extra backing strips')
    for(const region of cr400HeadMasterSchema.parts[0].unfoldRegions!) {
      const members=body.triangles.filter(t=>t.unfoldRegion?.id===region.id)
      const island=bodyParts.find(p=>p.faces.some(f=>f.id===members[0]?.id))!
      assert.ok(island,region.id)
      assert.deepEqual(island.faces.map(f=>f.id).sort(),members.map(t=>t.id).sort(),`${region.id} stays complete`)
      assert.ok(island.faces.length>=4,'No isolated windshield fragment')
    }
    const left=bodyParts.find(p=>p.faces.some(f=>f.sourceFaceId==='side_left'&&f.id.endsWith('/8')))!
    const right=bodyParts.find(p=>p.faces.some(f=>f.sourceFaceId==='side_right'&&f.id.endsWith('/8')))!
    const pairs=left.faces.flatMap(f=>f.vertices3D!.map((v,i)=>{
      const mirror=right.faces.flatMap(g=>g.vertices3D!.map((w,j)=>({w,p:g.polygon2D[j]}))).find(({w})=>Math.abs(w.x+v.x)<1e-5&&Math.abs(w.y-v.y)<1e-5&&Math.abs(w.z-v.z)<1e-5)!
      assert.ok(mirror,'Both cheeks have corresponding physical corners')
      return [f.polygon2D[i],mirror.p]
    }))
    for(const a of pairs)for(const b of pairs)near(dist2(a[0],b[0]),dist2(a[1],b[1]))
    const noRegions=structuredClone(cr400HeadMasterSchema)
    delete noRegions.parts[0].unfoldRegions
    const original=compilePaperModel(noRegions).surfaces[0]
    assert.deepEqual(body.triangles.map(({unfoldRegion,...t})=>t),original.triangles,'Construction cuts preserve all 3D and UV data')
    const bottom=cars[0].modelData.generateUnfoldedParts().flatMap(p=>p.faces).filter(f=>f.sourceFaceId==='bottom')
    const slots=bottom.flatMap(f=>f.creases.filter(c=>c.type==='cut'&&!c.edgeId))
    near(slots.reduce((sum,c)=>sum+dist2(c.p1,c.p2),0),18)
    const doc=new jsPDF({unit:'mm',format:'a4'})
    drawPageVectors(doc,pages[0]);const output=doc.output()
    assert.ok(output.includes(' m\n')&&output.includes(' l\n'),'PDF contains vector paths')
    assert.ok(output.includes('(1.1)'),'PDF contains seam number text')
  }
  if(consist.id==='romancecar-gse-master-consist') {
    for(const car of [cars[0],cars[cars.length-1]]) {
      const sides=car.modelData.paperModel!.surfaces[0].triangles.filter(t=>t.sourceFaceId==='side_left'||t.sourceFaceId==='side_right')
      for(const triangle of sides) {
        // Every triangle and its interpolated interior must share one affine side projection.
        // This catches sheared windows despite otherwise valid UV-to-net correspondence.
        for(const weights of [[1,0,0],[0,1,0],[0,0,1],[.2,.3,.5]]) {
          const z=triangle.vertices.reduce((s,v,i)=>s+weights[i]*v.z,0)
          const y=triangle.vertices.reduce((s,v,i)=>s+weights[i]*v.y,0)
          near(triangle.uvs.reduce((s,v,i)=>s+weights[i]*v.x,0),(84-z)/164)
          near(triangle.uvs.reduce((s,v,i)=>s+weights[i]*v.y,0),y/46)
        }
      }
    }
  }
  totalPages+=pages.length
  console.log(`PASS ${consist.id}: ${cars.reduce((n,c)=>n+c.modelData.partsCount,0)} pieces / ${pages.length} A4 pages`)
}
const schema=structuredClone(CONSIST_REGISTRY.find(c=>c.id==='e235-consist')?.carDefinitions.head.schema || CONSIST_REGISTRY[11].carDefinitions.head.schema)
const invalidRegion=structuredClone(cr400HeadMasterSchema)
invalidRegion.parts[0].unfoldRegions![1].faces[0].triangles=[999]
assert.throws(()=>compilePaperModel(invalidRegion),/unknown unfold triangle/)
invalidRegion.parts[0].unfoldRegions![1].faces[0].triangles=[0]
assert.throws(()=>compilePaperModel(invalidRegion),/overlapping unfold regions/)
const simple=compilePaperModel(schema)
assert.equal(simple.parts.filter(p=>!p.isAccessory).length,1,'Simple train body stays one island')
assert.equal(packPartsToA4(simple.parts).pages.flatMap(p=>p.parts).length,simple.parts.length)
const firstTab=simple.parts.flatMap(p=>p.faces).flatMap(f=>f.glueTabs)[0]
assert.ok(firstTab)
const owningPart=simple.parts.find(p=>p.faces.some(f=>f.glueTabs.includes(firstTab)))!
assert.ok(!getPrintMarks(owningPart).lines.some(l=>l.type==='cut'&&dist2(l.p1,firstTab.p1)<1e-5&&dist2(l.p2,firstTab.p2)<1e-5),'Do not cut the tab base')
schema.parts[0].faces[0].indices[0]=99999
assert.throws(()=>compilePaperModel(schema),/outside/)
console.log(`PASS contracts: ${CONSIST_REGISTRY.length} families, ${totalTriangles} triangles, ${totalParts} pieces, ${totalPages} pages`)
