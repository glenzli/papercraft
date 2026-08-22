// Papercraft 标准模型资产与容器规范 (Spec Version: 20260822.1)
// 支持 1.0 单 JSON 格式向下兼容，与 2.0 现代 ZIP 容器包 (包含多节车厢几何、单体载具形态与数据驱动文字插槽)
import JSZip from 'jszip'
import { PapercraftModelSchema } from './papercraftSchema'
import {
  TrainModelConsist,
  ModelAssemblySchema,
  ModelCustomizationSchema
} from './consistSchema'
import { TextureTheme } from '../../texture/types'
import {
  PapercraftLiverySchema,
  convertThemeToLiverySchema,
  convertLiverySchemaToTheme
} from './liverySchema'

export const PAPERCRAFT_SPEC_VERSION = '20260822.1'

/**
 * 2.0 容器格式 manifest.json 索引规范
 */
export interface PapercraftManifest {
  format: 'papercraft-package'
  specVersion: string        // 如 "20260822.1"
  createdAt: string          // ISO 时间戳
  updatedAt: string          // ISO 时间戳
  meta: {
    id: string
    name: string
    nameEn?: string
    category: 'commuter' | 'shinkansen' | 'steam' | 'bus' | 'vehicle' | 'custom' | string
    author: string
    difficulty: 'easy' | 'medium' | 'hard'
    recommendedAge: string
    estimatedTimePerCar: string
    description: string
    descriptionEn?: string
    defaultThemeId?: string
    tags?: string[]
  }
  assembly?: ModelAssemblySchema
  customization?: ModelCustomizationSchema
  consist: {
    defaultMiddleCarCount: number
    maxMiddleCars: number
    carFiles: {
      head: string
      middle?: string
      tail?: string
      tender?: string
      body?: string
    }
  }
  bundledLiveries?: string[]
  previewImage?: string
}

/**
 * 1.0 单 JSON 资产文件结构 (保留用于向下兼容)
 */
export interface PapercraftPackage {
  format: 'papercraft'
  specVersion: string
  createdAt: string
  updatedAt: string
  meta: {
    id: string
    name: string
    nameEn?: string
    category: 'commuter' | 'shinkansen' | 'steam' | 'bus' | 'vehicle' | 'custom'
    author: string
    difficulty: 'easy' | 'medium' | 'hard'
    recommendedAge: string
    estimatedTimePerCar: string
    description: string
    descriptionEn?: string
    tags?: string[]
  }
  assembly?: ModelAssemblySchema
  customization?: ModelCustomizationSchema
  consist: {
    defaultMiddleCarCount: number
    maxMiddleCars: number
    cars: {
      type: 'head' | 'middle' | 'tail' | 'tender' | 'body'
      name: string
      description: string
      schema: PapercraftModelSchema
    }[]
  }
}

/**
 * 将当前运行时的 TrainModelConsist 与捆绑涂装打包为标准的 .papercraft (ZIP 容器包)
 */
export async function buildPapercraftZipPackage(
  consist: TrainModelConsist,
  bundledThemes: TextureTheme[] = []
): Promise<Blob> {
  const zip = new JSZip()
  const now = new Date().toISOString()
  const isSingle = consist.assembly?.type === 'single' || (!consist.carDefinitions.middle && !consist.carDefinitions.tail)

  // 1. 整理车厢几何文件路径
  const carFiles: PapercraftManifest['consist']['carFiles'] = {
    head: isSingle ? 'models/body.json' : 'models/head.json'
  }

  const modelsFolder = zip.folder('models')!
  modelsFolder.file(isSingle ? 'body.json' : 'head.json', JSON.stringify(consist.carDefinitions.head.schema, null, 2))

  if (consist.carDefinitions.middle) {
    carFiles.middle = 'models/middle.json'
    modelsFolder.file('middle.json', JSON.stringify(consist.carDefinitions.middle.schema, null, 2))
  }

  if (consist.carDefinitions.tail) {
    carFiles.tail = 'models/tail.json'
    modelsFolder.file('tail.json', JSON.stringify(consist.carDefinitions.tail.schema, null, 2))
  }

  if (consist.carDefinitions.tender) {
    carFiles.tender = 'models/tender.json'
    modelsFolder.file('tender.json', JSON.stringify(consist.carDefinitions.tender.schema, null, 2))
  }

  // 2. 收集并打包附属涂装
  const bundledLiveryPaths: string[] = []
  if (bundledThemes.length > 0) {
    const liveriesFolder = zip.folder('liveries')!
    bundledThemes.forEach(theme => {
      const liverySchema: PapercraftLiverySchema = convertThemeToLiverySchema(
        theme,
        consist.id,
        consist.category
      )
      const fileName = `${theme.id}.json`
      liveriesFolder.file(fileName, JSON.stringify(liverySchema, null, 2))
      bundledLiveryPaths.push(`liveries/${fileName}`)
    })
  }

  // 3. 构建并写入 manifest.json
  const manifest: PapercraftManifest = {
    format: 'papercraft-package',
    specVersion: PAPERCRAFT_SPEC_VERSION,
    createdAt: now,
    updatedAt: now,
    meta: {
      id: consist.id,
      name: consist.name,
      nameEn: consist.nameEn,
      category: consist.category,
      author: 'Papercraft Studio',
      difficulty: consist.difficulty,
      recommendedAge: consist.recommendedAge,
      estimatedTimePerCar: consist.estimatedTimePerCar,
      description: consist.description,
      descriptionEn: consist.descriptionEn,
      defaultThemeId: consist.defaultThemeId || (bundledThemes[0]?.id)
    },
    assembly: consist.assembly,
    customization: consist.customization,
    consist: {
      defaultMiddleCarCount: isSingle ? 0 : 1,
      maxMiddleCars: isSingle ? 0 : 6,
      carFiles
    },
    bundledLiveries: bundledLiveryPaths.length > 0 ? bundledLiveryPaths : undefined
  }

  zip.file('manifest.json', JSON.stringify(manifest, null, 2))

  // 4. 生成 ZIP 二进制 Blob
  return await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  })
}

/**
 * 解析 .papercraft ZIP 容器包
 */
export async function parsePapercraftZipPackage(
  data: ArrayBuffer | Blob | Uint8Array
): Promise<{
  success: boolean
  consist?: TrainModelConsist
  bundledThemes?: TextureTheme[]
  error?: string
}> {
  try {
    const zip = await JSZip.loadAsync(data)

    // 1. 读取 manifest.json
    const manifestFile = zip.file('manifest.json') || zip.file('papercraft.json')
    if (!manifestFile) {
      return { success: false, error: '压缩包中未找到 manifest.json 索引文件' }
    }

    const manifestText = await manifestFile.async('text')
    const manifest = JSON.parse(manifestText) as PapercraftManifest

    if (!manifest.meta || !manifest.meta.id || !manifest.meta.name) {
      return { success: false, error: 'manifest.json 元数据不完整，缺少 meta.id 或 meta.name' }
    }

    if (!manifest.consist || !manifest.consist.carFiles) {
      return { success: false, error: 'manifest.json 缺少车厢索引配置 consist.carFiles' }
    }

    // 2. 读取车厢几何模型文件
    const headPath = manifest.consist.carFiles.head || manifest.consist.carFiles.body
    if (!headPath) {
      return { success: false, error: '缺少车体几何主文件 (head 或 body)' }
    }

    const headFile = zip.file(headPath)
    if (!headFile) {
      return { success: false, error: `未找到车体主文件: ${headPath}` }
    }

    const headSchema = JSON.parse(await headFile.async('text')) as PapercraftModelSchema

    let middleSchema: PapercraftModelSchema | undefined
    if (manifest.consist.carFiles.middle) {
      const middleFile = zip.file(manifest.consist.carFiles.middle)
      if (middleFile) {
        middleSchema = JSON.parse(await middleFile.async('text')) as PapercraftModelSchema
      }
    }

    let tailSchema: PapercraftModelSchema | undefined
    if (manifest.consist.carFiles.tail) {
      const tailFile = zip.file(manifest.consist.carFiles.tail)
      if (tailFile) {
        tailSchema = JSON.parse(await tailFile.async('text')) as PapercraftModelSchema
      }
    }

    let tenderSchema: PapercraftModelSchema | undefined
    if (manifest.consist.carFiles.tender) {
      const tenderFile = zip.file(manifest.consist.carFiles.tender)
      if (tenderFile) {
        tenderSchema = JSON.parse(await tenderFile.async('text')) as PapercraftModelSchema
      }
    }

    const isSingle = manifest.assembly?.type === 'single' || (!middleSchema && !tailSchema)

    const consist: TrainModelConsist = {
      id: manifest.meta.id,
      name: manifest.meta.name,
      nameEn: manifest.meta.nameEn,
      category: manifest.meta.category,
      description: manifest.meta.description,
      descriptionEn: manifest.meta.descriptionEn,
      difficulty: manifest.meta.difficulty,
      recommendedAge: manifest.meta.recommendedAge,
      estimatedTimePerCar: manifest.meta.estimatedTimePerCar,
      defaultThemeId: manifest.meta.defaultThemeId,
      assembly: manifest.assembly || (isSingle ? { type: 'single', allowConsistCount: false } : { type: 'consist', allowConsistCount: true }),
      customization: manifest.customization,
      carDefinitions: {
        head: {
          type: isSingle ? 'body' : 'head',
          name: headSchema.name || manifest.meta.name,
          description: headSchema.description || (isSingle ? '车身主体' : '先头驾驶车'),
          schema: headSchema
        },
        ...(middleSchema ? {
          middle: {
            type: 'middle',
            name: middleSchema.name || `${manifest.meta.name} (客车)`,
            description: middleSchema.description || '中间客车',
            schema: middleSchema
          }
        } : {}),
        ...(tailSchema ? {
          tail: {
            type: 'tail',
            name: tailSchema.name || `${manifest.meta.name} (尾车)`,
            description: tailSchema.description || '尾部驾驶车',
            schema: tailSchema
          }
        } : {}),
        ...(tenderSchema ? {
          tender: {
            type: 'tender',
            name: tenderSchema.name || `${manifest.meta.name} (煤水车)`,
            description: tenderSchema.description || '煤水补给车',
            schema: tenderSchema
          }
        } : {})
      }
    }

    // 3. 读取所有捆绑涂装文件 (liveries/*.json)
    const bundledThemes: TextureTheme[] = []
    const liveryFiles = zip.folder('liveries')
    if (liveryFiles) {
      const entries: { path: string; file: JSZip.JSZipObject }[] = []
      liveryFiles.forEach((relativePath, file) => {
        if (!file.dir && relativePath.endsWith('.json')) {
          entries.push({ path: relativePath, file })
        }
      })

      for (const item of entries) {
        try {
          const liveryText = await item.file.async('text')
          const liverySchema = JSON.parse(liveryText) as PapercraftLiverySchema
          if (liverySchema && liverySchema.id && liverySchema.colors) {
            const theme = convertLiverySchemaToTheme(liverySchema)
            // 确保 targetConsistIds 关联至当前车型
            if (!theme.targetConsistIds) theme.targetConsistIds = []
            if (!theme.targetConsistIds.includes(consist.id)) {
              theme.targetConsistIds.push(consist.id)
            }
            bundledThemes.push(theme)
          }
        } catch (err) {
          console.warn(`[Papercraft ZIP] 读取涂装 ${item.path} 异常:`, err)
        }
      }
    }

    return {
      success: true,
      consist,
      bundledThemes
    }
  } catch (e: any) {
    return {
      success: false,
      error: `ZIP 容器包解压失败: ${e?.message || '未知错误'}`
    }
  }
}

/**
 * 校验 1.0 单 JSON 数据包的完整性与合法性 (向下兼容)
 */
export function validatePapercraftPackage(data: any): { valid: boolean; error?: string; pkg?: PapercraftPackage } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: '无效的数据结构：必须是 JSON 对象' }
  }

  if (data.format !== 'papercraft') {
    return { valid: false, error: '格式标识不匹配：文件缺少 format="papercraft"' }
  }

  if (!data.meta || !data.meta.id || !data.meta.name) {
    return { valid: false, error: '元数据缺失：必须包含 meta.id 与 meta.name' }
  }

  if (!data.consist || !Array.isArray(data.consist.cars) || data.consist.cars.length === 0) {
    return { valid: false, error: '编组数据缺失：consist.cars 必须至少包含 1 节车厢' }
  }

  // 校验每节车厢的几何与分面
  for (let i = 0; i < data.consist.cars.length; i++) {
    const car = data.consist.cars[i]
    if (!car.schema || !Array.isArray(car.schema.parts) || car.schema.parts.length === 0) {
      return { valid: false, error: `车厢 [${car.name || i}] 缺少有效的几何分面数据 (parts)` }
    }
  }

  return { valid: true, pkg: data as PapercraftPackage }
}

/**
 * 将 1.0 PapercraftPackage 转换为系统运行时使用的 TrainModelConsist 对象 (向下兼容)
 */
export function packageToTrainConsist(pkg: PapercraftPackage): TrainModelConsist {
  const isSingle = pkg.assembly?.type === 'single' || pkg.consist.cars.length === 1
  const headCar = pkg.consist.cars.find(c => c.type === 'head' || c.type === 'body') || pkg.consist.cars[0]
  const middleCar = pkg.consist.cars.find(c => c.type === 'middle')
  const tailCar = pkg.consist.cars.find(c => c.type === 'tail')
  const tenderCar = pkg.consist.cars.find(c => c.type === 'tender')

  return {
    id: pkg.meta.id,
    name: pkg.meta.name,
    nameEn: pkg.meta.nameEn,
    category: pkg.meta.category === 'vehicle' ? 'commuter' : pkg.meta.category,
    description: pkg.meta.description,
    descriptionEn: pkg.meta.descriptionEn,
    difficulty: pkg.meta.difficulty,
    recommendedAge: pkg.meta.recommendedAge,
    estimatedTimePerCar: pkg.meta.estimatedTimePerCar,
    assembly: pkg.assembly || (isSingle ? { type: 'single', allowConsistCount: false } : { type: 'consist', allowConsistCount: true }),
    customization: pkg.customization,
    carDefinitions: {
      head: {
        type: isSingle ? 'body' : 'head',
        name: headCar.name,
        description: headCar.description,
        schema: headCar.schema
      },
      ...(middleCar ? {
        middle: {
          type: 'middle',
          name: middleCar.name,
          description: middleCar.description,
          schema: middleCar.schema
        }
      } : {}),
      ...(tailCar ? {
        tail: {
          type: 'tail',
          name: tailCar.name,
          description: tailCar.description,
          schema: tailCar.schema
        }
      } : {}),
      ...(tenderCar ? {
        tender: {
          type: 'tender',
          name: tenderCar.name,
          description: tenderCar.description,
          schema: tenderCar.schema
        }
      } : {})
    }
  }
}

/**
 * 将当前运行时的 TrainModelConsist 打包为 1.0 PapercraftPackage JSON 对象 (向下兼容)
 */
export function trainConsistToPackage(consist: TrainModelConsist): PapercraftPackage {
  const isSingle = consist.assembly?.type === 'single' || (!consist.carDefinitions.middle && !consist.carDefinitions.tail)

  const cars: PapercraftPackage['consist']['cars'] = [
    {
      type: isSingle ? 'body' : 'head',
      name: consist.carDefinitions.head.name,
      description: consist.carDefinitions.head.description,
      schema: consist.carDefinitions.head.schema
    }
  ]

  if (consist.carDefinitions.middle) {
    cars.push({
      type: 'middle',
      name: consist.carDefinitions.middle.name,
      description: consist.carDefinitions.middle.description,
      schema: consist.carDefinitions.middle.schema
    })
  }

  if (consist.carDefinitions.tail) {
    cars.push({
      type: 'tail',
      name: consist.carDefinitions.tail.name,
      description: consist.carDefinitions.tail.description,
      schema: consist.carDefinitions.tail.schema
    })
  }

  if (consist.carDefinitions.tender) {
    cars.push({
      type: 'tender',
      name: consist.carDefinitions.tender.name,
      description: consist.carDefinitions.tender.description,
      schema: consist.carDefinitions.tender.schema
    })
  }

  const now = new Date().toISOString()

  return {
    format: 'papercraft',
    specVersion: PAPERCRAFT_SPEC_VERSION,
    createdAt: now,
    updatedAt: now,
    meta: {
      id: consist.id,
      name: consist.name,
      nameEn: consist.nameEn,
      category: (consist.category as any) || 'custom',
      author: 'Papercraft Studio',
      difficulty: consist.difficulty,
      recommendedAge: consist.recommendedAge,
      estimatedTimePerCar: consist.estimatedTimePerCar,
      description: consist.description,
      descriptionEn: consist.descriptionEn
    },
    assembly: consist.assembly,
    customization: consist.customization,
    consist: {
      defaultMiddleCarCount: isSingle ? 0 : 1,
      maxMiddleCars: isSingle ? 0 : 6,
      cars
    }
  }
}
