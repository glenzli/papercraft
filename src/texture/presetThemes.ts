// 官方预设涂装主题库 (声明车型适配兼容性 compatibleCategories、targetConsistIds 与专属 liveryStyle)
import { TextureTheme } from './types'

export const PRESET_THEMES: TextureTheme[] = [
  // ================= 0. 城市公交与客车专属涂装 (Buses & Coaches) =================
  {
    id: 'bus-71-blue',
    name: '上海公交 71 路 (水墨蓝白)',
    nameEn: 'Shanghai Route 71 Transit (Ink Blue & Pearl White)',
    category: 'bus',
    liveryStyle: 'bus-shanghai-71',
    compatibleCategories: ['bus'],
    targetConsistIds: ['city-bus-consist'],
    description: '中国上海中运量 71 路经典水墨蓝底色与流线型珍珠白车身，配温暖金色动感腰线与车头线路牌。',
    descriptionEn: "Classic Shanghai Yan'an BRT Route 71 livery with ink blue and pearl white body, accented with dynamic gold belt line.",
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
    name: '伦敦经典红巴士 (Heritage Red)',
    nameEn: 'London Heritage Red Bus',
    category: 'bus',
    liveryStyle: 'bus-london-red',
    compatibleCategories: ['bus'],
    targetConsistIds: ['city-bus-consist'],
    description: '享誉全球的英伦标志性深红车身，配经典黑化全景车窗、车顶白檐与正面黄色线路牌。',
    descriptionEn: 'World-famous British Royal Red transit livery with black panoramic windows and classic route signage.',
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
    name: '复古双拼绿电车 (Classic Retro Green)',
    nameEn: 'Classic Retro Green Transit',
    category: 'bus',
    liveryStyle: 'bus-retro-green',
    compatibleCategories: ['bus'],
    targetConsistIds: ['city-bus-consist'],
    description: '复古昭和与怀旧风情：下半部沉稳墨绿配上半部奶油象牙白，加金色黄铜腰线。',
    descriptionEn: 'Nostalgic retro double-tone bus with deep olive green lower body, cream white upper, and brass gold beltline.',
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
    name: '新能源清风绿 (Eco Clean Green)',
    nameEn: 'Eco Clean Green Electric Bus',
    category: 'bus',
    liveryStyle: 'bus-eco-cyan',
    compatibleCategories: ['bus'],
    targetConsistIds: ['city-bus-consist'],
    description: '纯电动现代环保客车：极简珍珠浅灰车身配清风青绿叶脉流线与环保纯电标志。',
    descriptionEn: 'Modern zero-emission electric bus with pearl grey base and aerodynamic clean green accents.',
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
    name: '上海 71 路 18米巨龙 (水墨蓝白)',
    nameEn: 'Shanghai Route 71 18m Articulated BRT',
    category: 'bus',
    liveryStyle: 'bus-articulated-71',
    compatibleCategories: ['bus'],
    targetConsistIds: ['articulated-bus-consist'],
    description: '上海延安路中运量 18 米双节大容量铰接巨龙客车，带黑色手风琴风挡与水墨蓝白流线。',
    descriptionEn: 'Shanghai BRT Route 71 18-meter articulated high-capacity transit bus with folding bellows.',
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
    name: '北京大通道巨龙 (经典红白)',
    nameEn: 'Beijing Classic Red & White Articulated Bus',
    category: 'bus',
    liveryStyle: 'bus-articulated-beijing',
    compatibleCategories: ['bus'],
    targetConsistIds: ['articulated-bus-consist'],
    description: '承载几代人记忆的首都经典大通道巨龙公交：怀旧红白双拼车身配深灰铰接折棚。',
    descriptionEn: 'Iconic Beijing vintage red and white articulated transit bus with classic styling.',
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
    name: '欧洲都市铰接快线 (Metro Express)',
    nameEn: 'Euro Metro Express Articulated Bus',
    category: 'bus',
    liveryStyle: 'bus-articulated-metro',
    compatibleCategories: ['bus'],
    targetConsistIds: ['articulated-bus-consist'],
    description: '现代低地板大容量铰接快线：石墨黑钛车身配暖赭动感饰条。',
    descriptionEn: 'Modern European metropolitan articulated rapid bus in sleek graphite grey with warm ochre swoosh.',
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
    name: '伦敦 Routemaster 经典双层红巴',
    nameEn: 'London Routemaster Double-Decker Red',
    category: 'bus',
    liveryStyle: 'bus-double-london-red',
    compatibleCategories: ['bus'],
    targetConsistIds: ['double-decker-bus-consist'],
    description: '英伦百年标志性双层红巴：伦敦经典深红底色配伦敦交通局 Roundel 圆形徽标与二楼全景视窗。',
    descriptionEn: 'The world-famous London double-decker bus in Classic Carmine Red with London Transport Roundel badge.',
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
    name: '香港九巴经典「金巴」',
    nameEn: 'Hong Kong KMB Classic "Champagne Gold"',
    category: 'bus',
    liveryStyle: 'bus-double-kmb-gold',
    compatibleCategories: ['bus'],
    targetConsistIds: ['double-decker-bus-consist'],
    description: '香港九龙巴士超经典香槟金涂装：奢华香槟金底色配典雅暗红腰带，双层宽广视野。',
    descriptionEn: 'Hong Kong Kowloon Motor Bus iconic Champagne Gold livery with elegant deep maroon accent band.',
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
    name: '都市全景双层观光巴士',
    nameEn: 'City Sightseeing Double-Decker',
    category: 'bus',
    liveryStyle: 'bus-double-sightseeing',
    compatibleCategories: ['bus'],
    targetConsistIds: ['double-decker-bus-consist'],
    description: '风靡全球的旅游城市观光双层巴士：典雅酒红车身配温暖金黄波浪拉花。',
    descriptionEn: 'Global city sightseeing double-decker in elegant burgundy and warm gold wave stripes.',
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
    name: '镰仓江之电 300形 (经典墨绿黄)',
    nameEn: 'Enoden 300 Series (Heritage Green & Cream)',
    category: 'railway',
    liveryStyle: 'tram-enoden-green',
    compatibleCategories: ['vehicle', 'commuter', 'bus'],
    targetConsistIds: ['tram-consist'],
    description: '日本湘南海岸与镰仓高校前经典江之电：古松绿下车身配温暖象牙奶油黄与金属受电弓。',
    descriptionEn: 'Legendary Enoshima Electric Railway coastal tram with vintage pine green and warm cream livery.',
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
    name: '现代低地板轻轨 (科技薄荷青)',
    nameEn: 'Modern Low-Floor Tram (Tech Mint Cyan)',
    category: 'railway',
    liveryStyle: 'tram-modern-cyan',
    compatibleCategories: ['vehicle', 'commuter', 'bus'],
    targetConsistIds: ['tram-consist'],
    description: '现代欧洲低地板流线型有轨电车：极简纯白底色配科技水色青一体式全景大玻璃。',
    descriptionEn: 'Ultra-modern low-floor aerodynamic streetcar in pristine white and soft cyan accents.',
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
    name: '墨尔本 W-Class 电车 (经典绿金)',
    nameEn: 'Melbourne W-Class Tram (Heritage Green & Gold)',
    category: 'railway',
    liveryStyle: 'tram-melbourne-green',
    compatibleCategories: ['vehicle', 'commuter', 'bus'],
    targetConsistIds: ['tram-consist'],
    description: '享誉全球的墨尔本街头百年名片：深绿车体配金黄窗檐与古典黄铜大灯。',
    descriptionEn: 'World-famous Melbourne historic W-Class tram in traditional deep green with gold window trims.',
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
    name: '香港叮叮车 120号 (经典墨绿)',
    nameEn: 'Hong Kong Tram #120 (Heritage Green)',
    category: 'railway',
    liveryStyle: 'hk-tram-green',
    compatibleCategories: ['commuter', 'vehicle', 'bus'],
    targetConsistIds: ['hk-tram-consist'],
    description: '传承战后经典的 120 号老电车：纯正深绿木质质感车身配香槟金车号与双层推拉窗。',
    descriptionEn: 'Legendary HK Tram #120 preserving 1950s heritage deep green livery and handcrafted teak interiors.',
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
    name: '香港叮叮车 (怀旧红绿双拼)',
    nameEn: 'Hong Kong Tram (Heritage Red & Green)',
    category: 'railway',
    liveryStyle: 'hk-tram-retro-red',
    compatibleCategories: ['commuter', 'vehicle', 'bus'],
    targetConsistIds: ['hk-tram-consist'],
    description: '香港早期经典双层电车分色：下半身复古深绿，上半身典雅暗红与黄铜窗框。',
    descriptionEn: 'Vintage HK tram livery featuring heritage red upper story and classic dark green lower deck.',
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
    name: '香港叮叮车 (维港蓝城市广告)',
    nameEn: 'Hong Kong Tram (Victoria Harbour Blue)',
    category: 'railway',
    liveryStyle: 'hk-tram-blue-ad',
    compatibleCategories: ['commuter', 'vehicle', 'bus'],
    targetConsistIds: ['hk-tram-consist'],
    description: '港岛街头最具代表性的全车包身广告涂装：维港沉稳深海蓝配天青拉花。',
    descriptionEn: 'Full-wrap modern advertising livery in elegant Victoria Harbour blue with skyline graphics.',
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
    name: '东风 4B「经典西瓜皮」',
    nameEn: 'DF4B "Watermelon" Classic Green',
    category: 'railway',
    liveryStyle: 'df4b-watermelon',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['df4b-freight-consist'],
    description: '几代国人的铁路工业记忆：柔和清雅森绿车身配奶白双腰线与红星徽标，牵引普鲁士蓝与常青绿集装箱。',
    descriptionEn: 'Legendary China Railway DF4B heavy freight locomotive in signature subdued forest green with classic container livery.',
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
    name: '东风 4B「金温橘子皮」',
    nameEn: 'DF4B "Orange" Ochre Freight',
    category: 'railway',
    liveryStyle: 'df4b-orange',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['df4b-freight-consist'],
    description: '金温铁路与工矿经典温暖赭橙涂装，配前脸纯白破风 V 字拉花与暖姜黄集装箱。',
    descriptionEn: 'High-visibility weathered ochre orange DF4B locomotive with muted cream chevron striping.',
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
    name: '东风 4D/4B「蓝太湖」',
    nameEn: 'DF4D/4B "Taihu Blue" Freight',
    category: 'railway',
    liveryStyle: 'df4b-blue',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['df4b-freight-consist'],
    description: '江南干线经典蓝太湖涂装：典雅晴空海蓝配银白动感腰带与冰蓝集装箱。',
    descriptionEn: 'Subdued deep ocean blue "Taihu Blue" livery with silver waistband and metallic badges.',
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
    name: 'JR 货物 EF510「红雷 Red Thunder」',
    nameEn: 'JR Freight EF510 "Red Thunder"',
    category: 'railway',
    liveryStyle: 'df4b-jrf-red-thunder',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['df4b-freight-consist'],
    description: '日本 JR 货物经典重载机车：典雅暖砖红车身配银灰闪电带与 19D 珊瑚红集装箱。',
    descriptionEn: 'Iconic JR Freight Red Thunder locomotive in signature deep crimson red with authentic 19D container cars.',
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
    name: 'JR 货物 EF210「桃太郎 ECO-POWER」',
    nameEn: 'JR Freight EF210 "ECO-POWER Momotaro"',
    category: 'railway',
    liveryStyle: 'df4b-jrf-blue-momotaro',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['df4b-freight-consist'],
    description: '日本干线主力电力货运机车：沉稳深蓝底色配浅灰两分色与日通两色集装箱。',
    descriptionEn: 'Famous JR Freight Momotaro ECO-POWER livery in navy blue with slate grey upper band.',
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
    name: '北美重载传奇 BNSF「经典橙黑」',
    nameEn: 'North America BNSF "Heritage Orange & Black"',
    category: 'railway',
    liveryStyle: 'df4b-bnsf-orange',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['df4b-freight-consist'],
    description: '北美跨大陆重载干线传奇：明媚夕阳暖橙配暖炭灰车顶与斜纹斑马前脸，牵引双色重载集装箱。',
    descriptionEn: 'Iconic North American BNSF Heritage livery in deep sunset orange and jet black with high-cube container cars.',
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
    name: '瑞士联邦铁路 SBB Cargo「深蓝冰白」',
    nameEn: 'Swiss SBB Cargo "Deep Blue & Glacier White"',
    category: 'railway',
    liveryStyle: 'df4b-sbb-cargo',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['df4b-freight-consist'],
    description: '阿尔卑斯欧系现代货运美学：极简深海湛蓝配冰川纯白与瑞士十字标，牵引高精度欧系多式联运集装箱。',
    descriptionEn: 'Sophisticated Swiss SBB Cargo modern livery in deep ocean navy and glacier white with cross-modal freight.',
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
    name: '山手线 (青绿全高门)',
    nameEn: 'Yamanote Line (Lime Green Doors)',
    category: 'railway',
    liveryStyle: 'commuter-yamanote',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: '经典的日本都市银灰车身配标志性青绿色全高车门与点阵方块，极具现代感与辨识度。',
    descriptionEn: 'Classic Tokyo commuter train with signature lime green full-height doors and dot-matrix squares on stainless body.',
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
    nameEn: 'Osaka Loop Line (Orange & Black)',
    category: 'railway',
    liveryStyle: 'commuter-osaka-loop',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: '西日本关西标志性涂装：车窗上方亮橙粗横条、车窗下方橙黑双色带，车门配橙色警示边框与底部运动斜切几何，正面带环状线标志。',
    descriptionEn: 'Iconic JR West livery with orange window headers, dual orange-black stripes, door accents and sport cutouts.',
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
    nameEn: 'Chuo Line Rapid (Orange No. 1)',
    category: 'railway',
    liveryStyle: 'commuter-chuo',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: '横贯东京东西大动脉的经典涂装：不锈钢原色车身，车窗上方与下方贯穿朱色1号（亮橙）双横色彩带。',
    descriptionEn: 'Classic Tokyo east-west trunk line livery with vibrant orange double stripes on stainless body.',
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
    nameEn: 'Keihin-Tohoku Line (Sky Blue)',
    category: 'railway',
    liveryStyle: 'commuter-keihin',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: '穿梭于东京与横滨之间的明亮天蓝色涂装，窗上细带与窗下粗带贯穿全车，清爽靓丽。',
    descriptionEn: 'Refreshing sky blue commuter train running between Tokyo and Yokohama with clean dual stripes.',
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
    nameEn: 'Sobu Line Local (Canary Yellow)',
    category: 'railway',
    liveryStyle: 'commuter-sobu',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: '穿梭于千叶与三鹰之间的黄色5号明亮金丝雀黄涂装，横贯东京东西。',
    descriptionEn: 'Vibrant canary yellow striped commuter train running across Tokyo east-west corridor.',
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
    nameEn: 'Hankyu Railway (Classic Maroon)',
    category: 'railway',
    liveryStyle: 'commuter-hankyu',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: '关西私铁顶级典雅名车：通体高光钢琴烤漆栗红色（Hankyu Maroon），搭配象牙白车顶与金色铝合金门把装饰。',
    descriptionEn: 'Ultra-elegant Kansai private railway with high-gloss maroon piano finish, ivory roof, and gold handles.',
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
    nameEn: 'Marunouchi Line (Series 2000 Wave)',
    category: 'railway',
    liveryStyle: 'commuter-marunouchi',
    compatibleCategories: ['commuter'],
    targetConsistIds: ['e235-consist'],
    description: '东京地下铁丸之内线 2000 系：热情纯正红色车身，搭配标志性的白色正弦波浪纹与黑色流线车头面罩。',
    descriptionEn: 'Tokyo Metro red subway with signature white sine wave pattern and black cockpit visor.',
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
    nameEn: 'E5 Hayabusa (Tokiwa Green)',
    category: 'bullet',
    liveryStyle: 'shinkansen-e5',
    compatibleCategories: ['shinkansen'],
    targetConsistIds: ['e5-consist'],
    description: 'JR东日本东北新干线旗舰涂装：上半身常盘绿、下半身飞羽白，中间贯穿标志性的飞燕粉红（疾风粉）腰线。',
    descriptionEn: 'JR East flagship Tohoku bullet train in Tokiwa green, flying feather white and pink stripe.',
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
    nameEn: 'Class 923 Doctor Yellow',
    category: 'bullet',
    liveryStyle: 'shinkansen-doctor-yellow',
    compatibleCategories: ['shinkansen'],
    targetConsistIds: ['e5-consist'],
    description: '新干线轨道电气综合检查神车：通体鲜亮高能柠檬黄底色，贯穿东海道经典的深海蓝腰线。',
    descriptionEn: 'High-speed track and overhead wire inspection train in vibrant lemon yellow and deep blue stripe.',
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
    nameEn: 'N700S Supreme (Pearl White & Blue)',
    category: 'bullet',
    liveryStyle: 'shinkansen-n700',
    compatibleCategories: ['shinkansen'],
    targetConsistIds: ['e5-consist'],
    description: '东海道·山阳新干线的主力象征：纯净高雅的珍珠白车身，窗下配东海道经典的双蓝条纹与 Supreme 金色徽标。',
    descriptionEn: 'Tokaido/Sanyo Shinkansen flagship EMU in pearl white, signature blue double stripes and gold emblem.',
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
    nameEn: 'Hello Kitty Sakura Express',
    category: 'bullet',
    liveryStyle: 'shinkansen-haruka-kitty',
    compatibleCategories: [],
    targetConsistIds: ['haruka-kitty-consist'],
    description: '穿梭于关西空港与京都之间的超人气专列：纯白底漆搭配穿和服的 Hello Kitty 经典肖像、青花瓷深蓝底带与散落飘飞的自然粉樱。',
    descriptionEn: 'Kansai Airport express with kimono Hello Kitty art, deep navy base and floating cherry blossoms.',
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
    nameEn: 'JR Original Classic (White & Blue)',
    category: 'bullet',
    liveryStyle: 'shinkansen-haruka-classic',
    compatibleCategories: [],
    targetConsistIds: ['haruka-kitty-consist'],
    description: '1994年开通以来的正统原厂涂装：高雅纯白车身，车窗下方贯穿极细 JR 西日本海洋蓝腰线与深灰车顶，纯粹典雅。',
    descriptionEn: 'Original 1994 Haruka factory livery in pure white, marine blue stripe and dark gray roof.',
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
    nameEn: 'Hello Kitty Origami Crane Limited',
    category: 'bullet',
    liveryStyle: 'shinkansen-haruka-orizuru',
    compatibleCategories: [],
    targetConsistIds: ['haruka-kitty-consist'],
    description: '象征和平与祝福的和风限定专列：纯白车身点缀金色日式千纸鹤、祥云与金樱花。',
    descriptionEn: 'Japanese auspicious edition with gold origami cranes, clouds, and golden sakura blossoms.',
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
    nameEn: 'Midnight Navy Blue',
    category: 'bullet',
    liveryStyle: 'shinkansen-nankai-rapit',
    compatibleCategories: [],
    targetConsistIds: ['nankai-rapit-consist'],
    description: '极具未来科幻感的关西特急：深邃纯正金属午夜深蓝车体，搭配飞机舱正圆形大舷窗与复古未来主义机甲面罩。',
    descriptionEn: 'Retro-futuristic Kansai airport express in metallic midnight blue with round airplane windows.',
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
    nameEn: 'Gundam UC Red Comet Edition',
    category: 'bullet',
    liveryStyle: 'shinkansen-nankai-rapit-red',
    compatibleCategories: [],
    targetConsistIds: ['nankai-rapit-consist'],
    description: '2014年机动战士高达 UC 联动传奇专列：新吉翁全·伏朗托专属「赤色彗星」亮金属猩红车身，配纯金饰线与吉翁军徽。',
    descriptionEn: '2014 Gundam UC special collaboration: Neo Zeon Full Frontal crimson red with gold accents.',
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
    nameEn: 'Peach Aviation Collaboration',
    category: 'bullet',
    liveryStyle: 'shinkansen-nankai-rapit-peach',
    compatibleCategories: [],
    targetConsistIds: ['nankai-rapit-consist'],
    description: '2014年南海电铁与 Peach 乐桃航空联动专列：充满青春活力的蜜桃粉（Peach Pink）与纯白流线车体，搭配紫红线条。',
    descriptionEn: 'Youthful peach pink and white fuselage livery in collaboration with Peach Aviation.',
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
    nameEn: '500 Series Evangelion Unit-01',
    category: 'bullet',
    liveryStyle: 'shinkansen-500-eva',
    compatibleCategories: ['shinkansen'],
    targetConsistIds: ['e5-consist'],
    description: '新世纪福音战士 20 周年限定神车：新干线 500 系完美融合 EVA-01 初号机标志性紫、荧光绿、警示橙与机甲线条。',
    descriptionEn: 'Evangelion 20th anniversary Shinkansen 500 in Unit-01 purple, neon green, and mecha markings.',
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
    nameEn: 'E6 Komachi (Ruby Red)',
    category: 'bullet',
    liveryStyle: 'shinkansen-e6',
    compatibleCategories: ['shinkansen'],
    targetConsistIds: ['e5-consist'],
    description: '热情奔放的茜红流线车顶配银灰车身与金黄细腰线，极具视觉张力。',
    descriptionEn: 'Akita Shinkansen with ruby red roof, silver white body, and golden pinstripe.',
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
    nameEn: 'E7 Kagayaki (Sky Blue & Gold)',
    category: 'bullet',
    liveryStyle: 'shinkansen-e7',
    compatibleCategories: ['shinkansen'],
    targetConsistIds: ['e5-consist'],
    description: '穿梭于日本阿尔卑斯的天空蓝车顶配黄铜金腰线与象牙白下车体，典雅尊贵。',
    descriptionEn: 'Hokuriku Shinkansen with sky blue roof, copper gold stripe, and ivory body.',
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
    nameEn: 'CR400AF Red Dragon (Fuxing)',
    category: 'bullet',
    liveryStyle: 'cr400-fuxing-red',
    compatibleCategories: [],
    targetConsistIds: ['cr400-fuxing-consist', 'cr400-master-consist'],
    description: '中国标准动车组旗舰 CR400AF：低风阻科技银灰底色、犀利如炬的凤眼大灯与凌厉动感的经典中国红飘带。',
    descriptionEn: 'China EMU flagship in tech silver gray, phoenix eye headlights, and flowing China red ribbon.',
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
    nameEn: 'CR400BF Golden Phoenix (Fuxing)',
    category: 'bullet',
    liveryStyle: 'cr400-fuxing-gold',
    compatibleCategories: [],
    targetConsistIds: ['cr400-fuxing-consist', 'cr400-master-consist'],
    description: '中国标准动车组 CR400BF：高雅象牙白底色，前脸环绕金色飞翼与纯黑前罩，全景车窗带配金黄动感腰线。',
    descriptionEn: 'China EMU in ivory white, golden wings face, and panoramic black-and-gold window stripe.',
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
    nameEn: 'CRH380A Hexie (Tech Blue)',
    category: 'bullet',
    liveryStyle: 'crh380a-hexie',
    compatibleCategories: [],
    targetConsistIds: ['cr400-fuxing-consist', 'cr400-master-consist'],
    description: '中国高铁代表作 CRH380A：经典纯白车身，窗下贯穿科技海蓝双飞翼动感腰带与和谐号前照灯。',
    descriptionEn: 'Classic China high-speed train in pure white with dual tech blue flying wing stripes.',
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
    nameEn: 'CRH2 Hexie (Classic Blue & White)',
    category: 'bullet',
    liveryStyle: 'crh2-hexie-classic',
    compatibleCategories: [],
    targetConsistIds: ['cr400-fuxing-consist', 'cr400-master-consist'],
    description: '早期经典大白动车组 CRH2：纯净白身贯穿单道沉稳深蓝腰带，开创中国高铁动车时代。',
    descriptionEn: 'Early generation high-speed EMU in pure white with a single deep navy blue stripe.',
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
    nameEn: 'Series 300 Silver Nozomi (Hikarian)',
    category: 'bullet',
    liveryStyle: 'shinkansen-300-nozomi',
    compatibleCategories: [],
    targetConsistIds: ['shinkansen300-hikarian-consist'],
    description: '东海道新干线 300系 / 《铁胆火车侠》哲雪的主角列车：纯白车身、东海道经典双海蓝腰线与硬朗梯形前脸。',
    descriptionEn: 'Tokaido Shinkansen Series 300 / Hikarian protagonist train with dual marine blue stripes.',
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
    nameEn: 'Series 0 Bullet (Captain Sunlight)',
    category: 'bullet',
    liveryStyle: 'shinkansen-0-classic',
    compatibleCategories: [],
    targetConsistIds: ['shinkansen300-hikarian-consist'],
    description: '世界高铁始祖 0系 / 《铁胆火车侠》阳光队长：复古乳白车身、深蓝下裙板与标志性纯圆透光前鼻锥。',
    descriptionEn: 'The pioneer of high-speed rail with retro cream white body, blue skirt, and lighted nose cone.',
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
    nameEn: 'Series E3 Akita Komachi',
    category: 'bullet',
    liveryStyle: 'shinkansen-e3-komachi',
    compatibleCategories: [],
    targetConsistIds: ['shinkansen300-hikarian-consist'],
    description: '秋田新干线初代经典 E3 系：珍珠银白车身、灰银车顶与柔美小町粉紫腰带。',
    descriptionEn: 'Original Akita Shinkansen in pearl silver white and gentle pink-purple ribbon.',
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
    nameEn: 'Series 683 Thunderbird',
    category: 'bullet',
    liveryStyle: 'shinkansen-683-thunderbird',
    compatibleCategories: [],
    targetConsistIds: ['shinkansen300-hikarian-consist'],
    description: '北陆特急王者 683 系 Thunderbird：纯白车身贯穿深黑连续全景客舱窗与湖蓝细边。',
    descriptionEn: 'Hokuriku express king with pure white body, continuous tinted dark windows, and cyan accent.',
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
    nameEn: 'Odakyu GSE (Rose Vermillion)',
    category: 'bullet',
    liveryStyle: 'romancecar-gse-red',
    compatibleCategories: [],
    targetConsistIds: ['odakyu-romancecar-gse-consist', 'romancecar-gse-master-consist'],
    description: '箱根观光旗舰浪漫特快 GSE 70000形：专属玫瑰朱红 (Rose Vermillion) 豪华底漆、深灰全景车顶与金色腰线。',
    descriptionEn: 'Hakone flagship Romancecar GSE 70000 with Rose Vermillion luxury finish and gold stripe.',
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
    nameEn: 'Odakyu VSE (Silk Pearl White)',
    category: 'bullet',
    liveryStyle: 'romancecar-vse-white',
    compatibleCategories: [],
    targetConsistIds: ['odakyu-romancecar-gse-consist', 'romancecar-gse-master-consist'],
    description: '白色浪漫特快传奇 VSE 50000形：如丝绸般的高雅珍珠白车身，配两道经典的橙金细腰带。',
    descriptionEn: 'Legendary White Romancecar VSE 50000 in silk pearl white with dual orange-gold pinstripes.',
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
    nameEn: 'Taisho Vintage Black & Gold',
    category: 'retro',
    liveryStyle: 'steam-d51-classic',
    compatibleCategories: ['steam'],
    targetConsistIds: ['d51-consist'],
    description: '深邃高贵黑底色搭配拉丝纯金古典装饰线条与红铜铆钉，浓郁机械复古浪漫。',
    descriptionEn: 'Deep coal black body with brushed gold trim, copper rivets, and warm amber windows.',
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
    nameEn: 'SL Hitoyoshi Elegant Black',
    category: 'retro',
    liveryStyle: 'steam-hitoyoshi',
    compatibleCategories: ['steam'],
    targetConsistIds: ['d51-consist'],
    description: '九州经典复古观光蒸汽火车，深邃钢琴黑配双道耀眼纯金饰线。',
    descriptionEn: 'Kyushu classic vintage steam train in piano black with dual radiant gold stripes.',
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
