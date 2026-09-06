// 中国标准高速动车组 CR400 复兴号 / CRH 和谐号 完整编组模型定义
import { TrainModelConsist } from '../consistSchema'
import { PapercraftModelSchema } from '../papercraftSchema'

// 1. CR400 先头车 (双段超长飞梭流线型低阻力车头，凤眼大灯与流线型破风鼻)
export const cr400HeadSchema: PapercraftModelSchema = {
  version: "1.0",
  id: "cr400-head-car",
  name: "CR400 (先头车)",
  category: "shinkansen",
  difficulty: "medium",
  recommendedAge: "7-14 岁",
  estimatedTime: "15-20 分钟",
  description: "中国标准动车组先头车，双段超长飞梭形低风阻流线车头与全景客舱。",
  dimensions: {
    length: 180,
    width: 38,
    height: 42
  },
  parts: [
    {
      id: "cr400-head-body",
      name: "车身主体展开",
      faces: [
        // 1. 车顶与双段飞梭风挡/长前鼻 (8 顶点超流线大坡面)
        {
          id: "roof",
          name: "车顶与双段飞梭长鼻",
          slotName: "roof",
          vertices3D: [
            [-19, 42, -90], // 0: 后左顶角
            [19, 42, -90],  // 1: 后右顶角
            [19, 42, 30],   // 2: 驾驶舱额头右折点
            [15, 26, 62],   // 3: 风挡与飞梭长鼻右交界
            [9, 12, 90],    // 4: 飞梭鼻尖右前点
            [-9, 12, 90],   // 5: 飞梭鼻尖左前点
            [-15, 26, 62],  // 6: 风挡与飞梭长鼻左交界
            [-19, 42, 30]   // 7: 驾驶舱额头左折点
          ],
          vertices2D: [
            [86, 56],
            [86 + 38, 56],
            [86 + 38, 56 + 120],
            [86 + 34, 56 + 152],
            [86 + 28, 56 + 180],
            [86 + 10, 56 + 180],
            [86 + 4, 56 + 152],
            [86, 56 + 120]
          ],
          uvCoords: [
            [0, 1], [1, 1], [1, 0.33], [0.89, 0.15], [0.73, 0.0], [0.27, 0.0], [0.11, 0.15], [0, 0.33]
          ],
          indices: [
            0, 1, 2, 0, 2, 7, // 平顶段
            7, 2, 3, 7, 3, 6, // 风挡斜坡段
            6, 3, 4, 6, 4, 5  // 飞梭长鼻锥段
          ],
          creases: [
            { type: "mountain", p1: { x: 86, y: 56 }, p2: { x: 86 + 38, y: 56 } },
            { type: "mountain", p1: { x: 86 + 38, y: 56 }, p2: { x: 86 + 38, y: 56 + 120 } },
            { type: "mountain", p1: { x: 86, y: 56 + 120 }, p2: { x: 86, y: 56 } },
            { type: "mountain", p1: { x: 86, y: 56 + 120 }, p2: { x: 86 + 38, y: 56 + 120 } },
            { type: "mountain", p1: { x: 86 + 4, y: 56 + 152 }, p2: { x: 86 + 34, y: 56 + 152 } },
            { type: "mountain", p1: { x: 86 + 10, y: 56 + 180 }, p2: { x: 86 + 28, y: 56 + 180 } },
            { type: "cut", p1: { x: 86, y: 56 + 120 }, p2: { x: 86 + 4, y: 56 + 152 } },
            { type: "cut", p1: { x: 86 + 4, y: 56 + 152 }, p2: { x: 86 + 10, y: 56 + 180 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 + 120 }, p2: { x: 86 + 34, y: 56 + 152 } },
            { type: "cut", p1: { x: 86 + 34, y: 56 + 152 }, p2: { x: 86 + 28, y: 56 + 180 } }
          ],
          tabs: [
            {
              id: "tab_roof_slope_l1",
              label: "S1",
              edgeIndex: 6,
              p1: { x: 86, y: 56 + 120 },
              p2: { x: 86 + 4, y: 56 + 152 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_left"
            },
            {
              id: "tab_roof_slope_l2",
              label: "S2",
              edgeIndex: 5,
              p1: { x: 86 + 4, y: 56 + 152 },
              p2: { x: 86 + 10, y: 56 + 180 },
              tabWidth: 5,
              angle: 45,
              targetFaceId: "side_left"
            },
            {
              id: "tab_roof_slope_r1",
              label: "S3",
              edgeIndex: 2,
              p1: { x: 86 + 38, y: 56 + 120 },
              p2: { x: 86 + 34, y: 56 + 152 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_right"
            },
            {
              id: "tab_roof_slope_r2",
              label: "S4",
              edgeIndex: 3,
              p1: { x: 86 + 34, y: 56 + 152 },
              p2: { x: 86 + 28, y: 56 + 180 },
              tabWidth: 5,
              angle: 45,
              targetFaceId: "side_right"
            }
          ]
        },
        // 2. 车头正面前鼻立面 (飞梭低阻力下唇铲)
        {
          id: "front",
          name: "飞梭前鼻锥",
          slotName: "front",
          vertices3D: [
            [-9, 12, 90],
            [9, 12, 90],
            [10, 0, 92],
            [-10, 0, 92]
          ],
          vertices2D: [
            [86 + 10, 56 + 180],
            [86 + 28, 56 + 180],
            [86 + 29, 56 + 180 + 14],
            [86 + 9, 56 + 180 + 14]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: "cut", p1: { x: 86 + 10, y: 56 + 180 }, p2: { x: 86 + 9, y: 56 + 180 + 14 } },
            { type: "cut", p1: { x: 86 + 28, y: 56 + 180 }, p2: { x: 86 + 29, y: 56 + 180 + 14 } },
            { type: "cut", p1: { x: 86 + 9, y: 56 + 180 + 14 }, p2: { x: 86 + 29, y: 56 + 180 + 14 } }
          ],
          tabs: [
            {
              id: "tab_front_l",
              label: "A1",
              edgeIndex: 3,
              p1: { x: 86 + 10, y: 56 + 180 },
              p2: { x: 86 + 9, y: 56 + 180 + 14 },
              tabWidth: 5,
              angle: 45,
              targetFaceId: "side_left"
            },
            {
              id: "tab_front_r",
              label: "B1",
              edgeIndex: 1,
              p1: { x: 86 + 29, y: 56 + 180 + 14 },
              p2: { x: 86 + 28, y: 56 + 180 },
              tabWidth: 5,
              angle: 45,
              targetFaceId: "side_right"
            },
            {
              id: "tab_front_bottom",
              label: "C1",
              edgeIndex: 2,
              p1: { x: 86 + 9, y: 56 + 180 + 14 },
              p2: { x: 86 + 29, y: 56 + 180 + 14 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "bottom"
            }
          ]
        },
        // 3. 左侧车身 (双段流线飞梭长车侧)
        {
          id: "side_left",
          name: "左侧动车身",
          slotName: "side_left",
          vertices3D: [
            [-19, 42, -90], // 0: 后上角
            [-19, 42, 30],  // 1: 驾驶室额头折点
            [-15, 26, 62],  // 2: 风挡与长鼻交界
            [-9, 12, 90],   // 3: 鼻尖前上角
            [-10, 0, 92],   // 4: 鼻尖前下角
            [-19, 0, -90]   // 5: 后下底角
          ],
          vertices2D: [
            [86, 56],
            [86, 56 + 120],
            [86 - 16, 56 + 152],
            [86 - 30, 56 + 180],
            [86 - 42, 56 + 182],
            [86 - 42, 56]
          ],
          uvCoords: [
            [1.0, 1.0],
            [0.33, 1.0],
            [0.15, 0.62],
            [0.01, 0.28],
            [0.0, 0.0],
            [1.0, 0.0]
          ],
          indices: [
            0, 1, 5,
            1, 4, 5,
            1, 2, 4,
            2, 3, 4
          ],
          creases: [
            { type: "cut", p1: { x: 86 - 42, y: 56 }, p2: { x: 86, y: 56 } },
            { type: "cut", p1: { x: 86, y: 56 + 120 }, p2: { x: 86 - 16, y: 56 + 152 } },
            { type: "cut", p1: { x: 86 - 16, y: 56 + 152 }, p2: { x: 86 - 30, y: 56 + 180 } },
            { type: "cut", p1: { x: 86 - 30, y: 56 + 180 }, p2: { x: 86 - 42, y: 56 + 182 } }
          ],
          tabs: [
            {
              id: "tab_l_back",
              label: "A2",
              edgeIndex: 5,
              p1: { x: 86, y: 56 },
              p2: { x: 86 - 42, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "back"
            }
          ]
        },
        // 4. 右侧车身 (双段流线飞梭长车侧)
        {
          id: "side_right",
          name: "右侧动车身",
          slotName: "side_right",
          vertices3D: [
            [19, 42, -90],
            [19, 42, 30],
            [15, 26, 62],
            [9, 12, 90],
            [10, 0, 92],
            [19, 0, -90]
          ],
          vertices2D: [
            [86 + 38, 56],
            [86 + 38, 56 + 120],
            [86 + 38 + 16, 56 + 152],
            [86 + 38 + 30, 56 + 180],
            [86 + 38 + 42, 56 + 182],
            [86 + 38 + 42, 56]
          ],
          uvCoords: [
            [1.0, 1.0],
            [0.33, 1.0],
            [0.15, 0.62],
            [0.01, 0.28],
            [0.0, 0.0],
            [1.0, 0.0]
          ],
          indices: [
            0, 1, 5,
            1, 4, 5,
            1, 2, 4,
            2, 3, 4
          ],
          creases: [
            { type: "cut", p1: { x: 86 + 38, y: 56 }, p2: { x: 86 + 38 + 42, y: 56 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 + 120 }, p2: { x: 86 + 38 + 16, y: 56 + 152 } },
            { type: "cut", p1: { x: 86 + 38 + 16, y: 56 + 152 }, p2: { x: 86 + 38 + 30, y: 56 + 180 } },
            { type: "cut", p1: { x: 86 + 38 + 30, y: 56 + 180 }, p2: { x: 86 + 38 + 42, y: 56 + 182 } }
          ],
          tabs: [
            {
              id: "tab_r_back",
              label: "B2",
              edgeIndex: 5,
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
            [-19, 42, -90],
            [19, 42, -90],
            [19, 0, -90],
            [-19, 0, -90]
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
          vertices3D: [[-19, 0, -90], [-10, 0, 92], [10, 0, 92], [19, 0, -90]],
          vertices2D: [
            [86 - 42, 56],
            [86 - 42, 56 + 182],
            [86 - 42 - 38, 56 + 182],
            [86 - 42 - 38, 56]
          ],
          uvCoords: [[0, 1], [0, 0], [1, 0], [1, 1]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: "cut", p1: { x: 86 - 42 - 38, y: 56 }, p2: { x: 86 - 42, y: 56 } },
            { type: "cut", p1: { x: 86 - 42 - 38, y: 56 + 182 }, p2: { x: 86 - 42, y: 56 + 182 } },
            { type: "cut", p1: { x: 86 - 42 - 38, y: 56 }, p2: { x: 86 - 42 - 38, y: 56 + 182 } }
          ],
          tabs: [
            {
              id: "tab_bottom_r",
              label: "D1",
              edgeIndex: 2,
              p1: { x: 86 - 42 - 38, y: 56 + 182 },
              p2: { x: 86 - 42 - 38, y: 56 },
              tabWidth: 7,
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
      id: "ac_unit_cr400",
      name: "车顶流线导流罩",
      slotName: "ac_unit",
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
      position3D: [0, 44.5, -20],
      layout2D: { x: 172, y: 68, width: 20, height: 36 }
    }
  ]
}

// 2. CR400 中间客车 (带车顶气动受电弓导流罩)
export const cr400MiddleSchema: PapercraftModelSchema = {
  version: "1.0",
  id: "cr400-middle-car",
  name: "CR400 (客车)",
  category: "shinkansen",
  difficulty: "easy",
  recommendedAge: "5-10 岁",
  estimatedTime: "10-15 分钟",
  description: "中国标准动车组中间客车，低阻力车身与全景双层客窗。",
  dimensions: {
    length: 165,
    width: 38,
    height: 42
  },
  parts: [
    {
      id: "cr400-middle-body",
      name: "客车车身主体展开",
      faces: [
        // 1. 车顶
        {
          id: "roof",
          name: "流线平直车顶",
          slotName: "roof",
          vertices3D: [[-19, 42, 82.5], [19, 42, 82.5], [-19, 42, -82.5], [19, 42, -82.5]],
          vertices2D: [
            [86, 56 + 165],
            [86 + 38, 56 + 165],
            [86, 56],
            [86 + 38, 56]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: "mountain", p1: { x: 86, y: 56 }, p2: { x: 86 + 38, y: 56 } },
            { type: "mountain", p1: { x: 86 + 38, y: 56 }, p2: { x: 86 + 38, y: 56 + 165 } },
            { type: "mountain", p1: { x: 86 + 38, y: 56 + 165 }, p2: { x: 86, y: 56 + 165 } },
            { type: "mountain", p1: { x: 86, y: 56 + 165 }, p2: { x: 86, y: 56 } }
          ]
        },
        // 2. 左侧车身 (统一 UV：u=0 前端底部，u=1 后端顶部)
        {
          id: "side_left",
          name: "左侧客车身",
          slotName: "side_left",
          vertices3D: [[-19, 42, 82.5], [-19, 42, -82.5], [-19, 0, 82.5], [-19, 0, -82.5]],
          vertices2D: [
            [86, 56 + 165],
            [86, 56],
            [86 - 42, 56 + 165],
            [86 - 42, 56]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: "cut", p1: { x: 86 - 42, y: 56 }, p2: { x: 86, y: 56 } },
            { type: "cut", p1: { x: 86 - 42, y: 56 + 165 }, p2: { x: 86, y: 56 + 165 } }
          ],
          tabs: [
            {
              id: "tab_l_front",
              label: "A1",
              edgeIndex: 2,
              p1: { x: 86 - 42, y: 56 + 165 },
              p2: { x: 86, y: 56 + 165 },
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
          vertices3D: [[19, 42, -82.5], [19, 42, 82.5], [19, 0, -82.5], [19, 0, 82.5]],
          vertices2D: [
            [86 + 38, 56],
            [86 + 38, 56 + 165],
            [86 + 38 + 42, 56],
            [86 + 38 + 42, 56 + 165]
          ],
          uvCoords: [[1, 1], [0, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: "cut", p1: { x: 86 + 38, y: 56 }, p2: { x: 86 + 38 + 42, y: 56 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 + 165 }, p2: { x: 86 + 38 + 42, y: 56 + 165 } }
          ],
          tabs: [
            {
              id: "tab_r_front",
              label: "B1",
              edgeIndex: 2,
              p1: { x: 86 + 38, y: 56 + 165 },
              p2: { x: 86 + 38 + 42, y: 56 + 165 },
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
          vertices3D: [[-19, 42, 82.5], [19, 42, 82.5], [-19, 0, 82.5], [19, 0, 82.5]],
          vertices2D: [
            [86, 56 + 165],
            [86 + 38, 56 + 165],
            [86, 56 + 165 + 42],
            [86 + 38, 56 + 165 + 42]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: "cut", p1: { x: 86, y: 56 + 165 }, p2: { x: 86, y: 56 + 165 + 42 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 + 165 }, p2: { x: 86 + 38, y: 56 + 165 + 42 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 + 165 + 42 }, p2: { x: 86, y: 56 + 165 + 42 } }
          ],
          tabs: [
            {
              id: "tab_front_bottom",
              label: "C1",
              edgeIndex: 2,
              p1: { x: 86, y: 56 + 165 + 42 },
              p2: { x: 86 + 38, y: 56 + 165 + 42 },
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
          vertices3D: [[19, 42, -82.5], [-19, 42, -82.5], [19, 0, -82.5], [-19, 0, -82.5]],
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
          vertices3D: [[-19, 0, 82.5], [-19, 0, -82.5], [19, 0, 82.5], [19, 0, -82.5]],
          vertices2D: [
            [86 - 42 - 38, 56 + 165],
            [86 - 42 - 38, 56],
            [86 - 42, 56 + 165],
            [86 - 42, 56]
          ],
          uvCoords: [[0, 0], [0, 1], [1, 0], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: "cut", p1: { x: 86 - 42 - 38, y: 56 }, p2: { x: 86 - 42, y: 56 } },
            { type: "cut", p1: { x: 86 - 42 - 38, y: 56 + 165 }, p2: { x: 86 - 42, y: 56 + 165 } },
            { type: "cut", p1: { x: 86 - 42 - 38, y: 56 }, p2: { x: 86 - 42 - 38, y: 56 + 165 } }
          ],
          tabs: [
            {
              id: "tab_bottom_r",
              label: "D1",
              edgeIndex: 0,
              p1: { x: 86 - 42 - 38, y: 56 },
              p2: { x: 86 - 42 - 38, y: 56 + 165 },
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
      id: "ac_unit_cr400_mid",
      name: "气动受电弓导流罩",
      slotName: "ac_unit",
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
      layout2D: { x: 172, y: 30, width: 20, height: 36 }
    }
  ]
}

// 3. CR400 尾车
export const cr400TailSchema: PapercraftModelSchema = {
  ...cr400HeadSchema,
  id: "cr400-tail-car",
  name: "CR400 (尾车)"
}

export const cr400TrainConsist: TrainModelConsist = {
  id: "cr400-fuxing-consist",
  name: "中国高铁 复兴号 / 和谐号",
  nameEn: "China High-Speed CR400 / CRH",
  category: "shinkansen",
  difficulty: "medium",
  recommendedAge: "7-14 岁",
  estimatedTimePerCar: "15-20 分钟",
  description: "中国标准动车组 CR400 复兴号 (红神龙/金凤凰) 与 CRH 和谐号高速列车编组。",
  descriptionEn: "China standard bullet train CR400 Fuxing & CRH Hexie high-speed EMU consist.",
  defaultThemeId: "cr400-fuxing-red",
  carDefinitions: {
    head: {
      type: "head",
      name: "1号车 (先头车)",
      description: "CR400 飞梭形先头驾驶车",
      schema: cr400HeadSchema
    },
    middle: {
      type: "middle",
      name: "2号车 (客车)",
      description: "CR400 中间客车 (带气动导流罩)",
      schema: cr400MiddleSchema
    },
    tail: {
      type: "tail",
      name: "3号车 (尾车)",
      description: "CR400 尾部驾驶车",
      schema: cr400TailSchema
    }
  }
}
