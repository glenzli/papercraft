// 纹理烘焙器 (支持通勤电车、新干线高速、大正复古蒸汽全车型真实拟真贴图)
import * as THREE from 'three'
import { TextureTheme, CustomTextConfig, LiveryStyle } from './types'

export interface BakeOptions {
  theme: TextureTheme
  category?: 'commuter' | 'shinkansen' | 'steam' | 'custom' | string
  consistId?: string
  carType?: 'head' | 'middle' | 'tail'
  customColors?: {
    primary: string
    secondary: string
    accent: string
    roof: string
  }
  customText: CustomTextConfig
  useCustomColors?: boolean
}

export class TextureBaker {
  private texture: THREE.CanvasTexture | null = null
  private slotCanvases: Map<string, HTMLCanvasElement> = new Map()
  private static kittyImage: HTMLImageElement | null = null
  private static kittyImageLoading: boolean = false

  constructor(_resolution = 1024) {
    if (typeof window !== 'undefined' && !TextureBaker.kittyImage && !TextureBaker.kittyImageLoading) {
      TextureBaker.kittyImageLoading = true
      const img = new Image()
      img.src = '/textures/hello_kitty_haruka.png'
      img.onload = () => {
        TextureBaker.kittyImage = img
        TextureBaker.kittyImageLoading = false
      }
      img.onerror = () => {
        TextureBaker.kittyImageLoading = false
      }
      TextureBaker.kittyImage = img
    }
  }

  private getKittyImage(): HTMLImageElement | null {
    if (typeof window === 'undefined') return null
    if (!TextureBaker.kittyImage && !TextureBaker.kittyImageLoading) {
      TextureBaker.kittyImageLoading = true
      const img = new Image()
      img.src = '/textures/hello_kitty_haruka.png'
      img.onload = () => {
        TextureBaker.kittyImage = img
        TextureBaker.kittyImageLoading = false
      }
      img.onerror = () => {
        TextureBaker.kittyImageLoading = false
      }
      TextureBaker.kittyImage = img
    }
    return TextureBaker.kittyImage && TextureBaker.kittyImage.complete && TextureBaker.kittyImage.naturalWidth > 0
      ? TextureBaker.kittyImage
      : null
  }

  public getTexture(): THREE.CanvasTexture {
    if (!this.texture) {
      const mainCanvas = this.slotCanvases.get('roof') || document.createElement('canvas')
      this.texture = new THREE.CanvasTexture(mainCanvas)
      this.texture.colorSpace = THREE.SRGBColorSpace
    }
    return this.texture
  }

  public getSlotCanvas(slotName: string): HTMLCanvasElement | null {
    return this.slotCanvases.get(slotName) || null
  }

  public getSlotDataURL(slotName: string): string {
    const canvas = this.slotCanvases.get(slotName)
    if (canvas) {
      return canvas.toDataURL('image/png')
    }
    return ''
  }

  /**
   * 烘焙所有分面的独立高分辨率贴图 (自适应车型、车头、车厢、煤水车)
   */
  public bake(options: BakeOptions): void {
    const { theme, category = 'commuter', consistId, carType = 'head', customColors, customText, useCustomColors } = options

    const primaryColor = useCustomColors && customColors ? customColors.primary : theme.colors.primary
    const secondaryColor = useCustomColors && customColors ? customColors.secondary : theme.colors.secondary
    const accentColor = useCustomColors && customColors ? customColors.accent : theme.colors.accent
    const roofColor = useCustomColors && customColors ? customColors.roof : theme.colors.roof
    const windowColor = theme.colors.window
    const frameColor = theme.colors.frame

    const params = {
      primaryColor,
      secondaryColor,
      accentColor,
      roofColor,
      windowColor,
      frameColor,
      theme,
      category,
      consistId,
      carType,
      customText
    }

    // 1. 3D 专用横向贴图 (为 head / middle / middle_1 / middle_2 / tail 生成独立真实分面贴图)
    for (const r of ['head', 'middle', 'middle_1', 'middle_2', 'tail']) {
      const isMiddle2 = r === 'middle_2'
      const baseRole = r.startsWith('middle') ? 'middle' : r
      const roleParams = { ...params, carType: baseRole, carRole: r, middleVariant: isMiddle2 ? 2 : 1 }
      const leftMaster = this.drawHorizontalSideView(1024, 280, true, roleParams)
      const rightMaster = this.drawHorizontalSideView(1024, 280, false, roleParams)

      this.slotCanvases.set(`side_left_${r}_3d`, leftMaster)
      this.slotCanvases.set(`side_right_${r}_3d`, rightMaster)
      this.slotCanvases.set(`roof_${r}_3d`, this.drawRoofView(280, 1024, roleParams))
      this.slotCanvases.set(`front_${r}_3d`, this.drawFrontView(280, 320, roleParams))
      this.slotCanvases.set(`back_${r}_3d`, this.drawBackView(280, 320, roleParams))
      this.slotCanvases.set(`bottom_${r}_3d`, this.drawBottomView(280, 1024, roleParams))
      this.slotCanvases.set(`ac_unit_${r}_3d`, this.drawAcUnitView(240, 360, roleParams))
      this.slotCanvases.set(`ac_unit_side_${r}_3d`, this.drawAcUnitSideView(240, 60, roleParams))

      // 2D 图纸专用分车型纵向贴图 (严格数学仿射旋转映射自 3D Master 贴图，100% 物理与视觉一致)
      this.slotCanvases.set(`side_left_${r}`, this.rotateAndMapSide(leftMaster, 'left'))
      this.slotCanvases.set(`side_right_${r}`, this.rotateAndMapSide(rightMaster, 'right'))
      this.slotCanvases.set(`roof_${r}`, this.drawRoofView(380, 1600, roleParams))
      this.slotCanvases.set(`front_${r}`, this.drawFrontView(380, 440, roleParams))
      this.slotCanvases.set(`back_${r}`, this.drawBackView(380, 440, roleParams))
      this.slotCanvases.set(`bottom_${r}`, this.drawBottomView(380, 1600, roleParams))
      this.slotCanvases.set(`ac_unit_${r}`, this.drawAcUnitView(240, 360, roleParams))
      this.slotCanvases.set(`ac_unit_side_${r}`, this.drawAcUnitSideView(240, 60, roleParams))
    }

    // 默认回退 3D 贴图
    const defaultLeftMaster = this.drawHorizontalSideView(1024, 280, true, params)
    const defaultRightMaster = this.drawHorizontalSideView(1024, 280, false, params)

    this.slotCanvases.set('side_left_3d', defaultLeftMaster)
    this.slotCanvases.set('side_right_3d', defaultRightMaster)
    this.slotCanvases.set('roof_3d', this.drawRoofView(280, 1024, params))
    this.slotCanvases.set('front_3d', this.drawFrontView(280, 320, params))
    this.slotCanvases.set('back_3d', this.drawBackView(280, 320, params))
    this.slotCanvases.set('bottom_3d', this.drawBottomView(280, 1024, params))
    this.slotCanvases.set('ac_unit_3d', this.drawAcUnitView(240, 360, params))
    this.slotCanvases.set('ac_unit_side_3d', this.drawAcUnitSideView(240, 60, params))

    // 2. 2D 图纸通用回退贴图 (严格数学仿射映射)
    this.slotCanvases.set('side_left', this.rotateAndMapSide(defaultLeftMaster, 'left'))
    this.slotCanvases.set('side_right', this.rotateAndMapSide(defaultRightMaster, 'right'))
    this.slotCanvases.set('roof', this.drawRoofView(380, 1600, params))
    this.slotCanvases.set('front', this.drawFrontView(380, 440, params))
    this.slotCanvases.set('cockpit_front', this.drawCockpitFrontView(380, 360, params))
    this.slotCanvases.set('nose_front', this.drawNoseFrontView(380, 300, params))
    this.slotCanvases.set('nose_chin', this.drawNoseChinView(380, 120, params))
    this.slotCanvases.set('back', this.drawBackView(380, 440, params))
    this.slotCanvases.set('bottom', this.drawBottomView(380, 1600, params))
    this.slotCanvases.set('ac_unit', this.drawAcUnitView(240, 360, params))
    this.slotCanvases.set('ac_unit_side', this.drawAcUnitSideView(240, 60, params))

    // 3. 车厢连接件与铰接风挡专用贴图 (T-Coupler & Bellows Gangway)
    const couplerCanvas2D = this.drawCouplerView(380, 260)
    const couplerCanvas3D = this.drawCouplerView(280, 180)
    const bellowsCanvas2D = this.drawBellowsView(380, 380)
    const bellowsCanvas3D = this.drawBellowsView(280, 280)

    this.slotCanvases.set('coupler', couplerCanvas2D)
    this.slotCanvases.set('coupler_3d', couplerCanvas3D)
    this.slotCanvases.set('bellows', bellowsCanvas2D)
    this.slotCanvases.set('bellows_3d', bellowsCanvas3D)
  }

  /**
   * 应用用户/AI导入的自定义贴图画布，并自动进行 2D 展开图仿射几何变换与槽位绑定
   */
  public applyCustomTextureCanvases(canvases: {
    side_left?: HTMLCanvasElement
    side_right?: HTMLCanvasElement
    roof?: HTMLCanvasElement
    front?: HTMLCanvasElement
    back?: HTMLCanvasElement
  }) {
    this.texture = null

    if (canvases.side_left) {
      this.slotCanvases.set('side_left_3d', canvases.side_left)
      for (const r of ['head', 'middle', 'tail']) {
        this.slotCanvases.set(`side_left_${r}_3d`, canvases.side_left)
        this.slotCanvases.set(`side_left_${r}`, this.rotateAndMapSide(canvases.side_left, 'left'))
      }
      this.slotCanvases.set('side_left', this.rotateAndMapSide(canvases.side_left, 'left'))
    }

    if (canvases.side_right) {
      this.slotCanvases.set('side_right_3d', canvases.side_right)
      for (const r of ['head', 'middle', 'tail']) {
        this.slotCanvases.set(`side_right_${r}_3d`, canvases.side_right)
        this.slotCanvases.set(`side_right_${r}`, this.rotateAndMapSide(canvases.side_right, 'right'))
      }
      this.slotCanvases.set('side_right', this.rotateAndMapSide(canvases.side_right, 'right'))
    }

    if (canvases.roof) {
      this.slotCanvases.set('roof_3d', canvases.roof)
      for (const r of ['head', 'middle', 'tail']) {
        this.slotCanvases.set(`roof_${r}_3d`, canvases.roof)
        this.slotCanvases.set(`roof_${r}`, canvases.roof)
      }
      this.slotCanvases.set('roof', canvases.roof)
    }

    if (canvases.front) {
      this.slotCanvases.set('front_3d', canvases.front)
      for (const r of ['head', 'middle', 'tail']) {
        this.slotCanvases.set(`front_${r}_3d`, canvases.front)
      }
      this.slotCanvases.set('front', canvases.front)
    }

    if (canvases.back) {
      this.slotCanvases.set('back_3d', canvases.back)
      for (const r of ['head', 'middle', 'tail']) {
        this.slotCanvases.set(`back_${r}_3d`, canvases.back)
      }
      this.slotCanvases.set('back', canvases.back)
    }
  }

  /**
   * 严格解析合法涂装风格 (防止非法跨界)
   */
  private resolveLiveryStyle(theme: any, category: string, consistId?: string): LiveryStyle {
    const declaredStyle: LiveryStyle = theme?.liveryStyle || (
      theme?.id === 'doctor-yellow' ? 'shinkansen-doctor-yellow' :
      theme?.id === 'osaka-loop' ? 'commuter-osaka-loop' :
      theme?.id === 'chuo-orange' ? 'commuter-chuo' :
      theme?.id === 'keihin-blue' ? 'commuter-keihin' :
      theme?.id === 'sobu-yellow' ? 'commuter-sobu' :
      theme?.id === 'hankyu-maroon' ? 'commuter-hankyu' :
      theme?.id === 'marunouchi-red' ? 'commuter-marunouchi' :
      theme?.id === 'n700-nozomi' ? 'shinkansen-n700' :
      theme?.id === 'haruka-hellokitty' ? 'shinkansen-haruka-kitty' :
      theme?.id === 'haruka-classic-jr' ? 'shinkansen-haruka-classic' :
      theme?.id === 'haruka-kitty-orizuru' ? 'shinkansen-haruka-orizuru' :
      theme?.id === 'nankai-rapit' ? 'shinkansen-nankai-rapit' :
      theme?.id === 'nankai-rapit-red' ? 'shinkansen-nankai-rapit-red' :
      theme?.id === 'nankai-rapit-peach' ? 'shinkansen-nankai-rapit-peach' :
      theme?.id === 'shinkansen-500-eva' ? 'shinkansen-500-eva' :
      theme?.id === 'bus-71-blue' ? 'bus-shanghai-71' :
      theme?.id === 'bus-london-red' ? 'bus-london-red' :
      theme?.id === 'bus-retro-green' ? 'bus-retro-green' :
      theme?.id === 'bus-eco-green' ? 'bus-eco-cyan' :
      theme?.id === 'bus-articulated-71' ? 'bus-articulated-71' :
      theme?.id === 'bus-articulated-beijing' ? 'bus-articulated-beijing' :
      theme?.id === 'bus-articulated-metro' ? 'bus-articulated-metro' :
      theme?.id === 'bus-double-london-red' ? 'bus-double-london-red' :
      theme?.id === 'bus-double-kmb-gold' ? 'bus-double-kmb-gold' :
      theme?.id === 'bus-double-sightseeing' ? 'bus-double-sightseeing' :
      theme?.id === 'tram-enoden-green' ? 'tram-enoden-green' :
      theme?.id === 'tram-modern-cyan' ? 'tram-modern-cyan' :
      theme?.id === 'tram-melbourne-green' ? 'tram-melbourne-green' :
      theme?.id === 'hk-tram-green' ? 'hk-tram-green' :
      theme?.id === 'hk-tram-retro-red' ? 'hk-tram-retro-red' :
      theme?.id === 'hk-tram-blue-ad' ? 'hk-tram-blue-ad' :
      theme?.id === 'df4b-watermelon' ? 'df4b-watermelon' :
      theme?.id === 'df4b-orange' ? 'df4b-orange' :
      theme?.id === 'df4b-blue' ? 'df4b-blue' :
      theme?.id === 'df4b-jrf-red-thunder' ? 'df4b-jrf-red-thunder' :
      theme?.id === 'df4b-jrf-blue-momotaro' ? 'df4b-jrf-blue-momotaro' :
      theme?.id === 'df4b-bnsf-orange' ? 'df4b-bnsf-orange' :
      theme?.id === 'df4b-sbb-cargo' ? 'df4b-sbb-cargo' :
      category === 'shinkansen' ? 'shinkansen-e5' :
      category === 'steam' ? 'steam-d51-classic' :
      category === 'vehicle' ? 'tram-enoden-green' :
      category === 'bus' ? 'bus-shanghai-71' : 'commuter-yamanote'
    )

    // 0. 特殊车型优先解析 (双层巴士/叮叮车/巨龙/货运机车)
    if (consistId === 'double-decker-bus-consist') {
      if (declaredStyle && declaredStyle.startsWith('bus-double-')) {
        return declaredStyle
      }
      return 'bus-double-london-red'
    }
    if (consistId === 'hk-tram-consist') {
      if (declaredStyle && declaredStyle.startsWith('hk-tram-')) {
        return declaredStyle
      }
      return 'hk-tram-green'
    }
    if (consistId === 'articulated-bus-consist') {
      if (declaredStyle && declaredStyle.startsWith('bus-articulated-')) {
        return declaredStyle
      }
      return 'bus-articulated-71'
    }
    if (consistId === 'df4b-freight-consist') {
      if (declaredStyle && declaredStyle.startsWith('df4b-')) {
        return declaredStyle
      }
      return 'df4b-watermelon'
    }

    if (category === 'bus') {
      if (declaredStyle && declaredStyle.startsWith('bus-')) {
        return declaredStyle
      }
      return 'bus-shanghai-71'
    }

    if (category === 'vehicle') {
      if (declaredStyle && (declaredStyle.startsWith('tram-') || declaredStyle.startsWith('hk-tram-') || declaredStyle.startsWith('bus-'))) {
        return declaredStyle
      }
      return 'tram-enoden-green'
    }

    // 强隔离：如果当前是通勤电车但传入了新干线/蒸汽机车/公交涂装，强制转为通勤电车默认
    if (category === 'commuter') {
      if (declaredStyle.startsWith('df4b-') || declaredStyle.startsWith('tram-') || declaredStyle.startsWith('hk-tram-')) {
        return declaredStyle
      }
      if (declaredStyle.startsWith('shinkansen-') || declaredStyle.startsWith('steam-') || declaredStyle.startsWith('bus-')) {
        return 'commuter-yamanote'
      }
    } else if (category === 'shinkansen') {
      if (declaredStyle.startsWith('commuter-') || declaredStyle.startsWith('steam-') || declaredStyle.startsWith('bus-') || declaredStyle.startsWith('df4b-') || declaredStyle.startsWith('tram-') || declaredStyle.startsWith('hk-tram-')) {
        return 'shinkansen-e5'
      }
    } else if (category === 'steam') {
      if (declaredStyle.startsWith('shinkansen-') || declaredStyle.startsWith('commuter-') || declaredStyle.startsWith('bus-') || declaredStyle.startsWith('df4b-') || declaredStyle.startsWith('tram-') || declaredStyle.startsWith('hk-tram-')) {
        return 'steam-d51-classic'
      }
    }

    return declaredStyle
  }

  /**
   * 绘制 3D 专用的横向侧身贴图
   */
  private drawHorizontalSideView(w: number, h: number, isLeft: boolean, params: any): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    const { primaryColor, secondaryColor, accentColor, roofColor, windowColor, frameColor, theme, category, consistId, customText } = params

    const style = this.resolveLiveryStyle(theme, category, consistId)

    const isMiddle = params.carType === 'middle'

    // ==========================================
    // 0.45 经典双层客车系列 (Double-Decker Bus - 真实双层完整排窗)
    // ==========================================
    if (style.startsWith('bus-double-')) {
      const physL = 135
      const physH = 56
      const physR = 10.5
      const rx = (physR / physL) * w
      const ry = (physR / physH) * h

      if (style === 'bus-double-london-red') {
        // === 🇬🇧 伦敦 Routemaster 经典双层大巴: 伦敦经典深红 (Carmine) ===
        ctx.fillStyle = primaryColor || '#982127'
        ctx.fillRect(0, 0, w, h)
        // 伦敦交通局 Roundel 圆环标志
        ctx.fillStyle = '#1c304a'
        ctx.beginPath()
        ctx.arc(w * 0.15, h * 0.44, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#982127'
        ctx.beginPath()
        ctx.arc(w * 0.15, h * 0.44, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#1c304a'
        ctx.fillRect(w * 0.11, h * 0.43, w * 0.08, 3)
      } else if (style === 'bus-double-kmb-gold') {
        // === 🇭🇰 香港九巴经典「金巴」: 香槟金底色 + 典雅暗红腰带 ===
        ctx.fillStyle = primaryColor || '#d5c7ab'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = secondaryColor || '#802028'
        ctx.fillRect(0, h * 0.40, w, h * 0.08)
        ctx.fillStyle = '#18222d'
        ctx.fillRect(0, h * 0.92, w, h * 0.08)
      } else {
        // === 🌆 都市全景双层观光巴士: 典雅酒红 + 暖金波浪拉花 ===
        ctx.fillStyle = primaryColor || '#8c222c'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = secondaryColor || '#d89c32'
        ctx.beginPath()
        ctx.moveTo(0, h * 0.44)
        ctx.quadraticCurveTo(w * 0.5, h * 0.38, w, h * 0.44)
        ctx.lineTo(w, h * 0.49)
        ctx.quadraticCurveTo(w * 0.5, h * 0.43, 0, h * 0.49)
        ctx.fill()
      }

      // 中层贯通分割腰线 (Upper/Lower Deck Waist Beltline: Y=0.40..0.435)
      ctx.fillStyle = accentColor || '#d49b35'
      ctx.fillRect(0, h * 0.40, w, h * 0.035)

      // 3 轴重载底盘轮对 (前转向轮 + 后部双驱动轴轮)
      const drawWheel = (cx: number) => {
        const cy = h * 0.91
        ctx.fillStyle = '#09090b'
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx * 1.15, ry * 1.15, 0, Math.PI, 0)
        ctx.fill()
        ctx.lineWidth = 1.5
        ctx.strokeStyle = '#27272a'
        ctx.stroke()
        ctx.fillStyle = '#18181b'
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#94a3b8'
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx * 0.65, ry * 0.65, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#1e293b'
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx * 0.52, ry * 0.52, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#f8fafc'
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx * 0.22, ry * 0.22, 0, 0, Math.PI * 2)
        ctx.fill()
      }
      drawWheel(w * 0.18) // 前转向轴
      drawWheel(w * 0.76) // 中驱动轴
      drawWheel(w * 0.88) // 后从动轴

      // ==========================================
      // 🌟 2 楼整排客窗 (Upper Deck: Y=0.08..0.38, 7 扇贯通全景大窗，与车头/车尾高度精准对齐)
      // ==========================================
      const uWinTop = h * 0.08
      const uWinH = h * 0.30
      const uWinCount = 7
      const uWinStep = (w * 0.88) / uWinCount
      for (let i = 0; i < uWinCount; i++) {
        const wx = w * 0.06 + i * uWinStep + 2
        ctx.fillStyle = frameColor || '#334155'
        ctx.beginPath()
        ctx.roundRect(wx - 2, uWinTop - 2, uWinStep - 4, uWinH + 4, 3)
        ctx.fill()
        ctx.fillStyle = windowColor || '#020617'
        ctx.beginPath()
        ctx.roundRect(wx, uWinTop, uWinStep - 8, uWinH, 2)
        ctx.fill()
        // 玻璃高光反光线
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(wx + 2, uWinTop + 3)
        ctx.lineTo(wx + uWinStep - 10, uWinTop + 3)
        ctx.stroke()
      }

      // ==========================================
      // 🌟 1 楼整排客窗与高大落地双开车门 (Lower Deck: Y=0.47..0.77 客窗，车门 Y=0.44..0.91)
      // ==========================================
      const lWinTop = h * 0.47
      const lWinH = h * 0.30
      if (!isLeft) {
        // --- 🚪 右侧 (乘客上下客侧): 前后高大双开门 + 贯通客窗 ---
        const drawDoubleDoor = (dx: number) => {
          const doorTop = h * 0.44
          const doorBottom = h * 0.91
          const doorH = doorBottom - doorTop
          const doorW = w * 0.095

          // 门框外框 (从腰线下一直落地到踏板裙边)
          ctx.fillStyle = frameColor || '#1e293b'
          ctx.fillRect(dx - 1, doorTop, doorW + 2, doorH)

          // 左右两扇活动门扇底色
          const leafW = (doorW - 4) / 2
          ctx.fillStyle = primaryColor || '#982127'
          ctx.fillRect(dx + 1, doorTop + 2, leafW, doorH - 4)
          ctx.fillRect(dx + 3 + leafW, doorTop + 2, leafW, doorH - 4)

          // 门扇上段大幅视窗 (与 1 楼客窗高度严格平行 Y: 0.47..0.76)
          const glassTop = lWinTop
          const glassH = lWinH - 3
          ctx.fillStyle = windowColor || '#020617'
          ctx.fillRect(dx + 3, glassTop, leafW - 4, glassH)
          ctx.fillRect(dx + 5 + leafW, glassTop, leafW - 4, glassH)

          // 门扇下段防踢观察窗 (Y: 0.79..0.87)
          ctx.fillStyle = windowColor || '#020617'
          ctx.fillRect(dx + 3, h * 0.79, leafW - 4, h * 0.08)
          ctx.fillRect(dx + 5 + leafW, h * 0.79, leafW - 4, h * 0.08)

          // 亮黄乘车扶手杆
          ctx.fillStyle = '#facc15'
          ctx.fillRect(dx + leafW * 0.6, glassTop + 10, 2, glassH - 20)
          ctx.fillRect(dx + leafW + 4 + leafW * 0.4, glassTop + 10, 2, glassH - 20)

          // 中间黑色防夹密封胶条
          ctx.fillStyle = '#0f172a'
          ctx.fillRect(dx + leafW + 1, doorTop, 2, doorH)
        }

        drawDoubleDoor(w * 0.06) // 1. 前上客大门

        // 2. 中前段 3 扇客窗
        const midCount = 3
        const midStep = (w * 0.32) / midCount
        for (let i = 0; i < midCount; i++) {
          const wx = w * 0.175 + i * midStep + 2
          ctx.fillStyle = frameColor || '#334155'
          ctx.beginPath()
          ctx.roundRect(wx - 2, lWinTop - 2, midStep - 4, lWinH + 4, 3)
          ctx.fill()
          ctx.fillStyle = windowColor || '#020617'
          ctx.beginPath()
          ctx.roundRect(wx, lWinTop, midStep - 8, lWinH, 2)
          ctx.fill()
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(wx + 2, lWinTop + 3)
          ctx.lineTo(wx + midStep - 10, lWinTop + 3)
          ctx.stroke()
        }

        drawDoubleDoor(w * 0.51) // 3. 中下客大门

        // 4. 后段 3 扇客窗
        const rearCount = 3
        const rearStep = (w * 0.32) / rearCount
        for (let i = 0; i < rearCount; i++) {
          const wx = w * 0.625 + i * rearStep + 2
          ctx.fillStyle = frameColor || '#334155'
          ctx.beginPath()
          ctx.roundRect(wx - 2, lWinTop - 2, rearStep - 4, lWinH + 4, 3)
          ctx.fill()
          ctx.fillStyle = windowColor || '#020617'
          ctx.beginPath()
          ctx.roundRect(wx, lWinTop, rearStep - 8, lWinH, 2)
          ctx.fill()
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(wx + 2, lWinTop + 3)
          ctx.lineTo(wx + rearStep - 10, lWinTop + 3)
          ctx.stroke()
        }
      } else {
        // --- 🪟 左侧 (司机侧): 司机大窗 + 贯通整车的 6 扇连续大客窗 ---
        // 1. 司机侧窗
        ctx.fillStyle = frameColor || '#334155'
        ctx.beginPath()
        ctx.roundRect(w * 0.05, lWinTop - 2, w * 0.10, lWinH + 4, 3)
        ctx.fill()
        ctx.fillStyle = windowColor || '#020617'
        ctx.beginPath()
        ctx.roundRect(w * 0.05 + 2, lWinTop, w * 0.10 - 4, lWinH, 2)
        ctx.fill()

        // 2. 连续 6 扇宽阔客窗 (从前到后完整贯通，覆盖整个 1 楼)
        const lCount = 6
        const lStep = (w * 0.77) / lCount
        for (let i = 0; i < lCount; i++) {
          const wx = w * 0.17 + i * lStep + 2
          ctx.fillStyle = frameColor || '#334155'
          ctx.beginPath()
          ctx.roundRect(wx - 2, lWinTop - 2, lStep - 4, lWinH + 4, 3)
          ctx.fill()
          ctx.fillStyle = windowColor || '#020617'
          ctx.beginPath()
          ctx.roundRect(wx, lWinTop, lStep - 8, lWinH, 2)
          ctx.fill()
          // 玻璃高光反光线
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(wx + 2, lWinTop + 3)
          ctx.lineTo(wx + lStep - 10, lWinTop + 3)
          ctx.stroke()
        }
      }

      return canvas
    }

    // ==========================================
    // 0. 单节与巨龙城市公交系列 (Single & Articulated Bus)
    // ==========================================
    if (category === 'bus') {
      // 1. 各车型独具特色且写实还原的专属底色与拉花架构 (彻底杜绝千篇一律的一半一半)
      if (style === 'bus-london-red') {
        // === 🇬🇧 伦敦经典纯红巴士: 100% 标志性通体正红 + 白顶檐 + 细金腰线 + 官方圆环徽标 ===
        ctx.fillStyle = primaryColor || '#dc2626' // 通体皇家正红
        ctx.fillRect(0, 0, w, h)

        // 车顶白檐 (White Roof Gutter Line)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, w, 4)

        // 窗下金黄腰线 (Gold Belt Line)
        ctx.fillStyle = accentColor || '#fbbf24'
        ctx.fillRect(0, h * 0.52, w, 3)

        // 底部深黑防刮裙边
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(0, h * 0.90, w, h * 0.10)

        // 伦敦交通局标志性圆形徽标 (London Transport Roundel)
        const rx = isLeft ? w * 0.12 : w * 0.38
        const ry = h * 0.68
        // 红色圆环 + 白边
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(rx, ry, 13, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#dc2626'
        ctx.beginPath()
        ctx.arc(rx, ry, 11, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(rx, ry, 7, 0, Math.PI * 2)
        ctx.fill()
        // 跨越圆环的深蓝横条 (Navy Blue Bar)
        ctx.fillStyle = '#0019a8'
        ctx.fillRect(rx - 17, ry - 3.5, 34, 7)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(rx - 15, ry - 1, 30, 2)

      } else if (style === 'bus-shanghai-71') {
        // === 🇨🇳 上海公交 71 路 (申昆路中运量 BRT): 珍珠白上半身 + 水墨科技蓝下半身与尾部动感扬起 + 亮黄流线腰线 ===
        // 上半部珍珠白
        ctx.fillStyle = secondaryColor || '#f8fafc'
        ctx.fillRect(0, 0, w, h)

        // 下半部水墨蓝 (带尾部流线型上扬波浪)
        ctx.fillStyle = primaryColor || '#0055b8'
        ctx.beginPath()
        ctx.moveTo(0, h * 0.48)
        ctx.lineTo(w * 0.62, h * 0.48)
        ctx.quadraticCurveTo(w * 0.80, h * 0.42, w, h * 0.28)
        ctx.lineTo(w, h)
        ctx.lineTo(0, h)
        ctx.closePath()
        ctx.fill()

        // 动感柠檬黄腰线 (Lemon Yellow Dynamic Swoosh)
        ctx.strokeStyle = accentColor || '#fbbf24'
        ctx.lineWidth = 6
        ctx.beginPath()
        ctx.moveTo(0, h * 0.48)
        ctx.lineTo(w * 0.62, h * 0.48)
        ctx.quadraticCurveTo(w * 0.80, h * 0.42, w, h * 0.28)
        ctx.stroke()

        // 底部深灰防护裙边
        ctx.fillStyle = '#1e293b'
        ctx.fillRect(0, h * 0.88, w, h * 0.12)

      } else if (style === 'bus-retro-green') {
        // === 🕰️ 经典复古双拼绿电车: 墨绿下车身 + 象牙奶油白窗框 + 双道黄铜金线 ===
        // 上半部象牙奶油白
        ctx.fillStyle = secondaryColor || '#fef3c7'
        ctx.fillRect(0, 0, w, h * 0.47)

        // 下半部沉稳墨绿
        ctx.fillStyle = primaryColor || '#166534'
        ctx.fillRect(0, h * 0.47, w, h * 0.53)

        // 双道黄铜金线与阴影 (Double Brass Mouldings)
        ctx.fillStyle = accentColor || '#d97706'
        ctx.fillRect(0, h * 0.45, w, 3)
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(0, h * 0.47, w, 1.5)
        ctx.fillStyle = accentColor || '#d97706'
        ctx.fillRect(0, h * 0.49, w, 3)

        // 底部深黑裙边
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(0, h * 0.89, w, h * 0.11)

      } else if (style === 'bus-eco-cyan') {
        // === 🍃 新能源清风绿纯电动客车: 极简纯白底色 + 动感祖母绿与科技青绿叶脉气动风浪 ===
        // 通体纯白/极浅珍珠银
        ctx.fillStyle = primaryColor || '#f1f5f9'
        ctx.fillRect(0, 0, w, h)

        // 祖母绿流线浪花 (Emerald Green Aero Ribbon)
        ctx.fillStyle = '#059669'
        ctx.beginPath()
        ctx.moveTo(w * 0.25, h * 0.88)
        ctx.bezierCurveTo(w * 0.45, h * 0.85, w * 0.60, h * 0.40, w * 0.95, h * 0.15)
        ctx.lineTo(w, h * 0.15)
        ctx.lineTo(w, h * 0.88)
        ctx.closePath()
        ctx.fill()

        // 科技青绿亮光风痕 (Electric Cyan Streamline)
        ctx.strokeStyle = accentColor || '#06b6d4'
        ctx.lineWidth = 7
        ctx.beginPath()
        ctx.moveTo(w * 0.18, h * 0.88)
        ctx.bezierCurveTo(w * 0.40, h * 0.80, w * 0.56, h * 0.46, w * 0.90, h * 0.12)
        ctx.stroke()

        // 纯电环保叶片徽章 (Eco Leaf & Plug Motif)
        ctx.fillStyle = '#059669'
        ctx.beginPath()
        ctx.ellipse(w * 0.10, h * 0.68, 8, 4, -Math.PI / 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#06b6d4'
        ctx.beginPath()
        ctx.ellipse(w * 0.11, h * 0.64, 6, 3, -Math.PI / 3, 0, Math.PI * 2)
        ctx.fill()

        // 底部深灰防护裙边
        ctx.fillStyle = '#1e293b'
        ctx.fillRect(0, h * 0.88, w, h * 0.12)

      } else if (style === 'bus-articulated-beijing') {
        // === 🇨🇳 北京大通道 18米双节巨龙: 怀旧首都经典红白双拼 ===
        ctx.fillStyle = '#fef2f2' // 乳白车顶与上身
        ctx.fillRect(0, 0, w, h * 0.48)
        ctx.fillStyle = primaryColor || '#b91c1c' // 首都红下身
        ctx.fillRect(0, h * 0.48, w, h * 0.52)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, h * 0.48, w, 2.5) // 白色腰线
        ctx.fillStyle = '#1e293b'
        ctx.fillRect(0, h * 0.88, w, h * 0.12)

      } else if (style === 'bus-articulated-metro') {
        // === 🇪🇺 欧洲都市铰接快线: 钛黑灰底色 + 荧光亮橙破风拉花 ===
        ctx.fillStyle = primaryColor || '#1e293b'
        ctx.fillRect(0, 0, w, h)
        // 荧光橙破风动感大条纹
        ctx.fillStyle = accentColor || '#f97316'
        ctx.beginPath()
        ctx.moveTo(0, h * 0.75)
        ctx.lineTo(w * 0.70, h * 0.75)
        ctx.lineTo(w, h * 0.35)
        ctx.lineTo(w, h * 0.42)
        ctx.lineTo(w * 0.68, h * 0.80)
        ctx.lineTo(0, h * 0.80)
        ctx.fill()
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(0, h * 0.90, w, h * 0.10)

      } else {
        // 通用备用
        ctx.fillStyle = primaryColor || '#0055b8'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = secondaryColor || '#ffffff'
        ctx.fillRect(0, 0, w, h * 0.50)
        ctx.fillStyle = accentColor || '#fbbf24'
        ctx.fillRect(0, h * 0.48, w, 6)
        ctx.fillStyle = '#1e293b'
        ctx.fillRect(0, h * 0.88, w, h * 0.12)
      }

      // 2. 真实质感 3D 轮对与轮拱 (根据物理车身长宽比严格计算无畸变正圆)
      const isArticulated = style.startsWith('bus-articulated-')
      const physL = isArticulated ? (params.carType === 'tail' ? 105 : 110) : 150
      const physH = 44
      const physR = 10.5 // 物理车轮半径 (mm)
      const rx = (physR / physL) * w
      const ry = (physR / physH) * h

      const drawWheel = (cx: number) => {
        const cy = h * 0.90

        // 轮拱黑色内衬凹槽 (物理正圆轮罩)
        ctx.fillStyle = '#09090b'
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx * 1.15, ry * 1.15, 0, Math.PI, 0)
        ctx.fill()
        ctx.lineWidth = 2
        ctx.strokeStyle = '#27272a'
        ctx.stroke()

        // 黑色橡胶轮胎 (带粗胎壁质感)
        ctx.fillStyle = '#18181b'
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.lineWidth = 2
        ctx.strokeStyle = '#09090b'
        ctx.stroke()

        // 轮胎凹槽胎纹圈
        ctx.strokeStyle = '#27272a'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx * 0.82, ry * 0.82, 0, 0, Math.PI * 2)
        ctx.stroke()

        // 亮银铝合金轮毂外圈 (Chrome Alloy Rim)
        ctx.fillStyle = '#94a3b8'
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx * 0.65, ry * 0.65, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#cbd5e1'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // 轮毂深色内凹辐条腔 (Hub Spoke Recess)
        ctx.fillStyle = '#1e293b'
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx * 0.52, ry * 0.52, 0, 0, Math.PI * 2)
        ctx.fill()

        // 8 根高光银色合金轮辐 (8 Alloy Spokes)
        ctx.strokeStyle = '#e2e8f0'
        ctx.lineWidth = 2
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          ctx.beginPath()
          ctx.moveTo(cx + Math.cos(a) * (rx * 0.2), cy + Math.sin(a) * (ry * 0.2))
          ctx.lineTo(cx + Math.cos(a) * (rx * 0.52), cy + Math.sin(a) * (ry * 0.52))
          ctx.stroke()
        }

        // 中央轮毂盖与防盗螺栓 (Center Hubcap)
        ctx.fillStyle = '#f8fafc'
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx * 0.22, ry * 0.22, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#0f172a'
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx * 0.08, ry * 0.08, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      if (isArticulated) {
        if (params.carType === 'head') {
          drawWheel(w * 0.24) // 前转向轮
          drawWheel(w * 0.82) // 中驱动轮
        } else {
          drawWheel(w * 0.66) // 挂车后轴轮
        }
      } else {
        drawWheel(w * 0.22) // 前轮
        drawWheel(w * 0.78) // 后轮
      }

      // 3. 门窗系统
      const winTop = h * 0.12
      const winH = h * 0.36

      if (!isLeft) {
        // 右侧：双开前门 (上客门) + 双开中门 (下客门) + 侧窗
        const drawBusDoor = (dx: number) => {
          const doorW = w * 0.09
          const doorH = h * 0.74
          const doorY = h * 0.12

          ctx.fillStyle = frameColor || '#334155'
          ctx.fillRect(dx, doorY, doorW, doorH)

          // 双开门玻璃 (两扇细长玻璃)
          ctx.fillStyle = windowColor || '#020617'
          ctx.fillRect(dx + 3, doorY + 6, doorW / 2 - 5, doorH * 0.55)
          ctx.fillRect(dx + doorW / 2 + 2, doorY + 6, doorW / 2 - 5, doorH * 0.55)

          // 中间防夹胶条
          ctx.fillStyle = '#0f172a'
          ctx.fillRect(dx + doorW / 2 - 1, doorY, 2, doorH)
          // 亮黄扶手
          ctx.fillStyle = '#facc15'
          ctx.fillRect(dx + doorW * 0.2, doorY + doorH * 0.35, 2, doorH * 0.3)
          ctx.fillRect(dx + doorW * 0.7, doorY + doorH * 0.35, 2, doorH * 0.3)
        }

        drawBusDoor(w * 0.08) // 前门 (上客)
        drawBusDoor(w * 0.52) // 中门 (下客)

        // 乘客大窗
        const windowSections = [
          { start: w * 0.20, end: w * 0.50, count: 2 },
          { start: w * 0.63, end: w * 0.94, count: 2 }
        ]
        windowSections.forEach(sec => {
          const step = (sec.end - sec.start) / sec.count
          for (let i = 0; i < sec.count; i++) {
            const wx = sec.start + i * step + 3
            ctx.fillStyle = frameColor || '#334155'
            ctx.beginPath()
            ctx.roundRect(wx - 2, winTop - 2, step - 3, winH + 4, 3)
            ctx.fill()
            ctx.fillStyle = windowColor || '#020617'
            ctx.beginPath()
            ctx.roundRect(wx, winTop, step - 7, winH, 2)
            ctx.fill()
          }
        })
      } else {
        // 左侧：司机大窗 + 4 扇全景连续客窗
        // 司机窗
        ctx.fillStyle = frameColor || '#334155'
        ctx.fillRect(w * 0.06, winTop - 2, w * 0.12, winH + 4)
        ctx.fillStyle = windowColor || '#020617'
        ctx.fillRect(w * 0.06 + 3, winTop, w * 0.12 - 6, winH)

        // 4 扇大客窗
        const startX = w * 0.21
        const endX = w * 0.94
        const winCount = 4
        const step = (endX - startX) / winCount
        for (let i = 0; i < winCount; i++) {
          const wx = startX + i * step + 3
          ctx.fillStyle = frameColor || '#334155'
          ctx.beginPath()
          ctx.roundRect(wx - 2, winTop - 2, step - 4, winH + 4, 3)
          ctx.fill()
          ctx.fillStyle = windowColor || '#020617'
          ctx.beginPath()
          ctx.roundRect(wx, winTop, step - 8, winH, 2)
          ctx.fill()
        }
      }

      // 4. 车身专属 LED 侧牌与运营标识 (仅在用户开启自定义文字时绘制，绝不默认写死/Bake In)
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(w * 0.30, h * 0.03, w * 0.38, h * 0.07)
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 1
      ctx.strokeRect(w * 0.30, h * 0.03, w * 0.38, h * 0.07)

      if (customText && customText.enabled) {
        const routeText = customText.slots?.routeNumber ?? customText.trainNumber ?? ''
        const destText = customText.slots?.destination ?? customText.destination ?? ''
        const opText = customText.slots?.operator ?? customText.kidName ?? ''

        if (routeText || destText) {
          ctx.fillStyle = customText.textColor || '#facc15'
          ctx.font = 'bold 9px monospace'
          ctx.textAlign = 'center'
          ctx.fillText([routeText, destText].filter(Boolean).join('  '), w * 0.49, h * 0.08)
        }

        // 运营公司标牌
        if (opText) {
          ctx.fillStyle = customText.textColor || (primaryColor === '#f8fafc' || primaryColor === '#f1f5f9' ? '#0055b8' : '#ffffff')
          ctx.font = 'bold 11px sans-serif'
          ctx.textAlign = 'left'
          ctx.fillText(opText, w * 0.08, h * 0.65)
        }
      }

      return canvas
    }



    // ==========================================
    // 0.48 香港双层叮叮车系列 (Hong Kong Ding Ding Tram - 窄格木质复古窗)
    // ==========================================
    if (style.startsWith('hk-tram-')) {
      if (style === 'hk-tram-green') {
        // 120 号老电车：沉稳深绿
        ctx.fillStyle = '#1d3e2b'
        ctx.fillRect(0, 0, w, h)
      } else if (style === 'hk-tram-retro-red') {
        // 怀旧红绿双拼 (暗红+墨绿)
        ctx.fillStyle = '#7e2229'
        ctx.fillRect(0, 0, w, h * 0.48)
        ctx.fillStyle = '#1d3e2b'
        ctx.fillRect(0, h * 0.48, w, h * 0.52)
        ctx.fillStyle = '#c89635'
        ctx.fillRect(0, h * 0.48, w, 2.5)
      } else {
        // 维港蓝全车身广告 (沉稳深海蓝)
        ctx.fillStyle = '#294867'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#4f7899'
        ctx.beginPath()
        ctx.moveTo(0, h * 0.40)
        ctx.lineTo(w, h * 0.60)
        ctx.lineTo(w, h * 0.64)
        ctx.lineTo(0, h * 0.44)
        ctx.fill()
      }

      // 2 楼复古窄窗 (Upper Deck: 6 扇紧凑木质推拉窗，留出上下实木护墙板)
      const uTop = h * 0.12
      const uH = h * 0.22
      const uCount = 6
      const uStep = (w * 0.88) / uCount
      for (let i = 0; i < uCount; i++) {
        const wx = w * 0.06 + i * uStep + 2
        // 木质外框
        ctx.fillStyle = '#3d2817'
        ctx.fillRect(wx - 1, uTop - 1, uStep - 3, uH + 2)
        // 玻璃
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(wx + 1, uTop + 1, uStep - 7, uH - 2)
        // 细木横隔与下推拉扇
        ctx.strokeStyle = '#5a3d24'
        ctx.lineWidth = 1
        ctx.strokeRect(wx + 2, uTop + uH * 0.48, uStep - 9, uH * 0.48)
      }

      // 2 楼与 1 楼之间的黄铜/深绿贯通腰线
      ctx.fillStyle = '#c89635'
      ctx.fillRect(0, h * 0.46, w, 2)

      // 1 楼客窗 (Lower Deck: 紧凑客窗，留出宽大的下车裙广告/木饰板)
      const lTop = h * 0.54
      const lH = h * 0.20
      const lCount = 4
      const lStep = (w * 0.56) / lCount
      for (let i = 0; i < lCount; i++) {
        const wx = w * 0.22 + i * lStep + 2
        ctx.fillStyle = '#3d2817'
        ctx.fillRect(wx - 1, lTop - 1, lStep - 3, lH + 2)
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(wx + 1, lTop + 1, lStep - 7, lH - 2)
      }

      // 前端折叠上车门与后端下车旋转栅栏
      ctx.fillStyle = '#111827'
      ctx.fillRect(w * 0.05, lTop - 2, w * 0.12, lH + 16)
      ctx.fillRect(w * 0.83, lTop - 2, w * 0.12, lH + 16)
      ctx.strokeStyle = '#c89635'
      ctx.lineWidth = 1
      ctx.strokeRect(w * 0.05, lTop - 2, w * 0.12, lH + 16)

      // 底部黑色窄轨两轴转向架轮罩
      ctx.fillStyle = '#111827'
      ctx.fillRect(0, h * 0.90, w, h * 0.10)
      ctx.fillStyle = '#334155'
      ctx.fillRect(w * 0.25, h * 0.91, w * 0.15, 5)
      ctx.fillRect(w * 0.60, h * 0.91, w * 0.15, 5)

      return canvas
    }

    // ==========================================
    // 0.5 经典有轨电车与街头轻轨 (Tram & Streetcar)
    // ==========================================
    if (category === 'vehicle' || style.startsWith('tram-')) {
      if (style === 'tram-enoden-green') {
        // === 镰仓江之电 300形: 古松绿下车身 + 温暖奶油黄上身 + 双道黄铜腰线 ===
        ctx.fillStyle = '#faecd2' // 温暖象牙奶油黄
        ctx.fillRect(0, 0, w, h * 0.48)
        ctx.fillStyle = primaryColor || '#1e422d' // 江之电古松绿
        ctx.fillRect(0, h * 0.48, w, h * 0.52)

        // 双道黄铜腰线
        ctx.fillStyle = accentColor || '#b87b28'
        ctx.fillRect(0, h * 0.46, w, 2.5)
        ctx.fillRect(0, h * 0.50, w, 2.5)

        // 底部深黑防泥裙边
        ctx.fillStyle = '#18222d'
        ctx.fillRect(0, h * 0.90, w, h * 0.10)

        // 经典江之电车身徽标 (ENODEN)
        ctx.fillStyle = '#b87b28'
        ctx.beginPath()
        ctx.arc(w * 0.15, h * 0.68, 7, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#1e422d'
        ctx.font = 'bold 7px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('江', w * 0.15, h * 0.71)

      } else if (style === 'tram-modern-cyan') {
        // === 现代低地板流线型轻轨: 极简纯白 + 水色青导流带 ===
        ctx.fillStyle = primaryColor || '#f5f7fa'
        ctx.fillRect(0, 0, w, h)

        // 水色青流线拉花
        ctx.fillStyle = secondaryColor || '#3b6f80'
        ctx.beginPath()
        ctx.moveTo(0, h * 0.70)
        ctx.lineTo(w * 0.85, h * 0.70)
        ctx.lineTo(w, h * 0.40)
        ctx.lineTo(w, h * 0.48)
        ctx.lineTo(w * 0.82, h * 0.75)
        ctx.lineTo(0, h * 0.75)
        ctx.fill()

        ctx.fillStyle = '#18222d'
        ctx.fillRect(0, h * 0.88, w, h * 0.12)

      } else {
        // === 墨尔本 W-Class 绿金电车 ===
        ctx.fillStyle = secondaryColor || '#c49238'
        ctx.fillRect(0, 0, w, h * 0.35)
        ctx.fillStyle = primaryColor || '#1f422e'
        ctx.fillRect(0, h * 0.35, w, h * 0.65)
        ctx.fillStyle = '#d49e3c'
        ctx.fillRect(0, h * 0.35, w, 2.5)
        ctx.fillStyle = '#18222d'
        ctx.fillRect(0, h * 0.90, w, h * 0.10)
      }

      // 电车车窗与车门
      const winTop = h * 0.16
      const winH = h * 0.32
      const winCount = 5
      const winStep = (w * 0.86) / winCount
      for (let i = 0; i < winCount; i++) {
        const wx = w * 0.07 + i * winStep + 2
        ctx.fillStyle = frameColor || '#334155'
        ctx.beginPath()
        ctx.roundRect(wx - 2, winTop - 2, winStep - 4, winH + 4, 3)
        ctx.fill()
        ctx.fillStyle = windowColor || '#020617'
        ctx.beginPath()
        ctx.roundRect(wx, winTop, winStep - 8, winH, 2)
        ctx.fill()
      }

      // 双开乘客折叠门 (两端各一组)
      const drawTramDoor = (dx: number) => {
        ctx.fillStyle = frameColor || '#334155'
        ctx.fillRect(dx, h * 0.14, w * 0.10, h * 0.72)
        ctx.fillStyle = windowColor || '#020617'
        ctx.fillRect(dx + 2, h * 0.18, w * 0.045, h * 0.30)
        ctx.fillRect(dx + w * 0.05 + 1, h * 0.18, w * 0.045, h * 0.30)
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(dx + w * 0.05 - 0.5, h * 0.14, 1.5, h * 0.72)
      }
      drawTramDoor(w * 0.03)
      drawTramDoor(w * 0.87)

      return canvas
    }

    // ==========================================
    // 0.6 铁路重载干线货运列车系列 (DF4B & JRF & BNSF & SBB Freight)
    // ==========================================
    if (style.startsWith('df4b-')) {
      if (params.carType === 'head') {
        // === 机车车身侧面 (重载工业质感) ===
        if (style === 'df4b-watermelon') {
          // 沉稳复古国铁墨绿
          ctx.fillStyle = '#264e36'
          ctx.fillRect(0, 0, w, h)
          // 浅奶黄双贯通腰带
          ctx.fillStyle = '#f4ebd0'
          ctx.fillRect(0, h * 0.48, w, 4)
          ctx.fillRect(0, h * 0.53, w, 4)
        } else if (style === 'df4b-orange') {
          // 柔和赭石暖橙
          ctx.fillStyle = '#b8542b'
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#f1ede4'
          ctx.fillRect(0, h * 0.50, w, 6)
        } else if (style === 'df4b-jrf-red-thunder') {
          // JR Freight EF510 红雷: 典雅栗红 + 银灰闪电折线
          ctx.fillStyle = '#85222b'
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#cbd5e1'
          ctx.beginPath()
          ctx.moveTo(0, h * 0.52)
          ctx.lineTo(w * 0.45, h * 0.52)
          ctx.lineTo(w * 0.52, h * 0.44)
          ctx.lineTo(w * 0.58, h * 0.52)
          ctx.lineTo(w, h * 0.52)
          ctx.lineTo(w, h * 0.56)
          ctx.lineTo(w * 0.59, h * 0.56)
          ctx.lineTo(w * 0.52, h * 0.48)
          ctx.lineTo(w * 0.44, h * 0.56)
          ctx.lineTo(0, h * 0.56)
          ctx.fill()
        } else if (style === 'df4b-jrf-blue-momotaro') {
          // JR Freight EF210 桃太郎: 灰白两分色 + 蔚蓝武士
          ctx.fillStyle = '#94a3b8'
          ctx.fillRect(0, 0, w, h * 0.45)
          ctx.fillStyle = '#1d3557'
          ctx.fillRect(0, h * 0.45, w, h * 0.55)
          ctx.fillStyle = '#f8fafc'
          ctx.fillRect(0, h * 0.44, w, 3.5)
        } else if (style === 'df4b-bnsf-orange') {
          // 北美 BNSF: 经典暖橙 + 墨黑车顶与下车体
          ctx.fillStyle = '#c45a16'
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#18181b'
          ctx.fillRect(0, 0, w, h * 0.18)
          ctx.fillStyle = '#f59e0b'
          ctx.fillRect(0, h * 0.52, w, 5)
        } else if (style === 'df4b-sbb-cargo') {
          // 瑞士 SBB Cargo: 深海湛蓝 + 冰川纯白腰带
          ctx.fillStyle = '#1b355a'
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#f8fafc'
          ctx.fillRect(0, h * 0.48, w, 8)
          ctx.fillStyle = '#dc2626'
          ctx.fillRect(w * 0.44, h * 0.49, 12, 6)
        } else {
          // 沉稳蓝太湖
          ctx.fillStyle = '#1e3d6b'
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#e2e8f0'
          ctx.fillRect(0, h * 0.50, w, 6)
        }

        // 机械室 3 组重型立体百叶散热窗 (宽距通风百叶，干净不杂乱)
        const louverW = w * 0.13
        const louverH = h * 0.28
        for (const lx of [w * 0.26, w * 0.44, w * 0.62]) {
          // 柔和散热片底色
          ctx.fillStyle = '#242f3d'
          ctx.fillRect(lx, h * 0.16, louverW, louverH)
          // 优雅边框
          ctx.strokeStyle = '#4a586a'
          ctx.lineWidth = 1.2
          ctx.strokeRect(lx, h * 0.16, louverW, louverH)
          // 宽距横向百叶片 (节奏明朗，绝不密密麻麻)
          for (let ly = h * 0.20; ly < h * 0.42; ly += 7) {
            ctx.fillStyle = '#1a222c'
            ctx.fillRect(lx + 2, ly, louverW - 4, 1.5)
            ctx.fillStyle = '#56667a'
            ctx.fillRect(lx + 2, ly + 1.5, louverW - 4, 1.5)
          }
        }

        // 驾驶室侧窗 (前后两端驾驶台 + 柔和窗框 + 玻璃反光)
        const drawCabWindow = (wx: number) => {
          ctx.fillStyle = '#162230'
          ctx.fillRect(wx, h * 0.18, w * 0.09, h * 0.26)
          ctx.strokeStyle = '#526173'
          ctx.lineWidth = 1.2
          ctx.strokeRect(wx, h * 0.18, w * 0.09, h * 0.26)
          // 玻璃对角柔和高光
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
          ctx.lineWidth = 1.2
          ctx.beginPath()
          ctx.moveTo(wx + 2, h * 0.40)
          ctx.lineTo(wx + w * 0.07, h * 0.22)
          ctx.stroke()
        }
        drawCabWindow(w * 0.08)
        drawCabWindow(w * 0.83)

        // 机车侧面铜铸车号金属标牌
        ctx.fillStyle = '#b45309'
        ctx.fillRect(w * 0.42, h * 0.62, w * 0.16, 11)
        ctx.strokeStyle = '#78350f'
        ctx.lineWidth = 1
        ctx.strokeRect(w * 0.42, h * 0.62, w * 0.16, 11)
        if (customText && customText.enabled) {
          const trainNo = customText.slots?.trainNumber || customText.trainNumber || ''
          if (trainNo) {
            ctx.fillStyle = '#fef08a'
            ctx.font = 'bold 8px monospace'
            ctx.textAlign = 'center'
            ctx.fillText(trainNo, w * 0.50, h * 0.70)
          }
        }

        // 底部平整底盘、中央燃油箱 (柔和工业深灰，无夸张黑边)
        ctx.fillStyle = '#222b36'
        ctx.fillRect(0, h * 0.82, w, h * 0.18)
        // 燃油箱箱体
        ctx.fillStyle = '#2b3644'
        ctx.fillRect(w * 0.30, h * 0.82, w * 0.40, h * 0.16)
        ctx.strokeStyle = '#435163'
        ctx.lineWidth = 1.2
        ctx.strokeRect(w * 0.30, h * 0.82, w * 0.40, h * 0.16)
        // 油位观察窗
        ctx.fillStyle = '#f59e0b'
        ctx.fillRect(w * 0.48, h * 0.87, 8, 4)

      } else if (params.carType === 'middle') {
        // === 集装箱平车侧面：前后双 20ft 优雅低饱和度集装箱 (宽距 3D 瓦楞，无过度密集黑条) ===
        // 1. 底盘：重型平车钢构大梁
        ctx.fillStyle = '#222b36'
        ctx.fillRect(0, h * 0.80, w, h * 0.20)
        ctx.fillStyle = '#3a4759'
        ctx.fillRect(0, h * 0.80, w, 4)

        // 2. 根据涂装风格与车厢序号匹配柔和低饱和度的集装箱配色 (支持第 2 节与第 3 节平车异色多宝箱搭配)
        const isVariant2 = params.middleVariant === 2 || params.carRole === 'middle_2'

        let box1Spec = { baseColor: '#2b4d70', ribHighlight: '#3c648f', ribShadow: '#1a334d', hasStripe: false, stripeColor: '' }
        let box2Spec = { baseColor: '#2d5438', ribHighlight: '#3d704c', ribShadow: '#1a3523', hasStripe: false, stripeColor: '' }

        if (isVariant2) {
          box1Spec = { baseColor: '#c97f32', ribHighlight: '#e09848', ribShadow: '#8f551c', hasStripe: false, stripeColor: '' }
          box2Spec = { baseColor: '#327ea8', ribHighlight: '#499ac9', ribShadow: '#1e5473', hasStripe: false, stripeColor: '' }
        }

        if (style === 'df4b-orange') {
          if (isVariant2) {
            box1Spec = { baseColor: '#963940', ribHighlight: '#b34b53', ribShadow: '#611f24', hasStripe: false, stripeColor: '' }
            box2Spec = { baseColor: '#eae7df', ribHighlight: '#ffffff', ribShadow: '#c4c0b4', hasStripe: true, stripeColor: '#c97f32' }
          } else {
            box1Spec = { baseColor: '#c97f32', ribHighlight: '#e09848', ribShadow: '#8f551c', hasStripe: false, stripeColor: '' }
            box2Spec = { baseColor: '#2d4b68', ribHighlight: '#3d648a', ribShadow: '#1b3248', hasStripe: false, stripeColor: '' }
          }
        } else if (style === 'df4b-jrf-red-thunder') {
          if (isVariant2) {
            box1Spec = { baseColor: '#d69e2e', ribHighlight: '#ebb644', ribShadow: '#946c1a', hasStripe: true, stripeColor: '#1e3a8a' }
            box2Spec = { baseColor: '#8a3339', ribHighlight: '#a8454c', ribShadow: '#571c21', hasStripe: false, stripeColor: '' }
          } else {
            box1Spec = { baseColor: '#963940', ribHighlight: '#b34b53', ribShadow: '#611f24', hasStripe: true, stripeColor: '#facc15' }
            box2Spec = { baseColor: '#284666', ribHighlight: '#395e87', ribShadow: '#172d44', hasStripe: true, stripeColor: '#ffffff' }
          }
        } else if (style === 'df4b-jrf-blue-momotaro') {
          if (isVariant2) {
            box1Spec = { baseColor: '#284666', ribHighlight: '#395e87', ribShadow: '#172d44', hasStripe: true, stripeColor: '#ffffff' }
            box2Spec = { baseColor: '#963940', ribHighlight: '#b34b53', ribShadow: '#611f24', hasStripe: true, stripeColor: '#facc15' }
          } else {
            box1Spec = { baseColor: '#d69e2e', ribHighlight: '#ebb644', ribShadow: '#946c1a', hasStripe: true, stripeColor: '#1e3a8a' }
            box2Spec = { baseColor: '#8a3339', ribHighlight: '#a8454c', ribShadow: '#571c21', hasStripe: false, stripeColor: '' }
          }
        } else if (style === 'df4b-bnsf-orange') {
          if (isVariant2) {
            box1Spec = { baseColor: '#c97f32', ribHighlight: '#e09848', ribShadow: '#8f551c', hasStripe: false, stripeColor: '' }
            box2Spec = { baseColor: '#2d4b68', ribHighlight: '#3d648a', ribShadow: '#1b3248', hasStripe: true, stripeColor: '#facc15' }
          } else {
            box1Spec = { baseColor: '#cb6323', ribHighlight: '#e57a34', ribShadow: '#8a3f11', hasStripe: true, stripeColor: '#27272a' }
            box2Spec = { baseColor: '#eae7df', ribHighlight: '#ffffff', ribShadow: '#c4c0b4', hasStripe: true, stripeColor: '#d97706' }
          }
        } else if (style === 'df4b-sbb-cargo') {
          if (isVariant2) {
            box1Spec = { baseColor: '#eae7df', ribHighlight: '#ffffff', ribShadow: '#c4c0b4', hasStripe: true, stripeColor: '#244d7d' }
            box2Spec = { baseColor: '#2d5438', ribHighlight: '#3d704c', ribShadow: '#1a3523', hasStripe: false, stripeColor: '' }
          } else {
            box1Spec = { baseColor: '#244d7d', ribHighlight: '#3466a1', ribShadow: '#153254', hasStripe: true, stripeColor: '#dc2626' }
            box2Spec = { baseColor: '#d96427', ribHighlight: '#f07b3d', ribShadow: '#913e12', hasStripe: false, stripeColor: '' }
          }
        } else if (style === 'df4b-blue') {
          if (isVariant2) {
            box1Spec = { baseColor: '#2b4d70', ribHighlight: '#3c648f', ribShadow: '#1a334d', hasStripe: false, stripeColor: '' }
            box2Spec = { baseColor: '#c97f32', ribHighlight: '#e09848', ribShadow: '#8f551c', hasStripe: false, stripeColor: '' }
          } else {
            box1Spec = { baseColor: '#327ea8', ribHighlight: '#499ac9', ribShadow: '#1e5473', hasStripe: false, stripeColor: '' }
            box2Spec = { baseColor: '#aa3d64', ribHighlight: '#c7517d', ribShadow: '#6e223d', hasStripe: false, stripeColor: '' }
          }
        }

        // 3. 极简工业集装箱渲染函数 (宽距 3D 瓦楞立体条纹 + 柔和转锁，默认完全无文字)
        const drawRenderContainer = (bx: number, bw: number, spec: typeof box1Spec, customSlotText: string) => {
          const by = h * 0.10
          const bh = h * 0.70

          // 箱体底色
          ctx.fillStyle = spec.baseColor
          ctx.fillRect(bx, by, bw, bh)

          // 宽距 3D 瓦楞立筋 (14px 宽间距，比例协调，不显繁琐)
          for (let x = bx + 10; x < bx + bw - 10; x += 14) {
            ctx.fillStyle = spec.ribShadow
            ctx.fillRect(x, by + 4, 2, bh - 8)
            ctx.fillStyle = spec.ribHighlight
            ctx.fillRect(x + 2, by + 4, 2, bh - 8)
          }

          // 装饰条纹 (若有)
          if (spec.hasStripe && spec.stripeColor) {
            ctx.fillStyle = spec.stripeColor
            ctx.fillRect(bx + 4, by + bh * 0.48, bw - 8, 4)
          }

          // 四角 ISO 铸钢角件 (柔和灰底)
          const drawCorner = (cx: number, cy: number) => {
            ctx.fillStyle = '#26303d'
            ctx.fillRect(cx, cy, 6, 6)
            ctx.fillStyle = '#526378'
            ctx.beginPath()
            ctx.arc(cx + 3, cy + 3, 1.5, 0, Math.PI * 2)
            ctx.fill()
          }
          drawCorner(bx, by)
          drawCorner(bx + bw - 6, by)
          drawCorner(bx, by + bh - 6)
          drawCorner(bx + bw - 6, by + bh - 6)

          // 仅在用户主动输入自定义文字时才在中央显示
          if (customSlotText) {
            ctx.fillStyle = '#ffffff'
            ctx.font = 'bold 10px sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText(customSlotText, bx + bw * 0.5, by + bh * 0.53)
          }

          // 平车底梁红色防脱转锁 (Twistlocks)
          ctx.fillStyle = '#dc2626'
          ctx.fillRect(bx + 1, by + bh, 5, 4)
          ctx.fillRect(bx + bw - 6, by + bh, 5, 4)
        }

        const customText1 = customText && customText.enabled ? (customText.slots?.operator || customText.trainNumber || '') : ''
        const customText2 = customText && customText.enabled ? (customText.slots?.destination || customText.destination || '') : ''

        drawRenderContainer(w * 0.02, w * 0.46, box1Spec, customText1)
        drawRenderContainer(w * 0.52, w * 0.46, box2Spec, customText2)

      } else {
        // === 散货煤炭敞车侧面 (C70 Gondola / 柔和工业钢灰 + 宽距工字加强柱) ===
        ctx.fillStyle = '#2d3540'
        ctx.fillRect(0, h * 0.18, w, h * 0.82)

        // 6 根宽距 C70 冲压外加强筋立柱 (比例舒适，不再过细密)
        for (let x = w * 0.08; x < w * 0.92; x += w * 0.16) {
          // 暗阴影
          ctx.fillStyle = '#1e242c'
          ctx.fillRect(x, h * 0.18, 2, h * 0.64)
          // 主柱
          ctx.fillStyle = '#3c4755'
          ctx.fillRect(x + 2, h * 0.18, 4, h * 0.64)
          // 高光边
          ctx.fillStyle = '#556578'
          ctx.fillRect(x + 6, h * 0.18, 2, h * 0.64)
        }

        // 中央对开中门接缝与闭锁手柄
        ctx.fillStyle = '#192028'
        ctx.fillRect(w * 0.5 - 1, h * 0.22, 2, h * 0.58)
        ctx.fillStyle = '#94a3b8'
        ctx.fillRect(w * 0.48, h * 0.48, 12, 3)

        // 下沿高反光安全贴片 (Conspicuity Reflectors)
        ctx.fillStyle = '#facc15'
        for (let rx = w * 0.08; rx < w * 0.92; rx += w * 0.16) {
          ctx.fillRect(rx, h * 0.78, 6, 2.5)
        }

        // 顶部高密度原煤堆与立体阴影轮廓
        ctx.fillStyle = '#171c23'
        ctx.beginPath()
        ctx.moveTo(0, h * 0.18)
        ctx.quadraticCurveTo(w * 0.25, h * 0.08, w * 0.5, h * 0.18)
        ctx.quadraticCurveTo(w * 0.75, h * 0.08, w, h * 0.18)
        ctx.fill()
        // 碎煤颗粒反光点
        ctx.fillStyle = '#262d36'
        for (let qx = 8; qx < w - 8; qx += 12) {
          ctx.fillRect(qx, h * 0.13 + (qx % 5), 3, 2)
        }

        // 仅在用户开启自定义文字时渲染车号
        if (customText && customText.enabled) {
          const trainNo = customText.slots?.trainNumber || customText.trainNumber || ''
          if (trainNo) {
            ctx.fillStyle = '#fef08a'
            ctx.font = 'bold 7px monospace'
            ctx.textAlign = 'left'
            ctx.fillText(trainNo, w * 0.12, h * 0.65)
          }
        }
      }

      return canvas
    }

    // ==========================================
    // 1. 新干线系列 (Shinkansen)
    // ==========================================
    if (category === 'shinkansen') {
      if (style === 'shinkansen-doctor-yellow') {
        // === 923形 黄医生: 通体纯黄底色 + 窗下深海蓝经典腰线 ===
        ctx.fillStyle = '#facc15' // 通体鲜亮柠檬黄
        ctx.fillRect(0, 0, w, h)

        // 窗下深海蓝腰线 (从头至尾贯穿全长)
        const stripeY = h * 0.48
        ctx.fillStyle = '#1e3a8a' // 东海道深海蓝
        ctx.fillRect(0, stripeY, w, 10)
        ctx.fillStyle = '#3b82f6' // 细高光条
        ctx.fillRect(0, stripeY + 2, w, 2)

        // 底部深灰导流裙板
        ctx.fillStyle = '#334155'
        ctx.fillRect(0, h * 0.85, w, h * 0.15)

      } else if (style === 'shinkansen-n700') {
        // === N700S 希望号: 通体高雅珍珠白 + 窗下东海道双蓝腰线 ===
        ctx.fillStyle = '#f8fafc' // 珍珠白
        ctx.fillRect(0, 0, w, h)

        // 窗下双蓝线 (主蓝带 + 细副带)
        const stripeY = h * 0.48
        ctx.fillStyle = '#1d4ed8'
        ctx.fillRect(0, stripeY, w, 8)
        ctx.fillRect(0, stripeY + 11, w, 3)

        // 先头车侧身 "Supreme" 金蓝徽标
        if (!isMiddle) {
          ctx.fillStyle = '#d97706'
          ctx.font = 'bold 11px sans-serif'
          ctx.fillText('Supreme', w * 0.08, h * 0.70)
        }

      } else if (style === 'shinkansen-haruka-kitty') {
        // === 关空特急 Haruka Hello Kitty 和风樱花专列 (纯白车身 + 自然散落粉樱 + 官方和服立绘，无文字) ===
        ctx.fillStyle = '#ffffff' // 100% 通体高雅纯白
        ctx.fillRect(0, 0, w, h)

        // 底部极细深海蓝腰线
        ctx.fillStyle = '#1e3a8a'
        ctx.fillRect(0, h * 0.81, w, 5)

        // 真实还原官方蓝图：一簇簇深浅交织的多色和风樱花 (绀蓝、茜红、樱粉、粉白) 与窗下波浪花浪
        this.drawHarukaFullSakuraLivery(ctx, w, h, isLeft, isMiddle)

        // 在车头专属开阔区绘制 Hello Kitty 官方插画 (参考官方真车蓝图排布，两侧均朝向前鼻)
        if (isMiddle) {
          this.drawHelloKittyIllustration(ctx, w * 0.20, h * 0.44, 1.55, !isLeft)
        } else {
          this.drawHelloKittyIllustration(ctx, w * 0.16, h * 0.44, 1.55, !isLeft)
        }

        // 浅灰底盘
        ctx.fillStyle = '#334155'
        ctx.fillRect(0, h * 0.84, w, h * 0.16)

      } else if (style === 'shinkansen-haruka-classic') {
        // === 关空特急 Haruka 281系 JR西日本原厂经典纯白蓝带涂装 (无文字) ===
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, w, h)

        // 窗下与底部极细JR西日本海蓝腰线
        ctx.fillStyle = '#0284c7'
        ctx.fillRect(0, h * 0.81, w, 5)
        ctx.fillStyle = '#1e3a8a'
        ctx.fillRect(0, h * 0.81 + 5, w, 2)

        // 浅灰底盘
        ctx.fillStyle = '#334155'
        ctx.fillRect(0, h * 0.84, w, h * 0.16)

      } else if (style === 'shinkansen-haruka-orizuru') {
        // === 关空特急 Haruka Hello Kitty 织鹤和风限定 (无文字) ===
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, w, h)

        // 底部金色祥瑞饰线
        ctx.fillStyle = '#d97706'
        ctx.fillRect(0, h * 0.81, w, 5)

        // 自然散落分布的多色金粉樱花簇
        this.drawHarukaFullSakuraLivery(ctx, w, h, isLeft, isMiddle)

        if (isMiddle) {
          this.drawHelloKittyIllustration(ctx, w * 0.20, h * 0.44, 1.55, !isLeft)
        } else {
          this.drawHelloKittyIllustration(ctx, w * 0.16, h * 0.44, 1.55, !isLeft)
        }

        // 浅灰底盘
        ctx.fillStyle = '#334155'
        ctx.fillRect(0, h * 0.84, w, h * 0.16)

      } else if (style.startsWith('shinkansen-nankai-rapit')) {
        // === 南海电铁 50000系 特急 Rapi:t 系列 (午夜深蓝 / 赤色彗星 / 乐桃粉白) ===
        if (style === 'shinkansen-nankai-rapit-red') {
          // 高达 UC 赤色彗星限定
          ctx.fillStyle = '#991b1b'
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#eab308'
          ctx.fillRect(0, h * 0.50, w, 4)
          ctx.fillStyle = '#450a0a'
          ctx.fillRect(0, h * 0.84, w, h * 0.16)
        } else if (style === 'shinkansen-nankai-rapit-peach') {
          // Peach 乐桃航空粉白限定
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#db2777'
          ctx.fillRect(0, h * 0.50, w, 6)
          ctx.fillStyle = '#f472b6'
          ctx.fillRect(0, h * 0.84, w, h * 0.16)
        } else {
          // 经典纯正金属午夜深蓝
          ctx.fillStyle = '#0f2b5c'
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#090e17'
          ctx.fillRect(0, h * 0.84, w, h * 0.16)
        }

      } else if (style === 'shinkansen-500-eva') {
        // 500系 初号机
        ctx.fillStyle = '#581c87'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#22c55e'
        ctx.fillRect(0, h * 0.52, w, 8)
        ctx.fillStyle = '#f97316'
        ctx.fillRect(0, h * 0.52 + 10, w, 4)

      } else if (style === 'shinkansen-e6') {
        // === E6系 小町号 (3D 写实双色：上身茜红 + 金黄细腰线 + 下身飞云白) ===
        ctx.fillStyle = '#dc2626' // 上身宝石茜红
        ctx.fillRect(0, 0, w, h * 0.48)

        ctx.fillStyle = '#f59e0b' // 金黄饰带
        ctx.fillRect(0, h * 0.48, w, 6)

        ctx.fillStyle = '#f8fafc' // 下身飞云白
        ctx.fillRect(0, h * 0.48 + 6, w, h * 0.36 - 6)

        ctx.fillStyle = '#334155' // 底部深灰导流裙板
        ctx.fillRect(0, h * 0.84, w, h * 0.16)

      } else if (style === 'shinkansen-e7') {
        // === E7系 辉号 (3D 写实双色：上身天青蓝 + 铜金腰线 + 下身象牙白) ===
        ctx.fillStyle = '#0284c7'
        ctx.fillRect(0, 0, w, h * 0.48)

        ctx.fillStyle = '#d97706'
        ctx.fillRect(0, h * 0.48, w, 6)

        ctx.fillStyle = '#f8fafc'
        ctx.fillRect(0, h * 0.48 + 6, w, h * 0.36 - 6)

        ctx.fillStyle = '#334155'
        ctx.fillRect(0, h * 0.84, w, h * 0.16)

      } else if (style === 'cr400-fuxing-red') {
        // === 🇨🇳 CR400AF 复兴号「红神龙」: 科技银灰 + 动感中国红飘带 + 黑色前脸环绕 ===
        ctx.fillStyle = '#cbd5e1' // 科技银灰底漆
        ctx.fillRect(0, 0, w, h)

        if (isMiddle) {
          // 中间客车：贯通全长的平直中国红动感腰带
          ctx.fillStyle = '#dc2626'
          ctx.fillRect(0, h * 0.58, w, h * 0.07)
          ctx.fillStyle = '#991b1b'
          ctx.fillRect(0, h * 0.65, w, 3)
        } else {
          // 先头车 / 尾车：动感中国红飘带向车头流线鼻锥下潜
          ctx.fillStyle = '#dc2626'
          ctx.beginPath()
          ctx.moveTo(0, h * 0.72)
          ctx.lineTo(w * 0.25, h * 0.58)
          ctx.lineTo(w, h * 0.58)
          ctx.lineTo(w, h * 0.65)
          ctx.lineTo(w * 0.25, h * 0.65)
          ctx.lineTo(0, h * 0.82)
          ctx.closePath()
          ctx.fill()

          // 深红边缘细线
          ctx.fillStyle = '#991b1b'
          ctx.beginPath()
          ctx.moveTo(0, h * 0.82)
          ctx.lineTo(w * 0.25, h * 0.65)
          ctx.lineTo(w, h * 0.65)
          ctx.lineTo(w, h * 0.65 + 3)
          ctx.lineTo(w * 0.25, h * 0.65 + 3)
          ctx.lineTo(0, h * 0.82 + 3)
          ctx.closePath()
          ctx.fill()
        }

        // 底部深黑灰导流裙板
        ctx.fillStyle = '#1e293b'
        ctx.fillRect(0, h * 0.84, w, h * 0.16)

      } else if (style === 'cr400-fuxing-gold') {
        // === 🇨🇳 CR400BF 复兴号「金凤凰」: 象牙白 + 金黄飞翼飘带 ===
        ctx.fillStyle = '#f8fafc' // 象牙白
        ctx.fillRect(0, 0, w, h)

        if (isMiddle) {
          // 中间客车：贯通全长的平直金凤凰腰带
          ctx.fillStyle = '#d97706'
          ctx.fillRect(0, h * 0.58, w, h * 0.07)
          ctx.fillStyle = '#b45309'
          ctx.fillRect(0, h * 0.65, w, 2.5)
        } else {
          // 先头车 / 尾车：金黄飞翼色带向车头流线鼻锥下潜
          ctx.fillStyle = '#d97706'
          ctx.beginPath()
          ctx.moveTo(0, h * 0.74)
          ctx.lineTo(w * 0.28, h * 0.58)
          ctx.lineTo(w, h * 0.58)
          ctx.lineTo(w, h * 0.65)
          ctx.lineTo(w * 0.28, h * 0.65)
          ctx.lineTo(0, h * 0.82)
          ctx.closePath()
          ctx.fill()

          ctx.fillStyle = '#b45309'
          ctx.beginPath()
          ctx.moveTo(0, h * 0.82)
          ctx.lineTo(w * 0.28, h * 0.65)
          ctx.lineTo(w, h * 0.65)
          ctx.lineTo(w, h * 0.65 + 2.5)
          ctx.lineTo(w * 0.28, h * 0.65 + 2.5)
          ctx.lineTo(0, h * 0.82 + 2.5)
          ctx.closePath()
          ctx.fill()
        }

        ctx.fillStyle = '#1e293b'
        ctx.fillRect(0, h * 0.84, w, h * 0.16)

      } else if (style === 'crh380a-hexie') {
        // === 🇨🇳 CRH380A 和谐号: 纯白 + 科技海蓝双飞翼 ===
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, w, h)

        // 科技海蓝主带与细副带
        ctx.fillStyle = '#0284c7'
        ctx.fillRect(0, h * 0.56, w, 8)
        ctx.fillStyle = '#0369a1'
        ctx.fillRect(0, h * 0.60, w, 3)

        ctx.fillStyle = '#1e293b'
        ctx.fillRect(0, h * 0.84, w, h * 0.16)

      } else if (style === 'crh2-hexie-classic') {
        // === 🇨🇳 CRH2 和谐号: 纯白 + 经典深蓝单宽带 ===
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, w, h)

        ctx.fillStyle = '#1e3a8a'
        ctx.fillRect(0, h * 0.56, w, 12)

        ctx.fillStyle = '#1e293b'
        ctx.fillRect(0, h * 0.84, w, h * 0.16)

      } else if (style === 'shinkansen-300-nozomi') {
        // === 🚆 新干线 300系 (白银希望号): 珍珠白 + 东海道双蓝腰线 ===
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, w, h)

        // 东海道双蓝腰线
        ctx.fillStyle = '#1e3a8a'
        ctx.fillRect(0, h * 0.56, w, 8)
        ctx.fillRect(0, h * 0.63, w, 3)

        ctx.fillStyle = '#334155'
        ctx.fillRect(0, h * 0.84, w, h * 0.16)

      } else if (style === 'shinkansen-0-classic') {
        // === 🚆 新干线 0系 (传奇子弹头): 乳白 + 蓝裙板 ===
        ctx.fillStyle = '#f8fafc'
        ctx.fillRect(0, 0, w, h)

        // 经典深蓝下裙
        ctx.fillStyle = '#1e3a8a'
        ctx.fillRect(0, h * 0.64, w, h * 0.36)

        ctx.fillStyle = '#0f172a'
        ctx.fillRect(0, h * 0.84, w, h * 0.16)

      } else if (style === 'shinkansen-e3-komachi') {
        // === 🚆 新干线 E3系 (秋田小町号): 银白 + 小町粉紫 ===
        ctx.fillStyle = '#475569' // 灰银顶
        ctx.fillRect(0, 0, w, h * 0.16)

        ctx.fillStyle = '#f1f5f9' // 珍珠银白
        ctx.fillRect(0, h * 0.16, w, h * 0.68)

        ctx.fillStyle = '#db2777' // 小町粉紫
        ctx.fillRect(0, h * 0.56, w, 8)

        ctx.fillStyle = '#334155'
        ctx.fillRect(0, h * 0.84, w, h * 0.16)

      } else if (style === 'shinkansen-683-thunderbird') {
        // === 🚆 683系 特急雷鸟号: 纯白 + 墨黑全景窗带 + 湖蓝细线 ===
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, w, h)

        ctx.fillStyle = '#0284c7' // 湖蓝细带
        ctx.fillRect(0, h * 0.48, w, 4)

        ctx.fillStyle = '#334155'
        ctx.fillRect(0, h * 0.84, w, h * 0.16)

      } else if (style === 'romancecar-gse-red') {
        // === 🏔️ 小田急 GSE (玫瑰朱红): Vermillion Red + 深灰全景车顶 + 金色腰线 ===
        ctx.fillStyle = '#e11d48' // 玫瑰朱红 (Rose Vermillion)
        ctx.fillRect(0, 0, w, h)

        ctx.fillStyle = '#1e293b' // 深灰全景车顶
        ctx.fillRect(0, 0, w, h * 0.16)

        ctx.fillStyle = '#d97706' // 金色细腰线
        ctx.fillRect(0, h * 0.72, w, 4)

        ctx.fillStyle = '#0f172a'
        ctx.fillRect(0, h * 0.84, w, h * 0.16)

      } else if (style === 'romancecar-vse-white') {
        // === 🏔️ 小田急 VSE (珍珠纯白): 珍珠白 + 橙金细双线 ===
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, w, h)

        ctx.fillStyle = '#ea580c' // 橙色主带
        ctx.fillRect(0, h * 0.70, w, 4)
        ctx.fillStyle = '#d97706' // 金色细副带
        ctx.fillRect(0, h * 0.75, w, 2.5)

        ctx.fillStyle = '#0f172a'
        ctx.fillRect(0, h * 0.84, w, h * 0.16)

      } else {
        // 默认双色流线
        ctx.fillStyle = secondaryColor
        ctx.fillRect(0, 0, w, h * 0.52)
        ctx.fillStyle = accentColor
        ctx.fillRect(0, h * 0.52, w, 6)
        ctx.fillStyle = primaryColor
        ctx.fillRect(0, h * 0.52 + 6, w, h * 0.32 - 6)
        ctx.fillStyle = '#334155'
        ctx.fillRect(0, h * 0.84, w, h * 0.16)
      }

      // ------------------------------------------
      // 新干线通用及专属门窗绘制
      // ------------------------------------------
      const winTop = h * 0.20
      const winH = h * 0.22
      const winW = w * 0.065
      const isRapit = style.startsWith('shinkansen-nankai-rapit')
      const isHaruka = style.startsWith('shinkansen-haruka-')
      const isCR400 = style.startsWith('cr400-') || style.startsWith('crh')
      const isRomancecar = style.startsWith('romancecar-')
      const isShinkansen300 = style === 'shinkansen-300-nozomi' || style === 'shinkansen-0-classic' || style === 'shinkansen-e3-komachi' || style === 'shinkansen-683-thunderbird'

      if (isRapit) {
        // === 南海特急 Rapi:t 专属正圆形飞机舷窗 (金属密封框 + 铆钉) ===
        const r = h * 0.14
        const cy = h * 0.36

        const drawRapitPorthole = (cx: number, cy: number, r: number) => {
          ctx.fillStyle = '#64748b'
          ctx.beginPath()
          ctx.arc(cx, cy, r + 3.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#020617'
          ctx.beginPath()
          ctx.arc(cx, cy, r, 0, Math.PI * 2)
          ctx.fill()
        }

        const drawRapitDoor = (dx: number) => {
          const doorW = w * 0.075
          const doorH = h * 0.68
          const doorY = h * 0.16
          ctx.fillStyle = '#0b1d3a'
          ctx.fillRect(dx, doorY, doorW, doorH)
          ctx.fillStyle = '#64748b'
          ctx.lineWidth = 1.5
          ctx.strokeRect(dx, doorY, doorW, doorH)
          drawRapitPorthole(dx + doorW * 0.5, doorY + doorH * 0.32, r * 0.7)
        }

        if (isMiddle) {
          drawRapitDoor(w * 0.035)
          drawRapitDoor(w * 0.89)
          const cabinStartX = w * 0.16
          const step = w * 0.116
          for (let i = 0; i < 6; i++) {
            drawRapitPorthole(cabinStartX + i * step, cy, r)
          }
        } else {
          // 先头车 / 尾车：车头斜面鼻锥 (x < 0.24) 无窗保持流线金属质感，客舱 5 扇正圆大舷窗置于平直车身，车尾 1 扇门
          const doorX = w * 0.89
          drawRapitDoor(doorX)
          const cabinStartX = w * 0.26
          const step = w * 0.125
          for (let i = 0; i < 5; i++) {
            const cx = cabinStartX + i * step
            drawRapitPorthole(cx, cy, r)
          }
        }
      } else if (isHaruka) {
        // === 关空特急 281系 Haruka 专属真实蓝图门窗布局 ===
        const doorW = w * 0.068
        const doorH = h * 0.68
        const doorY = h * 0.16
        const winTop = h * 0.20
        const winH = h * 0.22

        const drawHarukaDoor = (dx: number) => {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(dx, doorY, doorW, doorH)
          ctx.fillStyle = '#cbd5e1'
          ctx.fillRect(dx + 2, doorY + 2, doorW - 4, doorH - 4)
          ctx.fillStyle = '#0f172a'
          ctx.fillRect(dx + doorW * 0.5 - 1, doorY + 2, 2, doorH - 4)
          const winW = (doorW - 8) / 2
          const winH2 = doorH * 0.35
          ctx.fillStyle = '#020617'
          ctx.fillRect(dx + 3, doorY + 6, winW, winH2)
          ctx.fillRect(dx + doorW * 0.5 + 1, doorY + 6, winW, winH2)
        }

        if (isMiddle) {
          drawHarukaDoor(w * 0.035)
          drawHarukaDoor(w * 0.89)
          const cabinStartX = w * 0.14
          const cabinEndX = w * 0.86
          const winCount = 7
          const step = (cabinEndX - cabinStartX) / winCount
          for (let i = 0; i < winCount; i++) {
            const wx = cabinStartX + i * step + 4
            ctx.fillStyle = '#020617'
            ctx.beginPath()
            ctx.roundRect(wx, winTop, step - 8, winH, [4, 4, 0, 0])
            ctx.fill()
          }
        } else {
          // 先头车 / 尾车：车头斜面与展示区 (x < 0.28) 无窗（留给和风樱花与Hello Kitty盛大展示），客舱窗自平直车身起连续排布，车尾乘降门
          drawHarukaDoor(w * 0.90)

          const cabinStartX = w * 0.28
          const cabinEndX = w * 0.86
          const winCount = 5
          const step = (cabinEndX - cabinStartX) / winCount
          for (let i = 0; i < winCount; i++) {
            const wx = cabinStartX + i * step + 4
            ctx.fillStyle = '#020617'
            ctx.beginPath()
            ctx.roundRect(wx, winTop, step - 8, winH, [4, 4, 0, 0])
            ctx.fill()
          }
        }

      } else if (isRomancecar) {
        // === 🏔️ 小田急 GSE 70000形 专属全景展望门窗布局 ===
        const doorW = w * 0.060
        const doorH = h * 0.68
        const doorY = h * 0.16

        const drawGSEDoor = (dx: number) => {
          ctx.fillStyle = '#e11d48'
          ctx.fillRect(dx, doorY, doorW, doorH)
          ctx.fillStyle = '#1e293b'
          ctx.lineWidth = 1.5
          ctx.strokeRect(dx, doorY, doorW, doorH)
          ctx.fillStyle = '#020617'
          ctx.fillRect(dx + 3, doorY + 6, doorW - 6, doorH * 0.35)
        }

        if (isMiddle) {
          drawGSEDoor(w * 0.035)
          drawGSEDoor(w * 0.90)
          const cabinStartX = w * 0.13
          const cabinEndX = w * 0.87
          const winCount = 6
          const step = (cabinEndX - cabinStartX) / winCount
          for (let i = 0; i < winCount; i++) {
            const wx = cabinStartX + i * step + 4
            ctx.fillStyle = '#020617'
            ctx.beginPath()
            ctx.roundRect(wx, winTop, step - 8, winH * 1.3, 4)
            ctx.fill()
          }
        } else {
          // 先头车 / 尾车：车头斜面鼻锥 (x < 0.24) 无窗保持朱红流线与金腰线，客舱平直区均布 5 扇超大落地全景侧窗，车尾 1 扇门
          drawGSEDoor(w * 0.90)

          const startX = w * 0.24
          const endX = w * 0.86
          const winCount = 5
          const step = (endX - startX) / winCount
          for (let i = 0; i < winCount; i++) {
            const wx = startX + i * step + 4
            ctx.fillStyle = '#020617'
            ctx.beginPath()
            ctx.roundRect(wx, winTop, step - 8, winH * 1.3, 4)
            ctx.fill()
          }
        }

      } else if (isCR400) {
        // === 🇨🇳 中国高铁 CR400 复兴号 / CRH 和谐号 专属门窗 ===
        const doorW = w * 0.055
        const doorH = h * 0.67
        const doorY = h * 0.18

        const drawCR400Door = (dx: number) => {
          ctx.fillStyle = frameColor || '#334155'
          ctx.fillRect(dx, doorY, doorW, doorH)
          ctx.fillStyle = windowColor || '#020617'
          ctx.fillRect(dx + 3, doorY + 6, doorW - 6, doorH * 0.30)
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(dx + doorW * 0.80, doorY + doorH * 0.50, 2.5, 10)
        }

        if (isMiddle) {
          drawCR400Door(w * 0.035)
          drawCR400Door(w * 0.91)
          const startX = w * 0.12
          const endX = w * 0.88
          const winCount = 8
          const step = (endX - startX) / winCount
          for (let i = 0; i < winCount; i++) {
            const wx = startX + i * step + 3
            ctx.fillStyle = frameColor || '#334155'
            ctx.beginPath()
            ctx.roundRect(wx - 2, winTop - 2, step - 2, winH + 4, 3)
            ctx.fill()
            ctx.fillStyle = windowColor || '#020617'
            ctx.beginPath()
            ctx.roundRect(wx, winTop, step - 6, winH, 2)
            ctx.fill()
          }
        } else {
          // 先头车 / 尾车：双段长鼻流线锥体 (x < 0.28) 彻底不设侧窗，完整展现气动红神龙/金凤凰/和谐蓝飘带，客舱平直区 6 扇车窗，车尾 1 扇门
          drawCR400Door(w * 0.90)

          const startX = w * 0.28
          const endX = w * 0.86
          const winCount = 6
          const step = (endX - startX) / winCount
          for (let i = 0; i < winCount; i++) {
            const wx = startX + i * step + 3
            ctx.fillStyle = frameColor || '#334155'
            ctx.beginPath()
            ctx.roundRect(wx - 2, winTop - 2, step - 2, winH + 4, 3)
            ctx.fill()
            ctx.fillStyle = windowColor || '#020617'
            ctx.beginPath()
            ctx.roundRect(wx, winTop, step - 6, winH, 2)
            ctx.fill()
          }
        }

      } else if (isShinkansen300) {
        // === 🚆 新干线 300系 经典梯形单斜面门窗 ===
        const doorW = w * 0.055
        const doorH = h * 0.67
        const doorY = h * 0.18

        const draw300Door = (dx: number) => {
          ctx.fillStyle = frameColor || '#334155'
          ctx.fillRect(dx, doorY, doorW, doorH)
          ctx.fillStyle = windowColor || '#0f172a'
          ctx.fillRect(dx + 3, doorY + 6, doorW - 6, doorH * 0.28)
        }

        if (isMiddle) {
          draw300Door(w * 0.035)
          draw300Door(w * 0.91)
          const startX = w * 0.12
          for (let i = 0; i < 7; i++) {
            const wx = startX + i * (w * 0.11)
            ctx.fillStyle = frameColor || '#334155'
            ctx.fillRect(wx - 2, winTop - 2, winW + 4, winH + 4)
            ctx.fillStyle = windowColor || '#0f172a'
            ctx.fillRect(wx, winTop, winW, winH)
          }
        } else {
          // 先头车 / 尾车：梯形斜面鼻尖 (x < 0.26) 不设假窗，保持纯净东海道双蓝腰线，客舱平直区 5 扇窗，车尾 1 扇门
          const startX = w * 0.26
          for (let i = 0; i < 5; i++) {
            const wx = startX + i * (w * 0.118)
            ctx.fillStyle = frameColor || '#334155'
            ctx.fillRect(wx - 2, winTop - 2, winW + 4, winH + 4)
            ctx.fillStyle = windowColor || '#0f172a'
            ctx.fillRect(wx, winTop, winW, winH)
          }
          draw300Door(w * 0.89)
        }

      } else if (isMiddle) {
        // 中间车：两端各 1 扇门，全车身 8 扇客舱窗
        for (const dx of [w * 0.03, w * 0.92]) {
          ctx.fillStyle = frameColor
          ctx.fillRect(dx, h * 0.18, w * 0.05, h * 0.67)
          ctx.fillStyle = windowColor
          ctx.fillRect(dx + 3, h * 0.23, w * 0.05 - 6, h * 0.22)
        }

        const startX = w * 0.11
        for (let i = 0; i < 8; i++) {
          const wx = startX + i * (w * 0.098)
          ctx.fillStyle = frameColor
          ctx.beginPath()
          ctx.roundRect(wx - 2, winTop - 2, winW + 4, winH + 4, 3)
          ctx.fill()
          ctx.fillStyle = windowColor
          ctx.beginPath()
          ctx.roundRect(wx, winTop, winW, winH, 2)
          ctx.fill()
        }
      } else {
        // 先头车 / 尾车：通用新干线 / E5 (超长气动鸭嘴鼻锥 x < 0.30 彻底不设侧窗，保持纯净流线双色车身，客舱平直区均布 6 扇客舱窗，车尾 1 扇乘降门)
        const doorX = w * 0.90
        ctx.fillStyle = frameColor
        ctx.fillRect(doorX, h * 0.18, w * 0.05, h * 0.67)
        ctx.fillStyle = windowColor
        ctx.fillRect(doorX + 3, h * 0.23, w * 0.05 - 6, h * 0.22)

        // 6 扇客舱窗均匀分布在平直客舱区 (x = 0.30 ~ 0.86)
        const cabinStartX = w * 0.30
        const stepX = w * 0.092
        const cabinWinW = w * 0.060
        for (let i = 0; i < 6; i++) {
          const wx = cabinStartX + i * stepX
          ctx.fillStyle = frameColor
          ctx.beginPath()
          ctx.roundRect(wx - 2, winTop - 2, cabinWinW + 4, winH + 4, 3)
          ctx.fill()
          ctx.fillStyle = windowColor
          ctx.beginPath()
          ctx.roundRect(wx, winTop, cabinWinW, winH, 2)
          ctx.fill()
        }
      }

    // ==========================================
    // 2. 蒸汽机车系列 (Steam)
    // ==========================================
    } else if (category === 'steam') {
      // 蒸汽机车标准统一朝向: x = 0 为前端烟箱/锅炉，x = w 为后端乘务驾驶舱
      const boilerStartX = 0
      const boilerEndX = w * 0.65
      const cabStartX = w * 0.65
      const cabEndX = w

      // 1. 锅炉区 (深黑铸铁圆筒反光底色，前段 0 ~ 65%)
      const grad = ctx.createLinearGradient(0, 0, 0, h * 0.80)
      grad.addColorStop(0, '#27272a')
      grad.addColorStop(0.5, '#09090b')
      grad.addColorStop(1, '#18181b')
      ctx.fillStyle = grad
      ctx.fillRect(boilerStartX, 0, boilerEndX - boilerStartX, h * 0.80)

      // 锅炉 3 道金色黄铜箍环
      ctx.fillStyle = secondaryColor
      const hoopOffsets = [0.12, 0.32, 0.52]
      for (const ho of hoopOffsets) {
        ctx.fillRect(w * ho, 0, 8, h * 0.80)
      }

      // 锅炉细密加固铆钉行
      ctx.fillStyle = accentColor
      for (let x = boilerStartX + 15; x < boilerEndX - 15; x += 25) {
        ctx.beginPath()
        ctx.arc(x, h * 0.12, 2.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x, h * 0.70, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // 2. 乘务驾驶舱区 (加高舱室，后段 65% ~ 100%)
      ctx.fillStyle = '#18181b'
      ctx.fillRect(cabStartX, 0, cabEndX - cabStartX, h * 0.85)

      // 驾驶舱双扇黄铜拱窗
      const cabWinW = w * 0.08
      const cabWinH = h * 0.30
      const cabWinTop = h * 0.18
      const win1X = w * 0.72
      const win2X = w * 0.84

      for (const wx of [win1X, win2X]) {
        ctx.fillStyle = frameColor
        ctx.beginPath()
        ctx.roundRect(wx, cabWinTop, cabWinW, cabWinH, [10, 10, 0, 0])
        ctx.fill()

        ctx.fillStyle = windowColor
        ctx.beginPath()
        ctx.roundRect(wx + 3, cabWinTop + 3, cabWinW - 6, cabWinH - 6, [7, 7, 0, 0])
        ctx.fill()
      }

      // 3. 底部黑色底盘与 3 对蒸汽大动轮
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, h * 0.80, w, h * 0.20)

      const wheelY = h * 0.88
      const wheelR = h * 0.14
      const wheelPositions = [0.12, 0.32, 0.52]

      for (const wp of wheelPositions) {
        const wx = w * wp
        ctx.beginPath()
        ctx.arc(wx, wheelY, wheelR, 0, Math.PI * 2)
        ctx.fillStyle = '#09090b'
        ctx.fill()
        ctx.lineWidth = 3
        ctx.strokeStyle = secondaryColor
        ctx.stroke()

        // 轮心与平衡块
        ctx.beginPath()
        ctx.arc(wx, wheelY, wheelR * 0.35, 0, Math.PI * 2)
        ctx.fillStyle = accentColor
        ctx.fill()
      }

      // 银色蒸汽传动连杆
      ctx.fillStyle = '#e2e8f0'
      ctx.fillRect(w * 0.08, wheelY - 4, w * 0.52, 8)

    // ==========================================
    // 3. 通勤电车系列 (Commuter)
    // ==========================================
    } else {
      const isHankyu = style === 'commuter-hankyu'
      const isMarunouchi = style === 'commuter-marunouchi'

      // 1. 底漆
      if (isHankyu) {
        // === 关西阪急电车: 标志性纯色深邃阪急栗红 (猪肝红) ===
        ctx.fillStyle = '#4a0e17'
        ctx.fillRect(0, 0, w, h)

        // 象牙白顶盖与极细银色金属雨檐
        ctx.fillStyle = '#f8fafc'
        ctx.fillRect(0, 0, w, h * 0.10)
        ctx.fillStyle = '#cbd5e1'
        ctx.fillRect(0, h * 0.10, w, 3)

      } else if (isMarunouchi) {
        // === 东京地下铁丸之内线 2000系: 热情鲜红 ===
        ctx.fillStyle = '#dc2626'
        ctx.fillRect(0, 0, w, h)

        // 车顶灰檐
        ctx.fillStyle = '#334155'
        ctx.fillRect(0, 0, w, h * 0.10)

        // 标志性白色正弦波浪纹 (Sine Wave Ribbon)
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 10
        ctx.beginPath()
        const waveStep = 32
        for (let x = 0; x <= w; x += 4) {
          const y = h * 0.58 + Math.sin(x / waveStep * Math.PI) * 12
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()

      } else {
        // 不锈钢底漆
        ctx.fillStyle = primaryColor || '#e2e8f0'
        ctx.fillRect(0, 0, w, h)

        // 车顶灰檐
        ctx.fillStyle = roofColor || '#64748b'
        ctx.fillRect(0, 0, w, h * 0.12)
      }

      if (style === 'commuter-osaka-loop') {
        // === 大阪环状线 (JR 323系): 窗上粗橙带 + 窗下橙黑双腰线 ===
        ctx.fillStyle = '#ea580c'
        ctx.fillRect(0, h * 0.12, w, h * 0.07) // 窗上亮橙色粗横条

        const stripeY = h * 0.54
        ctx.fillStyle = '#ea580c'
        ctx.fillRect(0, stripeY, w, h * 0.10)
        ctx.fillStyle = '#1e293b'
        ctx.fillRect(0, stripeY + h * 0.10, w, h * 0.05)

      } else if (style === 'commuter-chuo') {
        // === 中央线快速 (JR E233): 朱色1号双横色彩带 (窗上细带 + 窗下粗带) ===
        ctx.fillStyle = '#ea580c'
        ctx.fillRect(0, h * 0.12, w, 8)
        ctx.fillRect(0, h * 0.54, w, h * 0.15)

      } else if (style === 'commuter-keihin') {
        // === 京滨东北线 (JR E233): 青24号天蓝双横色彩带 ===
        ctx.fillStyle = '#0284c7'
        ctx.fillRect(0, h * 0.12, w, 8)
        ctx.fillRect(0, h * 0.54, w, h * 0.15)

      } else if (style === 'commuter-sobu') {
        // === 总武线各停 (JR E231): 黄色5号金丝雀黄宽腰带 ===
        ctx.fillStyle = '#eab308'
        ctx.fillRect(0, h * 0.54, w, h * 0.16)

      } else if (style === 'commuter-yamanote') {
        // === 东京山手线 (JR E235): 真实形态为不锈钢车身 + 车顶青绿雨檐，窗下无粗条纹，颜色全在全高点阵门上 ===
        ctx.fillStyle = '#22c55e'
        ctx.fillRect(0, h * 0.10, w, 6)
      } else if (!isHankyu && !isMarunouchi) {
        // 创意通用涂装
        const stripeY = h * 0.54
        const stripeH = h * 0.18
        ctx.fillStyle = secondaryColor || '#22c55e'
        ctx.fillRect(0, stripeY, w, stripeH)
        ctx.fillStyle = accentColor || '#15803d'
        ctx.fillRect(0, stripeY + stripeH - 3, w, 4)
      }

      // 底盘与车轮 (左右侧统一位置)
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, h * 0.84, w, h * 0.16)

      const wheelY = h * 0.88
      const wheelR = h * 0.09
      const wheelPositions = [0.12, 0.22, 0.78, 0.88]

      for (const wp of wheelPositions) {
        const wx = w * wp
        ctx.beginPath()
        ctx.arc(wx, wheelY, wheelR, 0, Math.PI * 2)
        ctx.fillStyle = '#1e293b'
        ctx.fill()
        ctx.lineWidth = 2
        ctx.strokeStyle = '#475569'
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(wx, wheelY, wheelR * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = '#64748b'
        ctx.fill()

        ctx.beginPath()
        ctx.arc(wx, wheelY, wheelR * 0.25, 0, Math.PI * 2)
        ctx.fillStyle = isHankyu ? '#eab308' : accentColor
        ctx.fill()
      }

      // 3 扇客门 (左右侧统一位置)
      const doorTop = h * 0.12
      const doorH = h * 0.72
      const doorW = w * 0.08
      const doorPositions = [0.05, 0.46, 0.87]

      for (const dp of doorPositions) {
        const dx = w * dp

        if (isHankyu) {
          // === 阪急电车车门: 栗红底 + 金色黄铜门把手 ===
          ctx.fillStyle = '#4a0e17'
          ctx.fillRect(dx, doorTop, doorW, doorH)

          // 铝合金窗框
          ctx.fillStyle = '#cbd5e1'
          ctx.fillRect(dx + 2, doorTop + 2, doorW - 4, doorH - 4)
          ctx.fillStyle = '#4a0e17'
          ctx.fillRect(dx + 4, doorTop + 4, doorW - 8, doorH - 8)

          // 金色门把手 (黄铜高光)
          ctx.fillStyle = '#eab308'
          ctx.fillRect(dx + doorW / 2 - 2, doorTop + doorH * 0.52, 4, 12)

        } else if (style === 'commuter-osaka-loop') {
          // === 323系 大阪环状线车门: 橙色边框 + 橙黑动感斜切几何 ===
          ctx.fillStyle = '#ea580c'
          ctx.fillRect(dx, doorTop, doorW, doorH)
          ctx.fillStyle = '#cbd5e1'
          ctx.fillRect(dx + 3, doorTop + 3, doorW - 6, doorH - 6)
          ctx.fillStyle = '#ea580c'
          ctx.fillRect(dx + 3, doorTop + doorH * 0.55, doorW - 6, doorH * 0.20)
          ctx.fillStyle = '#1e293b'
          ctx.fillRect(dx + 3, doorTop + doorH * 0.75, doorW - 6, doorH * 0.22)

        } else if (style === 'commuter-yamanote') {
          // === E235 山手线车门: 全高青绿色渐变 + 波点阵列 ===
          ctx.fillStyle = '#22c55e'
          ctx.fillRect(dx, doorTop, doorW, doorH)
          ctx.fillStyle = '#86efac'
          for (let py = doorTop + 8; py < doorTop + doorH - 8; py += 12) {
            for (let px = dx + 6; px < dx + doorW - 6; px += 8) {
              ctx.fillRect(px, py, 3, 3)
            }
          }
        } else if (isMarunouchi) {
          // === 丸之内线车门: 鲜红 + 黑色防夹边框 ===
          ctx.fillStyle = '#18181b'
          ctx.fillRect(dx, doorTop, doorW, doorH)
          ctx.fillStyle = '#dc2626'
          ctx.fillRect(dx + 2, doorTop + 2, doorW - 4, doorH - 4)
        } else {
          // 不锈钢原色车门
          ctx.fillStyle = '#1e293b'
          ctx.fillRect(dx, doorTop, doorW, doorH)
          ctx.fillStyle = frameColor || '#94a3b8'
          ctx.fillRect(dx + 2, doorTop + 2, doorW - 4, doorH - 4)
        }

        // 门缝分割线
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(dx + doorW / 2 - 1, doorTop + 2, 2, doorH - 4)

        // 双扇车门玻璃
        const dwWinW = (doorW - 8) / 2
        const dwWinH = h * 0.26
        const dwWinTop = doorTop + 8

        ctx.fillStyle = windowColor
        ctx.fillRect(dx + 3, dwWinTop, dwWinW, dwWinH)
        ctx.fillRect(dx + doorW / 2 + 1, dwWinTop, dwWinW, dwWinH)
      }

      // 客舱窗户排布 (左右侧统一位置)
      const winTop = h * 0.20
      const winHeight = h * 0.28
      const winW = w * 0.075
      const windowCols = [0.16, 0.25, 0.34, 0.58, 0.67, 0.76]

      for (const wxRel of windowCols) {
        const wx = w * (isLeft ? wxRel : (1 - wxRel - winW / w))
        if (isHankyu) {
          // 阪急电车铝合金银色复古窗框
          ctx.fillStyle = '#cbd5e1'
          ctx.beginPath()
          ctx.roundRect(wx - 3, winTop - 3, winW + 6, winHeight + 6, 4)
          ctx.fill()
          ctx.fillStyle = '#0f172a'
          ctx.beginPath()
          ctx.roundRect(wx, winTop, winW, winHeight, 2)
          ctx.fill()
        } else {
          ctx.fillStyle = frameColor
          ctx.beginPath()
          ctx.roundRect(wx - 2, winTop - 2, winW + 4, winHeight + 4, 3)
          ctx.fill()
          ctx.fillStyle = windowColor
          ctx.beginPath()
          ctx.roundRect(wx, winTop, winW, winHeight, 2)
          ctx.fill()
        }
      }
    }

    // 仅在用户显式开启自定义文字时绘制
    if (customText && customText.enabled) {
      ctx.save()
      const ox = (customText.offsetX ?? 0) * (w * 0.006)
      const oy = (customText.offsetY ?? 0) * (h * 0.005)

      const cx = w * 0.5 + ox
      const cy1 = h * 0.74 + oy
      const cy2 = h * 0.83 + oy

      const text1 = customText.kidName || "KID'S EXPRESS"
      const text2 = [customText.trainNumber, customText.destination].filter(Boolean).join('  |  ')

      // 计算文本宽度以自适应绘制高清晰度防眩光 LED 铭牌底框 (100% 杜绝在浅色/纯白车体上文字不可见)
      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif'
      const m1 = ctx.measureText(text1).width
      ctx.font = 'bold 10px monospace'
      const m2 = text2 ? ctx.measureText(text2).width : 0
      const boxW = Math.max(m1, m2) + 26
      const boxH = text2 ? 34 : 22
      const boxX = cx - boxW / 2
      const boxY = text2 ? cy1 - 15 : cy1 - 13

      // 1. 高对比度底板 (默认深黑科技底框或用户自定义颜色)
      ctx.fillStyle = customText.bgColor || '#0f172a'
      ctx.beginPath()
      ctx.roundRect(boxX, boxY, boxW, boxH, 5)
      ctx.fill()

      // 金色/科技细边框
      ctx.strokeStyle = accentColor || '#f59e0b'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.roundRect(boxX, boxY, boxW, boxH, 5)
      ctx.stroke()

      // 2. 文字绘制 (支持自定义颜色，默认鲜亮白与暖黄)
      const primaryTextColor = customText.textColor || '#ffffff'
      const secondaryTextColor = customText.textColor || '#fef08a'

      ctx.fillStyle = primaryTextColor
      ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text1, cx, text2 ? cy1 - 2 : cy1 - 2)

      if (text2) {
        ctx.fillStyle = secondaryTextColor
        ctx.font = 'bold 10px monospace'
        ctx.fillText(text2, cx, cy2 - 2)
      }
      ctx.restore()
    }

    return canvas
  }

  /**
   * 将横向 Master Side View 纹理通过严格的 2D 仿射变换映射为展开图纵向侧壁纹理
   * 数学原理：
   * 对于 side_left：x_v = H_M - y_m, y_v = W_M - x_m (变换矩阵: [0, -1, -1, 0, H_M, W_M])
   * 对于 side_right：x_v = y_m, y_v = x_m (变换矩阵: [0, 1, 1, 0, 0, 0])
   * 100% 保证 3D 视图与 2D 展开图所有门、窗、舷窗、文字、图案在物理位置、尺寸、长宽比上完全绝对一致！
   */
  private rotateAndMapSide(masterCanvas: HTMLCanvasElement, side: 'left' | 'right'): HTMLCanvasElement {
    const wm = masterCanvas.width
    const hm = masterCanvas.height
    const canvas = document.createElement('canvas')
    canvas.width = hm
    canvas.height = wm
    const ctx = canvas.getContext('2d')!

    ctx.save()
    if (side === 'left') {
      ctx.setTransform(0, -1, -1, 0, hm, wm)
    } else {
      ctx.setTransform(0, -1, 1, 0, 0, wm)
    }
    ctx.drawImage(masterCanvas, 0, 0)
    ctx.restore()

    return canvas
  }

  /**
   * 绘制车顶贴图
   */
  private drawRoofView(w: number, h: number, params: any): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    const { roofColor, secondaryColor, theme, category, consistId } = params

    const style = this.resolveLiveryStyle(theme, category, consistId)

    if (category === 'shinkansen') {
      if (style === 'cr400-fuxing-red' || style === 'cr400-fuxing-gold' || style === 'crh380a-hexie' || style === 'crh2-hexie-classic') {
        // === 🇨🇳 中国高铁 CR400 复兴号 / CRH 和谐号 真实车顶 (大面积纯白/浅白银 + 前端气动曲面黑风挡与动感飞翼) ===
        const isFuxingRed = style === 'cr400-fuxing-red'
        const isFuxingGold = style === 'cr400-fuxing-gold'

        const baseRoofColor = isFuxingRed ? '#e2e8f0' : (isFuxingGold ? '#f8fafc' : '#ffffff')
        const stripeColor = isFuxingRed ? '#dc2626' : (isFuxingGold ? '#d97706' : '#0284c7')
        const accentStripe = isFuxingRed ? '#991b1b' : (isFuxingGold ? '#b45309' : '#0369a1')

        // 1. 通体大面积纯白 / 科技浅银白底色
        ctx.fillStyle = baseRoofColor
        ctx.fillRect(0, 0, w, h)

        // 2. 车顶中央浅灰防滑走道与冷气绝缘罩
        ctx.fillStyle = '#cbd5e1'
        ctx.fillRect(w * 0.32, h * 0.08, w * 0.36, h * 0.60)
        ctx.fillStyle = '#94a3b8'
        ctx.fillRect(w * 0.44, h * 0.12, w * 0.12, h * 0.52)

        // 3. 先头车 / 尾车：前端风挡 + 紧随其后的凤眼大灯 + 动感飞翼飘带 + 纯净流线长鼻锥
        const isMiddleCar = params.carType === 'middle'
        if (!isMiddleCar) {
          // A. 驾驶舱曲面黑风挡 (Y in [0.68, 0.81])
          const winTop = h * 0.70
          const winH = h * 0.12
          const winW = w * 0.80
          const winX = w * 0.10

          // 风挡两侧动感飞翼弧线 (红神龙/金凤凰/和谐蓝)
          ctx.fillStyle = stripeColor
          ctx.beginPath()
          ctx.moveTo(winX - 6, winTop - 4)
          ctx.lineTo(w * 0.5, winTop + winH * 0.4)
          ctx.lineTo(winX + winW + 6, winTop - 4)
          ctx.lineTo(winX + winW + 12, winTop + winH + 16)
          ctx.lineTo(w * 0.5, winTop + winH + 6)
          ctx.lineTo(winX - 12, winTop + winH + 16)
          ctx.closePath()
          ctx.fill()

          ctx.fillStyle = accentStripe
          ctx.fillRect(winX - 8, winTop + winH + 6, winW + 16, 2.5)

          // 墨黑大曲面风挡外框
          ctx.fillStyle = '#0f172a'
          ctx.beginPath()
          ctx.roundRect(winX, winTop, winW, winH, [12, 12, 4, 4])
          ctx.fill()

          // 内部深黑防紫外线镀膜玻璃
          ctx.fillStyle = '#020617'
          ctx.beginPath()
          ctx.roundRect(winX + 3, winTop + 3, winW - 6, winH - 6, [10, 10, 3, 3])
          ctx.fill()

          // 驾驶舱双雨刮器
          ctx.strokeStyle = '#94a3b8'
          ctx.lineWidth = 2.2
          ctx.beginPath()
          ctx.moveTo(w * 0.35, winTop + winH - 3)
          ctx.lineTo(w * 0.46, winTop + winH * 0.4)
          ctx.moveTo(w * 0.65, winTop + winH - 3)
          ctx.lineTo(w * 0.54, winTop + winH * 0.4)
          ctx.stroke()

          // B. 紧贴车窗正下方的犀利凤眼 LED 组合大灯 (Y in [0.83, 0.88])
          const lightY = winTop + winH + 10
          for (const lx of [w * 0.22, w * 0.78]) {
            const isL = lx < w * 0.5
            // 犀利斜角深黑灯壳
            ctx.fillStyle = '#0f172a'
            ctx.beginPath()
            ctx.ellipse(lx, lightY, 12, 5.5, isL ? -0.22 : 0.22, 0, Math.PI * 2)
            ctx.fill()

            // 晶莹白透镜
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            ctx.ellipse(lx, lightY, 8.5, 3.5, isL ? -0.22 : 0.22, 0, Math.PI * 2)
            ctx.fill()

            // 高亮暖黄 LED 点
            ctx.fillStyle = '#fef08a'
            ctx.beginPath()
            ctx.arc(lx, lightY, 3, 0, Math.PI * 2)
            ctx.fill()
          }

          // C. 最下方突出的前鼻锥区域 (Y in [0.90, 1.00])：保持大面积纯净雪白/科技浅银车身，点缀高精车钩导流罩开闭轮廓线
          ctx.strokeStyle = isFuxingRed ? '#cbd5e1' : '#e2e8f0'
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.moveTo(w * 0.36, h * 0.93)
          ctx.lineTo(w * 0.64, h * 0.93)
          ctx.lineTo(w * 0.60, h * 0.99)
          ctx.lineTo(w * 0.40, h * 0.99)
          ctx.closePath()
          ctx.stroke()
        }
      } else if (style === 'shinkansen-300-nozomi' || style === 'shinkansen-0-classic') {
        // === 🚆 新干线 300系 / 0系 车顶 (纯净雪白 + 经典梯形黑风挡 + 紧随风挡下的双大灯) ===
        ctx.fillStyle = '#f8fafc'
        ctx.fillRect(0, 0, w, h)

        ctx.fillStyle = '#cbd5e1'
        ctx.fillRect(w * 0.30, h * 0.10, w * 0.40, h * 0.62)

        const isMiddleCar = params.carType === 'middle'
        if (!isMiddleCar) {
          const winTop = h * 0.72
          const winH = h * 0.14
          const winW = w * 0.84
          const winX = w * 0.08

          ctx.fillStyle = '#0f172a'
          ctx.beginPath()
          ctx.moveTo(winX, winTop)
          ctx.lineTo(winX + winW, winTop)
          ctx.lineTo(winX + winW - 6, winTop + winH)
          ctx.lineTo(winX + 6, winTop + winH)
          ctx.closePath()
          ctx.fill()

          ctx.fillStyle = '#020617'
          ctx.beginPath()
          ctx.moveTo(winX + 3, winTop + 3)
          ctx.lineTo(winX + winW - 3, winTop + 3)
          ctx.lineTo(winX + winW - 8, winTop + winH - 3)
          ctx.lineTo(winX + 8, winTop + winH - 3)
          ctx.closePath()
          ctx.fill()

          ctx.strokeStyle = '#94a3b8'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(w * 0.35, winTop + winH - 4)
          ctx.lineTo(w * 0.45, winTop + winH * 0.45)
          ctx.moveTo(w * 0.65, winTop + winH - 4)
          ctx.lineTo(w * 0.55, winTop + winH * 0.45)
          ctx.stroke()

          // 车窗正下方的双前照灯
          const lightY = winTop + winH + 8
          for (const lx of [w * 0.22, w * 0.78]) {
            ctx.fillStyle = '#0f172a'
            ctx.fillRect(lx - 12, lightY - 4, 24, 8)
            ctx.fillStyle = '#fef08a'
            ctx.fillRect(lx - 10, lightY - 2.5, 20, 5)
          }

          // 突出的前鼻锥保持纯净白底 + 双蓝腰线
          ctx.fillStyle = '#0284c7'
          ctx.fillRect(0, h * 0.94, w, 5)
          ctx.fillStyle = '#1e3a8a'
          ctx.fillRect(0, h * 0.94 + 5, w, 3)
        }
      } else if (style === 'romancecar-gse-red') {
        // === 🏔️ 小田急 GSE 浪漫特快车顶 (玫瑰朱红 + 2楼挑高全景风挡) ===
        ctx.fillStyle = '#e11d48'
        ctx.fillRect(0, 0, w, h)

        ctx.fillStyle = '#9f1239'
        ctx.fillRect(w * 0.30, h * 0.10, w * 0.40, h * 0.55)

        const isMiddleCar = params.carType === 'middle'
        if (!isMiddleCar) {
          // 2楼高位驾驶室黑色前窗
          ctx.fillStyle = '#020617'
          ctx.beginPath()
          ctx.roundRect(w * 0.15, h * 0.68, w * 0.70, h * 0.12, [6, 6, 2, 2])
          ctx.fill()

          // 1楼超大落地全景前倾大风挡
          ctx.fillStyle = '#020617'
          ctx.beginPath()
          ctx.roundRect(w * 0.08, h * 0.82, w * 0.84, h * 0.16, [8, 8, 2, 2])
          ctx.fill()
        }
      } else if (style === 'shinkansen-doctor-yellow') {
        // 黄医生车顶: 鲜黄底色 + 灰白绝缘受电弓区
        ctx.fillStyle = '#facc15'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#cbd5e1'
        ctx.fillRect(w * 0.30, h * 0.15, w * 0.40, h * 0.70)
        ctx.fillStyle = '#1e3a8a'
        ctx.fillRect(w * 0.45, h * 0.20, w * 0.10, h * 0.60)
      } else if (style === 'shinkansen-n700') {
        ctx.fillStyle = '#f8fafc'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#cbd5e1'
        ctx.fillRect(w * 0.35, h * 0.1, w * 0.3, h * 0.8)
      } else if (style === 'shinkansen-haruka-kitty') {
        // === 关空特急 Haruka 281系 车顶 (纯白 + 仅前端 12% 紧凑驾驶舱黑色风挡斜面) ===
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, w, h)

        // 后段冷气散热区 (浅灰)
        ctx.fillStyle = '#e2e8f0'
        ctx.fillRect(w * 0.30, h * 0.15, w * 0.40, h * 0.50)

        // 仅先头车 / 尾车在前端 8% 绘制紧凑黑色流线驾驶舱风挡 (y: 0.91 ~ 0.99)
        const isMiddleCar = params.carType === 'middle'
        if (!isMiddleCar) {
          const winTop = h * 0.91
          const winH = h * 0.08
          const winW = w * 0.82
          const winX = w * 0.09

          // 黑色流线风挡外框
          ctx.fillStyle = '#0f172a'
          ctx.beginPath()
          ctx.roundRect(winX, winTop, winW, winH, [10, 10, 2, 2])
          ctx.fill()

          // 深黑座舱大曲面玻璃
          ctx.fillStyle = '#020617'
          ctx.beginPath()
          ctx.roundRect(winX + 3, winTop + 3, winW - 6, winH - 6, [8, 8, 2, 2])
          ctx.fill()

          // 中央黑色中柱分割
          ctx.fillStyle = '#0f172a'
          ctx.fillRect(w * 0.5 - 2, winTop, 4, winH)

          // 双雨刮器 (银白)
          ctx.strokeStyle = '#94a3b8'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(w * 0.36, winTop + winH - 3)
          ctx.lineTo(w * 0.46, winTop + winH * 0.35)
          ctx.moveTo(w * 0.64, winTop + winH - 3)
          ctx.lineTo(w * 0.54, winTop + winH * 0.35)
          ctx.stroke()
        }
      } else if (style === 'shinkansen-nankai-rapit') {
        ctx.fillStyle = '#0b1d3a'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#0f2b5c'
        ctx.fillRect(w * 0.30, h * 0.15, w * 0.40, h * 0.70)
      } else if (style === 'shinkansen-500-eva') {
        ctx.fillStyle = '#581c87'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#22c55e'
        ctx.fillRect(w * 0.40, 0, w * 0.20, h)
      } else if (style === 'shinkansen-e5') {
        // E5 隼号车顶: 常盘绿
        ctx.fillStyle = '#059669'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#047857'
        ctx.fillRect(w * 0.35, h * 0.1, w * 0.3, h * 0.7)
      } else {
        // 通用高铁/特急车顶：以纯白/浅灰为基底，绝不整车涂成刺眼纯色
        ctx.fillStyle = roofColor || '#f8fafc'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#cbd5e1'
        ctx.fillRect(w * 0.35, h * 0.1, w * 0.3, h * 0.8)
      }
    } else if (category === 'steam') {
      ctx.fillStyle = '#1c1917'
      ctx.fillRect(0, 0, w, h)

      ctx.fillStyle = secondaryColor
      const hoopY = [0.20, 0.40, 0.60]
      for (const hy of hoopY) {
        ctx.fillRect(w * 0.05, h * hy, w * 0.9, 6)
      }

      ctx.strokeStyle = '#78350f'
      ctx.lineWidth = 2
      ctx.setLineDash([4, 4])
      ctx.strokeRect(w * 0.25, h * 0.15, w * 0.5, h * 0.12)
      ctx.strokeRect(w * 0.20, h * 0.45, w * 0.6, h * 0.15)
      ctx.setLineDash([])

      ctx.fillStyle = '#09090b'
      ctx.fillRect(0, h * 0.70, w, h * 0.30)
      ctx.fillStyle = '#78350f'
      ctx.fillRect(0, h * 0.70 - 2, w, 4)
    } else if (category === 'bus') {
      if (style === 'bus-london-red') {
        // 伦敦巴士纯红车顶 + 深红收边 + 浅灰中央换气盖
        ctx.fillStyle = '#dc2626'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#b91c1c'
        ctx.fillRect(0, 0, w, 3)
        ctx.fillRect(0, h - 3, w, 3)
        ctx.fillStyle = '#e2e8f0'
        ctx.fillRect(w * 0.20, h * 0.25, w * 0.60, h * 0.50)
        ctx.strokeStyle = '#991b1b'
        ctx.lineWidth = 1.5
        ctx.strokeRect(w * 0.20, h * 0.25, w * 0.60, h * 0.50)
      } else if (style === 'bus-retro-green') {
        // 复古绿电车奶油白顶 + 双侧金色雨檐 + 经典加强筋
        ctx.fillStyle = '#fef3c7'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#d97706'
        ctx.fillRect(0, 0, w, 4)
        ctx.fillRect(0, h - 4, w, 4)
        ctx.fillStyle = '#d1d5db'
        for (let i = 1; i < 10; i++) {
          ctx.fillRect(w * 0.15, (h / 10) * i, w * 0.70, 2)
        }
      } else if (style === 'bus-eco-cyan') {
        // 纯电环保客车顶：铂金浅灰 + 太阳能矩阵板 + 电池包
        ctx.fillStyle = '#f1f5f9'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(w * 0.18, h * 0.15, w * 0.64, h * 0.30)
        ctx.strokeStyle = '#0284c7'
        ctx.lineWidth = 1
        for (let x = w * 0.20; x < w * 0.80; x += 16) {
          ctx.strokeRect(x, h * 0.17, 12, h * 0.26)
        }
        ctx.fillStyle = '#cbd5e1'
        ctx.fillRect(w * 0.22, h * 0.55, w * 0.56, h * 0.35)
      } else if (style === 'bus-double-london-red') {
        // 伦敦双层红巴车顶
        ctx.fillStyle = '#982127'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#7a1a1f'
        ctx.fillRect(0, 0, w, 3.5)
        ctx.fillRect(0, h - 3.5, w, 3.5)
      } else if (style === 'bus-double-kmb-gold') {
        // 香港九巴香槟金顶
        ctx.fillStyle = '#cebea0'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#802028'
        ctx.fillRect(0, 0, w, 3)
        ctx.fillRect(0, h - 3, w, 3)
      } else {
        // 71路/巨龙珍珠白顶 + 浅灰空调机
        ctx.fillStyle = '#f5f7fa'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#e2e8f0'
        ctx.fillRect(w * 0.20, h * 0.20, w * 0.60, h * 0.60)
        ctx.strokeStyle = '#cbd5e1'
        ctx.lineWidth = 2
        ctx.strokeRect(w * 0.20, h * 0.20, w * 0.60, h * 0.60)
      }
    } else if (style.startsWith('hk-tram-')) {
      // === 🚊 香港双层叮叮车车顶 (集电杆转轴 + 绝缘木格栅) ===
      ctx.fillStyle = '#f3ede2'
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#3d2817'
      ctx.fillRect(w * 0.35, h * 0.35, w * 0.30, h * 0.30)
      ctx.strokeStyle = '#18222d'
      ctx.strokeRect(w * 0.35, h * 0.35, w * 0.30, h * 0.30)
      ctx.fillStyle = '#c89635'
      ctx.fillRect(w * 0.45, h * 0.45, w * 0.10, h * 0.10)
    } else if (category === 'vehicle' || style.startsWith('tram-')) {
      // === 🚊 有轨电车车顶 (受电弓绝缘子基座 + 顶置逆变空调舱) ===
      ctx.fillStyle = '#cbd5e1'
      ctx.fillRect(0, 0, w, h)
      // 受电弓四角红色陶瓷绝缘子底座 (Insulators)
      ctx.fillStyle = '#dc2626'
      ctx.fillRect(w * 0.25, h * 0.15, 6, 6)
      ctx.fillRect(w * 0.70, h * 0.15, 6, 6)
      ctx.fillRect(w * 0.25, h * 0.40, 6, 6)
      ctx.fillRect(w * 0.70, h * 0.40, 6, 6)
      // 顶置空调电气舱
      ctx.fillStyle = '#94a3b8'
      ctx.fillRect(w * 0.20, h * 0.55, w * 0.60, h * 0.35)
      ctx.strokeStyle = '#64748b'
      ctx.strokeRect(w * 0.20, h * 0.55, w * 0.60, h * 0.35)
    } else if (style.startsWith('df4b-')) {
      if (params.carType === 'head') {
        // === 货运机车车顶：根据具体动力与国家车型实现差异化、清爽、低反差专属车顶 ===

        if (style === 'df4b-jrf-red-thunder' || style === 'df4b-jrf-blue-momotaro') {
          // --- 1. 日本 JR 货物电力机车车顶 (EF510 / EF210)：极简防滑走道 + 高压母线与电气设备舱 (非柴油风扇) ---
          ctx.fillStyle = '#2b3644'
          ctx.fillRect(0, 0, w, h)

          // 浅银灰中央防滑检修走道
          ctx.fillStyle = '#94a3b8'
          ctx.fillRect(w * 0.28, h * 0.08, w * 0.44, h * 0.84)
          ctx.strokeStyle = '#64748b'
          ctx.lineWidth = 1.2
          ctx.strokeRect(w * 0.28, h * 0.08, w * 0.44, h * 0.84)

          // 两端受电弓底座安装区凹槽
          ctx.fillStyle = '#1e2836'
          ctx.fillRect(w * 0.32, h * 0.12, w * 0.36, h * 0.16)
          ctx.fillRect(w * 0.32, h * 0.72, w * 0.36, h * 0.16)

          // 红色/金黄高压绝缘母线与避雷器
          ctx.strokeStyle = '#dc2626'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(w * 0.50, h * 0.28)
          ctx.lineTo(w * 0.50, h * 0.72)
          ctx.stroke()

          // 白色陶瓷绝缘子基座
          for (const iy of [0.32, 0.44, 0.56, 0.68]) {
            ctx.fillStyle = '#f8fafc'
            ctx.beginPath()
            ctx.arc(w * 0.50, h * iy, 4, 0, Math.PI * 2)
            ctx.fill()
          }

        } else if (style === 'df4b-sbb-cargo') {
          // --- 2. 瑞士联邦铁路 SBB Cargo (Traxx / Re 482) 欧系电力机车车顶：浅灰底色 + 横向加强筋与紧凑电气舱 ---
          ctx.fillStyle = '#334155'
          ctx.fillRect(0, 0, w, h)

          // 浅灰走道
          ctx.fillStyle = '#94a3b8'
          ctx.fillRect(w * 0.25, h * 0.06, w * 0.50, h * 0.88)

          // 简洁横向加强筋
          ctx.strokeStyle = '#475569'
          ctx.lineWidth = 1.5
          for (let y = h * 0.15; y < h * 0.85; y += h * 0.10) {
            ctx.beginPath()
            ctx.moveTo(w * 0.25, y)
            ctx.lineTo(w * 0.75, y)
            ctx.stroke()
          }

          // 中央空调与逆变器散热箱
          ctx.fillStyle = '#e2e8f0'
          ctx.fillRect(w * 0.32, h * 0.42, w * 0.36, h * 0.16)
          ctx.strokeStyle = '#64748b'
          ctx.lineWidth = 1
          ctx.strokeRect(w * 0.32, h * 0.42, w * 0.36, h * 0.16)

        } else if (style === 'df4b-bnsf-orange') {
          // --- 3. 北美 BNSF 重载机车 (GE/EMD)：暖炭灰车顶 + 动态制动电阻舱 + 简洁低轮廓排气 ---
          ctx.fillStyle = '#272a30'
          ctx.fillRect(0, 0, w, h)

          // 前部动态制动电阻箱 (Dynamic Brake Hatch)
          ctx.fillStyle = '#3f4754'
          ctx.fillRect(w * 0.24, h * 0.16, w * 0.52, h * 0.22)
          ctx.strokeStyle = '#5a6678'
          ctx.lineWidth = 1.2
          ctx.strokeRect(w * 0.24, h * 0.16, w * 0.52, h * 0.22)

          // 简洁排气烟道
          ctx.fillStyle = '#1c1f24'
          ctx.fillRect(w * 0.36, h * 0.46, w * 0.28, h * 0.10)

          // 后部微型低轮廓散热扇 (纵横比自适应纠偏，消除展开与3D贴图缩放导致的椭圆畸变，确保正圆)
          const physW = 38
          const physH = 140
          const aspectCorrection = (physH / physW) / (h / w)
          const smallFanRx = w * 0.24
          const smallFanRy = smallFanRx / aspectCorrection

          ctx.fillStyle = '#1c1f24'
          ctx.beginPath()
          ctx.ellipse(w * 0.50, h * 0.72, smallFanRx, smallFanRy, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = '#5a6678'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.ellipse(w * 0.50, h * 0.72, smallFanRx, smallFanRy, 0, 0, Math.PI * 2)
          ctx.stroke()

        } else {
          // --- 4. 国铁东风 4B 经典内燃机车车顶 (柔和工业钢灰 + 清爽低对比度双散热风扇) ---
          ctx.fillStyle = '#2e3844'
          ctx.fillRect(0, 0, w, h)

          // 清爽低反差双冷却风扇 (微凸金属圈 + 4 片大桨叶，纵横比精准对齐，确保2D展开图与3D视图中均为100%绝对正圆)
          const physW = 38
          const physH = 140
          const aspectCorrection = (physH / physW) / (h / w)
          const fanRx = w * 0.32
          const fanRy = fanRx / aspectCorrection

          const drawGentleFan = (cy: number) => {
            // 浅凹坑
            ctx.fillStyle = '#1e2630'
            ctx.beginPath()
            ctx.ellipse(w * 0.5, cy, fanRx, fanRy, 0, 0, Math.PI * 2)
            ctx.fill()
            // 4 片简洁叶片
            ctx.strokeStyle = '#4a5768'
            ctx.lineWidth = 2
            for (let a = 0; a < Math.PI; a += Math.PI / 2) {
              ctx.beginPath()
              ctx.moveTo(w * 0.5 + Math.cos(a) * (fanRx * 0.88), cy + Math.sin(a) * (fanRy * 0.88))
              ctx.lineTo(w * 0.5 - Math.cos(a) * (fanRx * 0.88), cy - Math.sin(a) * (fanRy * 0.88))
              ctx.stroke()
            }
            // 柔和金属外圈
            ctx.strokeStyle = '#64748b'
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.ellipse(w * 0.5, cy, fanRx, fanRy, 0, 0, Math.PI * 2)
            ctx.stroke()
          }
          drawGentleFan(h * 0.28)
          drawGentleFan(h * 0.72)

          // 中央简洁排气罩
          ctx.fillStyle = '#1e2630'
          ctx.fillRect(w * 0.36, h * 0.46, w * 0.28, h * 0.08)
          ctx.strokeStyle = '#4a5768'
          ctx.lineWidth = 1
          ctx.strokeRect(w * 0.36, h * 0.46, w * 0.28, h * 0.08)
        }

      } else if (params.carType === 'middle') {
        // === 集装箱平车顶部：宽距柔和波纹防滑顶板 (无过密黑条，支持第 2 节/第 3 节平车异色搭配) ===
        const isVariant2 = params.middleVariant === 2 || params.carRole === 'middle_2'
        let c1Color = isVariant2 ? '#c97f32' : '#2b4d70'
        let c2Color = isVariant2 ? '#327ea8' : '#2d5438'
        if (style === 'df4b-orange') {
          c1Color = isVariant2 ? '#963940' : '#c97f32'
          c2Color = isVariant2 ? '#eae7df' : '#2d4b68'
        } else if (style === 'df4b-jrf-red-thunder') {
          c1Color = isVariant2 ? '#d69e2e' : '#963940'
          c2Color = isVariant2 ? '#8a3339' : '#284666'
        } else if (style === 'df4b-jrf-blue-momotaro') {
          c1Color = isVariant2 ? '#284666' : '#d69e2e'
          c2Color = isVariant2 ? '#963940' : '#8a3339'
        } else if (style === 'df4b-bnsf-orange') {
          c1Color = isVariant2 ? '#c97f32' : '#cb6323'
          c2Color = isVariant2 ? '#2d4b68' : '#eae7df'
        } else if (style === 'df4b-sbb-cargo') {
          c1Color = isVariant2 ? '#eae7df' : '#244d7d'
          c2Color = isVariant2 ? '#2d5438' : '#d96427'
        } else if (style === 'df4b-blue') {
          c1Color = isVariant2 ? '#2b4d70' : '#327ea8'
          c2Color = isVariant2 ? '#c97f32' : '#aa3d64'
        }

        // 前集装箱顶
        ctx.fillStyle = c1Color
        ctx.fillRect(0, 0, w, h * 0.49)
        // 后集装箱顶
        ctx.fillStyle = c2Color
        ctx.fillRect(0, h * 0.51, w, h * 0.49)

        // 宽距柔和波纹
        const drawBroadRoofRibs = (startY: number, endY: number) => {
          for (let y = startY + 16; y < endY - 16; y += 18) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
            ctx.fillRect(w * 0.12, y, w * 0.76, 2)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.18)'
            ctx.fillRect(w * 0.12, y + 2, w * 0.76, 1.5)
          }
        }
        drawBroadRoofRibs(0, h * 0.49)
        drawBroadRoofRibs(h * 0.51, h)

      } else {
        // === 散货煤炭敞车顶部：柔和磨砂煤炭质感 ===
        ctx.fillStyle = '#222832'
        ctx.fillRect(0, 0, w, h)

        // 柔和立体颗粒
        ctx.fillStyle = '#171c24'
        for (let y = 10; y < h - 10; y += 24) {
          for (let x = 10; x < w - 10; x += 20) {
            ctx.beginPath()
            ctx.arc(x + 6, y + 6, 8, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        // 边框
        ctx.strokeStyle = '#3b4654'
        ctx.lineWidth = 2
        ctx.strokeRect(0, 0, w, h)
      }
    } else {
      if (style === 'commuter-hankyu') {
        // 阪急象牙白顶
        ctx.fillStyle = '#f8fafc'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#cbd5e1'
        const ribCount = 12
        for (let i = 1; i < ribCount; i++) {
          const y = (h / ribCount) * i
          ctx.fillRect(w * 0.15, y, w * 0.7, 2)
        }
      } else {
        ctx.fillStyle = roofColor || '#64748b'
        ctx.fillRect(0, 0, w, h)

        ctx.fillStyle = '#1e293b'
        const ribCount = 14
        for (let i = 1; i < ribCount; i++) {
          const y = (h / ribCount) * i
          ctx.fillRect(w * 0.15, y, w * 0.7, 3)
        }
      }
    }

    return canvas
  }

  /**
   * 绘制车头贴图
   */
  private drawFrontView(w: number, h: number, params: any): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    const { primaryColor, secondaryColor, accentColor, windowColor, frameColor, theme, category, consistId, customText } = params

    const style = this.resolveLiveryStyle(theme, category, consistId)

    ctx.fillStyle = primaryColor || '#e2e8f0'
    ctx.fillRect(0, 0, w, h)

    // 1. 18米双节巨龙手风琴折叠铰接棚风挡 (Articulated Bellows)
    if (params.carType === 'tail' && (category === 'bus' || style.startsWith('bus-articulated-'))) {
      ctx.fillStyle = '#09090b'
      ctx.fillRect(0, 0, w, h)
      // 黑色胶皮折叠褶皱线条 (Pleated Folding Bellows)
      const pleatCount = 14
      for (let i = 0; i < pleatCount; i++) {
        const y = (h / pleatCount) * i
        ctx.fillStyle = i % 2 === 0 ? '#18181b' : '#27272a'
        ctx.fillRect(w * 0.05, y, w * 0.90, h / pleatCount)
        ctx.strokeStyle = '#3f3f46'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(w * 0.05, y)
        ctx.lineTo(w * 0.95, y)
        ctx.stroke()
      }
      // 中央铝合金铰接安全密封环
      ctx.fillStyle = '#71717a'
      ctx.fillRect(w * 0.15, h * 0.20, w * 0.70, h * 0.60)
      ctx.fillStyle = '#18181b'
      ctx.fillRect(w * 0.20, h * 0.25, w * 0.60, h * 0.50)
      return canvas
    }

    // 1.5 经典双层公路客车前脸 (Double-Decker Bus Front)
    if (style.startsWith('bus-double-')) {
      if (style === 'bus-double-london-red') {
        ctx.fillStyle = '#982127'
        ctx.fillRect(0, 0, w, h)
      } else if (style === 'bus-double-kmb-gold') {
        ctx.fillStyle = '#d5c7ab'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#802028'
        ctx.fillRect(0, h * 0.44, w, 5)
      } else {
        ctx.fillStyle = '#8c222c'
        ctx.fillRect(0, 0, w, h)
      }

      // 顶部线路牌箱
      ctx.fillStyle = '#111827'
      ctx.fillRect(w * 0.15, h * 0.02, w * 0.70, h * 0.07)
      ctx.strokeStyle = '#e2e8f0'
      ctx.lineWidth = 1
      ctx.strokeRect(w * 0.15, h * 0.02, w * 0.70, h * 0.07)
      if (customText && customText.enabled) {
        const routeText = customText.slots?.routeNumber ?? customText.trainNumber ?? '15'
        const destText = customText.slots?.destination ?? customText.destination ?? 'TRAFALGAR SQ'
        ctx.fillStyle = '#fef08a'
        ctx.font = 'bold 11px monospace'
        ctx.textAlign = 'center'
        ctx.fillText([routeText, destText].filter(Boolean).join('  '), w * 0.50, h * 0.07)
      }

      // 中层分割腰线 (Y: 0.40..0.435, 与侧身腰线完全水平贯通)
      ctx.fillStyle = accentColor || '#d49b35'
      ctx.fillRect(0, h * 0.40, w, h * 0.035)

      // 2 楼曲面全景大窗 (2nd Floor Front Window: Y=0.08..0.38, 与侧面 2 楼窗户高度 100% 水平对齐)
      ctx.fillStyle = '#020617'
      ctx.beginPath()
      ctx.roundRect(w * 0.08, h * 0.08, w * 0.84, h * 0.30, [5, 5, 2, 2])
      ctx.fill()
      ctx.strokeStyle = frameColor || '#334155'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // 1 楼司机与乘客前挡风玻璃 (1st Floor Front Window: Y=0.47..0.77, 与侧面 1 楼窗户高度 100% 水平对齐)
      ctx.fillStyle = '#020617'
      ctx.beginPath()
      ctx.roundRect(w * 0.08, h * 0.47, w * 0.84, h * 0.30, [4, 4, 2, 2])
      ctx.fill()
      ctx.strokeStyle = frameColor || '#334155'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // 1 楼雨刮器
      ctx.strokeStyle = '#64748b'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(w * 0.30, h * 0.75)
      ctx.lineTo(w * 0.22, h * 0.54)
      ctx.moveTo(w * 0.70, h * 0.75)
      ctx.lineTo(w * 0.62, h * 0.54)
      ctx.stroke()

      // 双前大灯组
      for (const lx of [w * 0.16, w * 0.84]) {
        ctx.fillStyle = '#0f172a'
        ctx.beginPath()
        ctx.arc(lx, h * 0.84, 7, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#fef3c7'
        ctx.beginPath()
        ctx.arc(lx, h * 0.84, 4.5, 0, Math.PI * 2)
        ctx.fill()
      }
      return canvas
    }

    // 1.8 香港双层叮叮车前脸 (Hong Kong Ding Ding Tram Front - 窄格复古比例)
    if (style.startsWith('hk-tram-')) {
      if (style === 'hk-tram-green') {
        ctx.fillStyle = '#1d3e2b'
        ctx.fillRect(0, 0, w, h)
      } else if (style === 'hk-tram-retro-red') {
        ctx.fillStyle = '#7e2229'
        ctx.fillRect(0, 0, w, h * 0.45)
        ctx.fillStyle = '#1d3e2b'
        ctx.fillRect(0, h * 0.45, w, h * 0.55)
      } else {
        ctx.fillStyle = '#294867'
        ctx.fillRect(0, 0, w, h)
      }

      // 顶部行先指示木牌
      ctx.fillStyle = '#fdfbf7'
      ctx.fillRect(w * 0.18, h * 0.03, w * 0.64, h * 0.08)
      ctx.strokeStyle = '#3d2817'
      ctx.lineWidth = 1.5
      ctx.strokeRect(w * 0.18, h * 0.03, w * 0.64, h * 0.08)
      const dest = (customText && customText.enabled) ? (customText.slots?.destination || '堅尼地城 ⇋ 跑馬地') : '堅尼地城 ⇋ 跑馬地'
      ctx.fillStyle = '#7e2229'
      ctx.font = 'bold 9px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(dest, w * 0.50, h * 0.09)

      // 2 楼双推拉木框窄窗 (Upper Deck: 2 Narrow Panes)
      const uFrontTop = h * 0.14
      const uFrontH = h * 0.22
      // 左窄窗
      ctx.fillStyle = '#3d2817'
      ctx.fillRect(w * 0.14, uFrontTop, w * 0.33, uFrontH)
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(w * 0.16, uFrontTop + 2, w * 0.29, uFrontH - 4)
      // 右窄窗
      ctx.fillStyle = '#3d2817'
      ctx.fillRect(w * 0.53, uFrontTop, w * 0.33, uFrontH)
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(w * 0.55, uFrontTop + 2, w * 0.29, uFrontH - 4)

      // 1 楼驾驶室前窗 (Lower Deck Front Window)
      const lFrontTop = h * 0.50
      const lFrontH = h * 0.24
      ctx.fillStyle = '#3d2817'
      ctx.fillRect(w * 0.14, lFrontTop, w * 0.72, lFrontH)
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(w * 0.16, lFrontTop + 2, w * 0.68, lFrontH - 4)
      ctx.fillStyle = '#5a3d24'
      ctx.fillRect(w * 0.50 - 1, lFrontTop + 2, 2, lFrontH - 4)

      // 下部经典单盏居中黄铜大圆灯 (Central Headlight)
      ctx.fillStyle = '#c89635'
      ctx.beginPath()
      ctx.arc(w * 0.50, h * 0.84, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#fef3c7'
      ctx.beginPath()
      ctx.arc(w * 0.50, h * 0.84, 5, 0, Math.PI * 2)
      ctx.fill()

      return canvas
    }

    // 2. 经典有轨电车与街头轻轨前脸 (Tram Front Face)
    if (category === 'vehicle' || style.startsWith('tram-')) {
      if (style === 'tram-enoden-green') {
        // 镰仓江之电 300形 经典前脸 (柔和复古色调)
        ctx.fillStyle = '#faecd2' // 温暖奶油黄上额
        ctx.fillRect(0, 0, w, h * 0.45)
        ctx.fillStyle = primaryColor || '#1e422d' // 古松绿下巴
        ctx.fillRect(0, h * 0.45, w, h * 0.55)
        ctx.fillStyle = '#b87b28'
        ctx.fillRect(0, h * 0.45, w, 2.5)

        // 观景大风挡 (三分割前窗)
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(w * 0.10, h * 0.16, w * 0.80, h * 0.30)
        ctx.fillStyle = '#cbd5e1'
        ctx.fillRect(w * 0.36, h * 0.16, 2, h * 0.30)
        ctx.fillRect(w * 0.64, h * 0.16, 2, h * 0.30)

        // 车顶中央单盏暖黄圆大灯
        ctx.fillStyle = '#faecd2'
        ctx.beginPath()
        ctx.arc(w * 0.50, h * 0.08, 7.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#b87b28'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // 经典木质行先方向板「鎌倉」
        const dest = (customText && customText.enabled) ? (customText.slots?.destination || '鎌倉') : '鎌倉'
        ctx.fillStyle = '#fdfbf7'
        ctx.fillRect(w * 0.32, h * 0.56, w * 0.36, 15)
        ctx.strokeStyle = '#1e293b'
        ctx.strokeRect(w * 0.32, h * 0.56, w * 0.36, 15)
        ctx.fillStyle = '#8c222c'
        ctx.font = 'bold 10px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(dest, w * 0.50, h * 0.67)
        return canvas
      } else if (style === 'tram-modern-cyan') {
        // 现代低地板流线轻轨前脸
        ctx.fillStyle = '#f5f7fa'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#020617'
        ctx.beginPath()
        ctx.roundRect(w * 0.08, h * 0.12, w * 0.84, h * 0.55, 8)
        ctx.fill()
        ctx.fillStyle = '#3b6f80'
        ctx.fillRect(w * 0.10, h * 0.75, w * 0.80, 4)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(w * 0.12, h * 0.70, w * 0.20, 2.5)
        ctx.fillRect(w * 0.68, h * 0.70, w * 0.20, 2.5)
        return canvas
      } else {
        // 墨尔本绿金
        ctx.fillStyle = '#faecd2'
        ctx.fillRect(0, 0, w, h * 0.40)
        ctx.fillStyle = '#1f422e'
        ctx.fillRect(0, h * 0.40, w, h * 0.60)
        ctx.fillStyle = '#c49238'
        ctx.fillRect(0, h * 0.40, w, 3)
        return canvas
      }
    }

    // 3. 东风 4B 重载货运系列 (DF4B Freight Front View)
    if (style.startsWith('df4b-')) {
      if (params.carType === 'head') {
        // === 东风 4B / 货运机车头 I端经典前脸 ===
        if (style === 'df4b-watermelon') {
          ctx.fillStyle = '#264e36' // 沉稳复古墨绿
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#f4ebd0'
          ctx.fillRect(0, h * 0.52, w, 4)
          ctx.fillRect(0, h * 0.56, w, 4)
          // 前脸中央经典红星徽标
          const cx = w * 0.5
          const cy = h * 0.62
          ctx.fillStyle = '#dc2626'
          ctx.beginPath()
          ctx.arc(cx, cy, 13, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = '#f4ebd0'
          ctx.lineWidth = 1.5
          ctx.stroke()
          ctx.fillStyle = '#f4ebd0'
          ctx.font = 'bold 15px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText('★', cx, cy + 5)
        } else if (style === 'df4b-orange') {
          ctx.fillStyle = '#b8542b' // 柔和赭石暖橙
          ctx.fillRect(0, 0, w, h)
          // 破风米白 V 字拉花
          ctx.fillStyle = '#f1ede4'
          ctx.beginPath()
          ctx.moveTo(0, h * 0.45)
          ctx.lineTo(w * 0.5, h * 0.75)
          ctx.lineTo(w, h * 0.45)
          ctx.lineTo(w, h * 0.55)
          ctx.lineTo(w * 0.5, h * 0.85)
          ctx.lineTo(0, h * 0.55)
          ctx.fill()
        } else if (style === 'df4b-jrf-red-thunder') {
          // JR Freight EF510 红雷前脸
          ctx.fillStyle = '#9a373f'
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#e2e8f0'
          ctx.fillRect(0, h * 0.50, w, 6)
          ctx.fillStyle = '#f8fafc'
          ctx.fillRect(w * 0.35, h * 0.60, w * 0.30, 8)
        } else if (style === 'df4b-jrf-blue-momotaro') {
          // JR Freight EF210 桃太郎前脸
          ctx.fillStyle = '#cbd5e1'
          ctx.fillRect(0, 0, w, h * 0.45)
          ctx.fillStyle = '#244872'
          ctx.fillRect(0, h * 0.45, w, h * 0.55)
          ctx.fillStyle = '#f8fafc'
          ctx.fillRect(0, h * 0.44, w, 3.5)
        } else if (style === 'df4b-bnsf-orange') {
          // 北美 BNSF 经典南瓜橙 + 前脸深灰斜拉花
          ctx.fillStyle = '#d66824'
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#27272a'
          ctx.beginPath()
          ctx.moveTo(0, h * 0.50)
          ctx.lineTo(w, h * 0.50)
          ctx.lineTo(w, h * 0.72)
          ctx.lineTo(0, h * 0.72)
          ctx.fill()
          ctx.fillStyle = '#f59e0b'
          ctx.fillRect(0, h * 0.49, w, 3)
          ctx.fillRect(0, h * 0.72, w, 3)
        } else if (style === 'df4b-sbb-cargo') {
          // 瑞士 SBB Cargo 前脸 + 瑞士红十字徽章
          ctx.fillStyle = '#244d7d'
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#f8fafc'
          ctx.fillRect(0, h * 0.48, w, 8)
          // 瑞士十字标
          const scx = w * 0.5, scy = h * 0.64
          ctx.fillStyle = '#dc2626'
          ctx.fillRect(scx - 10, scy - 10, 20, 20)
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(scx - 7, scy - 2.5, 14, 5)
          ctx.fillRect(scx - 2.5, scy - 7, 5, 14)
        } else {
          ctx.fillStyle = '#2b5482' // 沉稳蓝太湖
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#f1f5f9'
          ctx.fillRect(0, h * 0.52, w, 7)
        }

        // 双前倾大视野观察窗 (带柔和密封条 + 玻璃反光)
        ctx.fillStyle = '#162230'
        ctx.fillRect(w * 0.10, h * 0.20, w * 0.36, h * 0.28)
        ctx.fillRect(w * 0.54, h * 0.20, w * 0.36, h * 0.28)
        ctx.strokeStyle = '#4a586a'
        ctx.lineWidth = 1.2
        ctx.strokeRect(w * 0.10, h * 0.20, w * 0.36, h * 0.28)
        ctx.strokeRect(w * 0.54, h * 0.20, w * 0.36, h * 0.28)

        // 玻璃高光
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(w * 0.12, h * 0.44)
        ctx.lineTo(w * 0.38, h * 0.22)
        ctx.moveTo(w * 0.56, h * 0.44)
        ctx.lineTo(w * 0.82, h * 0.22)
        ctx.stroke()

        // 黑色金属雨刮器
        ctx.strokeStyle = '#94a3b8'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(w * 0.28, h * 0.46)
        ctx.lineTo(w * 0.18, h * 0.24)
        ctx.moveTo(w * 0.72, h * 0.46)
        ctx.lineTo(w * 0.62, h * 0.24)
        ctx.stroke()

        // 顶部机车双前照大灯 (镀铬外框 + 晶莹亮黄聚光透镜)
        ctx.fillStyle = '#26313d'
        ctx.fillRect(w * 0.36, h * 0.05, w * 0.28, h * 0.12)
        ctx.strokeStyle = '#94a3b8'
        ctx.lineWidth = 1.2
        ctx.strokeRect(w * 0.36, h * 0.05, w * 0.28, h * 0.12)
        // 双灯珠
        ctx.fillStyle = '#fef08a'
        ctx.beginPath()
        ctx.arc(w * 0.43, h * 0.11, 5.5, 0, Math.PI * 2)
        ctx.arc(w * 0.57, h * 0.11, 5.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(w * 0.42, h * 0.10, 2, 0, Math.PI * 2)
        ctx.arc(w * 0.56, h * 0.10, 2, 0, Math.PI * 2)
        ctx.fill()

        // 车头机车车号铜铸金属牌 (仅在用户开启自定义文字时显示)
        ctx.fillStyle = '#b45309'
        ctx.fillRect(w * 0.28, h * 0.74, w * 0.44, h * 0.08)
        ctx.strokeStyle = '#78350f'
        ctx.lineWidth = 1
        ctx.strokeRect(w * 0.28, h * 0.74, w * 0.44, h * 0.08)
        if (customText && customText.enabled) {
          const frontTrainNo = customText.slots?.trainNumber || customText.trainNumber || ''
          if (frontTrainNo) {
            ctx.fillStyle = '#fef08a'
            ctx.font = 'bold 9.5px monospace'
            ctx.textAlign = 'center'
            ctx.fillText(frontTrainNo, w * 0.50, h * 0.80)
          }
        }

        // 底部重型排障器 (带经典黑黄安全斑马条纹 + 红色重联风管 + 黑色车钩)
        ctx.fillStyle = '#222b36'
        ctx.fillRect(w * 0.04, h * 0.84, w * 0.92, h * 0.16)
        // 斑马警示条
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 2.5
        for (let x = w * 0.08; x < w * 0.92; x += 11) {
          ctx.beginPath()
          ctx.moveTo(x, h * 0.85)
          ctx.lineTo(x + 7, h * 0.99)
          ctx.stroke()
        }
        // 中央车钩
        ctx.fillStyle = '#171d24'
        ctx.fillRect(w * 0.44, h * 0.86, w * 0.12, h * 0.10)
        // 红色重联风管
        ctx.fillStyle = '#dc2626'
        ctx.fillRect(w * 0.32, h * 0.88, 3, 7)
        ctx.fillRect(w * 0.66, h * 0.88, 3, 7)

        return canvas
      } else if (params.carType === 'middle') {
        // === 集装箱平车端面：真实双开集装箱门 + 4 根垂直镀铬锁杆 + 凸轮锁扣 ===
        const isVariant2 = params.middleVariant === 2 || params.carRole === 'middle_2'
        let endBoxColor = isVariant2 ? '#c97f32' : '#2b4d70'
        if (style === 'df4b-orange') endBoxColor = isVariant2 ? '#963940' : '#c97f32'
        else if (style === 'df4b-jrf-red-thunder') endBoxColor = isVariant2 ? '#d69e2e' : '#963940'
        else if (style === 'df4b-jrf-blue-momotaro') endBoxColor = isVariant2 ? '#284666' : '#d69e2e'
        else if (style === 'df4b-bnsf-orange') endBoxColor = isVariant2 ? '#c97f32' : '#cb6323'
        else if (style === 'df4b-sbb-cargo') endBoxColor = isVariant2 ? '#eae7df' : '#244d7d'
        else if (style === 'df4b-blue') endBoxColor = isVariant2 ? '#2b4d70' : '#327ea8'

        // 集装箱箱体端面
        ctx.fillStyle = endBoxColor
        ctx.fillRect(0, 0, w, h * 0.82)

        // 门框柔和密封胶条
        ctx.strokeStyle = '#1e2632'
        ctx.lineWidth = 1.5
        ctx.strokeRect(2, 2, w - 4, h * 0.82 - 4)

        // 中央对开门缝
        ctx.fillStyle = '#1e2632'
        ctx.fillRect(w * 0.5 - 1.5, 4, 3, h * 0.82 - 8)

        // 4 根垂直镀铬锁杆 (Lock Rods) 与锁销凸轮 (Cam Keepers)
        const rodPositions = [w * 0.22, w * 0.38, w * 0.62, w * 0.78]
        for (const rx of rodPositions) {
          ctx.fillStyle = '#94a3b8'
          ctx.fillRect(rx - 1.5, 6, 3, h * 0.82 - 12)
          // 顶部/底部锁座
          ctx.fillStyle = '#475569'
          ctx.fillRect(rx - 3, 5, 6, 4)
          ctx.fillRect(rx - 3, h * 0.82 - 9, 6, 4)
          // 开关把手
          ctx.fillStyle = '#cbd5e1'
          ctx.fillRect(rx - 1.5, h * 0.44, 8, 3)
        }

        // 四角 ISO 铸钢角件
        ctx.fillStyle = '#1e2632'
        ctx.fillRect(1, 1, 7, 7)
        ctx.fillRect(w - 8, 1, 7, 7)
        ctx.fillRect(1, h * 0.82 - 8, 7, 7)
        ctx.fillRect(w - 8, h * 0.82 - 8, 7, 7)

        // 底部重载平车端梁与缓冲车钩
        ctx.fillStyle = '#222b36'
        ctx.fillRect(0, h * 0.82, w, h * 0.18)
        ctx.fillStyle = '#3a4759'
        ctx.fillRect(0, h * 0.82, w, 3)
        ctx.fillStyle = '#171d24'
        ctx.fillRect(w * 0.42, h * 0.86, w * 0.16, h * 0.10)

        return canvas
      } else {
        // === 散货煤炭敞车端面 (带冲压横向加强筋 + 登车扶梯，纯净无默认字) ===
        ctx.fillStyle = '#2d3540'
        ctx.fillRect(0, 0, w, h)

        // 横向冲压加强梁
        for (let y = h * 0.20; y < h * 0.80; y += h * 0.18) {
          ctx.fillStyle = '#1e242c'
          ctx.fillRect(4, y, w - 8, 2)
          ctx.fillStyle = '#4a5768'
          ctx.fillRect(4, y + 2, w - 8, 2.5)
        }

        // 右侧登车检修防滑梯 (Handrails / Ladder)
        ctx.strokeStyle = '#94a3b8'
        ctx.lineWidth = 1.2
        ctx.strokeRect(w * 0.72, h * 0.15, w * 0.18, h * 0.68)
        for (let ly = h * 0.25; ly < h * 0.80; ly += 10) {
          ctx.beginPath()
          ctx.moveTo(w * 0.72, ly)
          ctx.lineTo(w * 0.90, ly)
          ctx.stroke()
        }

        // 仅在用户开启自定义文字时显示车号
        if (customText && customText.enabled) {
          const trainNo = customText.slots?.trainNumber || customText.trainNumber || ''
          if (trainNo) {
            ctx.fillStyle = '#fef08a'
            ctx.font = 'bold 6px monospace'
            ctx.textAlign = 'left'
            ctx.fillText(trainNo, w * 0.08, h * 0.40)
          }
        }

        // 底部车钩
        ctx.fillStyle = '#222b36'
        ctx.fillRect(0, h * 0.85, w, h * 0.15)
        ctx.fillStyle = '#171d24'
        ctx.fillRect(w * 0.42, h * 0.87, w * 0.16, h * 0.11)

        return canvas
      }
    }

    if (category === 'bus') {
      // 1. 各车型前脸专属涂装底色
      if (style === 'bus-london-red') {
        // 伦敦纯红巴士前脸: 100% 通体正红
        ctx.fillStyle = primaryColor || '#dc2626'
        ctx.fillRect(0, 0, w, h)
      } else if (style === 'bus-articulated-beijing') {
        // 北京大通道红白前脸
        ctx.fillStyle = '#fef2f2'
        ctx.fillRect(0, 0, w, h * 0.45)
        ctx.fillStyle = '#b91c1c'
        ctx.fillRect(0, h * 0.45, w, h * 0.55)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, h * 0.45, w, 2.5)
      } else if (style === 'bus-articulated-metro') {
        // 欧洲都市铰接快线黑钛前脸
        ctx.fillStyle = '#1e293b'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#f97316'
        ctx.fillRect(w * 0.10, h * 0.78, w * 0.80, 4)
      } else if (style === 'bus-retro-green') {
        // 复古绿电车前脸: 上半奶油白 + 下半复古绿
        ctx.fillStyle = secondaryColor || '#fef3c7'
        ctx.fillRect(0, 0, w, h * 0.45)
        ctx.fillStyle = primaryColor || '#166534'
        ctx.fillRect(0, h * 0.45, w, h * 0.55)
        ctx.fillStyle = '#d97706'
        ctx.fillRect(0, h * 0.45, w, 2.5)
      } else if (style === 'bus-eco-cyan') {
        // 新能源纯白前脸: 极简纯白 + 科技青色翼片
        ctx.fillStyle = primaryColor || '#f1f5f9'
        ctx.fillRect(0, 0, w, h)
        // 科技青绿前唇拉花
        ctx.fillStyle = '#06b6d4'
        ctx.beginPath()
        ctx.moveTo(w * 0.10, h * 0.70)
        ctx.lineTo(w * 0.30, h * 0.82)
        ctx.lineTo(w * 0.10, h * 0.82)
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(w * 0.90, h * 0.70)
        ctx.lineTo(w * 0.70, h * 0.82)
        ctx.lineTo(w * 0.90, h * 0.82)
        ctx.fill()
      } else {
        // 71路经典蓝白前脸: 珍珠白前额 + 水墨蓝下巴 + 黄色羽翼
        ctx.fillStyle = secondaryColor || '#f8fafc'
        ctx.fillRect(0, 0, w, h * 0.45)
        ctx.fillStyle = primaryColor || '#0055b8'
        ctx.fillRect(0, h * 0.45, w, h * 0.55)
        ctx.fillStyle = accentColor || '#fbbf24'
        ctx.fillRect(0, h * 0.45, w, 3)
      }

      // 2. 车头顶部大号 LED 线路牌箱 (仅在开启自定义时绘制文字)
      ctx.fillStyle = '#020617'
      ctx.fillRect(w * 0.15, h * 0.04, w * 0.70, h * 0.16)
      ctx.strokeStyle = style === 'bus-london-red' ? '#ffffff' : '#334155'
      ctx.lineWidth = 1.5
      ctx.strokeRect(w * 0.15, h * 0.04, w * 0.70, h * 0.16)

      if (customText && customText.enabled) {
        const routeText = customText.slots?.routeNumber ?? customText.trainNumber ?? ''
        const destText = customText.slots?.destination ?? customText.destination ?? ''
        if (routeText || destText) {
          ctx.fillStyle = style === 'bus-london-red' ? '#ffffff' : (customText.textColor || '#facc15')
          ctx.font = 'bold 16px monospace'
          ctx.textAlign = 'center'
          ctx.fillText([routeText, destText].filter(Boolean).join(' '), w * 0.50, h * 0.15)
        }
      }

      // 3. 超大曲面弧度前挡风玻璃
      ctx.fillStyle = '#020617'
      ctx.beginPath()
      ctx.roundRect(w * 0.08, h * 0.22, w * 0.84, h * 0.45, 6)
      ctx.fill()
      ctx.strokeStyle = frameColor || '#334155'
      ctx.lineWidth = 2
      ctx.stroke()

      // 雨刮器
      ctx.strokeStyle = '#475569'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(w * 0.35, h * 0.65)
      ctx.lineTo(w * 0.25, h * 0.35)
      ctx.moveTo(w * 0.65, h * 0.65)
      ctx.lineTo(w * 0.55, h * 0.35)
      ctx.stroke()

      // 4. 专属大灯造型 (复古车使用圆形大灯，现代车使用矩阵透镜)
      if (style === 'bus-retro-green') {
        // 复古经典圆形镀铬大灯
        const drawRetroLight = (cx: number) => {
          ctx.fillStyle = '#cbd5e1' // 镀铬外圈
          ctx.beginPath()
          ctx.arc(cx, h * 0.77, 10, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#fef08a' // 暖黄大灯
          ctx.beginPath()
          ctx.arc(cx, h * 0.77, 7, 0, Math.PI * 2)
          ctx.fill()
        }
        drawRetroLight(w * 0.16)
        drawRetroLight(w * 0.84)
        // 复古横向镀铬进气格栅
        ctx.fillStyle = '#94a3b8'
        for (let y = h * 0.72; y <= h * 0.80; y += 4) {
          ctx.fillRect(w * 0.32, y, w * 0.36, 2)
        }
      } else {
        // 现代矩阵透镜大灯 + 转向灯
        const drawHeadlight = (lx: number) => {
          ctx.fillStyle = '#0f172a'
          ctx.fillRect(lx, h * 0.72, w * 0.18, h * 0.10)
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.arc(lx + w * 0.06, h * 0.77, 6, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#f59e0b'
          ctx.fillRect(lx + w * 0.11, h * 0.74, w * 0.05, h * 0.06)
        }
        drawHeadlight(w * 0.08)
        drawHeadlight(w * 0.74)
      }

      // 5. 前保险杠与车牌 (仅在开启自定义时绘制车牌文字)
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(w * 0.05, h * 0.85, w * 0.90, h * 0.12)

      if (customText && customText.enabled && customText.slots?.licensePlate) {
        const plateText = customText.slots.licensePlate
        ctx.fillStyle = '#0284c7'
        ctx.fillRect(w * 0.30, h * 0.87, w * 0.40, h * 0.08)
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 1
        ctx.strokeRect(w * 0.30, h * 0.87, w * 0.40, h * 0.08)
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 11px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(plateText, w * 0.50, h * 0.93)
      } else {
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(w * 0.30, h * 0.87, w * 0.40, h * 0.08)
        ctx.strokeStyle = '#334155'
        ctx.lineWidth = 1
        ctx.strokeRect(w * 0.30, h * 0.87, w * 0.40, h * 0.08)
      }

      return canvas
    }

    if (category === 'steam') {
      ctx.fillStyle = '#09090b'
      ctx.fillRect(0, 0, w, h)

      ctx.beginPath()
      ctx.arc(w * 0.5, h * 0.52, w * 0.42, 0, Math.PI * 2)
      ctx.fillStyle = '#18181b'
      ctx.fill()
      ctx.lineWidth = 4
      ctx.strokeStyle = secondaryColor
      ctx.stroke()

      ctx.fillStyle = '#b45309'
      ctx.fillRect(w * 0.22, h * 0.48, w * 0.56, h * 0.14)
      ctx.lineWidth = 1.5
      ctx.strokeStyle = '#fef08a'
      ctx.strokeRect(w * 0.22, h * 0.48, w * 0.56, h * 0.14)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 13px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('D51 200', w * 0.5, h * 0.58)

      ctx.beginPath()
      ctx.arc(w * 0.5, h * 0.22, w * 0.14, 0, Math.PI * 2)
      ctx.fillStyle = '#fef08a'
      ctx.fill()
      ctx.lineWidth = 3
      ctx.strokeStyle = secondaryColor
      ctx.stroke()

      ctx.fillStyle = '#0f172a'
      ctx.fillRect(w * 0.1, h * 0.84, w * 0.8, h * 0.14)

    } else if (category === 'shinkansen') {
      if (style === 'shinkansen-doctor-yellow') {
        // 黄医生车头下唇排障器
        ctx.fillStyle = '#facc15'
        ctx.fillRect(0, 0, w, h)

        ctx.fillStyle = '#1e3a8a'
        ctx.fillRect(0, h * 0.32, w, 5)

        ctx.fillStyle = '#0f172a'
        ctx.fillRect(0, h * 0.40, w, h * 0.60)

      } else if (style === 'shinkansen-n700') {
        // N700S 纯白车头下唇排障器
        ctx.fillStyle = '#f8fafc'
        ctx.fillRect(0, 0, w, h)

        ctx.fillStyle = '#1d4ed8'
        ctx.fillRect(0, h * 0.32, w, 5)

        ctx.fillStyle = '#0f172a'
        ctx.fillRect(0, h * 0.40, w, h * 0.60)

      } else if (style === 'shinkansen-nankai-rapit') {
        // === 南海 50000系 特急 Rapi:t (纯正午夜深蓝 + 银色中脊破风线 + 穹顶全景风挡 + 纯净金属装甲，无任何腰线) ===
        ctx.fillStyle = '#0f2b5c' // 纯正午夜深蓝
        ctx.fillRect(0, 0, w, h)

        // 1. 穹顶圆弧驾驶舱前风挡 (大尺寸飞机式全景弧面玻璃)
        const winTop = h * 0.08
        const winH = h * 0.40
        const winW = w * 0.84
        const winX = w * 0.08

        // 钛灰外圈金属加固密封法兰
        ctx.fillStyle = '#64748b'
        ctx.beginPath()
        ctx.arc(w * 0.5, winTop + winW * 0.46, winW * 0.52, Math.PI * 1.05, Math.PI * 1.95, false)
        ctx.lineTo(winX + winW, winTop + winH)
        ctx.lineTo(winX, winTop + winH)
        ctx.closePath()
        ctx.fill()

        // 深黑座舱玻璃
        ctx.fillStyle = '#020617'
        ctx.beginPath()
        ctx.arc(w * 0.5, winTop + winW * 0.46 + 4, winW * 0.48, Math.PI * 1.05, Math.PI * 1.95, false)
        ctx.lineTo(winX + winW - 5, winTop + winH - 4)
        ctx.lineTo(winX + 5, winTop + winH - 4)
        ctx.closePath()
        ctx.fill()

        // 黑色单臂精细雨刮器
        ctx.strokeStyle = '#64748b'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(w * 0.50, winTop + winH - 4)
        ctx.lineTo(w * 0.62, winTop + winH * 0.45)
        ctx.stroke()

        // 2. 标志性银色金属中脊垂直分割破风线 (贯穿车顶穹顶至尖鼻底部)
        ctx.fillStyle = '#cbd5e1'
        ctx.fillRect(w * 0.5 - 3, 0, 6, h * 0.85)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(w * 0.5 - 1, 0, 2, h * 0.85)

        // 3. 车头两侧嵌壁式微型暗灯槽与精密铆钉
        ctx.fillStyle = '#334155'
        ctx.beginPath()
        ctx.arc(w * 0.18, h * 0.52, 4, 0, Math.PI * 2)
        ctx.arc(w * 0.82, h * 0.52, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#cbd5e1'
        ctx.beginPath()
        ctx.arc(w * 0.18, h * 0.52, 2, 0, Math.PI * 2)
        ctx.arc(w * 0.82, h * 0.52, 2, 0, Math.PI * 2)
        ctx.fill()

        // 装甲接缝铆钉点列
        ctx.fillStyle = '#64748b'
        for (let r = 0; r < 7; r++) {
          const rx = w * 0.22 + r * (w * 0.093)
          ctx.beginPath()
          ctx.arc(rx, h * 0.83, 2, 0, Math.PI * 2)
          ctx.fill()
        }

        // 4. 底部黑色机甲排障导流下铲
        ctx.fillStyle = '#090e17'
        ctx.fillRect(0, h * 0.85, w, h * 0.15)
        ctx.fillStyle = '#1e293b'
        ctx.fillRect(w * 0.25, h * 0.88, w * 0.50, 4)

      } else if (style === 'shinkansen-haruka-kitty' || style === 'shinkansen-haruka-classic' || style === 'shinkansen-haruka-orizuru') {
        // === 关空特急 Haruka 281系 车头正面前立面 (通体纯白 + 动漫风雅致樱花 + 双前照灯 + 优雅深蓝裙板，无文字，无Kitty肖像) ===
        ctx.fillStyle = '#ffffff' // 通体高雅纯白
        ctx.fillRect(0, 0, w, h)

        // 1. 真实还原官方动漫插画：唯美 S 型微风樱吹雪风痕与自然落樱 (无俗气孤立花球)
        this.drawHarukaFrontNoseSakura(ctx, w, h)

        // 2. 双内嵌式透镜前照大灯
        const lightY = h * 0.77
        for (const lx of [w * 0.16, w * 0.84]) {
          ctx.fillStyle = '#1e293b'
          ctx.beginPath()
          ctx.roundRect(lx - 12, lightY - 6, 24, 12, 4)
          ctx.fill()

          ctx.fillStyle = '#fef08a'
          ctx.beginPath()
          ctx.arc(lx - 4, lightY, 4, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.arc(lx + 4, lightY, 3.5, 0, Math.PI * 2)
          ctx.fill()
        }

        // 3. 底部标志性深蓝一体化裙边排障下唇 (带金细线)
        ctx.fillStyle = '#f59e0b'
        ctx.fillRect(0, h * 0.86, w, 2.5)
        ctx.fillStyle = '#0f2b5c'
        ctx.fillRect(0, h * 0.86 + 2.5, w, h * 0.14)

      } else if (style === 'cr400-fuxing-red' || style === 'cr400-fuxing-gold' || style === 'crh380a-hexie' || style === 'crh2-hexie-classic') {
        // === 🇨🇳 中国高铁 CR400 复兴号 / CRH 和谐号 前端底盘排障器与气动导流下铲 ===
        const isFuxingRed = style === 'cr400-fuxing-red'
        const isFuxingGold = style === 'cr400-fuxing-gold'
        const baseColor = isFuxingRed ? '#cbd5e1' : (isFuxingGold ? '#f8fafc' : '#ffffff')
        const stripeColor = isFuxingRed ? '#dc2626' : (isFuxingGold ? '#d97706' : '#0284c7')

        // 上部车身底色延伸 (与车头突出的雪白/浅银长鼻锥完全无缝融合)
        ctx.fillStyle = baseColor
        ctx.fillRect(0, 0, w, h)

        // 动感破风下腰细线
        ctx.fillStyle = stripeColor
        ctx.fillRect(0, h * 0.28, w, 4)

        // 下部：深黑科技排障器与气动导流下铲 (底盘导流板)
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(0, h * 0.36, w, h * 0.64)

        ctx.fillStyle = '#1e293b'
        ctx.fillRect(w * 0.12, h * 0.44, w * 0.76, h * 0.40)

        // 钛银导流下唇线
        ctx.fillStyle = '#94a3b8'
        ctx.fillRect(w * 0.18, h * 0.88, w * 0.64, 3.5)

      } else if (style === 'romancecar-gse-red' || style === 'romancecar-vse-white') {
        // === 🏔️ 小田急 70000形 GSE / 50000形 VSE 浪漫特快超大双层全景展望前脸 ===
        ctx.fillStyle = style === 'romancecar-gse-red' ? '#e11d48' : '#ffffff'
        ctx.fillRect(0, 0, w, h)

        if (style === 'romancecar-gse-red') {
          // 金色饰线
          ctx.fillStyle = '#d97706'
          ctx.fillRect(0, h * 0.72, w, 3)
        } else {
          ctx.fillStyle = '#ea580c'
          ctx.fillRect(0, h * 0.70, w, 3)
          ctx.fillStyle = '#d97706'
          ctx.fillRect(0, h * 0.74, w, 2)
        }

        // 2楼高位展望驾驶室小风挡
        ctx.fillStyle = '#020617'
        ctx.fillRect(w * 0.30, 4, w * 0.40, h * 0.12)

        // 1楼超大无遮挡全景客舱大挡风玻璃
        ctx.fillStyle = '#0f172a'
        ctx.beginPath()
        ctx.roundRect(w * 0.12, h * 0.20, w * 0.76, h * 0.44, [8, 8, 4, 4])
        ctx.fill()

        ctx.fillStyle = '#020617'
        ctx.beginPath()
        ctx.roundRect(w * 0.15, h * 0.23, w * 0.70, h * 0.38, [6, 6, 2, 2])
        ctx.fill()

        // 双侧水晶透镜高亮前照大灯
        for (const lx of [w * 0.20, w * 0.80]) {
          ctx.fillStyle = '#0f172a'
          ctx.beginPath()
          ctx.arc(lx, h * 0.78, 9, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#fef08a'
          ctx.beginPath()
          ctx.arc(lx, h * 0.78, 6, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.arc(lx - 1.5, h * 0.78 - 1.5, 2.5, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.fillStyle = '#0f172a'
        ctx.fillRect(0, h * 0.86, w, h * 0.14)

      } else if (style === 'shinkansen-300-nozomi' || style === 'shinkansen-0-classic' || style === 'shinkansen-e3-komachi' || style === 'shinkansen-683-thunderbird') {
        // === 🚆 新干线 300系 / 0系 / 铁胆火车侠系列前脸 ===
        if (style === 'shinkansen-0-classic') {
          // 0系 传奇子弹头: 标志性圆形发光光电前鼻锥
          ctx.fillStyle = '#f8fafc'
          ctx.fillRect(0, 0, w, h)

          // 经典深蓝下裙
          ctx.fillStyle = '#1e3a8a'
          ctx.fillRect(0, h * 0.62, w, h * 0.38)

          // 驾驶室圆润风挡
          ctx.fillStyle = '#0f172a'
          ctx.beginPath()
          ctx.roundRect(w * 0.22, h * 0.18, w * 0.56, h * 0.26, 6)
          ctx.fill()

          // 0系 灵魂：正中央半球形发光鼻锥 (Captain Sunlight Nose Cone)
          ctx.beginPath()
          ctx.arc(w * 0.5, h * 0.58, 20, 0, Math.PI * 2)
          ctx.fillStyle = '#cbd5e1'
          ctx.fill()

          ctx.beginPath()
          ctx.arc(w * 0.5, h * 0.58, 17, 0, Math.PI * 2)
          ctx.fillStyle = '#facc15'
          ctx.fill()

          ctx.beginPath()
          ctx.arc(w * 0.5 - 3, h * 0.58 - 3, 5, 0, Math.PI * 2)
          ctx.fillStyle = '#fef08a'
          ctx.fill()

          // 双侧圆形大灯
          for (const lx of [w * 0.18, w * 0.82]) {
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            ctx.arc(lx, h * 0.62, 6, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = '#fef08a'
            ctx.beginPath()
            ctx.arc(lx, h * 0.62, 4, 0, Math.PI * 2)
            ctx.fill()
          }

        } else if (style === 'shinkansen-300-nozomi') {
          // 300系 白银希望号: 梯形硬朗前脸 + 东海道双蓝带
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, w, h)

          ctx.fillStyle = '#1e3a8a'
          ctx.fillRect(0, h * 0.65, w, 6)
          ctx.fillRect(0, h * 0.72, w, 3)

          // 梯形风挡
          ctx.fillStyle = '#0f172a'
          ctx.beginPath()
          ctx.moveTo(w * 0.20, h * 0.18)
          ctx.lineTo(w * 0.80, h * 0.18)
          ctx.lineTo(w * 0.72, h * 0.44)
          ctx.lineTo(w * 0.28, h * 0.44)
          ctx.closePath()
          ctx.fill()

          // 双下角内嵌车灯
          for (const lx of [w * 0.20, w * 0.80]) {
            ctx.fillStyle = '#334155'
            ctx.fillRect(lx - 10, h * 0.76, 20, 10)
            ctx.fillStyle = '#fef08a'
            ctx.fillRect(lx - 8, h * 0.78, 16, 6)
          }

        } else {
          // E3 / 683
          ctx.fillStyle = primaryColor || '#ffffff'
          ctx.fillRect(0, 0, w, h)

          ctx.fillStyle = secondaryColor || '#db2777'
          ctx.fillRect(0, h * 0.65, w, 6)

          ctx.fillStyle = '#0f172a'
          ctx.beginPath()
          ctx.moveTo(w * 0.20, h * 0.20)
          ctx.lineTo(w * 0.80, h * 0.20)
          ctx.lineTo(w * 0.70, h * 0.45)
          ctx.lineTo(w * 0.30, h * 0.45)
          ctx.closePath()
          ctx.fill()

          for (const lx of [w * 0.20, w * 0.80]) {
            ctx.fillStyle = '#fef08a'
            ctx.beginPath()
            ctx.arc(lx, h * 0.78, 5, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        ctx.fillStyle = '#334155'
        ctx.fillRect(0, h * 0.85, w, h * 0.15)

      } else {
        ctx.fillStyle = secondaryColor || '#059669'
        ctx.fillRect(0, 0, w, h * 0.65)

        ctx.fillStyle = accentColor || '#ec4899'
        ctx.fillRect(0, h * 0.65, w, 6)

        ctx.fillStyle = frameColor
        ctx.beginPath()
        ctx.moveTo(w * 0.20, h * 0.20)
        ctx.lineTo(w * 0.80, h * 0.20)
        ctx.lineTo(w * 0.70, h * 0.45)
        ctx.lineTo(w * 0.30, h * 0.45)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = windowColor
        ctx.beginPath()
        ctx.moveTo(w * 0.24, h * 0.24)
        ctx.lineTo(w * 0.76, h * 0.24)
        ctx.lineTo(w * 0.67, h * 0.42)
        ctx.lineTo(w * 0.33, h * 0.42)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(w * 0.18, h * 0.75, w * 0.18, 5)
        ctx.fillRect(w * 0.64, h * 0.75, w * 0.18, 5)
      }

    } else {
      // === 通勤电车车头 ===
      if (style === 'commuter-osaka-loop') {
        // === 大阪环状线: 黑色前面罩 + 顶部亮橙带 + 红色环状线专属 "O" 徽标 ===
        ctx.fillStyle = '#0f172a' // 黑色防眩前面罩
        ctx.fillRect(0, 0, w, h)

        ctx.fillStyle = '#ea580c' // 顶部亮橙色彩带
        ctx.fillRect(0, 0, w, h * 0.15)
        ctx.fillRect(0, h * 0.68, w, h * 0.10)

        // 驾驶舱玻璃
        const winW = w * 0.78
        const winH = h * 0.36
        const winX = (w - winW) / 2
        const winY = h * 0.18

        ctx.fillStyle = windowColor
        ctx.fillRect(winX, winY, winW, winH)

        // 目的地指示器
        ctx.fillStyle = '#000000'
        ctx.fillRect(winX + winW * 0.2, winY + 6, winW * 0.6, 16)
        ctx.fillStyle = '#ea580c'
        ctx.font = 'bold 10px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('大阪环状线 内回', winX + winW * 0.5, winY + 18)

        // 大阪环状线专属红色圆形徽标 (Osaka Loop "O" Logo)
        ctx.beginPath()
        ctx.arc(w * 0.5, h * 0.60, 14, 0, Math.PI * 2)
        ctx.fillStyle = '#dc2626'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(w * 0.5, h * 0.60, 9, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(w * 0.5, h * 0.60, 5, 0, Math.PI * 2)
        ctx.fillStyle = '#dc2626'
        ctx.fill()

        // 双高亮车灯
        ctx.fillStyle = '#fef08a'
        ctx.beginPath()
        ctx.arc(winX + 16, h * 0.82, 7, 0, Math.PI * 2)
        ctx.arc(winX + winW - 16, h * 0.82, 7, 0, Math.PI * 2)
        ctx.fill()

      } else if (style === 'commuter-hankyu') {
        // === 关西阪急电车: 经典栗红 + 象牙白顶 + 铝合金窗框 + HANKYU 1000 铭牌 ===
        ctx.fillStyle = '#4a0e17'
        ctx.fillRect(0, 0, w, h)

        // 顶部象牙白圆顶
        ctx.fillStyle = '#f8fafc'
        ctx.fillRect(0, 0, w, h * 0.15)
        ctx.fillStyle = '#cbd5e1'
        ctx.fillRect(0, h * 0.15, w, 2)

        const winW = w * 0.78
        const winH = h * 0.38
        const winX = (w - winW) / 2
        const winY = h * 0.18

        // 铝合金亮银窗框
        ctx.fillStyle = '#cbd5e1'
        ctx.fillRect(winX - 3, winY - 3, winW + 6, winH + 6)
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(winX, winY, winW, winH)

        // 目的地指示器 (梅田·京都河原町)
        ctx.fillStyle = '#000000'
        ctx.fillRect(winX + winW * 0.2, winY + 6, winW * 0.6, 16)
        ctx.fillStyle = '#facc15'
        ctx.font = 'bold 10px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('特急 大阪梅田', winX + winW * 0.5, winY + 18)

        // 金色车头车牌 HANKYU
        ctx.fillStyle = '#eab308'
        ctx.fillRect(w * 0.35, h * 0.64, w * 0.30, 14)
        ctx.fillStyle = '#4a0e17'
        ctx.font = 'bold 9px monospace'
        ctx.fillText('1000', w * 0.5, h * 0.74)

        // 经典双暖黄圆大灯
        ctx.fillStyle = '#fef08a'
        ctx.beginPath()
        ctx.arc(winX + 16, h * 0.82, 8, 0, Math.PI * 2)
        ctx.arc(winX + winW - 16, h * 0.82, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.lineWidth = 2
        ctx.strokeStyle = '#cbd5e1'
        ctx.stroke()

      } else if (style === 'commuter-marunouchi') {
        // === 丸之内线 2000系: 鲜红车身 + 黑面罩 + 白色波浪 ===
        ctx.fillStyle = '#dc2626'
        ctx.fillRect(0, 0, w, h)

        ctx.fillStyle = '#18181b' // 黑防眩面罩
        ctx.beginPath()
        ctx.roundRect(w * 0.08, h * 0.12, w * 0.84, h * 0.62, 16)
        ctx.fill()

        const winW = w * 0.74
        const winH = h * 0.36
        const winX = (w - winW) / 2
        const winY = h * 0.16

        ctx.fillStyle = windowColor
        ctx.fillRect(winX, winY, winW, winH)

        // 白色正弦波纹浪花
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(w * 0.1, h * 0.80)
        ctx.quadraticCurveTo(w * 0.3, h * 0.74, w * 0.5, h * 0.80)
        ctx.quadraticCurveTo(w * 0.7, h * 0.86, w * 0.9, h * 0.80)
        ctx.stroke()

        // 弧形 LED 前大灯
        ctx.fillStyle = '#fef08a'
        ctx.beginPath()
        ctx.arc(winX + 16, h * 0.82, 7, 0, Math.PI * 2)
        ctx.arc(winX + winW - 16, h * 0.82, 7, 0, Math.PI * 2)
        ctx.fill()

      } else {
        // 山手线 / 中央线 / 京滨东北线
        ctx.fillStyle = secondaryColor || '#22c55e'
        ctx.fillRect(0, h * 0.55, w, h * 0.22)

        const winW = w * 0.78
        const winH = h * 0.38
        const winX = (w - winW) / 2
        const winY = h * 0.12

        ctx.fillStyle = frameColor
        ctx.fillRect(winX - 2, winY - 2, winW + 4, winH + 4)
        ctx.fillStyle = windowColor
        ctx.fillRect(winX, winY, winW, winH)

        ctx.fillStyle = '#052e16'
        ctx.fillRect(winX + winW * 0.2, winY + 6, winW * 0.6, 16)
        ctx.fillStyle = '#4ade80'
        ctx.font = 'bold 10px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(customText?.destination || '新宿·东京', winX + winW * 0.5, winY + 18)

        ctx.fillStyle = '#fef08a'
        ctx.beginPath()
        ctx.arc(winX + 16, h * 0.66, 8, 0, Math.PI * 2)
        ctx.arc(winX + winW - 16, h * 0.66, 8, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    return canvas
  }

  /**
   * 绘制车尾贴图
   */
  private drawBackView(w: number, h: number, params: any): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    const { primaryColor, secondaryColor, accentColor, frameColor, windowColor, category, theme, consistId } = params

    const style = this.resolveLiveryStyle(theme, category, consistId)

    // 0.45 经典双层客车车尾 (Double-Decker Bus Rear)
    if (style.startsWith('bus-double-')) {
      ctx.fillStyle = primaryColor || (style === 'bus-double-london-red' ? '#982127' : (style === 'bus-double-kmb-gold' ? '#d5c7ab' : '#8c222c'))
      ctx.fillRect(0, 0, w, h)

      // 中层分割腰线 (Y: 0.40..0.435, 与侧身腰线完全水平贯通)
      ctx.fillStyle = accentColor || '#d49b35'
      ctx.fillRect(0, h * 0.40, w, h * 0.035)

      // 2 楼后部观景窗 (Y: 0.08..0.38, 与侧身 2 楼窗户高度 100% 对齐)
      ctx.fillStyle = '#020617'
      ctx.beginPath()
      ctx.roundRect(w * 0.12, h * 0.08, w * 0.76, h * 0.30, 3.5)
      ctx.fill()
      ctx.strokeStyle = frameColor || '#334155'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // 1 楼发动机散热格栅 (Louvers: Y: 0.47..0.77, 与 1 楼窗户高度对齐)
      ctx.fillStyle = '#111827'
      ctx.fillRect(w * 0.15, h * 0.47, w * 0.70, h * 0.30)
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 1
      for (let y = h * 0.50; y < h * 0.75; y += 6) {
        ctx.beginPath()
        ctx.moveTo(w * 0.18, y)
        ctx.lineTo(w * 0.82, y)
        ctx.stroke()
      }

      // 立式尾灯组 (Y: 0.47..0.77)
      const drawTailLight = (lx: number) => {
        ctx.fillStyle = '#020617'
        ctx.fillRect(lx, h * 0.47, w * 0.09, h * 0.30)
        ctx.fillStyle = '#982127' // 刹车红
        ctx.fillRect(lx + 2, h * 0.49, w * 0.09 - 4, h * 0.09)
        ctx.fillStyle = '#d97706' // 转向橙
        ctx.fillRect(lx + 2, h * 0.59, w * 0.09 - 4, h * 0.08)
        ctx.fillStyle = '#f8fafc' // 倒车白
        ctx.fillRect(lx + 2, h * 0.68, w * 0.09 - 4, h * 0.08)
      }
      drawTailLight(w * 0.04)
      drawTailLight(w * 0.87)
      return canvas
    }

    // 0.48 香港双层叮叮车车尾 (HK Tram Rear - 窄格木质复古比例)
    if (style.startsWith('hk-tram-')) {
      ctx.fillStyle = primaryColor || (style === 'hk-tram-green' ? '#1d3e2b' : (style === 'hk-tram-retro-red' ? '#1d3e2b' : '#294867'))
      ctx.fillRect(0, 0, w, h)
      if (style === 'hk-tram-retro-red') {
        ctx.fillStyle = '#7e2229'
        ctx.fillRect(0, 0, w, h * 0.45)
      }

      // 2 楼后部双窄木窗 (Upper Deck: 2 Narrow Panes)
      const uBackTop = h * 0.14
      const uBackH = h * 0.22
      ctx.fillStyle = '#3d2817'
      ctx.fillRect(w * 0.14, uBackTop, w * 0.33, uBackH)
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(w * 0.16, uBackTop + 2, w * 0.29, uBackH - 4)
      ctx.fillStyle = '#3d2817'
      ctx.fillRect(w * 0.53, uBackTop, w * 0.33, uBackH)
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(w * 0.55, uBackTop + 2, w * 0.29, uBackH - 4)

      // 1 楼后登车栏杆门与旋转栅栏
      ctx.fillStyle = '#111827'
      ctx.fillRect(w * 0.10, h * 0.50, w * 0.80, h * 0.38)
      ctx.strokeStyle = '#c89635'
      ctx.lineWidth = 1.5
      ctx.strokeRect(w * 0.15, h * 0.54, w * 0.30, h * 0.30)
      ctx.strokeRect(w * 0.55, h * 0.54, w * 0.30, h * 0.30)

      // 尾部单红尾灯
      ctx.fillStyle = '#c89635'
      ctx.beginPath()
      ctx.arc(w * 0.50, h * 0.90, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#982127'
      ctx.beginPath()
      ctx.arc(w * 0.50, h * 0.90, 4, 0, Math.PI * 2)
      ctx.fill()
      return canvas
    }

    // 1. 经典有轨电车车尾 (Tram Rear Face)
    if (category === 'vehicle' || style.startsWith('tram-')) {
      if (style === 'tram-enoden-green') {
        ctx.fillStyle = '#faecd2'
        ctx.fillRect(0, 0, w, h * 0.45)
        ctx.fillStyle = primaryColor || '#1e422d'
        ctx.fillRect(0, h * 0.45, w, h * 0.55)
        ctx.fillStyle = '#b87b28'
        ctx.fillRect(0, h * 0.45, w, 2.5)

        // 后驾驶室观景窗
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(w * 0.10, h * 0.16, w * 0.80, h * 0.30)
        ctx.fillStyle = '#cbd5e1'
        ctx.fillRect(w * 0.36, h * 0.16, 2, h * 0.30)
        ctx.fillRect(w * 0.64, h * 0.16, 2, h * 0.30)

        // 尾部双红尾灯
        ctx.fillStyle = '#8c222c'
        ctx.beginPath()
        ctx.arc(w * 0.20, h * 0.75, 5, 0, Math.PI * 2)
        ctx.arc(w * 0.80, h * 0.75, 5, 0, Math.PI * 2)
        ctx.fill()
        return canvas
      } else if (style === 'tram-modern-cyan') {
        ctx.fillStyle = '#f5f7fa'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#020617'
        ctx.beginPath()
        ctx.roundRect(w * 0.08, h * 0.12, w * 0.84, h * 0.55, 8)
        ctx.fill()
        ctx.fillStyle = '#8c222c'
        ctx.fillRect(w * 0.12, h * 0.70, w * 0.20, 2.5)
        ctx.fillRect(w * 0.68, h * 0.70, w * 0.20, 2.5)
        return canvas
      }
    }

    // 2. 东风 4B 重载货运系列 (DF4B Freight Rear View)
    if (style.startsWith('df4b-')) {
      if (params.carType === 'head') {
        // II端机车头尾部
        if (style === 'df4b-watermelon') {
          ctx.fillStyle = '#264e36'
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#f4ebd0'
          ctx.fillRect(0, h * 0.52, w, 4)
          ctx.fillRect(0, h * 0.56, w, 4)
        } else if (style === 'df4b-orange') {
          ctx.fillStyle = '#b8542b'
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#f1ede4'
          ctx.beginPath()
          ctx.moveTo(0, h * 0.45)
          ctx.lineTo(w * 0.5, h * 0.75)
          ctx.lineTo(w, h * 0.45)
          ctx.lineTo(w, h * 0.55)
          ctx.lineTo(w * 0.5, h * 0.85)
          ctx.lineTo(0, h * 0.55)
          ctx.fill()
        } else if (style === 'df4b-jrf-red-thunder') {
          ctx.fillStyle = '#9a373f'
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#e2e8f0'
          ctx.fillRect(0, h * 0.50, w, 6)
        } else if (style === 'df4b-jrf-blue-momotaro') {
          ctx.fillStyle = '#cbd5e1'
          ctx.fillRect(0, 0, w, h * 0.45)
          ctx.fillStyle = '#244872'
          ctx.fillRect(0, h * 0.45, w, h * 0.55)
        } else if (style === 'df4b-bnsf-orange') {
          ctx.fillStyle = '#d66824'
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#27272a'
          ctx.fillRect(0, h * 0.50, w, h * 0.22)
          ctx.fillStyle = '#f59e0b'
          ctx.fillRect(0, h * 0.49, w, 3)
          ctx.fillRect(0, h * 0.72, w, 3)
        } else if (style === 'df4b-sbb-cargo') {
          ctx.fillStyle = '#244d7d'
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#f8fafc'
          ctx.fillRect(0, h * 0.48, w, 8)
        } else {
          ctx.fillStyle = '#2b5482'
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#f1f5f9'
          ctx.fillRect(0, h * 0.52, w, 7)
        }

        // 双后风挡观察窗 (带柔和密封条 + 玻璃反光)
        ctx.fillStyle = '#162230'
        ctx.fillRect(w * 0.10, h * 0.20, w * 0.36, h * 0.28)
        ctx.fillRect(w * 0.54, h * 0.20, w * 0.36, h * 0.28)
        ctx.strokeStyle = '#4a586a'
        ctx.lineWidth = 1.2
        ctx.strokeRect(w * 0.10, h * 0.20, w * 0.36, h * 0.28)
        ctx.strokeRect(w * 0.54, h * 0.20, w * 0.36, h * 0.28)

        // 红色机车尾部标志灯 (Red Marker Lights)
        ctx.fillStyle = '#26313d'
        ctx.fillRect(w * 0.36, h * 0.05, w * 0.28, h * 0.12)
        ctx.strokeStyle = '#94a3b8'
        ctx.lineWidth = 1.2
        ctx.strokeRect(w * 0.36, h * 0.05, w * 0.28, h * 0.12)
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.arc(w * 0.43, h * 0.11, 5.5, 0, Math.PI * 2)
        ctx.arc(w * 0.57, h * 0.11, 5.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#fecaca'
        ctx.beginPath()
        ctx.arc(w * 0.42, h * 0.10, 2, 0, Math.PI * 2)
        ctx.arc(w * 0.56, h * 0.10, 2, 0, Math.PI * 2)
        ctx.fill()

        // 底部重型排障器
        ctx.fillStyle = '#222b36'
        ctx.fillRect(w * 0.04, h * 0.84, w * 0.92, h * 0.16)
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 2.5
        for (let x = w * 0.08; x < w * 0.92; x += 11) {
          ctx.beginPath()
          ctx.moveTo(x, h * 0.85)
          ctx.lineTo(x + 7, h * 0.99)
          ctx.stroke()
        }
        ctx.fillStyle = '#171d24'
        ctx.fillRect(w * 0.44, h * 0.86, w * 0.12, h * 0.10)
        return canvas

      } else if (params.carType === 'middle') {
        // === 集装箱平车后侧端面：双开货柜门与垂直锁杆 ===
        const isVariant2 = params.middleVariant === 2 || params.carRole === 'middle_2'
        let endBoxColor = isVariant2 ? '#327ea8' : '#2d5438'
        if (style === 'df4b-orange') endBoxColor = isVariant2 ? '#eae7df' : '#2d4b68'
        else if (style === 'df4b-jrf-red-thunder') endBoxColor = isVariant2 ? '#8a3339' : '#284666'
        else if (style === 'df4b-jrf-blue-momotaro') endBoxColor = isVariant2 ? '#963940' : '#8a3339'
        else if (style === 'df4b-bnsf-orange') endBoxColor = isVariant2 ? '#2d4b68' : '#eae7df'
        else if (style === 'df4b-sbb-cargo') endBoxColor = isVariant2 ? '#2d5438' : '#d96427'
        else if (style === 'df4b-blue') endBoxColor = isVariant2 ? '#c97f32' : '#aa3d64'

        ctx.fillStyle = endBoxColor
        ctx.fillRect(0, 0, w, h * 0.82)
        ctx.strokeStyle = '#1e2632'
        ctx.lineWidth = 1.5
        ctx.strokeRect(2, 2, w - 4, h * 0.82 - 4)

        ctx.fillStyle = '#1e2632'
        ctx.fillRect(w * 0.5 - 1.5, 4, 3, h * 0.82 - 8)

        // 4 根垂直锁杆
        const rodPositions = [w * 0.22, w * 0.38, w * 0.62, w * 0.78]
        for (const rx of rodPositions) {
          ctx.fillStyle = '#94a3b8'
          ctx.fillRect(rx - 1.5, 6, 3, h * 0.82 - 12)
          ctx.fillStyle = '#475569'
          ctx.fillRect(rx - 3, 5, 6, 4)
          ctx.fillRect(rx - 3, h * 0.82 - 9, 6, 4)
          ctx.fillStyle = '#cbd5e1'
          ctx.fillRect(rx - 1.5, h * 0.44, 8, 3)
        }

        ctx.fillStyle = '#1e2632'
        ctx.fillRect(1, 1, 7, 7)
        ctx.fillRect(w - 8, 1, 7, 7)
        ctx.fillRect(1, h * 0.82 - 8, 7, 7)
        ctx.fillRect(w - 8, h * 0.82 - 8, 7, 7)

        ctx.fillStyle = '#222b36'
        ctx.fillRect(0, h * 0.82, w, h * 0.18)
        ctx.fillStyle = '#3a4759'
        ctx.fillRect(0, h * 0.82, w, 3)
        ctx.fillStyle = '#171d24'
        ctx.fillRect(w * 0.42, h * 0.86, w * 0.16, h * 0.10)
        return canvas

      } else {
        // === 散货煤炭敞车后端面 ===
        ctx.fillStyle = '#2d3540'
        ctx.fillRect(0, 0, w, h)

        for (let y = h * 0.20; y < h * 0.80; y += h * 0.18) {
          ctx.fillStyle = '#1e242c'
          ctx.fillRect(4, y, w - 8, 2)
          ctx.fillStyle = '#4a5768'
          ctx.fillRect(4, y + 2, w - 8, 2.5)
        }

        // 红色车尾标志反光板 (Red End Reflectors)
        ctx.fillStyle = '#dc2626'
        ctx.beginPath()
        ctx.arc(w * 0.20, h * 0.70, 5, 0, Math.PI * 2)
        ctx.arc(w * 0.80, h * 0.70, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#f87171'
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.fillStyle = '#222b36'
        ctx.fillRect(0, h * 0.85, w, h * 0.15)
        ctx.fillStyle = '#171d24'
        ctx.fillRect(w * 0.42, h * 0.87, w * 0.16, h * 0.11)
        return canvas
      }
    }

    if (category === 'bus') {
      // 1. 各车型专属车尾底色与分色架构
      if (style === 'bus-london-red') {
        // 伦敦纯红巴士车尾: 100% 通体正红
        ctx.fillStyle = primaryColor || '#dc2626'
        ctx.fillRect(0, 0, w, h)
      } else if (style === 'bus-retro-green') {
        // 复古绿电车车尾: 上半奶油白 + 下半复古绿
        ctx.fillStyle = secondaryColor || '#fef3c7'
        ctx.fillRect(0, 0, w, h * 0.45)
        ctx.fillStyle = primaryColor || '#166534'
        ctx.fillRect(0, h * 0.45, w, h * 0.55)
        ctx.fillStyle = '#d97706'
        ctx.fillRect(0, h * 0.45, w, 2.5)
      } else if (style === 'bus-eco-cyan') {
        // 纯电环保车尾: 极简纯白 + 尾部青绿叶脉拉花
        ctx.fillStyle = primaryColor || '#f1f5f9'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#059669'
        ctx.beginPath()
        ctx.moveTo(w * 0.15, h * 0.82)
        ctx.lineTo(w * 0.85, h * 0.82)
        ctx.lineTo(w * 0.85, h * 0.78)
        ctx.lineTo(w * 0.40, h * 0.78)
        ctx.closePath()
        ctx.fill()
      } else {
        // 71路蓝白车尾: 珍珠白前额 + 水墨蓝下部
        ctx.fillStyle = secondaryColor || '#f8fafc'
        ctx.fillRect(0, 0, w, h * 0.40)
        ctx.fillStyle = primaryColor || '#0055b8'
        ctx.fillRect(0, h * 0.40, w, h * 0.60)
        ctx.fillStyle = accentColor || '#fbbf24'
        ctx.fillRect(0, h * 0.40, w, 3)
      }

      // 2. 车尾后风挡玻璃
      ctx.fillStyle = '#020617'
      ctx.beginPath()
      ctx.roundRect(w * 0.12, h * 0.10, w * 0.76, h * 0.28, 4)
      ctx.fill()
      ctx.strokeStyle = frameColor || '#334155'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // 顶部高位刹车灯
      ctx.fillStyle = '#ef4444'
      ctx.fillRect(w * 0.40, h * 0.05, w * 0.20, 4)

      // 3. 发动机百叶散热格栅 (Louvers)
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(w * 0.15, h * 0.44, w * 0.70, h * 0.28)
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 1
      for (let y = h * 0.48; y < h * 0.70; y += 6) {
        ctx.beginPath()
        ctx.moveTo(w * 0.18, y)
        ctx.lineTo(w * 0.82, y)
        ctx.stroke()
      }

      // 4. 竖置立式尾灯组 (刹车红 + 转向橙 + 倒车白)
      const drawTailLight = (lx: number) => {
        ctx.fillStyle = '#020617'
        ctx.fillRect(lx, h * 0.42, w * 0.09, h * 0.32)
        ctx.fillStyle = '#ef4444' // 刹车红
        ctx.fillRect(lx + 2, h * 0.44, w * 0.09 - 4, h * 0.10)
        ctx.fillStyle = '#f59e0b' // 转向橙
        ctx.fillRect(lx + 2, h * 0.55, w * 0.09 - 4, h * 0.08)
        ctx.fillStyle = '#ffffff' // 倒车白
        ctx.fillRect(lx + 2, h * 0.64, w * 0.09 - 4, h * 0.08)
      }
      drawTailLight(w * 0.04)
      drawTailLight(w * 0.87)

      // 5. 后保险杠与车牌 (仅在开启自定义时绘制车牌文字)
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(w * 0.05, h * 0.85, w * 0.90, h * 0.12)

      if (params.customText && params.customText.enabled && params.customText.slots?.licensePlate) {
        const plateText = params.customText.slots.licensePlate
        ctx.fillStyle = '#0284c7'
        ctx.fillRect(w * 0.30, h * 0.87, w * 0.40, h * 0.08)
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 1
        ctx.strokeRect(w * 0.30, h * 0.87, w * 0.40, h * 0.08)
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 11px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(plateText, w * 0.50, h * 0.93)
      } else {
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(w * 0.30, h * 0.87, w * 0.40, h * 0.08)
        ctx.strokeStyle = '#334155'
        ctx.lineWidth = 1
        ctx.strokeRect(w * 0.30, h * 0.87, w * 0.40, h * 0.08)
      }

      return canvas
    }

    if (style === 'commuter-hankyu') {
      ctx.fillStyle = '#4a0e17'
    } else if (style === 'commuter-marunouchi') {
      ctx.fillStyle = '#dc2626'
    } else {
      ctx.fillStyle = primaryColor || '#e2e8f0'
    }
    ctx.fillRect(0, 0, w, h)

    if (category === 'commuter' && style !== 'commuter-hankyu' && style !== 'commuter-marunouchi') {
      ctx.fillStyle = secondaryColor || '#22c55e'
      ctx.fillRect(0, h * 0.55, w, h * 0.22)
    }

    const doorW = w * 0.44
    const doorH = h * 0.70
    const doorX = (w - doorW) / 2
    const doorY = h * 0.18

    ctx.fillStyle = frameColor
    ctx.fillRect(doorX, doorY, doorW, doorH)
    ctx.fillStyle = windowColor
    ctx.fillRect(doorX + 8, doorY + 12, doorW - 16, h * 0.28)

    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(doorX - 12, h * 0.70, 6, 0, Math.PI * 2)
    ctx.arc(doorX + doorW + 12, h * 0.70, 6, 0, Math.PI * 2)
    ctx.fill()

    return canvas
  }

  /**
   * 绘制新干线驾驶舱专属流线前挡风玻璃 (Cockpit)
   */
  private drawCockpitFrontView(w: number, h: number, params: any): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    const { secondaryColor, windowColor, frameColor, theme, category, consistId } = params

    const style = this.resolveLiveryStyle(theme, category, consistId)

    if (style === 'shinkansen-doctor-yellow') {
      ctx.fillStyle = '#facc15'
    } else if (style === 'shinkansen-n700' || style === 'shinkansen-haruka-kitty') {
      ctx.fillStyle = '#f8fafc'
    } else if (style === 'shinkansen-nankai-rapit') {
      ctx.fillStyle = '#0f2b5c'
    } else if (style === 'shinkansen-500-eva') {
      ctx.fillStyle = '#6b21a8'
    } else {
      ctx.fillStyle = secondaryColor || '#059669'
    }
    ctx.fillRect(0, 0, w, h)

    // 深蓝/墨黑流线前挡风玻璃
    ctx.fillStyle = frameColor || '#1e293b'
    ctx.beginPath()
    if (style === 'shinkansen-nankai-rapit') {
      // 南海 Rapi:t 机甲武士锐角眼罩风挡
      ctx.moveTo(w * 0.12, h * 0.18)
      ctx.lineTo(w * 0.88, h * 0.18)
      ctx.lineTo(w * 0.65, h * 0.78)
      ctx.lineTo(w * 0.35, h * 0.78)
    } else {
      ctx.moveTo(w * 0.18, h * 0.15)
      ctx.lineTo(w * 0.82, h * 0.15)
      ctx.lineTo(w * 0.72, h * 0.72)
      ctx.lineTo(w * 0.28, h * 0.72)
    }
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = windowColor
    ctx.beginPath()
    ctx.moveTo(w * 0.22, h * 0.19)
    ctx.lineTo(w * 0.78, h * 0.19)
    ctx.lineTo(w * 0.69, h * 0.68)
    ctx.lineTo(w * 0.31, h * 0.68)
    ctx.closePath()
    ctx.fill()

    // 挡风玻璃反光
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(w * 0.50, h * 0.22)
    ctx.lineTo(w * 0.50, h * 0.65)
    ctx.stroke()

    return canvas
  }

  /**
   * 绘制新干线气动长鼻锥尖端 (Duckbill Nose Cone)
   */
  private drawNoseFrontView(w: number, h: number, params: any): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    const { primaryColor, secondaryColor, accentColor, theme, category, consistId } = params

    const style = this.resolveLiveryStyle(theme, category, consistId)

    if (style === 'shinkansen-doctor-yellow') {
      // === 黄医生鼻锥: 通体明亮鲜黄 ===
      ctx.fillStyle = '#facc15'
      ctx.fillRect(0, 0, w, h)

      ctx.fillStyle = '#1e3a8a'
      ctx.fillRect(w * 0.08, h * 0.82, w * 0.15, 4)
      ctx.fillRect(w * 0.77, h * 0.82, w * 0.15, 4)

    } else if (style.startsWith('shinkansen-haruka-')) {
      // === Haruka 鼻锥: 纯白 + 深蓝底线 + 散落飘落粉樱瓣 ===
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)

      ctx.fillStyle = '#1e3a8a'
      ctx.fillRect(0, h * 0.80, w, h * 0.20)

      // 飘落粉樱花瓣
      this.drawNaturalSakuraPetal(ctx, w * 0.5, h * 0.5, 4.5, 0.4, 0.9)

    } else if (style === 'shinkansen-nankai-rapit') {
      // === 南海特急 Rapi:t 机甲武士鼻锥 (纯正午夜深蓝 + 银色中脊破风线) ===
      ctx.fillStyle = '#0f2b5c'
      ctx.fillRect(0, 0, w, h)

      // 银色中脊破风分割线
      ctx.fillStyle = '#cbd5e1'
      ctx.fillRect(w * 0.5 - 3, 0, 6, h * 0.85)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(w * 0.5 - 1, 0, 2, h * 0.85)

      // 底部深黑导流下铲
      ctx.fillStyle = '#090e17'
      ctx.fillRect(0, h * 0.85, w, h * 0.15)

    } else if (style === 'shinkansen-500-eva') {
      // === 500 TYPE EVA 初号机鼻锥 ===
      ctx.fillStyle = '#6b21a8'
      ctx.fillRect(0, 0, w, h)

      // 初号机荧光绿尖锥与警示橙
      ctx.fillStyle = '#22c55e'
      ctx.beginPath()
      ctx.moveTo(w * 0.5, h * 0.3)
      ctx.lineTo(w * 0.8, h * 0.85)
      ctx.lineTo(w * 0.2, h * 0.85)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = '#ea580c'
      ctx.fillRect(w * 0.25, h * 0.85, w * 0.50, 4)

    } else if (style === 'shinkansen-n700') {
      // === N700S 鼻锥: 珍珠白 ===
      ctx.fillStyle = '#f8fafc'
      ctx.fillRect(0, 0, w, h)

      ctx.fillStyle = '#1d4ed8'
      ctx.fillRect(w * 0.08, h * 0.82, w * 0.15, 4)
      ctx.fillRect(w * 0.77, h * 0.82, w * 0.15, 4)

    } else {
      // E5 隼号 / E6 / E7
      ctx.fillStyle = primaryColor || '#ffffff'
      ctx.fillRect(0, 0, w, h)

      ctx.fillStyle = secondaryColor || '#059669'
      ctx.fillRect(0, 0, w, h * 0.75)

      ctx.fillStyle = accentColor || '#ec4899'
      ctx.fillRect(0, h * 0.75, w, 5)
    }

    // 正前方双 LED 聚光前大灯
    // 左大灯
    ctx.fillStyle = '#0f172a'
    ctx.beginPath()
    ctx.moveTo(w * 0.15, h * 0.78)
    ctx.lineTo(w * 0.40, h * 0.78)
    ctx.lineTo(w * 0.36, h * 0.90)
    ctx.lineTo(w * 0.18, h * 0.90)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#fef08a'
    ctx.beginPath()
    ctx.moveTo(w * 0.17, h * 0.80)
    ctx.lineTo(w * 0.38, h * 0.80)
    ctx.lineTo(w * 0.34, h * 0.88)
    ctx.lineTo(w * 0.20, h * 0.88)
    ctx.closePath()
    ctx.fill()

    // 右大灯
    ctx.fillStyle = '#0f172a'
    ctx.beginPath()
    ctx.moveTo(w * 0.60, h * 0.78)
    ctx.lineTo(w * 0.85, h * 0.78)
    ctx.lineTo(w * 0.82, h * 0.90)
    ctx.lineTo(w * 0.64, h * 0.90)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#fef08a'
    ctx.beginPath()
    ctx.moveTo(w * 0.62, h * 0.80)
    ctx.lineTo(w * 0.83, h * 0.80)
    ctx.lineTo(w * 0.80, h * 0.88)
    ctx.lineTo(w * 0.66, h * 0.88)
    ctx.closePath()
    ctx.fill()

    return canvas
  }

  /**
   * 绘制新干线鼻底唇与排障器 (Nose Chin)
   */
  private drawNoseChinView(w: number, h: number, _params: any): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, w, h)

    // 排障器格栅
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 2
    for (let x = 10; x < w - 10; x += 15) {
      ctx.beginPath()
      ctx.moveTo(x, 2)
      ctx.lineTo(x, h - 2)
      ctx.stroke()
    }

    return canvas
  }


  /**
   * 绘制单片自然散落飘舞的粉樱花瓣 (Natural Drifting Sakura Petal: 心形凹槽、弧度与娇嫩粉色渐变)
   */
  private drawNaturalSakuraPetal(ctx: CanvasRenderingContext2D, x: number, y: number, size: number = 5, rotation: number = 0, alpha: number = 0.85) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotation)
    ctx.globalAlpha = alpha

    const grad = ctx.createLinearGradient(0, -size, 0, size)
    grad.addColorStop(0, '#f472b6')
    grad.addColorStop(0.5, '#fbcfe8')
    grad.addColorStop(1.0, '#ffffff')

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.moveTo(0, size)
    // 左半弧
    ctx.bezierCurveTo(-size * 0.7, size * 0.4, -size * 0.8, -size * 0.6, -size * 0.25, -size)
    // 瓣尖微凹切口 (V-notch)
    ctx.quadraticCurveTo(0, -size * 0.75, size * 0.25, -size)
    // 右半弧
    ctx.bezierCurveTo(size * 0.8, -size * 0.6, size * 0.7, size * 0.4, 0, size)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
  }

  /**
   * 绘制纯正二次元/三丽鸥动漫风五瓣和风粉樱 (Anime / Sanrio Cel-Shaded Sakura)
   * 特点：清透马卡龙柔美色调、精致心形缺口花瓣、极简五角星花蕊与纯净动漫描边
   */
  private drawJapaneseSakuraBlossom(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number = 7,
    type: 'pink' | 'deep-rose' | 'navy' | 'light' | 'gold' = 'pink',
    rotation: number = 0,
    alpha: number = 0.95
  ) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotation)
    ctx.globalAlpha = alpha

    let petalFill = '#fce7f3'
    let petalShade = '#f472b6'
    let outlineColor = '#fb7185'
    let centerStarColor = '#e11d48'
    let centerDotColor = '#fef08a'

    if (type === 'light') {
      petalFill = '#ffffff'
      petalShade = '#fbcfe8'
      outlineColor = '#f472b6'
      centerStarColor = '#fb7185'
      centerDotColor = '#fef08a'
    } else if (type === 'deep-rose') {
      petalFill = '#fda4af'
      petalShade = '#e11d48'
      outlineColor = '#be123c'
      centerStarColor = '#9f1239'
      centerDotColor = '#ffffff'
    } else if (type === 'navy') {
      petalFill = '#bfdbfe'
      petalShade = '#2563eb'
      outlineColor = '#1d4ed8'
      centerStarColor = '#1e3a8a'
      centerDotColor = '#facc15'
    } else if (type === 'gold') {
      petalFill = '#fef3c7'
      petalShade = '#f59e0b'
      outlineColor = '#d97706'
      centerStarColor = '#b45309'
      centerDotColor = '#ffffff'
    }

    // 1. 绘制 5 瓣连体平滑和风花瓣 (Clean anime 5-petal silhouette)
    for (let i = 0; i < 5; i++) {
      ctx.save()
      ctx.rotate((i * Math.PI * 2) / 5)

      // 动漫柔和着色 (Cel-Shaded Gradient)
      const grad = ctx.createLinearGradient(0, 0, 0, -r * 1.15)
      grad.addColorStop(0, petalShade)
      grad.addColorStop(0.35, petalFill)
      grad.addColorStop(1.0, petalFill)

      ctx.fillStyle = grad
      ctx.strokeStyle = outlineColor
      ctx.lineWidth = 0.75

      ctx.beginPath()
      ctx.moveTo(0, 0)
      // 左侧弧线
      ctx.bezierCurveTo(-r * 0.45, -r * 0.45, -r * 0.52, -r * 0.95, -r * 0.16, -r * 1.12)
      // 花瓣顶端心形萌切口 (Cute Heart Notch)
      ctx.quadraticCurveTo(0, -r * 0.88, r * 0.16, -r * 1.12)
      // 右侧弧线
      ctx.bezierCurveTo(r * 0.52, -r * 0.95, r * 0.45, -r * 0.45, 0, 0)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      ctx.restore()
    }

    // 2. 经典二次元五角星芒花蕊 (Cute 5-Point Center Star)
    ctx.fillStyle = centerStarColor
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5 - Math.PI / 2
      const innerA = a + Math.PI / 5
      const outerR = r * 0.36
      const innerR = r * 0.14
      if (i === 0) {
        ctx.moveTo(Math.cos(a) * outerR, Math.sin(a) * outerR)
      } else {
        ctx.lineTo(Math.cos(a) * outerR, Math.sin(a) * outerR)
      }
      ctx.lineTo(Math.cos(innerA) * innerR, Math.sin(innerA) * innerR)
    }
    ctx.closePath()
    ctx.fill()

    // 3. 中心极简高光小圆点 (Cute Center Dot)
    ctx.fillStyle = centerDotColor
    ctx.beginPath()
    ctx.arc(0, 0, r * 0.14, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }

  /**
   * 绘制二次元动漫风单片飘落樱花瓣 (Heart-Notched Fluttering Anime Petal)
   */
  private drawAnimeSakuraPetal(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number = 5,
    rotation: number = 0,
    alpha: number = 0.9,
    color: string = '#fbcfe8'
  ) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotation)
    ctx.globalAlpha = alpha

    const grad = ctx.createLinearGradient(0, size, 0, -size)
    grad.addColorStop(0, '#f472b6')
    grad.addColorStop(0.5, color)
    grad.addColorStop(1, '#ffffff')

    ctx.fillStyle = grad
    ctx.strokeStyle = '#fb7185'
    ctx.lineWidth = 0.6

    ctx.beginPath()
    ctx.moveTo(0, size)
    ctx.bezierCurveTo(-size * 0.6, size * 0.3, -size * 0.7, -size * 0.6, -size * 0.22, -size)
    ctx.quadraticCurveTo(0, -size * 0.75, size * 0.22, -size)
    ctx.bezierCurveTo(size * 0.7, -size * 0.6, size * 0.6, size * 0.3, 0, size)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.restore()
  }

  /**
   * 绘制车头正面流线型动漫樱吹雪风痕 (Natural Flowing Anime Sakura Blizzard on Front Nose)
   * 彻底告别东北大花袄式孤立圆形花团，呈现如动画电影般的 S 型风迹与轻盈自然落樱
   */
  private drawHarukaFrontNoseSakura(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.save()

    // 1. 梦幻半透明微风风痕曲线 (Translucent Anime Wind Trails)
    ctx.strokeStyle = 'rgba(251, 207, 232, 0.40)'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(w * 0.76, h * 0.76)
    ctx.bezierCurveTo(w * 0.56, h * 0.62, w * 0.36, h * 0.48, w * 0.28, h * 0.22)
    ctx.stroke()

    ctx.strokeStyle = 'rgba(244, 114, 182, 0.25)'
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.moveTo(w * 0.68, h * 0.80)
    ctx.bezierCurveTo(w * 0.48, h * 0.66, w * 0.30, h * 0.52, w * 0.35, h * 0.30)
    ctx.stroke()

    // 2. 自然沿风痕散落的大中小花朵 (Organic Size & Color Hierarchy)
    // 主盛开花 (右下主视觉焦点)
    this.drawJapaneseSakuraBlossom(ctx, w * 0.66, h * 0.68, 8.5, 'pink', 0.3, 0.95)
    // 伴生雅致白樱 (中部转折点)
    this.drawJapaneseSakuraBlossom(ctx, w * 0.46, h * 0.54, 6.8, 'light', 1.1, 0.92)
    // 娇柔珊瑚小花 (向左上蔓延)
    this.drawJapaneseSakuraBlossom(ctx, w * 0.36, h * 0.42, 5.2, 'deep-rose', 2.4, 0.88)
    // 右侧底花
    this.drawJapaneseSakuraBlossom(ctx, w * 0.78, h * 0.74, 5.0, 'light', 0.7, 0.85)
    // 左上轻盈小花
    this.drawJapaneseSakuraBlossom(ctx, w * 0.26, h * 0.28, 4.2, 'pink', 1.8, 0.80)

    // 3. 随风飞舞的 16 片自然落樱花瓣 (Natural Fluttering Petals in Wind Stream)
    const petals = [
      { x: w * 0.72, y: h * 0.62, s: 4.2, r: 0.8, c: '#fbcfe8' },
      { x: w * 0.58, y: h * 0.66, s: 3.8, r: 1.4, c: '#ffffff' },
      { x: w * 0.52, y: h * 0.48, s: 4.5, r: 2.1, c: '#fbcfe8' },
      { x: w * 0.42, y: h * 0.58, s: 3.5, r: 0.5, c: '#ffffff' },
      { x: w * 0.38, y: h * 0.48, s: 4.0, r: 2.8, c: '#fda4af' },
      { x: w * 0.48, y: h * 0.36, s: 3.6, r: 1.2, c: '#fbcfe8' },
      { x: w * 0.32, y: h * 0.35, s: 4.2, r: 0.3, c: '#ffffff' },
      { x: w * 0.24, y: h * 0.22, s: 3.4, r: 2.2, c: '#fbcfe8' },
      { x: w * 0.30, y: h * 0.16, s: 3.0, r: 0.9, c: '#ffffff' },
      { x: w * 0.18, y: h * 0.30, s: 3.2, r: 1.7, c: '#fbcfe8' },
      { x: w * 0.60, y: h * 0.75, s: 3.6, r: 0.4, c: '#fda4af' },
      { x: w * 0.82, y: h * 0.68, s: 3.2, r: 2.6, c: '#ffffff' },
      { x: w * 0.44, y: h * 0.26, s: 2.8, r: 1.5, c: '#ffffff' },
      { x: w * 0.54, y: h * 0.20, s: 3.0, r: 0.7, c: '#fbcfe8' }
    ]

    for (const p of petals) {
      this.drawAnimeSakuraPetal(ctx, p.x, p.y, p.s, p.r, 0.88, p.c)
    }

    ctx.restore()
  }

  /**
   * 绘制二次元风格空灵雅致的和风樱花簇 (Airy Anime Sakura Cluster)
   */
  private drawHarukaSakuraCluster(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number = 22,
    count: number = 5,
    seed: number = 1
  ) {
    // 动漫风格色彩配比 (以马卡龙粉红与粉白为主，点缀少量珊瑚红与青花蓝)
    const types: ('pink' | 'light' | 'pink' | 'deep-rose' | 'light')[] = [
      'pink', 'light', 'pink', 'light', 'deep-rose'
    ]

    for (let i = 0; i < count; i++) {
      const angle = ((i * 73 + seed * 23) % 360) * (Math.PI / 180)
      const dist = (((i * 37 + seed * 19) % 70) / 100) * radius
      const fx = cx + Math.cos(angle) * dist
      const fy = cy + Math.sin(angle) * dist * 0.65
      const r = 4.8 + ((i * 11) % 4) * 0.8
      const t = types[(i + seed) % types.length]
      const rot = ((i * 53 + seed * 29) % 360) * (Math.PI / 180)
      this.drawJapaneseSakuraBlossom(ctx, fx, fy, r, t, rot, 0.92)
    }

    for (let i = 0; i < 3; i++) {
      const angle = ((i * 97 + seed * 41) % 360) * (Math.PI / 180)
      const dist = radius * (1.1 + ((i * 23) % 4) * 0.12)
      const px = cx + Math.cos(angle) * dist
      const py = cy + Math.sin(angle) * dist * 0.75
      const pSize = 3.6 + (i % 3) * 0.8
      this.drawAnimeSakuraPetal(ctx, px, py, pSize, angle + 0.4, 0.85, i % 2 === 0 ? '#fbcfe8' : '#ffffff')
    }
  }

  /**
   * 绘制官方 Haruka 蓝图二次元动漫风流水樱浪全景 (Flowing Sakura Stream on Train Sides)
   */
  private drawHarukaFullSakuraLivery(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    isLeft: boolean,
    isMiddle: boolean
  ) {
    // 1. 沿车窗下方腰线的自然起伏流水花浪 (Flowing Sakura Stream along blue waistline)
    const waveStart = isMiddle ? 0.18 : 0.28
    const waveEnd = isMiddle ? 0.86 : 0.86
    const waveLength = (waveEnd - waveStart) * w
    const numFlowers = Math.floor(waveLength / 26)

    for (let i = 0; i <= numFlowers; i++) {
      const u = i / Math.max(1, numFlowers)
      const fx = (waveStart * w) + i * 26 + (Math.sin(i * 1.7) * 4)
      const fy = h * 0.70 + Math.sin(u * Math.PI * 3.5) * (h * 0.04) + (Math.cos(i * 2.3) * (h * 0.02))
      const fr = 4.2 + (Math.sin(i * 3.1) > 0 ? 1.8 : 0) + (i % 3) * 0.6
      const fType: 'pink' | 'light' | 'deep-rose' = (i % 3 === 0) ? 'light' : (i % 4 === 0 ? 'deep-rose' : 'pink')
      this.drawJapaneseSakuraBlossom(ctx, fx, fy, fr, fType, i * 0.85, 0.90)

      // 伴生飘舞单瓣
      if (i % 2 === 0) {
        const px = fx + Math.sin(i * 4.1) * 12
        const py = fy - h * 0.06 - (i % 3) * 4
        this.drawAnimeSakuraPetal(ctx, px, py, 3.4, i * 1.3, 0.82, i % 4 === 0 ? '#ffffff' : '#fbcfe8')
      }
    }

    // 2. 重点区域的自然花簇 (Kitty 身周与门侧)
    if (!isMiddle) {
      this.drawHarukaSakuraCluster(ctx, w * 0.075, h * 0.69, 16, 4, 101)
      this.drawHarukaSakuraCluster(ctx, w * 0.16, h * 0.70, 22, 5, 202)
      this.drawHarukaSakuraCluster(ctx, w * 0.24, h * 0.71, 14, 3, 203)
      this.drawHarukaSakuraCluster(ctx, w * 0.85, h * 0.69, 16, 4, 303)
    } else {
      this.drawHarukaSakuraCluster(ctx, w * 0.07, h * 0.69, 15, 3, 401)
      this.drawHarukaSakuraCluster(ctx, w * 0.20, h * 0.70, 20, 5, 402)
      this.drawHarukaSakuraCluster(ctx, w * 0.92, h * 0.69, 15, 3, 403)
    }

    // 3. 车身上半部随风轻舞的零星二次元心形粉樱单瓣
    const upperPetalCount = 12
    for (let i = 0; i < upperPetalCount; i++) {
      const px = ((i * 79 + (isLeft ? 19 : 57)) % (w * 0.92)) + w * 0.04
      const py = h * 0.12 + (((i * 41) % 100) / 100) * (h * 0.36)
      const pSize = 3.2 + (i % 3) * 0.9
      const pRot = ((i * 67) % 360) * (Math.PI / 180)
      const pAlpha = 0.65 + ((i * 17) % 30) / 100
      this.drawAnimeSakuraPetal(ctx, px, py, pSize, pRot, pAlpha, i % 2 === 0 ? '#fbcfe8' : '#ffffff')
    }
  }

  /**
   * 绘制经典穿和服的 Hello Kitty 肖像立绘 (优先渲染官方高清图像，支持左右镜像以确保全车对称)
   */
  private drawHelloKittyIllustration(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number = 1.0, flipX: boolean = false) {
    const img = this.getKittyImage()
    if (img) {
      const drawH = 92 * scale
      const drawW = drawH * (img.naturalWidth / img.naturalHeight)
      ctx.save()
      ctx.translate(cx, cy)
      if (flipX) {
        ctx.scale(-1, 1)
      }
      ctx.drawImage(img, -drawW / 2, -drawH * 0.48, drawW, drawH)
      ctx.restore()
      return
    }

    ctx.save()
    ctx.translate(cx, cy)
    if (flipX) {
      ctx.scale(-scale, scale)
    } else {
      ctx.scale(scale, scale)
    }

    // 1. 和风振袖和服身躯 (Kimono Body)
    ctx.fillStyle = '#fb7185'
    ctx.strokeStyle = '#881337'
    ctx.lineWidth = 1.8
    ctx.beginPath()
    ctx.moveTo(-13, 11)
    ctx.lineTo(13, 11)
    ctx.lineTo(16, 29)
    ctx.lineTo(-16, 29)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // 和服衣襟交叉
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2.2
    ctx.beginPath()
    ctx.moveTo(-8, 11)
    ctx.lineTo(0, 19)
    ctx.lineTo(8, 11)
    ctx.stroke()

    // 和服宽腰带 (Obi)
    ctx.fillStyle = '#e11d48'
    ctx.fillRect(-13, 17, 26, 7)
    ctx.fillStyle = '#facc15'
    ctx.fillRect(-13, 19.5, 26, 2.0)

    // 振袖袖管
    ctx.fillStyle = '#fb7185'
    ctx.strokeStyle = '#881337'
    ctx.lineWidth = 1.6
    ctx.beginPath()
    ctx.ellipse(-13, 19, 5.5, 8.5, -Math.PI / 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.ellipse(13, 19, 5.5, 8.5, Math.PI / 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // 和风折扇
    ctx.fillStyle = '#fef08a'
    ctx.beginPath()
    ctx.arc(12, 17, 7.5, -Math.PI * 0.6, Math.PI * 0.2)
    ctx.lineTo(12, 17)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#b45309'
    ctx.lineWidth = 1.2
    ctx.stroke()

    // 2. 猫猫纯白双耳
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#18181b'
    ctx.lineWidth = 2.2
    ctx.beginPath()
    ctx.moveTo(-13, -7)
    ctx.quadraticCurveTo(-18, -20, -12, -20)
    ctx.quadraticCurveTo(-7, -19, -4, -13)
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(4, -13)
    ctx.quadraticCurveTo(7, -19, 12, -20)
    ctx.quadraticCurveTo(18, -20, 13, -7)
    ctx.fill()
    ctx.stroke()

    // 3. 纯白圆润大脸蛋
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.ellipse(0, -1.0, 19.5, 16.5, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // 4. 左耳和风大红蝴蝶结
    const bowX = -10.5
    const bowY = -14.5
    ctx.fillStyle = '#e11d48'
    ctx.strokeStyle = '#18181b'
    ctx.lineWidth = 1.8
    ctx.beginPath()
    ctx.ellipse(bowX - 6.0, bowY, 6.0, 4.5, -Math.PI / 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(bowX + 6.0, bowY, 6.0, 4.5, Math.PI / 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(bowX, bowY, 4.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // 5. 眼睛与鼻子
    ctx.fillStyle = '#18181b'
    ctx.beginPath()
    ctx.ellipse(-7.5, 1.0, 1.8, 2.6, 0, 0, Math.PI * 2)
    ctx.ellipse(7.5, 1.0, 1.8, 2.6, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#facc15'
    ctx.beginPath()
    ctx.ellipse(0, 3.2, 2.2, 1.5, 0, 0, Math.PI * 2)
    ctx.fill()

    // 6. 胡须
    ctx.strokeStyle = '#18181b'
    ctx.lineWidth = 1.8
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(-13, -0.5); ctx.lineTo(-22, -2.5)
    ctx.moveTo(-14, 3.2);  ctx.lineTo(-23, 3.2)
    ctx.moveTo(-13, 7.0);  ctx.lineTo(-22, 9.0)
    ctx.moveTo(13, -0.5); ctx.lineTo(22, -2.5)
    ctx.moveTo(14, 3.2);  ctx.lineTo(23, 3.2)
    ctx.moveTo(13, 7.0);  ctx.lineTo(22, 9.0)
    ctx.stroke()

    ctx.restore()
  }

  /**
   * 绘制车底贴图 (优雅机械浅灰 + 检修盖板 + T型挂钩开槽虚线与 5mm 磁铁位标记)
   */
  private drawBottomView(w: number, h: number, _params: any): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!

    // 优雅机械底盘底漆
    ctx.fillStyle = '#cbd5e1'
    ctx.fillRect(0, 0, w, h)

    // 设备箱与转向架预留安装区
    ctx.fillStyle = '#94a3b8'
    ctx.fillRect(w * 0.10, h * 0.08, w * 0.80, h * 0.16)
    ctx.fillRect(w * 0.10, h * 0.76, w * 0.80, h * 0.16)

    // 底盘设备箱格栅与检修口线条
    ctx.strokeStyle = '#64748b'
    ctx.lineWidth = 1.5
    for (let y = h * 0.32; y < h * 0.68; y += 28) {
      ctx.beginPath()
      ctx.moveTo(w * 0.15, y)
      ctx.lineTo(w * 0.85, y)
      ctx.stroke()
    }

    // 1. 前后端物理连接插槽 (精准 9mm 开口宽度，与 18mm 工字扣头形成 4.5mm 单侧卡位防脱)
    const drawCouplerSlot = (slotY: number) => {
      // ✂ 裁切暗槽实线 (w * 0.38 至 w * 0.62，相当于 9.1mm 开槽)
      ctx.strokeStyle = '#dc2626'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(w * 0.38, slotY)
      ctx.lineTo(w * 0.62, slotY)
      ctx.stroke()

      // 插槽端部垂直限位标线
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(w * 0.38, slotY - 4)
      ctx.lineTo(w * 0.38, slotY + 4)
      ctx.moveTo(w * 0.62, slotY - 4)
      ctx.lineTo(w * 0.62, slotY + 4)
      ctx.stroke()
    }

    drawCouplerSlot(h * 0.05)
    drawCouplerSlot(h * 0.95)

    return canvas
  }

  /**
   * 绘制纯纸质 T 型活动牵引插扣贴图 (深灰耐磨工业质感 + 金属铆钉与结构线)
   */
  private drawCouplerView(w: number, h: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!

    // 工业深冷灰底漆
    ctx.fillStyle = '#334155'
    ctx.fillRect(0, 0, w, h)

    // 边缘金属倒角微高光
    ctx.strokeStyle = '#475569'
    ctx.lineWidth = 1.5
    ctx.strokeRect(2, 2, w - 4, h - 4)

    // 金属骨架加强筋与铆钉细节 (无需对折，剪下即为完整对称 T 型插扣)
    ctx.fillStyle = '#64748b'
    ctx.fillRect(w * 0.20, 6, w * 0.10, h - 12)
    ctx.fillRect(w * 0.70, 6, w * 0.10, h - 12)

    ctx.fillStyle = '#94a3b8'
    ctx.beginPath()
    ctx.arc(w * 0.25, h * 0.22, 3, 0, Math.PI * 2)
    ctx.arc(w * 0.25, h * 0.78, 3, 0, Math.PI * 2)
    ctx.arc(w * 0.75, h * 0.22, 3, 0, Math.PI * 2)
    ctx.arc(w * 0.75, h * 0.78, 3, 0, Math.PI * 2)
    ctx.fill()

    return canvas
  }

  /**
   * 绘制 18米双节巨龙公交立体手风琴折棚贴图 (3D 褶皱阴影与折痕指示)
   */
  private drawBellowsView(w: number, h: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!

    // 哑光深炭黑底色
    ctx.fillStyle = '#1e252e'
    ctx.fillRect(0, 0, w, h)

    // 3D 橡胶手风琴褶皱条纹
    const pleatHeight = h / 8
    for (let i = 0; i < 8; i++) {
      const py = i * pleatHeight
      ctx.fillStyle = i % 2 === 0 ? '#181c22' : '#2f3844'
      ctx.fillRect(0, py, w, pleatHeight)
      // 凸起折棱高光
      ctx.fillStyle = '#475569'
      ctx.fillRect(0, py, w, 1.5)
    }

    // 边框保护条
    ctx.strokeStyle = '#0f141a'
    ctx.lineWidth = 3
    ctx.strokeRect(1, 1, w - 2, h - 2)

    // 标注
    ctx.fillStyle = '#94a3b8'
    ctx.font = 'bold 10px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('BELLOWS GANGWAY 折棚', w * 0.5, h * 0.5)

    return canvas
  }

  /**
   * 绘制车顶空调机组/气动导流罩专属真实贴图 (双排气风扇网罩 + 侧边散热格栅百叶窗)
   */
  private drawAcUnitView(w: number, h: number, params: any): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    const { theme, category, consistId, roofColor } = params

    const style = this.resolveLiveryStyle(theme, category, consistId)
    const isCR400 = style.startsWith('cr400-') || style.startsWith('crh')
    const isFuxingRed = style === 'cr400-fuxing-red'

    // 计算物理展宽与展长比率，消除 UV 缩放导致的椭圆畸变，确保 2D 图纸与 3D 渲染中 100% 绝对正圆
    const physW = isCR400 ? 20 : 24
    const physH = isCR400 ? 36 : (style === 'shinkansen-e5' ? 38 : 36)
    const aspectCorrection = (physH / physW) / (h / w)

    // 1. 空调外壳高质感基底 (复兴号浅银白/科技浅灰，普通列车浅灰金属)
    const baseColor = roofColor || (isFuxingRed ? '#e2e8f0' : (isCR400 ? '#f8fafc' : '#f1f5f9'))
    ctx.fillStyle = baseColor
    ctx.fillRect(0, 0, w, h)

    // 2. 气动流线边框与倒角微倒影
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 2
    ctx.strokeRect(2, 2, w - 4, h - 4)

    // 3. 顶部中央双联大功率排风扇防护圆孔网罩 (Twin Cooling Fans)
    const fanRadiusX = Math.min(w * 0.32, (h * 0.17) * aspectCorrection)
    const fanRadiusY = fanRadiusX / aspectCorrection
    const fan1Y = h * 0.31
    const fan2Y = h * 0.69
    const fanX = w * 0.50

    const drawFan = (cy: number) => {
      // 散热凹坑底色
      ctx.fillStyle = '#1e293b'
      ctx.beginPath()
      ctx.ellipse(fanX, cy, fanRadiusX, fanRadiusY, 0, 0, Math.PI * 2)
      ctx.fill()

      // 涡轮风扇金属轮毂
      ctx.fillStyle = '#475569'
      ctx.beginPath()
      ctx.ellipse(fanX, cy, fanRadiusX * 0.28, fanRadiusY * 0.28, 0, 0, Math.PI * 2)
      ctx.fill()

      // 旋转叶片 (4 叶片)
      ctx.strokeStyle = '#94a3b8'
      ctx.lineWidth = 2
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
        ctx.beginPath()
        ctx.moveTo(fanX, cy)
        ctx.lineTo(fanX + Math.cos(a) * (fanRadiusX - 2), cy + Math.sin(a) * (fanRadiusY - 2))
        ctx.stroke()
      }

      // 不锈钢防鸟安全防护双重金属网格圈
      ctx.strokeStyle = '#64748b'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.ellipse(fanX, cy, fanRadiusX, fanRadiusY, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.ellipse(fanX, cy, fanRadiusX * 0.65, fanRadiusY * 0.65, 0, 0, Math.PI * 2)
      ctx.stroke()
    }

    drawFan(fan1Y)
    drawFan(fan2Y)

    // 4. 前后两端气动导流百叶窗散热槽 (Louvers)
    ctx.fillStyle = '#334155'
    const louverW = w * 0.64
    const louverX = (w - louverW) / 2
    for (let y = h * 0.08; y < h * 0.18; y += 4) {
      ctx.fillRect(louverX, y, louverW, 1.8)
    }
    for (let y = h * 0.82; y < h * 0.92; y += 4) {
      ctx.fillRect(louverX, y, louverW, 1.8)
    }

    // 5. 检修安全铭牌小标
    ctx.fillStyle = '#64748b'
    ctx.fillRect(w * 0.35, h * 0.48, w * 0.30, 3)

    return canvas
  }

  /**
   * 绘制车顶空调机组/气动导流罩纯净金属侧壁贴图 (无风扇、无格栅，保持纯色金属留白)
   */
  private drawAcUnitSideView(w: number, h: number, params: any): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    const { theme, category, consistId, roofColor } = params

    const style = this.resolveLiveryStyle(theme, category, consistId)
    const isCR400 = style.startsWith('cr400-') || style.startsWith('crh')
    const isFuxingRed = style === 'cr400-fuxing-red'

    // 纯净金属底漆 (复兴号浅银白/科技浅灰，普通列车浅灰金属)
    const baseColor = roofColor || (isFuxingRed ? '#e2e8f0' : (isCR400 ? '#f8fafc' : '#f1f5f9'))
    ctx.fillStyle = baseColor
    ctx.fillRect(0, 0, w, h)

    // 边缘极轻微微倒影与折角暗线
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 1
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1)

    return canvas
  }
}
