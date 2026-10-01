// Papercraft Studio - 主应用入口 (单行极简导航栏 + 动态 .papercraft 资产加载引擎 + 全局多语言)
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Header } from './components/layout/Header'
import { Scene3D } from './components/viewport3d/Scene3D'
import { NetViewer2D } from './components/viewport2d/NetViewer2D'
import { ModelLibrary } from './components/editor/ModelLibrary'
import { ModelSelector } from './components/editor/ModelSelector'
import { TextureEditor } from './components/editor/TextureEditor'
import { AssemblyGuide } from './components/editor/AssemblyGuide'
import { TextureBaker } from './texture/textureBaker'
import { useModelDrafts } from './components/editor/useModelDrafts'
import {
  CONSIST_REGISTRY,
  buildTrainConsistCars,
  ConsistCarItem
} from './core/models/consistManager'
import { modelRepository, ModelManifestItem } from './core/models/modelRepository'
import { TrainModelConsist } from './core/schema/consistSchema'
import { exportConsistToPdf } from './export/pdfExporter'
import confetti from 'canvas-confetti'
import { Layers, Palette } from 'lucide-react'
import { useI18n } from './i18n'

export function App() {
  const { locale, t, isZh } = useI18n()

  // 1. 动态模型资产清单与当前编组
  const [modelManifest, setModelManifest] = useState<ModelManifestItem[]>(() => modelRepository.getManifest())
  const [currentConsist, setCurrentConsist] = useState<TrainModelConsist>(CONSIST_REGISTRY[0])
  const {draft,update: updateDraft,selectTheme,reset: resetDraft} = useModelDrafts(currentConsist)
  const {theme:currentTheme,colors:customColors,useCustomColors,text:customText,middleCarCount,texture:customTexture} = draft
  const setMiddleCarCount = (count:number) => updateDraft('middleCarCount',Math.max(0,Math.min(currentConsist.assembly?.maxMiddleCars??5,count)))
  const [focusedCarIndex, setFocusedCarIndex] = useState<number>(-1)
  const [current2dPageIndex, setCurrent2dPageIndex] = useState<number>(0)

  // 2. 动态生成整列火车的车厢实例列表 (自适应中英多语言)
  const cars: ConsistCarItem[] = useMemo(() => {
    return buildTrainConsistCars(currentConsist, middleCarCount, locale)
  }, [currentConsist, middleCarCount, locale])

  // 3. 视口与交互状态
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'split'>('split')
  const [sidebarTab, setSidebarTab] = useState<'models' | 'texture'>('models')
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.matchMedia('(min-width: 1024px)').matches)

  // 5. 纹理烘焙器
  const baker = useMemo(() => new TextureBaker(1024), [])
  const [bakeTick, setBakeTick] = useState(0)

  // 6. UI 弹窗与导出状态
  const [isModelLibraryOpen, setIsModelLibraryOpen] = useState(false)
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // 7. 亮色 / 暗色主题 (默认跟随系统，实时监听系统变化，用户切换时持久化至 localStorage)
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    // 1. 优先读取用户显式存储的偏好
    const saved = localStorage.getItem('papercraft_theme_mode')
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
    // 2. 默认跟随操作系统偏好
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark'
  })
  const isLight = themeMode === 'light'

  // 监听操作系统深浅色模式实时变化
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('papercraft_theme_mode')
      // 若用户未手动锁定偏好，则自动随系统切换
      if (!saved) {
        setThemeMode(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // 同步到 html documentElement class
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [themeMode])

  // 用户手动切换主题并持久化
  const toggleThemeMode = () => {
    const next = themeMode === 'dark' ? 'light' : 'dark'
    setThemeMode(next)
    localStorage.setItem('papercraft_theme_mode', next)
  }

  // 8. 重新烘焙贴图 (自适应车型类别与特定车型 ID)
  const rebake = useCallback(() => {
    baker.bake({
      theme: currentTheme,
      category: currentConsist.category,
      consistId: currentConsist.id,
      customColors,
      customText,
      useCustomColors
    })
    if(customTexture) baker.applyCustomTextureCanvases(customTexture)
    setBakeTick(t => t + 1)
  }, [baker, currentTheme, currentConsist.category, currentConsist.id, customColors, customText, useCustomColors, customTexture])

  useEffect(() => {
    rebake()
  }, [rebake])

  // 9. 动态切换模型 (自适应匹配专属涂装主题与动态导入涂装)
  const handleSelectConsistById = (id: string) => {
    const found = modelRepository.getConsist(id)
    if (found) {
      setCurrentConsist(found)
      setFocusedCarIndex(-1)
      setCurrent2dPageIndex(0)
    }
  }

  // 10. 导入本地 .papercraft 文件 (支持 2.0 ZIP 容器与 1.0 单 JSON)
  const handleImportFile = async (file: File) => {
    const res = await modelRepository.loadFromFile(file)
    if (res.success && res.consist) {
      setModelManifest(modelRepository.getManifest())
      setCurrentConsist(res.consist)
      setFocusedCarIndex(-1)
      setCurrent2dPageIndex(0)

      resetDraft(res.consist.id)

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    } else {
      alert(t('header.importFailed', { error: res.error || '' }))
    }
  }

  // 11. 导出当前模型与附属涂装为标准 .papercraft (ZIP 容器包)
  const handleExportPackage = async () => {
    await modelRepository.exportToFile(currentConsist)
  }

  // 导出整套列车编组的完整多页 A4 PDF
  const handleExportPdf = async () => {
    if (isExporting) return
    setIsExporting(true)
    try {
      const consistDisplayName = isZh ? currentConsist.name : (currentConsist.nameEn || currentConsist.name)
      await exportConsistToPdf({
        consistName: consistDisplayName,
        cars,
        baker,
        isBlankTemplate: false,
        locale
      })

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      })
    } catch (e) {
      console.error('导出 PDF 失败:', e)
      alert(t('header.exportFailed'))
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className={`w-screen h-screen flex flex-col ${isLight ? 'bg-zinc-100 text-zinc-900' : 'bg-black text-white'} overflow-hidden select-none font-sans`}>
      {/* 顶部单行极简导航栏 */}
      <Header
        currentConsist={currentConsist}
        onOpenModelLibrary={() => setIsModelLibraryOpen(true)}
        cars={cars}
        current2dPageIndex={current2dPageIndex}
        onSelect2dPageIndex={setCurrent2dPageIndex}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenGuide={() => setIsGuideOpen(true)}
        onExportPdf={handleExportPdf}
        isExporting={isExporting}
        themeMode={themeMode}
        onToggleThemeMode={toggleThemeMode}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* 主工作区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左/中 视口展示区 */}
        <div className="flex-1 min-w-0 flex overflow-hidden relative">
          {viewMode === '3d' && (
            <div className="w-full h-full">
              <Scene3D
                cars={cars}
                focusedCarIndex={focusedCarIndex}
                baker={baker}
                bakeTick={bakeTick}
                themeMode={themeMode}
              />
            </div>
          )}

          {viewMode === '2d' && (
            <div className="w-full h-full">
              <NetViewer2D
                cars={cars}
                currentPageIndex={current2dPageIndex}
                onSelectPageIndex={setCurrent2dPageIndex}
                currentCarIndex={focusedCarIndex === -1 ? 0 : focusedCarIndex}
                onSelectCar={(idx) => setFocusedCarIndex(idx)}
                baker={baker}
                themeMode={themeMode}
              />
            </div>
          )}

          {viewMode === 'split' && (
            <div className="w-full h-full flex flex-col md:flex-row">
              <div className={`w-full h-1/2 md:w-1/2 md:h-full border-b md:border-b-0 md:border-r ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
                <Scene3D
                  cars={cars}
                  focusedCarIndex={focusedCarIndex}
                  baker={baker}
                  bakeTick={bakeTick}
                  themeMode={themeMode}
                />
              </div>
              <div className="w-full h-1/2 md:w-1/2 md:h-full">
                <NetViewer2D
                  cars={cars}
                  currentPageIndex={current2dPageIndex}
                  onSelectPageIndex={setCurrent2dPageIndex}
                  currentCarIndex={focusedCarIndex === -1 ? 0 : focusedCarIndex}
                  onSelectCar={(idx) => setFocusedCarIndex(idx)}
                  baker={baker}
                  themeMode={themeMode}
                />
              </div>
            </div>
          )}
        </div>

        {/* 右侧设计侧边栏 (收窄至 288px，支持一键折叠) */}
        {isSidebarOpen && (
          <div className={`absolute lg:static right-0 top-11 bottom-0 z-30 w-72 h-auto lg:h-full shadow-xl lg:shadow-none flex flex-col ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'} border-l shrink-0 transition-all duration-200`}>
            {/* 侧边栏 Tab 切换 */}
            <div className={`flex items-center border-b ${isLight ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-800 bg-zinc-950/40'} p-1 gap-1 text-xs shrink-0`}>
              <button
                onClick={() => setSidebarTab('models')}
                className={`flex-1 py-1 rounded-md font-medium flex items-center justify-center gap-1.5 transition-all text-xs ${
                  sidebarTab === 'models'
                    ? isLight
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'bg-zinc-800 text-white shadow-sm'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                {t('sidebar.tabConsist')}
              </button>
              <button
                onClick={() => setSidebarTab('texture')}
                className={`flex-1 py-1 rounded-md font-medium flex items-center justify-center gap-1.5 transition-all text-xs ${
                  sidebarTab === 'texture'
                    ? isLight
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'bg-zinc-800 text-white shadow-sm'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                {t('sidebar.tabLivery')}
              </button>
            </div>

            {/* 侧边栏主体内容 */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {sidebarTab === 'models' && (
                <ModelSelector
                  currentConsist={currentConsist}
                  modelManifest={modelManifest}
                  onOpenLibrary={() => setIsModelLibraryOpen(true)}
                  onExportPackage={handleExportPackage}
                  middleCarCount={middleCarCount}
                  onMiddleCarCountChange={setMiddleCarCount}
                  cars={cars}
                  themeMode={themeMode}
                />
              )}

              {sidebarTab === 'texture' && (
                <TextureEditor key={currentConsist.id}
                  currentConsist={currentConsist}
                  currentConsistId={currentConsist.id}
                  currentConsistCategory={currentConsist.category}
                  currentTheme={currentTheme}
                  onThemeChange={selectTheme}
                  customColors={customColors}
                  onCustomColorsChange={colors => updateDraft('colors',colors)}
                  useCustomColors={useCustomColors}
                  onUseCustomColorsChange={value => updateDraft('useCustomColors',value)}
                  customText={customText}
                  onCustomTextChange={text => updateDraft('text',text)}
                  themeMode={themeMode}
                  baker={baker}
                  customTexture={customTexture}
                  onCustomTextureChange={texture => updateDraft('texture',texture)}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <ModelLibrary open={isModelLibraryOpen} onClose={() => setIsModelLibraryOpen(false)} models={modelManifest} selectedId={currentConsist.id} onSelect={handleSelectConsistById} onImport={handleImportFile} themeMode={themeMode}/>
      {/* 组装指南弹窗 */}
      <AssemblyGuide consist={currentConsist} isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  )
}
export default App
