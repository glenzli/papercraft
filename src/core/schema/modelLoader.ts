import type { PapercraftModelSchema } from './papercraftSchema'
import type { PapercraftModelData } from '../types'
import { compilePaperModel } from './compilePaperModel'

// Schema assets are immutable. Both viewers and the exporter reuse this compiled model.
const compiled = new WeakMap<PapercraftModelSchema,PapercraftModelData>()

export function loadPapercraftFromSchema(schema:PapercraftModelSchema):PapercraftModelData {
  const cached=compiled.get(schema)
  if(cached)return cached
  const paperModel=compilePaperModel(schema)
  const model:PapercraftModelData={
    id:schema.id,name:schema.name,category:schema.category==='bus'?'bus':schema.category==='vehicle'?'vehicle':'train',description:schema.description,
    difficulty:schema.difficulty==='easy'?'beginner':schema.difficulty==='medium'?'intermediate':'advanced',
    recommendedAge:schema.recommendedAge,estimatedTime:schema.estimatedTime,partsCount:paperModel.parts.length,dimensions:schema.dimensions,paperModel,
    create3DParts:()=>paperModel.surfaces.map(surface=>({
      id:surface.id,name:surface.name,explodeOffset:[0,0,0],
      meshData:{vertices:surface.triangles.flatMap(f=>f.vertices.flatMap(p=>[p.x*.01,p.y*.01,p.z*.01])),uvs:surface.triangles.flatMap(f=>f.uvs.flatMap(p=>[p.x,p.y])),indices:surface.triangles.flatMap((_,i)=>[i*3,i*3+1,i*3+2])}
    })),
    generateUnfoldedParts:()=>paperModel.parts
  }
  compiled.set(schema,model)
  return model
}
