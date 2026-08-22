// 通用载具与多车厢编组数据结构规范 (Vehicle & Consist Schema)
import { PapercraftModelSchema } from './papercraftSchema'

export type CarType = 'head' | 'middle' | 'tail' | 'tender' | 'coach' | 'body'

export interface CarSchemaDefinition {
  type: CarType
  name: string
  nameEn?: string
  description: string
  descriptionEn?: string
  schema: PapercraftModelSchema
}

/**
 * 装配形态声明 (支持单体载具如公交车、多节列车、双节铰接车)
 */
export interface ModelAssemblySchema {
  type: 'single' | 'consist' | 'articulated'
  allowConsistCount?: boolean // 是否允许在 UI 调节车厢数量 (默认为 true, 单体车为 false)
  defaultMiddleCarCount?: number
  maxMiddleCars?: number
}

/**
 * 数据驱动的 DIY 文本与标识插槽定义
 */
export interface TextSlotDefinition {
  key: string              // 如 "routeNumber" | "destination" | "operator" | "licensePlate" | "trainNumber"
  label: string            // 如 "线路路号"
  labelEn?: string          // 如 "Route Number"
  placeholder?: string      // 如 "如：71路 / M101"
  placeholderEn?: string    // 如 "e.g. Route 71 / M101"
  defaultValue?: string     // 如 "71路"
  targetSlot?: string       // 关联贴图槽位 (如 "front", "side_left", "bumper_plate")
}

export interface ModelCustomizationSchema {
  textSlots?: TextSlotDefinition[]
}

export interface TrainModelConsist {
  id: string
  name: string
  nameEn?: string
  category: 'commuter' | 'shinkansen' | 'steam' | 'bus' | 'custom' | string
  description: string
  descriptionEn?: string
  difficulty: 'easy' | 'medium' | 'hard'
  recommendedAge: string
  estimatedTimePerCar: string
  defaultThemeId?: string
  assembly?: ModelAssemblySchema
  customization?: ModelCustomizationSchema
  // 该车型包含的车厢/车身定义集合
  carDefinitions: {
    head: CarSchemaDefinition
    middle?: CarSchemaDefinition
    tail?: CarSchemaDefinition
    tender?: CarSchemaDefinition // 蒸汽机车专用煤水车
  }
}

export interface TrainConsistState {
  modelId: string
  middleCarCount: number // 中间车厢数量 (0 ~ 4)
  selectedCarIndex: number // 3D 中聚焦查看的车厢索引 (-1 为全列视图)
}
