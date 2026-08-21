// 新干线 300系 / 经典子弹头系列 (铁胆火车侠白银希望号/阳光队长经典微流线车模)
import { TrainModelConsist } from '../consistSchema'
import { PapercraftModelSchema } from '../papercraftSchema'

// 1. 300系 先头车 (梯形硬朗微流线车头，经典折角破风线)
export const shinkansen300HeadSchema: PapercraftModelSchema = {
  version: "1.0",
  id: "shinkansen300-head-car",
  name: "新干线 300系 (先头车)",
  category: "shinkansen",
  difficulty: "medium",
  recommendedAge: "6-12 岁",
  estimatedTime: "15-20 分钟",
  description: "新干线 300系 / 铁胆火车侠白银希望号经典梯形斜面微流线车头。",
  dimensions: {
    length: 160,
    width: 38,
    height: 42
  },
  parts: [
    {
      id: "shinkansen300-head-body",
      name: "车身主体展开",
      faces: [
        // 1. 车顶与风挡坡面 (Roof & Windshield Slope)
        {
          id: "roof",
          name: "车顶与风挡坡面",
          slotName: "roof",
          vertices3D: [
            [-19, 42, -75], // 0: 后左顶角
            [19, 42, -75],  // 1: 后右顶角
            [19, 42, 45],   // 2: 驾驶舱额头右折点
            [17, 24, 75],   // 3: 梯形鼻尖右折点
            [-17, 24, 75],  // 4: 梯形鼻尖左折点
            [-19, 42, 45]   // 5: 驾驶舱额头左折点
          ],
          vertices2D: [
            [86, 56],
            [86 + 38, 56],
            [86 + 38, 56 + 120],
            [86 + 36, 56 + 155],
            [86 + 2, 56 + 155],
            [86, 56 + 120]
          ],
          uvCoords: [
            [0, 1], [1, 1], [1, 0.25], [0.9, 0.0], [0.1, 0.0], [0, 0.25]
          ],
          indices: [
            0, 1, 2, 0, 2, 5,
            5, 2, 3, 5, 3, 4
          ],
          creases: [
            { type: "mountain", p1: { x: 86, y: 56 }, p2: { x: 86 + 38, y: 56 } },
            { type: "mountain", p1: { x: 86 + 38, y: 56 }, p2: { x: 86 + 38, y: 56 + 120 } },
            { type: "mountain", p1: { x: 86, y: 56 + 120 }, p2: { x: 86, y: 56 } },
            { type: "mountain", p1: { x: 86, y: 56 + 120 }, p2: { x: 86 + 38, y: 56 + 120 } },
            { type: "cut", p1: { x: 86, y: 56 + 120 }, p2: { x: 86 + 2, y: 56 + 155 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 + 120 }, p2: { x: 86 + 36, y: 56 + 155 } },
            { type: "mountain", p1: { x: 86 + 2, y: 56 + 155 }, p2: { x: 86 + 36, y: 56 + 155 } }
          ],
          tabs: [
            {
              id: "tab_roof_slope_l",
              label: "S1",
              edgeIndex: 4,
              p1: { x: 86, y: 56 + 120 },
              p2: { x: 86 + 2, y: 56 + 155 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_left"
            },
            {
              id: "tab_roof_slope_r",
              label: "S2",
              edgeIndex: 2,
              p1: { x: 86 + 36, y: 56 + 155 },
              p2: { x: 86 + 38, y: 56 + 120 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_right"
            }
          ]
        },
        // 2. 车头正面前鼻立面 (梯形鼻锥立面，前照大灯与下裙铲)
        {
          id: "front",
          name: "梯形前鼻锥",
          slotName: "front",
          vertices3D: [
            [-17, 24, 75],
            [17, 24, 75],
            [18, 0, 78],
            [-18, 0, 78]
          ],
          vertices2D: [
            [86 + 2, 56 + 155],
            [86 + 36, 56 + 155],
            [86 + 37, 56 + 155 + 26],
            [86 + 1, 56 + 155 + 26]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: "cut", p1: { x: 86 + 2, y: 56 + 155 }, p2: { x: 86 + 1, y: 56 + 155 + 26 } },
            { type: "cut", p1: { x: 86 + 36, y: 56 + 155 }, p2: { x: 86 + 37, y: 56 + 155 + 26 } },
            { type: "cut", p1: { x: 86 + 1, y: 56 + 155 + 26 }, p2: { x: 86 + 37, y: 56 + 155 + 26 } }
          ],
          tabs: [
            {
              id: "tab_front_l",
              label: "A1",
              edgeIndex: 3,
              p1: { x: 86 + 2, y: 56 + 155 },
              p2: { x: 86 + 1, y: 56 + 155 + 26 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_left"
            },
            {
              id: "tab_front_r",
              label: "B1",
              edgeIndex: 1,
              p1: { x: 86 + 37, y: 56 + 155 + 26 },
              p2: { x: 86 + 36, y: 56 + 155 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_right"
            },
            {
              id: "tab_front_bottom",
              label: "C1",
              edgeIndex: 2,
              p1: { x: 86 + 1, y: 56 + 155 + 26 },
              p2: { x: 86 + 37, y: 56 + 155 + 26 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "bottom"
            }
          ]
        },
        // 3. 左侧车身
        {
          id: "side_left",
          name: "左侧客车身",
          slotName: "side_left",
          vertices3D: [
            [-19, 42, -75],
            [-19, 42, 45],
            [-17, 24, 75],
            [-18, 0, 78],
            [-19, 0, -75]
          ],
          vertices2D: [
            [86, 56],
            [86, 56 + 120],
            [86 - 18, 56 + 150],
            [86 - 42, 56 + 160],
            [86 - 42, 56]
          ],
          uvCoords: [
            [1.0, 1.0],
            [0.18, 1.0],
            [0.04, 0.58],
            [0.0, 0.0],
            [1.0, 0.0]
          ],
          indices: [
            0, 1, 4,
            1, 3, 4,
            1, 2, 3
          ],
          creases: [
            { type: "cut", p1: { x: 86 - 42, y: 56 }, p2: { x: 86, y: 56 } },
            { type: "cut", p1: { x: 86, y: 56 + 120 }, p2: { x: 86 - 18, y: 56 + 150 } },
            { type: "cut", p1: { x: 86 - 18, y: 56 + 150 }, p2: { x: 86 - 42, y: 56 + 160 } }
          ],
          tabs: [
            {
              id: "tab_l_back",
              label: "A2",
              edgeIndex: 4,
              p1: { x: 86, y: 56 },
              p2: { x: 86 - 42, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "back"
            }
          ]
        },
        // 4. 右侧车身
        {
          id: "side_right",
          name: "右侧客车身",
          slotName: "side_right",
          vertices3D: [
            [19, 42, -75],
            [19, 42, 45],
            [17, 24, 75],
            [18, 0, 78],
            [19, 0, -75]
          ],
          vertices2D: [
            [86 + 38, 56],
            [86 + 38, 56 + 120],
            [86 + 38 + 18, 56 + 150],
            [86 + 38 + 42, 56 + 160],
            [86 + 38 + 42, 56]
          ],
          uvCoords: [
            [1.0, 1.0],
            [0.18, 1.0],
            [0.04, 0.58],
            [0.0, 0.0],
            [1.0, 0.0]
          ],
          indices: [
            0, 1, 4,
            1, 3, 4,
            1, 2, 3
          ],
          creases: [
            { type: "cut", p1: { x: 86 + 38, y: 56 }, p2: { x: 86 + 38 + 42, y: 56 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 + 120 }, p2: { x: 86 + 38 + 18, y: 56 + 150 } },
            { type: "cut", p1: { x: 86 + 38 + 18, y: 56 + 150 }, p2: { x: 86 + 38 + 42, y: 56 + 160 } }
          ],
          tabs: [
            {
              id: "tab_r_back",
              label: "B2",
              edgeIndex: 4,
              p1: { x: 86 + 38 + 42, y: 56 },
              p2: { x: 86 + 38, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "back"
            }
          ]
        },
        // 5. 车尾连接壁
        {
          id: "back",
          name: "车尾连接壁",
          slotName: "back",
          vertices3D: [
            [-19, 42, -75],
            [19, 42, -75],
            [19, 0, -75],
            [-19, 0, -75]
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
            { type: "cut", p1: { x: 86, y: 56 - 42 }, p2: { x: 86, y: 56 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 - 42 }, p2: { x: 86 + 38, y: 56 } }
          ],
          tabs: [
            {
              id: "tab_back_bottom",
              label: "C2",
              edgeIndex: 2,
              p1: { x: 86 + 38, y: 56 - 42 },
              p2: { x: 86, y: 56 - 42 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "bottom"
            }
          ]
        },
        // 6. 底盘
        {
          id: "bottom",
          name: "底盘",
          slotName: "bottom",
          vertices3D: [[-19, 0, -75], [-19, 0, 78], [19, 0, 78], [19, 0, -75]],
          vertices2D: [
            [86 - 42, 56],
            [86 - 42, 56 + 160],
            [86 - 42 - 38, 56 + 160],
            [86 - 42 - 38, 56]
          ],
          uvCoords: [[0, 1], [0, 0], [1, 0], [1, 1]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: "cut", p1: { x: 86 - 42 - 38, y: 56 }, p2: { x: 86 - 42, y: 56 } },
            { type: "cut", p1: { x: 86 - 42 - 38, y: 56 + 160 }, p2: { x: 86 - 42, y: 56 + 160 } },
            { type: "cut", p1: { x: 86 - 42 - 38, y: 56 }, p2: { x: 86 - 42 - 38, y: 56 + 160 } }
          ],
          tabs: [
            {
              id: "tab_bottom_r",
              label: "D1",
              edgeIndex: 2,
              p1: { x: 86 - 42 - 38, y: 56 },
              p2: { x: 86 - 42 - 38, y: 56 + 160 },
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
      id: "ac_unit_300",
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
      position3D: [0, 44.5, -15],
      layout2D: { x: 172, y: 68, width: 24, height: 36 }
    }
  ]
}

// 2. 300系 中间客车
export const shinkansen300MiddleSchema: PapercraftModelSchema = {
  version: "1.0",
  id: "shinkansen300-middle-car",
  name: "新干线 300系 (客车)",
  category: "shinkansen",
  difficulty: "easy",
  recommendedAge: "5-10 岁",
  estimatedTime: "10-15 分钟",
  description: "新干线 300系 中间客车 (带车顶单臂受电弓与冷气罩)。",
  dimensions: {
    length: 160,
    width: 38,
    height: 42
  },
  parts: [
    {
      id: "shinkansen300-middle-body",
      name: "客车车身主体展开",
      faces: [
        // 1. 车顶
        {
          id: "roof",
          name: "车顶",
          slotName: "roof",
          vertices3D: [[-19, 42, 80], [19, 42, 80], [-19, 42, -80], [19, 42, -80]],
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
        // 2. 左侧车身 (统一 UV：u=0 前端底部，u=1 后端顶部)
        {
          id: "side_left",
          name: "左侧客车身",
          slotName: "side_left",
          vertices3D: [[-19, 42, 80], [-19, 42, -80], [-19, 0, 80], [-19, 0, -80]],
          vertices2D: [
            [86, 56 + 160],
            [86, 56],
            [86 - 42, 56 + 160],
            [86 - 42, 56]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: "cut", p1: { x: 86 - 42, y: 56 }, p2: { x: 86, y: 56 } },
            { type: "cut", p1: { x: 86 - 42, y: 56 + 160 }, p2: { x: 86, y: 56 + 160 } }
          ],
          tabs: [
            {
              id: "tab_l_front",
              label: "A1",
              edgeIndex: 2,
              p1: { x: 86 - 42, y: 56 + 160 },
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
              p2: { x: 86 - 42, y: 56 },
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
          vertices3D: [[19, 42, -80], [19, 42, 80], [19, 0, -80], [19, 0, 80]],
          vertices2D: [
            [86 + 38, 56],
            [86 + 38, 56 + 160],
            [86 + 38 + 42, 56],
            [86 + 38 + 42, 56 + 160]
          ],
          uvCoords: [[1, 1], [0, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: "cut", p1: { x: 86 + 38, y: 56 }, p2: { x: 86 + 38 + 42, y: 56 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 + 160 }, p2: { x: 86 + 38 + 42, y: 56 + 160 } }
          ],
          tabs: [
            {
              id: "tab_r_front",
              label: "B1",
              edgeIndex: 2,
              p1: { x: 86 + 38, y: 56 + 160 },
              p2: { x: 86 + 38 + 42, y: 56 + 160 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "front"
            },
            {
              id: "tab_r_back",
              label: "B2",
              edgeIndex: 0,
              p1: { x: 86 + 38 + 42, y: 56 },
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
          vertices3D: [[-19, 42, 80], [19, 42, 80], [-19, 0, 80], [19, 0, 80]],
          vertices2D: [
            [86, 56 + 160],
            [86 + 38, 56 + 160],
            [86, 56 + 160 + 42],
            [86 + 38, 56 + 160 + 42]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: "cut", p1: { x: 86, y: 56 + 160 }, p2: { x: 86, y: 56 + 160 + 42 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 + 160 }, p2: { x: 86 + 38, y: 56 + 160 + 42 } },
            { type: "cut", p1: { x: 86, y: 56 + 160 + 42 }, p2: { x: 86 + 38, y: 56 + 160 + 42 } }
          ],
          tabs: [
            {
              id: "tab_front_bottom",
              label: "C1",
              edgeIndex: 2,
              p1: { x: 86, y: 56 + 160 + 42 },
              p2: { x: 86 + 38, y: 56 + 160 + 42 },
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
          vertices3D: [[19, 42, -80], [-19, 42, -80], [19, 0, -80], [-19, 0, -80]],
          vertices2D: [
            [86 + 38, 56],
            [86, 56],
            [86 + 38, 56 - 42],
            [86, 56 - 42]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: "cut", p1: { x: 86, y: 56 - 42 }, p2: { x: 86 + 38, y: 56 - 42 } },
            { type: "cut", p1: { x: 86, y: 56 - 42 }, p2: { x: 86, y: 56 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 - 42 }, p2: { x: 86 + 38, y: 56 } }
          ],
          tabs: [
            {
              id: "tab_back_bottom",
              label: "C2",
              edgeIndex: 2,
              p1: { x: 86 + 38, y: 56 - 42 },
              p2: { x: 86, y: 56 - 42 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "bottom"
            }
          ]
        },
        // 6. 底盘
        {
          id: "bottom",
          name: "底盘",
          slotName: "bottom",
          vertices3D: [[-19, 0, 80], [-19, 0, -80], [19, 0, 80], [19, 0, -80]],
          vertices2D: [
            [86 - 42 - 38, 56 + 160],
            [86 - 42 - 38, 56],
            [86 - 42, 56 + 160],
            [86 - 42, 56]
          ],
          uvCoords: [[0, 0], [0, 1], [1, 0], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: "cut", p1: { x: 86 - 42 - 38, y: 56 }, p2: { x: 86 - 42, y: 56 } },
            { type: "cut", p1: { x: 86 - 42 - 38, y: 56 + 160 }, p2: { x: 86 - 42, y: 56 + 160 } },
            { type: "cut", p1: { x: 86 - 42 - 38, y: 56 }, p2: { x: 86 - 42 - 38, y: 56 + 160 } }
          ],
          tabs: [
            {
              id: "tab_bottom_r",
              label: "D1",
              edgeIndex: 0,
              p1: { x: 86 - 42 - 38, y: 56 },
              p2: { x: 86 - 42 - 38, y: 56 + 160 },
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
      id: "ac_unit_300_mid",
      name: "车顶冷气与受电弓组",
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
      position3D: [0, 44.5, 0],
      layout2D: { x: 172, y: 30, width: 24, height: 36 }
    }
  ]
}

// 3. 300系 尾车
export const shinkansen300TailSchema: PapercraftModelSchema = {
  ...shinkansen300HeadSchema,
  id: "shinkansen300-tail-car",
  name: "新干线 300系 (尾车)"
}

export const shinkansen300TrainConsist: TrainModelConsist = {
  id: "shinkansen300-hikarian-consist",
  name: "新干线 300系 (白银希望号)",
  category: "shinkansen",
  difficulty: "medium",
  recommendedAge: "6-12 岁",
  estimatedTimePerCar: "15-20 分钟",
  description: "东海道新干线 300系，《铁胆火车侠》白银希望号与0系经典子弹头微流线车模。",
  defaultThemeId: "shinkansen-300-nozomi",
  carDefinitions: {
    head: {
      type: "head",
      name: "1号车 (先头车)",
      description: "300系 经典梯形流线先头驾驶车",
      schema: shinkansen300HeadSchema
    },
    middle: {
      type: "middle",
      name: "2号车 (客车)",
      description: "300系 中间客车 (带冷气机组)",
      schema: shinkansen300MiddleSchema
    },
    tail: {
      type: "tail",
      name: "3号车 (尾车)",
      description: "300系 尾部驾驶车",
      schema: shinkansen300TailSchema
    }
  }
}
