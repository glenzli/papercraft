// 小田急 70000形 GSE (浪漫特快 / 全景展望席特急列车) 大师高级版 (Master Edition)
// 突破性外观几何结构：二楼高耸骑跨式飞行座舱 + 垂直深陷 12mm 阶梯断层中壁 + 一楼超大倾角全景落地展望席
import { TrainModelConsist } from '../consistSchema'
import { PapercraftModelSchema } from '../papercraftSchema'

// Both side canvases place the nose at u=0. Project onto the longitudinal/height
// plane so a straight window edge remains straight across every mesh triangle.
const sideUV = (z:number,y:number):[number,number] => [(84-z)/164,y/46]

// 1. GSE 先头展望车 (双层阶梯断层全景展望车 · 大师高级版)
export const romancecarHeadMasterSchema: PapercraftModelSchema = {
  version: "2.0",
  id: "romancecar-head-master",
  name: "小田急 GSE 70000形 (双层展望席 · 大师版)",
  nameEn: "Odakyu GSE 70000 (Panoramic Lounge Master Ed.)",
  category: "shinkansen",
  difficulty: "hard",
  recommendedAge: "10-18 岁",
  estimatedTime: "30-40 分钟",
  description: "小田急浪漫特快旗舰大师版，真·双层阶梯错层车头：二楼挑高飞行座舱、垂直下落断层壁与一楼大落地全景落地展望台。",
  descriptionEn: "Master Edition Odakyu Romancecar GSE featuring an authentic stepped two-tier cab architecture with an elevated cockpit and recessed panoramic lounge.",
  dimensions: {
    length: 160,
    width: 38,
    height: 46
  },
  parts: [
    {
      id: "romancecar-master-head-body",
      name: "车身主体展开",
      faces: [
        // 1. 车顶与双层全景展望断层带 (14 顶点双层阶梯折纸序列)
        {
          id: "roof",
          name: "车顶与双层全景展望席",
          slotName: "roof",
          vertices3D: [
            [-19, 42, -80], // 0: 后左顶角
            [19, 42, -80],  // 1: 后右顶角
            [19, 42, 10],   // 2: 2楼起坡右
            [18, 46, 18],   // 3: 2楼顶峰右 (Y=46)
            [18, 46, 50],   // 4: 2楼座舱前右
            [17, 38, 60],   // 5: 2楼风挡底右
            [17, 26, 60],   // 6: 1楼断层壁底右 (垂直深陷 12mm!)
            [15, 14, 82],   // 7: 1楼全景鼻尖右
            [-15, 14, 82],  // 8: 1楼全景鼻尖左
            [-17, 26, 60],  // 9: 1楼断层壁底左
            [-17, 38, 60],  // 10: 2楼风挡底左
            [-18, 46, 50],  // 11: 2楼座舱前左
            [-18, 46, 18],  // 12: 2楼顶峰左 (Y=46)
            [-19, 42, 10]   // 13: 2楼起坡左
          ],
          vertices2D: [
            [86, 56],
            [124, 56],
            [124, 56 + 90],  // y = 146 (主车顶结束)
            [123, 56 + 99],  // y = 155 (2楼顶峰)
            [123, 56 + 131], // y = 187 (2楼前檐)
            [122, 56 + 144], // y = 200 (2楼风挡底)
            [122, 56 + 156], // y = 212 (垂直阶梯断层壁底，Valley折线)
            [120, 56 + 182], // y = 238 (1楼全景展望鼻尖)
            [90, 56 + 182],  // y = 238
            [88, 56 + 156],  // y = 212
            [88, 56 + 144],  // y = 200
            [87, 56 + 131],  // y = 187
            [87, 56 + 99],   // y = 155
            [86, 56 + 90]    // y = 146
          ],
          uvCoords: [
            [0, 1.0], [1, 1.0],
            [1, 0.50], [0.97, 0.45], [0.97, 0.28], [0.95, 0.21], [0.95, 0.15],
            [0.85, 0.0], [0.15, 0.0],
            [0.05, 0.15], [0.05, 0.21], [0.03, 0.28], [0.03, 0.45], [0, 0.50]
          ],
          indices: [
            0, 1, 2, 0, 2, 13,     // 主平车顶
            13, 2, 3, 13, 3, 12,   // 2楼后斜坡过渡
            12, 3, 4, 12, 4, 11,   // 2楼驾驶室平顶
            11, 4, 5, 11, 5, 10,   // 2楼驾驶室倾斜前风挡
            10, 5, 6, 10, 6, 9,    // 垂直下沉阶梯断层壁 (Vertical Step Bulkhead)
            9, 6, 7, 9, 7, 8       // 1楼超大落地全景前伸大风挡
          ],
          creases: [
            { type: "mountain", p1: { x: 86, y: 56 }, p2: { x: 124, y: 56 } },
            { type: "mountain", p1: { x: 124, y: 56 }, p2: { x: 124, y: 146 } },
            { type: "mountain", p1: { x: 86, y: 146 }, p2: { x: 86, y: 56 } },
            // 2楼起坡山折线
            { type: "mountain", p1: { x: 86, y: 146 }, p2: { x: 124, y: 146 } },
            // 2楼顶峰山折线
            { type: "mountain", p1: { x: 87, y: 155 }, p2: { x: 123, y: 155 } },
            // 2楼前风挡山折线
            { type: "mountain", p1: { x: 87, y: 187 }, p2: { x: 123, y: 187 } },
            // 核心灵魂：2楼到1楼的垂直断层下陷谷折线 (Valley Fold)
            { type: "valley", p1: { x: 88, y: 200 }, p2: { x: 122, y: 200 } },
            // 1楼展望室向前挑出的山折线 (Mountain Fold)
            { type: "mountain", p1: { x: 88, y: 212 }, p2: { x: 122, y: 212 } },
            // 1楼全景落地鼻尖剪切与折线
            { type: "mountain", p1: { x: 90, y: 238 }, p2: { x: 120, y: 238 } },
            // 两侧剪切轮廓线
            { type: "cut", p1: { x: 86, y: 146 }, p2: { x: 87, y: 155 } },
            { type: "cut", p1: { x: 87, y: 155 }, p2: { x: 87, y: 187 } },
            { type: "cut", p1: { x: 87, y: 187 }, p2: { x: 88, y: 200 } },
            { type: "cut", p1: { x: 88, y: 200 }, p2: { x: 88, y: 212 } },
            { type: "cut", p1: { x: 88, y: 212 }, p2: { x: 90, y: 238 } },
            { type: "cut", p1: { x: 124, y: 146 }, p2: { x: 123, y: 155 } },
            { type: "cut", p1: { x: 123, y: 155 }, p2: { x: 123, y: 187 } },
            { type: "cut", p1: { x: 123, y: 187 }, p2: { x: 122, y: 200 } },
            { type: "cut", p1: { x: 122, y: 200 }, p2: { x: 122, y: 212 } },
            { type: "cut", p1: { x: 122, y: 212 }, p2: { x: 120, y: 238 } }
          ],
          tabs: [
            // 2楼驾驶舱侧向粘贴翼
            {
              id: "tab_m_roof_2f_l",
              label: "K1",
              edgeIndex: 11,
              p1: { x: 87, y: 155 },
              p2: { x: 87, y: 187 },
              tabWidth: 5,
              angle: 45,
              targetFaceId: "side_left"
            },
            {
              id: "tab_m_roof_2f_r",
              label: "K2",
              edgeIndex: 4,
              p1: { x: 123, y: 187 },
              p2: { x: 123, y: 155 },
              tabWidth: 5,
              angle: 45,
              targetFaceId: "side_right"
            },
            // 垂直断层壁卡位翼
            {
              id: "tab_m_step_l",
              label: "K3",
              edgeIndex: 9,
              p1: { x: 88, y: 200 },
              p2: { x: 88, y: 212 },
              tabWidth: 4,
              angle: 45,
              targetFaceId: "side_left"
            },
            {
              id: "tab_m_step_r",
              label: "K4",
              edgeIndex: 6,
              p1: { x: 122, y: 212 },
              p2: { x: 122, y: 200 },
              tabWidth: 4,
              angle: 45,
              targetFaceId: "side_right"
            },
            // 1楼落地大风挡斜翼
            {
              id: "tab_m_obs_l",
              label: "S1",
              edgeIndex: 8,
              p1: { x: 88, y: 212 },
              p2: { x: 90, y: 238 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_left"
            },
            {
              id: "tab_m_obs_r",
              label: "S2",
              edgeIndex: 7,
              p1: { x: 120, y: 238 },
              p2: { x: 122, y: 212 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_right"
            }
          ]
        },
        // 2. 车头正面前唇下部 (下导流前铲)
        {
          id: "front",
          name: "前鼻下导流前唇",
          slotName: "front",
          vertices3D: [
            [-15, 14, 82],
            [15, 14, 82],
            [15, 0, 84],
            [-15, 0, 84]
          ],
          vertices2D: [
            [90, 238],
            [120, 238],
            [120, 238 + 14],
            [90, 238 + 14]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: "cut", p1: { x: 90, y: 238 }, p2: { x: 90, y: 238 + 14 } },
            { type: "cut", p1: { x: 120, y: 238 }, p2: { x: 120, y: 238 + 14 } },
            { type: "cut", p1: { x: 90, y: 238 + 14 }, p2: { x: 120, y: 238 + 14 } }
          ],
          tabs: [
            {
              id: "tab_m_front_l",
              label: "A1",
              edgeIndex: 3,
              p1: { x: 90, y: 238 },
              p2: { x: 90, y: 238 + 14 },
              tabWidth: 5,
              angle: 45,
              targetFaceId: "side_left"
            },
            {
              id: "tab_m_front_r",
              label: "B1",
              edgeIndex: 1,
              p1: { x: 120, y: 238 + 14 },
              p2: { x: 120, y: 238 },
              tabWidth: 5,
              angle: 45,
              targetFaceId: "side_right"
            },
            {
              id: "tab_m_front_bot",
              label: "C1",
              edgeIndex: 2,
              p1: { x: 90, y: 238 + 14 },
              p2: { x: 120, y: 238 + 14 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "bottom"
            }
          ]
        },
        // 3. 左侧客车身 (阶梯高低落差多边形侧围，严丝合缝匹配2楼驾驶室与1楼全景大风挡)
        {
          id: "side_left",
          name: "左侧双层阶梯车身",
          slotName: "side_left",
          vertices3D: [
            [-19, 42, -80], // 0: 后上角
            [-19, 42, 10],  // 1: 2楼起坡
            [-18, 46, 18],  // 2: 2楼顶峰
            [-18, 46, 50],  // 3: 2楼前檐
            [-17, 38, 60],  // 4: 2楼风挡底
            [-17, 26, 60],  // 5: 断层下沉底
            [-15, 14, 82],  // 6: 1楼全景尖
            [-15, 0, 84],   // 7: 前下底
            [-19, 0, -80]   // 8: 后下底
          ],
          vertices2D: [
            [86, 56],
            [86, 146],
            [86 - 4, 155],
            [86 - 4, 187],
            [86 - 16, 200],
            [86 - 16, 212],
            [86 - 32, 238],
            [86 - 42, 238 + 14],
            [86 - 42, 56]
          ],
          uvCoords: [
            sideUV(-80,42), sideUV(10,42), sideUV(18,46), sideUV(50,46), sideUV(60,38), sideUV(60,26), sideUV(82,14), sideUV(84,0), sideUV(-80,0)
          ],
          indices: [
            0, 1, 8,
            1, 2, 8,
            2, 3, 8,
            3, 4, 8,
            4, 5, 8,
            5, 6, 8,
            6, 7, 8
          ],
          creases: [
            { type: "cut", p1: { x: 86 - 42, y: 56 }, p2: { x: 86, y: 56 } },
            { type: "cut", p1: { x: 86, y: 146 }, p2: { x: 86 - 4, y: 155 } },
            { type: "cut", p1: { x: 86 - 4, y: 155 }, p2: { x: 86 - 4, y: 187 } },
            { type: "cut", p1: { x: 86 - 4, y: 187 }, p2: { x: 86 - 16, y: 200 } },
            { type: "cut", p1: { x: 86 - 16, y: 200 }, p2: { x: 86 - 16, y: 212 } },
            { type: "cut", p1: { x: 86 - 16, y: 212 }, p2: { x: 86 - 32, y: 238 } },
            { type: "cut", p1: { x: 86 - 32, y: 238 }, p2: { x: 86 - 42, y: 238 + 14 } }
          ],
          tabs: [
            {
              id: "tab_m_l_back",
              label: "A2",
              edgeIndex: 8,
              p1: { x: 86, y: 56 },
              p2: { x: 86 - 42, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "back"
            },
            {
              id: "tab_m_l_bot",
              label: "D1",
              edgeIndex: 7,
              p1: { x: 86 - 42, y: 56 },
              p2: { x: 86 - 42, y: 238 + 14 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "bottom"
            }
          ]
        },
        // 4. 右侧客车身 (与左侧对称，双层阶梯落差)
        {
          id: "side_right",
          name: "右侧双层阶梯车身",
          slotName: "side_right",
          vertices3D: [
            [19, 42, -80], // 0: 后上角
            [19, 0, -80],  // 1: 后下底
            [15, 0, 84],   // 2: 前下底
            [15, 14, 82],  // 3: 1楼全景尖
            [17, 26, 60],  // 4: 断层下沉底
            [17, 38, 60],  // 5: 2楼风挡底
            [18, 46, 50],  // 6: 2楼前檐
            [18, 46, 18],  // 7: 2楼顶峰
            [19, 42, 10]   // 8: 2楼起坡
          ],
          vertices2D: [
            [124, 56],
            [124 + 42, 56],
            [124 + 42, 238 + 14],
            [124 + 32, 238],
            [124 + 16, 212],
            [124 + 16, 200],
            [124 + 4, 187],
            [124 + 4, 155],
            [124, 146]
          ],
          uvCoords: [
            sideUV(-80,42), sideUV(-80,0), sideUV(84,0), sideUV(82,14), sideUV(60,26), sideUV(60,38), sideUV(50,46), sideUV(18,46), sideUV(10,42)
          ],
          indices: [
            0, 1, 8,
            8, 1, 7,
            7, 1, 6,
            6, 1, 5,
            5, 1, 4,
            4, 1, 3,
            3, 1, 2
          ],
          creases: [
            { type: "cut", p1: { x: 124, y: 56 }, p2: { x: 124 + 42, y: 56 } },
            { type: "cut", p1: { x: 124 + 42, y: 56 }, p2: { x: 124 + 42, y: 238 + 14 } },
            { type: "cut", p1: { x: 124 + 42, y: 238 + 14 }, p2: { x: 124 + 32, y: 238 } },
            { type: "cut", p1: { x: 124 + 32, y: 238 }, p2: { x: 124 + 16, y: 212 } },
            { type: "cut", p1: { x: 124 + 16, y: 212 }, p2: { x: 124 + 16, y: 200 } },
            { type: "cut", p1: { x: 124 + 16, y: 200 }, p2: { x: 124 + 4, y: 187 } },
            { type: "cut", p1: { x: 124 + 4, y: 187 }, p2: { x: 124 + 4, y: 155 } },
            { type: "cut", p1: { x: 124 + 4, y: 155 }, p2: { x: 124, y: 146 } }
          ],
          tabs: [
            {
              id: "tab_m_r_back",
              label: "B2",
              edgeIndex: 0,
              p1: { x: 124 + 42, y: 56 },
              p2: { x: 124, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "back"
            }
          ]
        },
        // 5. 车尾贯通连接壁
        {
          id: "back",
          name: "后端连接壁",
          slotName: "back",
          vertices3D: [
            [-19, 42, -80],
            [19, 42, -80],
            [19, 0, -80],
            [-19, 0, -80]
          ],
          vertices2D: [
            [86, 56],
            [86 + 38, 56],
            [86 + 38, 56 - 42],
            [86, 56 - 42]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: "cut", p1: { x: 86, y: 56 - 42 }, p2: { x: 86 + 38, y: 56 - 42 } },
            { type: "cut", p1: { x: 86, y: 56 }, p2: { x: 86, y: 56 - 42 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 }, p2: { x: 86 + 38, y: 56 - 42 } }
          ],
          tabs: [
            {
              id: "tab_m_back_bottom",
              label: "C2",
              edgeIndex: 2,
              p1: { x: 86 + 38, y: 56 - 42 },
              p2: { x: 86, y: 56 - 42 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "bottom"
            }
          ]
        },
        // 6. 车底底盘 (底盘全长 164mm，前后开有精密 9mm 牵引插槽)
        {
          id: "bottom",
          name: "车底底盘",
          slotName: "bottom",
          vertices3D: [
            [-19, 0, -80],
            [19, 0, -80],
            [15, 0, 84],
            [-15, 0, 84]
          ],
          vertices2D: [
            [86 - 42, 56],
            [86 - 42 - 38, 56],
            [86 - 42 - 38, 238 + 14],
            [86 - 42, 238 + 14]
          ],
          uvCoords: [[0, 0], [1, 0], [1, 1], [0, 1]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: "cut", p1: { x: 86 - 42, y: 56 }, p2: { x: 86 - 42 - 38, y: 56 } },
            { type: "cut", p1: { x: 86 - 42 - 38, y: 56 }, p2: { x: 86 - 42 - 38, y: 238 + 14 } },
            { type: "cut", p1: { x: 86 - 42 - 38, y: 238 + 14 }, p2: { x: 86 - 42, y: 238 + 14 } },
            { type: "mountain", p1: { x: 86 - 42, y: 56 }, p2: { x: 86 - 42, y: 238 + 14 } }
          ],
          tabs: []
        }
      ]
    }
  ],
  accessories: [
    {
      id: "ac_unit_gse_master",
      name: "车顶冷气机组",
      slotName: "ac_unit",
      vertices3D: [
        [-12, 2.5, 18], [12, 2.5, 18], [12, 2.5, -18], [-12, 2.5, -18],
        [-12, -2.5, 18], [12, -2.5, 18], [12, -2.5, -18], [-12, -2.5, -18]
      ],
      indices: [
        0, 1, 2, 0, 2, 3,
        4, 6, 5, 4, 7, 6,
        0, 4, 5, 0, 5, 1,
        2, 6, 7, 2, 7, 3,
        3, 7, 4, 3, 4, 0,
        1, 5, 6, 1, 6, 2
      ],
      uvCoords: [
        [0, 1], [1, 1], [1, 0], [0, 0],
        [0, 1], [1, 1], [1, 0], [0, 0]
      ],
      position3D: [0, 44.5, -30],
      layout2D: { x: 172, y: 68, width: 24, height: 36 }
    }
  ]
}

// 2. GSE 中间客车 (保留现有优雅车身)
import { romancecarMiddleSchema } from './consistRomancecar'

// 3. 编组定义
export const romancecarTrainConsistMaster: TrainModelConsist = {
  id: "romancecar-gse-master-consist",
  name: "小田急 70000形 GSE (双层展望席 · 大师版)",
  nameEn: "Odakyu GSE 70000 (Stepped Panoramic Lounge Master Ed.)",
  category: "shinkansen",
  difficulty: "hard",
  recommendedAge: "10-18 岁",
  estimatedTimePerCar: "35 分钟",
  description: "大师级双层立体阶梯展望特急列车。骑跨式二楼高位驾驶舱与深陷垂直断层壁，带来前所未有的全景大飘窗折纸体验。",
  descriptionEn: "Master Edition observation express with stepped two-tier cockpit and panoramic observation lounge.",
  defaultThemeId: "romancecar-gse-red",
  assembly: {
    type: "consist",
    allowConsistCount: true,
    defaultMiddleCarCount: 2,
    maxMiddleCars: 6
  },
  carDefinitions: {
    head: {
      type: "head",
      name: "先头展望车 (大师版)",
      nameEn: "Observation Head Car (Master Ed.)",
      description: "双层挑高飞行员座舱与全景大落地风挡",
      descriptionEn: "Two-tier stepped cab with elevated cockpit and observation lounge",
      schema: romancecarHeadMasterSchema
    },
    middle: {
      type: "middle",
      name: "普通客车",
      nameEn: "Passenger Coach",
      description: "低重心流线客车厢",
      descriptionEn: "Standard intermediate passenger car",
      schema: romancecarMiddleSchema
    },
    tail: {
      type: "tail",
      name: "车尾展望车 (大师版)",
      nameEn: "Observation Tail Car (Master Ed.)",
      description: "全景双层后展望席",
      descriptionEn: "Rear observation lounge car",
      schema: romancecarHeadMasterSchema
    }
  }
}
