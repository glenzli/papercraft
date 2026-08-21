// 动态模型资产仓库与加载器 (Model Repository & Dynamic Loader)
import { TrainModelConsist } from '../schema/consistSchema'
import {
  PapercraftPackage,
  validatePapercraftPackage,
  packageToTrainConsist,
  trainConsistToPackage,
  PAPERCRAFT_SPEC_VERSION
} from '../schema/papercraftFormat'
import { CONSIST_REGISTRY } from './consistManager'

export interface ModelManifestItem {
  id: string
  name: string
  category: string
  difficulty: string
  fileName?: string
  isCustom?: boolean
  pkg?: PapercraftPackage
}

export class ModelRepository {
  private loadedConsists: Map<string, TrainModelConsist> = new Map()
  private customPackages: Map<string, PapercraftPackage> = new Map()

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
        category: c.category,
        difficulty: c.difficulty,
        isCustom: false
      })
    })

    // 自定义导入的模型
    this.customPackages.forEach((pkg, id) => {
      if (!list.some(item => item.id === id)) {
        list.push({
          id: pkg.meta.id,
          name: pkg.meta.name,
          category: pkg.meta.category,
          difficulty: pkg.meta.difficulty,
          isCustom: true,
          pkg
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
   * 从外部 .papercraft 文件 (File 对象) 动态加载
   */
  public async loadFromFile(file: File): Promise<{ success: boolean; consist?: TrainModelConsist; error?: string }> {
    try {
      const text = await file.text()
      const json = JSON.parse(text)

      const { valid, error, pkg } = validatePapercraftPackage(json)
      if (!valid || !pkg) {
        return { success: false, error: error || '文件校验未通过' }
      }

      const consist = packageToTrainConsist(pkg)
      this.loadedConsists.set(consist.id, consist)
      this.customPackages.set(consist.id, pkg)

      return { success: true, consist }
    } catch (e: any) {
      return { success: false, error: `解析失败: ${e.message || '文件格式错误'}` }
    }
  }

  /**
   * 从 URL 异步加载 .papercraft 资产
   */
  public async loadFromUrl(url: string): Promise<{ success: boolean; consist?: TrainModelConsist; error?: string }> {
    try {
      const resp = await fetch(url)
      if (!resp.ok) {
        return { success: false, error: `网络请求失败: HTTP ${resp.status}` }
      }
      const json = await resp.json()
      const { valid, error, pkg } = validatePapercraftPackage(json)
      if (!valid || !pkg) {
        return { success: false, error: error || '文件校验未通过' }
      }

      const consist = packageToTrainConsist(pkg)
      this.loadedConsists.set(consist.id, consist)
      return { success: true, consist }
    } catch (e: any) {
      return { success: false, error: `加载失败: ${e.message}` }
    }
  }

  /**
   * 导出指定模型为 .papercraft 文件并触发浏览器下载
   */
  public exportToFile(consist: TrainModelConsist): void {
    const pkg = trainConsistToPackage(consist)
    const jsonStr = JSON.stringify(pkg, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })

    const safeName = consist.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '_')
    const fileName = `${safeName}_v${PAPERCRAFT_SPEC_VERSION}.papercraft`

    const url = URL.createObjectURL(blob)
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
