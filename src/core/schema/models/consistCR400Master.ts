// 中国标准动车组 CR400 复兴号 (八面多面体气动流线车身 + 刀锋破风长鼻 · 旗舰大师版)
// 突破性几何结构：真实八面低风阻流线车身截面 (车顶平顶 + 20°上导流斜肩 + 垂直车窗腰部 + 18°下导流裙板内折)
// 配合四面立体微曲雕塑车鼻 (中央刀锋破风脊线 + 左右气动分风斜面 + 鹰眼流线前颊)
import { TrainModelConsist } from '../consistSchema'
import { PapercraftModelSchema } from '../papercraftSchema'

// 1. CR400 旗舰大师版 先头车
export const cr400HeadMasterSchema: PapercraftModelSchema = {
  version: "2.0",
  id: "cr400-head-master",
  name: "CR400 复兴号 (八面流线 · 旗舰大师版)",
  nameEn: "CR400 Fuxing (Octagonal Aero Master Ed.)",
  category: "shinkansen",
  difficulty: "hard",
  recommendedAge: "10-18 岁",
  estimatedTime: "35-45 分钟",
  description: "复兴号旗舰大师版：真实八面体低风阻微曲断面（车顶上折角+下裙板内敛折角），中央刀锋破风脊线长鼻锥。",
  descriptionEn: "Master Edition CR400 featuring an authentic 8-facet tumblehome body cross-section and razor-spine aerodynamic needle nose.",
  dimensions: {
    length: 180,
    width: 38,
    height: 42
  },
  parts: [
    {
      id: "cr400-master-head-body",
      name: "车身主体展开",
      faces: [
        // 1. 车顶与微曲长鼻 (9 顶点闭合外周长多边形，中央设立体破风山折脊线与左右导流面)
        {
          id: "roof",
          name: "车顶与刀锋破风鼻面",
          slotName: "roof",
          vertices3D: [
            [-14, 42, -90], // 0: 后左肩顶
            [14, 42, -90],  // 1: 后右肩顶
            [14, 42, 20],   // 2: 额头右肩
            [14, 24, 52],   // 3: 风挡右底
            [8, 10, 86],    // 4: 鼻尖右角
            [0, 13, 86],    // 5: 鼻尖中央破风高点
            [-8, 10, 86],   // 6: 鼻尖左角
            [-14, 24, 52],  // 7: 风挡左底
            [-14, 42, 20],  // 8: 额头左肩
            [0, 26, 52],    // 9: 风挡中央破风高点 (内部脊点)
            [0, 42, 20],    // 10: 额头中央 (内部脊点)
            [0, 42, -90]    // 11: 后平顶中央 (内部脊点)
          ],
          vertices2D: [
            [91, 56],
            [119, 56],
            [119, 166],
            [119, 198],
            [113, 234],
            [105, 236],
            [97, 234],
            [91, 198],
            [91, 166]
          ],
          uvCoords: [
            [0, 1.0],
            [1.0, 1.0],
            [1.0, 0.35],
            [1.0, 0.18],
            [0.75, 0.0],
            [0.5, 0.0],
            [0.25, 0.0],
            [0, 0.18],
            [0, 0.35],
            [0.5, 0.18],
            [0.5, 0.35],
            [0.5, 1.0]
          ],
          indices: [
            // 客舱平车顶 (中央分界高光)
            0, 11, 8, 11, 10, 8,
            11, 1, 10, 1, 2, 10,
            // 驾驶舱风挡 (左右双斜面，中央隆起破风脊)
            8, 10, 7, 10, 9, 7,
            10, 2, 9, 2, 3, 9,
            // 飞梭长鼻锥 (左右双导流面，中央刀锋破风脊)
            7, 9, 6, 9, 5, 6,
            9, 3, 5, 3, 4, 5
          ],
          creases: [
            // 后壁折线
            { type: "mountain", p1: { x: 91, y: 56 }, p2: { x: 119, y: 56 } },
            // 车顶向驾驶舱风挡倾斜折线 (额头)
            { type: "mountain", p1: { x: 91, y: 166 }, p2: { x: 119, y: 166 } },
            // 风挡向长鼻过渡折线
            { type: "mountain", p1: { x: 91, y: 198 }, p2: { x: 119, y: 198 } },
            // 鼻尖底折线
            { type: "mountain", p1: { x: 97, y: 234 }, p2: { x: 105, y: 236 } },
            { type: "mountain", p1: { x: 105, y: 236 }, p2: { x: 113, y: 234 } },
            // ★ 核心大师折线：前鼻中央刀锋破风山折脊线 (Razor Spine Mountain Fold)
            { type: "mountain", p1: { x: 105, y: 166 }, p2: { x: 105, y: 236 } },
            // 侧向轮廓切割线
            { type: "cut", p1: { x: 91, y: 198 }, p2: { x: 97, y: 234 } },
            { type: "cut", p1: { x: 119, y: 198 }, p2: { x: 113, y: 234 } }
          ],
          tabs: [
            {
              id: "tab_m_roof_slope_l",
              label: "S1",
              edgeIndex: 7,
              p1: { x: 92.5, y: 207 },
              p2: { x: 97, y: 234 },
              tabWidth: 5,
              angle: 45,
              targetFaceId: "side_left"
            },
            {
              id: "tab_m_roof_slope_r",
              label: "S2",
              edgeIndex: 3,
              p1: { x: 113, y: 234 },
              p2: { x: 117.5, y: 207 },
              tabWidth: 5,
              angle: 45,
              targetFaceId: "side_right"
            }
          ]
        },
        // 2. 车头正面前鼻尖下唇铲 (飞梭低阻力气动排障铲)
        {
          id: "front",
          name: "飞梭前鼻下铲",
          slotName: "front",
          vertices3D: [
            [-8, 10, 86], // 0
            [0, 13, 86],   // 1
            [8, 10, 86],   // 2
            [10, 0, 90],   // 3
            [0, 0, 90],    // 4
            [-10, 0, 90]   // 5
          ],
          vertices2D: [
            [97, 234],
            [105, 236],
            [113, 234],
            [115, 248],
            [95, 248]
          ],
          uvCoords: [
            [0.2, 1.0],
            [0.5, 1.0],
            [0.8, 1.0],
            [0.9, 0.0],
            [0.5, 0.0],
            [0.1, 0.0]
          ],
          indices: [
            0, 1, 4, 0, 4, 5,
            1, 2, 3, 1, 3, 4
          ],
          creases: [
            // 前鼻下铲中央山折线
            { type: "mountain", p1: { x: 105, y: 236 }, p2: { x: 105, y: 248 } },
            { type: "cut", p1: { x: 97, y: 234 }, p2: { x: 95, y: 248 } },
            { type: "cut", p1: { x: 113, y: 234 }, p2: { x: 115, y: 248 } },
            { type: "cut", p1: { x: 95, y: 248 }, p2: { x: 115, y: 248 } }
          ],
          tabs: [
            {
              id: "tab_m_front_l",
              label: "A1",
              edgeIndex: 4,
              p1: { x: 97, y: 234 },
              p2: { x: 95, y: 248 },
              tabWidth: 4,
              angle: 45,
              targetFaceId: "side_left"
            },
            {
              id: "tab_m_front_r",
              label: "B1",
              edgeIndex: 2,
              p1: { x: 115, y: 248 },
              p2: { x: 113, y: 234 },
              tabWidth: 4,
              angle: 45,
              targetFaceId: "side_right"
            },
            {
              id: "tab_m_front_bottom",
              label: "C1",
              edgeIndex: 3,
              p1: { x: 95, y: 248 },
              p2: { x: 115, y: 248 },
              tabWidth: 5,
              angle: 45,
              targetFaceId: "bottom"
            }
          ]
        },
        // 3. 左侧车身 (真实八面体三段多曲面：上导流斜肩 + 垂直车窗腰带 + 下内收导流裙板 + 鹰眼流线前颊)
        {
          id: "side_left",
          name: "左侧八面流线车身",
          slotName: "side_left",
          vertices3D: [
            [-14, 42, -90], // 0: 后上肩
            [-19, 35, -90], // 1: 后肩腰折线
            [-19, 12, -90], // 2: 后裙腰折线
            [-14, 0, -90],  // 3: 后下裙
            [-14, 42, 20],  // 4: 额头上肩
            [-19, 35, 20],  // 5: 额头肩腰折线
            [-19, 12, 20],  // 6: 额头裙腰折线
            [-14, 0, 20],   // 7: 额头下裙
            [-14, 24, 52],  // 8: 风挡底外角
            [-8, 10, 86],   // 9: 鼻尖左角
            [-10, 0, 90]    // 10: 排障器前底角
          ],
          vertices2D: [
            [91, 56],
            [91, 166],
            [91, 198],
            [74, 234],
            [47, 248],
            [47, 56]
          ],
          uvCoords: [
            [1.0, 1.0],  // 0
            [1.0, 0.85], // 1
            [1.0, 0.30], // 2
            [1.0, 0.0],  // 3
            [0.35, 1.0], // 4
            [0.35, 0.85],// 5
            [0.35, 0.30],// 6
            [0.35, 0.0], // 7
            [0.18, 0.60],// 8
            [0.0, 0.25], // 9
            [0.0, 0.0]   // 10
          ],
          indices: [
            // 客舱段上斜肩 (Tumblehome)
            0, 5, 4, 0, 1, 5,
            // 客舱段垂直车窗腰带 (Window belt)
            1, 6, 5, 1, 2, 6,
            // 客舱段下导流裙板内折 (Skirt taper)
            2, 7, 6, 2, 3, 7,
            // 前车头流线鹰眼过渡
            4, 5, 8,
            5, 9, 8, 5, 6, 9,
            6, 10, 9, 6, 7, 10
          ],
          creases: [
            // ★ 八面体核心折线 1：上导流斜肩山折线 (Tumblehome Fold: X=83)
            { type: "mountain", p1: { x: 83, y: 56 }, p2: { x: 83, y: 198 } },
            // ★ 八面体核心折线 2：下导流裙板内折山折线 (Lower Skirt Fold: X=60)
            { type: "mountain", p1: { x: 60, y: 56 }, p2: { x: 60, y: 198 } },
            // 额头与前颊流线折线
            { type: "mountain", p1: { x: 83, y: 166 }, p2: { x: 91, y: 166 } },
            { type: "mountain", p1: { x: 83, y: 198 }, p2: { x: 74, y: 234 } },
            { type: "mountain", p1: { x: 60, y: 198 }, p2: { x: 74, y: 234 } },
            // 边缘剪切线
            { type: "cut", p1: { x: 47, y: 56 }, p2: { x: 91, y: 56 } },
            { type: "cut", p1: { x: 91, y: 198 }, p2: { x: 74, y: 234 } },
            { type: "cut", p1: { x: 74, y: 234 }, p2: { x: 47, y: 248 } }
          ],
          tabs: [
            {
              id: "tab_m_l_back",
              label: "A2",
              edgeIndex: 5,
              p1: { x: 91, y: 56 },
              p2: { x: 47, y: 56 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "back"
            }
          ]
        },
        // 4. 右侧车身 (八面体三段多曲面：与左侧完全对称镜像)
        {
          id: "side_right",
          name: "右侧八面流线车身",
          slotName: "side_right",
          vertices3D: [
            [14, 42, -90], // 0: 后上肩
            [19, 35, -90], // 1: 后肩腰折线
            [19, 12, -90], // 2: 后裙腰折线
            [14, 0, -90],  // 3: 后下裙
            [14, 42, 20],  // 4: 额头上肩
            [19, 35, 20],  // 5: 额头肩腰折线
            [19, 12, 20],  // 6: 额头裙腰折线
            [14, 0, 20],   // 7: 额头下裙
            [14, 24, 52],  // 8: 风挡底外角
            [8, 10, 86],   // 9: 鼻尖右角
            [10, 0, 90]    // 10: 排障器前底角
          ],
          vertices2D: [
            [119, 56],
            [119, 166],
            [119, 198],
            [136, 234],
            [163, 248],
            [163, 56]
          ],
          uvCoords: [
            [1.0, 1.0],
            [1.0, 0.85],
            [1.0, 0.30],
            [1.0, 0.0],
            [0.35, 1.0],
            [0.35, 0.85],
            [0.35, 0.30],
            [0.35, 0.0],
            [0.18, 0.60],
            [0.0, 0.25],
            [0.0, 0.0]
          ],
          indices: [
            0, 4, 5, 0, 5, 1,
            1, 5, 6, 1, 6, 2,
            2, 6, 7, 2, 7, 3,
            4, 8, 5,
            5, 8, 9, 5, 9, 6,
            6, 9, 10, 6, 10, 7
          ],
          creases: [
            // ★ 八面体右侧斜肩折线 (X=127)
            { type: "mountain", p1: { x: 127, y: 56 }, p2: { x: 127, y: 198 } },
            // ★ 八面体右侧裙板内折线 (X=150)
            { type: "mountain", p1: { x: 150, y: 56 }, p2: { x: 150, y: 198 } },
            { type: "mountain", p1: { x: 119, y: 166 }, p2: { x: 127, y: 166 } },
            { type: "mountain", p1: { x: 127, y: 198 }, p2: { x: 136, y: 234 } },
            { type: "mountain", p1: { x: 150, y: 198 }, p2: { x: 136, y: 234 } },
            { type: "cut", p1: { x: 119, y: 56 }, p2: { x: 163, y: 56 } },
            { type: "cut", p1: { x: 119, y: 198 }, p2: { x: 136, y: 234 } },
            { type: "cut", p1: { x: 136, y: 234 }, p2: { x: 163, y: 248 } }
          ],
          tabs: [
            {
              id: "tab_m_r_back",
              label: "B2",
              edgeIndex: 5,
              p1: { x: 163, y: 56 },
              p2: { x: 119, y: 56 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "back"
            }
          ]
        },
        // 5. 车尾八面体连接壁 (真实八面断面)
        {
          id: "back",
          name: "八面车尾连接壁",
          slotName: "back",
          vertices3D: [
            [-14, 42, -90],
            [14, 42, -90],
            [19, 35, -90],
            [19, 12, -90],
            [14, 0, -90],
            [-14, 0, -90],
            [-19, 12, -90],
            [-19, 35, -90]
          ],
          vertices2D: [
            [91, 18],
            [119, 18],
            [119, 56],
            [91, 56]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: "cut", p1: { x: 91, y: 18 }, p2: { x: 119, y: 18 } },
            { type: "cut", p1: { x: 91, y: 18 }, p2: { x: 91, y: 56 } },
            { type: "cut", p1: { x: 119, y: 18 }, p2: { x: 119, y: 56 } }
          ],
          tabs: [
            {
              id: "tab_m_back_top",
              label: "K1",
              edgeIndex: 0,
              p1: { x: 91, y: 18 },
              p2: { x: 119, y: 18 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "roof"
            }
          ]
        },
        // 6. 底盘 (9mm 专业防脱防漏暗槽插口)
        {
          id: "bottom",
          name: "车底底盘 (含连接插槽)",
          slotName: "bottom",
          vertices3D: [
            [-14, 0, 90],
            [14, 0, 90],
            [14, 0, -90],
            [-14, 0, -90]
          ],
          vertices2D: [
            [47, 248],
            [19, 248],
            [19, 56],
            [47, 56]
          ],
          uvCoords: [[0, 0], [1, 0], [1, 1], [0, 1]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: "cut", p1: { x: 19, y: 56 }, p2: { x: 19, y: 248 } },
            { type: "cut", p1: { x: 19, y: 248 }, p2: { x: 47, y: 248 } },
            // 车尾暗槽切口 (9mm 宽，两侧各预留 4.5mm 防脱阻挡台阶)
            { type: "cut", p1: { x: 28.5, y: 66 }, p2: { x: 37.5, y: 66 } },
            // 车头暗槽切口
            { type: "cut", p1: { x: 28.5, y: 236 }, p2: { x: 37.5, y: 236 } }
          ],
          tabs: [
            {
              id: "tab_m_bottom_r",
              label: "R1",
              edgeIndex: 1,
              p1: { x: 19, y: 248 },
              p2: { x: 19, y: 56 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_right"
            }
          ]
        }
      ]
    }
  ],
  accessories: [
    {
      id: "cr400-master-head-ac",
      name: "车顶空调冷气机组 (高精八面体导流罩)",
      slotName: "accessories",
      position3D: [0, 42.5, -35],
      vertices3D: [
        [-8, 4.5, 24],
        [8, 4.5, 24],
        [8, 4.5, -24],
        [-8, 4.5, -24],
        [-8, 0, 24],
        [8, 0, 24],
        [8, 0, -24],
        [-8, 0, -24]
      ],
      indices: [
        0, 1, 2, 0, 2, 3,
        0, 4, 5, 0, 5, 1,
        1, 5, 6, 1, 6, 2,
        2, 6, 7, 2, 7, 3,
        3, 7, 4, 3, 4, 0
      ],
      uvCoords: [
        [0.2, 0.8], [0.8, 0.8], [0.8, 0.2], [0.2, 0.2],
        [0.2, 1.0], [0.8, 1.0], [0.8, 0.0], [0.2, 0.0]
      ],
      layout2D: {
        x: 10,
        y: 18,
        width: 38,
        height: 54
      }
    },
    // 底盘连接插条
    {
      id: "cr400-master-coupler-head",
      name: "9mm 磁铁连接挂钩",
      slotName: "accessories",
      position3D: [0, 0, -94],
      vertices3D: [
        [-3, 1, 14], [3, 1, 14], [3, 1, -14], [-3, 1, -14],
        [-3, 0, 14], [3, 0, 14], [3, 0, -14], [-3, 0, -14]
      ],
      indices: [0, 1, 2, 0, 2, 3],
      uvCoords: [[0, 0], [1, 0], [1, 1], [0, 1]],
      layout2D: {
        x: 172,
        y: 18,
        width: 24,
        height: 48
      }
    }
  ]
}

// 2. CR400 旗舰大师版 中间客车 (全贯通八面体低阻力车身)
export const cr400MiddleMasterSchema: PapercraftModelSchema = {
  version: "2.0",
  id: "cr400-middle-master",
  name: "CR400 复兴号 (八面流线客车 · 旗舰大师版)",
  nameEn: "CR400 Fuxing Middle (Octagonal Aero Master Ed.)",
  category: "shinkansen",
  difficulty: "hard",
  recommendedAge: "10-18 岁",
  estimatedTime: "30-40 分钟",
  description: "复兴号旗舰大师版中间客车：连续贯通式八面体微曲车身断面，单臂高速受电弓与双空调机组。",
  descriptionEn: "Master Edition CR400 coach featuring matching 8-facet tumblehome body geometry and high-speed pantograph.",
  dimensions: {
    length: 160,
    width: 38,
    height: 42
  },
  parts: [
    {
      id: "cr400-master-mid-body",
      name: "客车身主体展开",
      faces: [
        // 1. 车顶 (平顶宽度 28mm，与先头车完全无缝对接)
        {
          id: "roof",
          name: "车顶",
          slotName: "roof",
          vertices3D: [
            [-14, 42, 80],
            [14, 42, 80],
            [14, 42, -80],
            [-14, 42, -80]
          ],
          vertices2D: [
            [91, 68],
            [119, 68],
            [119, 228],
            [91, 228]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: "mountain", p1: { x: 91, y: 68 }, p2: { x: 119, y: 68 } },
            { type: "mountain", p1: { x: 91, y: 228 }, p2: { x: 119, y: 228 } },
            { type: "mountain", p1: { x: 91, y: 68 }, p2: { x: 91, y: 228 } },
            { type: "mountain", p1: { x: 119, y: 68 }, p2: { x: 119, y: 228 } }
          ]
        },
        // 2. 左侧车身 (八面体三段多曲面)
        {
          id: "side_left",
          name: "左侧八面车身",
          slotName: "side_left",
          vertices3D: [
            [-14, 42, -80], // 0
            [-19, 35, -80], // 1
            [-19, 12, -80], // 2
            [-14, 0, -80],  // 3
            [-14, 42, 80],  // 4
            [-19, 35, 80],  // 5
            [-19, 12, 80],  // 6
            [-14, 0, 80]    // 7
          ],
          vertices2D: [
            [91, 68],
            [91, 228],
            [47, 228],
            [47, 68]
          ],
          uvCoords: [
            [1.0, 1.0],
            [1.0, 0.85],
            [1.0, 0.30],
            [1.0, 0.0],
            [0.0, 1.0],
            [0.0, 0.85],
            [0.0, 0.30],
            [0.0, 0.0]
          ],
          indices: [
            0, 5, 4, 0, 1, 5,
            1, 6, 5, 1, 2, 6,
            2, 7, 6, 2, 3, 7
          ],
          creases: [
            // 上斜肩山折线 (X=83)
            { type: "mountain", p1: { x: 83, y: 68 }, p2: { x: 83, y: 228 } },
            // 下裙板内折山折线 (X=60)
            { type: "mountain", p1: { x: 60, y: 68 }, p2: { x: 60, y: 228 } },
            { type: "cut", p1: { x: 47, y: 68 }, p2: { x: 91, y: 68 } },
            { type: "cut", p1: { x: 47, y: 228 }, p2: { x: 91, y: 228 } }
          ],
          tabs: [
            {
              id: "tab_m_mid_l_front",
              label: "F1",
              edgeIndex: 3,
              p1: { x: 91, y: 68 },
              p2: { x: 47, y: 68 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "front"
            },
            {
              id: "tab_m_mid_l_back",
              label: "B1",
              edgeIndex: 1,
              p1: { x: 47, y: 228 },
              p2: { x: 91, y: 228 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "back"
            }
          ]
        },
        // 3. 右侧车身
        {
          id: "side_right",
          name: "右侧八面车身",
          slotName: "side_right",
          vertices3D: [
            [14, 42, -80], // 0
            [19, 35, -80], // 1
            [19, 12, -80], // 2
            [14, 0, -80],  // 3
            [14, 42, 80],  // 4
            [19, 35, 80],  // 5
            [19, 12, 80],  // 6
            [14, 0, 80]    // 7
          ],
          vertices2D: [
            [119, 68],
            [163, 68],
            [163, 228],
            [119, 228]
          ],
          uvCoords: [
            [1.0, 1.0],
            [1.0, 0.85],
            [1.0, 0.30],
            [1.0, 0.0],
            [0.0, 1.0],
            [0.0, 0.85],
            [0.0, 0.30],
            [0.0, 0.0]
          ],
          indices: [
            0, 4, 5, 0, 5, 1,
            1, 5, 6, 1, 6, 2,
            2, 6, 7, 2, 7, 3
          ],
          creases: [
            // 上斜肩山折线 (X=127)
            { type: "mountain", p1: { x: 127, y: 68 }, p2: { x: 127, y: 228 } },
            // 下裙板内折山折线 (X=150)
            { type: "mountain", p1: { x: 150, y: 68 }, p2: { x: 150, y: 228 } },
            { type: "cut", p1: { x: 119, y: 68 }, p2: { x: 163, y: 68 } },
            { type: "cut", p1: { x: 119, y: 228 }, p2: { x: 163, y: 228 } }
          ],
          tabs: [
            {
              id: "tab_m_mid_r_front",
              label: "F2",
              edgeIndex: 0,
              p1: { x: 163, y: 68 },
              p2: { x: 119, y: 68 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "front"
            },
            {
              id: "tab_m_mid_r_back",
              label: "B2",
              edgeIndex: 2,
              p1: { x: 119, y: 228 },
              p2: { x: 163, y: 228 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "back"
            }
          ]
        },
        // 4. 前端连接壁
        {
          id: "front",
          name: "前端连接壁",
          slotName: "front",
          vertices3D: [
            [-14, 42, 80],
            [14, 42, 80],
            [14, 0, 80],
            [-14, 0, 80]
          ],
          vertices2D: [
            [91, 30],
            [119, 30],
            [119, 68],
            [91, 68]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: "cut", p1: { x: 91, y: 30 }, p2: { x: 119, y: 30 } },
            { type: "cut", p1: { x: 91, y: 30 }, p2: { x: 91, y: 68 } },
            { type: "cut", p1: { x: 119, y: 30 }, p2: { x: 119, y: 68 } }
          ],
          tabs: [
            {
              id: "tab_m_mid_front_top",
              label: "F0",
              edgeIndex: 0,
              p1: { x: 91, y: 30 },
              p2: { x: 119, y: 30 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "roof"
            }
          ]
        },
        // 5. 后端连接壁
        {
          id: "back",
          name: "后端连接壁",
          slotName: "back",
          vertices3D: [
            [14, 42, -80],
            [-14, 42, -80],
            [-14, 0, -80],
            [14, 0, -80]
          ],
          vertices2D: [
            [119, 266],
            [91, 266],
            [91, 228],
            [119, 228]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: "cut", p1: { x: 91, y: 266 }, p2: { x: 119, y: 266 } },
            { type: "cut", p1: { x: 91, y: 228 }, p2: { x: 91, y: 266 } },
            { type: "cut", p1: { x: 119, y: 228 }, p2: { x: 119, y: 266 } }
          ],
          tabs: [
            {
              id: "tab_m_mid_back_top",
              label: "B0",
              edgeIndex: 0,
              p1: { x: 119, y: 266 },
              p2: { x: 91, y: 266 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "roof"
            }
          ]
        },
        // 6. 底盘
        {
          id: "bottom",
          name: "车底底盘",
          slotName: "bottom",
          vertices3D: [
            [-14, 0, 80],
            [14, 0, 80],
            [14, 0, -80],
            [-14, 0, -80]
          ],
          vertices2D: [
            [47, 228],
            [19, 228],
            [19, 68],
            [47, 68]
          ],
          uvCoords: [[0, 0], [1, 0], [1, 1], [0, 1]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: "cut", p1: { x: 19, y: 68 }, p2: { x: 19, y: 228 } },
            // 前后暗槽切口 (9mm 宽)
            { type: "cut", p1: { x: 28.5, y: 78 }, p2: { x: 37.5, y: 78 } },
            { type: "cut", p1: { x: 28.5, y: 218 }, p2: { x: 37.5, y: 218 } }
          ],
          tabs: [
            {
              id: "tab_m_mid_bottom_r",
              label: "R1",
              edgeIndex: 1,
              p1: { x: 19, y: 228 },
              p2: { x: 19, y: 68 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_right"
            }
          ]
        }
      ]
    }
  ],
  accessories: [
    {
      id: "cr400-master-pantograph",
      name: "单臂高速受电弓",
      slotName: "accessories",
      position3D: [0, 42.5, -45],
      vertices3D: [
        [-6, 12, 10], [6, 12, 10], [6, 12, -10], [-6, 12, -10],
        [-6, 0, 10], [6, 0, 10], [6, 0, -10], [-6, 0, -10]
      ],
      indices: [
        0, 1, 2, 0, 2, 3,
        0, 4, 5, 0, 5, 1,
        1, 5, 6, 1, 6, 2,
        2, 6, 7, 2, 7, 3,
        3, 7, 4, 3, 4, 0
      ],
      uvCoords: [[0, 0], [1, 0], [1, 1], [0, 1]],
      layout2D: {
        x: 10,
        y: 18,
        width: 32,
        height: 44
      }
    },
    {
      id: "cr400-master-mid-ac-1",
      name: "车顶空调冷气机组 1",
      slotName: "accessories",
      position3D: [0, 42.5, 30],
      vertices3D: [
        [-8, 4.5, 20], [8, 4.5, 20], [8, 4.5, -20], [-8, 4.5, -20],
        [-8, 0, 20], [8, 0, 20], [8, 0, -20], [-8, 0, -20]
      ],
      indices: [
        0, 1, 2, 0, 2, 3,
        0, 4, 5, 0, 5, 1,
        1, 5, 6, 1, 6, 2,
        2, 6, 7, 2, 7, 3,
        3, 7, 4, 3, 4, 0
      ],
      uvCoords: [[0, 0], [1, 0], [1, 1], [0, 1]],
      layout2D: {
        x: 172,
        y: 18,
        width: 28,
        height: 48
      }
    }
  ]
}

// 3. 完整编组定义 (先头车 + 中间客车 + 尾车)
export const cr400TrainConsistMaster: TrainModelConsist = {
  id: "cr400-master-consist",
  name: "CR400 复兴号 (旗舰大师版 · 八面流线)",
  nameEn: "CR400 Fuxing (Master Ed. Octagonal Aero)",
  category: "shinkansen",
  difficulty: "hard",
  recommendedAge: "10-18 岁",
  estimatedTimePerCar: "35 分钟",
  description: "复兴号旗舰大师版：真·八面多面体流线车身截面（车顶斜肩+下裙板内折）与四面立体微曲雕塑车鼻（中央刀锋破风脊线）。",
  descriptionEn: "Master Edition CR400 featuring an authentic 8-facet tumblehome cross-section and razor-spine aerodynamic needle nose.",
  defaultThemeId: "cr400-fuxing-red",
  assembly: {
    type: "consist",
    allowConsistCount: true,
    defaultMiddleCarCount: 1,
    maxMiddleCars: 6
  },
  carDefinitions: {
    head: {
      type: "head",
      name: "先头车 (八面流线 · 刀锋破风长鼻)",
      nameEn: "CR400 Head Car (Octagonal Aero Master Ed.)",
      description: "八面低风阻多面体车身与中央刀锋破风长鼻锥",
      descriptionEn: "Aerodynamic octagonal cross-section and razor-spine needle nose",
      schema: cr400HeadMasterSchema
    },
    middle: {
      type: "middle",
      name: "中间车 (八面贯通客舱)",
      nameEn: "CR400 Middle Coach (Master Ed.)",
      description: "八面体微曲贯通客舱",
      descriptionEn: "Continuous 8-facet tumblehome body",
      schema: cr400MiddleMasterSchema
    },
    tail: {
      type: "tail",
      name: "尾车 (八面流线 · 刀锋破风长鼻)",
      nameEn: "CR400 Tail Car (Octagonal Aero Master Ed.)",
      description: "八面低风阻多面体车身与中央刀锋破风长鼻锥",
      descriptionEn: "Aerodynamic octagonal cross-section and razor-spine needle nose",
      schema: cr400HeadMasterSchema
    }
  }
}
