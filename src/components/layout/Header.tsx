// Responsive model selection, view controls and actions in normal document flow.
import React from 'react'
import { TrainModelConsist } from '../../core/schema/consistSchema'
import { ConsistCarItem } from '../../core/models/consistManager'
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
  FileSpreadsheet,
  Languages
} from 'lucide-react'
import { packConsistToA4Pages } from '../../core/unfoldEngine'
import { useI18n } from '../../i18n'

interface HeaderProps {
  currentConsist: TrainModelConsist
  onOpenModelLibrary: () => void
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
  onOpenModelLibrary,
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
  const pageLayout = packConsistToA4Pages(cars)

  const toggleLanguage = () => {
    setLocale(locale === 'zh-CN' ? 'en-US' : 'zh-CN')
  }

  const currentDisplayName = isZh ? currentConsist.name : (currentConsist.nameEn || currentConsist.name)

  return (
    <header
      className={`border-b grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] lg:flex items-center justify-between gap-1 p-2 sm:px-3 shrink-0 select-none z-30 transition-colors [&_button]:min-h-11 [&_button]:min-w-11 [&_button]:shrink-0 ${
        isLight
          ? 'bg-white/95 border-zinc-200 text-zinc-900'
          : 'bg-zinc-900/95 border-zinc-800 text-zinc-100'
      } backdrop-blur-md`}
    >
      {/* 左侧: Logo 与车型切换 */}
      <div className="flex min-w-0 items-center gap-1 sm:gap-2 sm:col-span-2 lg:flex-1">
        <div className="hidden lg:flex shrink-0 items-center gap-1.5 font-bold tracking-tight text-xs">
          <img
            src="/icon-192.png"
            alt="Papercraft Studio"
            className="w-5 h-5 rounded-md object-contain shadow-xs border border-zinc-200/50 dark:border-zinc-700/50"
          />
          <span className="hidden xl:inline">{t('common.appTitle')}</span>
        </div>

        <button onClick={onOpenModelLibrary} aria-haspopup="dialog" className={`flex min-w-0 w-full lg:w-auto items-center gap-2 px-2 py-1 rounded-md border text-xs font-medium ${isLight?'bg-zinc-100 hover:bg-zinc-200 border-zinc-200':'bg-zinc-800 hover:bg-zinc-700 border-zinc-700'}`} title={isZh?'打开模型库':'Open model library'}>
          <span className="min-w-0 flex-1 truncate text-left lg:max-w-[180px]">{currentDisplayName}</span><ChevronDown className="w-3 h-3 shrink-0 opacity-60"/>
        </button>
      </div>

      {/* 中间: 视口模式与快速换页 */}
      <div className="flex min-w-0 justify-center items-center gap-1 sm:gap-2">
        {/* 视口切换胶囊 */}
        <div
          className={`flex w-full sm:w-auto items-center p-0.5 rounded-lg border text-xs ${
            isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-800/80 border-zinc-700'
          }`}
        >
          <button
            onClick={() => onViewModeChange('3d')}
            className={`flex-1 sm:flex-none justify-center px-2 py-0.5 rounded-md flex items-center gap-1 font-medium transition-all ${
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
            className={`flex-1 sm:flex-none justify-center px-2 py-0.5 rounded-md flex items-center gap-1 font-medium transition-all ${
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
            className={`flex-1 sm:flex-none justify-center px-2 py-0.5 rounded-md flex items-center gap-1 font-medium transition-all ${
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
          <div className="hidden lg:flex items-center gap-1 max-w-[240px] overflow-x-auto">
            {pageLayout.map((page, idx) => {
              const carText = page.car?.carNumberText || t('header.pageAccessory')
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
                  P{idx + 1}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* 右侧: 语言切换、主题、组装指南与导出 PDF */}
      <div className="flex min-w-0 justify-between sm:justify-end shrink-0 items-center gap-1 sm:gap-1.5">
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
          aria-label={t('common.guide')}
          title={t('common.guide')}
          className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs transition-colors ${
            isLight
              ? 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
          }`}
        >
          <HelpCircle className="w-3 h-3 opacity-70" />
          <span className="hidden xl:inline">{t('common.guide')}</span>
        </button>

        {/* PDF 导出 */}
        <button
          onClick={onExportPdf}
          aria-label={isExporting?t('common.exporting'):t('common.export')}
          title={t('common.export')}
          disabled={isExporting}
          className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-md font-medium text-xs shadow-sm transition-all ${
            isExporting
              ? 'bg-zinc-400 text-white cursor-not-allowed'
              : isLight
                ? 'bg-zinc-900 hover:bg-black text-white active:scale-98'
                : 'bg-zinc-100 hover:bg-white text-zinc-900 active:scale-98'
          }`}
        >
          <Printer className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
          <span className="hidden xl:inline">{isExporting ? t('common.exporting') : t('common.export')}</span>
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
