// 顶部全局单行导航栏 (整合车型切换、动态 .papercraft 资产导入导出、车厢分页与全局导出)
import React, { useRef } from 'react'
import { TrainModelConsist } from '../../core/schema/consistSchema'
import { ConsistCarItem } from '../../core/models/consistManager'
import { PAPERCRAFT_SPEC_VERSION } from '../../core/schema/papercraftFormat'
import { ModelManifestItem } from '../../core/models/modelRepository'
import {
  Printer,
  HelpCircle,
  Key,
  Box,
  FileText,
  Columns,
  ChevronDown,
  Sun,
  Moon,
  Train,
  PanelRightClose,
  PanelRightOpen,
  FolderOpen,
  Download,
  Sparkles
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
  onOpenApiConfig: () => void
  onExportPdf: () => void
  isExporting: boolean
  hasApiKey: boolean
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
  onOpenApiConfig,
  onExportPdf,
  isExporting,
  hasApiKey,
  themeMode,
  onToggleThemeMode,
  isSidebarOpen,
  onToggleSidebar
}) => {
  const isLight = themeMode === 'light'
  const fileInputRef = useRef<HTMLInputElement>(null)

  const consistPages = packConsistToA4Pages(cars)
  const carPages = consistPages.filter(p => !p.isAccessoryPage)
  const accPages = consistPages.filter(p => p.isAccessoryPage)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImportFile(file)
    }
    if (e.target) {
      e.target.value = ''
    }
  }

  return (
    <header className={`h-12 ${isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-zinc-100'} border-b flex items-center justify-between px-3 select-none z-30 shrink-0 transition-colors`}>
      {/* 隐藏的 .papercraft 文件上传 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".papercraft,.json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 左侧: Logo 与车型快速切换 */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-md ${isLight ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'} flex items-center justify-center shadow-sm font-bold text-xs`}>
            <Box className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1 font-bold text-xs tracking-tight">
            <span>Papercraft</span>
            <span className={`text-[9px] px-1 py-0.2 rounded border font-mono ${isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-500' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
              v{PAPERCRAFT_SPEC_VERSION}
            </span>
          </div>
        </div>

        <div className={`h-3.5 w-px ${isLight ? 'bg-zinc-200' : 'bg-zinc-800'}`} />

        {/* 车型下拉菜单 (支持动态加载与导入) */}
        <div className="relative group">
          <div className={`flex items-center gap-1.5 ${isLight ? 'bg-zinc-100 hover:bg-zinc-200/70 text-zinc-800 border-zinc-200' : 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 border-zinc-700'} border px-2.5 py-1 rounded-md cursor-pointer transition-colors text-xs font-medium`}>
            <span className="opacity-60">模型:</span>
            <span>{currentConsist.name.split(' (')[0]}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </div>

          <div className={`absolute top-full left-0 mt-1 w-68 ${isLight ? 'bg-white border-zinc-200 shadow-xl' : 'bg-zinc-900 border-zinc-800 shadow-2xl'} border rounded-lg p-1 hidden group-hover:block z-50`}>
            <div className="text-[10px] font-medium opacity-50 px-2 py-1">预置与已导入模型:</div>
            {modelManifest.map(m => (
              <div
                key={m.id}
                onClick={() => onSelectConsistById(m.id)}
                className={`px-2.5 py-1.5 rounded-md cursor-pointer transition-colors text-xs flex items-center justify-between ${
                  m.id === currentConsist.id
                    ? isLight
                      ? 'bg-zinc-900 text-white font-medium'
                      : 'bg-zinc-100 text-zinc-900 font-medium'
                    : isLight
                      ? 'text-zinc-700 hover:bg-zinc-100'
                      : 'text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-[10px] opacity-60">{m.category.toUpperCase()} · {m.difficulty}</div>
                </div>
                {m.isCustom && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-mono">
                    自定义
                  </span>
                )}
              </div>
            ))}

            <div className={`h-px ${isLight ? 'bg-zinc-200' : 'bg-zinc-800'} my-1`} />

            {/* 导入 / 导出动作 */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`px-2.5 py-1.5 rounded-md cursor-pointer transition-colors text-xs flex items-center gap-2 ${
                isLight ? 'hover:bg-zinc-100 text-zinc-700' : 'hover:bg-zinc-800 text-zinc-300'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>导入 .papercraft 模型文件...</span>
            </div>
            <div
              onClick={onExportPackage}
              className={`px-2.5 py-1.5 rounded-md cursor-pointer transition-colors text-xs flex items-center gap-2 ${
                isLight ? 'hover:bg-zinc-100 text-zinc-700' : 'hover:bg-zinc-800 text-zinc-300'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              <span>导出当前模型为 .papercraft</span>
            </div>
          </div>
        </div>
      </div>

      {/* 中间: 视口视图切换 + 车厢分页切换 */}
      <div className="flex items-center gap-2">
        <div className={`flex items-center ${isLight ? 'bg-zinc-100' : 'bg-zinc-950'} p-0.5 rounded-md text-xs`}>
          <button
            onClick={() => onViewModeChange('3d')}
            className={`flex items-center gap-1 px-2 py-1 rounded font-medium transition-all ${
              viewMode === '3d'
                ? isLight
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'bg-zinc-800 text-white shadow-sm'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <Box className="w-3 h-3" />
            3D 视口
          </button>
          <button
            onClick={() => onViewModeChange('split')}
            className={`flex items-center gap-1 px-2 py-1 rounded font-medium transition-all ${
              viewMode === 'split'
                ? isLight
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'bg-zinc-800 text-white shadow-sm'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <Columns className="w-3 h-3" />
            双分屏
          </button>
          <button
            onClick={() => onViewModeChange('2d')}
            className={`flex items-center gap-1 px-2 py-1 rounded font-medium transition-all ${
              viewMode === '2d'
                ? isLight
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'bg-zinc-800 text-white shadow-sm'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <FileText className="w-3 h-3" />
            2D 图纸 ({consistPages.length}页)
          </button>
        </div>

        {viewMode !== '3d' && (
          <div className="flex items-center gap-1 ml-1 pl-2 border-l border-zinc-200 dark:border-zinc-800">
            <Train className="w-3 h-3 opacity-60" />
            <div className="flex items-center gap-0.5">
              {/* 各车厢主体图纸页 */}
              {carPages.map(page => (
                <button
                  key={page.pageIndex}
                  onClick={() => onSelect2dPageIndex(page.pageIndex)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    current2dPageIndex === page.pageIndex
                      ? isLight
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-900 shadow-xs'
                      : isLight
                        ? 'text-zinc-600 hover:bg-zinc-100'
                        : 'text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {page.car?.carNumberText.split(' ')[0] || `${page.pageIndex + 1}号车`}
                </button>
              ))}

              {/* 全列车配件专页 (若存在) */}
              {accPages.length > 0 && (
                <>
                  <div className={`h-3 w-px ${isLight ? 'bg-zinc-300' : 'bg-zinc-700'} mx-1`} />
                  {accPages.map((page, aIdx) => (
                    <button
                      key={page.pageIndex}
                      onClick={() => onSelect2dPageIndex(page.pageIndex)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                        current2dPageIndex === page.pageIndex
                          ? isLight
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-indigo-500 text-white shadow-xs'
                          : isLight
                            ? 'text-indigo-600 hover:bg-indigo-50'
                            : 'text-indigo-400 hover:bg-indigo-950/40'
                      }`}
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      {accPages.length === 1 ? '配件专页' : `配件 ${aIdx + 1}`}
                    </button>
                  ))}
                </>
              )}
            </div>
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
          onClick={onOpenApiConfig}
          className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs transition-colors ${
            hasApiKey
              ? isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-950/40 text-emerald-300 border-emerald-800'
              : isLight ? 'bg-zinc-50 text-zinc-700 border-zinc-200' : 'bg-zinc-800 text-zinc-300 border-zinc-700'
          }`}
        >
          <Key className="w-3 h-3 opacity-70" />
          <span>{hasApiKey ? 'AI 已就绪' : 'AI Key'}</span>
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
          <span>{isExporting ? '正在生成 PDF...' : `导出全编组 PDF (${cars.length}页)`}</span>
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
