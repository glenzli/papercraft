// Papercraft 标准模型资产格式规范 (Spec: CalVer 日期+迭代版本号, e.g. 20260820.1)
import { PapercraftModelSchema } from './papercraftSchema'
import { TrainModelConsist } from './consistSchema'

export const PAPERCRAFT_SPEC_VERSION = '20260820.1'

/**
 * .papercraft 资产文件标准包结构
 */
export interface PapercraftPackage {
  format: 'papercraft'
  specVersion: string        // 如 "20260820.1"
  createdAt: string          // ISO 时间戳
  updatedAt: string          // ISO 时间戳
  meta: {
    id: string
    name: string
    category: 'commuter' | 'shinkansen' | 'steam' | 'vehicle' | 'custom'
    author: string
    difficulty: 'easy' | 'medium' | 'hard'
    recommendedAge: string
    estimatedTimePerCar: string
    description: string
    tags?: string[]
  }
  consist: {
    defaultMiddleCarCount: number
    maxMiddleCars: number
    cars: {
      type: 'head' | 'middle' | 'tail' | 'tender'
      name: string
      description: string
      schema: PapercraftModelSchema
    }[]
  }
}

/**
 * 校验 .papercraft 数据包的完整性与合法性
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
 * 将 PapercraftPackage 转换为系统运行时使用的 TrainModelConsist 对象
 */
export function packageToTrainConsist(pkg: PapercraftPackage): TrainModelConsist {
  const headCar = pkg.consist.cars.find(c => c.type === 'head') || pkg.consist.cars[0]
  const middleCar = pkg.consist.cars.find(c => c.type === 'middle') || headCar
  const tailCar = pkg.consist.cars.find(c => c.type === 'tail') || headCar
  const tenderCar = pkg.consist.cars.find(c => c.type === 'tender')

  return {
    id: pkg.meta.id,
    name: pkg.meta.name,
    category: pkg.meta.category === 'vehicle' ? 'commuter' : pkg.meta.category,
    description: pkg.meta.description,
    difficulty: pkg.meta.difficulty,
    recommendedAge: pkg.meta.recommendedAge,
    estimatedTimePerCar: pkg.meta.estimatedTimePerCar,
    carDefinitions: {
      head: {
        type: 'head',
        name: headCar.name,
        description: headCar.description,
        schema: headCar.schema
      },
      middle: {
        type: 'middle',
        name: middleCar.name,
        description: middleCar.description,
        schema: middleCar.schema
      },
      tail: {
        type: 'tail',
        name: tailCar.name,
        description: tailCar.description,
        schema: tailCar.schema
      },
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
 * 将当前运行时的 TrainModelConsist 打包为可保存/导出的 PapercraftPackage 对象
 */
export function trainConsistToPackage(consist: TrainModelConsist): PapercraftPackage {
  const cars: PapercraftPackage['consist']['cars'] = [
    {
      type: 'head',
      name: consist.carDefinitions.head.name,
      description: consist.carDefinitions.head.description,
      schema: consist.carDefinitions.head.schema
    },
    {
      type: 'middle',
      name: consist.carDefinitions.middle.name,
      description: consist.carDefinitions.middle.description,
      schema: consist.carDefinitions.middle.schema
    },
    {
      type: 'tail',
      name: consist.carDefinitions.tail.name,
      description: consist.carDefinitions.tail.description,
      schema: consist.carDefinitions.tail.schema
    }
  ]

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
      category: (consist.category as any) || 'custom',
      author: 'Papercraft Studio',
      difficulty: consist.difficulty,
      recommendedAge: consist.recommendedAge,
      estimatedTimePerCar: consist.estimatedTimePerCar,
      description: consist.description
    },
    consist: {
      defaultMiddleCarCount: 1,
      maxMiddleCars: 6,
      cars
    }
  }
}
