// 核心几何与纸模数据类型定义

export type CreaseType = 'cut' | 'mountain' | 'valley' | 'boundary'

export interface Point2D {
  x: number
  y: number
}

export interface Point3D {
  x: number
  y: number
  z: number
}

export interface GlueTab {
  id: string
  label: string // 配对标签，如 "A", "B1", "Tab-1"
  edgeIndex: number // 对应多边形哪条边 (0-based)
  p1: Point2D
  p2: Point2D
  tabWidth: number // 舌片宽度 (mm)
  angle: number // 倒角角度 (一般 45 度)
  targetPartId: string // 粘贴的目标零件 ID
  targetEdgeIndex: number // 目标零件的对应边
}

export interface CreaseLine {
  type: CreaseType
  p1: Point2D
  p2: Point2D
  label?: string
}

export interface MountingGuide {
  id: string
  label: string // 粘贴对齐提示，如 "空调粘贴区 T"
  x: number     // 2D 矩形左上角 X (mm)
  y: number     // 2D 矩形左上角 Y (mm)
  width: number // 宽度 (mm)
  height: number// 高度 (mm)
}

export interface UnfoldedFace {
  id: string
  name: string // 如 "front", "side_left", "side_right", "roof", "bottom", "back"
  polygon2D: Point2D[] // 2D 顶点坐标 (mm)
  uvCoords: Point2D[] // 对应纹理 [0, 1] 坐标
  creases: CreaseLine[]
  glueTabs: GlueTab[]
  textureSlot: string // 对应的纹理面名称
  mountingGuides?: MountingGuide[] // 配件安装/粘合位参考提示框
}

export interface UnfoldedPart {
  id: string
  name: string // 如 "车身主体", "车头立体组件", "车顶空调机"
  isAccessory?: boolean // 是否为外加立体配件 (true 则进入配件专页，false 为独立车身主体展开)
  faces: UnfoldedFace[]
  bounds: {
    minX: number
    minY: number
    maxX: number
    maxY: number
    width: number
    height: number
  }
  // 在当前 A4 画布上的排版位置 (mm)
  layoutPosition?: {
    pageIndex: number
    x: number
    y: number
    rotation: number // 0, 90, 180, 270
  }
}

export interface PapercraftModelData {
  id: string
  name: string
  category: 'train' | 'bus' | 'building' | 'vehicle'
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  recommendedAge: string
  estimatedTime: string // e.g. "15-20 分钟"
  partsCount: number
  dimensions: {
    length: number // mm
    width: number // mm
    height: number // mm
  }
  // 3D 构造函数或数据生成器
  create3DParts: () => {
    id: string
    name: string
    meshData: {
      vertices: number[]
      indices: number[]
      uvs: number[]
      normals?: number[]
    }
    explodeOffset: [number, number, number] // 爆炸图位移向量 (归一化或实际比例)
  }[]
  // 2D 展开数据生成器
  generateUnfoldedParts: () => UnfoldedPart[]
}
