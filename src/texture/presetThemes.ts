// 官方预设涂装主题库 (声明车型适配兼容性 compatibleCategories、targetConsistIds 与专属 liveryStyle)
import { TextureTheme } from './types'

export const PRESET_THEMES: TextureTheme[] = [
  // ================= 1. 都市通勤电车专属涂装 (Commuter) =================
  {
    id: 'yamanote-green',
    name: '山手线 (青绿全高门)',
    category: 'railway',
    liveryStyle: 'commuter-yamanote',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: '经典的日本都市银灰车身配标志性青绿色全高车门与点阵方块，极具现代感与辨识度。',
    colors: {
      primary: '#e2e8f0',   // 银灰不锈钢车身
      secondary: '#22c55e', // 山手青绿 (全高门与顶檐)
      accent: '#15803d',    // 深绿细腰线
      roof: '#64748b',      // 哑光灰顶
      window: '#0f172a',    // 墨黑防紫外线玻璃
      frame: '#334155'
    },
    stripes: {
      style: 'double',
      width: 14
    },
    badgeText: 'JR-EAST E235',
    promptKeywords: ['Yamanote line', 'Tokyo metro', 'silver commuter train', 'green doors']
  },
  {
    id: 'osaka-loop',
    name: '大阪环状线 (朱橙黑带)',
    category: 'railway',
    liveryStyle: 'commuter-osaka-loop',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: '西日本关西标志性涂装：车窗上方亮橙粗横条、车窗下方橙黑双色带，车门配橙色警示边框与底部运动斜切几何，正面带环状线标志。',
    colors: {
      primary: '#cbd5e1',   // 关西不锈钢亮银
      secondary: '#ea580c', // 环状线亮橙 (朱色)
      accent: '#1e293b',    // 动感深灰黑底带
      roof: '#64748b',      // 哑光灰顶
      window: '#0f172a',
      frame: '#334155'
    },
    stripes: {
      style: 'double',
      width: 16
    },
    badgeText: 'OSAKA-LOOP 323',
    promptKeywords: ['Osaka loop line', 'JR West 323 series', 'orange stripes', 'silver train']
  },
  {
    id: 'chuo-orange',
    name: '中央线快速 (朱色1号)',
    category: 'railway',
    liveryStyle: 'commuter-chuo',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: '横贯东京东西大动脉的经典涂装：不锈钢原色车身，车窗上方与下方贯穿朱色1号（亮橙）双横色彩带。',
    colors: {
      primary: '#e2e8f0',   // 银灰车身
      secondary: '#ea580c', // 朱色1号 (亮橙)
      accent: '#c2410c',    // 深橙腰线
      roof: '#64748b',
      window: '#0f172a',
      frame: '#334155'
    },
    stripes: {
      style: 'double',
      width: 14
    },
    badgeText: 'CHUO-RAPID',
    promptKeywords: ['Chuo line rapid', 'vibrant orange commuter train', 'Tokyo express']
  },
  {
    id: 'keihin-blue',
    name: '京滨东北线 (天蓝青24号)',
    category: 'railway',
    liveryStyle: 'commuter-keihin',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: '穿梭于东京与横滨之间的明亮天蓝色涂装，窗上细带与窗下粗带贯穿全车，清爽靓丽。',
    colors: {
      primary: '#e2e8f0',
      secondary: '#0284c7', // 青24号 (天蓝)
      accent: '#0369a1',    // 海蓝腰线
      roof: '#64748b',
      window: '#0f172a',
      frame: '#334155'
    },
    stripes: {
      style: 'double',
      width: 14
    },
    badgeText: 'KEIHIN-TOHOKU',
    promptKeywords: ['Keihin-Tohoku line', 'sky blue commuter train', 'Tokyo railway']
  },
  {
    id: 'sobu-yellow',
    name: '总武线各停 (金丝雀黄)',
    category: 'railway',
    liveryStyle: 'commuter-sobu',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: '穿梭于千叶与三鹰之间的黄色5号明亮金丝雀黄涂装，横贯东京东西。',
    colors: {
      primary: '#e2e8f0',
      secondary: '#eab308', // 黄色5号 (金丝雀黄)
      accent: '#ca8a04',
      roof: '#64748b',
      window: '#0f172a',
      frame: '#334155'
    },
    stripes: {
      style: 'double',
      width: 14
    },
    badgeText: 'SOBU-LINE',
    promptKeywords: ['Sobu line local', 'canary yellow commuter train', 'Tokyo JR']
  },
  {
    id: 'hankyu-maroon',
    name: '阪急电车 (经典栗红)',
    category: 'railway',
    liveryStyle: 'commuter-hankyu',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: '关西私铁顶级典雅名车：通体高光钢琴烤漆栗红色（Hankyu Maroon），搭配象牙白车顶与金色铝合金门把装饰。',
    colors: {
      primary: '#4a0e17',   // 阪急高光典雅栗红 (Hankyu Maroon)
      secondary: '#f8fafc', // 象牙白顶盖与饰线
      accent: '#facc15',    // 纯金把手与铭牌点缀
      roof: '#f8fafc',      // 象牙白顶
      window: '#0f172a',
      frame: '#cbd5e1'      // 铝合金亮银窗框
    },
    stripes: {
      style: 'none',
      width: 0
    },
    badgeText: 'HANKYU 1000',
    promptKeywords: ['Hankyu railway maroon train', 'elegant burgundy commuter train', 'Kansai luxury train']
  },
  {
    id: 'marunouchi-red',
    name: '丸之内线 (2000系 波浪纹)',
    category: 'railway',
    liveryStyle: 'commuter-marunouchi',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: '东京地下铁丸之内线 2000 系：热情纯正红色车身，搭配标志性的白色正弦波浪纹与黑色流线车头面罩。',
    colors: {
      primary: '#dc2626',   // 热情鲜红 (Glow Scarlet)
      secondary: '#ffffff', // 经典白色正弦波浪纹
      accent: '#18181b',    // 黑防眩车头面罩
      roof: '#991b1b',      // 深红顶
      window: '#0f172a',
      frame: '#1e293b'
    },
    stripes: {
      style: 'wavy',
      width: 16
    },
    badgeText: 'TOKYO METRO 2000',
    promptKeywords: ['Tokyo metro Marunouchi line', 'red 2000 series subway', 'white wave pattern']
  },

  // ================= 2. 新干线与高速特急专属涂装 (Shinkansen) =================
  {
    id: 'hayabusa-emerald',
    name: 'E5 隼号 (常盘绿)',
    category: 'bullet',
    liveryStyle: 'shinkansen-e5',
    compatibleCategories: ['shinkansen'],
    targetConsistIds: ['e5-consist'],
    description: 'JR东日本东北新干线旗舰涂装：上半身常盘绿、下半身飞羽白，中间贯穿标志性的飞燕粉红（疾风粉）腰线。',
    colors: {
      primary: '#ffffff',   // 飞羽白 (下身)
      secondary: '#059669', // 常盘绿 (上身)
      accent: '#ec4899',    // 飞燕粉红细腰线
      roof: '#047857',      // 车顶常盘绿
      window: '#0f172a',    // 防紫外线墨黑车窗
      frame: '#334155'
    },
    stripes: {
      style: 'single',
      width: 8
    },
    badgeText: 'E5 HAYABUSA',
    promptKeywords: ['E5 Hayabusa', 'Tohoku shinkansen', 'emerald green and white bullet train', 'pink stripe']
  },
  {
    id: 'doctor-yellow',
    name: '923形 黄医生',
    category: 'bullet',
    liveryStyle: 'shinkansen-doctor-yellow',
    compatibleCategories: ['shinkansen'],
    targetConsistIds: ['e5-consist'],
    description: '新干线轨道电气综合检查神车：通体鲜亮高能柠檬黄底色，贯穿东海道经典的深海蓝腰线。',
    colors: {
      primary: '#facc15',   // 鲜亮柠檬黄
      secondary: '#1e3a8a', // 东海道深海蓝腰线
      accent: '#3b82f6',    // 天蓝高光
      roof: '#eab308',      // 亮黄顶
      window: '#0f172a',
      frame: '#334155'
    },
    stripes: {
      style: 'single',
      width: 10
    },
    badgeText: 'DOCTOR YELLOW 923',
    promptKeywords: ['Doctor Yellow 923', 'yellow shinkansen', 'blue stripe inspection train']
  },
  {
    id: 'n700-nozomi',
    name: 'N700S 希望号',
    category: 'bullet',
    liveryStyle: 'shinkansen-n700',
    compatibleCategories: ['shinkansen'],
    targetConsistIds: ['e5-consist'],
    description: '东海道·山阳新干线的主力象征：纯净高雅的珍珠白车身，窗下配东海道经典的双蓝条纹与 Supreme 金色徽标。',
    colors: {
      primary: '#f8fafc',   // 珍珠白
      secondary: '#1d4ed8', // 东海道蓝双线
      accent: '#d97706',    // Supreme 金色徽标
      roof: '#f1f5f9',      // 浅灰白顶
      window: '#0f172a',
      frame: '#334155'
    },
    stripes: {
      style: 'double',
      width: 14
    },
    badgeText: 'N700S SUPREME',
    promptKeywords: ['N700S shinkansen', 'white bullet train', 'blue double stripes', 'Tokaido shinkansen']
  },
  {
    id: 'haruka-hellokitty',
    name: 'Hello Kitty 樱花专列',
    category: 'bullet',
    liveryStyle: 'shinkansen-haruka-kitty',
    compatibleCategories: [],
    targetConsistIds: ['haruka-kitty-consist'],
    description: '穿梭于关西空港与京都之间的超人气专列：纯白底漆搭配穿和服的 Hello Kitty 经典肖像、青花瓷深蓝底带与散落飘飞的自然粉樱。',
    colors: {
      primary: '#ffffff',   // 通体高雅纯净白
      secondary: '#1e3a8a', // 底部极细深海蓝边线
      accent: '#f472b6',    // 和风粉红樱花
      roof: '#ffffff',      // 车顶纯白
      window: '#0f172a',    // 深黑客舱车窗
      frame: '#cbd5e1'
    },
    stripes: {
      style: 'gradient',
      width: 16
    },
    badgeText: '',
    promptKeywords: ['Hello Kitty train', 'Haruka Kansai airport express', 'Japanese sakura floral bullet train']
  },
  {
    id: 'haruka-classic-jr',
    name: 'JR 经典原厂 (白蓝)',
    category: 'bullet',
    liveryStyle: 'shinkansen-haruka-classic',
    compatibleCategories: [],
    targetConsistIds: ['haruka-kitty-consist'],
    description: '1994年开通以来的正统原厂涂装：高雅纯白车身，车窗下方贯穿极细 JR 西日本海洋蓝腰线与深灰车顶，纯粹典雅。',
    colors: {
      primary: '#ffffff',   // 纯净雪白
      secondary: '#0284c7', // JR西日本海蓝细腰线
      accent: '#1e3a8a',    // 经典深蓝
      roof: '#64748b',      // 哑光深灰顶
      window: '#0f172a',
      frame: '#94a3b8'
    },
    stripes: {
      style: 'single',
      width: 12
    },
    badgeText: '',
    promptKeywords: ['JR West 281 series Haruka', 'white and marine blue airport express train']
  },
  {
    id: 'haruka-kitty-orizuru',
    name: 'Hello Kitty 织鹤限定',
    category: 'bullet',
    liveryStyle: 'shinkansen-haruka-orizuru',
    compatibleCategories: [],
    targetConsistIds: ['haruka-kitty-consist'],
    description: '象征和平与祝福的和风限定专列：纯白车身点缀金色日式千纸鹤、祥云与金樱花。',
    colors: {
      primary: '#ffffff',
      secondary: '#d97706', // 祥瑞鎏金
      accent: '#f59e0b',    // 织鹤金芒
      roof: '#ffffff',
      window: '#0f172a',
      frame: '#fbbf24'
    },
    stripes: {
      style: 'gradient',
      width: 14
    },
    badgeText: '',
    promptKeywords: ['Hello Kitty origami crane train', 'gold and white Japanese train']
  },
  {
    id: 'nankai-rapit',
    name: '经典午夜深蓝',
    category: 'bullet',
    liveryStyle: 'shinkansen-nankai-rapit',
    compatibleCategories: [],
    targetConsistIds: ['nankai-rapit-consist'],
    description: '极具未来科幻感的关西特急：深邃纯正金属午夜深蓝车体，搭配飞机舱正圆形大舷窗与复古未来主义机甲面罩。',
    colors: {
      primary: '#0f2b5c',   // 纯正金属午夜深蓝 (Midnight Navy Blue)
      secondary: '#cbd5e1', // 钛银金属中脊中线
      accent: '#94a3b8',    // 钛灰金属密封法兰圈
      roof: '#0b1d3a',      // 深藏青黑顶
      window: '#020617',    // 正圆形飞机全景舷窗
      frame: '#64748b'      // 钛灰金属密封框
    },
    stripes: {
      style: 'none',
      width: 0
    },
    badgeText: '',
    promptKeywords: ['Nankai Rapit 50000 series', 'retro-futuristic train', 'midnight metallic blue', 'oval airplane windows']
  },
  {
    id: 'nankai-rapit-red',
    name: '高达 UC 赤色彗星限定',
    category: 'bullet',
    liveryStyle: 'shinkansen-nankai-rapit-red',
    compatibleCategories: [],
    targetConsistIds: ['nankai-rapit-consist'],
    description: '2014年机动战士高达 UC 联动传奇专列：新吉翁全·伏朗托专属「赤色彗星」亮金属猩红车身，配纯金饰线与吉翁军徽。',
    colors: {
      primary: '#991b1b',   // 亮金属猩红 (Neo Zeon Crimson)
      secondary: '#eab308', // 纯金吉翁饰线
      accent: '#facc15',    // 亮金机甲徽标
      roof: '#450a0a',      // 暗红黑顶
      window: '#020617',    // 正圆形全景舷窗
      frame: '#ca8a04'      // 金色密封法兰
    },
    stripes: {
      style: 'single',
      width: 14
    },
    badgeText: 'NEO ZEON RAPIT',
    promptKeywords: ['Gundam UC Red Comet Rapit', 'crimson red metallic train', 'Neo Zeon gold stripe']
  },
  {
    id: 'nankai-rapit-peach',
    name: '南海特急 Rapi:t (Peach 乐桃航空联动限定)',
    category: 'bullet',
    liveryStyle: 'shinkansen-nankai-rapit-peach',
    compatibleCategories: [],
    targetConsistIds: ['nankai-rapit-consist'],
    description: '2014年南海电铁与 Peach 乐桃航空联动专列：充满青春活力的蜜桃粉（Peach Pink）与纯白流线车体，搭配紫红线条。',
    colors: {
      primary: '#ffffff',   // 纯白机身
      secondary: '#db2777', // 乐桃粉红 (Peach Pink)
      accent: '#831843',    // 浆果紫红细线
      roof: '#f472b6',      // 蜜桃粉车顶
      window: '#020617',    // 正圆形全景舷窗
      frame: '#fbcfe8'
    },
    stripes: {
      style: 'gradient',
      width: 16
    },
    badgeText: 'PEACH RAPIT',
    promptKeywords: ['Peach aviation Rapit train', 'pink and white bullet train']
  },
  {
    id: 'shinkansen-500-eva',
    name: '500系 EVA 初号机',
    category: 'bullet',
    liveryStyle: 'shinkansen-500-eva',
    compatibleCategories: ['shinkansen'],
    targetConsistIds: ['e5-consist'],
    description: '新世纪福音战士 20 周年限定神车：新干线 500 系完美融合 EVA-01 初号机标志性紫、荧光绿、警示橙与机甲线条。',
    colors: {
      primary: '#6b21a8',   // EVA 初号机专属深紫 (Unit-01 Purple)
      secondary: '#22c55e', // 荧光机甲绿
      accent: '#ea580c',    // 警示荧光橙
      roof: '#581c87',      // 深紫顶
      window: '#020617',
      frame: '#1e293b'
    },
    stripes: {
      style: 'gradient',
      width: 18
    },
    badgeText: '500 TYPE EVA',
    promptKeywords: ['500 Type EVA shinkansen', 'Evangelion Unit 01 purple and neon green train', 'mecha bullet train']
  },
  {
    id: 'komachi-ruby',
    name: 'E6 小町号 (茜红)',
    category: 'bullet',
    liveryStyle: 'shinkansen-e6',
    compatibleCategories: ['shinkansen'],
    targetConsistIds: ['e5-consist'],
    description: '热情奔放的茜红流线车顶配银灰车身与金黄细腰线，极具视觉张力。',
    colors: {
      primary: '#f1f5f9',   // 飞云白
      secondary: '#dc2626', // 茜红车顶
      accent: '#f59e0b',    // 金黄腰线
      roof: '#b91c1c',
      window: '#0f172a',
      frame: '#1e293b'
    },
    stripes: {
      style: 'gradient',
      width: 16
    },
    badgeText: 'KOMACHI E6',
    promptKeywords: ['Akita shinkansen E6', 'ruby red roof', 'white bullet train']
  },
  {
    id: 'kagayaki-e7',
    name: 'E7 辉号 (青金)',
    category: 'bullet',
    liveryStyle: 'shinkansen-e7',
    compatibleCategories: ['shinkansen'],
    targetConsistIds: ['e5-consist'],
    description: '穿梭于日本阿尔卑斯的天空蓝车顶配黄铜金腰线与象牙白下车体，典雅尊贵。',
    colors: {
      primary: '#f8fafc',   // 象牙白
      secondary: '#0284c7', // 天空蓝车顶
      accent: '#d97706',    // 铜金腰线
      roof: '#0369a1',
      window: '#0f172a',
      frame: '#1e293b'
    },
    stripes: {
      style: 'double',
      width: 16
    },
    badgeText: 'KAGAYAKI E7',
    promptKeywords: ['E7 shinkansen', 'sky blue roof', 'gold copper stripe', 'Hokuriku shinkansen']
  },

  // ================= 3. 🇨🇳 中国高铁复兴号 / 和谐号专属涂装 =================
  {
    id: 'cr400-fuxing-red',
    name: 'CR400AF 红神龙 (复兴号)',
    category: 'bullet',
    liveryStyle: 'cr400-fuxing-red',
    compatibleCategories: [],
    targetConsistIds: ['cr400-fuxing-consist'],
    description: '中国标准动车组旗舰 CR400AF：低风阻科技银灰底色、犀利如炬的凤眼大灯与凌厉动感的经典中国红飘带。',
    colors: {
      primary: '#cbd5e1',   // 科技银灰
      secondary: '#dc2626', // 经典中国红动感飘带
      accent: '#991b1b',    // 深红暗影
      roof: '#94a3b8',      // 哑光铝灰顶
      window: '#020617',    // 防紫外线墨黑车窗
      frame: '#334155'
    },
    stripes: {
      style: 'wavy',
      width: 14
    },
    badgeText: 'CR400AF 复兴号',
    promptKeywords: ['China high-speed train CR400AF', 'Fuxing Hao Red Dragon', 'silver and red bullet train']
  },
  {
    id: 'cr400-fuxing-gold',
    name: 'CR400BF 金凤凰 (复兴号)',
    category: 'bullet',
    liveryStyle: 'cr400-fuxing-gold',
    compatibleCategories: [],
    targetConsistIds: ['cr400-fuxing-consist'],
    description: '中国标准动车组 CR400BF：高雅象牙白底色，前脸环绕金色飞翼与纯黑前罩，全景车窗带配金黄动感腰线。',
    colors: {
      primary: '#f8fafc',   // 纯净象牙白
      secondary: '#d97706', // 金黄飞翼金凤凰腰线
      accent: '#0f172a',    // 黑色流线前脸
      roof: '#e2e8f0',      // 浅白顶
      window: '#020617',
      frame: '#334155'
    },
    stripes: {
      style: 'wavy',
      width: 14
    },
    badgeText: 'CR400BF 金凤凰',
    promptKeywords: ['CR400BF Golden Phoenix', 'white and gold Fuxing bullet train', 'China railway high speed']
  },
  {
    id: 'crh380a-hexie',
    name: 'CRH380A 和谐号 (科技蓝)',
    category: 'bullet',
    liveryStyle: 'crh380a-hexie',
    compatibleCategories: [],
    targetConsistIds: ['cr400-fuxing-consist'],
    description: '中国高铁代表作 CRH380A：经典纯白车身，窗下贯穿科技海蓝双飞翼动感腰带与和谐号前照灯。',
    colors: {
      primary: '#ffffff',   // 纯白
      secondary: '#0284c7', // 科技海蓝双飞翼
      accent: '#0369a1',    // 深蓝勾线
      roof: '#f1f5f9',
      window: '#0f172a',
      frame: '#334155'
    },
    stripes: {
      style: 'double',
      width: 14
    },
    badgeText: 'CRH 和谐号',
    promptKeywords: ['CRH380A Hexie Hao', 'white and blue bullet train', 'China high speed railway']
  },
  {
    id: 'crh2-hexie-classic',
    name: 'CRH2 和谐号 (经典白蓝)',
    category: 'bullet',
    liveryStyle: 'crh2-hexie-classic',
    compatibleCategories: [],
    targetConsistIds: ['cr400-fuxing-consist'],
    description: '早期经典大白动车组 CRH2：纯净白身贯穿单道沉稳深蓝腰带，开创中国高铁动车时代。',
    colors: {
      primary: '#ffffff',
      secondary: '#1d4ed8', // 经典沉稳深蓝
      accent: '#1e40af',
      roof: '#e2e8f0',
      window: '#0f172a',
      frame: '#334155'
    },
    stripes: {
      style: 'single',
      width: 12
    },
    badgeText: 'CRH2 和谐号',
    promptKeywords: ['CRH2 bullet train', 'classic white blue train', 'China railway']
  },

  // ================= 4. 🚆 经典新干线 300系 / 铁胆火车侠专属涂装 =================
  {
    id: 'shinkansen-300-nozomi',
    name: '300系 白银希望号 (哲雪号)',
    category: 'bullet',
    liveryStyle: 'shinkansen-300-nozomi',
    compatibleCategories: [],
    targetConsistIds: ['shinkansen300-hikarian-consist'],
    description: '东海道新干线 300系 / 《铁胆火车侠》哲雪的主角列车：纯白车身、东海道经典双海蓝腰线与硬朗梯形前脸。',
    colors: {
      primary: '#ffffff',   // 纯白
      secondary: '#1e3a8a', // 东海道深海蓝双带
      accent: '#3b82f6',
      roof: '#f1f5f9',
      window: '#0f172a',
      frame: '#334155'
    },
    stripes: {
      style: 'double',
      width: 14
    },
    badgeText: 'SHINKANSEN 300',
    promptKeywords: ['Shinkansen 300 Nozomi', 'Hikarian Silver Express', 'white bullet train blue stripes']
  },
  {
    id: 'shinkansen-0-classic',
    name: '0系 传奇子弹头 (阳光队长)',
    category: 'bullet',
    liveryStyle: 'shinkansen-0-classic',
    compatibleCategories: [],
    targetConsistIds: ['shinkansen300-hikarian-consist'],
    description: '世界高铁始祖 0系 / 《铁胆火车侠》阳光队长：复古乳白车身、深蓝下裙板与标志性纯圆透光前鼻锥。',
    colors: {
      primary: '#f8fafc',   // 复古乳白
      secondary: '#1e3a8a', // 经典深蓝下裙
      accent: '#facc15',    // 圆形透光光电鼻锥
      roof: '#e2e8f0',
      window: '#0f172a',
      frame: '#334155'
    },
    stripes: {
      style: 'single',
      width: 16
    },
    badgeText: 'SERIES 0 BULLET',
    promptKeywords: ['Series 0 shinkansen', 'classic bullet train', 'Hikarian Captain Sunlight']
  },
  {
    id: 'shinkansen-e3-komachi',
    name: 'E3系 秋田小町号',
    category: 'bullet',
    liveryStyle: 'shinkansen-e3-komachi',
    compatibleCategories: [],
    targetConsistIds: ['shinkansen300-hikarian-consist'],
    description: '秋田新干线初代经典 E3 系：珍珠银白车身、灰银车顶与柔美小町粉紫腰带。',
    colors: {
      primary: '#f1f5f9',   // 珍珠银白
      secondary: '#db2777', // 小町粉紫细带
      accent: '#64748b',    // 灰银裙边
      roof: '#475569',
      window: '#0f172a',
      frame: '#334155'
    },
    stripes: {
      style: 'single',
      width: 10
    },
    badgeText: 'E3 KOMACHI',
    promptKeywords: ['E3 Komachi shinkansen', 'silver white train pink stripe', 'Akita shinkansen']
  },
  {
    id: 'shinkansen-683-thunderbird',
    name: '683系 特急雷鸟号 (使者号)',
    category: 'bullet',
    liveryStyle: 'shinkansen-683-thunderbird',
    compatibleCategories: [],
    targetConsistIds: ['shinkansen300-hikarian-consist'],
    description: '北陆特急王者 683 系 Thunderbird：纯白车身贯穿深黑连续全景客舱窗与湖蓝细边。',
    colors: {
      primary: '#ffffff',
      secondary: '#0284c7', // 湖蓝细线
      accent: '#0f172a',    // 墨黑全景窗带
      roof: '#94a3b8',
      window: '#0f172a',
      frame: '#1e293b'
    },
    stripes: {
      style: 'single',
      width: 8
    },
    badgeText: 'THUNDERBIRD 683',
    promptKeywords: ['683 series Thunderbird', 'JR West express train', 'white and blue express']
  },

  // ================= 5. 🏔️ 小田急全景展望特快专属涂装 =================
  {
    id: 'romancecar-gse-red',
    name: '小田急 GSE (玫瑰朱红)',
    category: 'bullet',
    liveryStyle: 'romancecar-gse-red',
    compatibleCategories: [],
    targetConsistIds: ['odakyu-romancecar-gse-consist'],
    description: '箱根观光旗舰浪漫特快 GSE 70000形：专属玫瑰朱红 (Rose Vermillion) 豪华底漆、深灰全景车顶与金色腰线。',
    colors: {
      primary: '#e11d48',   // 玫瑰朱红 (Rose Vermillion)
      secondary: '#334155', // 深灰全景车顶
      accent: '#d97706',    // 金色纤细饰线
      roof: '#1e293b',      // 哑光黑灰展望顶
      window: '#020617',
      frame: '#0f172a'
    },
    stripes: {
      style: 'single',
      width: 6
    },
    badgeText: 'GSE 70000',
    promptKeywords: ['Odakyu Romancecar GSE 70000', 'vermillion red luxury train', 'Hakone observation express']
  },
  {
    id: 'romancecar-vse-white',
    name: '小田急 VSE (珍珠纯白)',
    category: 'bullet',
    liveryStyle: 'romancecar-vse-white',
    compatibleCategories: [],
    targetConsistIds: ['odakyu-romancecar-gse-consist'],
    description: '白色浪漫特快传奇 VSE 50000形：如丝绸般的高雅珍珠白车身，配两道经典的橙金细腰带。',
    colors: {
      primary: '#ffffff',   // 丝绸珍珠白
      secondary: '#ea580c', // 橙金细双线
      accent: '#d97706',
      roof: '#f8fafc',
      window: '#020617',
      frame: '#334155'
    },
    stripes: {
      style: 'double',
      width: 10
    },
    badgeText: 'VSE 50000',
    promptKeywords: ['Odakyu Romancecar VSE 50000', 'pearl white luxury train', 'orange stripes']
  },

  // ================= 3. 大正复古蒸汽机车专属涂装 (Steam) =================
  {
    id: 'vintage-steam',
    name: '大正浪漫复古黑金',
    category: 'retro',
    liveryStyle: 'steam-d51-classic',
    compatibleCategories: ['steam'],
    targetConsistIds: ['d51-consist'],
    description: '深邃高贵黑底色搭配拉丝纯金古典装饰线条与红铜铆钉，浓郁机械复古浪漫。',
    colors: {
      primary: '#1c1917',   // 哑光炭黑
      secondary: '#d97706', // 复古黄铜金
      accent: '#b45309',    // 深红铜
      roof: '#292524',      // 铁灰顶
      window: '#451a03',    // 暖琥珀色窗
      frame: '#78350f'
    },
    stripes: {
      style: 'double',
      width: 10
    },
    pattern: 'wood',
    badgeText: 'STEAM-D51',
    promptKeywords: ['Vintage steam locomotive', 'gold filigree trim', 'classic luxury express train', 'brass accents']
  },
  {
    id: 'steam-hitoyoshi',
    name: 'SL人吉 漆黑典雅号',
    category: 'retro',
    liveryStyle: 'steam-hitoyoshi',
    compatibleCategories: ['steam'],
    targetConsistIds: ['d51-consist'],
    description: '九州经典复古观光蒸汽火车，深邃钢琴黑配双道耀眼纯金饰线。',
    colors: {
      primary: '#09090b',   // 钢琴黑
      secondary: '#eab308', // 纯金饰带
      accent: '#ca8a04',
      roof: '#18181b',
      window: '#3f2c1d',
      frame: '#713f12'
    },
    stripes: {
      style: 'single',
      width: 8
    },
    pattern: 'wood',
    badgeText: 'SL-HITOYOSHI',
    promptKeywords: ['SL Hitoyoshi steam train', 'piano black', 'gold pinstripes', 'classic steam train']
  }
]
