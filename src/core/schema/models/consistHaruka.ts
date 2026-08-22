// JR 281系 特急 Haruka 完整 3 节车厢编组定义
import { TrainModelConsist } from "../consistSchema"
import { PapercraftModelSchema } from "../papercraftSchema"

// 1. 先头车 (紧凑高位流线斜切驾驶舱先头车)
export const harukaHeadSchema: PapercraftModelSchema = {
  version: "1.0",
  id: "haruka-head-car",
  name: "281系 Haruka (先头车)",
  category: "shinkansen",
  difficulty: "medium",
  recommendedAge: "5-10 岁",
  estimatedTime: "15-20 分钟",
  description: "关空特急 281 系先头车，紧凑高位驾驶室与流线斜风挡。",
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
        // 1. 车顶 (平顶长 146mm + 高位突起驾驶室穹顶 + 前倾凸出大风挡)
        {
          id: "roof",
          name: "车顶与高位突起斜风挡",
          slotName: "roof",
          vertices3D: [
            [-19, 44, -80],  // 0: 车顶后左
            [19, 44, -80],   // 1: 车顶后右
            [19, 46, 66],    // 2: 高位驾驶舱顶右 (微突起至 46mm)
            [19, 34, 82],    // 3: 驾驶舱风挡凸棱前下右 (向前突至 82mm)
            [-19, 34, 82],   // 4: 驾驶舱风挡凸棱前下左 (向前突至 82mm)
            [-19, 46, 66]    // 5: 高位驾驶舱顶左 (微突起至 46mm)
          ],
          vertices2D: [
            [86, 56],            // 0: 车顶后左
            [86 + 38, 56],       // 1: 车顶后右
            [86 + 38, 56 + 146], // 2: 高位驾驶舱顶右 (y = 202)
            [86 + 38, 56 + 165], // 3: 风挡凸棱前下右 (y = 221)
            [86, 56 + 165],      // 4: 风挡凸棱前下左 (y = 221)
            [86, 56 + 146]       // 5: 高位驾驶舱顶左 (y = 202)
          ],
          uvCoords: [
            [0, 1.0], [1, 1.0],
            [1, 0.09], [1, 0.0],
            [0, 0.0], [0, 0.09]
          ],
          indices: [
            0, 1, 2, 0, 2, 5, // 平顶
            5, 2, 3, 5, 3, 4  // 高位斜风挡
          ],
          creases: [
            // 后车顶折线
            { type: "mountain", p1: { x: 86, y: 56 }, p2: { x: 86 + 38, y: 56 } },
            // 平顶左右两侧山折线
            { type: "mountain", p1: { x: 86 + 38, y: 56 }, p2: { x: 86 + 38, y: 56 + 146 } },
            { type: "mountain", p1: { x: 86, y: 56 + 146 }, p2: { x: 86, y: 56 } },
            // 高位驾驶台额头山折线
            { type: "mountain", p1: { x: 86, y: 56 + 146 }, p2: { x: 86 + 38, y: 56 + 146 } },
            // 斜风挡两侧剪切实线
            { type: "cut", p1: { x: 86, y: 56 + 146 }, p2: { x: 86, y: 56 + 165 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 + 146 }, p2: { x: 86 + 38, y: 56 + 165 } },
            // 风挡凸棱与正面前脸相连的山折线 (自然下折成立面)
            { type: "mountain", p1: { x: 86, y: 56 + 165 }, p2: { x: 86 + 38, y: 56 + 165 } }
          ],
          tabs: [
            {
              id: "tab_roof_slope_l",
              label: "S1",
              edgeIndex: 4,
              p1: { x: 86, y: 56 + 146 },
              p2: { x: 86, y: 56 + 165 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_left"
            },
            {
              id: "tab_roof_slope_r",
              label: "S2",
              edgeIndex: 2,
              p1: { x: 86 + 38, y: 56 + 165 },
              p2: { x: 86 + 38, y: 56 + 146 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_right"
            }
          ]
        },
        // 2. 车头正面前立面 (高度 34mm，连结于高位风挡前端，Hello Kitty 徽标 + 双大灯，立体挑出)
        {
          id: "front",
          name: "特急前立面",
          slotName: "front",
          vertices3D: [
            [-19, 34, 82],
            [19, 34, 82],
            [19, 0, 80],
            [-19, 0, 80]
          ],
          vertices2D: [
            [86, 56 + 165],
            [86 + 38, 56 + 165],
            [86 + 38, 56 + 165 + 34],
            [86, 56 + 165 + 34]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: "cut", p1: { x: 86, y: 56 + 165 }, p2: { x: 86, y: 56 + 165 + 34 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 + 165 }, p2: { x: 86 + 38, y: 56 + 165 + 34 } },
            { type: "cut", p1: { x: 86, y: 56 + 165 + 34 }, p2: { x: 86 + 38, y: 56 + 165 + 34 } }
          ],
          tabs: [
            {
              id: "tab_front_l",
              label: "A1",
              edgeIndex: 3,
              p1: { x: 86, y: 56 + 165 },
              p2: { x: 86, y: 56 + 165 + 34 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_left"
            },
            {
              id: "tab_front_r",
              label: "B1",
              edgeIndex: 1,
              p1: { x: 86 + 38, y: 56 + 165 + 34 },
              p2: { x: 86 + 38, y: 56 + 165 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_right"
            },
            {
              id: "tab_front_bottom",
              label: "C1",
              edgeIndex: 2,
              p1: { x: 86, y: 56 + 165 + 34 },
              p2: { x: 86 + 38, y: 56 + 165 + 34 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "bottom"
            }
          ]
        },
        // 3. 左侧车身 (高位驾驶台斜切五边形车身)
        {
          id: "side_left",
          name: "左侧客车身",
          slotName: "side_left",
          vertices3D: [
            [-19, 44, -80],  // 0: 后上角
            [-19, 46, 66],   // 1: 高位座舱阶梯过渡点 (高度 46mm)
            [-19, 34, 82],   // 2: 风挡凸棱斜切点 (高度 34mm)
            [-19, 0, 80],    // 3: 前下角
            [-19, 0, -80]    // 4: 后下角
          ],
          vertices2D: [
            [86, 56],            // 0: 后上角 (与车顶相连)
            [86, 56 + 146],      // 1: 高位座舱阶梯过渡点 (与车顶相连)
            [86 - 12, 56 + 160], // 2: 风挡凸棱斜切点 (46 - 34 = 12)
            [86 - 44, 56 + 160], // 3: 前下底角
            [86 - 44, 56]        // 4: 后下底角
          ],
          uvCoords: [
            [1.0, 1.0],
            [0.08, 1.0],
            [0.0, 0.74],
            [0.0, 0.0],
            [1.0, 0.0]
          ],
          indices: [
            0, 1, 4,
            1, 3, 4,
            1, 2, 3
          ],
          creases: [
            { type: "cut", p1: { x: 86 - 44, y: 56 }, p2: { x: 86, y: 56 } },
            // 高位斜切顶边剪切实线 (承接 S1 粘合)
            { type: "cut", p1: { x: 86, y: 56 + 146 }, p2: { x: 86 - 12, y: 56 + 160 } },
            // 前端垂直边剪切实线 (承接 A1 粘合)
            { type: "cut", p1: { x: 86 - 12, y: 56 + 160 }, p2: { x: 86 - 44, y: 56 + 160 } }
          ],
          tabs: [
            {
              id: "tab_l_back",
              label: "A2",
              edgeIndex: 4,
              p1: { x: 86, y: 56 },
              p2: { x: 86 - 44, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "back"
            }
          ]
        },
        // 4. 右侧车身 (高位驾驶台斜切五边形车身)
        {
          id: "side_right",
          name: "右侧客车身",
          slotName: "side_right",
          vertices3D: [
            [19, 44, -80],  // 0: 后上角
            [19, 46, 66],   // 1: 高位座舱阶梯过渡点 (高度 46mm)
            [19, 34, 82],   // 2: 风挡凸棱斜切点 (高度 34mm)
            [19, 0, 80],    // 3: 前下角
            [19, 0, -80]    // 4: 后下角
          ],
          vertices2D: [
            [86 + 38, 56],            // 0: 后上角 (与车顶相连)
            [86 + 38, 56 + 146],      // 1: 高位座舱阶梯过渡点 (与车顶相连)
            [86 + 38 + 12, 56 + 160], // 2: 风挡凸棱斜切点
            [86 + 38 + 44, 56 + 160], // 3: 前下底角
            [86 + 38 + 44, 56]        // 4: 后下底角
          ],
          uvCoords: [
            [1.0, 1.0],
            [0.08, 1.0],
            [0.0, 0.74],
            [0.0, 0.0],
            [1.0, 0.0]
          ],
          indices: [
            0, 1, 4,
            1, 3, 4,
            1, 2, 3
          ],
          creases: [
            { type: "cut", p1: { x: 86 + 38, y: 56 }, p2: { x: 86 + 38 + 44, y: 56 } },
            // 斜切顶边剪切实线 (承接 S2 粘合)
            { type: "cut", p1: { x: 86 + 38, y: 56 + 146 }, p2: { x: 86 + 38 + 12, y: 56 + 160 } },
            // 前端垂直边 (承接 B1 粘合)
            { type: "cut", p1: { x: 86 + 38 + 12, y: 56 + 160 }, p2: { x: 86 + 38 + 44, y: 56 + 160 } }
          ],
          tabs: [
            {
              id: "tab_r_back",
              label: "B2",
              edgeIndex: 4,
              p1: { x: 86 + 38 + 44, y: 56 },
              p2: { x: 86 + 38, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "back"
            }
          ]
        },
        // 5. 车尾 (连接壁)
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
        // 6. 底盘底板 (Bottom - 100% 完整覆盖 160mm 全长)
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
      id: "ac_unit_haruka",
      name: "车顶冷气机组",
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
      layout2D: { x: 172, y: 68, width: 24, height: 36 }
    }
  ]
}

// 2. 中间客车 (标准平顶客车，无车头斜面，前后贯通门)
export const harukaMiddleSchema: PapercraftModelSchema = {
  version: "1.0",
  id: "haruka-middle-car",
  name: "281系 Haruka (中间客车)",
  category: "shinkansen",
  difficulty: "easy",
  recommendedAge: "5-10 岁",
  estimatedTime: "10-15 分钟",
  description: "关空特急 281 系中间客车，标准平顶车厢与观光大客窗。",
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
        // 2. 左侧车身 (标准矩形客车侧壁)
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
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
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
        // 3. 右侧车身 (标准矩形客车侧壁)
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
        // 4. 前端贯通连接门 (Front Connection Wall)
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
              p1: { x: 86, y: 56 + 160 + 44 },
              p2: { x: 86 + 38, y: 56 + 160 + 44 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "bottom"
            }
          ]
        },
        // 5. 后端贯通连接门 (Back Connection Wall)
        {
          id: "back",
          name: "后端贯通连接门",
          slotName: "back",
          vertices3D: [[19, 44, -80], [-19, 44, -80], [19, 0, -80], [-19, 0, -80]],
          vertices2D: [
            [86 + 38, 56],
            [86, 56],
            [86 + 38, 56 - 44],
            [86, 56 - 44]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
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
        // 6. 底盘 (Bottom)
        {
          id: "bottom",
          name: "底盘",
          slotName: "bottom",
          vertices3D: [[-19, 0, 80], [-19, 0, -80], [19, 0, 80], [19, 0, -80]],
          vertices2D: [
            [86 - 44 - 38, 56 + 160],
            [86 - 44 - 38, 56],
            [86 - 44, 56 + 160],
            [86 - 44, 56]
          ],
          uvCoords: [[0, 0], [0, 1], [1, 0], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: "cut", p1: { x: 86 - 44 - 38, y: 56 }, p2: { x: 86 - 44, y: 56 } },
            { type: "cut", p1: { x: 86 - 44 - 38, y: 56 + 160 }, p2: { x: 86 - 44, y: 56 + 160 } },
            { type: "cut", p1: { x: 86 - 44 - 38, y: 56 }, p2: { x: 86 - 44 - 38, y: 56 + 160 } }
          ],
          tabs: [
            {
              id: "tab_bottom_r",
              label: "D1",
              edgeIndex: 0,
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
      id: "ac_unit_haruka_mid",
      name: "车顶冷气机组",
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
      layout2D: { x: 172, y: 30, width: 24, height: 36 }
    }
  ]
}

// 3. 尾车 (带有紧凑流线车头)
// 3. 尾车 (带有紧凑流线车头)
export const harukaTailSchema: PapercraftModelSchema = {
  ...harukaHeadSchema,
  id: "haruka-tail-car",
  name: "281系 Haruka (尾车)"
}

export const harukaTrainConsist: TrainModelConsist = {
  id: "haruka-kitty-consist",
  name: "JR 281系 Haruka",
  nameEn: "JR 281 Series Haruka",
  category: "shinkansen",
  difficulty: "medium",
  recommendedAge: "5-10 岁",
  estimatedTimePerCar: "15-20 分钟",
  description: "穿梭于关西空港与京都的关空特急，高位流线驾驶室与典雅纯白车身。",
  descriptionEn: "Kansai Airport Express connecting Kansai Airport and Kyoto with elevated cab design.",
  defaultThemeId: "haruka-hellokitty",
  carDefinitions: {
    head: {
      type: "head",
      name: "1号车 (先头车)",
      description: "281系 先头驾驶车",
      schema: harukaHeadSchema
    },
    middle: {
      type: "middle",
      name: "2号车 (客车)",
      description: "281系 中间客车",
      schema: harukaMiddleSchema
    },
    tail: {
      type: "tail",
      name: "3号车 (尾车)",
      description: "281系 尾部驾驶车",
      schema: harukaTailSchema
    }
  }
};
