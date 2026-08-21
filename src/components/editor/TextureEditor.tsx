// 涂装与 AI 纹理设计面板 (按车型自适应分类与推荐，支持 .papercraft-livery 涂装文件导入与导出)
import React, { useState, useRef } from 'react'
import { PRESET_THEMES } from '../../texture/presetThemes'
import { TextureTheme, CustomTextConfig } from '../../texture/types'
import { generateMockThemeByPrompt, generateTextureWithOpenAI } from '../../texture/aiGenerator'
import {
  downloadLiveryFile,
  loadLiveryFromFile,
  convertThemeToLiverySchema,
  convertLiverySchemaToTheme
} from '../../core/schema/liverySchema'
import { TextureBaker } from '../../texture/textureBaker'
import {
  sliceAndProcessTextureImage,
  ProcessedCustomTexture
} from '../../texture/customTextureImporter'
import {
  exportMasterTextureAtlas,
  exportSingleSideWireframe
} from '../../export/textureTemplateExporter'
import {
  Sparkles,
  Palette,
  Type,
  Wand2,
  RefreshCw,
  Check,
  Sparkle,
  Download,
  Upload,
  AlertCircle,
  Image as ImageIcon,
  Layout,
  FolderDown,
  Layers,
  Eye,
  RotateCcw
} from 'lucide-react'

interface TextureEditorProps {
  currentConsistId?: string
  currentConsistCategory?: string
  currentTheme: TextureTheme
  onThemeChange: (theme: TextureTheme) => void
  customText: CustomTextConfig
  onCustomTextChange: (text: CustomTextConfig) => void
  customColors: {
    primary: string
    secondary: string
    accent: string
    roof: string
  }
  onCustomColorsChange: (colors: { primary: string; secondary: string; accent: string; roof: string }) => void
  useCustomColors: boolean
  onUseCustomColorsChange: (val: boolean) => void
  apiKey?: string
  apiBaseUrl?: string
  themeMode?: 'light' | 'dark'
  baker?: TextureBaker
  onCustomTextureApplied?: () => void
}

export const TextureEditor: React.FC<TextureEditorProps> = ({
  currentConsistId = 'e235-consist',
  currentConsistCategory = 'commuter',
  currentTheme,
  onThemeChange,
  customText,
  onCustomTextChange,
  customColors,
  onCustomColorsChange,
  useCustomColors,
  onUseCustomColorsChange,
  apiKey,
  apiBaseUrl,
  themeMode = 'dark',
  baker,
  onCustomTextureApplied
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'ai' | 'customize'>('preset')
  const [aiSubMode, setAiSubMode] = useState<'import' | 'prompt'>('import')
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // 自定义贴图解析与切片状态
  const [importedTexture, setImportedTexture] = useState<ProcessedCustomTexture | null>(null)
  const [rawImage, setRawImage] = useState<HTMLImageElement | null>(null)
  const [overlayStructure, setOverlayStructure] = useState<boolean>(true)
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false)
  const [hasAppliedCustom, setHasAppliedCustom] = useState<boolean>(false)

  const isLight = themeMode === 'light'

  // 严格过滤涂装列表：100% 精准匹配当前车型 ID 或兼容分类，严禁跨车型乱入
  const matchedThemes = PRESET_THEMES.filter(t => {
    if (t.targetConsistIds && t.targetConsistIds.length > 0) {
      return t.targetConsistIds.includes(currentConsistId)
    }
    return t.compatibleCategories.includes(currentConsistCategory as any) || t.compatibleCategories.includes('all')
  })
  const displayThemes = matchedThemes

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'shinkansen': return '新干线高速列车'
      case 'steam': return '蒸汽机车'
      case 'commuter': return '都市通勤电车'
      default: return '通用列车'
    }
  }

  // 导出当前涂装为 .papercraft-livery 文件
  const handleExportLivery = () => {
    const activeColors = useCustomColors ? {
      primary: customColors.primary,
      secondary: customColors.secondary,
      accent: customColors.accent,
      roof: customColors.roof,
      window: currentTheme.colors.window,
      frame: currentTheme.colors.frame
    } : currentTheme.colors

    const themeToExport: TextureTheme = {
      ...currentTheme,
      colors: activeColors
    }

    const liverySchema = convertThemeToLiverySchema(
      themeToExport,
      currentConsistId,
      currentConsistCategory,
      customText.enabled ? customText : undefined
    )
    downloadLiveryFile(liverySchema)
  }

  // 导入并校验 .papercraft-livery 文件
  const handleImportLiveryFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImportError(null)

    const res = await loadLiveryFromFile(file)
    if (!res.success || !res.livery) {
      setImportError(res.error || '涂装文件解析失败')
      return
    }

    const livery = res.livery

    // 严格车型兼容校验
    const isCategoryMatch = livery.targetCategory === 'all' || livery.targetCategory === currentConsistCategory
    const isConsistMatch = !livery.targetConsistIds || livery.targetConsistIds.includes(currentConsistId)

    if (!isCategoryMatch && !isConsistMatch) {
      setImportError(`⚠️ 涂装车型不匹配: 该涂装为【${getCategoryLabel(livery.targetCategory)}】专属设计，无法套用于当前【${getCategoryLabel(currentConsistCategory)}】`)
      return
    }

    const newTheme = convertLiverySchemaToTheme(livery)
    onThemeChange(newTheme)
    if (livery.customText) {
      onCustomTextChange({
        enabled: true,
        trainNumber: livery.customText.trainNumber || 'EXP-01',
        destination: livery.customText.destination || '特快',
        kidName: livery.customText.kidName || "KID'S EXPRESS"
      })
    }
    onUseCustomColorsChange(false)
    e.target.value = ''
  }

  const inspirationPrompts = [
    '极光特快列车',
    '赛博黑金机甲',
    '星空银河铁道',
    '大正复古红木车厢',
    '春日樱花限定',
    '丛林恐龙探险'
  ]

  const handleAiGenerate = async (targetPrompt?: string) => {
    const p = targetPrompt || prompt
    if (!p.trim()) return

    setIsGenerating(true)
    try {
      if (apiKey) {
        const result = await generateTextureWithOpenAI({
          prompt: p,
          apiKey,
          apiBaseUrl
        })
        onThemeChange(result.theme)
      } else {
        await new Promise(r => setTimeout(r, 500))
        const theme = generateMockThemeByPrompt(p)
        onThemeChange(theme)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // 处理自定义贴图图片上传 (支持总谱 Atlas 或单侧身图)
  const handleImageFileSelected = (file: File) => {
    if (!file) return
    setIsProcessingImage(true)
    setImportError(null)

    const reader = new FileReader()
    reader.onload = e => {
      const src = e.target?.result as string
      const img = new Image()
      img.onload = async () => {
        setRawImage(img)
        const processed = await sliceAndProcessTextureImage(img, {
          overlayStructure,
          consistCategory: currentConsistCategory,
          liveryStyle: currentTheme.liveryStyle,
          carType: 'head',
          frameColor: currentTheme.colors.frame,
          windowColor: currentTheme.colors.window
        })
        setImportedTexture(processed)
        setIsProcessingImage(false)
      }
      img.onerror = () => {
        setImportError('图片读取失败，请上传标准的 PNG、JPG 或 WebP 图像')
        setIsProcessingImage(false)
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }

  // 切换结构图层叠加并重新切片
  const handleToggleOverlay = async (val: boolean) => {
    setOverlayStructure(val)
    if (!rawImage) return
    setIsProcessingImage(true)
    const processed = await sliceAndProcessTextureImage(rawImage, {
      overlayStructure: val,
      consistCategory: currentConsistCategory,
      liveryStyle: currentTheme.liveryStyle,
      carType: 'head',
      frameColor: currentTheme.colors.frame,
      windowColor: currentTheme.colors.window
    })
    setImportedTexture(processed)
    setIsProcessingImage(false)
  }

  // 应用切片贴图到当前列车
  const handleApplyCustomTexture = () => {
    if (!importedTexture || !baker) return
    baker.applyCustomTextureCanvases(importedTexture.canvases)
    setHasAppliedCustom(true)
    onCustomTextureApplied?.()
  }

  // 重置回预设涂装
  const handleResetToPreset = () => {
    setImportedTexture(null)
    setRawImage(null)
    setHasAppliedCustom(false)
    onThemeChange(currentTheme)
    onCustomTextureApplied?.()
  }

  return (
    <div className={`flex flex-col h-full ${isLight ? 'bg-white text-zinc-800' : 'bg-zinc-900 text-zinc-100'} text-xs select-none`}>
      {/* 隐式文件上传 input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportLiveryFile}
        accept=".papercraft-livery,.json"
        className="hidden"
      />
      <input
        type="file"
        ref={imageInputRef}
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleImageFileSelected(file)
          e.target.value = ''
        }}
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
      />

      {/* 选项卡导航 (3个主标签，宽敞从容，绝对不折行) */}
      <div className={`flex border-b ${isLight ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-800 bg-zinc-950/40'} p-1 gap-1.5`}>
        <button
          onClick={() => setActiveTab('preset')}
          className={`flex-1 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all text-xs ${
            activeTab === 'preset'
              ? isLight
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'bg-zinc-800 text-white shadow-sm'
              : 'opacity-60 hover:opacity-100'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>经典涂装</span>
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all text-xs ${
            activeTab === 'ai'
              ? isLight
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'bg-zinc-800 text-white shadow-sm'
              : 'opacity-60 hover:opacity-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>AI 涂装</span>
        </button>
        <button
          onClick={() => setActiveTab('customize')}
          className={`flex-1 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all text-xs ${
            activeTab === 'customize'
              ? isLight
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'bg-zinc-800 text-white shadow-sm'
              : 'opacity-60 hover:opacity-100'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>文字调色</span>
        </button>
      </div>

      {/* 导入错误警告框 */}
      {importError && (
        <div className="mx-3 mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] flex items-start gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 leading-tight">{importError}</div>
          <button onClick={() => setImportError(null)} className="opacity-60 hover:opacity-100 font-bold">×</button>
        </div>
      )}

      {/* 选项卡内容 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Tab 1: 预设经典涂装 */}
        {activeTab === 'preset' && (
          <div className="space-y-2.5">
            {/* 车型专属与导入/导出工具栏 */}
            <div className="flex items-center justify-between gap-1 flex-wrap pb-0.5">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                <Palette className="w-3.5 h-3.5 text-sky-500" />
                <span>专属涂装 ({displayThemes.length})</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="导入 .papercraft-livery 涂装文件"
                  className={`px-2 py-0.5 rounded border text-[10px] font-medium flex items-center gap-1 ${
                    isLight ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  导入涂装
                </button>
                <button
                  onClick={handleExportLivery}
                  title="导出当前涂装为 .papercraft-livery 文件"
                  className={`px-2 py-0.5 rounded border text-[10px] font-medium flex items-center gap-1 ${
                    isLight ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                  }`}
                >
                  <Download className="w-3 h-3" />
                  导出涂装
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {displayThemes.map(theme => {
                const isSelected = currentTheme.id === theme.id

                return (
                  <div
                    key={theme.id}
                    onClick={() => {
                      setImportError(null)
                      onThemeChange(theme)
                      onUseCustomColorsChange(false)
                    }}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? isLight
                          ? 'bg-zinc-100 border-zinc-900 ring-1 ring-zinc-900 shadow-xs cursor-pointer'
                          : 'bg-zinc-800 border-zinc-400 ring-1 ring-zinc-400 shadow-xs cursor-pointer'
                        : isLight
                          ? 'bg-white border-zinc-200 hover:bg-zinc-50 cursor-pointer'
                          : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-xs">{theme.name}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 font-medium">
                          专属涂装
                        </span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                    </div>
                    <p className="text-[10px] opacity-60 mb-2 leading-relaxed">{theme.description}</p>
                    <div className="flex items-center gap-1">
                      <div className="h-2.5 flex-1 rounded border border-black/10" style={{ backgroundColor: theme.colors.primary }} />
                      <div className="h-2.5 flex-1 rounded border border-black/10" style={{ backgroundColor: theme.colors.secondary }} />
                      <div className="h-2.5 flex-1 rounded border border-black/10" style={{ backgroundColor: theme.colors.accent }} />
                      <div className="h-2.5 flex-1 rounded border border-black/10" style={{ backgroundColor: theme.colors.roof }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tab 2: AI 涂装 (整合贴图导入切片与 Prompt 文本生成) */}
        {activeTab === 'ai' && (
          <div className="space-y-3">
            {/* 二级模式切换胶囊 */}
            <div className={`flex p-0.5 rounded-lg border ${isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-950 border-zinc-800'}`}>
              <button
                onClick={() => setAiSubMode('import')}
                className={`flex-1 py-1 rounded-md text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
                  aiSubMode === 'import'
                    ? isLight ? 'bg-white text-zinc-900 shadow-xs' : 'bg-zinc-800 text-white shadow-xs'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <FolderDown className="w-3.5 h-3.5 text-sky-500" />
                <span>贴图导入与切片</span>
              </button>
              <button
                onClick={() => setAiSubMode('prompt')}
                className={`flex-1 py-1 rounded-md text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
                  aiSubMode === 'prompt'
                    ? isLight ? 'bg-white text-zinc-900 shadow-xs' : 'bg-zinc-800 text-white shadow-xs'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Prompt 生图</span>
              </button>
            </div>

            {/* SubMode 1: 贴图导入切片 */}
            {aiSubMode === 'import' && (
              <div className="space-y-3">
                {/* 上传拖拽点击区 */}
                <div
                  onClick={() => imageInputRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault()
                    const file = e.dataTransfer.files?.[0]
                    if (file) handleImageFileSelected(file)
                  }}
                  className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    isLight
                      ? 'border-zinc-300 hover:border-zinc-500 bg-zinc-50/50 hover:bg-zinc-50'
                      : 'border-zinc-700 hover:border-zinc-500 bg-zinc-950/30 hover:bg-zinc-950/60'
                  }`}
                >
                  <div className="p-2.5 rounded-full bg-sky-500/10 text-sky-500">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                      {isProcessingImage ? '正在智能切片与图层解析...' : '点击上传或将贴图图片拖到此处'}
                    </div>
                    <div className="text-[10px] opacity-50 mt-0.5">支持 2048×1536 总谱图或 1024×280 侧身图</div>
                  </div>
                </div>

                {/* 切片结果展示与控制 */}
                {importedTexture && (
                  <div className="space-y-2.5 pt-0.5">
                    {/* 识别状态徽章 */}
                    <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px]">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        <span>
                          {importedTexture.detectedType === 'atlas' ? '已识别：2048×1536 贴图总谱 (5面完整切片)' : '已识别：单侧身插画 (自动镜像生成双侧)'}
                        </span>
                      </div>
                    </div>

                    {/* 结构图层叠加开关 */}
                    <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'} flex items-center justify-between`}>
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-500" />
                        <div>
                          <div className="font-medium text-xs">自动叠加写实门窗结构</div>
                          <div className="text-[9px] opacity-50">在底漆层上叠加深黑玻璃与金属门框</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={overlayStructure}
                        onChange={e => handleToggleOverlay(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600"
                      />
                    </div>

                    {/* 切片缩略图实时预览 */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-medium opacity-60 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>各分面切片预览:</span>
                      </div>

                      <div className="space-y-1.5">
                        <div>
                          <div className="text-[9px] opacity-50 mb-0.5">左侧身 (1024 × 280)</div>
                          <img src={importedTexture.dataUrls.side_left} alt="左侧身" className="w-full h-12 object-cover rounded border border-black/10 shadow-xs" />
                        </div>
                        <div>
                          <div className="text-[9px] opacity-50 mb-0.5">右侧身 (1024 × 280)</div>
                          <img src={importedTexture.dataUrls.side_right} alt="右侧身" className="w-full h-12 object-cover rounded border border-black/10 shadow-xs" />
                        </div>

                        {importedTexture.dataUrls.roof && (
                          <div>
                            <div className="text-[9px] opacity-50 mb-0.5">车顶 (1024 × 280)</div>
                            <img src={importedTexture.dataUrls.roof} alt="车顶" className="w-full h-10 object-cover rounded border border-black/10 shadow-xs" />
                          </div>
                        )}

                        {importedTexture.dataUrls.front && importedTexture.dataUrls.back && (
                          <div className="grid grid-cols-2 gap-1.5">
                            <div>
                              <div className="text-[9px] opacity-50 mb-0.5">车头 (380 × 320)</div>
                              <img src={importedTexture.dataUrls.front} alt="车头" className="w-full h-14 object-contain rounded border border-black/10 shadow-xs bg-zinc-950/10" />
                            </div>
                            <div>
                              <div className="text-[9px] opacity-50 mb-0.5">车尾 (380 × 320)</div>
                              <img src={importedTexture.dataUrls.back} alt="车尾" className="w-full h-14 object-contain rounded border border-black/10 shadow-xs bg-zinc-950/10" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="pt-2 space-y-1.5">
                      <button
                        onClick={handleApplyCustomTexture}
                        className="w-full py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-medium rounded-xl flex items-center justify-center gap-1.5 text-xs transition-all shadow-md active:scale-98"
                      >
                        <Check className="w-4 h-4" />
                        <span>{hasAppliedCustom ? '✓ 贴图已应用至 3D 与展开图' : '🚀 立即应用到 3D 与展开图纸'}</span>
                      </button>

                      <button
                        onClick={handleResetToPreset}
                        className={`w-full py-1.5 rounded-lg border text-xs flex items-center justify-center gap-1 opacity-70 hover:opacity-100 transition-all ${
                          isLight ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-700' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                        }`}
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>恢复经典预设涂装</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SubMode 2: Prompt 文本生成 */}
            {aiSubMode === 'prompt' && (
              <div className="space-y-2.5">
                <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'}`}>
                  <div className="flex items-center gap-1.5 font-medium mb-1">
                    <Wand2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>Prompt 驱动生成涂装</span>
                  </div>
                  <p className="text-[10px] opacity-60 leading-relaxed">
                    输入您想要的主题或车次，AI 自动为当前【{getCategoryLabel(currentConsistCategory)}】生成贴合的 3D 与展开图涂装。
                  </p>
                </div>

                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="例如：日系樱花初春限定列车、赛博黑金电车、重装极地探险车..."
                  rows={3}
                  className={`w-full ${isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400' : 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-500'} border rounded-xl p-2.5 text-xs focus:outline-none focus:border-zinc-500`}
                />

                <button
                  disabled={isGenerating || !prompt.trim()}
                  onClick={() => handleAiGenerate()}
                  className={`w-full py-2 ${isLight ? 'bg-zinc-900 hover:bg-zinc-800 text-white' : 'bg-white hover:bg-zinc-100 text-zinc-900'} disabled:opacity-50 font-medium rounded-xl flex items-center justify-center gap-1.5 text-xs transition-all shadow-sm`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      正在生成中...
                    </>
                  ) : (
                    <>
                      <Sparkle className="w-3.5 h-3.5" />
                      立即生成定制涂装
                    </>
                  )}
                </button>

                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] opacity-60">灵感词库:</div>
                  <div className="flex flex-wrap gap-1">
                    {inspirationPrompts.map(p => (
                      <button
                        key={p}
                        onClick={() => {
                          setPrompt(p)
                          handleAiGenerate(p)
                        }}
                        className={`px-2 py-1 rounded-md border text-[10px] transition-colors ${
                          isLight
                            ? 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-700'
                            : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 贴图模版与线框导出专区 (适合 ControlNet 垫图与 Photoshop 涂装设计) */}
            <div className={`mt-3 pt-3 border-t ${isLight ? 'border-zinc-200' : 'border-zinc-800'} space-y-2`}>
              <div className="flex items-center gap-1.5 font-medium text-xs">
                <Layout className="w-3.5 h-3.5 text-sky-500" />
                <span>导出 AI 贴图设计模版 (Texture Template)</span>
              </div>
              <p className="text-[10px] opacity-60 leading-relaxed">
                导出当前车型的 1:1 标准外轮廓画布。可直接作为 ControlNet 垫图输入给 Midjourney / SD，或在画图软件中手工设计涂装。
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    exportMasterTextureAtlas({
                      consistName: currentTheme.name || '列车',
                      category: currentConsistCategory as any,
                      style: currentTheme.liveryStyle || 'shinkansen-nankai-rapit',
                      carType: 'head'
                    })
                  }}
                  className={`px-2.5 py-2 rounded-lg border text-[11px] font-medium flex flex-col items-center justify-center gap-1 text-center transition-all ${
                    isLight ? 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800' : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200'
                  }`}
                  title="导出包含左侧、右侧、车顶、车头车尾的 2048x1536 贴图总谱 PNG"
                >
                  <ImageIcon className="w-4 h-4 text-sky-500" />
                  <span>贴图总谱模版</span>
                  <span className="text-[9px] opacity-50 font-normal">2048 × 1536 PNG</span>
                </button>

                <button
                  onClick={() => {
                    exportSingleSideWireframe({
                      consistName: currentTheme.name || '列车',
                      category: currentConsistCategory as any,
                      style: currentTheme.liveryStyle || 'shinkansen-nankai-rapit',
                      carType: 'head',
                      isLeft: true
                    })
                  }}
                  className={`px-2.5 py-2 rounded-lg border text-[11px] font-medium flex flex-col items-center justify-center gap-1 text-center transition-all ${
                    isLight ? 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800' : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200'
                  }`}
                  title="导出单侧车身高精度外轮廓图 (1024x280 PNG)"
                >
                  <Download className="w-4 h-4 text-emerald-500" />
                  <span>侧身线框模版</span>
                  <span className="text-[9px] opacity-50 font-normal">1024 × 280 PNG</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: 自定义文字与调色板 */}
        {activeTab === 'customize' && (
          <div className="space-y-4">
            {/* 定制标语与车牌 */}
            <div className={`p-3 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'} space-y-2.5`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs">车身专属标识与文字</span>
                <input
                  type="checkbox"
                  checked={customText.enabled}
                  onChange={e => onCustomTextChange({ ...customText, enabled: e.target.checked })}
                  className="rounded text-zinc-900 dark:text-white"
                />
              </div>

              {customText.enabled && (
                <div className="space-y-2 pt-1">
                  <div>
                    <label className="text-[10px] opacity-60 mb-0.5 block">车侧铭牌 (如名字):</label>
                    <input
                      type="text"
                      value={customText.kidName}
                      onChange={e => onCustomTextChange({ ...customText, kidName: e.target.value })}
                      placeholder="ALEX'S EXPRESS"
                      className={`w-full ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-700'} border rounded-lg px-2 py-1 text-xs`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] opacity-60 mb-0.5 block">车次编号:</label>
                      <input
                        type="text"
                        value={customText.trainNumber}
                        onChange={e => onCustomTextChange({ ...customText, trainNumber: e.target.value })}
                        placeholder="EXP-88"
                        className={`w-full ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-700'} border rounded-lg px-2 py-1 text-xs`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] opacity-60 mb-0.5 block">目的地 (LED):</label>
                      <input
                        type="text"
                        value={customText.destination}
                        onChange={e => onCustomTextChange({ ...customText, destination: e.target.value })}
                        placeholder="新宿·东京"
                        className={`w-full ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-700'} border rounded-lg px-2 py-1 text-xs`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 自由调色板 */}
            <div className={`p-3 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'} space-y-2.5`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs">自定义色彩</span>
                <button
                  onClick={() => onUseCustomColorsChange(!useCustomColors)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                    useCustomColors
                      ? isLight ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-900 font-medium'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {useCustomColors ? '已启用自定义' : '使用主题色'}
                </button>
              </div>

              {useCustomColors && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] opacity-60 mb-0.5 block">车身主色:</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={customColors.primary}
                        onChange={e => onCustomColorsChange({ ...customColors, primary: e.target.value })}
                        className="w-6 h-6 rounded border cursor-pointer bg-transparent"
                      />
                      <span className="text-[10px] font-mono opacity-80">{customColors.primary}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] opacity-60 mb-0.5 block">条纹副色:</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={customColors.secondary}
                        onChange={e => onCustomColorsChange({ ...customColors, secondary: e.target.value })}
                        className="w-6 h-6 rounded border cursor-pointer bg-transparent"
                      />
                      <span className="text-[10px] font-mono opacity-80">{customColors.secondary}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] opacity-60 mb-0.5 block">点缀线条:</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={customColors.accent}
                        onChange={e => onCustomColorsChange({ ...customColors, accent: e.target.value })}
                        className="w-6 h-6 rounded border cursor-pointer bg-transparent"
                      />
                      <span className="text-[10px] font-mono opacity-80">{customColors.accent}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] opacity-60 mb-0.5 block">车顶色:</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={customColors.roof}
                        onChange={e => onCustomColorsChange({ ...customColors, roof: e.target.value })}
                        className="w-6 h-6 rounded border cursor-pointer bg-transparent"
                      />
                      <span className="text-[10px] font-mono opacity-80">{customColors.roof}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
