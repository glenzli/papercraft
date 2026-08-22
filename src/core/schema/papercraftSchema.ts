// 纸模标准化数据格式规范 (Papercraft Model Schema v1.0)
import { CreaseType, Point2D } from '../types'

export interface SchemaGlueTab {
  id: string
  label: string        // 粘合配对标签, 如 "A1", "B2"
  edgeIndex: number    // 所在多边形的边索引
  p1: Point2D          // 2D 展开图起点 (mm)
  p2: Point2D          // 2D 展开图终点 (mm)
  tabWidth: number     // 舌片宽度 (mm, 默认 6-8mm)
  angle: number        // 倒角角度 (度, 默认 45)
  targetFaceId: string // 粘贴目标面 ID
}

export interface SchemaCrease {
  type: CreaseType     // 'cut' | 'mountain' | 'valley'
  p1: Point2D          // 起点 (mm)
  p2: Point2D          // 终点 (mm)
}

export interface SchemaFace {
  id: string
  name: string
  slotName: string     // 对应的贴图槽位: 'roof' | 'side_left' | 'side_right' | 'front' | 'back' | 'bottom' | 'nose' | 'accessories'
  // 3D 空间顶点 (封闭状态下的三维坐标, mm)
  vertices3D: [number, number, number][]
  // 2D 展开图顶点 (平面铺开状态下的二维坐标, mm)
  vertices2D: [number, number][]
  // UV 贴图坐标 [0, 1] 对应 vertices 顺序
  uvCoords: [number, number][]
  // 三角形索引 (如 [0, 1, 2, 0, 2, 3])
  indices: number[]
  // 折痕与粘合翼
  creases?: SchemaCrease[]
  tabs?: SchemaGlueTab[]
}

export interface SchemaAccessory {
  id: string
  name: string
  slotName: string
  vertices3D: [number, number, number][]
  indices: number[]
  uvCoords: [number, number][]
  // 3D 安装位姿偏移
  position3D: [number, number, number]
  // 2D 展开图预备摆放位置 (mm)
  layout2D?: {
    x: number
    y: number
    width: number
    height: number
  }
  // 允许配件拥有真实的可展开多面体定义 (解决异形导流罩展开问题)
  faces?: SchemaFace[]
}

export interface SchemaPart {
  id: string
  name: string
  faces: SchemaFace[]
}

export interface PapercraftModelSchema {
  version: string
  id: string
  name: string
  nameEn?: string
  category: 'commuter' | 'shinkansen' | 'steam' | 'vehicle' | 'bus' | 'custom' | string
  difficulty: 'easy' | 'medium' | 'hard'
  recommendedAge: string
  estimatedTime: string
  description: string
  descriptionEn?: string
  dimensions: {
    length: number // mm
    width: number  // mm
    height: number // mm
  }
  parts: SchemaPart[]
  accessories?: SchemaAccessory[]
}
