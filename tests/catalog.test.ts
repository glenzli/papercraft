import assert from 'node:assert/strict'
import { CONSIST_REGISTRY } from '../src/core/models/consistManager'
import { PRESET_THEMES } from '../src/texture/presetThemes'
import { matchesCatalogQuery, modelCategoryLabel } from '../src/core/models/catalog'
import { isLiveryCompatible } from '../src/core/schema/liverySchema'
import { ModelRepository } from '../src/core/models/modelRepository'
import { buildPapercraftZipPackage } from '../src/core/schema/papercraftFormat'
import { createModelDraft } from '../src/components/editor/useModelDrafts'

assert.ok(matchesCatalogQuery('rapit',['南海 Rapi:t 50000系']))
assert.ok(matchesCatalogQuery('Haruka 281',['Haruka 281系 · 精细版']))
assert.ok(matchesCatalogQuery('black warrior',['BLACK-WARRIOR']))
assert.ok(!matchesCatalogQuery('飞机',['Haruka 281']))
assert.equal(modelCategoryLabel('spacecraft',true),'spacecraft','Future imported categories remain visible')
assert.ok(!isLiveryCompatible({targetCategory:'shinkansen',targetConsistIds:['haruka-kitty-consist']},'e5-consist','shinkansen'),'An explicit binding cannot be bypassed by matching category')
assert.ok(isLiveryCompatible({targetCategory:'shinkansen',targetConsistIds:[]},'e5-consist','shinkansen'))
assert.ok(!isLiveryCompatible({targetCategory:'bus',targetConsistIds:[]},'e5-consist','shinkansen'))
assert.ok(isLiveryCompatible({targetCategory:'all',targetConsistIds:[]},'future-model','spacecraft'))
const repo=new ModelRepository(),theme=PRESET_THEMES[0],target=theme.targetConsistIds![0]
repo.registerDynamicLiveries(target,[{...theme,name:'First import'}])
repo.registerDynamicLiveries(target,[{...theme,name:'Updated import'}])
assert.equal(repo.getAllLiveriesForConsist(target).filter(t=>t.id===theme.id).length,1)
assert.equal(repo.getAllLiveriesForConsist(target).find(t=>t.id===theme.id)?.name,'Updated import')
for(const model of CONSIST_REGISTRY){assert.ok(model.nameEn);assert.ok(model.descriptionEn);assert.equal(createModelDraft(model).theme.id,model.defaultThemeId);assert.ok(repo.getAllLiveriesForConsist(model.id).length>0)}
const future={...CONSIST_REGISTRY[0],id:'future-spacecraft',category:'spacecraft',defaultThemeId:undefined}
assert.equal(createModelDraft(future).theme.id,'plain-paper','Unknown models do not inherit an unrelated bus livery')
assert.equal(new Set(CONSIST_REGISTRY.map(m=>m.id)).size,CONSIST_REGISTRY.length)
assert.equal(new Set(PRESET_THEMES.map(t=>t.id)).size,PRESET_THEMES.length)
const original=CONSIST_REGISTRY.find(model=>model.assembly?.type==='single')!
const renamed={...original,name:'更新后的模型',description:'Imported metadata'}
const modelBlob=await buildPapercraftZipPackage(renamed)
const imported=await repo.loadFromFile({arrayBuffer:()=>modelBlob.arrayBuffer()} as File)
assert.ok(imported.success,imported.error)
assert.equal(repo.getManifest().filter(model=>model.id===original.id).length,1)
assert.equal(repo.getManifest().find(model=>model.id===original.id)?.name,renamed.name)
assert.equal(repo.getManifest().find(model=>model.id===original.id)?.isCustom,true)
console.log('PASS catalog: search, future categories, explicit livery bindings, replacement imports and model defaults')
