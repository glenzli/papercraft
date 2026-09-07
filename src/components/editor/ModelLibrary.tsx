import { useEffect, useRef, useState } from 'react'
import { Search, X, FolderOpen, Train, Bus, Shapes, Check } from 'lucide-react'
import { ModelManifestItem } from '../../core/models/modelRepository'
import { difficultyLabel, matchesCatalogQuery, modelCategoryLabel } from '../../core/models/catalog'
import { useI18n } from '../../i18n'

interface Props {
  open:boolean;onClose:()=>void;models:ModelManifestItem[];selectedId:string
  onSelect:(id:string)=>void;onImport:(file:File)=>void;themeMode:'light'|'dark'
}
export function ModelLibrary({open,onClose,models,selectedId,onSelect,onImport,themeMode}:Props) {
  const {isZh}=useI18n(),dialog=useRef<HTMLDialogElement>(null),input=useRef<HTMLInputElement>(null),search=useRef<HTMLInputElement>(null)
  const [query,setQuery]=useState(''),[category,setCategory]=useState('all'),[difficulty,setDifficulty]=useState('all')
  useEffect(()=>{if(open){dialog.current?.showModal();search.current?.focus()}else dialog.current?.close()},[open])
  const categories=[...new Set(models.map(m=>m.category))]
  const filtered=models.filter(m=>(category==='all'||m.category===category)&&(difficulty==='all'||m.difficulty===difficulty)&&matchesCatalogQuery(query,[m.name,m.nameEn,m.id,m.description,m.descriptionEn,modelCategoryLabel(m.category,isZh)]))
  const light=themeMode==='light',control=`rounded-lg border px-3 py-2 text-sm ${light?'bg-white border-zinc-200':'bg-zinc-900 border-zinc-700'}`
  const reset=()=>{setQuery('');setCategory('all');setDifficulty('all')}
  return <dialog ref={dialog} onCancel={onClose} onClose={onClose} aria-labelledby="model-library-title" className={`w-[min(960px,calc(100vw-24px))] max-h-[min(800px,calc(100dvh-32px))] p-0 rounded-2xl border shadow-2xl backdrop:bg-black/45 ${light?'bg-white text-zinc-900 border-zinc-200':'bg-zinc-950 text-zinc-100 border-zinc-700'}`}>
    <div className="flex flex-col max-h-[min(800px,calc(100dvh-32px))]">
      <div className={`p-5 border-b ${light?'border-zinc-200':'border-zinc-800'}`}>
        <div className="flex justify-between items-start gap-3 mb-4">
          <div><h2 id="model-library-title" className="font-semibold text-lg">{isZh?'模型库':'Model library'}</h2><p className="text-xs opacity-60 mt-1">{isZh?'按名称、车型或难度查找，选择后开始制作。':'Search by name, category or difficulty, then choose a model.'}</p></div>
          <button onClick={onClose} aria-label={isZh?'关闭模型库':'Close model library'} className="p-2 rounded-lg hover:bg-zinc-500/10"><X className="w-5 h-5"/></button>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className={`flex items-center gap-2 flex-1 min-w-44 ${control}`}><Search className="w-4 h-4 opacity-50"/><input ref={search} value={query} onChange={e=>setQuery(e.target.value)} aria-label={isZh?'搜索模型':'Search models'} placeholder={isZh?'搜索：Haruka、公交、黑武士…':'Search: Haruka, bus, Rapi:t…'} className="bg-transparent outline-none w-full"/>{query&&<button onClick={()=>setQuery('')} aria-label={isZh?'清除搜索':'Clear search'}><X className="w-4 h-4"/></button>}</label>
          <select aria-label={isZh?'模型类别':'Model category'} value={category} onChange={e=>setCategory(e.target.value)} className={control}><option value="all">{isZh?'全部类别':'All categories'}</option>{categories.map(c=><option value={c} key={c}>{modelCategoryLabel(c,isZh)} ({models.filter(m=>m.category===c).length})</option>)}</select>
          <select aria-label={isZh?'制作难度':'Crafting difficulty'} value={difficulty} onChange={e=>setDifficulty(e.target.value)} className={control}><option value="all">{isZh?'全部难度':'All difficulties'}</option>{['easy','medium','hard'].map(d=><option key={d} value={d}>{difficultyLabel(d,isZh)}</option>)}</select>
        </div>
      </div>
      <div className="overflow-y-auto p-5 flex-1 min-h-0">
        <div role="status" className="text-xs opacity-60 mb-3">{isZh?`${filtered.length} / ${models.length} 个模型`:`${filtered.length} of ${models.length} models`}</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(m=>{
            const selected=m.id===selectedId,Icon=m.category==='bus'?Bus:['commuter','shinkansen','steam','freight','retro'].includes(m.category)?Train:Shapes
            return <button key={m.id} onClick={()=>{onSelect(m.id);onClose()}} aria-pressed={selected} className={`text-left p-4 rounded-xl border flex flex-col gap-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500 ${selected?'border-sky-500 bg-sky-500/10':light?'border-zinc-200 hover:border-zinc-400 bg-zinc-50/50':'border-zinc-800 hover:border-zinc-500 bg-zinc-900/60'}`}>
              <div className="flex items-center justify-between"><Icon className="w-6 h-6 text-sky-600 dark:text-sky-400"/>{selected&&<span className="flex gap-1 text-xs text-sky-600 dark:text-sky-400"><Check className="w-4 h-4"/>{isZh?'当前模型':'Selected'}</span>}</div>
              <div className="flex-1"><h3 className="font-semibold text-sm leading-5">{isZh?m.name:m.nameEn||m.name}</h3><p className="text-xs opacity-60 leading-5 mt-1 line-clamp-2">{isZh?m.description:m.descriptionEn||m.description}</p></div>
              <div className="flex gap-2 flex-wrap text-[11px] opacity-70"><span>{modelCategoryLabel(m.category,isZh)}</span><span>· {difficultyLabel(m.difficulty,isZh)}</span>{m.isCustom&&<span>{isZh?'已导入':'Imported'}</span>}</div>
            </button>
          })}
        </div>
        {!filtered.length&&<div className="text-center py-12"><p className="text-sm opacity-70">{isZh?'没有符合条件的模型':'No matching models'}</p><button className="text-sky-600 text-sm mt-3 underline" onClick={reset}>{isZh?'清除筛选':'Clear filters'}</button></div>}
      </div>
      <div className={`px-5 py-3 border-t flex justify-between items-center gap-3 ${light?'border-zinc-200 bg-zinc-50':'border-zinc-800 bg-zinc-900'}`}>
        <span className="text-xs opacity-60">{isZh?'已有模型包？':'Have a model package?'}</span><button onClick={()=>input.current?.click()} className="flex items-center gap-2 text-sm font-medium text-sky-600 dark:text-sky-400"><FolderOpen className="w-4 h-4"/>{isZh?'导入 .papercraft':'Import .papercraft'}</button>
        <input ref={input} type="file" accept=".papercraft,.json" className="hidden" onChange={e=>{const file=e.target.files?.[0];if(file){onImport(file);onClose()}e.target.value=''}}/>
      </div>
    </div>
  </dialog>
}
