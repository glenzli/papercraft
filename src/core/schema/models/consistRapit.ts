// 南海 50000系 特急 Rapi:t 完整 3 节车厢编组定义
import { TrainModelConsist } from "../consistSchema"
import { PapercraftModelSchema } from "../papercraftSchema"

// 1. 先头车 (铁面人机甲面罩车头 + 飞机椭圆舷窗 + 独立外贴机甲面罩配件)
export const nankaiRapitHeadSchema: PapercraftModelSchema = {
  version: "1.0",
  id: "nankai-rapit-head",
  name: "南海 50000系 (先头车)",
  category: "shinkansen",
  difficulty: "medium",
  recommendedAge: "6-12 岁",
  estimatedTime: "20-25 分钟",
  description: "建筑家若林广幸设计的复古未来主义机甲子弹头车头，外贴立体武士眼罩与导流鼻铲。",
  dimensions: {
    length: 160,
    width: 38,
    height: 44
  },
  parts: [
    {
      id: "head-body",
      name: "车身主体展开",
      faces: [
        // 1. 车顶 (平顶长 126mm + 前端 24mm 航空穹顶流线斜风挡，前突至 z=82mm 锐利中脊)
        {
          id: "roof",
          name: "车顶与穹顶斜风挡",
          slotName: "roof",
          vertices3D: [
            [-19, 44, -80],  // 0: 车顶后左
            [19, 44, -80],   // 1: 车顶后右
            [19, 44, 46],    // 2: 坡顶过渡右 (y=44, z=46)
            [19, 36, 68],    // 3: 坡底过渡右 (y=36, z=68)
            [0, 36, 82],     // 4: 坡底中脊尖 (y=36, z=82)
            [-19, 36, 68],   // 5: 坡底过渡左 (y=36, z=68)
            [-19, 44, 46]    // 6: 坡顶过渡左 (y=44, z=46)
          ],
          vertices2D: [
            [86, 56],        // 0: 后左
            [124, 56],       // 1: 后右
            [124, 182],      // 2: 坡顶右 (y = 56 + 126 = 182)
            [126, 206],      // 3: 坡底右 (宽展 21mm, y = 206)
            [105, 216],      // 4: 坡底中脊尖 (前突 10mm, y = 216)
            [84, 206],       // 5: 坡底左 (宽展 21mm, y = 206)
            [86, 182]        // 6: 坡顶左
          ],
          uvCoords: [
            [0.0, 1.0], [1.0, 1.0],
            [1.0, 0.20], [1.0, 0.0],
            [0.5, 0.0], [0.0, 0.0],
            [0.0, 0.20]
          ],
          indices: [
            0, 1, 2, 0, 2, 6, // 平顶
            6, 4, 5,          // 穹顶左斜面
            6, 2, 4, 2, 3, 4  // 穹顶右斜面
          ],
          creases: [
            // 后车顶折线
            { type: "mountain", p1: { x: 86, y: 56 }, p2: { x: 124, y: 56 } },
            // 平顶左右两侧山折线
            { type: "mountain", p1: { x: 124, y: 56 }, p2: { x: 124, y: 182 } },
            { type: "mountain", p1: { x: 86, y: 182 }, p2: { x: 86, y: 56 } },
            // 车顶与穹顶风挡过渡折线 (山折)
            { type: "mountain", p1: { x: 86, y: 182 }, p2: { x: 124, y: 182 } },
            // 穹顶中央破风中脊山折线
            { type: "mountain", p1: { x: 105, y: 182 }, p2: { x: 105, y: 216 } },
            // 斜风挡两侧剪切实线
            { type: "cut", p1: { x: 86, y: 182 }, p2: { x: 84, y: 206 } },
            { type: "cut", p1: { x: 124, y: 182 }, p2: { x: 126, y: 206 } },
            // 穹顶风挡与正面前脸相连的 V 型山折线
            { type: "mountain", p1: { x: 84, y: 206 }, p2: { x: 105, y: 216 } },
            { type: "mountain", p1: { x: 105, y: 216 }, p2: { x: 126, y: 206 } }
          ],
          tabs: [
            {
              id: "tab_roof_slope_l",
              label: "S1",
              edgeIndex: 5,
              p1: { x: 86, y: 182 },
              p2: { x: 84, y: 206 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_left"
            },
            {
              id: "tab_roof_slope_r",
              label: "S2",
              edgeIndex: 2,
              p1: { x: 126, y: 206 },
              p2: { x: 124, y: 182 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_right"
            }
          ]
        },
        // 2. 车头铁面人 3D V 型机甲破风尖鼻 (宽 42mm 全展宽，立体前凸 14mm)
        {
          id: "front",
          name: "铁面人立体尖鼻",
          slotName: "front",
          vertices3D: [
            [-19, 36, 68],  // 0: 前上左
            [0, 36, 82],    // 1: 前上中脊 (向前凸出 14mm)
            [19, 36, 68],   // 2: 前上右
            [19, 0, 68],    // 3: 前下右
            [0, 0, 82],     // 4: 前下中脊 (向前凸出 14mm)
            [-19, 0, 68]    // 5: 前下左
          ],
          vertices2D: [
            [84, 206],      // 0: 前上左
            [105, 216],     // 1: 前上中脊
            [126, 206],     // 2: 前上右
            [126, 242],     // 3: 前下右 (高 36mm)
            [105, 252],     // 4: 前下中脊 (高 36mm)
            [84, 242]       // 5: 前下左 (高 36mm)
          ],
          uvCoords: [
            [0.0, 1.0], [0.5, 1.0], [1.0, 1.0],
            [1.0, 0.0], [0.5, 0.0], [0.0, 0.0]
          ],
          indices: [
            0, 1, 4, 0, 4, 5, // 左侧机甲破风斜切鼻翼
            1, 2, 3, 1, 3, 4  // 右侧机甲破风斜切鼻翼
          ],
          creases: [
            // 标志性铁面人中央破风中脊山折线 (向外折形成立体机甲尖鼻)
            { type: "mountain", p1: { x: 105, y: 216 }, p2: { x: 105, y: 252 } },
            { type: "cut", p1: { x: 84, y: 206 }, p2: { x: 84, y: 242 } },
            { type: "cut", p1: { x: 126, y: 206 }, p2: { x: 126, y: 242 } },
            { type: "cut", p1: { x: 84, y: 242 }, p2: { x: 105, y: 252 } },
            { type: "cut", p1: { x: 105, y: 252 }, p2: { x: 126, y: 242 } }
          ],
          tabs: [
            {
              id: "tab_front_l",
              label: "A1",
              edgeIndex: 5,
              p1: { x: 84, y: 206 },
              p2: { x: 84, y: 242 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_left"
            },
            {
              id: "tab_front_r",
              label: "B1",
              edgeIndex: 2,
              p1: { x: 126, y: 242 },
              p2: { x: 126, y: 206 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_right"
            },
            {
              id: "tab_front_bottom_l",
              label: "C1",
              edgeIndex: 3,
              p1: { x: 84, y: 242 },
              p2: { x: 105, y: 252 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "bottom"
            },
            {
              id: "tab_front_bottom_r",
              label: "C3",
              edgeIndex: 4,
              p1: { x: 105, y: 252 },
              p2: { x: 126, y: 242 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "bottom"
            }
          ]
        },
        // 3. 左侧车身 (Left Side - 飞机正圆大舷窗，前端流线斜切)
        {
          id: "side_left",
          name: "左侧客车身",
          slotName: "side_left",
          vertices3D: [
            [-19, 44, -80],  // 0: 后上角
            [-19, 44, 46],   // 1: 坡顶过渡点 (高度 44mm)
            [-19, 36, 68],   // 2: 前上斜切点 (高度 36mm)
            [-19, 0, 68],    // 3: 前下角
            [-19, 0, -80]    // 4: 后下角
          ],
          vertices2D: [
            [86, 56],        // 0: 后上角
            [86, 182],       // 1: 坡顶过渡点
            [78, 206],       // 2: 前上斜切点 (86 - 8 = 78, y = 206)
            [42, 206],       // 3: 前下底角 (86 - 44 = 42, y = 206)
            [42, 56]         // 4: 后下底角
          ],
          uvCoords: [
            [1.0, 1.0],
            [0.20, 1.0],
            [0.0, 0.82],
            [0.0, 0.0],
            [1.0, 0.0]
          ],
          indices: [
            0, 1, 4,
            1, 3, 4,
            1, 2, 3
          ],
          creases: [
            { type: "cut", p1: { x: 42, y: 56 }, p2: { x: 86, y: 56 } },
            // 斜切顶边剪切实线 (承接 S1 粘合)
            { type: "cut", p1: { x: 86, y: 182 }, p2: { x: 78, y: 206 } },
            // 前端垂直边剪切实线 (承接 A1 粘合)
            { type: "cut", p1: { x: 78, y: 206 }, p2: { x: 42, y: 206 } }
          ],
          tabs: [
            {
              id: "tab_l_back",
              label: "A2",
              edgeIndex: 4,
              p1: { x: 86, y: 56 },
              p2: { x: 42, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "back"
            }
          ]
        },
        // 4. 右侧车身 (Right Side)
        {
          id: "side_right",
          name: "右侧客车身",
          slotName: "side_right",
          vertices3D: [
            [19, 44, -80],  // 0: 后上角
            [19, 44, 46],   // 1: 坡顶过渡点 (高度 44mm)
            [19, 36, 68],   // 2: 前上斜切点 (高度 36mm)
            [19, 0, 68],    // 3: 前下角
            [19, 0, -80]    // 4: 后下角
          ],
          vertices2D: [
            [124, 56],       // 0: 后上角
            [124, 182],      // 1: 坡顶过渡点
            [132, 206],      // 2: 前上斜切点 (124 + 8 = 132, y = 206)
            [168, 206],      // 3: 前下底角 (124 + 44 = 168, y = 206)
            [168, 56]        // 4: 后下底角
          ],
          uvCoords: [
            [1.0, 1.0],
            [0.20, 1.0],
            [0.0, 0.82],
            [0.0, 0.0],
            [1.0, 0.0]
          ],
          indices: [
            0, 1, 4,
            1, 3, 4,
            1, 2, 3
          ],
          creases: [
            { type: "cut", p1: { x: 124, y: 56 }, p2: { x: 168, y: 56 } },
            // 斜切顶边剪切实线 (承接 S2 粘合)
            { type: "cut", p1: { x: 124, y: 182 }, p2: { x: 132, y: 206 } },
            // 前端垂直边 (承接 B1 粘合)
            { type: "cut", p1: { x: 132, y: 206 }, p2: { x: 168, y: 206 } }
          ],
          tabs: [
            {
              id: "tab_r_back",
              label: "B2",
              edgeIndex: 4,
              p1: { x: 168, y: 56 },
              p2: { x: 124, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "back"
            }
          ]
        },
        // 5. 车尾 (贯通门连接壁)
        {
          id: "back",
          name: "车尾连接壁",
          slotName: "back",
          vertices3D: [
            [-19, 44, -80],
            [19, 44, -80],
            [19, 0, -80],
            [-19, 0, -80]
          ],
          vertices2D: [
            [86, 56],
            [86 + 38, 56],
            [86 + 38, 56 - 44],
            [86, 56 - 44]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: "cut", p1: { x: 86, y: 56 - 44 }, p2: { x: 86 + 38, y: 56 - 44 } },
            { type: "cut", p1: { x: 86, y: 56 - 44 }, p2: { x: 86, y: 56 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 - 44 }, p2: { x: 86 + 38, y: 56 } }
          ],
          tabs: [
            {
              id: "tab_back_bottom",
              label: "C2",
              edgeIndex: 2,
              p1: { x: 86 + 38, y: 56 - 44 },
              p2: { x: 86, y: 56 - 44 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "bottom"
            }
          ]
        },
        // 6. 底盘底板 (Bottom - 带前凸三角封底，100% 封闭 3D V 型尖鼻)
        {
          id: "bottom",
          name: "底盘封底",
          slotName: "bottom",
          vertices3D: [
            [-19, 0, -80], // 0: 后左
            [19, 0, -80],  // 1: 后右
            [19, 0, 68],   // 2: 前右
            [0, 0, 82],    // 3: 前中尖鼻三角尖端 (前凸 14mm)
            [-19, 0, 68]   // 4: 前左
          ],
          vertices2D: [
            [42, 56],      // 0: 后右
            [4, 56],       // 1: 后左
            [4, 206],      // 2: 前左
            [23, 216],     // 3: 前中尖鼻三角尖端 (x = 4 + 19 = 23, y = 206 + 10 = 216)
            [42, 206]      // 4: 前右
          ],
          uvCoords: [
            [1.0, 1.0], [0.0, 1.0],
            [0.0, 0.0], [0.5, 0.0], [1.0, 0.0]
          ],
          indices: [
            0, 1, 2, 0, 2, 4, // 矩形主底板
            2, 3, 4           // 前凸三角底封
          ],
          creases: [
            { type: "cut", p1: { x: 4, y: 56 }, p2: { x: 42, y: 56 } },
            // 前部尖鼻三角剪切实线
            { type: "cut", p1: { x: 4, y: 206 }, p2: { x: 23, y: 216 } },
            { type: "cut", p1: { x: 23, y: 216 }, p2: { x: 42, y: 206 } },
            // 左侧边缘剪切实线
            { type: "cut", p1: { x: 4, y: 56 }, p2: { x: 4, y: 206 } }
          ],
          tabs: [
            {
              id: "tab_bottom_r",
              label: "D1",
              edgeIndex: 3,
              p1: { x: 4, y: 56 },
              p2: { x: 4, y: 206 },
              tabWidth: 8,
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
      id: "ac_unit_rapit",
      name: "车顶航空流线导风罩",
      slotName: "roof",
      vertices3D: [
        [-10, 2.5, 18], [10, 2.5, 18], [10, 2.5, -18], [-10, 2.5, -18],
        [-10, -2.5, 18], [10, -2.5, 18], [10, -2.5, -18], [-10, -2.5, -18]
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
      position3D: [0, 46.5, -20],
      layout2D: { x: 172, y: 76, width: 24, height: 36 }
    }
  ]
}

// 2. 中间客车 (标准平顶方正客车，双端贯通门，等距正圆舷窗)
const nankaiRapitMiddleSchema: PapercraftModelSchema = {
  version: "1.0",
  id: "nankai-rapit-middle",
  name: "南海 50000系 (中间客车)",
  category: "shinkansen",
  difficulty: "easy",
  recommendedAge: "5-10 岁",
  estimatedTime: "10-15 分钟",
  description: "南海电铁 50000系 经典中间客车车厢，标准平顶与飞机正圆大舷窗。",
  dimensions: {
    length: 160,
    width: 38,
    height: 44
  },
  parts: [
    {
      id: "middle-body",
      name: "客车车身主体展开",
      faces: [
        // 1. 车顶 (标准全长平顶)
        {
          id: "roof",
          name: "平直车顶",
          slotName: "roof",
          vertices3D: [[-19, 44, 80], [19, 44, 80], [-19, 44, -80], [19, 44, -80]],
          vertices2D: [
            [86, 56 + 160],
            [86 + 38, 56 + 160],
            [86, 56],
            [86 + 38, 56]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: "mountain", p1: { x: 86, y: 56 }, p2: { x: 86 + 38, y: 56 } },
            { type: "mountain", p1: { x: 86 + 38, y: 56 }, p2: { x: 86 + 38, y: 56 + 160 } },
            { type: "mountain", p1: { x: 86 + 38, y: 56 + 160 }, p2: { x: 86, y: 56 + 160 } },
            { type: "mountain", p1: { x: 86, y: 56 + 160 }, p2: { x: 86, y: 56 } }
          ]
        },
        // 2. 左侧车身
        {
          id: "side_left",
          name: "左侧客车身",
          slotName: "side_left",
          vertices3D: [[-19, 44, 80], [-19, 44, -80], [-19, 0, 80], [-19, 0, -80]],
          vertices2D: [
            [86, 56 + 160],
            [86, 56],
            [86 - 44, 56 + 160],
            [86 - 44, 56]
          ],
          uvCoords: [[1, 1], [0, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: "cut", p1: { x: 86 - 44, y: 56 }, p2: { x: 86, y: 56 } },
            { type: "cut", p1: { x: 86 - 44, y: 56 + 160 }, p2: { x: 86, y: 56 + 160 } }
          ],
          tabs: [
            {
              id: "tab_l_front",
              label: "A1",
              edgeIndex: 2,
              p1: { x: 86 - 44, y: 56 + 160 },
              p2: { x: 86, y: 56 + 160 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "front"
            },
            {
              id: "tab_l_back",
              label: "A2",
              edgeIndex: 0,
              p1: { x: 86, y: 56 },
              p2: { x: 86 - 44, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "back"
            }
          ]
        },
        // 3. 右侧车身
        {
          id: "side_right",
          name: "右侧客车身",
          slotName: "side_right",
          vertices3D: [[19, 44, -80], [19, 44, 80], [19, 0, -80], [19, 0, 80]],
          vertices2D: [
            [86 + 38, 56],
            [86 + 38, 56 + 160],
            [86 + 38 + 44, 56],
            [86 + 38 + 44, 56 + 160]
          ],
          uvCoords: [[1, 1], [0, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: "cut", p1: { x: 86 + 38, y: 56 }, p2: { x: 86 + 38 + 44, y: 56 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 + 160 }, p2: { x: 86 + 38 + 44, y: 56 + 160 } }
          ],
          tabs: [
            {
              id: "tab_r_front",
              label: "B1",
              edgeIndex: 2,
              p1: { x: 86 + 38, y: 56 + 160 },
              p2: { x: 86 + 38 + 44, y: 56 + 160 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "front"
            },
            {
              id: "tab_r_back",
              label: "B2",
              edgeIndex: 0,
              p1: { x: 86 + 38 + 44, y: 56 },
              p2: { x: 86 + 38, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "back"
            }
          ]
        },
        // 4. 前端贯通连接门
        {
          id: "front",
          name: "前端贯通连接门",
          slotName: "back",
          vertices3D: [[-19, 44, 80], [19, 44, 80], [-19, 0, 80], [19, 0, 80]],
          vertices2D: [
            [86, 56 + 160],
            [86 + 38, 56 + 160],
            [86, 56 + 160 + 44],
            [86 + 38, 56 + 160 + 44]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: "cut", p1: { x: 86, y: 56 + 160 }, p2: { x: 86, y: 56 + 160 + 44 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 + 160 }, p2: { x: 86 + 38, y: 56 + 160 + 44 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 + 160 + 44 }, p2: { x: 86, y: 56 + 160 + 44 } }
          ],
          tabs: [
            {
              id: "tab_front_bottom",
              label: "C1",
              edgeIndex: 2,
              p1: { x: 86 + 38, y: 56 + 160 + 44 },
              p2: { x: 86, y: 56 + 160 + 44 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "bottom"
            }
          ]
        },
        // 5. 后端贯通连接门
        {
          id: "back",
          name: "后端贯通连接门",
          slotName: "back",
          vertices3D: [[-19, 44, -80], [19, 44, -80], [19, 0, -80], [-19, 0, -80]],
          vertices2D: [
            [86, 56],
            [86 + 38, 56],
            [86 + 38, 56 - 44],
            [86, 56 - 44]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: "cut", p1: { x: 86, y: 56 - 44 }, p2: { x: 86 + 38, y: 56 - 44 } },
            { type: "cut", p1: { x: 86, y: 56 - 44 }, p2: { x: 86, y: 56 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 - 44 }, p2: { x: 86 + 38, y: 56 } }
          ],
          tabs: [
            {
              id: "tab_back_bottom",
              label: "C2",
              edgeIndex: 2,
              p1: { x: 86 + 38, y: 56 - 44 },
              p2: { x: 86, y: 56 - 44 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "bottom"
            }
          ]
        },
        // 6. 底盘底板
        {
          id: "bottom",
          name: "底盘",
          slotName: "bottom",
          vertices3D: [[-19, 0, -80], [-19, 0, 80], [19, 0, 80], [19, 0, -80]],
          vertices2D: [
            [86 - 44, 56],
            [86 - 44, 56 + 160],
            [86 - 44 - 38, 56 + 160],
            [86 - 44 - 38, 56]
          ],
          uvCoords: [[0, 1], [0, 0], [1, 0], [1, 1]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: "cut", p1: { x: 86 - 44 - 38, y: 56 }, p2: { x: 86 - 44, y: 56 } },
            { type: "cut", p1: { x: 86 - 44 - 38, y: 56 + 160 }, p2: { x: 86 - 44, y: 56 + 160 } },
            { type: "cut", p1: { x: 86 - 44 - 38, y: 56 }, p2: { x: 86 - 44 - 38, y: 56 + 160 } }
          ],
          tabs: [
            {
              id: "tab_bottom_r",
              label: "D1",
              edgeIndex: 2,
              p1: { x: 86 - 44 - 38, y: 56 },
              p2: { x: 86 - 44 - 38, y: 56 + 160 },
              tabWidth: 8,
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
      id: "ac_unit_rapit_mid",
      name: "车顶航空流线导风罩",
      slotName: "roof",
      vertices3D: [
        [-10, 2.5, 18], [10, 2.5, 18], [10, 2.5, -18], [-10, 2.5, -18],
        [-10, -2.5, 18], [10, -2.5, 18], [10, -2.5, -18], [-10, -2.5, -18]
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
      position3D: [0, 46.5, 0],
      layout2D: { x: 172, y: 80, width: 24, height: 36 }
    }
  ]
}

// 3. 尾车
const nankaiRapitTailSchema: PapercraftModelSchema = {
  ...nankaiRapitHeadSchema,
  id: "nankai-rapit-tail",
  name: "南海 50000系 (尾车)"
}

export const nankaiRapitConsist: TrainModelConsist = {
  id: "nankai-rapit-consist",
  name: "南海 50000系 Rapi:t",
  category: "shinkansen",
  difficulty: "medium",
  recommendedAge: "6-12 岁",
  estimatedTimePerCar: "20-25 分钟",
  description: "关西空港特急：复古未来主义机甲子弹头与飞机客舱圆形舷窗，外贴立体武士面罩。",
  defaultThemeId: "nankai-rapit",
  carDefinitions: {
    head: {
      type: "head",
      name: "1号车 (先头车)",
      description: "50000系 先头驾驶车",
      schema: nankaiRapitHeadSchema
    },
    middle: {
      type: "middle",
      name: "2号车 (客车)",
      description: "50000系 中间客车",
      schema: nankaiRapitMiddleSchema
    },
    tail: {
      type: "tail",
      name: "3号车 (尾车)",
      description: "50000系 尾部驾驶车",
      schema: nankaiRapitTailSchema
    }
  }
};
