// 极简纯净车身贴图模版生成器 (Ultra-Clean, Zero-Interference Texture Template)
// 专为 AI (Midjourney / SD / ControlNet / Flux) 与专业设计师设计：
// 100% 纯白极简画布，仅保留精准的 2px 外轮廓黑线与边界框，绝无文字水印、网格杂线或硬编码干扰。

export interface TextureTemplateOptions {
  consistName: string
  category?: 'shinkansen' | 'commuter' | 'steam' | 'retro' | 'all'
  style?: string
  carType?: 'head' | 'middle' | 'tail'
  themeMode?: 'light' | 'dark'
}

/**
 * 绘制单侧车身的纯净外轮廓画布模版 (1024 x 280 px) - 零干扰纯净白底黑框
 */
export function generateSideWireframeCanvas(
  w: number = 1024,
  h: number = 280,
  _isLeft: boolean = true,
  transparentBg: boolean = false
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  // 1. 底色
  if (!transparentBg) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)
  }

  // 2. 仅绘制精准 2px 黑色外框 (零文字、零网格、零辅助线)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.strokeRect(1, 1, w - 2, h - 2)

  return canvas
}

/**
 * 绘制车顶纯净画布模版 (1024 x 280 px) - 零干扰纯白黑框
 */
export function generateRoofWireframeCanvas(
  w: number = 1024,
  h: number = 280
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)

  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.strokeRect(1, 1, w - 2, h - 2)

  return canvas
}

/**
 * 绘制车头/车尾纯净画布模版 (380 x 320 px) - 零干扰纯白黑框
 */
export function generateFrontBackWireframeCanvas(
  w: number = 380,
  h: number = 320,
  _isFront: boolean = true
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)

  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.strokeRect(1, 1, w - 2, h - 2)

  return canvas
}

/**
 * 生成 2048 x 1536 标准 Master Texture Atlas 纯净贴图总谱模版
 * 结构区内 100% 纯白无文字，仅在外侧留白区标注精简尺寸
 */
export function generateMasterTextureAtlasTemplate(options: TextureTemplateOptions): HTMLCanvasElement {
  const { consistName = 'Train' } = options

  const atlasW = 2048
  const atlasH = 1536

  const canvas = document.createElement('canvas')
  canvas.width = atlasW
  canvas.height = atlasH
  const ctx = canvas.getContext('2d')!

  // 1. 纯白极简底色
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, atlasW, atlasH)

  // 2. 顶部极简浅灰标识 (位于留白区，完全不侵入任何贴图区域)
  ctx.fillStyle = '#94a3b8'
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`${consistName} · Master Texture Atlas (2048 × 1536 px)`, 48, 56)

  ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.fillText('Pure Canvas Wireframe · Fill inside boxes and import directly', 48, 84)

  // 3. 辅助外围标签绘制函数 (严格绘制在框体上方或外侧留白处，框内绝无文字)
  const drawOuterLabel = (text: string, x: number, y: number) => {
    ctx.fillStyle = '#64748b'
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(text, x, y - 8)
  }

  // 4. 渲染 5 大分面 (确定性坐标，框内 100% 纯净白色，2px 黑色外框)
  // 左侧壁 (x: 48, y: 140, w: 1024, h: 280)
  drawOuterLabel('▲ 1. LEFT SIDE (1024 × 280 px) - 左侧身', 48, 140)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(48, 140, 1024, 280)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.strokeRect(48, 140, 1024, 280)

  // 右侧壁 (x: 48, y: 460, w: 1024, h: 280)
  drawOuterLabel('▲ 2. RIGHT SIDE (1024 × 280 px) - 右侧身', 48, 460)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(48, 460, 1024, 280)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.strokeRect(48, 460, 1024, 280)

  // 车顶 (x: 48, y: 780, w: 1024, h: 280)
  drawOuterLabel('▲ 3. ROOF (1024 × 280 px) - 车顶', 48, 780)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(48, 780, 1024, 280)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.strokeRect(48, 780, 1024, 280)

  // 车头 (x: 1120, y: 140, w: 380, h: 320)
  drawOuterLabel('▲ 4. FRONT (380 × 320 px) - 车头', 1120, 140)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(1120, 140, 380, 320)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.strokeRect(1120, 140, 380, 320)

  // 车尾 (x: 1548, y: 140, w: 380, h: 320)
  drawOuterLabel('▲ 5. BACK (380 × 320 px) - 车尾', 1548, 140)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(1548, 140, 380, 320)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.strokeRect(1548, 140, 380, 320)

  return canvas
}

/**
 * 一键下载贴图总谱 (2048 x 1536 PNG)
 */
export function exportMasterTextureAtlas(options: TextureTemplateOptions): void {
  const canvas = generateMasterTextureAtlasTemplate(options)
  const imgUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.download = `${options.consistName}-纯净贴图模版-2048x1536.png`
  link.href = imgUrl
  link.click()
}

/**
 * 一键下载单侧身纯净画布模版 (1024 x 280 PNG)
 */
export function exportSingleSideWireframe(options: TextureTemplateOptions & { isLeft?: boolean }): void {
  const { consistName = '列车', isLeft = true } = options
  const canvas = generateSideWireframeCanvas(1024, 280, isLeft, false)
  const imgUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  const sideName = isLeft ? '左侧身' : '右侧身'
  link.download = `${consistName}-${sideName}贴图模版-1024x280.png`
  link.href = imgUrl
  link.click()
}
