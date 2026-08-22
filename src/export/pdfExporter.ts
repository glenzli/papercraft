// 300 DPI 印刷级高保真 A4 多页 PDF 导出器 (原生 Canvas 渲染，中英双语支持，100% 杜绝中文乱码，支持整列编组与配件专页一键导出)
import { jsPDF } from 'jspdf'
import { ConsistCarItem } from '../core/models/consistManager'
import { packConsistToA4Pages, A4_WIDTH_MM, A4_HEIGHT_MM, generateTabPoints, ConsistPageLayout } from '../core/unfoldEngine'
import { TextureBaker } from '../texture/textureBaker'

export interface ExportConsistPdfOptions {
  consistName: string
  cars: ConsistCarItem[]
  baker: TextureBaker
  isBlankTemplate?: boolean
  locale?: 'zh-CN' | 'en-US'
}

/**
 * 将单个 A4 展开图纸页面高保真光栅化为 300 DPI 超清 Canvas (宽 2480px, 高 3508px)
 */
export function renderConsistPageToCanvas(
  page: ConsistPageLayout,
  consistName: string,
  totalPages: number,
  baker: TextureBaker,
  isBlankTemplate: boolean = false,
  locale: 'zh-CN' | 'en-US' = 'zh-CN'
): HTMLCanvasElement {
  // 300 DPI 下的标准 A4 像素尺寸 (210mm x 297mm)
  const canvasW = 2480
  const canvasH = 3508
  const mmToPx = canvasW / A4_WIDTH_MM // 约 11.8095 px/mm

  const isEn = locale === 'en-US'
  const textCut = isEn ? 'Cut' : '剪切'
  const textMountain = isEn ? 'Mountain' : '山折'
  const textValley = isEn ? 'Valley' : '谷折'

  const canvas = document.createElement('canvas')
  canvas.width = canvasW
  canvas.height = canvasH
  const ctx = canvas.getContext('2d')!

  // 1. 纯白印刷底色
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvasW, canvasH)

  // 2. 页眉标题栏 (中文与英文 100% 原生支持)
  const titleX = 12 * mmToPx
  const titleY = 14 * mmToPx

  const displayTitle = `${consistName} · ${page.pageTitle}`
  const displaySubTitle = `P. ${page.pageIndex + 1} / ${totalPages}`

  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 40px -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif'
  ctx.fillText(displayTitle, titleX, titleY)

  ctx.fillStyle = '#64748b'
  ctx.font = '500 26px -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif'
  ctx.fillText(displaySubTitle, titleX, titleY + 36)

  // 3. 折线与剪切图例说明 (精简克制)
  const legendY = 22 * mmToPx
  ctx.font = '500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'

  // 实线 (剪切)
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 3.5
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(titleX, legendY)
  ctx.lineTo(titleX + 22 * mmToPx, legendY)
  ctx.stroke()
  ctx.fillStyle = '#334155'
  ctx.fillText(textCut, titleX + 25 * mmToPx, legendY + 8)

  // 红色虚线 (山折)
  const mountainX = titleX + (isEn ? 52 : 48) * mmToPx
  ctx.strokeStyle = '#dc2626'
  ctx.lineWidth = 3
  ctx.setLineDash([16, 12])
  ctx.beginPath()
  ctx.moveTo(mountainX, legendY)
  ctx.lineTo(mountainX + 22 * mmToPx, legendY)
  ctx.stroke()
  ctx.fillStyle = '#dc2626'
  ctx.fillText(textMountain, mountainX + 25 * mmToPx, legendY + 8)

  // 蓝色点划线 (谷折)
  const valleyX = mountainX + (isEn ? 62 : 54) * mmToPx
  ctx.strokeStyle = '#0284c7'
  ctx.lineWidth = 3
  ctx.setLineDash([24, 10, 8, 10])
  ctx.beginPath()
  ctx.moveTo(valleyX, legendY)
  ctx.lineTo(valleyX + 22 * mmToPx, legendY)
  ctx.stroke()
  ctx.fillStyle = '#0284c7'
  ctx.fillText(textValley, valleyX + 25 * mmToPx, legendY + 8)

  ctx.setLineDash([]) // 重置虚线

  // 4. 绘制当前页包含的所有零件
  for (const placement of page.placements) {
    const part = placement.part
    const car = placement.car
    const offsetX = placement.x * mmToPx
    const offsetY = placement.y * mmToPx
    const title = placement.displayName || part.name

    // 仅在配件专页居中绘制简短配件名称 (避免在主体车身页上产生多余文字)
    if (page.isAccessoryPage) {
      const partCenterX = offsetX + ((part.bounds.minX || 0) + part.bounds.width / 2) * mmToPx
      const partLabelY = offsetY + ((part.bounds.minY || 0) - 6) * mmToPx
      ctx.fillStyle = '#475569'
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(title, partCenterX, partLabelY)
    }

    for (const face of part.faces) {
      const poly = face.polygon2D.map(p => ({
        x: p.x * mmToPx + offsetX,
        y: p.y * mmToPx + offsetY
      }))

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      for (const p of poly) {
        if (p.x < minX) minX = p.x
        if (p.y < minY) minY = p.y
        if (p.x > maxX) maxX = p.x
        if (p.y > maxY) maxY = p.y
      }

      // 5.1 贴图光栅化填充 或 填色白模线框底色
      const slot = face.textureSlot
      const slotCanvas = slot ? (baker.getSlotCanvas(`${slot}_${car.carType}`) || baker.getSlotCanvas(slot)) : null
      if (!isBlankTemplate && slotCanvas && slot) {
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(poly[0].x, poly[0].y)
        for (let i = 1; i < poly.length; i++) {
          ctx.lineTo(poly[i].x, poly[i].y)
        }
        ctx.closePath()
        ctx.clip()

        const faceW = maxX - minX
        const faceH = maxY - minY
        let sx = 0, sy = 0, sw = slotCanvas.width, sh = slotCanvas.height

        if (face.uvCoords && face.uvCoords.length > 0) {
          let minU = Infinity, minV = Infinity, maxU = -Infinity, maxV = -Infinity
          face.uvCoords.forEach((uv: any) => {
            const u = uv.x !== undefined ? uv.x : uv[0]
            const v = uv.y !== undefined ? uv.y : uv[1]
            if (u < minU) minU = u
            if (v < minV) minV = v
            if (u > maxU) maxU = u
            if (v > maxV) maxV = v
          })

          const du = maxU - minU
          const dv = maxV - minV
          if (du > 0.02 && dv > 0.02) {
            sx = minU * slotCanvas.width
            sy = (1 - maxV) * slotCanvas.height
            sw = du * slotCanvas.width
            sh = dv * slotCanvas.height
          }
        }

        ctx.drawImage(slotCanvas, sx, sy, sw, sh, minX, minY, faceW, faceH)
        ctx.restore()
      } else {
        // 填色模版 / 纯白面：纯白底色 + 精致灰度轮廓
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.moveTo(poly[0].x, poly[0].y)
        for (let i = 1; i < poly.length; i++) {
          ctx.lineTo(poly[i].x, poly[i].y)
        }
        ctx.closePath()
        ctx.fill()

        if (isBlankTemplate) {
          ctx.strokeStyle = '#94a3b8'
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }

      // 5.2 粘合翼 (Tabs)
      for (const tab of face.glueTabs) {
        if (!tab || !tab.p1 || !tab.p2) continue

        const tabPts = generateTabPoints(tab.p1, tab.p2, tab.tabWidth, tab.angle, placement.part.faces)
        if (!tabPts || tabPts.length < 4) continue

        const pts = tabPts.map(p => ({ x: p.x * mmToPx + offsetX, y: p.y * mmToPx + offsetY }))

        ctx.save()
        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].x, pts[i].y)
        }
        ctx.closePath()

        ctx.fillStyle = '#f1f5f9'
        ctx.fill()
        ctx.strokeStyle = '#94a3b8'
        ctx.lineWidth = 2.5
        ctx.stroke()

        // 绘制斜条纹
        ctx.clip()
        ctx.strokeStyle = '#cbd5e1'
        ctx.lineWidth = 2
        for (let sx = -canvasW; sx < canvasW * 2; sx += 14) {
          ctx.beginPath()
          ctx.moveTo(sx, 0)
          ctx.lineTo(sx + canvasH, canvasH)
          ctx.stroke()
        }
        ctx.restore()

        // 绘制标号 A1, B1 等
        if (tab.label) {
          const cx = (pts[1].x + pts[2].x) / 2
          const cy = (pts[1].y + pts[2].y) / 2

          ctx.fillStyle = '#475569'
          ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(tab.label, cx, cy)
        }
      }

      // 5.3 绘制折线与剪切线
      for (const crease of face.creases) {
        if (!crease || !crease.p1 || !crease.p2) continue

        const p1x = crease.p1.x * mmToPx + offsetX
        const p1y = crease.p1.y * mmToPx + offsetY
        const p2x = crease.p2.x * mmToPx + offsetX
        const p2y = crease.p2.y * mmToPx + offsetY

        ctx.beginPath()
        ctx.moveTo(p1x, p1y)
        ctx.lineTo(p2x, p2y)

        if (crease.type === 'mountain') {
          // 山折线：红色虚线
          ctx.strokeStyle = '#ef4444'
          ctx.lineWidth = 2.5
          ctx.setLineDash([8, 8])
          ctx.stroke()
        } else if (crease.type === 'valley') {
          // 谷折线：蓝色虚线
          ctx.strokeStyle = '#3b82f6'
          ctx.lineWidth = 2.5
          ctx.setLineDash([4, 4])
          ctx.stroke()
        } else {
          // 剪切线：深黑实线
          ctx.strokeStyle = '#0f172a'
          ctx.lineWidth = 3
          ctx.setLineDash([])
          ctx.stroke()
        }
      }
    }
  }

  // 6. 页脚页码
  ctx.setLineDash([])
  ctx.fillStyle = '#94a3b8'
  ctx.font = '500 22px -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`Papercraft Studio · P. ${page.pageIndex + 1} / ${totalPages}`, titleX, canvasH - 16 * mmToPx)

  return canvas
}

/**
 * 导出整列火车的完整多页 A4 PDF (支持组装图纸与填色模版)
 */
export async function exportConsistToPdf(options: ExportConsistPdfOptions): Promise<void> {
  const { consistName, cars, baker, isBlankTemplate = false, locale = 'zh-CN' } = options

  const consistPages = packConsistToA4Pages(cars)

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  for (let pIdx = 0; pIdx < consistPages.length; pIdx++) {
    if (pIdx > 0) {
      doc.addPage('a4', 'portrait')
    }

    const page = consistPages[pIdx]
    const canvas = renderConsistPageToCanvas(
      page,
      consistName,
      consistPages.length,
      baker,
      isBlankTemplate,
      locale
    )

    const imgDataUrl = canvas.toDataURL('image/jpeg', 0.95)
    doc.addImage(imgDataUrl, 'JPEG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, 'FAST')
  }

  const isEn = locale === 'en-US'
  const suffix = isBlankTemplate
    ? (isEn ? 'Coloring-Template' : '填色模版')
    : (isEn ? 'Assembly-Sheets' : '全套组装图纸')
  doc.save(`${consistName}-${suffix}.pdf`)
}

/**
 * 导出单页 300 DPI 超清 PNG 图像 (可直接用于 AI 垫图或打印)
 */
export function exportConsistPageToPng(options: {
  page: ConsistPageLayout
  consistName: string
  totalPages: number
  baker: TextureBaker
  isBlankTemplate?: boolean
  locale?: 'zh-CN' | 'en-US'
}): void {
  const { page, consistName, totalPages, baker, isBlankTemplate = false, locale = 'zh-CN' } = options
  const canvas = renderConsistPageToCanvas(page, consistName, totalPages, baker, isBlankTemplate, locale)
  const imgUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  const isEn = locale === 'en-US'
  const suffix = isBlankTemplate
    ? (isEn ? 'Coloring-Template' : '填色模版')
    : (isEn ? 'Sheet' : '图纸')
  link.download = `${consistName}-${page.pageTitle}-${suffix}.png`
  link.href = imgUrl
  link.click()
}
