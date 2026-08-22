// 涂装与纹理类型定义

export interface CustomTextConfig {
  trainNumber: string // 如 "G1234" 或 "EXP-88"
  destination: string // 如 "北京南·上海虹桥" 或 "新宿·东京"
  kidName: string // 如 "复兴号" 或 "ALEX'S EXPRESS"
  textColor?: string // 字体颜色 (如 '#ffffff', '#fef08a', '#0f172a')
  bgColor?: string // 铭牌底框颜色 (如 '#0f172a', '#1e293b')
  offsetX?: number // 水平横向偏移百分比 (-50 到 50, 默认 0)
  offsetY?: number // 垂直纵向偏移百分比 (-50 到 50, 默认 0)
  enabled: boolean
  // 数据驱动的动态插槽映射 (Key: slotKey, Value: string)
  slots?: Record<string, string>
}

export type LiveryStyle =
  // 🚌 城市公交与客车系列 (含 12米标准客车、18米双节铰接巨龙与双层大巴)
  | 'bus-shanghai-71'          // 上海公交 71 路 (水墨科技蓝白+柠檬黄腰线)
  | 'bus-london-red'           // 伦敦经典红巴士 (Heritage Red + Roundel 环标)
  | 'bus-retro-green'          // 复古双拼绿电车 (经典草绿+奶白双拼)
  | 'bus-eco-cyan'             // 现代新能源清风绿 (浅灰+荧光青绿流线)
  | 'bus-articulated-71'       // 18米巨龙中运量 71 路 (水墨蓝白+立体手风琴风挡)
  | 'bus-articulated-beijing'  // 18米北京经典红白巨龙大通道
  | 'bus-articulated-metro'    // 18米欧洲现代都市大容量铰接快线
  | 'bus-double-london-red'    // 伦敦 Routemaster 经典双层纯红巴士
  | 'bus-double-kmb-gold'      // 香港九巴经典「金巴」香槟金
  | 'bus-double-sightseeing'   // 都市全景双层观光巴士
  // 🚊 经典有轨电车与轻轨系列 (含镰仓江之电与香港双层叮叮车)
  | 'tram-enoden-green'        // 镰仓江之电 300形 (经典墨绿+奶油黄+车顶受电弓)
  | 'tram-modern-cyan'         // 现代低地板流线轻轨 (极简白+科技青绿+全景大窗)
  | 'tram-melbourne-green'     // 墨尔本经典 W-Class 绿金电车 (深绿+金黄车顶檐)
  | 'hk-tram-green'            // 香港叮叮车 120号经典墨绿 (传承百年木质电车)
  | 'hk-tram-retro-red'        // 香港叮叮车 怀旧红绿双拼
  | 'hk-tram-blue-ad'          // 香港叮叮车 维港蓝全车身城市广告
  // 🚂 铁路重载货运与内燃机车系列 (含国铁东风系列、日系 JRF、北美 BNSF 与瑞士 SBB)
  | 'df4b-watermelon'          // 东风 4B「经典西瓜皮」: 工业墨绿+浅黄腰线
  | 'df4b-orange'              // 东风 4B「金温橘子皮」: 陶土赭橙+白色破风带
  | 'df4b-blue'                // 东风 4D/4B「蓝太湖」: 沉稳深蓝+银白腰带
  | 'df4b-jrf-red-thunder'     // JR Freight EF510「红雷 Red Thunder」+ 19D 樱花红集装箱
  | 'df4b-jrf-blue-momotaro'   // JR Freight EF210「桃太郎 ECO-POWER」+ 蔚蓝集装箱
  | 'df4b-bnsf-orange'         // 北美重载传奇 BNSF「经典橙黑」+ 53ft 双色集装箱
  | 'df4b-sbb-cargo'           // 瑞士联邦铁路 SBB Cargo「深蓝冰白」+ 欧系多式联运
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
  nameEn?: string
  author?: string
  category: 'railway' | 'bullet' | 'retro' | 'bus' | 'custom'
  liveryStyle?: LiveryStyle
  compatibleCategories: ('commuter' | 'shinkansen' | 'steam' | 'bus' | 'vehicle' | 'freight' | 'all')[]
  targetConsistIds?: string[]
  description: string
  descriptionEn?: string
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

