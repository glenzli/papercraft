// 涂装与纹理类型定义

export interface CustomTextConfig {
  trainNumber: string // 如 "E235-01" 或 "NO. 888"
  destination: string // 如 "东京·新宿" 或 "HAPPY EXP"
  kidName: string // 如 "ALEX'S TRAIN" 或 "宝贝号特快"
  enabled: boolean
}

export type LiveryStyle =
  // 通勤电车系列
  | 'commuter-yamanote'        // 东京山手线 (JR E235): 不锈钢+全高绿门波点+绿檐
  | 'commuter-osaka-loop'      // 大阪环状线 (JR 323系): 窗上粗橙带+窗下橙黑腰线+橙色门框+橙黑斜切+车头环状线O标
  | 'commuter-chuo'            // 中央线快速 (JR E233): 不锈钢+朱色1号双横条贯穿
  | 'commuter-keihin'          // 京滨东北线 (JR E233): 不锈钢+青24号天蓝双横条贯穿
  | 'commuter-sobu'            // 总武线各停 (JR E231): 不锈钢+金丝雀黄横带
  | 'commuter-hankyu'          // 关西阪急电车 (Hankyu Maroon): 通体高光典雅栗红(猪肝红)+象牙白顶盖+金色门把
  | 'commuter-marunouchi'      // 东京地下铁丸之内线 (2000系): 通体热情红+白色正弦波浪纹+黑面罩
  // 新干线与特急流线系列
  | 'shinkansen-e5'            // E5系 隼号: 常盘绿+飞燕粉红细线+飞羽白下身
  | 'shinkansen-doctor-yellow' // 923形 黄医生: 通体鲜黄+窗下深蓝经典腰线+通体黄长鼻
  | 'shinkansen-n700'          // N700S / 0系: 珍珠白+窗下双蓝线
  | 'shinkansen-e6'            // E6系 小町号: 茜红顶+银金细腰线+白下身
  | 'shinkansen-e7'            // E7系 辉号: 天蓝顶+铜金腰线+象牙白
  | 'shinkansen-haruka-kitty'   // 关空特急 281系 (Hello Kitty Haruka): 纯白车身+和风樱花折纸蝴蝶结+青花瓷深蓝底纹
  | 'shinkansen-haruka-classic' // 关空特急 281系 (JR原厂经典涂装): 纯白极简车身+窗下深海蓝腰线+灰顶
  | 'shinkansen-haruka-orizuru' // 关空特急 281系 (Hello Kitty 织鹤限定): 和风折纸千纸鹤+金芒点缀
  | 'shinkansen-nankai-rapit'   // 南海电铁 50000系 (特急 Rapi:t): 深邃金属午夜蓝+飞机正圆舷窗+钛银脊线
  | 'shinkansen-nankai-rapit-red'   // 南海电铁 50000系 (高达 UC 赤色彗星限定): 亮金属猩红+新吉翁金标
  | 'shinkansen-nankai-rapit-peach' // 南海电铁 50000系 (Peach 乐桃航空限定): 蜜桃粉+云白
  | 'shinkansen-500-eva'        // 山阳新干线 500系 (TYPE EVA): 新世纪福音战士初号机紫绿黑战斗机甲涂装
  // 🇨🇳 中国高铁复兴号与和谐号系列
  | 'cr400-fuxing-red'         // CR400AF「红神龙」: 银灰底色+凤眼前灯+经典中国红动感飘带
  | 'cr400-fuxing-gold'        // CR400BF「金凤凰」: 象牙白底色+金黄飞翼大前脸+黑金全景车窗带
  | 'crh380a-hexie'            // CRH380A「和谐号」: 纯白底色+经典科技海蓝双飞翼腰线
  | 'crh2-hexie-classic'       // CRH2「和谐号原厂白蓝」: 经典纯白+沉稳深蓝单腰带
  // 🚆 经典新干线 300系 / 铁胆火车侠系列
  | 'shinkansen-300-nozomi'     // 300系「白银希望号」: 纯白底色+东海道经典深海蓝双带+力量感梯形前脸
  | 'shinkansen-0-classic'      // 0系「传奇子弹头/阳光队长」: 经典乳白+蓝裙板+纯正圆形光前鼻锥
  | 'shinkansen-e3-komachi'     // E3系「秋田小町号」: 飞翼银白+柔美紫粉腰带
  | 'shinkansen-683-thunderbird'// 683系「特急雷鸟号」: 典雅纯白+湖蓝黑窗带
  // 🏔️ 小田急全景展望特快系列
  | 'romancecar-gse-red'        // 小田急 70000形 (GSE 玫瑰朱红): Vermillion Orange 玫瑰朱红+深灰全景车顶+金细线
  | 'romancecar-vse-white'      // 小田急 50000形 (VSE 珍珠白): 丝绸珍珠白+橙金双细线
  // 蒸汽机车系列
  | 'steam-d51-classic'        // D51 经典大正黑铁: 炭黑+黄铜箍环+红平衡动轮
  | 'steam-hitoyoshi'          // SL 人吉: 钢琴烤漆黑+纯金饰线与铭牌
  | 'custom'

export interface TextureTheme {
  id: string
  name: string
  author?: string
  category: 'railway' | 'bullet' | 'retro' | 'custom'
  liveryStyle?: LiveryStyle
  compatibleCategories: ('commuter' | 'shinkansen' | 'steam' | 'all')[]
  targetConsistIds?: string[]
  description: string
  colors: {
    primary: string      // 主色调 (如车身底色)
    secondary: string    // 强调色/条纹色
    accent: string       // 点缀色 (如车灯/腰线)
    roof: string         // 车顶色
    window: string       // 车窗色
    frame: string        // 窗框/线条色
  }
  stripes: {
    style: 'single' | 'double' | 'gradient' | 'wavy' | 'checkered' | 'none'
    width: number
  }
  pattern?: 'plain' | 'camo' | 'circuit' | 'dots' | 'wood'
  badgeText?: string
  promptKeywords?: string[]
}

export interface TextureState {
  currentThemeId: string
  customColors: {
    primary: string
    secondary: string
    accent: string
    roof: string
  }
  customText: CustomTextConfig
  useCustomColors: boolean
  aiPrompt: string
  isGeneratingAi: boolean
  aiGeneratedImage: string | null // Data URL 或远端 URL
}
