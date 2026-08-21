// AI 涂装生成引擎 (支持 Mock 智能生成与真实 OpenAI API 调用)
import { TextureTheme } from './types'

export interface AiGenerateParams {
  prompt: string
  apiKey?: string
  apiBaseUrl?: string
  modelName?: string
}

export interface AiGenerateResult {
  theme: TextureTheme
  source: 'mock' | 'openai'
  rawImageUrl?: string
}

/**
 * 本地语义分析 Mock 生成器 (快速、零成本、无需配置 Key 即可体验)
 */
export function generateMockThemeByPrompt(prompt: string): TextureTheme {
  const p = prompt.toLowerCase()

  // 1. 赛博朋克 / 未来科幻
  if (p.includes('赛博') || p.includes('cyber') || p.includes('科幻') || p.includes('未来') || p.includes('neon') || p.includes('机甲')) {
    return {
      id: `ai-cyber-${Date.now()}`,
      name: `AI: 赛博朋克脉冲列车 (${prompt.slice(0, 8)}...)`,
      category: 'custom',
      compatibleCategories: ['all', 'commuter', 'shinkansen', 'steam'],
      description: `基于提示词 "${prompt}" 实时合成的赛博高科技涂装。`,
      colors: {
        primary: '#090a0f',
        secondary: '#00f0ff',
        accent: '#ff0055',
        roof: '#131127',
        window: '#00bfff',
        frame: '#7928ca'
      },
      stripes: {
        style: 'wavy',
        width: 18
      },
      pattern: 'circuit',
      badgeText: 'CYBER-PRO',
      promptKeywords: [prompt]
    }
  }

  // 2. 樱花 / 粉色 / 甜品 / 少女
  if (p.includes('樱花') || p.includes('粉') || p.includes('pink') || p.includes('sakura') || p.includes('可爱') || p.includes('草莓')) {
    return {
      id: `ai-sakura-${Date.now()}`,
      name: `AI: 浪漫樱花特快 (${prompt.slice(0, 8)}...)`,
      category: 'custom',
      compatibleCategories: ['all', 'commuter', 'shinkansen', 'steam'],
      description: `基于提示词 "${prompt}" 实时合成的春日樱花梦幻涂装。`,
      colors: {
        primary: '#fff1f2',
        secondary: '#f43f5e',
        accent: '#fb7185',
        roof: '#fda4af',
        window: '#0284c7',
        frame: '#e11d48'
      },
      stripes: {
        style: 'gradient',
        width: 16
      },
      badgeText: 'SAKURA-EXP',
      promptKeywords: [prompt]
    }
  }

  // 3. 海洋 / 极光 / 冰雪 / 蓝天
  if (p.includes('海') || p.includes('蓝') || p.includes('blue') || p.includes('ocean') || p.includes('冰') || p.includes('极光')) {
    return {
      id: `ai-ocean-${Date.now()}`,
      name: `AI: 深海极光号 (${prompt.slice(0, 8)}...)`,
      category: 'railway',
      compatibleCategories: ['all', 'commuter', 'shinkansen', 'steam'],
      description: `基于提示词 "${prompt}" 实时合成的深海极光涂装。`,
      colors: {
        primary: '#f0f9ff',
        secondary: '#0284c7',
        accent: '#38bdf8',
        roof: '#0369a1',
        window: '#082f49',
        frame: '#0c4a6e'
      },
      stripes: {
        style: 'double',
        width: 14
      },
      badgeText: 'AURORA-01',
      promptKeywords: [prompt]
    }
  }

  // 4. 黄金 / 皇家 / 复古 / 蒸汽
  if (p.includes('金') || p.includes('复古') || p.includes('gold') || p.includes('steam') || p.includes('黑金') || p.includes('古典')) {
    return {
      id: `ai-gold-${Date.now()}`,
      name: `AI: 皇家黑金重工 (${prompt.slice(0, 8)}...)`,
      category: 'retro',
      compatibleCategories: ['all', 'commuter', 'shinkansen', 'steam'],
      description: `基于提示词 "${prompt}" 实时合成的黑金古典奢华涂装。`,
      colors: {
        primary: '#18181b',
        secondary: '#f59e0b',
        accent: '#d97706',
        roof: '#27272a',
        window: '#78350f',
        frame: '#b45309'
      },
      stripes: {
        style: 'double',
        width: 12
      },
      pattern: 'wood',
      badgeText: 'ROYAL-EXP',
      promptKeywords: [prompt]
    }
  }

  // 5. 默认卡通 / 探险 / 阳光
  return {
    id: `ai-custom-${Date.now()}`,
    name: `AI: 创意定制涂装 (${prompt.slice(0, 8)}...)`,
    category: 'custom',
    compatibleCategories: ['all', 'commuter', 'shinkansen', 'steam'],
    description: `基于提示词 "${prompt}" 实时合成的专属涂装。`,
    colors: {
      primary: '#f8fafc',
      secondary: '#6366f1',
      accent: '#ec4899',
      roof: '#4338ca',
      window: '#0f172a',
      frame: '#312e81'
    },
    stripes: {
      style: 'gradient',
      width: 16
    },
    badgeText: 'AI-SPECIAL',
    promptKeywords: [prompt]
  }
}

/**
 * 真实调用 OpenAI 结构化生成涂装配色方案
 */
export async function generateTextureWithOpenAI(params: AiGenerateParams): Promise<AiGenerateResult> {
  const { prompt, apiKey, apiBaseUrl = 'https://api.openai.com/v1', modelName = 'gpt-4o' } = params

  if (!apiKey) {
    throw new Error('未配置 API Key')
  }

  const systemPrompt = `你是一位专业的日本铁路与纸模型工业涂装设计师。
请根据用户的描述，生成一套专业的列车涂装配色与视觉设计方案。
必须返回纯 JSON 格式，严格符合以下结构：
{
  "name": "涂装中文名称",
  "description": "20字以内精炼设计理念",
  "category": "railway" | "bullet" | "retro" | "cyber" | "cartoon",
  "colors": {
    "primary": "#十六进制颜色 (车身主底色)",
    "secondary": "#十六进制颜色 (主要装饰条纹色)",
    "accent": "#十六进制颜色 (车灯/细腰线/点缀色)",
    "roof": "#十六进制颜色 (车顶颜色)",
    "window": "#十六进制颜色 (车窗玻璃反射色)",
    "frame": "#十六进制颜色 (车门与窗框轮廓色)"
  },
  "stripes": {
    "style": "single" | "double" | "gradient" | "wavy" | "checkered",
    "width": 14
  },
  "pattern": "plain" | "circuit" | "wood" | "camo" | "dots",
  "badgeText": "英文缩写 (如 SHINKANSEN, TOKYO-EXP)"
}`

  const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `请为以下主题设计列车纸模涂装：${prompt}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    })
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`OpenAI API 响应错误 (${response.status}): ${errText}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  const parsed = JSON.parse(content)

  const theme: TextureTheme = {
    id: `openai-${Date.now()}`,
    name: parsed.name || `AI: ${prompt.slice(0, 10)}`,
    category: parsed.category || 'railway',
    compatibleCategories: ['all', 'commuter', 'shinkansen', 'steam'],
    description: parsed.description || prompt,
    colors: {
      primary: parsed.colors?.primary || '#ffffff',
      secondary: parsed.colors?.secondary || '#0284c7',
      accent: parsed.colors?.accent || '#f59e0b',
      roof: parsed.colors?.roof || '#334155',
      window: parsed.colors?.window || '#0f172a',
      frame: parsed.colors?.frame || '#1e293b'
    },
    stripes: {
      style: parsed.stripes?.style || 'double',
      width: parsed.stripes?.width || 14
    },
    pattern: parsed.pattern || 'plain',
    badgeText: parsed.badgeText || 'AI-EXP',
    promptKeywords: [prompt]
  }

  return {
    theme,
    source: 'openai'
  }
}
