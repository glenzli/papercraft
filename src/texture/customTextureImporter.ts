// 确定性贴图切片解析与分层合成器 (Custom Texture Importer & Layer Compositor)
// 核心能力：
// 1. 自动检测导入图片类型 (2048x1536 贴图总谱 Atlas 或 1024x280 单侧身图)
// 2. 100% 确定性几何切片：提取 side_left, side_right, roof, front, back
// 3. 智能结构图层叠加 (可选)：在用户/AI 艺术底图上叠加高精度抗 UV 车窗、金属车门框与把手
// 4. 2D/3D 自动仿射变换与即时生效

export interface ProcessedCustomTexture {
  canvases: {
    side_left: HTMLCanvasElement
    side_right: HTMLCanvasElement
    roof?: HTMLCanvasElement
    front?: HTMLCanvasElement
    back?: HTMLCanvasElement
  }
  dataUrls: {
    side_left: string
    side_right: string
    roof?: string
    front?: string
    back?: string
  }
  detectedType: 'atlas' | 'single_side'
}

export interface ImportTextureOptions {
  overlayStructure: boolean
  consistCategory?: string
  liveryStyle?: string
  carType?: 'head' | 'middle' | 'tail'
  frameColor?: string
  windowColor?: string
}

/**
 * 叠加车门车窗与结构线框
 */
function overlaySideStructure(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  isLeft: boolean,
  options: ImportTextureOptions
) {
  const { consistCategory = 'shinkansen', liveryStyle = 'shinkansen-nankai-rapit', carType = 'head' } = options
  const isMiddle = carType === 'middle'
  const isRapit = liveryStyle === 'shinkansen-nankai-rapit'
  const isCommuter = consistCategory === 'commuter'

  if (isRapit) {
    // === 南海特急专属正圆大舷窗与车门 ===
    const physRatio = isMiddle ? (160 / 44) : (148 / 44)
    const scaleX = (w / h) / physRatio

    const drawDoor = (dx: number) => {
      const doorW = w * 0.075
      const doorH = h * 0.70
      const dy = h * 0.16

      // 金属门框
      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 2.5
      ctx.strokeRect(dx, dy, doorW, doorH)

      // 正圆车门窗
      const doorPortholeR = 20
      const doorPortholeY = dy + doorH * 0.32
      const doorPortholeX = dx + doorW / 2

      ctx.fillStyle = '#94a3b8'
      ctx.beginPath()
      ctx.ellipse(doorPortholeX, doorPortholeY, doorPortholeR * scaleX, doorPortholeR, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#e2e8f0'
      ctx.beginPath()
      ctx.ellipse(doorPortholeX, doorPortholeY, doorPortholeR * 0.86 * scaleX, doorPortholeR * 0.86, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#020617'
      ctx.beginPath()
      ctx.ellipse(doorPortholeX, doorPortholeY, doorPortholeR * 0.74 * scaleX, doorPortholeR * 0.74, 0, 0, Math.PI * 2)
      ctx.fill()

      // 门把手
      ctx.fillStyle = '#94a3b8'
      ctx.fillRect(dx + doorW / 2 - 0.5, dy, 1, doorH)
      ctx.fillStyle = '#f8fafc'
      ctx.fillRect(dx + doorW * 0.22, dy + doorH * 0.54, 4, 12)
    }

    const drawPorthole = (cx: number, cy: number, r: number = 46) => {
      ctx.fillStyle = '#94a3b8'
      ctx.beginPath()
      ctx.ellipse(cx, cy, r * scaleX, r, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#e2e8f0'
      ctx.beginPath()
      ctx.ellipse(cx, cy, r * 0.88 * scaleX, r * 0.88, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#020617'
      ctx.beginPath()
      ctx.ellipse(cx, cy, r * 0.78 * scaleX, r * 0.78, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    const cy = h * 0.38
    const r = 46

    if (isMiddle) {
      drawDoor(w * 0.035)
      drawDoor(w * 0.89)
      for (let i = 0; i < 7; i++) {
        drawPorthole(w * 0.17 + i * (w * 0.11), cy, r)
      }
    } else {
      const doorX = isLeft ? w * 0.89 : w * 0.035
      drawDoor(doorX)
      const cabinStartX = isLeft ? w * 0.16 : w * 0.18
      const step = w * 0.122
      for (let i = 0; i < 6; i++) {
        const cx = isLeft ? (w * 0.78 - (5 - i) * step) : (cabinStartX + i * step)
        drawPorthole(cx, cy, r)
      }
    }
  } else if (isCommuter) {
    // === 通勤电车 3 对双开门与宽敞客舱窗 ===
    const doorPositions = [0.05, 0.46, 0.87]
    const doorTop = h * 0.12
    const doorH = h * 0.72
    const doorW = w * 0.08

    for (const dp of doorPositions) {
      const dx = w * (isLeft ? dp : (1 - dp - doorW / w))
      ctx.fillStyle = '#94a3b8'
      ctx.fillRect(dx, doorTop, doorW, doorH)
      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 1.5
      ctx.strokeRect(dx, doorTop, doorW, doorH)

      const dwW = (doorW - 12) / 2
      const dwH = doorH * 0.35
      ctx.fillStyle = '#020617'
      ctx.fillRect(dx + 4, doorTop + 6, dwW, dwH)
      ctx.fillRect(dx + 8 + dwW, doorTop + 6, dwW, dwH)
    }

    const winTop = h * 0.20
    const winH = h * 0.28
    const winW = w * 0.075

    const winGroup1 = [0.16, 0.25, 0.34]
    const winGroup2 = [0.57, 0.66, 0.75]

    for (const relX of (isLeft ? [...winGroup1, ...winGroup2] : [...winGroup1, ...winGroup2].map(x => 1 - x - winW / w))) {
      const wx = w * relX
      ctx.fillStyle = '#cbd5e1'
      ctx.beginPath()
      ctx.roundRect(wx - 2, winTop - 2, winW + 4, winH + 4, 3)
      ctx.fill()

      ctx.fillStyle = '#020617'
      ctx.beginPath()
      ctx.roundRect(wx, winTop, winW, winH, 2)
      ctx.fill()
    }
  } else {
    // === 新干线高速列车 ===
    const winTop = h * 0.22
    const winH = h * 0.24
    const cabinWinW = w * 0.060

    if (isMiddle) {
      for (const dx of [w * 0.03, w * 0.92]) {
        ctx.fillStyle = '#cbd5e1'
        ctx.fillRect(dx, h * 0.18, w * 0.05, h * 0.67)
        ctx.fillStyle = '#020617'
        ctx.fillRect(dx + 3, h * 0.23, w * 0.05 - 6, h * 0.22)
      }
      for (let i = 0; i < 8; i++) {
        const wx = w * 0.11 + i * (w * 0.098)
        ctx.fillStyle = '#cbd5e1'
        ctx.beginPath(); ctx.roundRect(wx - 2, winTop - 2, cabinWinW + 4, winH + 4, 3); ctx.fill()
        ctx.fillStyle = '#020617'
        ctx.beginPath(); ctx.roundRect(wx, winTop, cabinWinW, winH, 2); ctx.fill()
      }
    } else {
      const doorX = isLeft ? w * 0.92 : w * 0.03
      ctx.fillStyle = '#cbd5e1'
      ctx.fillRect(doorX, h * 0.18, w * 0.05, h * 0.67)
      ctx.fillStyle = '#020617'
      ctx.fillRect(doorX + 3, h * 0.23, w * 0.05 - 6, h * 0.22)

      const cabinStartX = isLeft ? w * 0.18 : w * 0.11
      const stepX = w * 0.096
      for (let i = 0; i < 7; i++) {
        const wx = cabinStartX + i * stepX
        ctx.fillStyle = '#cbd5e1'
        ctx.beginPath(); ctx.roundRect(wx - 2, winTop - 2, cabinWinW + 4, winH + 4, 3); ctx.fill()
        ctx.fillStyle = '#020617'
        ctx.beginPath(); ctx.roundRect(wx, winTop, cabinWinW, winH, 2); ctx.fill()
      }

      // 驾驶室斜风挡
      const cabX = isLeft ? w * 0.04 : w * 0.85
      const cabW = w * 0.11
      ctx.fillStyle = '#020617'
      ctx.beginPath()
      if (isLeft) {
        ctx.moveTo(cabX + cabW, winTop)
        ctx.lineTo(cabX, winTop + winH * 0.4)
        ctx.lineTo(cabX + cabW * 0.3, winTop + winH)
        ctx.lineTo(cabX + cabW, winTop + winH)
      } else {
        ctx.moveTo(cabX, winTop)
        ctx.lineTo(cabX + cabW, winTop + winH * 0.4)
        ctx.lineTo(cabX + cabW * 0.7, winTop + winH)
        ctx.lineTo(cabX, winTop + winH)
      }
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
  }

  // 底部深灰底盘裙板
  const chassisY = h * 0.85
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, chassisY, w, h - chassisY)
  ctx.fillStyle = '#334155'
  ctx.fillRect(0, chassisY, w, 2.5)
}

/**
 * 将用户上传的图像解析并切片为标准贴图
 */
export async function sliceAndProcessTextureImage(
  img: HTMLImageElement,
  options: ImportTextureOptions
): Promise<ProcessedCustomTexture> {
  const { overlayStructure = true } = options

  const imgW = img.naturalWidth || img.width
  const imgH = img.naturalHeight || img.height
  const aspect = imgW / imgH

  // 判定是否为 2048x1536 标准总谱 Atlas (长宽比在 1.1 ~ 1.6 之间)
  const isAtlas = imgW >= 1200 && imgH >= 800 && aspect >= 1.1 && aspect <= 1.6

  if (isAtlas) {
    // === 确定性贴图总谱 Atlas 切片 ===
    // 缩放基准比例 (以 2048x1536 为母本)
    const scaleX = imgW / 2048
    const scaleY = imgH / 1536

    const extractRegion = (rx: number, ry: number, rw: number, rh: number, targetW: number, targetH: number): HTMLCanvasElement => {
      const c = document.createElement('canvas')
      c.width = targetW
      c.height = targetH
      const ctx = c.getContext('2d')!
      ctx.drawImage(img, rx * scaleX, ry * scaleY, rw * scaleX, rh * scaleY, 0, 0, targetW, targetH)
      return c
    }

    const sideLeftCanvas = extractRegion(48, 140, 1024, 280, 1024, 280)
    const sideRightCanvas = extractRegion(48, 460, 1024, 280, 1024, 280)
    const roofCanvas = extractRegion(48, 780, 1024, 280, 1024, 280)
    const frontCanvas = extractRegion(1120, 140, 380, 320, 380, 320)
    const backCanvas = extractRegion(1548, 140, 380, 320, 380, 320)

    if (overlayStructure) {
      overlaySideStructure(sideLeftCanvas.getContext('2d')!, 1024, 280, true, options)
      overlaySideStructure(sideRightCanvas.getContext('2d')!, 1024, 280, false, options)
    }

    return {
      detectedType: 'atlas',
      canvases: {
        side_left: sideLeftCanvas,
        side_right: sideRightCanvas,
        roof: roofCanvas,
        front: frontCanvas,
        back: backCanvas
      },
      dataUrls: {
        side_left: sideLeftCanvas.toDataURL('image/png'),
        side_right: sideRightCanvas.toDataURL('image/png'),
        roof: roofCanvas.toDataURL('image/png'),
        front: frontCanvas.toDataURL('image/png'),
        back: backCanvas.toDataURL('image/png')
      }
    }
  } else {
    // === 单侧身图像输入 (自动缩放并生成左右侧身) ===
    const sideLeftCanvas = document.createElement('canvas')
    sideLeftCanvas.width = 1024
    sideLeftCanvas.height = 280
    const ctxL = sideLeftCanvas.getContext('2d')!
    ctxL.drawImage(img, 0, 0, 1024, 280)

    const sideRightCanvas = document.createElement('canvas')
    sideRightCanvas.width = 1024
    sideRightCanvas.height = 280
    const ctxR = sideRightCanvas.getContext('2d')!
    // 水平正向翻转镜像 (保留车头朝向)
    ctxR.save()
    ctxR.translate(1024, 0)
    ctxR.scale(-1, 1)
    ctxR.drawImage(img, 0, 0, 1024, 280)
    ctxR.restore()

    if (overlayStructure) {
      overlaySideStructure(ctxL, 1024, 280, true, options)
      overlaySideStructure(ctxR, 1024, 280, false, options)
    }

    return {
      detectedType: 'single_side',
      canvases: {
        side_left: sideLeftCanvas,
        side_right: sideRightCanvas
      },
      dataUrls: {
        side_left: sideLeftCanvas.toDataURL('image/png'),
        side_right: sideRightCanvas.toDataURL('image/png')
      }
    }
  }
}
