// 顶部全局单行导航栏 (整合车型切换、动态 .papercraft 资产导入导出、车厢分页与全局导出)
import React, { useRef } from 'react'
import { TrainModelConsist } from '../../core/schema/consistSchema'
import { ConsistCarItem } from '../../core/models/consistManager'
import { ModelManifestItem } from '../../core/models/modelRepository'
import {
  Printer,
  HelpCircle,
  Box,
  Columns,
  ChevronDown,
  Sun,
  Moon,
  Train,
  PanelRightClose,
  PanelRightOpen,
  FolderOpen,
  Download,
  FileSpreadsheet
} from 'lucide-react'
import { packConsistToA4Pages } from '../../core/unfoldEngine'

interface HeaderProps {
  currentConsist: TrainModelConsist
  modelManifest: ModelManifestItem[]
  onSelectConsistById: (id: string) => void
  onImportFile: (file: File) => void
  onExportPackage: () => void
  cars: ConsistCarItem[]
  current2dPageIndex: number
  onSelect2dPageIndex: (idx: number) => void
  viewMode: '3d' | '2d' | 'split'
  onViewModeChange: (mode: '3d' | '2d' | 'split') => void
  onOpenGuide: () => void
  onExportPdf: () => void
  isExporting: boolean
  themeMode: 'light' | 'dark'
  onToggleThemeMode: () => void
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export const Header: React.FC<HeaderProps> = ({
  currentConsist,
  modelManifest,
  onSelectConsistById,
  onImportFile,
  onExportPackage,
  cars,
  current2dPageIndex,
  onSelect2dPageIndex,
  viewMode,
  onViewModeChange,
  onOpenGuide,
  onExportPdf,
  isExporting,
  themeMode,
  onToggleThemeMode,
  isSidebarOpen,
  onToggleSidebar
}) => {
  const isLight = themeMode === 'light'
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pageLayout = packConsistToA4Pages(cars)

  return (
    <header
      className={`h-11 border-b flex items-center justify-between px-3 shrink-0 select-none z-30 transition-colors ${
        isLight
          ? 'bg-white/95 border-zinc-200 text-zinc-900'
          : 'bg-zinc-900/95 border-zinc-800 text-zinc-100'
      } backdrop-blur-md`}
    >
      {/* 隐藏的 .papercraft 文件上传 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".papercraft,.json"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) onImportFile(file)
          e.target.value = ''
        }}
        className="hidden"
      />

      {/* 左侧: Logo 与车型切换 */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 font-bold tracking-tight text-xs">
          <div className="p-1 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs">
            <Train className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:inline">Papercraft Studio</span>
        </div>

        {/* 车型选择下拉气泡 */}
        <div className="relative group">
          <button
            className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium transition-all ${
              isLight
                ? 'bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 border-zinc-200'
                : 'bg-zinc-800 hover:bg-zinc-700/80 text-zinc-200 border-zinc-700'
            }`}
          >
            <span className="truncate max-w-[120px] sm:max-w-[160px]">{currentConsist.name}</span>
            <ChevronDown className="w-3 h-3 opacity-60 group-hover:rotate-180 transition-transform" />
          </button>

          {/* 下拉列表 */}
          <div
            className={`absolute top-full left-0 mt-1 w-64 rounded-xl border shadow-xl p-1.5 hidden group-hover:block z-50 transition-all ${
              isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'
            }`}
          >
            <div className="px-2 py-1 text-[10px] font-semibold opacity-50 uppercase tracking-wider">
              内置列车车型
            </div>
            <div className="max-h-60 overflow-y-auto space-y-0.5">
              {modelManifest.map(m => {
                const isSelected = m.id === currentConsist.id
                return (
                  <button
                    key={m.id}
                    onClick={() => onSelectConsistById(m.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                      isSelected
                        ? isLight ? 'bg-zinc-100 font-semibold text-zinc-900' : 'bg-zinc-800 font-semibold text-white'
                        : isLight ? 'hover:bg-zinc-50 text-zinc-700' : 'hover:bg-zinc-800/60 text-zinc-300'
                    }`}
                  >
                    <div>
                      <div>{m.name}</div>
                      <div className="text-[10px] opacity-50">{m.category} · {m.difficulty}</div>
                    </div>
                    {isSelected && <span className="text-sky-500 text-xs">●</span>}
                  </button>
                )
              })}
            </div>

            {/* 导入 / 导出动作 */}
            <div className={`mt-1.5 pt-1.5 border-t ${isLight ? 'border-zinc-100' : 'border-zinc-800'} space-y-1`}>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`w-full px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs cursor-pointer transition-colors ${
                  isLight ? 'hover:bg-zinc-50 text-zinc-700' : 'hover:bg-zinc-800/60 text-zinc-300'
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5 opacity-70" />
                <span>导入 .papercraft 资产</span>
              </div>

              <button
                onClick={onExportPackage}
                className={`w-full text-left px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs transition-colors ${
                  isLight ? 'hover:bg-zinc-50 text-zinc-700' : 'hover:bg-zinc-800/60 text-zinc-300'
                }`}
              >
                <Download className="w-3.5 h-3.5 opacity-70" />
                <span>导出当前模型为 .papercraft</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 中间: 视口模式与快速换页 */}
      <div className="flex items-center gap-2">
        {/* 视口切换胶囊 */}
        <div
          className={`flex items-center p-0.5 rounded-lg border text-xs ${
            isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-800/80 border-zinc-700'
          }`}
        >
          <button
            onClick={() => onViewModeChange('3d')}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 font-medium transition-all ${
              viewMode === '3d'
                ? isLight ? 'bg-white text-zinc-900 shadow-xs' : 'bg-zinc-700 text-white shadow-xs'
                : 'opacity-60 hover:opacity-100'
            }`}
            title="3D 实景装配与折叠视角"
          >
            <Box className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3D 预览</span>
          </button>
          <button
            onClick={() => onViewModeChange('split')}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 font-medium transition-all ${
              viewMode === 'split'
                ? isLight ? 'bg-white text-zinc-900 shadow-xs' : 'bg-zinc-700 text-white shadow-xs'
                : 'opacity-60 hover:opacity-100'
            }`}
            title="双屏对照视角"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">分屏</span>
          </button>
          <button
            onClick={() => onViewModeChange('2d')}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 font-medium transition-all ${
              viewMode === '2d'
                ? isLight ? 'bg-white text-zinc-900 shadow-xs' : 'bg-zinc-700 text-white shadow-xs'
                : 'opacity-60 hover:opacity-100'
            }`}
            title="2D 展开图纸排版与打印视角"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">2D 图纸</span>
          </button>
        </div>

        {/* 2D 分页快捷标签 (仅在 2D 或分屏模式下高亮展示) */}
        {viewMode !== '3d' && (
          <div className="hidden md:flex items-center gap-1">
            {pageLayout.map((page, idx) => (
              <button
                key={page.pageIndex}
                onClick={() => onSelect2dPageIndex(page.pageIndex)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors ${
                  current2dPageIndex === page.pageIndex
                    ? isLight
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-white text-zinc-900 border-white'
                    : isLight
                      ? 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                }`}
                title={`跳转至第 ${idx + 1} 页 (${page.car?.carNumberText || '配件专页'})`}
              >
                P{idx + 1}: {(page.car?.carNumberText || '配件').slice(0, 4)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 右侧: 工具、主题与导出 PDF */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onToggleThemeMode}
          className={`p-1.5 rounded-md border text-xs transition-colors ${
            isLight
              ? 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
          }`}
          title={isLight ? '切换为暗色模式' : '切换为亮色模式'}
        >
          {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={onOpenGuide}
          className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs transition-colors ${
            isLight
              ? 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
          }`}
        >
          <HelpCircle className="w-3 h-3 opacity-70" />
          <span>指南</span>
        </button>

        <button
          onClick={onExportPdf}
          disabled={isExporting}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium text-xs shadow-sm transition-all ${
            isExporting
              ? 'bg-zinc-400 text-white cursor-not-allowed'
              : isLight
                ? 'bg-zinc-900 hover:bg-black text-white active:scale-98'
                : 'bg-zinc-100 hover:bg-white text-zinc-900 active:scale-98'
          }`}
        >
          <Printer className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
          <span>{isExporting ? '正在导出...' : '导出'}</span>
        </button>

        <button
          onClick={onToggleSidebar}
          className={`p-1.5 rounded-md border text-xs transition-colors ml-0.5 ${
            isLight
              ? 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
          }`}
          title={isSidebarOpen ? '收起右侧边栏' : '展开右侧边栏'}
        >
          {isSidebarOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  )
}
