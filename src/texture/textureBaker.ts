// 纹理烘焙器 (支持通勤电车、新干线高速、大正复古蒸汽全车型真实拟真贴图)
import * as THREE from 'three'
import { TextureTheme, CustomTextConfig, LiveryStyle } from './types'

export interface BakeOptions {
  theme: TextureTheme
  category?: 'commuter' | 'shinkansen' | 'steam' | 'custom' | string
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
    const { theme, category = 'commuter', carType = 'head', customColors, customText, useCustomColors } = options

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
      carType,
      customText
    }

    // 1. 3D 专用横向贴图 (为 head / middle / tail 生成独立真实分面贴图)
    for (const r of ['head', 'middle', 'tail']) {
      const roleParams = { ...params, carType: r }
      const leftMaster = this.drawHorizontalSideView(1024, 280, true, roleParams)
      const rightMaster = this.drawHorizontalSideView(1024, 280, false, roleParams)

      this.slotCanvases.set(`side_left_${r}_3d`, leftMaster)
      this.slotCanvases.set(`side_right_${r}_3d`, rightMaster)
      this.slotCanvases.set(`roof_${r}_3d`, this.drawRoofView(280, 1024, roleParams))
      this.slotCanvases.set(`front_${r}_3d`, this.drawFrontView(280, 320, roleParams))
      this.slotCanvases.set(`back_${r}_3d`, this.drawBackView(280, 320, roleParams))
      this.slotCanvases.set(`bottom_${r}_3d`, this.drawBottomView(280, 1024, roleParams))

      // 2D 图纸专用分车型纵向贴图 (严格数学仿射旋转映射自 3D Master 贴图，100% 物理与视觉一致)
      this.slotCanvases.set(`side_left_${r}`, this.rotateAndMapSide(leftMaster, 'left'))
      this.slotCanvases.set(`side_right_${r}`, this.rotateAndMapSide(rightMaster, 'right'))
      this.slotCanvases.set(`roof_${r}`, this.drawRoofView(380, 1600, roleParams))
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
  private resolveLiveryStyle(theme: any, category: string): LiveryStyle {
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
      theme?.id === 'komachi-ruby' ? 'shinkansen-e6' :
      theme?.id === 'kagayaki-e7' ? 'shinkansen-e7' :
      category === 'shinkansen' ? 'shinkansen-e5' :
      category === 'steam' ? 'steam-d51-classic' : 'commuter-yamanote'
    )

    // 强隔离：如果当前是通勤电车但传入了新干线/蒸汽机车涂装，强制转为通勤电车默认
    if (category === 'commuter') {
      if (declaredStyle.startsWith('shinkansen-') || declaredStyle.startsWith('steam-')) {
        return 'commuter-yamanote'
      }
    } else if (category === 'shinkansen') {
      if (declaredStyle.startsWith('commuter-') || declaredStyle.startsWith('steam-')) {
        return 'shinkansen-e5'
      }
    } else if (category === 'steam') {
      if (declaredStyle.startsWith('shinkansen-') || declaredStyle.startsWith('commuter-')) {
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
    const { primaryColor, secondaryColor, accentColor, roofColor, windowColor, frameColor, theme, category, customText } = params

    const style = this.resolveLiveryStyle(theme, category)

    const isMiddle = params.carType === 'middle'

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
    const { roofColor, secondaryColor, theme, category } = params

    const style = this.resolveLiveryStyle(theme, category)

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
    const { primaryColor, secondaryColor, accentColor, windowColor, frameColor, theme, category, customText } = params

    const style = this.resolveLiveryStyle(theme, category)

    ctx.fillStyle = primaryColor || '#e2e8f0'
    ctx.fillRect(0, 0, w, h)

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
    const { primaryColor, secondaryColor, frameColor, windowColor, category, theme } = params

    const style = this.resolveLiveryStyle(theme, category)

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
    const { secondaryColor, windowColor, frameColor, theme, category } = params

    const style = this.resolveLiveryStyle(theme, category)

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
    const { primaryColor, secondaryColor, accentColor, theme, category } = params

    const style = this.resolveLiveryStyle(theme, category)

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
   * 绘制车底贴图 (优雅机械浅灰 + 检修盖板，避免大面积死黑且打印省墨)
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
    ctx.fillRect(w * 0.10, h * 0.06, w * 0.80, h * 0.18)
    ctx.fillRect(w * 0.10, h * 0.76, w * 0.80, h * 0.18)

    // 底盘设备箱格栅与检修口线条
    ctx.strokeStyle = '#64748b'
    ctx.lineWidth = 1.5
    for (let y = h * 0.32; y < h * 0.68; y += 28) {
      ctx.beginPath()
      ctx.moveTo(w * 0.15, y)
      ctx.lineTo(w * 0.85, y)
      ctx.stroke()
    }

    // 中央底盘标示
    ctx.fillStyle = '#475569'
    ctx.font = 'bold 11px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('PAPERCRAFT CHASSIS', w * 0.5, h * 0.5)

    return canvas
  }
}
