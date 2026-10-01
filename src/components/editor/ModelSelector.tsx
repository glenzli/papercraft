import { ARTICULATED_GAP_MM } from '../../core/schema/accessories/articulatedJoint'
// 纸模车型与载具选择控制器 (支持多品类筛选、单体载具/列车编组自适应、双语与 .papercraft 导入导出)
import React from 'react'
import { packConsistToA4Pages } from '../../core/unfoldEngine'
import { difficultyLabel, modelCategoryLabel } from '../../core/models/catalog'
import { ConsistCarItem } from '../../core/models/consistManager'
import { TrainModelConsist } from '../../core/schema/consistSchema'
import { ModelManifestItem } from '../../core/models/modelRepository'
import { Plus, Minus, Layers, Download, Car, Search } from 'lucide-react'
import { useI18n } from '../../i18n'

interface ModelSelectorProps {
  currentConsist: TrainModelConsist
  modelManifest: ModelManifestItem[]
  onOpenLibrary: () => void
  onExportPackage: () => void
  middleCarCount: number
  onMiddleCarCountChange: (count: number) => void
  cars: ConsistCarItem[]
  themeMode?: 'light' | 'dark'
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  currentConsist,
  modelManifest,
  onOpenLibrary,
  onExportPackage,
  middleCarCount,
  onMiddleCarCountChange,
  cars,
  themeMode = 'dark'
}) => {
  const { t, isZh } = useI18n()
  
  const isLight = themeMode === 'light'
  const isSingleVehicle = !currentConsist.carDefinitions.middle || currentConsist.assembly?.allowConsistCount === false
  const maxMiddleCars = currentConsist.carDefinitions.middle ? (currentConsist.assembly?.maxMiddleCars ?? 5) : 0
  const pageCount = packConsistToA4Pages(cars).length
  // 计算整车/整列总长度 (mm)
  const totalLengthMm = cars.reduce((sum, car) => sum + car.modelData.dimensions.length, 0) + Math.max(0,cars.length-1)*(currentConsist.assembly?.type==='articulated'?ARTICULATED_GAP_MM:8)
  const pieces = cars.reduce((n, car) => n + car.modelData.partsCount, 0)
  const strips = cars.reduce((n, car) => n + car.modelData.generateUnfoldedParts().filter(p => p.kind === 'join-strip').length, 0)
  const warnings = cars.flatMap(car => (car.modelData.paperModel?.diagnostics || []).filter(d => d.severity === 'warning').map(d => `${car.carIndex + 1} · ${d.message}`))


  return (
    <div className="space-y-3 text-xs select-none">
      <button onClick={onOpenLibrary} className={`w-full p-3 rounded-xl border text-left transition-colors ${isLight?'bg-zinc-50 border-zinc-200 hover:border-sky-400':'bg-zinc-950 border-zinc-700 hover:border-sky-500'}`}>
        <span className="flex items-center justify-between text-[11px] opacity-60 mb-2"><span>{isZh?'当前模型':'Current model'}</span><Search className="w-4 h-4"/></span>
        <span className="block font-semibold text-sm leading-5">{isZh?currentConsist.name:currentConsist.nameEn||currentConsist.name}</span>
        <span className="block text-[11px] opacity-60 mt-1">{modelCategoryLabel(currentConsist.category,isZh)} · {difficultyLabel(currentConsist.difficulty,isZh)}</span>
        <span className="block text-sky-600 dark:text-sky-400 text-xs font-medium mt-3">{isZh?`浏览模型库 (${modelManifest.length})`:`Browse model library (${modelManifest.length})`}</span>
      </button>
      <p className="text-[11px] opacity-60 leading-5">{isZh?currentConsist.description:currentConsist.descriptionEn||currentConsist.description}</p>

      {/* 2. 形态与装配控制器 (自适应单车与多节列车) */}
      <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'} space-y-2.5`}>
        {isSingleVehicle ? (
          /* 单体车辆模式 (如公交车、特种车) */
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-xs">
                <Car className="w-3.5 h-3.5 text-sky-500" />
                <span>{currentConsist.assembly?.type==='articulated'?(isZh?'双节柔性铰接':'Two-section paper articulation'):t('models.singleVehicleSettings')}</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold">
                {isZh?`${cars.length} 节`:`${cars.length} section${cars.length>1?'s':''}`}
              </span>
            </div>
            <p className="text-[10px] opacity-60 leading-relaxed">
              {isZh?`${pageCount} 张展开图${currentConsist.carDefinitions.head.schema.assemblySteps?.length?'，另附装配说明。':'。'}`:`${pageCount} net sheet${pageCount>1?'s':''}${currentConsist.carDefinitions.head.schema.assemblySteps?.length?' plus assembly guide.':'.'}`}
            </p>
          </div>
        ) : (
          /* 多节编组列车模式 */
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-xs">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>{t('models.consistSettings')}</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
                {t('models.totalCarsCount', { count: cars.length })}
              </span>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <span className="text-[11px] opacity-70">{t('models.middleCarsCount')}</span>
              <div className="flex items-center gap-1.5">
                <button
                  aria-label={isZh?'减少中间车厢':'Remove middle car'}
                  disabled={middleCarCount <= 0}
                  onClick={() => onMiddleCarCountChange(Math.max(0, middleCarCount - 1))}
                  className={`p-1 rounded border transition-colors ${
                    isLight ? 'bg-white border-zinc-200 hover:bg-zinc-100' : 'bg-zinc-900 border-zinc-700 hover:bg-zinc-800'
                  } disabled:opacity-30`}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono font-bold w-4 text-center text-xs">{middleCarCount}</span>
                <button
                  aria-label={isZh?'增加中间车厢':'Add middle car'}
                  disabled={middleCarCount >= maxMiddleCars}
                  onClick={() => onMiddleCarCountChange(Math.min(maxMiddleCars, middleCarCount + 1))}
                  className={`p-1 rounded border transition-colors ${
                    isLight ? 'bg-white border-zinc-200 hover:bg-zinc-100' : 'bg-zinc-900 border-zinc-700 hover:bg-zinc-800'
                  } disabled:opacity-30`}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 快速编组预设 */}
            <div className="grid grid-cols-4 gap-1 text-[10px]">
              {[
                { label: t('models.presetShort'), count: 0 },
                { label: t('models.presetStandard'), count: 1 },
                { label: t('models.presetLong'), count: 2 },
                { label: t('models.presetExtended'), count: 4 }
              ].filter(p => p.count <= maxMiddleCars).map(p => (
                <button
                  key={p.label}
                  onClick={() => onMiddleCarCountChange(p.count)}
                  className={`py-1 rounded border transition-colors ${
                    middleCarCount === p.count
                      ? isLight
                        ? 'bg-zinc-900 text-white border-zinc-900 font-medium'
                        : 'bg-zinc-100 text-zinc-900 border-zinc-100 font-medium'
                      : isLight
                        ? 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* 规格明细 */}
        <div className={`p-2 rounded border ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'} space-y-1 text-[10px]`}>
          <div className="flex justify-between">
            <span className="opacity-60">{t('models.totalLength')}</span>
            <span className="font-mono font-medium">{totalLengthMm} mm</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">{t('models.sheetPages')}</span>
            <span className="font-mono font-medium">{t('models.pagesUnit', { count: pageCount })}{currentConsist.carDefinitions.head.schema.assemblySteps?.length ? (isZh?' + 1 说明页':' + 1 guide') : ''}</span>
          </div>
        </div>
      </div>

      <div className="text-[10px] opacity-70 leading-relaxed">
        {isZh ? `${pieces} 个裁剪部件${strips ? `，含 ${strips} 条接缝连接条` : ''}。同一车厢内按接缝编号配对。` : `${pieces} cut pieces${strips ? `, including ${strips} joining strips` : ''}. Match seam numbers within each car.`}
        {warnings.length > 0 && <details className="mt-1 text-amber-600"><summary>{isZh ? `制作提示 (${warnings.length})` : `Assembly notes (${warnings.length})`}</summary>{warnings.map((warning,i)=><div key={i}>{warning}</div>)}</details>}
      </div>

      {/* 3. 导出当前模型按钮 */}
      <button
        onClick={onExportPackage}
        className={`w-full py-1.5 px-3 rounded-lg border text-xs flex items-center justify-center gap-1.5 transition-colors ${
          isLight
            ? 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
        }`}
      >
        <Download className="w-3.5 h-3.5 text-emerald-500" />
        <span>{t('models.exportPapercraftBtn')}</span>
      </button>
    </div>
  )
}
