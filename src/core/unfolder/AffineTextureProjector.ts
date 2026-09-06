import type { Point2D } from '../types'

export interface AffineMatrix2D {
  a: number
  b: number
  c: number
  d: number
  e: number
  f: number
}

/**
 * UV 到 2D 展开多边形的高精度仿射贴图投影器
 */
export class AffineTextureProjector {
  /**
   * 求解从源 Canvas 像素坐标 (u*W, (1-v)*H) 到目标 2D 展开多边形 (x, y) 的唯一 2D 仿射变换矩阵
   */
  public static computeAffineMatrix(
    p0: Point2D,
    p1: Point2D,
    p2: Point2D,
    uv0: Point2D,
    uv1: Point2D,
    uv2: Point2D,
    texWidth: number,
    texHeight: number
  ): AffineMatrix2D | null {
    // 源 Canvas 像素坐标 (注意 Canvas Y 轴向下，UV v 轴向上)
    const sx0 = uv0.x * texWidth
    const sy0 = (1 - uv0.y) * texHeight
    const sx1 = uv1.x * texWidth
    const sy1 = (1 - uv1.y) * texHeight
    const sx2 = uv2.x * texWidth
    const sy2 = (1 - uv2.y) * texHeight

    // 目标 2D 毫米/像素坐标
    const dx0 = p0.x
    const dy0 = p0.y
    const dx1 = p1.x
    const dy1 = p1.y
    const dx2 = p2.x
    const dy2 = p2.y

    // 行列式
    const denom = sx0 * (sy1 - sy2) + sx1 * (sy2 - sy0) + sx2 * (sy0 - sy1)
    if (Math.abs(denom) < 1e-7) return null

    const a = (dx0 * (sy1 - sy2) + dx1 * (sy2 - sy0) + dx2 * (sy0 - sy1)) / denom
    const c = (dx0 * (sx2 - sx1) + dx1 * (sx0 - sx2) + dx2 * (sx1 - sx0)) / denom
    const e = (dx0 * (sx1 * sy2 - sx2 * sy1) + dx1 * (sx2 * sy0 - sx0 * sy2) + dx2 * (sx0 * sy1 - sx1 * sy0)) / denom

    const b = (dy0 * (sy1 - sy2) + dy1 * (sy2 - sy0) + dy2 * (sy0 - sy1)) / denom
    const d = (dy0 * (sx2 - sx1) + dy1 * (sx0 - sx2) + dy2 * (sx1 - sx0)) / denom
    const f = (dy0 * (sx1 * sy2 - sx2 * sy1) + dy1 * (sx2 * sy0 - sx0 * sy2) + dy2 * (sx0 * sy1 - sx1 * sy0)) / denom

    return { a, b, c, d, e, f }
  }

  /**
   * 在目标 Canvas 2D 上将源贴图裁剪并仿射渲染到指定三角形内
   */
  public static renderTriangleToCanvas(
    ctx: CanvasRenderingContext2D,
    sourceCanvas: HTMLCanvasElement,
    p0: Point2D,
    p1: Point2D,
    p2: Point2D,
    uv0: Point2D,
    uv1: Point2D,
    uv2: Point2D
  ) {
    const mat = this.computeAffineMatrix(p0, p1, p2, uv0, uv1, uv2, sourceCanvas.width, sourceCanvas.height)
    if (!mat) return

    ctx.save()

    // 1. 设置裁剪路径（三角形）
    ctx.beginPath()
    ctx.moveTo(p0.x, p0.y)
    ctx.lineTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.closePath()
    ctx.clip()

    // 2. 应用仿射变换并绘制源 Canvas
    ctx.transform(mat.a, mat.b, mat.c, mat.d, mat.e, mat.f)
    ctx.drawImage(sourceCanvas, 0, 0)

    ctx.restore()
  }

  /**
   * 将任意凸多边形按三角形剖分并仿射烘焙贴图
   */
  public static renderPolygonToCanvas(
    ctx: CanvasRenderingContext2D,
    sourceCanvas: HTMLCanvasElement,
    vertices2D: Point2D[],
    uvCoords: Point2D[]
  ) {
    if (vertices2D.length < 3 || uvCoords.length < 3) return

    for (let i = 1; i < vertices2D.length - 1; i++) {
      this.renderTriangleToCanvas(
        ctx,
        sourceCanvas,
        vertices2D[0],
        vertices2D[i],
        vertices2D[i + 1],
        uvCoords[0],
        uvCoords[i],
        uvCoords[i + 1]
      )
    }
  }
}
