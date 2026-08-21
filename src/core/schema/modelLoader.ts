// 标准 JSON Schema 模型加载与运行时转换器 (包含顺时针多边形排序与车顶微型配件 5 面十字展开)
import { PapercraftModelSchema } from './papercraftSchema'
import { PapercraftModelData, UnfoldedPart, UnfoldedFace, Point2D } from '../types'
import { calculatePartBounds } from '../unfoldEngine'

function segmentsIntersect(a1: Point2D, a2: Point2D, b1: Point2D, b2: Point2D): boolean {
  const ccw = (p1: Point2D, p2: Point2D, p3: Point2D) => (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x)
  return ccw(a1, b1, b2) !== ccw(a2, b1, b2) && ccw(a1, a2, b1) !== ccw(a1, a2, b2)
}

/**
 * 检验并修正四边形对角线交叉，确保 2D 多边形与 UV 坐标 100% 同步保序
 */
function ensurePolygonPerimeterOrder(points: Point2D[], uvs: Point2D[]): { polygon2D: Point2D[]; uvCoords: Point2D[] } {
  if (points.length !== 4) {
    return { polygon2D: points, uvCoords: uvs }
  }

  // 检查点 1->2 是否与点 0->3 发生对角线交叉 (即网格排列 [TL, TR, BL, BR])
  const p0 = points[0], p1 = points[1], p2 = points[2], p3 = points[3]
  
  if (segmentsIntersect(p1, p2, p0, p3)) {
    // 对角交叉沙漏多边形，重新排列为顺周长闭合 [0, 1, 3, 2]，同时同步调整 UV
    return {
      polygon2D: [p0, p1, p3, p2],
      uvCoords: uvs.length >= 4 ? [uvs[0], uvs[1], uvs[3], uvs[2]] : uvs
    }
  }

  if (segmentsIntersect(p0, p1, p2, p3)) {
    return {
      polygon2D: [p0, p2, p1, p3],
      uvCoords: uvs.length >= 4 ? [uvs[0], uvs[2], uvs[1], uvs[3]] : uvs
    }
  }

  return { polygon2D: points, uvCoords: uvs }
}

/**
 * 将标准 JSON Schema 转换为系统统一的 PapercraftModelData 运行时对象
 */
export function loadPapercraftFromSchema(schema: PapercraftModelSchema): PapercraftModelData {
  return {
    id: schema.id,
    name: schema.name,
    category: schema.category === 'vehicle' ? 'vehicle' : 'train',
    description: schema.description,
    difficulty: schema.difficulty === 'easy' ? 'beginner' : schema.difficulty === 'medium' ? 'intermediate' : 'advanced',
    recommendedAge: schema.recommendedAge,
    estimatedTime: schema.estimatedTime,
    partsCount: schema.parts.length + (schema.accessories?.length || 0),
    dimensions: schema.dimensions,

    // 生成 3D 部件
    create3DParts: () => {
      const parts: {
        id: string
        name: string
        meshData: {
          vertices: number[]
          indices: number[]
          uvs: number[]
        }
        explodeOffset: [number, number, number]
      }[] = []

      schema.parts.forEach(part => {
        const vertices: number[] = []
        const indices: number[] = []
        const uvs: number[] = []

        part.faces.forEach(face => {
          const baseIndex = vertices.length / 3

          face.vertices3D.forEach(v => {
            vertices.push(v[0] * 0.01, v[1] * 0.01, v[2] * 0.01)
          })

          face.uvCoords.forEach(uv => {
            uvs.push(uv[0], uv[1])
          })

          face.indices.forEach(idx => {
            indices.push(baseIndex + idx)
          })
        })

        parts.push({
          id: part.id,
          name: part.name,
          meshData: { vertices, indices, uvs },
          explodeOffset: [0, 0, 0]
        })
      })

      if (schema.accessories) {
        schema.accessories.forEach(acc => {
          const vertices: number[] = []
          acc.vertices3D.forEach(v => {
            vertices.push(
              (v[0] + acc.position3D[0]) * 0.01,
              (v[1] + acc.position3D[1]) * 0.01,
              (v[2] + acc.position3D[2]) * 0.01
            )
          })

          const uvs: number[] = []
          acc.uvCoords.forEach(uv => uvs.push(uv[0], uv[1]))

          parts.push({
            id: acc.id,
            name: acc.name,
            meshData: {
              vertices,
              indices: acc.indices,
              uvs
            },
            explodeOffset: [0, 0.35, 0]
          })
        })
      }

      return parts
    },

    // 生成 2D 展开图部件 (保证顶点顺时针周长闭合，配件生成 5 面十字微型折盒)
    generateUnfoldedParts: () => {
      const unfoldedParts: UnfoldedPart[] = []

      // 1. 车身主体
      schema.parts.forEach(part => {
        const faces: UnfoldedFace[] = part.faces.map(face => {
          const rawPolygon2D: Point2D[] = face.vertices2D.map(v => ({ x: v[0], y: v[1] }))
          const rawUvs: Point2D[] = face.uvCoords.map(uv => ({ x: uv[0], y: uv[1] }))
          const { polygon2D, uvCoords } = ensurePolygonPerimeterOrder(rawPolygon2D, rawUvs)

          return {
            id: face.id,
            name: face.name,
            textureSlot: face.slotName,
            polygon2D,
            uvCoords,
            creases: face.creases?.map(c => ({
              type: c.type,
              p1: c.p1,
              p2: c.p2
            })) || [],
            glueTabs: face.tabs?.map(t => ({
              id: t.id,
              label: t.label,
              edgeIndex: t.edgeIndex,
              p1: t.p1,
              p2: t.p2,
              tabWidth: t.tabWidth,
              angle: t.angle,
              targetPartId: part.id,
              targetEdgeIndex: 0
            })) || []
          }
        })

        unfoldedParts.push({
          id: part.id,
          name: part.name,
          isAccessory: false,
          faces,
          bounds: calculatePartBounds(faces)
        })
      })

      // 2. 车顶与立体外加配件 (若自带可展开面定义则真实展开，否则生成标准 5 面立体折叠盒)
      if (schema.accessories) {
        schema.accessories.forEach(acc => {
          if (acc.faces && acc.faces.length > 0) {
            // 2.A 真实可展立体配件展开 (如铁面人流线机甲导流鼻罩)
            const faces: UnfoldedFace[] = acc.faces.map(face => {
              const rawPolygon2D: Point2D[] = face.vertices2D.map(v => ({ x: v[0], y: v[1] }))
              const rawUvs: Point2D[] = face.uvCoords.map(uv => ({ x: uv[0], y: uv[1] }))
              const { polygon2D, uvCoords } = ensurePolygonPerimeterOrder(rawPolygon2D, rawUvs)

              return {
                id: face.id,
                name: face.name,
                textureSlot: face.slotName,
                polygon2D,
                uvCoords,
                creases: face.creases?.map(c => ({
                  type: c.type,
                  p1: c.p1,
                  p2: c.p2
                })) || [],
                glueTabs: face.tabs?.map(t => ({
                  id: t.id,
                  label: t.label,
                  edgeIndex: t.edgeIndex,
                  p1: t.p1,
                  p2: t.p2,
                  tabWidth: t.tabWidth,
                  angle: t.angle,
                  targetPartId: t.targetFaceId || acc.id,
                  targetEdgeIndex: 0
                })) || []
              }
            })

            unfoldedParts.push({
              id: acc.id,
              name: acc.name,
              isAccessory: true,
              faces,
              bounds: calculatePartBounds(faces)
            })
            return
          }

          // 2.B 标准 5 面十字立体折叠盒 (通用车顶设备/空调罩)
          const w = acc.layout2D?.width || 30
          const h = acc.layout2D?.height || 40
          const d = 5 // 配件盒深度 5mm
          const lx = d // 局部原点留出深度边距
          const ly = d

          const faces: UnfoldedFace[] = []

          // 2.1 顶面 (Top / Main Face)
          faces.push({
            id: `${acc.id}_top`,
            name: `${acc.name} 顶盖`,
            textureSlot: acc.slotName,
            polygon2D: [
              { x: lx, y: ly },
              { x: lx + w, y: ly },
              { x: lx + w, y: ly + h },
              { x: lx, y: ly + h }
            ],
            uvCoords: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 0, y: 0 }],
            creases: [
              { type: 'mountain', p1: { x: lx, y: ly }, p2: { x: lx + w, y: ly } },
              { type: 'mountain', p1: { x: lx + w, y: ly }, p2: { x: lx + w, y: ly + h } },
              { type: 'mountain', p1: { x: lx + w, y: ly + h }, p2: { x: lx, y: ly + h } },
              { type: 'mountain', p1: { x: lx, y: ly + h }, p2: { x: lx, y: ly } }
            ],
            glueTabs: []
          })

          // 2.2 上侧面 (North)
          faces.push({
            id: `${acc.id}_north`,
            name: `${acc.name} 后侧`,
            textureSlot: acc.slotName,
            polygon2D: [
              { x: lx, y: ly - d },
              { x: lx + w, y: ly - d },
              { x: lx + w, y: ly },
              { x: lx, y: ly }
            ],
            uvCoords: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 0, y: 0 }],
            creases: [
              { type: 'cut', p1: { x: lx, y: ly - d }, p2: { x: lx + w, y: ly - d } },
              { type: 'cut', p1: { x: lx, y: ly - d }, p2: { x: lx, y: ly } },
              { type: 'cut', p1: { x: lx + w, y: ly - d }, p2: { x: lx + w, y: ly } }
            ],
            glueTabs: [
              {
                id: `tab_${acc.id}_n`,
                label: 'T',
                edgeIndex: 0,
                p1: { x: lx, y: ly - d },
                p2: { x: lx + w, y: ly - d },
                tabWidth: 4,
                angle: 45,
                targetPartId: 'roof',
                targetEdgeIndex: 0
              }
            ]
          })

          // 2.3 下侧面 (South)
          faces.push({
            id: `${acc.id}_south`,
            name: `${acc.name} 前侧`,
            textureSlot: acc.slotName,
            polygon2D: [
              { x: lx, y: ly + h },
              { x: lx + w, y: ly + h },
              { x: lx + w, y: ly + h + d },
              { x: lx, y: ly + h + d }
            ],
            uvCoords: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 0, y: 0 }],
            creases: [
              { type: 'cut', p1: { x: lx, y: ly + h + d }, p2: { x: lx + w, y: ly + h + d } },
              { type: 'cut', p1: { x: lx, y: ly + h }, p2: { x: lx, y: ly + h + d } },
              { type: 'cut', p1: { x: lx + w, y: ly + h }, p2: { x: lx + w, y: ly + h + d } }
            ],
            glueTabs: [
              {
                id: `tab_${acc.id}_s`,
                label: 'T',
                edgeIndex: 2,
                p1: { x: lx + w, y: ly + h + d },
                p2: { x: lx, y: ly + h + d },
                tabWidth: 4,
                angle: 45,
                targetPartId: 'roof',
                targetEdgeIndex: 0
              }
            ]
          })

          // 2.4 左侧面 (West - 带四角封闭折翼与车顶粘贴翼)
          faces.push({
            id: `${acc.id}_west`,
            name: `${acc.name} 左侧`,
            textureSlot: acc.slotName,
            polygon2D: [
              { x: lx - d, y: ly },
              { x: lx, y: ly },
              { x: lx, y: ly + h },
              { x: lx - d, y: ly + h }
            ],
            uvCoords: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 0, y: 0 }],
            creases: [
              { type: 'mountain', p1: { x: lx - d, y: ly }, p2: { x: lx, y: ly } },
              { type: 'mountain', p1: { x: lx, y: ly + h }, p2: { x: lx - d, y: ly + h } },
              { type: 'mountain', p1: { x: lx, y: ly }, p2: { x: lx, y: ly + h } }
            ],
            glueTabs: [
              // 左上角角部拼缝粘合翼 (粘接后侧 North)
              {
                id: `tab_${acc.id}_w_top`,
                label: '1',
                edgeIndex: 0,
                p1: { x: lx - d, y: ly },
                p2: { x: lx, y: ly },
                tabWidth: 3,
                angle: 45,
                targetPartId: `${acc.id}_north`,
                targetEdgeIndex: 0
              },
              // 左下角角部拼缝粘合翼 (粘接前侧 South)
              {
                id: `tab_${acc.id}_w_bot`,
                label: '2',
                edgeIndex: 2,
                p1: { x: lx, y: ly + h },
                p2: { x: lx - d, y: ly + h },
                tabWidth: 3,
                angle: 45,
                targetPartId: `${acc.id}_south`,
                targetEdgeIndex: 0
              },
              // 左侧车顶粘贴底翼
              {
                id: `tab_${acc.id}_w`,
                label: 'T',
                edgeIndex: 3,
                p1: { x: lx - d, y: ly + h },
                p2: { x: lx - d, y: ly },
                tabWidth: 3.5,
                angle: 45,
                targetPartId: 'roof',
                targetEdgeIndex: 0
              }
            ]
          })

          // 2.5 右侧面 (East - 带四角封闭折翼与车顶粘贴翼)
          faces.push({
            id: `${acc.id}_east`,
            name: `${acc.name} 右侧`,
            textureSlot: acc.slotName,
            polygon2D: [
              { x: lx + w, y: ly },
              { x: lx + w + d, y: ly },
              { x: lx + w + d, y: ly + h },
              { x: lx + w, y: ly + h }
            ],
            uvCoords: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 0, y: 0 }],
            creases: [
              { type: 'mountain', p1: { x: lx + w, y: ly }, p2: { x: lx + w + d, y: ly } },
              { type: 'mountain', p1: { x: lx + w + d, y: ly + h }, p2: { x: lx + w, y: ly + h } },
              { type: 'mountain', p1: { x: lx + w, y: ly }, p2: { x: lx + w, y: ly + h } }
            ],
            glueTabs: [
              // 右上角角部拼缝粘合翼 (粘接后侧 North)
              {
                id: `tab_${acc.id}_e_top`,
                label: '1',
                edgeIndex: 0,
                p1: { x: lx + w, y: ly },
                p2: { x: lx + w + d, y: ly },
                tabWidth: 3,
                angle: 45,
                targetPartId: `${acc.id}_north`,
                targetEdgeIndex: 0
              },
              // 右下角角部拼缝粘合翼 (粘接前侧 South)
              {
                id: `tab_${acc.id}_e_bot`,
                label: '2',
                edgeIndex: 2,
                p1: { x: lx + w + d, y: ly + h },
                p2: { x: lx + w, y: ly + h },
                tabWidth: 3,
                angle: 45,
                targetPartId: `${acc.id}_south`,
                targetEdgeIndex: 0
              },
              // 右侧车顶粘贴底翼
              {
                id: `tab_${acc.id}_e`,
                label: 'T',
                edgeIndex: 1,
                p1: { x: lx + w + d, y: ly },
                p2: { x: lx + w + d, y: ly + h },
                tabWidth: 3.5,
                angle: 45,
                targetPartId: 'roof',
                targetEdgeIndex: 0
              }
            ]
          })

          unfoldedParts.push({
            id: acc.id,
            name: acc.name,
            isAccessory: true,
            faces,
            bounds: calculatePartBounds(faces)
          })
        })
      }

      return unfoldedParts
    }
  }
}
