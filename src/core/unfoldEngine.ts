// 展开与装箱排版引擎
import { Point2D, GlueTab, UnfoldedPart, UnfoldedFace } from './types'
import { overlaps } from './paper/geometry'
import { partCaptionPolygon } from './paper/printMarks'

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

/** Legacy trapezoid helper. Compiled models store validated polygon2D instead. */
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

export function getTabPolygon(tab: GlueTab, faces?: { polygon2D: Point2D[] }[]): Point2D[] {
  return tab.polygon2D || generateTabPoints(tab.p1, tab.p2, tab.tabWidth, tab.angle, faces)
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
      const tabPts = getTabPolygon(tab, faces)
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
      p2: rotPt(t.p2),
      polygon2D: t.polygon2D?.map(rotPt)
    })) || [],
    mountingGuides: face.mountingGuides?.map(g => ({...g, x: -g.y-g.height, y:g.x, width:g.height, height:g.width}))
  }))

  return {
    ...part,
    faces: newFaces,
    bounds: calculatePartBounds(newFaces)
  }
}

// Printable content excludes page heading, part labels and footer. Units stay in mm.
export const PRINT_AREA = { minX:10, minY:18, maxX:200, maxY:281 }
const PAGE_GAP = 3
const layoutCache = new WeakMap<ConsistCarItem[], ConsistPageLayout[]>()

function placedPolygons(placement:ConsistPartPlacement):Point2D[][] {
  const caption=partCaptionPolygon(placement.part,placement.carIndex)
  return [...placement.part.faces.flatMap(f=>[f.polygon2D,...f.glueTabs.map(t=>getTabPolygon(t,placement.part.faces))]),caption].map(poly=>poly.map(p=>({x:p.x+placement.x,y:p.y+placement.y})))
}

function tryPlace(part:UnfoldedPart,car:ConsistCarItem,page:ConsistPageLayout):boolean {
  const occupied=page.placements.flatMap(placedPolygons)
  for(const rotation of [0,90] as const) {
    const candidate=rotateUnfoldedPart(part,rotation),b=candidate.bounds
    if(b.width>PRINT_AREA.maxX-PRINT_AREA.minX || b.height>PRINT_AREA.maxY-PRINT_AREA.minY)continue
    const local=[...candidate.faces.flatMap(f=>[f.polygon2D,...f.glueTabs.map(t=>getTabPolygon(t,candidate.faces))]),partCaptionPolygon(candidate,car.carIndex)]
    const slots:{x:number;y:number}[]=[]
    if(!page.placements.length&&page.car)slots.push({x:(210-b.width)/2,y:Math.max(PRINT_AREA.minY,(297-b.height)/2)})
    const xs=new Set([PRINT_AREA.minX,PRINT_AREA.maxX-b.width]),ys=new Set([PRINT_AREA.minY])
    for(const p of page.placements) {
      const box=p.part.bounds
      xs.add(p.x+box.maxX+PAGE_GAP);xs.add(p.x+box.minX-b.width-PAGE_GAP)
      ys.add(p.y+box.maxY+PAGE_GAP+4)
    }
    for(let y=PRINT_AREA.minY;y<=PRINT_AREA.maxY-b.height;y+=4)for(const x of [...xs].sort((a,b)=>a-b))slots.push({x,y})
    for(const y of ys)for(let x=PRINT_AREA.minX;x<=PRINT_AREA.maxX-b.width;x+=4)slots.push({x,y})
    for(const pos of slots) {
      if(pos.x<PRINT_AREA.minX || pos.y<PRINT_AREA.minY || pos.x+b.width>PRINT_AREA.maxX || pos.y+b.height>PRINT_AREA.maxY)continue
      const dx=pos.x-b.minX,dy=pos.y-b.minY
      const moved=local.map(poly=>poly.map(p=>({x:p.x+dx,y:p.y+dy})))
      // Polygon collision plus a small separation around the candidate's footprint.
      const box={minX:pos.x,minY:pos.y-4,maxX:pos.x+b.width,maxY:pos.y+b.height}
      if(doesBoxOverlapPolygons(box,occupied,PAGE_GAP)||moved.some(a=>occupied.some(b=>overlaps(a,b))))continue
      const shortCar=car.carNumberText.split(' ')[0]
      page.placements.push({part:candidate,car,carIndex:car.carIndex,x:dx,y:dy,rotation,displayName:`${shortCar} · ${part.name}`})
      return true
    }
  }
  return false
}

/** Every island is placed exactly once. Overflow starts a page; pieces are never shrunk. */
export function packConsistToA4Pages(cars:ConsistCarItem[]):ConsistPageLayout[] {
  const cached=layoutCache.get(cars)
  if(cached)return cached
  const pages:ConsistPageLayout[]=[],remaining:{part:UnfoldedPart;car:ConsistCarItem}[]=[]
  // Reserve one primary body page per car; all smaller islands share the remaining space.
  for(const car of cars) {
    const parts=car.modelData.generateUnfoldedParts()
    const bodies=parts.filter(p=>!p.isAccessory).sort((a,b)=>b.bounds.width*b.bounds.height-a.bounds.width*a.bounds.height)
    const primary=bodies[0]
    if(primary) {
      const page:ConsistPageLayout={pageIndex:pages.length,pageTitle:`${car.carNumberText} · ${car.modelData.name}`,subTitle:'',carIndex:car.carIndex,car,isAccessoryPage:false,placements:[]}
      if(!tryPlace(primary,car,page))throw new Error(`${primary.name}: exceeds the printable A4 area; reduce the whole model scale`)
      pages.push(page)
    }
    remaining.push(...parts.filter(p=>p!==primary).map(part=>({part,car})))
  }
  remaining.sort((a,b)=>b.part.bounds.width*b.part.bounds.height-a.part.bounds.width*a.part.bounds.height)
  for(const {part,car} of remaining) {
    const candidates=[...pages.filter(p=>p.car===car),...pages.filter(p=>p.car!==car)]
    if(candidates.some(page=>tryPlace(part,car,page)))continue
    const page:ConsistPageLayout={pageIndex:pages.length,pageTitle:'组合零件 / Shared parts',subTitle:'',isAccessoryPage:false,placements:[]}
    if(!tryPlace(part,car,page))throw new Error(`${part.name}: exceeds the printable A4 area; reduce the whole model scale`)
    pages.push(page)
  }
  for(const page of pages) {
    const members=[...new Set(page.placements.map(p=>p.car))].sort((a,b)=>a.carIndex-b.carIndex)
    page.isAccessoryPage=page.placements.every(p=>p.part.isAccessory)
    if(members.length>1) {
      page.pageTitle=`组合零件 / Shared parts · ${members.map(c=>c.carIndex+1).join(', ')} 号车 / Cars`
      page.car=undefined // Export must not label a mixed page as belonging to only one car.
    } else if(!page.car&&members.length===1) {
      page.car=members[0];page.carIndex=members[0].carIndex
      page.pageTitle=`${members[0].carNumberText} · 补充零件 / Additional parts`
    }
  }
  layoutCache.set(cars,pages)
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
  const car = {carIndex:0,carNumberText:'Model',carType:'head',spacingOffsetZ:0,modelData:{name:'Model',generateUnfoldedParts:()=>parts}} as ConsistCarItem
  const packed = packConsistToA4Pages([car])
  const pages = packed.map(page => ({pageIndex:page.pageIndex,pageTitle:page.pageTitle,isAccessoryPage:page.isAccessoryPage,parts:page.placements.map(p=>({partId:p.part.id,x:p.x,y:p.y,rotation:p.rotation}))}))
  return {pages,totalPages:pages.length}
}
