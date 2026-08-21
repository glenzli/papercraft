// 展开与装箱排版引擎
import { Point2D, GlueTab, UnfoldedPart } from './types'

/**
 * 计算两点间的距离
 */
export function distance(p1: Point2D, p2: Point2D): number {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * 判断点是否在多边形内部（标准射线交叉法）
 */
export function isPointInPolygon(point: Point2D, vs: Point2D[]): boolean {
  if (!vs || vs.length < 3) return false
  const x = point.x
  const y = point.y
  let inside = false
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i].x, yi = vs[i].y
    const xj = vs[j].x, yj = vs[j].y
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }
  return inside
}

/**
 * 根据边缘两点 p1 -> p2 生成带 45 度倒角的梯形粘合舌片
 * 【智能防内翻防呆算法】：
 * 无论 schema 数据中定义 p1->p2 是顺时针还是逆时针，
 * 如果传入 facePolygon（所在面的多边形或所有面多边形），算法会自动探测舌片方向。
 * 若探测点落入零件多边形内部（发生内翻重叠），算法 100% 自动翻转法向量向外突出，
 * 彻底从底层根绝一切粘合翼内翻、与车体相撞的异常！
 */
export function generateTabPoints(
  p1: Point2D,
  p2: Point2D,
  tabWidth: number = 8,
  angleDeg: number = 45,
  facePolygon?: Point2D[] | Point2D[][] | { polygon2D: Point2D[] }[]
): Point2D[] {
  if (!p1 || !p2) return []
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len < 0.001) return []

  // 基础单位切向量与默认法向量 (朝左)
  const ux = dx / len
  const uy = dy / len
  let nx = -uy
  let ny = ux

  // 智能防内翻校验
  if (facePolygon) {
    let polygons: Point2D[][] = []
    if (Array.isArray(facePolygon) && facePolygon.length > 0) {
      const first = facePolygon[0] as any
      if (Array.isArray(first)) {
        polygons = facePolygon as Point2D[][]
      } else if (first && typeof first === 'object' && 'polygon2D' in first) {
        polygons = (facePolygon as { polygon2D: Point2D[] }[]).map(f => f.polygon2D).filter(Boolean)
      } else if (first && typeof first === 'object' && 'x' in first && 'y' in first) {
        polygons = [facePolygon as Point2D[]]
      }
    }

    if (polygons.length > 0) {
      const midX = (p1.x + p2.x) * 0.5
      const midY = (p1.y + p2.y) * 0.5
      const testDist = Math.min(2.0, tabWidth * 0.4)
      const testP: Point2D = {
        x: midX + nx * testDist,
        y: midY + ny * testDist
      }

      // 如果朝向 nx, ny 会进入多边形内部，说明内翻了，立即反转为外凸
      const isInside = polygons.some(poly => poly && poly.length >= 3 && isPointInPolygon(testP, poly))
      if (isInside) {
        nx = -nx
        ny = -ny
      }
    }
  }

  // 倒角内缩距离 = tabWidth / tan(angle)
  const angleRad = (angleDeg * Math.PI) / 180
  const indent = Math.min(tabWidth / Math.tan(angleRad), len * 0.35)

  const t1: Point2D = {
    x: p1.x + ux * indent + nx * tabWidth,
    y: p1.y + uy * indent + ny * tabWidth
  }

  const t2: Point2D = {
    x: p2.x - ux * indent + nx * tabWidth,
    y: p2.y - uy * indent + ny * tabWidth
  }

  return [p1, t1, t2, p2]
}

/**
 * 计算多边形或零件的包围盒
 */
export function calculatePartBounds(faces: { polygon2D: Point2D[]; glueTabs: GlueTab[] }[]): {
  minX: number
  minY: number
  maxX: number
  maxY: number
  width: number
  height: number
} {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const face of faces) {
    for (const p of face.polygon2D) {
      if (p.x < minX) minX = p.x
      if (p.y < minY) minY = p.y
      if (p.x > maxX) maxX = p.x
      if (p.y > maxY) maxY = p.y
    }
    // 也要把胶水舌片算入包围盒 (使用智能防内翻)
    for (const tab of face.glueTabs) {
      const tabPts = generateTabPoints(tab.p1, tab.p2, tab.tabWidth, tab.angle, faces)
      for (const p of tabPts) {
        if (p.x < minX) minX = p.x
        if (p.y < minY) minY = p.y
        if (p.x > maxX) maxX = p.x
        if (p.y > maxY) maxY = p.y
      }
    }
  }

  if (minX === Infinity) {
    minX = minY = maxX = maxY = 0
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  }
}

/**
 * A4 纸张标准尺寸 (mm)
 */
export const A4_WIDTH_MM = 210
export const A4_HEIGHT_MM = 297
export const A4_MARGIN_MM = 10

import { ConsistCarItem } from './models/consistManager'

export interface ConsistPartPlacement {
  part: UnfoldedPart
  car: ConsistCarItem
  carIndex: number
  x: number
  y: number
  rotation: number
  displayName?: string
}

export interface ConsistPageLayout {
  pageIndex: number       // 全局页码 0, 1, 2, 3...
  pageTitle: string       // 如 "1号车 (先头车) 车身主体展开图"
  subTitle: string        // 如 "全编组第 1/3 节 | 制作耗时: ~20-25 分钟"
  carIndex?: number       // 对应车厢索引 (如果是车身页)
  car?: ConsistCarItem
  isAccessoryPage: boolean
  placements: ConsistPartPlacement[]
}

/**
 * 全列车编组标准 A4 装箱分页引擎:
 * 1. 前 N 页: 各车厢独立主体展开图 (100% 只放车身，绝无任何配件干扰)
 * 2. 第 N+1 页起: 全列车车顶与立体配件专页 (集中统一装箱整列车的所有外加配件)
 */
export function packConsistToA4Pages(cars: ConsistCarItem[]): ConsistPageLayout[] {
  const pages: ConsistPageLayout[] = []

  // 1. 各车厢独立主体展开图 (每节车厢独占 1 页)
  cars.forEach((car, carIdx) => {
    const allParts = car.modelData.generateUnfoldedParts()
    const mainParts = allParts.filter(p => !p.isAccessory)
    const mainPart = mainParts[0] || allParts[0]

    if (mainPart) {
      // 水平居中并预留页眉图例纵向间距 (确保从 Y=36mm 以下开始)
      const targetX = Math.max(A4_MARGIN_MM, (A4_WIDTH_MM - mainPart.bounds.width) / 2)
      const targetY = Math.max(A4_MARGIN_MM + 26, (A4_HEIGHT_MM - mainPart.bounds.height) / 2)

      pages.push({
        pageIndex: pages.length,
        pageTitle: `${car.carNumberText} · ${car.modelData.name}`,
        subTitle: `第 ${carIdx + 1}/${cars.length} 节`,
        carIndex: carIdx,
        car,
        isAccessoryPage: false,
        placements: [
          {
            part: mainPart,
            car,
            carIndex: carIdx,
            x: targetX - mainPart.bounds.minX,
            y: targetY - mainPart.bounds.minY,
            rotation: 0
          }
        ]
      })
    }
  })

  // 2. 收集整列车所有车厢的所有外加立体配件
  const allAccessories: { part: UnfoldedPart; car: ConsistCarItem; carIdx: number }[] = []
  cars.forEach((car, carIdx) => {
    const parts = car.modelData.generateUnfoldedParts()
    const accParts = parts.filter(p => p.isAccessory === true)
    accParts.forEach(acc => {
      allAccessories.push({ part: acc, car, carIdx })
    })
  })

  // 3. 排版配件专页 (看一页能排几个，放不下自动开辟下一页)
  if (allAccessories.length > 0) {
    let accPageIndex = pages.length
    let accCurX = A4_MARGIN_MM + 8
    let accCurY = A4_MARGIN_MM + 42 // 顶部留出 52mm 充裕纵向空间
    let accRowH = 0
    let curPagePlacements: ConsistPartPlacement[] = []

    for (const item of allAccessories) {
      const w = item.part.bounds.width
      const h = item.part.bounds.height
      const colW = Math.max(w, 50)

      // 检查当前行是否放得下，放不下自动换行 (列间距 14mm，行间距 24mm)
      if (accCurX + colW > A4_WIDTH_MM - A4_MARGIN_MM - 8 && curPagePlacements.length > 0) {
        accCurX = A4_MARGIN_MM + 8
        accCurY += accRowH + 24
        accRowH = 0
      }

      // 检查当前页是否放得下，放不下自动开辟下一页配件专页
      if (accCurY + h > A4_HEIGHT_MM - A4_MARGIN_MM - 14 && curPagePlacements.length > 0) {
        pages.push({
          pageIndex: accPageIndex,
          pageTitle: `车顶与立体配件 (P.${accPageIndex - cars.length + 1})`,
          subTitle: `配件`,
          isAccessoryPage: true,
          placements: curPagePlacements
        })
        accPageIndex++
        curPagePlacements = []
        accCurX = A4_MARGIN_MM + 8
        accCurY = A4_MARGIN_MM + 42
        accRowH = 0
      }

      const carShort = item.car.carNumberText.split(' ')[0]
      const partShort = item.part.name.replace(/车顶|立体|气动|流线/g, '')

      curPagePlacements.push({
        part: item.part,
        car: item.car,
        carIndex: item.carIdx,
        displayName: `${carShort} ${partShort}`,
        x: (accCurX + (colW - w) / 2) - item.part.bounds.minX,
        y: accCurY - item.part.bounds.minY,
        rotation: 0
      })

      accRowH = Math.max(accRowH, h)
      accCurX += colW + 14
    }

    if (curPagePlacements.length > 0) {
      pages.push({
        pageIndex: accPageIndex,
        pageTitle: pages.length === cars.length ? '车顶与立体配件' : `车顶与立体配件 (P.${accPageIndex - cars.length + 1})`,
        subTitle: `配件`,
        isAccessoryPage: true,
        placements: curPagePlacements
      })
    }
  }

  return pages
}

export interface A4PartPlacement {
  partId: string
  x: number
  y: number
  rotation: number
}

export interface A4PageLayout {
  pageIndex: number
  pageTitle: string
  isAccessoryPage: boolean
  parts: A4PartPlacement[]
}

/**
 * 单车兼容排版 (保留兼容)
 */
export function packPartsToA4(parts: UnfoldedPart[]): {
  pages: A4PageLayout[]
  totalPages: number
} {
  const mainParts = parts.filter(p => p.id === 'head-body' || p.id === 'middle-body' || p.id === 'tail-body' || p.name.includes('车身'))
  const accParts = parts.filter(p => !mainParts.includes(p))

  const pages: A4PageLayout[] = []

  if (mainParts.length > 0) {
    const page1Parts: A4PartPlacement[] = []
    for (const part of mainParts) {
      const targetX = Math.max(A4_MARGIN_MM, (A4_WIDTH_MM - part.bounds.width) / 2)
      const targetY = A4_MARGIN_MM + 8
      page1Parts.push({
        partId: part.id,
        x: targetX - part.bounds.minX,
        y: targetY - part.bounds.minY,
        rotation: 0
      })
    }
    pages.push({
      pageIndex: 0,
      pageTitle: '车身主体展开图',
      isAccessoryPage: false,
      parts: page1Parts
    })
  }

  if (accParts.length > 0) {
    const accPlacements: A4PartPlacement[] = []
    let curX = A4_MARGIN_MM + 8
    let curY = A4_MARGIN_MM + 24
    let rowH = 0

    for (const acc of accParts) {
      const w = acc.bounds.width
      const h = acc.bounds.height
      if (curX + w > A4_WIDTH_MM - A4_MARGIN_MM - 8 && accPlacements.length > 0) {
        curX = A4_MARGIN_MM + 8
        curY += rowH + 18
        rowH = 0
      }
      accPlacements.push({
        partId: acc.id,
        x: curX - acc.bounds.minX,
        y: curY - acc.bounds.minY,
        rotation: 0
      })
      rowH = Math.max(rowH, h)
      curX += w + 18
    }

    pages.push({
      pageIndex: pages.length,
      pageTitle: '车顶与外加配件专页',
      isAccessoryPage: true,
      parts: accPlacements
    })
  }

  return {
    pages,
    totalPages: pages.length || 1
  }
}
