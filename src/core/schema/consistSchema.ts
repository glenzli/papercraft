// 多车厢列车编组数据结构规范 (Train Consist Schema)
import { PapercraftModelSchema } from './papercraftSchema'

export type CarType = 'head' | 'middle' | 'tail' | 'tender' | 'coach'

export interface CarSchemaDefinition {
  type: CarType
  name: string
  description: string
  schema: PapercraftModelSchema
}

export interface TrainModelConsist {
  id: string
  name: string
  category: 'commuter' | 'shinkansen' | 'steam' | 'custom' | string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  recommendedAge: string
  estimatedTimePerCar: string
  defaultThemeId?: string
  // 该车型包含的车厢定义集合
  carDefinitions: {
    head: CarSchemaDefinition
    middle: CarSchemaDefinition
    tail: CarSchemaDefinition
    tender?: CarSchemaDefinition // 蒸汽机车专用煤水车
  }
}

export interface TrainConsistState {
  modelId: string
  middleCarCount: number // 中间车厢数量 (0 ~ 4)
  selectedCarIndex: number // 3D 中聚焦查看的车厢索引 (-1 为全列视图)
}
