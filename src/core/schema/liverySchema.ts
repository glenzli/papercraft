// 涂装独立文件格式定义 (Papercraft Livery Schema .papercraft-livery)
import { TextureTheme, LiveryStyle } from '../../texture/types'

export interface PapercraftLiverySchema {
  $schema?: string
  version: string // e.g. "1.0.0"
  id: string
  name: string
  author?: string
  description: string
  category: 'railway' | 'bullet' | 'retro' | 'bus' | 'custom'

  // 严格的车型兼容与关联声明 (绝不允许无关联胡乱套用)
  targetCategory: 'commuter' | 'shinkansen' | 'steam' | 'bus' | 'all'
  targetConsistIds: string[]     // 绑定的具体编组 ID，如 ['e235-consist'] 或 ['e5-consist']
  compatibleModelIds?: string[]  // 兼容的模型 ID，如 ['e5-hayabusa-head', 'e5-middle-car']

  liveryStyle: LiveryStyle
  colors: {
    primary: string
    secondary: string
    accent: string
    roof: string
    window: string
    frame: string
  }
  customText?: {
    trainNumber?: string
    destination?: string
    kidName?: string
  }
}

/**
 * 将 TextureTheme 转换为可持久化分发的 PapercraftLiverySchema
 */
export function convertThemeToLiverySchema(
  theme: TextureTheme,
  consistId: string,
  consistCategory: string,
  customText?: { trainNumber?: string; destination?: string; kidName?: string }
): PapercraftLiverySchema {
  return {
    $schema: 'https://papercraft.studio/schema/livery.v1.json',
    version: '1.0.0',
    id: theme.id,
    name: theme.name,
    author: theme.author || 'Papercraft Studio',
    description: theme.description,
    category: theme.category,
    targetCategory: (theme.compatibleCategories?.[0] || consistCategory || 'all') as any,
    targetConsistIds: [consistId],
    liveryStyle: theme.liveryStyle || (
      theme.id === 'doctor-yellow' ? 'shinkansen-doctor-yellow' :
      theme.id === 'osaka-loop' ? 'commuter-osaka-loop' :
      theme.id === 'chuo-orange' ? 'commuter-chuo' :
      theme.id === 'keihin-blue' ? 'commuter-keihin' :
      theme.id === 'sobu-yellow' ? 'commuter-sobu' :
      theme.id === 'n700-nozomi' ? 'shinkansen-n700' :
      theme.id === 'komachi-ruby' ? 'shinkansen-e6' :
      theme.id === 'kagayaki-e7' ? 'shinkansen-e7' :
      theme.category === 'bullet' ? 'shinkansen-e5' :
      theme.category === 'retro' ? 'steam-d51-classic' : 'commuter-yamanote'
    ),
    colors: {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      accent: theme.colors.accent,
      roof: theme.colors.roof,
      window: theme.colors.window,
      frame: theme.colors.frame
    },
    customText
  }
}

/**
 * 将 PapercraftLiverySchema 转换为应用运行时的 TextureTheme
 */
export function convertLiverySchemaToTheme(livery: PapercraftLiverySchema): TextureTheme {
  return {
    id: livery.id,
    name: livery.name,
    category: livery.category,
    compatibleCategories: [livery.targetCategory as any],
    description: livery.description,
    author: livery.author,
    liveryStyle: livery.liveryStyle,
    colors: {
      primary: livery.colors.primary,
      secondary: livery.colors.secondary,
      accent: livery.colors.accent,
      roof: livery.colors.roof,
      window: livery.colors.window,
      frame: livery.colors.frame
    },
    stripes: {
      style: 'single',
      width: 14
    }
  }
}

/**
 * 导出并下载 .papercraft-livery 涂装文件
 */
export function downloadLiveryFile(livery: PapercraftLiverySchema) {
  const jsonStr = JSON.stringify(livery, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${livery.id || 'custom-livery'}.papercraft-livery`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * 从本地文件读取并解析 .papercraft-livery 文件
 */
export async function loadLiveryFromFile(file: File): Promise<{
  success: boolean
  livery?: PapercraftLiverySchema
  error?: string
}> {
  try {
    const text = await file.text()
    const data = JSON.parse(text) as PapercraftLiverySchema

    if (!data.id || !data.colors || !data.name) {
      return {
        success: false,
        error: '涂装文件格式不完整，缺少必须的 id、name 或 colors 字段'
      }
    }

    return {
      success: true,
      livery: data
    }
  } catch (err: any) {
    return {
      success: false,
      error: `解析涂装文件失败: ${err?.message || '未知错误'}`
    }
  }
}
