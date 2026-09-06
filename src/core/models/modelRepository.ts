import { packConsistToA4Pages } from '../unfoldEngine'
// 动态模型资产仓库与加载器 (Model Repository & Dynamic ZIP/JSON Loader)
import { TrainModelConsist } from '../schema/consistSchema'
import {
  PapercraftPackage,
  validatePapercraftPackage,
  packageToTrainConsist,
  buildPapercraftZipPackage,
  parsePapercraftZipPackage,
  PAPERCRAFT_SPEC_VERSION
} from '../schema/papercraftFormat'
import { CONSIST_REGISTRY, buildTrainConsistCars } from './consistManager'
import { PRESET_THEMES } from '../../texture/presetThemes'
import { TextureTheme } from '../../texture/types'

export interface ModelManifestItem {
  id: string
  name: string
  nameEn?: string
  category: string
  difficulty: string
  fileName?: string
  isCustom?: boolean
  pkg?: PapercraftPackage
  hasBundledLiveries?: boolean
}

export class ModelRepository {
  private loadedConsists: Map<string, TrainModelConsist> = new Map()
  private customPackages: Map<string, PapercraftPackage> = new Map()
  // 动态导入的涂装资产存储 (Key: consistId, Value: TextureTheme[])
  private dynamicLiveries: Map<string, TextureTheme[]> = new Map()

  constructor() {
    // 注册内置预置模型
    CONSIST_REGISTRY.forEach(c => {
      this.loadedConsists.set(c.id, c)
    })
  }

  /**
   * 获取所有可用模型列表清单
   */
  public getManifest(): ModelManifestItem[] {
    const list: ModelManifestItem[] = []

    // 预置模型
    CONSIST_REGISTRY.forEach(c => {
      list.push({
        id: c.id,
        name: c.name,
        nameEn: c.nameEn,
        category: c.category,
        difficulty: c.difficulty,
        isCustom: false
      })
    })

    // 自定义导入的模型
    this.loadedConsists.forEach((consist, id) => {
      if (!list.some(item => item.id === id)) {
        list.push({
          id: consist.id,
          name: consist.name,
          nameEn: consist.nameEn,
          category: consist.category,
          difficulty: consist.difficulty,
          isCustom: true,
          hasBundledLiveries: (this.dynamicLiveries.get(id)?.length || 0) > 0
        })
      }
    })

    return list
  }

  /**
   * 获取指定 ID 的模型编组对象
   */
  public getConsist(id: string): TrainModelConsist | null {
    return this.loadedConsists.get(id) || null
  }

  /**
   * 注册某车型的动态附加涂装
   */
  public registerDynamicLiveries(consistId: string, themes: TextureTheme[]): void {
    if (!themes || themes.length === 0) return
    const existing = this.dynamicLiveries.get(consistId) || []
    themes.forEach(th => {
      if (!existing.some(item => item.id === th.id)) {
        existing.push(th)
      }
    })
    this.dynamicLiveries.set(consistId, existing)
  }

  /**
   * 获取某车型绑定的所有动态涂装
   */
  public getDynamicLiveries(consistId: string): TextureTheme[] {
    return this.dynamicLiveries.get(consistId) || []
  }

  /**
   * 获取某车型的全量涂装（官方预设 + 动态导入）
   */
  public getAllLiveriesForConsist(consistId: string): TextureTheme[] {
    const preset = PRESET_THEMES.filter(t => t.targetConsistIds && t.targetConsistIds.includes(consistId))
    const dynamic = this.getDynamicLiveries(consistId)
    const combined = [...preset]
    dynamic.forEach(d => {
      if (!combined.some(c => c.id === d.id)) {
        combined.push(d)
      }
    })
    return combined
  }

  /**
   * 从外部 .papercraft 文件 (File 对象，支持 ZIP 容器包与旧版单 JSON) 动态加载
   */
  public async loadFromFile(file: File): Promise<{
    success: boolean
    consist?: TrainModelConsist
    bundledThemes?: TextureTheme[]
    error?: string
  }> {
    try {
      const buffer = await file.arrayBuffer()

      // 1. 优先尝试作为 ZIP 容器包解析
      const zipRes = await parsePapercraftZipPackage(buffer)
      if (zipRes.success && zipRes.consist) {
        const consist = zipRes.consist
        packConsistToA4Pages(buildTrainConsistCars(consist, 1))
        this.loadedConsists.set(consist.id, consist)

        if (zipRes.bundledThemes && zipRes.bundledThemes.length > 0) {
          this.registerDynamicLiveries(consist.id, zipRes.bundledThemes)
        }

        return {
          success: true,
          consist,
          bundledThemes: zipRes.bundledThemes
        }
      }

      // 2. 若非 ZIP，优雅降级为 1.0 JSON 格式解析
      const textDecoder = new TextDecoder('utf-8')
      const text = textDecoder.decode(buffer)
      const json = JSON.parse(text)

      const { valid, error, pkg } = validatePapercraftPackage(json)
      if (!valid || !pkg) {
        return { success: false, error: zipRes.error || error || '文件校验未通过：既非有效的 ZIP 容器包，也非标准 JSON 纸模' }
      }

      const consist = packageToTrainConsist(pkg)
      packConsistToA4Pages(buildTrainConsistCars(consist, 1))
      this.loadedConsists.set(consist.id, consist)
      this.customPackages.set(consist.id, pkg)

      return { success: true, consist }
    } catch (e: any) {
      return { success: false, error: `解析失败: ${e.message || '文件格式不正确'}` }
    }
  }

  /**
   * 从 URL 异步加载 .papercraft 资产
   */
  public async loadFromUrl(url: string): Promise<{
    success: boolean
    consist?: TrainModelConsist
    bundledThemes?: TextureTheme[]
    error?: string
  }> {
    try {
      const resp = await fetch(url)
      if (!resp.ok) {
        return { success: false, error: `网络请求失败: HTTP ${resp.status}` }
      }

      const buffer = await resp.arrayBuffer()

      // 优先尝试作为 ZIP 容器包解析
      const zipRes = await parsePapercraftZipPackage(buffer)
      if (zipRes.success && zipRes.consist) {
        const consist = zipRes.consist
        packConsistToA4Pages(buildTrainConsistCars(consist, 1))
      this.loadedConsists.set(consist.id, consist)
        if (zipRes.bundledThemes) {
          this.registerDynamicLiveries(consist.id, zipRes.bundledThemes)
        }
        return { success: true, consist, bundledThemes: zipRes.bundledThemes }
      }

      // 降级为 JSON
      const textDecoder = new TextDecoder('utf-8')
      const text = textDecoder.decode(buffer)
      const json = JSON.parse(text)
      const { valid, error, pkg } = validatePapercraftPackage(json)
      if (!valid || !pkg) {
        return { success: false, error: error || '文件校验未通过' }
      }

      const consist = packageToTrainConsist(pkg)
      packConsistToA4Pages(buildTrainConsistCars(consist, 1))
      this.loadedConsists.set(consist.id, consist)
      return { success: true, consist }
    } catch (e: any) {
      return { success: false, error: `加载失败: ${e.message}` }
    }
  }

  /**
   * 导出指定模型及其附属涂装为标准 .papercraft (ZIP 容器包) 并触发浏览器下载
   */
  public async exportToFile(consist: TrainModelConsist, extraThemes?: TextureTheme[]): Promise<void> {
    // 收集该车型所有的专属涂装（官方预设 + 自定义 + 额外指定）
    const allThemes = this.getAllLiveriesForConsist(consist.id)
    if (extraThemes) {
      extraThemes.forEach(th => {
        if (!allThemes.some(item => item.id === th.id)) {
          allThemes.push(th)
        }
      })
    }

    const zipBlob = await buildPapercraftZipPackage(consist, allThemes)

    const safeName = consist.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '_')
    const fileName = `${safeName}_v${PAPERCRAFT_SPEC_VERSION}.papercraft`

    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

// 单例实例
export const modelRepository = new ModelRepository()
