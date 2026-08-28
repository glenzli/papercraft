// 顶部全局单行导航栏 (整合车型切换、动态 .papercraft 资产导入导出、车厢分页、双语切换与全局导出)
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
  PanelRightClose,
  PanelRightOpen,
  FolderOpen,
  Download,
  FileSpreadsheet,
  Languages
} from 'lucide-react'
import { packConsistToA4Pages } from '../../core/unfoldEngine'
import { useI18n } from '../../i18n'

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
  const { locale, setLocale, t, isZh } = useI18n()
  const isLight = themeMode === 'light'
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pageLayout = packConsistToA4Pages(cars)

  const toggleLanguage = () => {
    setLocale(locale === 'zh-CN' ? 'en-US' : 'zh-CN')
  }

  const currentDisplayName = isZh ? currentConsist.name : (currentConsist.nameEn || currentConsist.name)

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
          <img
            src="/icon-192.png"
            alt="Papercraft Studio"
            className="w-5 h-5 rounded-md object-contain shadow-xs border border-zinc-200/50 dark:border-zinc-700/50"
          />
          <span className="hidden sm:inline">{t('common.appTitle')}</span>
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
            <span className="truncate max-w-[120px] sm:max-w-[160px]">{currentDisplayName}</span>
            <ChevronDown className="w-3 h-3 opacity-60 group-hover:rotate-180 transition-transform" />
          </button>

          {/* 下拉列表 */}
          <div
            className={`absolute top-full left-0 mt-1 w-64 rounded-xl border shadow-xl p-1.5 hidden group-hover:block z-50 transition-all ${
              isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'
            }`}
          >
            <div className="px-2 py-1 text-[10px] font-semibold opacity-50 uppercase tracking-wider">
              {t('header.builtInTrains')}
            </div>
            <div className="max-h-60 overflow-y-auto space-y-0.5">
              {modelManifest.map(m => {
                const isSelected = m.id === currentConsist.id
                const mName = isZh ? m.name : (m.nameEn || m.name)
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
                      <div>{mName}</div>
                      <div className="text-[10px] opacity-50">{m.category.toUpperCase()} · {m.difficulty.toUpperCase()}</div>
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
                <span>{t('header.importPapercraftAsset')}</span>
              </div>

              <button
                onClick={onExportPackage}
                className={`w-full text-left px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs transition-colors ${
                  isLight ? 'hover:bg-zinc-50 text-zinc-700' : 'hover:bg-zinc-800/60 text-zinc-300'
                }`}
              >
                <Download className="w-3.5 h-3.5 opacity-70" />
                <span>{t('header.exportCurrentPapercraft')}</span>
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
            title={t('header.view3DTitle')}
          >
            <Box className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('header.view3D')}</span>
          </button>
          <button
            onClick={() => onViewModeChange('split')}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 font-medium transition-all ${
              viewMode === 'split'
                ? isLight ? 'bg-white text-zinc-900 shadow-xs' : 'bg-zinc-700 text-white shadow-xs'
                : 'opacity-60 hover:opacity-100'
            }`}
            title={t('header.viewSplitTitle')}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('header.viewSplit')}</span>
          </button>
          <button
            onClick={() => onViewModeChange('2d')}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 font-medium transition-all ${
              viewMode === '2d'
                ? isLight ? 'bg-white text-zinc-900 shadow-xs' : 'bg-zinc-700 text-white shadow-xs'
                : 'opacity-60 hover:opacity-100'
            }`}
            title={t('header.view2DTitle')}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('header.view2D')}</span>
          </button>
        </div>

        {/* 2D 分页快捷标签 (仅在 2D 或分屏模式下高亮展示) */}
        {viewMode !== '3d' && (
          <div className="hidden md:flex items-center gap-1">
            {pageLayout.map((page, idx) => {
              const carText = page.car?.carNumberText || t('header.pageAccessory')
              const shortText = carText.slice(0, 5)
              return (
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
                  title={t('header.pageJumpTitle', { page: idx + 1, name: carText })}
                >
                  P{idx + 1}: {shortText}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* 右侧: 语言切换、主题、组装指南与导出 PDF */}
      <div className="flex items-center gap-1.5">
        {/* 语言切换按钮 (中/EN) */}
        <button
          onClick={toggleLanguage}
          className={`px-2 py-1 rounded-md border text-xs font-semibold flex items-center gap-1 transition-colors ${
            isLight
              ? 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
          }`}
          title={t('common.switchLanguage')}
        >
          <Languages className="w-3.5 h-3.5 opacity-80" />
          <span className="text-[11px]">{isZh ? 'EN' : '中文'}</span>
        </button>

        {/* 亮色/暗色模式切换 */}
        <button
          onClick={onToggleThemeMode}
          className={`p-1.5 rounded-md border text-xs transition-colors ${
            isLight
              ? 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
          }`}
          title={isLight ? t('common.darkMode') : t('common.lightMode')}
        >
          {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </button>

        {/* 组装指南 */}
        <button
          onClick={onOpenGuide}
          className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs transition-colors ${
            isLight
              ? 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
          }`}
        >
          <HelpCircle className="w-3 h-3 opacity-70" />
          <span>{t('common.guide')}</span>
        </button>

        {/* PDF 导出 */}
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
          <span>{isExporting ? t('common.exporting') : t('common.export')}</span>
        </button>

        {/* 侧边栏折叠/展开 */}
        <button
          onClick={onToggleSidebar}
          className={`p-1.5 rounded-md border text-xs transition-colors ml-0.5 ${
            isLight
              ? 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
          }`}
          title={isSidebarOpen ? t('common.collapseSidebar') : t('common.expandSidebar')}
        >
          {isSidebarOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  )
}
