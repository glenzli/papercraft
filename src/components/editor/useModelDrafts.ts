import { useState, useMemo } from 'react'
import type { TrainModelConsist } from '../../core/schema/consistSchema'
import { modelRepository } from '../../core/models/modelRepository'
import type { TextureTheme, CustomTextConfig } from '../../texture/types'
import type { ProcessedCustomTexture } from '../../texture/customTextureImporter'

interface ModelDraft {
  theme:TextureTheme
  colors:Pick<TextureTheme['colors'],'primary'|'secondary'|'accent'|'roof'>
  useCustomColors:boolean
  text:CustomTextConfig
  middleCarCount:number
  texture:ProcessedCustomTexture['canvases']|null
}
const plainTheme:TextureTheme={id:'plain-paper',name:'素色',nameEn:'Plain color',category:'custom',liveryStyle:'custom',compatibleCategories:['all'],description:'自由设置模型底色。',descriptionEn:'Choose a base color for this model.',colors:{primary:'#ffffff',secondary:'#64748b',accent:'#334155',roof:'#e2e8f0',window:'#0f172a',frame:'#94a3b8'},stripes:{style:'none',width:0}}
export function createModelDraft(consist:TrainModelConsist):ModelDraft {
  const themes=modelRepository.getAllLiveriesForConsist(consist.id)
  const theme=themes.find(t=>t.id===consist.defaultThemeId)||themes[0]||plainTheme
  return {theme,colors:{...theme.colors},useCustomColors:false,middleCarCount:consist.assembly?.defaultMiddleCarCount??1,texture:null,text:{enabled:false,kidName:"ALEX'S EXPRESS",trainNumber:'EXP-88',destination:'新宿·东京',textColor:'#ffffff',bgColor:'#0f172a',offsetX:0,offsetY:0}}
}
/** Per-model drafts survive model/sidebar switches for this browser session. */
export function useModelDrafts(consist:TrainModelConsist) {
  const [drafts,setDrafts]=useState<Record<string,ModelDraft>>({})
  const initial=useMemo(()=>createModelDraft(consist),[consist])
  const draft=drafts[consist.id]||initial
  const update=<K extends keyof ModelDraft>(key:K,value:ModelDraft[K])=>setDrafts(previous=>({...previous,[consist.id]:{...(previous[consist.id]||createModelDraft(consist)),[key]:value}}))
  const selectTheme=(theme:TextureTheme)=>setDrafts(previous=>({...previous,[consist.id]:{...(previous[consist.id]||createModelDraft(consist)),theme:{...theme},colors:{...theme.colors},useCustomColors:false,texture:null}}))
  const reset=(id:string)=>setDrafts(previous=>{const next={...previous};delete next[id];return next})
  return {draft,update,selectTheme,reset}
}
