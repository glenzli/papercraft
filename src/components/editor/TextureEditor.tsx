// 涂装设计面板 (支持车型专属预设、贴图总模版导出与自定义贴图导入、高对比度文字与自由调色、多语言)
import React, { useState, useRef } from 'react'
import { TextureTheme, CustomTextConfig } from '../../texture/types'
import { matchesCatalogQuery } from '../../core/models/catalog'
import { TrainModelConsist } from '../../core/schema/consistSchema'
import {
  downloadLiveryFile,
  isLiveryCompatible,
  loadLiveryFromFile,
  convertThemeToLiverySchema,
  convertLiverySchemaToTheme
} from '../../core/schema/liverySchema'
import { modelRepository } from '../../core/models/modelRepository'
import { TextureBaker } from '../../texture/textureBaker'
import {
  sliceAndProcessTextureImage,
  ProcessedCustomTexture
} from '../../texture/customTextureImporter'
import { exportMasterTextureAtlas } from '../../export/textureTemplateExporter'
import {
  Palette,
  Type,
  Check,
  Download,
  Upload,
  AlertCircle,
  Image as ImageIcon,
  Layers,
  Eye,
  RotateCcw,
  Sliders,
  Move,
  Search,
  X
} from 'lucide-react'
import { useI18n } from '../../i18n'

interface TextureEditorProps {
  currentConsist?: TrainModelConsist
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
  themeMode?: 'light' | 'dark'
  baker?: TextureBaker
  customTexture?: ProcessedCustomTexture['canvases'] | null
  onCustomTextureChange: (texture:ProcessedCustomTexture['canvases']|null)=>void
}

export const TextureEditor: React.FC<TextureEditorProps> = ({
  currentConsist,
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
  themeMode = 'dark',
  baker,
  customTexture,
  onCustomTextureChange
}) => {
  const { t, isZh } = useI18n()
  const [activeTab, setActiveTab] = useState<'preset' | 'customize' | 'artwork'>('preset')
  const [liveryQuery,setLiveryQuery] = useState('')
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // 自定义贴图解析与切片状态
  const [importedTexture, setImportedTexture] = useState<ProcessedCustomTexture | null>(null)
  const [rawImage, setRawImage] = useState<HTMLImageElement | null>(null)
  const [overlayStructure, setOverlayStructure] = useState<boolean>(true)
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false)
  const hasAppliedCustom = !!customTexture

  const isLight = themeMode === 'light'

  // 获取当前车型的全量涂装列表 (官方预设 + 动态导入的附属涂装)
  const availableThemes = modelRepository.getAllLiveriesForConsist(currentConsistId)
  const displayThemes = availableThemes.filter(theme=>matchesCatalogQuery(liveryQuery,[theme.name,theme.nameEn,theme.description,theme.descriptionEn,theme.id]))

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'shinkansen': return t('models.categoryShinkansen')
      case 'steam': return t('models.categorySteam')
      case 'commuter': return t('models.categoryCommuter')
      default: return category.toUpperCase()
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
    e.target.value = ''
    setImportError(null)

    const res = await loadLiveryFromFile(file)
    if (!res.success || !res.livery) {
      setImportError(res.error || t('texture.liveryParseError'))
      return
    }

    const livery = res.livery

    // 严格车型兼容校验
    if (!isLiveryCompatible(livery,currentConsistId,currentConsistCategory)) {
      setImportError(t('texture.liveryMismatchError', {
        target: livery.targetConsistIds?.length ? livery.targetConsistIds.map(id=>modelRepository.getConsist(id)?.name||id).join(', ') : getCategoryLabel(livery.targetCategory),
        current: getCategoryLabel(currentConsistCategory)
      }))
      return
    }

    const newTheme = convertLiverySchemaToTheme(livery)
    // 动态注册到涂装仓库
    modelRepository.registerDynamicLiveries(currentConsistId, [newTheme])
    onThemeChange(newTheme)
    if (livery.customText) {
      onCustomTextChange({
        enabled: true,
        trainNumber: livery.customText.trainNumber || 'EXP-01',
        destination: livery.customText.destination || '特快',
        kidName: livery.customText.kidName || "KID'S EXPRESS",
        textColor: '#ffffff',
        bgColor: '#0f172a',
        offsetX: 0,
        offsetY: 0
      })
    }
    onUseCustomColorsChange(false)
    e.target.value = ''
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
        setImportError(t('texture.imageReadError'))
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
    onCustomTextureChange(importedTexture.canvases)
  }

  // 重置回预设涂装
  const handleResetToPreset = () => {
    setImportedTexture(null)
    setRawImage(null)
    onCustomTextureChange(null)
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

      {/* 选项卡导航 (涂装 / 文字与调色) */}
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
          <span>{isZh?'预设涂装':'Presets'}</span>
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
          <span>{isZh?'调色与文字':'Customize'}</span>
        </button>
        <button onClick={()=>setActiveTab('artwork')} className={`flex-1 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1 text-xs ${activeTab==='artwork'?(isLight?'bg-white shadow-sm':'bg-zinc-800'):'opacity-60 hover:opacity-100'}`}><ImageIcon className="w-3.5 h-3.5"/>{isZh?'贴图':'Artwork'}</button>
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
      <div className="flex-1 p-1 pt-3 space-y-4">
        {/* Tab 1: 涂装 (整合预设涂装、模版下载与贴图上传) */}
        {activeTab === 'preset' && (
          <div className="space-y-4">
            {/* 1. 专属预设涂装 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-1 flex-wrap pb-0.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                  <Palette className="w-3.5 h-3.5 text-sky-500" />
                  <span>{isZh?`可用涂装 (${availableThemes.length})`:`Available liveries (${availableThemes.length})`}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title={isZh?'导入 .papercraft-livery 涂装文件':'Import a .papercraft-livery file'}
                    className={`px-2 py-0.5 rounded border text-[10px] font-medium flex items-center gap-1 ${
                      isLight ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <Upload className="w-3 h-3" />
                    {t('texture.importLivery')}
                  </button>
                  <button
                    onClick={handleExportLivery}
                    title={isZh?'导出当前涂装为 .papercraft-livery 文件':'Export the current livery'}
                    className={`px-2 py-0.5 rounded border text-[10px] font-medium flex items-center gap-1 ${
                      isLight ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <Download className="w-3 h-3" />
                    {t('texture.exportLivery')}
                  </button>
                </div>
              </div>

              <div className={`p-3 rounded-xl border ${isLight?'bg-sky-50/60 border-sky-100':'bg-sky-950/20 border-sky-900/50'}`}>
                <div className="text-[10px] opacity-60 mb-1">{isZh?'当前涂装':'Current livery'}{useCustomColors?(isZh?' · 已调色':' · Custom colors'):''}{hasAppliedCustom?(isZh?' · 已应用贴图':' · Artwork applied'):''}</div>
                <div className="font-semibold text-sm">{isZh?currentTheme.name:currentTheme.nameEn||currentTheme.name}</div>
                <p className="text-[11px] leading-5 opacity-60 mt-1">{isZh?currentTheme.description:currentTheme.descriptionEn||currentTheme.description}</p>
                {hasAppliedCustom&&<button onClick={handleResetToPreset} className="text-sky-600 dark:text-sky-400 text-xs underline mt-2">{isZh?'移除上传贴图':'Remove uploaded artwork'}</button>}
              </div>
              {(useCustomColors||hasAppliedCustom)&&<p className="text-[11px] opacity-60">{isZh?'选择预设会替换当前调色与上传贴图。':'Selecting a preset replaces custom colors and uploaded artwork.'}</p>}
              {availableThemes.length>4&&<label className={`flex items-center gap-2 px-2 py-2 rounded-lg border ${isLight?'border-zinc-200':'border-zinc-700'}`}><Search className="w-3.5 h-3.5 opacity-50"/><input value={liveryQuery} onChange={e=>setLiveryQuery(e.target.value)} className="w-full outline-none bg-transparent text-xs" aria-label={isZh?'搜索涂装':'Search liveries'} placeholder={isZh?'搜索名称或颜色':'Search name or color'}/>{liveryQuery&&<button onClick={()=>setLiveryQuery('')} aria-label={isZh?'清除涂装搜索':'Clear livery search'}><X className="w-3 h-3"/></button>}</label>}
              <div className="grid grid-cols-2 gap-2 max-h-[420px] overflow-y-auto p-0.5">
                {displayThemes.map(theme=>{
                  const selected=currentTheme.id===theme.id
                  return <button key={theme.id} onClick={()=>{setImportError(null);onThemeChange(theme)}} aria-pressed={selected} className={`p-2 rounded-xl border text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500 ${selected?'border-sky-500 bg-sky-500/10':isLight?'border-zinc-200 hover:border-zinc-400':'border-zinc-700 hover:border-zinc-500'}`}>
                    <span className="flex h-6 rounded-md overflow-hidden border border-black/10 mb-2" aria-hidden="true">{[theme.colors.primary,theme.colors.secondary,theme.colors.accent,theme.colors.roof].map((color,i)=><span key={i} className={i===0?'flex-[3]':'flex-1'} style={{backgroundColor:color}}/>)}</span>
                    <span className="flex justify-between items-start gap-1"><span className="font-medium text-[11px] leading-4">{isZh?theme.name:theme.nameEn||theme.name}</span>{selected&&<Check className="w-3.5 h-3.5 shrink-0 text-sky-600"/>}</span>
                  </button>
                })}
              </div>
              {!displayThemes.length&&<div className="text-center text-xs opacity-60 py-4">{isZh?'没有符合条件的涂装':'No matching liveries'}{liveryQuery&&<button onClick={()=>setLiveryQuery('')} className="block mx-auto mt-2 underline">{isZh?'清除搜索':'Clear search'}</button>}</div>}
              <p className="text-[10px] opacity-50 leading-4">{isZh?'涂装只改变颜色与图案。模型形体保持不变。':'Liveries change colors and artwork; the model geometry stays the same.'}</p>
            </div>
          </div>
        )}

        {activeTab === 'artwork' && (
          <div className="space-y-4">
            {hasAppliedCustom&&<div className="p-3 rounded-lg bg-sky-500/10 text-xs"><span>{isZh?'当前模型已应用上传贴图。':'Uploaded artwork is applied to this model.'}</span><button onClick={handleResetToPreset} className="block mt-2 underline">{isZh?'移除上传贴图':'Remove uploaded artwork'}</button></div>}
            {/* 2. 贴图设计模版与上传专区 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{t('texture.customTextureDesign')}</span>
                </div>

                <button
                  onClick={() => {
                    exportMasterTextureAtlas({
                      consistName: (isZh ? currentTheme.name : (currentTheme.nameEn || currentTheme.name)) || 'Train',
                      category: currentConsistCategory as any,
                      style: currentTheme.liveryStyle || 'shinkansen-nankai-rapit',
                      carType: 'head'
                    })
                  }}
                  className={`px-2 py-1 rounded-md border text-[10px] font-medium flex items-center gap-1 transition-all ${
                    isLight ? 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                  }`}
                  title={t('texture.downloadAtlasTitle')}
                >
                  <Download className="w-3 h-3 text-sky-500" />
                  <span>{t('texture.downloadAtlasTemplate')}</span>
                </button>
              </div>

              {/* 上传拖拽点击区 */}
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault()
                  const file = e.dataTransfer.files?.[0]
                  if (file) handleImageFileSelected(file)
                }}
                className={`w-full p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  isLight
                    ? 'border-zinc-300 hover:border-zinc-500 bg-zinc-50/50 hover:bg-zinc-50'
                    : 'border-zinc-700 hover:border-zinc-500 bg-zinc-950/30 hover:bg-zinc-950/60'
                }`}
              >
                <div className="p-2 rounded-full bg-sky-500/10 text-sky-500">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                    {isProcessingImage ? t('texture.dropzoneProcessing') : t('texture.dropzoneIdle')}
                  </div>
                  <div className="text-[10px] opacity-50 mt-0.5">{t('texture.dropzoneHint')}</div>
                </div>
              </button>

              {/* 切片结果展示与控制 */}
              {importedTexture && (
                <div className="space-y-2.5 pt-0.5">
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px]">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Check className="w-3.5 h-3.5" />
                      <span>
                        {importedTexture.detectedType === 'atlas' ? t('texture.detectedAtlas') : t('texture.detectedSide')}
                      </span>
                    </div>
                  </div>

                  {/* 结构图层叠加开关 */}
                  <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'} flex items-center justify-between`}>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      <div>
                        <div className="font-medium text-xs">{t('texture.overlayStructure')}</div>
                        <div className="text-[9px] opacity-50">{t('texture.overlayStructureDesc')}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={overlayStructure}
                      onChange={e => handleToggleOverlay(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600"
                    />
                  </div>

                  {/* 切片预览 */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-medium opacity-60 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{t('texture.slicePreview')}</span>
                    </div>

                    <div className="space-y-1.5">
                      <div>
                        <div className="text-[9px] opacity-50 mb-0.5">{t('texture.sliceLeftSide')}</div>
                        <img src={importedTexture.dataUrls.side_left} alt="Left Side" className="w-full h-12 object-cover rounded border border-black/10 shadow-xs" />
                      </div>
                      <div>
                        <div className="text-[9px] opacity-50 mb-0.5">{t('texture.sliceRightSide')}</div>
                        <img src={importedTexture.dataUrls.side_right} alt="Right Side" className="w-full h-12 object-cover rounded border border-black/10 shadow-xs" />
                      </div>
                      {importedTexture.dataUrls.roof && (
                        <div>
                          <div className="text-[9px] opacity-50 mb-0.5">{t('texture.sliceRoof')}</div>
                          <img src={importedTexture.dataUrls.roof} alt="Roof" className="w-full h-10 object-cover rounded border border-black/10 shadow-xs" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="pt-1 space-y-1.5">
                    <button
                      onClick={handleApplyCustomTexture}
                      className="w-full py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-medium rounded-xl flex items-center justify-center gap-1.5 text-xs transition-all shadow-md active:scale-98"
                    >
                      <Check className="w-4 h-4" />
                      <span>{hasAppliedCustom ? t('texture.appliedSuccess') : t('texture.applyToModel')}</span>
                    </button>

                    <button
                      onClick={handleResetToPreset}
                      className={`w-full py-1.5 rounded-lg border text-xs flex items-center justify-center gap-1 opacity-70 hover:opacity-100 transition-all ${
                        isLight ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-700' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{t('texture.resetToPreset')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: 自定义文字与调色板 */}
        {activeTab === 'customize' && (
          <div className="space-y-4">
            {/* 1. 定制标语与车牌 */}
            <div className={`p-3 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'} space-y-2.5`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs">{t('customization.decalsTitle')}</span>
                <input
                  type="checkbox"
                  checked={customText.enabled}
                  onChange={e => onCustomTextChange({ ...customText, enabled: e.target.checked })}
                  className="w-4 h-4 rounded text-zinc-900 dark:text-white"
                />
              </div>

              {customText.enabled && (
                <div className="space-y-3 pt-1">
                  {currentConsist?.customization?.textSlots && currentConsist.customization.textSlots.length > 0 ? (
                    /* 数据驱动的动态文字插槽 */
                    <div className="space-y-2">
                      {currentConsist.customization.textSlots.map(slot => {
                        const val = customText.slots?.[slot.key] ?? slot.defaultValue ?? ''
                        const slotLabel = isZh ? slot.label : (slot.labelEn || slot.label)
                        const placeholder = isZh ? slot.placeholder : (slot.placeholderEn || slot.placeholder)

                        return (
                          <div key={slot.key}>
                            <label className="text-[10px] opacity-60 mb-0.5 block">{slotLabel}</label>
                            <input
                              type="text"
                              value={val}
                              onChange={e => {
                                const nextSlots = { ...(customText.slots || {}), [slot.key]: e.target.value }
                                onCustomTextChange({
                                  ...customText,
                                  slots: nextSlots,
                                  ...(slot.key === 'routeNumber' ? { trainNumber: e.target.value } : {}),
                                  ...(slot.key === 'destination' ? { destination: e.target.value } : {}),
                                  ...(slot.key === 'operator' ? { kidName: e.target.value } : {})
                                })
                              }}
                              placeholder={placeholder}
                              className={`w-full ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-700'} border rounded-lg px-2 py-1 text-xs`}
                            />
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    /* 默认列车铭牌与车次车牌 */
                    <>
                      <div>
                        <label className="text-[10px] opacity-60 mb-0.5 block">{t('customization.nameplateLabel')}</label>
                        <input
                          type="text"
                          value={customText.kidName}
                          onChange={e => onCustomTextChange({ ...customText, kidName: e.target.value })}
                          placeholder={t('customization.nameplatePlaceholder')}
                          className={`w-full ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-700'} border rounded-lg px-2 py-1 text-xs`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] opacity-60 mb-0.5 block">{t('customization.trainNumberLabel')}</label>
                          <input
                            type="text"
                            value={customText.trainNumber}
                            onChange={e => onCustomTextChange({ ...customText, trainNumber: e.target.value })}
                            placeholder={t('customization.trainNumberPlaceholder')}
                            className={`w-full ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-700'} border rounded-lg px-2 py-1 text-xs`}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] opacity-60 mb-0.5 block">{t('customization.destinationLabel')}</label>
                          <input
                            type="text"
                            value={customText.destination}
                            onChange={e => onCustomTextChange({ ...customText, destination: e.target.value })}
                            placeholder={t('customization.destinationPlaceholder')}
                            className={`w-full ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-700'} border rounded-lg px-2 py-1 text-xs`}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* 文字与底框色彩设置 */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-black/5 dark:border-white/5">
                    <div>
                      <label className="text-[10px] opacity-60 mb-0.5 block">{t('customization.textColorLabel')}</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={customText.textColor || '#ffffff'}
                          onChange={e => onCustomTextChange({ ...customText, textColor: e.target.value })}
                          className="w-6 h-6 rounded border cursor-pointer bg-transparent"
                        />
                        <span className="text-[10px] font-mono opacity-80">{customText.textColor || '#ffffff'}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] opacity-60 mb-0.5 block">{t('customization.bgColorLabel')}</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={customText.bgColor || '#0f172a'}
                          onChange={e => onCustomTextChange({ ...customText, bgColor: e.target.value })}
                          className="w-6 h-6 rounded border cursor-pointer bg-transparent"
                        />
                        <span className="text-[10px] font-mono opacity-80">{customText.bgColor || '#0f172a'}</span>
                      </div>
                    </div>
                  </div>

                  {/* 位置偏移控制 (支持横向和纵向偏移) */}
                  <div className="space-y-2 pt-1 border-t border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="opacity-60 flex items-center gap-1">
                        <Move className="w-3 h-3" />
                        <span>{t('customization.horizontalOffset', { val: customText.offsetX ?? 0 })}</span>
                      </span>
                      <button
                        onClick={() => onCustomTextChange({ ...customText, offsetX: 0 })}
                        className="opacity-50 hover:opacity-100 text-[9px]"
                      >
                        {t('customization.center')}
                      </button>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={customText.offsetX ?? 0}
                      onChange={e => onCustomTextChange({ ...customText, offsetX: parseInt(e.target.value) || 0 })}
                      className="w-full h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                    />

                    <div className="flex items-center justify-between text-[10px] pt-1">
                      <span className="opacity-60 flex items-center gap-1">
                        <Sliders className="w-3 h-3" />
                        <span>{t('customization.verticalOffset', { val: customText.offsetY ?? 0 })}</span>
                      </span>
                      <button
                        onClick={() => onCustomTextChange({ ...customText, offsetY: 0 })}
                        className="opacity-50 hover:opacity-100 text-[9px]"
                      >
                        {t('customization.default')}
                      </button>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={customText.offsetY ?? 0}
                      onChange={e => onCustomTextChange({ ...customText, offsetY: parseInt(e.target.value) || 0 })}
                      className="w-full h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. 自由调色板 */}
            <div className={`p-3 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950/60 border-zinc-800'} space-y-2.5`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs">{t('customization.colorTuningTitle')}</span>
                <button
                  onClick={() => onUseCustomColorsChange(!useCustomColors)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                    useCustomColors
                      ? isLight ? 'bg-zinc-900 text-white font-medium' : 'bg-zinc-100 text-zinc-900 font-medium'
                      : isLight ? 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {useCustomColors ? t('customization.customColorsActive') : t('customization.enableCustomColors')}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className="text-[10px] opacity-60 mb-0.5 block">{t('customization.primaryColor')}</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={customColors.primary}
                      onChange={e => {
                        onCustomColorsChange({ ...customColors, primary: e.target.value })
                        if (!useCustomColors) onUseCustomColorsChange(true)
                      }}
                      className="w-6 h-6 rounded border cursor-pointer bg-transparent"
                    />
                    <span className="text-[10px] font-mono opacity-80">{customColors.primary}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] opacity-60 mb-0.5 block">{t('customization.secondaryStripe')}</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={customColors.secondary}
                      onChange={e => {
                        onCustomColorsChange({ ...customColors, secondary: e.target.value })
                        if (!useCustomColors) onUseCustomColorsChange(true)
                      }}
                      className="w-6 h-6 rounded border cursor-pointer bg-transparent"
                    />
                    <span className="text-[10px] font-mono opacity-80">{customColors.secondary}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] opacity-60 mb-0.5 block">{t('customization.accentStripe')}</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={customColors.accent}
                      onChange={e => {
                        onCustomColorsChange({ ...customColors, accent: e.target.value })
                        if (!useCustomColors) onUseCustomColorsChange(true)
                      }}
                      className="w-6 h-6 rounded border cursor-pointer bg-transparent"
                    />
                    <span className="text-[10px] font-mono opacity-80">{customColors.accent}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] opacity-60 mb-0.5 block">{t('customization.roofColor')}</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={customColors.roof}
                      onChange={e => {
                        onCustomColorsChange({ ...customColors, roof: e.target.value })
                        if (!useCustomColors) onUseCustomColorsChange(true)
                      }}
                      className="w-6 h-6 rounded border cursor-pointer bg-transparent"
                    />
                    <span className="text-[10px] font-mono opacity-80">{customColors.roof}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
