// Papercraft Studio - 主应用入口 (单行极简导航栏 + 动态 .papercraft 资产加载引擎)
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Header } from './components/layout/Header'
import { Scene3D } from './components/viewport3d/Scene3D'
import { NetViewer2D } from './components/viewport2d/NetViewer2D'
import { ModelSelector } from './components/editor/ModelSelector'
import { TextureEditor } from './components/editor/TextureEditor'
import { AssemblyGuide } from './components/editor/AssemblyGuide'
import { ApiConfigModal } from './components/editor/ApiConfigModal'
import { TextureBaker } from './texture/textureBaker'
import { PRESET_THEMES } from './texture/presetThemes'
import { TextureTheme, CustomTextConfig } from './texture/types'
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

export function App() {
  // 1. 动态模型资产清单与当前编组
  const [modelManifest, setModelManifest] = useState<ModelManifestItem[]>(() => modelRepository.getManifest())
  const [currentConsist, setCurrentConsist] = useState<TrainModelConsist>(CONSIST_REGISTRY[0])
  const [middleCarCount, setMiddleCarCount] = useState(1)
  const [focusedCarIndex, setFocusedCarIndex] = useState<number>(-1)
  const [current2dPageIndex, setCurrent2dPageIndex] = useState<number>(0)

  // 2. 动态生成整列火车的车厢实例列表
  const cars: ConsistCarItem[] = useMemo(() => {
    return buildTrainConsistCars(currentConsist, middleCarCount)
  }, [currentConsist, middleCarCount])

  // 3. 视口与交互状态
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'split'>('split')
  const [explodeRatio, setExplodeRatio] = useState<number>(0)
  const [sidebarTab, setSidebarTab] = useState<'models' | 'texture'>('models')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // 4. 涂装与纹理定制状态
  const [currentTheme, setCurrentTheme] = useState<TextureTheme>(PRESET_THEMES[0])
  const [customColors, setCustomColors] = useState({
    primary: PRESET_THEMES[0].colors.primary,
    secondary: PRESET_THEMES[0].colors.secondary,
    accent: PRESET_THEMES[0].colors.accent,
    roof: PRESET_THEMES[0].colors.roof
  })
  const [useCustomColors, setUseCustomColors] = useState(false)
  const [customText, setCustomText] = useState<CustomTextConfig>({
    enabled: false,
    kidName: "ALEX'S EXPRESS",
    trainNumber: 'EXP-88',
    destination: '新宿·东京'
  })

  // 5. 纹理烘焙器
  const baker = useMemo(() => new TextureBaker(1024), [])
  const [bakeTick, setBakeTick] = useState(0)

  // 6. UI 弹窗与导出状态
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const [isApiModalOpen, setIsApiModalOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [apiConfig, setApiConfig] = useState({
    apiKey: '',
    apiBaseUrl: 'https://api.openai.com/v1',
    modelName: 'gpt-4o'
  })

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

  // 8. 重新烘焙贴图 (自适应车型类别)
  const rebake = useCallback(() => {
    baker.bake({
      theme: currentTheme,
      category: currentConsist.category,
      customColors,
      customText,
      useCustomColors
    })
    setBakeTick(t => t + 1)
  }, [baker, currentTheme, currentConsist.category, customColors, customText, useCustomColors])

  useEffect(() => {
    rebake()
  }, [rebake])

  // 9. 动态切换模型 (自适应匹配专属涂装主题)
  const handleSelectConsistById = (id: string) => {
    const found = modelRepository.getConsist(id)
    if (found) {
      setCurrentConsist(found)
      setFocusedCarIndex(-1)
      setCurrent2dPageIndex(0)

      // 强校验：优先匹配车型的 defaultThemeId，或匹配兼容涂装
      let targetTheme: TextureTheme | undefined
      if (found.defaultThemeId) {
        targetTheme = PRESET_THEMES.find(th => th.id === found.defaultThemeId)
      }
      if (!targetTheme) {
        targetTheme = PRESET_THEMES.find(th =>
          th.targetConsistIds?.includes(found.id) ||
          th.compatibleCategories.includes(found.category as any)
        )
      }
      if (!targetTheme) {
        targetTheme = PRESET_THEMES[0]
      }

      setUseCustomColors(false)
      setCurrentTheme(targetTheme)
      setCustomColors({
        primary: targetTheme.colors.primary,
        secondary: targetTheme.colors.secondary,
        accent: targetTheme.colors.accent,
        roof: targetTheme.colors.roof
      })
    }
  }

  // 10. 导入本地 .papercraft 文件
  const handleImportFile = async (file: File) => {
    const res = await modelRepository.loadFromFile(file)
    if (res.success && res.consist) {
      setModelManifest(modelRepository.getManifest())
      setCurrentConsist(res.consist)
      setFocusedCarIndex(-1)
      setCurrent2dPageIndex(0)

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 }
      })
    } else {
      alert(`导入失败: ${res.error || '文件格式错误'}`)
    }
  }

  // 11. 导出当前模型为 .papercraft 文件
  const handleExportPackage = () => {
    modelRepository.exportToFile(currentConsist)
  }

  const handleSaveApiConfig = (newConfig: { apiKey: string; apiBaseUrl: string; modelName: string }) => {
    setApiConfig(newConfig)
    localStorage.setItem('papercraft_api_config', JSON.stringify(newConfig))
  }

  // 导出整套列车编组的完整多页 A4 PDF
  const handleExportPdf = async () => {
    setIsExporting(true)
    try {
      await exportConsistToPdf({
        consistName: currentConsist.name,
        cars,
        baker
      })

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    } catch (err) {
      console.error('Consist PDF Export Error:', err)
      alert('导出编组 PDF 失败，请重试')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className={`flex flex-col w-screen h-screen ${isLight ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-950 text-zinc-100'} overflow-hidden font-sans transition-colors`}>
      {/* 顶部单行极简导航栏 */}
      <Header
        currentConsist={currentConsist}
        modelManifest={modelManifest}
        onSelectConsistById={handleSelectConsistById}
        onImportFile={handleImportFile}
        onExportPackage={handleExportPackage}
        cars={cars}
        current2dPageIndex={current2dPageIndex}
        onSelect2dPageIndex={(idx) => {
          setCurrent2dPageIndex(idx)
          if (idx < cars.length) {
            setFocusedCarIndex(idx)
          }
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenApiConfig={() => setIsApiModalOpen(true)}
        onExportPdf={handleExportPdf}
        isExporting={isExporting}
        hasApiKey={!!apiConfig.apiKey}
        themeMode={themeMode}
        onToggleThemeMode={toggleThemeMode}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* 主工作区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左/中 视口展示区 */}
        <div className="flex-1 flex overflow-hidden relative">
          {viewMode === '3d' && (
            <div className="w-full h-full">
              <Scene3D
                cars={cars}
                focusedCarIndex={focusedCarIndex}
                baker={baker}
                bakeTick={bakeTick}
                explodeRatio={explodeRatio}
                onExplodeChange={setExplodeRatio}
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
            <div className="w-full h-full flex">
              <div className={`w-1/2 h-full border-r ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
                <Scene3D
                  cars={cars}
                  focusedCarIndex={focusedCarIndex}
                  baker={baker}
                  bakeTick={bakeTick}
                  explodeRatio={explodeRatio}
                  onExplodeChange={setExplodeRatio}
                  themeMode={themeMode}
                />
              </div>
              <div className="w-1/2 h-full">
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
          <div className={`w-72 h-full flex flex-col ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'} border-l shrink-0 transition-all duration-200`}>
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
                列车编组
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
                涂装与 AI
              </button>
            </div>

            {/* 侧边栏主体内容 */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {sidebarTab === 'models' && (
                <ModelSelector
                  currentConsist={currentConsist}
                  modelManifest={modelManifest}
                  onSelectConsistById={handleSelectConsistById}
                  onImportFile={handleImportFile}
                  onExportPackage={handleExportPackage}
                  middleCarCount={middleCarCount}
                  onMiddleCarCountChange={setMiddleCarCount}
                  cars={cars}
                  themeMode={themeMode}
                />
              )}

              {sidebarTab === 'texture' && (
                <TextureEditor
                  currentConsistId={currentConsist.id}
                  currentConsistCategory={currentConsist.category}
                  currentTheme={currentTheme}
                  onThemeChange={t => {
                    setCurrentTheme(t)
                    setUseCustomColors(false)
                    setCustomColors({
                      primary: t.colors.primary,
                      secondary: t.colors.secondary,
                      accent: t.colors.accent,
                      roof: t.colors.roof
                    })
                  }}
                  customColors={customColors}
                  onCustomColorsChange={setCustomColors}
                  useCustomColors={useCustomColors}
                  onUseCustomColorsChange={setUseCustomColors}
                  customText={customText}
                  onCustomTextChange={setCustomText}
                  apiKey={apiConfig.apiKey}
                  apiBaseUrl={apiConfig.apiBaseUrl}
                  themeMode={themeMode}
                  baker={baker}
                  onCustomTextureApplied={() => {
                    setBakeTick(prev => prev + 1)
                    confetti({
                      particleCount: 80,
                      spread: 60,
                      origin: { y: 0.6 }
                    })
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* 弹窗组件 */}
      <AssemblyGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <ApiConfigModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        initialConfig={apiConfig}
        onSave={handleSaveApiConfig}
      />
    </div>
  )
}
export default App
