// 列车多节编组管理器 (Train Consist Manager)
import { TrainModelConsist } from '../schema/consistSchema'
import { e235TrainConsist } from '../schema/models/consistE235'
import { nankaiRapitConsist } from '../schema/models/consistRapit'
import { harukaTrainConsist } from '../schema/models/consistHaruka'
import { e5TrainConsist } from '../schema/models/consistE5'
import { cr400TrainConsist } from '../schema/models/consistCR400'
import { shinkansen300TrainConsist } from '../schema/models/consistShinkansen300'
import { romancecarTrainConsist } from '../schema/models/consistRomancecar'
import { d51TrainConsist } from '../schema/models/consistD51'
import { loadPapercraftFromSchema } from '../schema/modelLoader'
import { PapercraftModelData } from '../types'

export const CONSIST_REGISTRY: TrainModelConsist[] = [
  cr400TrainConsist,
  shinkansen300TrainConsist,
  romancecarTrainConsist,
  e235TrainConsist,
  nankaiRapitConsist,
  harukaTrainConsist,
  e5TrainConsist,
  d51TrainConsist
]

export interface ConsistCarItem {
  carIndex: number       // 0-based index
  carNumberText: string  // 如 "1号车 (头车)", "2号车 (客车)"
  carType: 'head' | 'middle' | 'tail' | 'tender'
  modelData: PapercraftModelData
  schema: import('../schema/papercraftSchema').PapercraftModelSchema
  spacingOffsetZ: number // 在 3D 编组连结中的 Z 轴世界位置偏移 (m)
}

/**
 * 根据编组配置构建整列火车的全部车厢数据
 */
export function buildTrainConsistCars(consistOrId: TrainModelConsist | string, middleCarCount: number = 1): ConsistCarItem[] {
  const consist: TrainModelConsist = typeof consistOrId === 'object'
    ? consistOrId
    : CONSIST_REGISTRY.find(c => c.id === consistOrId) || CONSIST_REGISTRY[0]
  const cars: ConsistCarItem[] = []

  let currentZ = 0
  const couplerGap = 0.08 // 车厢间风挡间距 (0.08m = 8mm)

  // 1. 头车 (Head Car)
  const headSchema = consist.carDefinitions.head.schema
  const headModel = loadPapercraftFromSchema(headSchema)
  const headLen = headModel.dimensions.length * 0.01 // 转换为米/3D单位
  currentZ = headLen / 2

  cars.push({
    carIndex: 0,
    carNumberText: '1号车 (先头车)',
    carType: 'head',
    modelData: headModel,
    schema: headSchema,
    spacingOffsetZ: currentZ
  })

  // 2. 如果是蒸汽火车，紧接煤水车 (Tender Car)
  if (consist.carDefinitions.tender) {
    const tenderSchema = consist.carDefinitions.tender.schema
    const tenderModel = loadPapercraftFromSchema(tenderSchema)
    const tenderLen = tenderModel.dimensions.length * 0.01
    currentZ -= (headLen / 2 + couplerGap + tenderLen / 2)

    cars.push({
      carIndex: cars.length,
      carNumberText: `${cars.length + 1}号车 (煤水车)`,
      carType: 'tender',
      modelData: tenderModel,
      schema: tenderSchema,
      spacingOffsetZ: currentZ
    })
  }

  // 3. 中间客车 (Middle Cars, 数量 0 ~ 4 节)
  for (let i = 0; i < middleCarCount; i++) {
    const middleSchema = consist.carDefinitions.middle.schema
    const middleModel = loadPapercraftFromSchema(middleSchema)
    const middleLen = middleModel.dimensions.length * 0.01
    const prevLen = cars[cars.length - 1].modelData.dimensions.length * 0.01

    currentZ -= (prevLen / 2 + couplerGap + middleLen / 2)

    cars.push({
      carIndex: cars.length,
      carNumberText: `${cars.length + 1}号车 (中间客车)`,
      carType: 'middle',
      modelData: middleModel,
      schema: middleSchema,
      spacingOffsetZ: currentZ
    })
  }

  // 4. 尾车 (Tail Car)
  const tailSchema = consist.carDefinitions.tail.schema
  const tailModel = loadPapercraftFromSchema(tailSchema)
  const tailLen = tailModel.dimensions.length * 0.01
  const lastLen = cars[cars.length - 1].modelData.dimensions.length * 0.01
  currentZ -= (lastLen / 2 + couplerGap + tailLen / 2)

  cars.push({
    carIndex: cars.length,
    carNumberText: `${cars.length + 1}号车 (尾车)`,
    carType: 'tail',
    modelData: tailModel,
    schema: tailSchema,
    spacingOffsetZ: currentZ
  })

  return cars
}
