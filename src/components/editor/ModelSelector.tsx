// 纸模车型与编组控制器 (支持动态 Manifest 列表与 .papercraft 导入导出)
import React, { useRef } from 'react'
import { ConsistCarItem } from '../../core/models/consistManager'
import { TrainModelConsist } from '../../core/schema/consistSchema'
import { ModelManifestItem } from '../../core/models/modelRepository'
import { Train, Check, Plus, Minus, Layers, FolderOpen, Download } from 'lucide-react'

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
  const isLight = themeMode === 'light'
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImportFile(file)
    }
    if (e.target) {
      e.target.value = ''
    }
  }

  // 计算整列火车总长度 (mm)
  const totalLengthMm = cars.reduce((sum, car) => sum + car.modelData.dimensions.length + 8, 0) - 8

  return (
    <div className="space-y-3 text-xs select-none">
      <input
        ref={fileInputRef}
        type="file"
        accept=".papercraft,.json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 1. 车型选择 */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-medium opacity-60">
          <span>选择模型系列:</span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 text-indigo-500 hover:text-indigo-600 font-normal cursor-pointer"
          >
            <FolderOpen className="w-3 h-3" />
            导入 .papercraft
          </button>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {modelManifest.map(item => {
            const isSelected = currentConsist.id === item.id

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
                      <Train className="w-3 h-3" />
                    </div>
                    <span className="font-semibold text-xs">{item.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </div>

                <div className="flex items-center gap-1.5 text-[9px] opacity-60 pt-0.5">
                  <span className={`px-1 py-0.2 rounded border ${isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-950 border-zinc-800'}`}>
                    {item.category.toUpperCase()}
                  </span>
                  <span className={`px-1 py-0.2 rounded border ${isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-950 border-zinc-800'}`}>
                    难度: {item.difficulty.toUpperCase()}
                  </span>
                  {item.isCustom && (
                    <span className="px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-mono">
                      自定义导入
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. 车厢编组调节器 */}
      <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'} space-y-2.5`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-xs">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>列车编组设置</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
            共 {cars.length} 节车厢
          </span>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[11px] opacity-70">中间客车数量:</span>
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
            { label: '短编组', count: 0 },
            { label: '标准', count: 1 },
            { label: '长编组', count: 2 },
            { label: '长龙', count: 4 }
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

        {/* 规格明细 */}
        <div className={`p-2 rounded border ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'} space-y-1 text-[10px]`}>
          <div className="flex justify-between">
            <span className="opacity-60">连结总长:</span>
            <span className="font-mono font-medium">{totalLengthMm} mm</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">图纸页数:</span>
            <span className="font-mono font-medium">{cars.length} 页 A4</span>
          </div>
        </div>
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
        <span>导出当前模型为 .papercraft</span>
      </button>
    </div>
  )
}
