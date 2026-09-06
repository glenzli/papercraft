// 纸模车型与载具选择控制器 (支持多品类筛选、单体载具/列车编组自适应、双语与 .papercraft 导入导出)
import React, { useState, useRef } from 'react'
import { ConsistCarItem } from '../../core/models/consistManager'
import { TrainModelConsist } from '../../core/schema/consistSchema'
import { ModelManifestItem } from '../../core/models/modelRepository'
import { Train, Bus, Check, Plus, Minus, Layers, FolderOpen, Download, Car } from 'lucide-react'
import { useI18n } from '../../i18n'

interface ModelSelectorProps {
  currentConsist: TrainModelConsist
  modelManifest: ModelManifestItem[]
  onSelectConsistById: (id: string) => void
  onImportFile: (file: File) => void
  onExportPackage: () => void
  middleCarCount: number
  onMiddleCarCountChange: (count: number) => void
  cars: ConsistCarItem[]
  themeMode?: 'light' | 'dark'
}

type CategoryFilter = 'trains' | 'cars'

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  currentConsist,
  modelManifest,
  onSelectConsistById,
  onImportFile,
  onExportPackage,
  middleCarCount,
  onMiddleCarCountChange,
  cars,
  themeMode = 'dark'
}) => {
  const { t, isZh } = useI18n()
  
  // 根据当前车型自动判定所属品类 (轨道列车 vs 汽车)
  const initialCategory: CategoryFilter = currentConsist.category === 'bus' ? 'cars' : 'trains'
  const [filter, setFilter] = useState<CategoryFilter>(initialCategory)
  const isLight = themeMode === 'light'
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isSingleVehicle = currentConsist.assembly?.type === 'single' || currentConsist.assembly?.allowConsistCount === false

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImportFile(file)
    }
    if (e.target) {
      e.target.value = ''
    }
  }

  // 计算整车/整列总长度 (mm)
  const totalLengthMm = cars.reduce((sum, car) => sum + car.modelData.dimensions.length + 8, 0) - 8
  const pieces = cars.reduce((n, car) => n + car.modelData.partsCount, 0)
  const strips = cars.reduce((n, car) => n + car.modelData.generateUnfoldedParts().filter(p => p.kind === 'join-strip').length, 0)
  const warnings = cars.flatMap(car => (car.modelData.paperModel?.diagnostics || []).filter(d => d.severity === 'warning').map(d => `${car.carIndex + 1} · ${d.message}`))


  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'commuter': return t('models.categoryCommuter')
      case 'shinkansen': return t('models.categoryShinkansen')
      case 'steam': return t('models.categorySteam')
      case 'bus': return t('models.categoryBus')
      case 'vehicle': return t('models.categoryBus')
      case 'retro': return t('models.categoryRetro')
      default: return category.toUpperCase()
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return t('models.difficultyEasy')
      case 'medium': return t('models.difficultyMedium')
      case 'hard': return t('models.difficultyHard')
      default: return difficulty.toUpperCase()
    }
  }

  // 过滤模型列表 (轨道列车 vs 汽车)
  const filteredManifest = modelManifest.filter(item => {
    if (filter === 'trains') return ['commuter', 'shinkansen', 'steam', 'retro'].includes(item.category)
    if (filter === 'cars') return ['bus', 'vehicle', 'car', 'truck'].includes(item.category)
    return true
  })

  // 切换品类时自动选中该品类下的第一个模型
  const handleCategorySwitch = (nextCategory: CategoryFilter) => {
    setFilter(nextCategory)
    const matches = modelManifest.filter(item => {
      if (nextCategory === 'trains') return ['commuter', 'shinkansen', 'steam', 'retro'].includes(item.category)
      if (nextCategory === 'cars') return ['bus', 'vehicle', 'car', 'truck'].includes(item.category)
      return true
    })
    if (matches.length > 0 && !matches.some(m => m.id === currentConsist.id)) {
      onSelectConsistById(matches[0].id)
    }
  }

  return (
    <div className="space-y-3 text-xs select-none">
      <input
        ref={fileInputRef}
        type="file"
        accept=".papercraft,.json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 1. 载具直接分类别与导入 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-medium opacity-60">
          <span>{t('models.selectSeries')}</span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 text-indigo-500 hover:text-indigo-600 font-normal cursor-pointer"
          >
            <FolderOpen className="w-3 h-3" />
            {t('models.importFile')}
          </button>
        </div>

        {/* 轨道列车 vs 汽车 二分胶囊切换栏 */}
        <div className={`flex p-0.5 rounded-lg border ${isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-950 border-zinc-800'} text-[11px]`}>
          {[
            { id: 'trains', label: t('models.filterTrains'), icon: Train },
            { id: 'cars', label: t('models.filterCars'), icon: Bus }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => handleCategorySwitch(f.id as CategoryFilter)}
              className={`flex-1 py-1.5 rounded-md transition-all font-medium flex items-center justify-center gap-1.5 ${
                filter === f.id
                  ? isLight
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'bg-zinc-800 text-white shadow-xs'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <f.icon className="w-3.5 h-3.5" />
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-1.5 max-h-[220px] overflow-y-auto pr-0.5">
          {filteredManifest.map(item => {
            const isSelected = currentConsist.id === item.id
            const displayName = isZh ? item.name : (item.nameEn || item.name)
            const isBus = item.category === 'bus'

            return (
              <div
                key={item.id}
                onClick={() => onSelectConsistById(item.id)}
                className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? isLight
                      ? 'bg-zinc-100 border-zinc-900 ring-1 ring-zinc-900 shadow-xs'
                      : 'bg-zinc-800 border-zinc-500 ring-1 ring-zinc-500 shadow-xs'
                    : isLight
                      ? 'bg-white border-zinc-200 hover:bg-zinc-50'
                      : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className={`p-1 rounded-md ${isSelected ? (isLight ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900') : (isLight ? 'bg-zinc-100 text-zinc-700' : 'bg-zinc-800 text-zinc-400')}`}>
                      {isBus ? <Bus className="w-3 h-3" /> : <Train className="w-3 h-3" />}
                    </div>
                    <span className="font-semibold text-xs">{displayName}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </div>

                <div className="flex items-center gap-1.5 text-[9px] opacity-60 pt-0.5">
                  <span className={`px-1 py-0.2 rounded border ${isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-950 border-zinc-800'}`}>
                    {getCategoryLabel(item.category)}
                  </span>
                  <span className={`px-1 py-0.2 rounded border ${isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-950 border-zinc-800'}`}>
                    {t('models.difficulty')}: {getDifficultyLabel(item.difficulty)}
                  </span>
                  {item.isCustom && (
                    <span className="px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-mono">
                      {t('models.customImport')}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. 形态与装配控制器 (自适应单车与多节列车) */}
      <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'} space-y-2.5`}>
        {isSingleVehicle ? (
          /* 单体车辆模式 (如公交车、特种车) */
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-xs">
                <Car className="w-3.5 h-3.5 text-sky-500" />
                <span>{t('models.singleVehicleSettings')}</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold">
                {t('models.singleVehicleBadge')}
              </span>
            </div>
            <p className="text-[10px] opacity-60 leading-relaxed">
              {t('models.singleVehicleBlueprint')}
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
                  disabled={middleCarCount >= 5}
                  onClick={() => onMiddleCarCountChange(Math.min(5, middleCarCount + 1))}
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
              ].map(p => (
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
            <span className="font-mono font-medium">{t('models.pagesUnit', { count: cars.length })}</span>
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
