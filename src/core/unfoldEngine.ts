// 展开与装箱排版引擎
import { Point2D, GlueTab, UnfoldedPart, UnfoldedFace } from './types'

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
 * 检查两条线段 (p1-p2) 与 (p3-p4) 是否相交
 */
export function doLineSegmentsIntersect(p1: Point2D, p2: Point2D, p3: Point2D, p4: Point2D): boolean {
  const ccw = (a: Point2D, b: Point2D, c: Point2D) => {
    return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x)
  }
  return (ccw(p1, p3, p4) !== ccw(p2, p3, p4)) && (ccw(p1, p2, p3) !== ccw(p1, p2, p4))
}

/**
 * 检查一个矩形区域 (带 safetyMargin 安全边距) 是否与多边形列表发生相交或包含
 */
export function doesBoxOverlapPolygons(
  box: { minX: number; minY: number; maxX: number; maxY: number },
  polygons: Point2D[][],
  safetyMargin: number = 8
): boolean {
  const bMinX = box.minX - safetyMargin
  const bMinY = box.minY - safetyMargin
  const bMaxX = box.maxX + safetyMargin
  const bMaxY = box.maxY + safetyMargin

  const boxCorners: Point2D[] = [
    { x: bMinX, y: bMinY },
    { x: bMaxX, y: bMinY },
    { x: bMaxX, y: bMaxY },
    { x: bMinX, y: bMaxY }
  ]

  const boxEdges: [Point2D, Point2D][] = [
    [boxCorners[0], boxCorners[1]],
    [boxCorners[1], boxCorners[2]],
    [boxCorners[2], boxCorners[3]],
    [boxCorners[3], boxCorners[0]]
  ]

  for (const poly of polygons) {
    if (!poly || poly.length < 3) continue

    // 1. 检查多边形顶点是否在扩展矩形内
    for (const pt of poly) {
      if (pt.x >= bMinX && pt.x <= bMaxX && pt.y >= bMinY && pt.y <= bMaxY) {
        return true
      }
    }

    // 2. 检查矩形顶点是否在多边形内部
    for (const c of boxCorners) {
      if (isPointInPolygon(c, poly)) {
        return true
      }
    }

    // 3. 检查边相交
    for (let i = 0; i < poly.length; i++) {
      const p1 = poly[i]
      const p2 = poly[(i + 1) % poly.length]
      for (const [b1, b2] of boxEdges) {
        if (doLineSegmentsIntersect(p1, p2, b1, b2)) {
          return true
        }
      }
    }
  }

  return false
}

/**
 * 旋转 2D 展开零件 (0° 或 90°)
 */
export function rotateUnfoldedPart(part: UnfoldedPart, angleDeg: 0 | 90): UnfoldedPart {
  if (angleDeg === 0) return part

  const rotPt = (p: Point2D): Point2D => ({
    x: -p.y,
    y: p.x
  })

  const newFaces: UnfoldedFace[] = part.faces.map(face => ({
    ...face,
    polygon2D: face.polygon2D.map(rotPt),
    creases: face.creases?.map(c => ({
      ...c,
      p1: rotPt(c.p1),
      p2: rotPt(c.p2)
    })) || [],
    glueTabs: face.glueTabs?.map(t => ({
      ...t,
      p1: rotPt(t.p1),
      p2: rotPt(t.p2)
    })) || []
  }))

  return {
    ...part,
    faces: newFaces,
    bounds: calculatePartBounds(newFaces)
  }
}

function generateCandidateCornerSlots(w: number, h: number): { x: number; y: number }[] {
  return [
    // 1. 左上角空域 (从 Y=30 开始逐级探测)
    { x: 12, y: 30 },
    { x: 14, y: 34 },
    { x: 14, y: 38 },
    // 2. 右上角空域 (从 Y=30 开始逐级探测)
    { x: A4_WIDTH_MM - A4_MARGIN_MM - w - 4, y: 30 },
    { x: A4_WIDTH_MM - A4_MARGIN_MM - w - 4, y: 34 },
    { x: A4_WIDTH_MM - A4_MARGIN_MM - w - 4, y: 38 },
    // 3. 左下角空域
    { x: 12, y: A4_HEIGHT_MM - A4_MARGIN_MM - h - 4 },
    { x: 14, y: A4_HEIGHT_MM - A4_MARGIN_MM - h - 8 },
    // 4. 右下角空域
    { x: A4_WIDTH_MM - A4_MARGIN_MM - w - 4, y: A4_HEIGHT_MM - A4_MARGIN_MM - h - 4 },
    { x: A4_WIDTH_MM - A4_MARGIN_MM - w - 4, y: A4_HEIGHT_MM - A4_MARGIN_MM - h - 8 },
    // 5. 侧翼中段空域
    { x: 12, y: (A4_HEIGHT_MM - h) / 2 },
    { x: A4_WIDTH_MM - A4_MARGIN_MM - w - 4, y: (A4_HEIGHT_MM - h) / 2 }
  ]
}

/**
 * 全列车编组智能 A4 装箱分页引擎:
 * 1. 车身主体放置在每页中央；
 * 2. 智能探测车身四周空白区域：测试 0° 原向与 90° 旋转，若空间充裕（如叮叮车/江之电/短车身/先头车角落），配件直接就地排入角落，零纸张浪费；
 * 3. 若 0°/90° 均空间不足（如超长车身/多配件），自动开辟「车顶与立体配件专页」集中装箱。
 */
export function packConsistToA4Pages(cars: ConsistCarItem[]): ConsistPageLayout[] {
  const pages: ConsistPageLayout[] = []
  const overflowAccessories: { part: UnfoldedPart; car: ConsistCarItem; carIdx: number }[] = []

  const pageOccupiedMap = new Map<number, Point2D[][]>()

  // 1. 各车厢独立主体展开图 + 智能就地容纳配件
  cars.forEach((car, carIdx) => {
    const allParts = car.modelData.generateUnfoldedParts()
    const mainParts = allParts.filter(p => !p.isAccessory)
    const mainPart = mainParts[0] || allParts[0]
    const carAccessories = allParts.filter(p => p.isAccessory === true)

    if (mainPart) {
      // 水平居中并预留页眉图例纵向间距 (确保从 Y=36mm 以下开始)
      const targetX = Math.max(A4_MARGIN_MM, (A4_WIDTH_MM - mainPart.bounds.width) / 2)
      const targetY = Math.max(A4_MARGIN_MM + 26, (A4_HEIGHT_MM - mainPart.bounds.height) / 2)
      const mainOffsetX = targetX - mainPart.bounds.minX
      const mainOffsetY = targetY - mainPart.bounds.minY

      const placements: ConsistPartPlacement[] = [
        {
          part: mainPart,
          car,
          carIndex: carIdx,
          x: mainOffsetX,
          y: mainOffsetY,
          rotation: 0
        }
      ]

      // 收集该页面所有已占用的多边形 (含所有展开面与舌片)
      const occupiedPolygons: Point2D[][] = []
      mainPart.faces.forEach(face => {
        const shiftedPoly = face.polygon2D.map(p => ({ x: p.x + mainOffsetX, y: p.y + mainOffsetY }))
        occupiedPolygons.push(shiftedPoly)

        if (face.glueTabs) {
          face.glueTabs.forEach(tab => {
            const tabPts = generateTabPoints(tab.p1, tab.p2, tab.tabWidth || 7, tab.angle || 45, face.polygon2D)
            occupiedPolygons.push(tabPts.map(p => ({ x: p.x + mainOffsetX, y: p.y + mainOffsetY })))
          })
        }
      })

      // 智能探测：该车厢自身的配件是否能轻松塞入本页的角落空白区？ (测试 0° 原向与 90° 旋转)
      carAccessories.forEach(rawAcc => {
        let placed = false

        for (const rotationAngle of [0, 90] as (0 | 90)[]) {
          const acc = rotateUnfoldedPart(rawAcc, rotationAngle)
          const accW = acc.bounds.width
          const accH = acc.bounds.height

          const candidates = generateCandidateCornerSlots(accW, accH)

          for (const cand of candidates) {
            // 1. 检查是否在 A4 安全打印区内 (留出 10mm 页面外边距与 28mm 页眉间距)
            if (
              cand.x < A4_MARGIN_MM + 2 ||
              cand.y < 28 ||
              cand.x + accW > A4_WIDTH_MM - A4_MARGIN_MM - 2 ||
              cand.y + accH > A4_HEIGHT_MM - A4_MARGIN_MM - 2
            ) {
              continue
            }

            // 2. 检查是否与已放置的零件和舌片发生冲突 (保留 5mm 宽裕剪裁安全边距)
            const box = {
              minX: cand.x,
              minY: cand.y,
              maxX: cand.x + accW,
              maxY: cand.y + accH
            }

            if (!doesBoxOverlapPolygons(box, occupiedPolygons, 5)) {
              // 成功就地嵌入！
              const accOffsetX = cand.x - acc.bounds.minX
              const accOffsetY = cand.y - acc.bounds.minY

              placements.push({
                part: acc,
                car,
                carIndex: carIdx,
                displayName: acc.name,
                x: accOffsetX,
                y: accOffsetY,
                rotation: rotationAngle
              })

              // 将放入的配件多边形也加入已占用集合
              acc.faces.forEach(face => {
                const shiftedPoly = face.polygon2D.map(p => ({ x: p.x + accOffsetX, y: p.y + accOffsetY }))
                occupiedPolygons.push(shiftedPoly)
                if (face.glueTabs) {
                  face.glueTabs.forEach(tab => {
                    const tabPts = generateTabPoints(tab.p1, tab.p2, tab.tabWidth || 7, tab.angle || 45, face.polygon2D)
                    occupiedPolygons.push(tabPts.map(p => ({ x: p.x + accOffsetX, y: p.y + accOffsetY })))
                  })
                }
              })

              placed = true
              break
            }
          }

          if (placed) break
        }

        // 若 0° 和 90° 均明显塞不下（空间不足），先暂存为 overflow
        if (!placed) {
          overflowAccessories.push({ part: rawAcc, car, carIdx })
        }
      })

      const pageIdx = pages.length
      pageOccupiedMap.set(pageIdx, occupiedPolygons)

      pages.push({
        pageIndex: pageIdx,
        pageTitle: `${car.carNumberText} · ${car.modelData.name}`,
        subTitle: `第 ${carIdx + 1}/${cars.length} 节`,
        carIndex: carIdx,
        car,
        isAccessoryPage: false,
        placements
      })
    }
  })

  // 1.5 跨车厢空白智能容纳：若某节车厢（如超长中间车）塞不下，尝试放入先头车或尾车等其他空白充足的车厢角落
  if (overflowAccessories.length > 0) {
    const unplacedAccessories: { part: UnfoldedPart; car: ConsistCarItem; carIdx: number }[] = []

    for (const item of overflowAccessories) {
      let placedCrossCar = false

      for (let pIdx = 0; pIdx < pages.length; pIdx++) {
        const targetPage = pages[pIdx]
        if (targetPage.isAccessoryPage) continue

        const occupiedPolygons = pageOccupiedMap.get(pIdx) || []

        for (const rotationAngle of [0, 90] as (0 | 90)[]) {
          const acc = rotateUnfoldedPart(item.part, rotationAngle)
          const accW = acc.bounds.width
          const accH = acc.bounds.height

          const candidates = generateCandidateCornerSlots(accW, accH)

          for (const cand of candidates) {
            if (
              cand.x < A4_MARGIN_MM + 2 ||
              cand.y < 28 ||
              cand.x + accW > A4_WIDTH_MM - A4_MARGIN_MM - 2 ||
              cand.y + accH > A4_HEIGHT_MM - A4_MARGIN_MM - 2
            ) {
              continue
            }

            const box = {
              minX: cand.x,
              minY: cand.y,
              maxX: cand.x + accW,
              maxY: cand.y + accH
            }

            if (!doesBoxOverlapPolygons(box, occupiedPolygons, 5)) {
              const accOffsetX = cand.x - acc.bounds.minX
              const accOffsetY = cand.y - acc.bounds.minY

              const carShort = item.car.carNumberText.split(' ')[0]
              const partShort = item.part.name.replace(/车顶|立体|气动|流线/g, '')

              targetPage.placements.push({
                part: acc,
                car: item.car,
                carIndex: item.carIdx,
                displayName: `${carShort} ${partShort}`,
                x: accOffsetX,
                y: accOffsetY,
                rotation: rotationAngle
              })

              acc.faces.forEach(face => {
                const shiftedPoly = face.polygon2D.map(p => ({ x: p.x + accOffsetX, y: p.y + accOffsetY }))
                occupiedPolygons.push(shiftedPoly)
                if (face.glueTabs) {
                  face.glueTabs.forEach(tab => {
                    const tabPts = generateTabPoints(tab.p1, tab.p2, tab.tabWidth || 7, tab.angle || 45, face.polygon2D)
                    occupiedPolygons.push(tabPts.map(p => ({ x: p.x + accOffsetX, y: p.y + accOffsetY })))
                  })
                }
              })

              placedCrossCar = true
              break
            }
          }

          if (placedCrossCar) break
        }

        if (placedCrossCar) break
      }

      if (!placedCrossCar) {
        unplacedAccessories.push(item)
      }
    }

    overflowAccessories.length = 0
    overflowAccessories.push(...unplacedAccessories)
  }

  // 2. 排版未被就地容纳的剩余配件 (空间不足时自动开辟「车顶与立体配件专页」)
  if (overflowAccessories.length > 0) {
    let accPageIndex = pages.length
    let accCurX = A4_MARGIN_MM + 8
    let accCurY = A4_MARGIN_MM + 42
    let accRowH = 0
    let curPagePlacements: ConsistPartPlacement[] = []

    for (const item of overflowAccessories) {
      const w = item.part.bounds.width
      const h = item.part.bounds.height
      const colW = Math.max(w, 50)

      if (accCurX + colW > A4_WIDTH_MM - A4_MARGIN_MM - 8 && curPagePlacements.length > 0) {
        accCurX = A4_MARGIN_MM + 8
        accCurY += accRowH + 24
        accRowH = 0
      }

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
