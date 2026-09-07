// 官方预设涂装主题库 (声明车型适配兼容性 compatibleCategories、targetConsistIds 与专属 liveryStyle)
import { TextureTheme } from './types'

export const PRESET_THEMES: TextureTheme[] = [
  // ================= 0. 城市公交与客车专属涂装 (Buses & Coaches) =================
  {
    id: 'bus-71-blue',
    name: "上海71路 · 蓝白",
    nameEn: "Shanghai 71 · Blue/white",
    category: 'bus',
    liveryStyle: 'bus-shanghai-71',
    compatibleCategories: ['bus'],
    targetConsistIds: ['city-bus-consist'],
    description: "白色上身与深蓝下身，窗下有细黄色分界线。",
    descriptionEn: "White upper body, navy lower body and a fine yellow divider.",
    colors: {
      primary: '#1c4870',   // 沉稳水墨深蓝
      secondary: '#f5f7fa', // 珍珠白
      accent: '#d49b35',    // 温暖金色腰线
      roof: '#e2e8f0',      // 浅灰车顶空调机
      window: '#0f172a',
      frame: '#334155'
    },
    stripes: {
      style: 'double',
      width: 16
    },
    badgeText: 'SHANGHAI TRANSIT 71'
  },
  {
    id: 'bus-london-red',
    name: "伦敦红",
    nameEn: "London red",
    category: 'bus',
    liveryStyle: 'bus-london-red',
    compatibleCategories: ['bus'],
    targetConsistIds: ['city-bus-consist'],
    description: "红色车身、深色窗带与细金色装饰线。",
    descriptionEn: "Red body, dark window band and a fine gold stripe.",
    colors: {
      primary: '#982127',   // 伦敦经典深红 (Carmine)
      secondary: '#ffffff', // 白顶檐与徽标
      accent: '#d49b35',    // 暖黄前路牌高亮
      roof: '#982127',      // 伦敦经典深红顶
      window: '#0f172a',
      frame: '#1e293b'
    },
    stripes: {
      style: 'single',
      width: 14
    },
    badgeText: 'LONDON TRANSPORT'
  },
  {
    id: 'bus-retro-green',
    name: "复古绿白",
    nameEn: "Heritage green/cream",
    category: 'bus',
    liveryStyle: 'bus-retro-green',
    compatibleCategories: ['bus'],
    targetConsistIds: ['city-bus-consist'],
    description: "奶油色上身与深绿下身，保留双拼分界。",
    descriptionEn: "Cream upper body over a deep green lower body.",
    colors: {
      primary: '#254832',   // 复古墨绿
      secondary: '#f5ede0', // 象牙暖白
      accent: '#b88232',    // 黄铜金细线
      roof: '#e2e8f0',
      window: '#0f172a',
      frame: '#334155'
    },
    stripes: {
      style: 'double',
      width: 14
    },
    badgeText: 'RETRO TRANSIT'
  },
  {
    id: 'bus-eco-green',
    name: "清新青绿",
    nameEn: "Fresh cyan/green",
    category: 'bus',
    liveryStyle: 'bus-eco-cyan',
    compatibleCategories: ['bus'],
    targetConsistIds: ['city-bus-consist'],
    description: "白色车身搭配青绿侧面块和斜向白色条纹。",
    descriptionEn: "White body with green side panels and diagonal white stripes.",
    colors: {
      primary: '#f3f6f8',   // 极简浅灰白底色
      secondary: '#2b6657', // 清风青绿
      accent: '#3d7988',    // 水色青流线
      roof: '#cbd5e1',
      window: '#0f172a',
      frame: '#334155'
    },
    stripes: {
      style: 'single',
      width: 18
    },
    badgeText: 'ZERO EMISSION EV'
  },
  // ================= 0.5 18米双节铰接巨龙公交专属涂装 (Articulated Buses) =================
  {
    id: 'bus-articulated-71',
    name: "上海71路 · 蓝白",
    nameEn: "Shanghai 71 · Blue/white",
    category: 'bus',
    liveryStyle: 'bus-articulated-71',
    compatibleCategories: ['bus'],
    targetConsistIds: ['articulated-bus-consist'],
    description: "蓝白双拼与窗下黄色细线，延伸至后节车身。",
    descriptionEn: "Blue/white panels and a thin yellow stripe continue along both sections.",
    colors: {
      primary: '#1c4870',   // 沉稳水墨蓝
      secondary: '#f5f7fa', // 珍珠白
      accent: '#d49b35',    // 温暖金流线
      roof: '#f5f7fa',
      window: '#0f172a',
      frame: '#334155'
    },
    stripes: {
      style: 'double',
      width: 16
    },
    badgeText: 'SHANGHAI BRT 71'
  },
  {
    id: 'bus-articulated-beijing',
    name: "北京公交 · 红白",
    nameEn: "Beijing · Red/white",
    category: 'bus',
    liveryStyle: 'bus-articulated-beijing',
    compatibleCategories: ['bus'],
    targetConsistIds: ['articulated-bus-consist'],
    description: "白色上身、红色下身和黄色窗下线。",
    descriptionEn: "White upper body, red lower body and a yellow window stripe.",
    colors: {
      primary: '#8c242b',   // 首都深红
      secondary: '#f5f0e8', // 象牙乳白
      accent: '#1e293b',    // 深灰折棚
      roof: '#f5f0e8',
      window: '#0f172a',
      frame: '#334155'
    },
    stripes: {
      style: 'single',
      width: 14
    },
    badgeText: 'BEIJING TRANSIT'
  },
  {
    id: 'bus-articulated-metro',
    name: "都市快线 · 蓝橙",
    nameEn: "Metro express · Blue/orange",
    category: 'bus',
    liveryStyle: 'bus-articulated-metro',
    compatibleCategories: ['bus'],
    targetConsistIds: ['articulated-bus-consist'],
    description: "深蓝车身与向车尾抬起的橙色条纹。",
    descriptionEn: "Navy body with an orange stripe rising toward the rear.",
    colors: {
      primary: '#253342',   // 石墨深灰
      secondary: '#3b4a59', // 雾面灰
      accent: '#c85a2b',    // 暖赭橙
      roof: '#18222d',
      window: '#020617',
      frame: '#475569'
    },
    stripes: {
      style: 'double',
      width: 16
    },
    badgeText: 'METRO EXPRESS'
  },
  // ================= 0.55 经典双层客车专属涂装 (Double Decker Buses) =================
  {
    id: 'bus-double-london-red',
    name: "伦敦红",
    nameEn: "London red",
    category: 'bus',
    liveryStyle: 'bus-double-london-red',
    compatibleCategories: ['bus'],
    targetConsistIds: ['double-decker-bus-consist'],
    description: "红色双层车身，两排深色车窗之间以金线分隔。",
    descriptionEn: "Red double-deck body with a gold divider between the window rows.",
    colors: {
      primary: '#982127',   // 伦敦经典深红 (Carmine)
      secondary: '#7a1a1f', // 深红暗部
      accent: '#d49b35',    // 暖金车号
      roof: '#982127',      // 经典深红车顶
      window: '#020617',
      frame: '#ffffff'
    },
    stripes: {
      style: 'single',
      width: 0
    },
    badgeText: 'LONDON TRANSPORT'
  },
  {
    id: 'bus-double-kmb-gold',
    name: "九巴香槟金",
    nameEn: "KMB champagne gold",
    category: 'bus',
    liveryStyle: 'bus-double-kmb-gold',
    compatibleCategories: ['bus'],
    targetConsistIds: ['double-decker-bus-consist'],
    description: "香槟金车身，红色分界线连接两排车窗。",
    descriptionEn: "Champagne body with a red divider between the window rows.",
    colors: {
      primary: '#d5c7ab',   // 九巴香槟金
      secondary: '#802028', // 九巴暗红
      accent: '#982127',    // 红色腰带
      roof: '#cebea0',      // 香槟金顶
      window: '#020617',
      frame: '#1e293b'
    },
    stripes: {
      style: 'single',
      width: 14
    },
    badgeText: 'KMB 九巴'
  },
  {
    id: 'bus-double-sightseeing',
    name: "观光巴士配色",
    nameEn: "Sightseeing colors",
    category: 'bus',
    liveryStyle: 'bus-double-sightseeing',
    compatibleCategories: ['bus'],
    targetConsistIds: ['double-decker-bus-consist'],
    description: "红色双层车身与浅色横带。",
    descriptionEn: "Red double-deck body with pale horizontal bands.",
    colors: {
      primary: '#8c222c',   // 观光酒红
      secondary: '#d89c32', // 暖金黄
      accent: '#f5f0e8',    // 象牙白边
      roof: '#f5f0e8',
      window: '#020617',
      frame: '#334155'
    },
    stripes: {
      style: 'wavy',
      width: 16
    },
    badgeText: 'CITY SIGHTSEEING'
  },
  // ================= 0.6 经典有轨电车与轻轨专属涂装 (Trams & Light Rail) =================
  {
    id: 'tram-enoden-green',
    name: "江之电 · 绿黄",
    nameEn: "Enoden · Green/cream",
    category: 'railway',
    liveryStyle: 'tram-enoden-green',
    compatibleCategories: ['vehicle', 'commuter', 'bus'],
    targetConsistIds: ['tram-consist'],
    description: "奶油色车顶边缘、深绿下身与深色客门。",
    descriptionEn: "Cream roof edge, dark green lower body and dark doors.",
    colors: {
      primary: '#1e422d',   // 江之电古松绿
      secondary: '#faecd2', // 湘南奶油黄
      accent: '#b87b28',    // 黄铜金标
      roof: '#cbd5e1',      // 银灰顶配受电弓
      window: '#0f172a',
      frame: '#334155'
    },
    stripes: {
      style: 'single',
      width: 12
    },
    badgeText: 'ENOSHIMA ELECTRIC RAILWAY'
  },
  {
    id: 'tram-modern-cyan',
    name: "现代轻轨风格 · 青色",
    nameEn: "Modern tram style · Cyan",
    category: 'railway',
    liveryStyle: 'tram-modern-cyan',
    compatibleCategories: ['vehicle', 'commuter', 'bus'],
    targetConsistIds: ['tram-consist'],
    description: "白色车身、连续深色窗带与青灰细线。",
    descriptionEn: "White body, dark window band and a muted cyan stripe.",
    colors: {
      primary: '#f5f7fa',   // 极简纯白
      secondary: '#3b6f80', // 水色青
      accent: '#2b5266',    // 科技蓝
      roof: '#18222d',      // 黑化车顶
      window: '#020617',
      frame: '#334155'
    },
    stripes: {
      style: 'double',
      width: 14
    },
    badgeText: 'CITY LIGHT RAIL'
  },
  {
    id: 'tram-melbourne-green',
    name: "墨尔本风格 · 绿金",
    nameEn: "Melbourne style · Green/gold",
    category: 'railway',
    liveryStyle: 'tram-melbourne-green',
    compatibleCategories: ['vehicle', 'commuter', 'bus'],
    targetConsistIds: ['tram-consist'],
    description: "金色车顶边缘与深绿车身。",
    descriptionEn: "Gold roof edge over a deep green body.",
    colors: {
      primary: '#1f422e',   // 墨尔本深绿
      secondary: '#c49238', // 金黄檐口
      accent: '#d49e3c',    // 黄铜金线
      roof: '#f5eee0',      // 奶油白顶
      window: '#0f172a',
      frame: '#1e293b'
    },
    stripes: {
      style: 'double',
      width: 12
    },
    badgeText: 'MELBOURNE TRAMWAYS'
  },
  // ================= 0.65 香港双层叮叮车专属涂装 (Hong Kong Ding Ding Tram) =================
  {
    id: 'hk-tram-green',
    name: "经典墨绿",
    nameEn: "Heritage green",
    category: 'railway',
    liveryStyle: 'hk-tram-green',
    compatibleCategories: ['commuter', 'vehicle', 'bus'],
    targetConsistIds: ['hk-tram-consist'],
    description: "深绿车身，窗间带有细金色装饰。",
    descriptionEn: "Deep green body with fine gold trim between windows.",
    colors: {
      primary: '#1d3e2b',   // 叮叮车 120号老墨绿
      secondary: '#f5eee3', // 暖木象牙白
      accent: '#c89635',    // 黄铜金色车号
      roof: '#f3ede2',      // 浅灰木纹顶
      window: '#0f172a',
      frame: '#3d2817'
    },
    stripes: {
      style: 'single',
      width: 10
    },
    badgeText: 'HONG KONG TRAMWAYS'
  },
  {
    id: 'hk-tram-retro-red',
    name: "红绿双拼",
    nameEn: "Red/green",
    category: 'railway',
    liveryStyle: 'hk-tram-retro-red',
    compatibleCategories: ['commuter', 'vehicle', 'bus'],
    targetConsistIds: ['hk-tram-consist'],
    description: "红色上层与深绿下层，以金线分隔。",
    descriptionEn: "Red upper deck and green lower deck separated by gold trim.",
    colors: {
      primary: '#1d3e2b',   // 下身老墨绿
      secondary: '#7e2229', // 上身暗红
      accent: '#c89635',    // 黄铜窗边
      roof: '#f5eee3',
      window: '#0f172a',
      frame: '#3d2817'
    },
    stripes: {
      style: 'single',
      width: 12
    },
    badgeText: 'HK TRAMWAYS'
  },
  {
    id: 'hk-tram-blue-ad',
    name: "维港蓝",
    nameEn: "Harbour blue",
    category: 'railway',
    liveryStyle: 'hk-tram-blue-ad',
    compatibleCategories: ['commuter', 'vehicle', 'bus'],
    targetConsistIds: ['hk-tram-consist'],
    description: "蓝色车身与浅蓝细线。",
    descriptionEn: "Blue body with pale blue pinstripes.",
    colors: {
      primary: '#294867',   // 维港深海蓝
      secondary: '#4f7899', // 天青拉花
      accent: '#ffffff',    // 亮白
      roof: '#1a2b3c',      // 沉稳黑蓝顶
      window: '#020617',
      frame: '#1e293b'
    },
    stripes: {
      style: 'gradient',
      width: 18
    },
    badgeText: 'HONG KONG TRAM'
  },
  // ================= 0.7 铁路重载干线货运火车涂装 (Heavy Freight Series) =================
  {
    id: 'df4b-watermelon',
    name: "西瓜皮 · 绿黄",
    nameEn: "Watermelon · Green/cream",
    category: 'railway',
    liveryStyle: 'df4b-watermelon',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['df4b-freight-consist'],
    description: "深绿机车、浅色腰线与深灰底盘。",
    descriptionEn: "Green locomotive with a pale stripe and dark chassis.",
    colors: {
      primary: '#325e42',   // 柔和清雅森绿
      secondary: '#fbf5e6', // 纯净温润奶白双腰线
      accent: '#dc2626',    // 车头红星
      roof: '#2d3744',      // 柔和工业钢灰车顶
      window: '#0a0f1d',
      frame: '#1e293b'
    },
    stripes: {
      style: 'double',
      width: 14
    },
    badgeText: 'DF4B-2121'
  },
  {
    id: 'df4b-orange',
    name: "金温橙",
    nameEn: "Jinwen orange",
    category: 'railway',
    liveryStyle: 'df4b-orange',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['df4b-freight-consist'],
    description: "橙色机车与浅色腰线，前脸采用V形色带。",
    descriptionEn: "Orange locomotive with pale stripes and a V-shaped front band.",
    colors: {
      primary: '#c4693b',   // 温暖赭橙
      secondary: '#f8f6f0', // 纯白破风 V 带
      accent: '#ea580c',    // 暖橙警示带
      roof: '#333d49',      // 柔和钢灰顶
      window: '#0a0f1d',
      frame: '#334155'
    },
    stripes: {
      style: 'single',
      width: 16
    },
    badgeText: 'DF4B-6001'
  },
  {
    id: 'df4b-blue',
    name: "蓝太湖",
    nameEn: "Taihu blue",
    category: 'railway',
    liveryStyle: 'df4b-blue',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['df4b-freight-consist'],
    description: "深蓝车身配浅蓝腰线。",
    descriptionEn: "Navy body with a pale blue stripe.",
    colors: {
      primary: '#2b5482',   // 典雅海蓝
      secondary: '#f1f5f9', // 银白腰线
      accent: '#38bdf8',    // 天蓝拉花
      roof: '#2d3744',      // 钢灰车顶
      window: '#0a0f1d',
      frame: '#1e293b'
    },
    stripes: {
      style: 'double',
      width: 14
    },
    badgeText: 'DF4D-0188'
  },
  {
    id: 'df4b-jrf-red-thunder',
    name: "红雷风格 · 红银",
    nameEn: "Red Thunder style",
    category: 'railway',
    liveryStyle: 'df4b-jrf-red-thunder',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['df4b-freight-consist'],
    description: "红色车身配银色腰线与深色散热格栅。",
    descriptionEn: "Red body with silver stripes and dark cooling grilles.",
    colors: {
      primary: '#9a373f',   // 典雅暖砖红
      secondary: '#e2e8f0', // 银灰闪电拉花
      accent: '#facc15',    // 金黄车号
      roof: '#2d3744',      // 工业钢灰顶
      window: '#0a0f1d',
      frame: '#1e293b'
    },
    stripes: {
      style: 'single',
      width: 14
    },
    badgeText: 'JRF EF510'
  },
  {
    id: 'df4b-jrf-blue-momotaro',
    name: "桃太郎风格 · 蓝白",
    nameEn: "Momotaro style",
    category: 'railway',
    liveryStyle: 'df4b-jrf-blue-momotaro',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['df4b-freight-consist'],
    description: "浅灰上身与深蓝下身，保留货运机车格栅。",
    descriptionEn: "Light gray upper body and navy lower body with freight grilles.",
    colors: {
      primary: '#244872',   // JRF 蔚蓝武士
      secondary: '#cbd5e1', // 浅灰云母
      accent: '#38bdf8',    // 天蓝流线
      roof: '#28323e',      // 炭灰顶
      window: '#0a0f1d',
      frame: '#1e293b'
    },
    stripes: {
      style: 'double',
      width: 14
    },
    badgeText: 'JRF EF210'
  },
  {
    id: 'df4b-bnsf-orange',
    name: "BNSF风格 · 橙黑",
    nameEn: "BNSF style · Orange/black",
    category: 'railway',
    liveryStyle: 'df4b-bnsf-orange',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['df4b-freight-consist'],
    description: "橙色车身、黑色顶部与黄色细线。",
    descriptionEn: "Orange body, black roof band and yellow pinstripes.",
    colors: {
      primary: '#d66824',   // BNSF 夕阳暖橙
      secondary: '#27272a', // 暖炭灰拉花与车顶
      accent: '#f59e0b',    // 警示明黄
      roof: '#27272a',      // 暖炭灰车顶
      window: '#0a0f1d',
      frame: '#27272a'
    },
    stripes: {
      style: 'single',
      width: 16
    },
    badgeText: 'BNSF 7210'
  },
  {
    id: 'df4b-sbb-cargo',
    name: "SBB Cargo风格 · 蓝白",
    nameEn: "SBB Cargo style",
    category: 'railway',
    liveryStyle: 'df4b-sbb-cargo',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['df4b-freight-consist'],
    description: "深蓝车身与浅色细腰线。",
    descriptionEn: "Navy body with a pale waist stripe.",
    colors: {
      primary: '#244d7d',   // 瑞士深海湛蓝
      secondary: '#f8fafc', // 冰川纯白
      accent: '#dc2626',    // 瑞士红十字
      roof: '#2d3744',      // 钢灰车顶
      window: '#0a0f1d',
      frame: '#1e293b'
    },
    stripes: {
      style: 'double',
      width: 14
    },
    badgeText: 'SBB 482'
  },
  // ================= 1. 都市通勤电车专属涂装 (Commuter) =================
  {
    id: 'yamanote-green',
    name: "山手线 · 绿门",
    nameEn: "Yamanote · Green doors",
    category: 'railway',
    liveryStyle: 'commuter-yamanote',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: "银灰车身与全高绿色客门，门板带点状纹理。",
    descriptionEn: "Silver body and full-height green doors with dotted panels.",
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
    name: "大阪环状线风格 · 橙黑",
    nameEn: "Osaka Loop style",
    category: 'railway',
    liveryStyle: 'commuter-osaka-loop',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: "银灰车身搭配橙色窗边和深色腰线。",
    descriptionEn: "Silver body with orange window trim and dark stripes.",
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
    name: "中央线风格 · 橙色",
    nameEn: "Chuo style · Orange",
    category: 'railway',
    liveryStyle: 'commuter-chuo',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: "银灰车身，窗上窗下使用橙色横带。",
    descriptionEn: "Silver body with orange bands above and below the windows.",
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
    name: "京滨东北线风格 · 天蓝",
    nameEn: "Keihin-Tohoku style",
    category: 'railway',
    liveryStyle: 'commuter-keihin',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: "银灰车身配天蓝色窗下带。",
    descriptionEn: "Silver body with a sky-blue band below the windows.",
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
    name: "总武线风格 · 黄色",
    nameEn: "Sobu style · Yellow",
    category: 'railway',
    liveryStyle: 'commuter-sobu',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: "银灰车身配黄色腰带。",
    descriptionEn: "Silver body with a yellow waist stripe.",
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
    name: "阪急风格 · 栗红",
    nameEn: "Hankyu style · Maroon",
    category: 'railway',
    liveryStyle: 'commuter-hankyu',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: "通体栗红，客窗与门框带浅色细边。",
    descriptionEn: "Maroon body with fine pale window and door frames.",
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
    name: "丸之内线风格 · 红色",
    nameEn: "Marunouchi style",
    category: 'railway',
    liveryStyle: 'commuter-marunouchi',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: "红色车身配窗下白色波浪线。",
    descriptionEn: "Red body with a white wave below the windows.",
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
    name: "E5 隼号 · 绿色",
    nameEn: "E5 Hayabusa · Green",
    category: 'bullet',
    liveryStyle: 'shinkansen-e5',
    compatibleCategories: ['shinkansen'],
    targetConsistIds: ['e5-consist'],
    description: "绿色上身、白色下身与粉色细分界线。",
    descriptionEn: "Green upper body, white lower body and a thin pink divider.",
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
    name: "黄医生风格 · 黄蓝",
    nameEn: "Doctor Yellow style",
    category: 'bullet',
    liveryStyle: 'shinkansen-doctor-yellow',
    compatibleCategories: ['shinkansen'],
    targetConsistIds: ['e5-consist'],
    description: "黄色车身配蓝色腰线。",
    descriptionEn: "Yellow body with a blue waist stripe.",
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
    name: "N700S风格 · 白蓝",
    nameEn: "N700S style · White/blue",
    category: 'bullet',
    liveryStyle: 'shinkansen-n700',
    compatibleCategories: ['shinkansen'],
    targetConsistIds: ['e5-consist'],
    description: "白色车身与两道蓝色窗下线。",
    descriptionEn: "White body with two blue stripes below the windows.",
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
    name: "Hello Kitty 樱花",
    nameEn: "Hello Kitty Sakura",
    category: 'bullet',
    liveryStyle: 'shinkansen-haruka-kitty',
    compatibleCategories: [],
    targetConsistIds: ['haruka-kitty-consist', 'haruka-281-pro-consist'],
    description: "白色车身、细蓝边与樱花图案，驾驶室附近绘有Hello Kitty。",
    descriptionEn: "White body, blue trim and blossoms, with Hello Kitty near the cab.",
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
    name: "经典白蓝",
    nameEn: "Classic white/blue",
    category: 'bullet',
    liveryStyle: 'shinkansen-haruka-classic',
    compatibleCategories: [],
    targetConsistIds: ['haruka-kitty-consist', 'haruka-281-pro-consist'],
    description: "白色车身、蓝色下缘与灰色车顶。",
    descriptionEn: "White body, blue lower trim and a gray roof.",
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
    name: "Hello Kitty 樱花 · 金边",
    nameEn: "Hello Kitty Sakura · Gold trim",
    category: 'bullet',
    liveryStyle: 'shinkansen-haruka-orizuru',
    compatibleCategories: [],
    targetConsistIds: ['haruka-kitty-consist'],
    description: "樱花与Hello Kitty图案，底部使用金色细边。",
    descriptionEn: "Blossoms and Hello Kitty artwork with fine gold lower trim.",
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
    name: "午夜深蓝",
    nameEn: "Midnight navy",
    category: 'bullet',
    liveryStyle: 'shinkansen-nankai-rapit',
    compatibleCategories: [],
    targetConsistIds: ['nankai-rapit-consist', 'rapit-50000-pro-consist'],
    description: "深蓝车身、深色舷窗与银灰窗框。",
    descriptionEn: "Navy body, dark portholes and silver-gray frames.",
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
    name: "赤色彗星 · 红金",
    nameEn: "Red Comet · Red/gold",
    category: 'bullet',
    liveryStyle: 'shinkansen-nankai-rapit-red',
    compatibleCategories: [],
    targetConsistIds: ['nankai-rapit-consist'],
    description: "红色车身与金色饰线，保留舷窗和圆拱前窗。",
    descriptionEn: "Red body and gold trim, retaining portholes and the arched windshield.",
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
    name: "Peach · 粉白",
    nameEn: "Peach · Pink/white",
    category: 'bullet',
    liveryStyle: 'shinkansen-nankai-rapit-peach',
    compatibleCategories: [],
    targetConsistIds: ['nankai-rapit-consist'],
    description: "白色车身、粉色腰线与粉色下裙。",
    descriptionEn: "White body with pink stripes and a pink lower skirt.",
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
    name: "EVA风格 · 紫绿",
    nameEn: "EVA style · Purple/green",
    category: 'bullet',
    liveryStyle: 'shinkansen-500-eva',
    compatibleCategories: ['shinkansen'],
    targetConsistIds: ['e5-consist'],
    description: "紫色车身配绿色细线和前脸色块。",
    descriptionEn: "Purple body with green stripes and front panels.",
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
    name: "E6小町风格 · 红银",
    nameEn: "E6 Komachi style",
    category: 'bullet',
    liveryStyle: 'shinkansen-e6',
    compatibleCategories: ['shinkansen'],
    targetConsistIds: ['e5-consist'],
    description: "红色上身、银白下身与细金色分界线。",
    descriptionEn: "Red upper body, silver-white lower body and a fine gold divider.",
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
    name: "E7辉号风格 · 青金",
    nameEn: "E7 Kagayaki style",
    category: 'bullet',
    liveryStyle: 'shinkansen-e7',
    compatibleCategories: ['shinkansen'],
    targetConsistIds: ['e5-consist'],
    description: "蓝色上身、白色下身与金色腰线。",
    descriptionEn: "Blue upper body, white lower body and a gold waist stripe.",
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
    name: "CR400AF · 红色",
    nameEn: "CR400AF · Red",
    category: 'bullet',
    liveryStyle: 'cr400-fuxing-red',
    compatibleCategories: [],
    targetConsistIds: ['cr400-fuxing-consist', 'cr400-master-consist'],
    description: "银灰车身，红色侧带在车头处抬起。",
    descriptionEn: "Silver-gray body with a red stripe rising toward the nose.",
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
    name: "CR400BF · 金色",
    nameEn: "CR400BF · Gold",
    category: 'bullet',
    liveryStyle: 'cr400-fuxing-gold',
    compatibleCategories: [],
    targetConsistIds: ['cr400-fuxing-consist', 'cr400-master-consist'],
    description: "象牙白车身搭配金色侧带。",
    descriptionEn: "Ivory body with gold side stripes.",
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
    name: "CRH380A风格 · 蓝白",
    nameEn: "CRH380A style",
    category: 'bullet',
    liveryStyle: 'crh380a-hexie',
    compatibleCategories: [],
    targetConsistIds: ['cr400-fuxing-consist', 'cr400-master-consist'],
    description: "白色车身与两道浅蓝色腰线。",
    descriptionEn: "White body with two pale blue waist stripes.",
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
    name: "CRH2风格 · 白蓝",
    nameEn: "CRH2 style",
    category: 'bullet',
    liveryStyle: 'crh2-hexie-classic',
    compatibleCategories: [],
    targetConsistIds: ['cr400-fuxing-consist', 'cr400-master-consist'],
    description: "白色车身与深蓝色窗下带。",
    descriptionEn: "White body with a navy band below the windows.",
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
    name: "300系 · 白蓝",
    nameEn: "Series 300 · White/blue",
    category: 'bullet',
    liveryStyle: 'shinkansen-300-nozomi',
    compatibleCategories: [],
    targetConsistIds: ['shinkansen300-hikarian-consist'],
    description: "白色车身配深浅两道蓝色细线。",
    descriptionEn: "White body with two fine blue stripes.",
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
    name: "0系风格 · 蓝白",
    nameEn: "Series 0 style",
    category: 'bullet',
    liveryStyle: 'shinkansen-0-classic',
    compatibleCategories: [],
    targetConsistIds: ['shinkansen300-hikarian-consist'],
    description: "白色车身、宽蓝色下缘与前鼻灯标记。",
    descriptionEn: "White body, broad blue lower band and a nose-light marking.",
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
    name: "E3小町风格 · 银粉",
    nameEn: "E3 Komachi style",
    category: 'bullet',
    liveryStyle: 'shinkansen-e3-komachi',
    compatibleCategories: [],
    targetConsistIds: ['shinkansen300-hikarian-consist'],
    description: "银白车身、深灰车顶边缘与粉色细腰线。",
    descriptionEn: "Silver-white body, dark roof edge and a thin pink stripe.",
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
    name: "雷鸟号风格 · 白蓝",
    nameEn: "Thunderbird style",
    category: 'bullet',
    liveryStyle: 'shinkansen-683-thunderbird',
    compatibleCategories: [],
    targetConsistIds: ['shinkansen300-hikarian-consist'],
    description: "白色车身、浅蓝窗下线与深灰底边。",
    descriptionEn: "White body with a pale blue stripe and dark lower trim.",
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
    name: "GSE · 朱红",
    nameEn: "GSE · Vermillion",
    category: 'bullet',
    liveryStyle: 'romancecar-gse-red',
    compatibleCategories: [],
    targetConsistIds: ['odakyu-romancecar-gse-consist', 'romancecar-gse-master-consist'],
    description: "朱红车身、深色车顶边缘与金色细线。",
    descriptionEn: "Vermillion body, dark roof edge and a fine gold stripe.",
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
    name: "VSE风格 · 珍珠白",
    nameEn: "VSE style · Pearl white",
    category: 'bullet',
    liveryStyle: 'romancecar-vse-white',
    compatibleCategories: [],
    targetConsistIds: ['odakyu-romancecar-gse-consist', 'romancecar-gse-master-consist'],
    description: "白色车身与橙金双细线，客门保持白色。",
    descriptionEn: "White body and doors with fine orange and gold stripes.",
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
    name: "经典黑金",
    nameEn: "Classic black/gold",
    category: 'retro',
    liveryStyle: 'steam-d51-classic',
    compatibleCategories: ['steam'],
    targetConsistIds: ['d51-consist'],
    description: "黑色锅炉配金色箍环与棕色驾驶室窗框。",
    descriptionEn: "Black boiler with gold bands and brown cab window frames.",
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
    name: "SL人吉风格 · 黑色",
    nameEn: "SL Hitoyoshi style",
    category: 'retro',
    liveryStyle: 'steam-hitoyoshi',
    compatibleCategories: ['steam'],
    targetConsistIds: ['d51-consist'],
    description: "黑色锅炉配细金色装饰，保留蒸汽机车轮系图案。",
    descriptionEn: "Black boiler with fine gold trim and printed steam running gear.",
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
