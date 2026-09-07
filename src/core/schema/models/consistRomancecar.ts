// 小田急 70000形 GSE (浪漫特快 / 全景展望席特急列车) 完整多节纸模定义
import { TrainModelConsist } from '../consistSchema'
import { PapercraftModelSchema } from '../papercraftSchema'

// 1. GSE 先头展望车 (双层高位展望驾驶舱 + 下层超大全景前突展望舱)
export const romancecarHeadSchema: PapercraftModelSchema = {
  version: "1.0",
  id: "romancecar-head-car",
  name: "小田急 GSE 70000形 (先头展望车)",
  category: "shinkansen",
  difficulty: "medium",
  recommendedAge: "7-14 岁",
  estimatedTime: "15-20 分钟",
  description: "小田急浪漫特快 GSE，双层挑高全景驾驶舱与超大视角展望前脸。",
  dimensions: {
    length: 160,
    width: 38,
    height: 46
  },
  parts: [
    {
      id: "romancecar-head-body",
      name: "车身主体展开",
      faces: [
        // 1. 车顶 (2楼挑高驾驶室顶罩 + 1楼超大前倾全景展望大风挡)
        {
          id: "roof",
          name: "车顶与双层全景展望风挡",
          slotName: "roof",
          vertices3D: [
            [-19, 42, -80], // 0: 后左顶角
            [19, 42, -80],  // 1: 后右顶角
            [19, 46, 20],   // 2: 2楼驾驶室挑高顶后右折点
            [18, 46, 50],   // 3: 2楼驾驶室挑高顶前右折点
            [18, 14, 76],   // 4: 1楼全景大风挡前右底点
            [-18, 14, 76],  // 5: 1楼全景大风挡前左底点
            [-18, 46, 50],  // 6: 2楼驾驶室挑高顶前左折点
            [-19, 46, 20]   // 7: 2楼驾驶室挑高顶后左折点
          ],
          vertices2D: [
            [86, 56],
            [86 + 38, 56],
            [86 + 38, 56 + 100],
            [86 + 37, 56 + 130],
            [86 + 36, 56 + 173],
            [86 + 2, 56 + 173],
            [86 + 1, 56 + 130],
            [86, 56 + 100]
          ],
          uvCoords: [
            [0, 1], [1, 1], [1, 0.38], [0.97, 0.19], [0.95, 0.0], [0.05, 0.0], [0.03, 0.19], [0, 0.38]
          ],
          indices: [
            0, 1, 2, 0, 2, 7, // 主车顶
            7, 2, 3, 7, 3, 6, // 2楼挑高驾驶室顶
            6, 3, 4, 6, 4, 5  // 1楼超大落地全景前风挡
          ],
          creases: [
            { type: "mountain", p1: { x: 86, y: 56 }, p2: { x: 86 + 38, y: 56 } },
            { type: "mountain", p1: { x: 86 + 38, y: 56 }, p2: { x: 86 + 38, y: 56 + 100 } },
            { type: "mountain", p1: { x: 86, y: 56 + 100 }, p2: { x: 86, y: 56 } },
            { type: "mountain", p1: { x: 86, y: 56 + 100 }, p2: { x: 86 + 38, y: 56 + 100 } },
            { type: "mountain", p1: { x: 86 + 1, y: 56 + 130 }, p2: { x: 86 + 37, y: 56 + 130 } },
            { type: "mountain", p1: { x: 86 + 2, y: 56 + 173 }, p2: { x: 86 + 36, y: 56 + 173 } },
            { type: "cut", p1: { x: 86, y: 56 + 100 }, p2: { x: 86 + 1, y: 56 + 130 } },
            { type: "cut", p1: { x: 86 + 1, y: 56 + 130 }, p2: { x: 86 + 2, y: 56 + 173 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 + 100 }, p2: { x: 86 + 37, y: 56 + 130 } },
            { type: "cut", p1: { x: 86 + 37, y: 56 + 130 }, p2: { x: 86 + 36, y: 56 + 173 } }
          ],
          tabs: [
            {
              id: "tab_roof_slope_l1",
              label: "S1",
              edgeIndex: 6,
              p1: { x: 86, y: 56 + 100 },
              p2: { x: 86 + 1, y: 56 + 130 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_left"
            },
            {
              id: "tab_roof_slope_l2",
              label: "S2",
              edgeIndex: 5,
              p1: { x: 86 + 1, y: 56 + 130 },
              p2: { x: 86 + 2, y: 56 + 173 },
              tabWidth: 5,
              angle: 45,
              targetFaceId: "side_left"
            },
            {
              id: "tab_roof_slope_r1",
              label: "S3",
              edgeIndex: 2,
              p1: { x: 86 + 38, y: 56 + 100 },
              p2: { x: 86 + 37, y: 56 + 130 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "side_right"
            },
            {
              id: "tab_roof_slope_r2",
              label: "S4",
              edgeIndex: 3,
              p1: { x: 86 + 37, y: 56 + 130 },
              p2: { x: 86 + 36, y: 56 + 173 },
              tabWidth: 5,
              angle: 45,
              targetFaceId: "side_right"
            }
          ]
        },
        // 2. 车头正面前鼻立面 (全景展望席前鼻下部)
        {
          id: "front",
          name: "全景前鼻下部",
          slotName: "front",
          vertices3D: [
            [-18, 14, 76],
            [18, 14, 76],
            [18, 0, 78],
            [-18, 0, 78]
          ],
          vertices2D: [
            [86 + 2, 56 + 173],
            [86 + 36, 56 + 173],
            [86 + 36, 56 + 173 + 16],
            [86 + 2, 56 + 173 + 16]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: "cut", p1: { x: 86 + 2, y: 56 + 173 }, p2: { x: 86 + 2, y: 56 + 173 + 16 } },
            { type: "cut", p1: { x: 86 + 36, y: 56 + 173 }, p2: { x: 86 + 36, y: 56 + 173 + 16 } },
            { type: "cut", p1: { x: 86 + 2, y: 56 + 173 + 16 }, p2: { x: 86 + 36, y: 56 + 173 + 16 } }
          ],
          tabs: [
            {
              id: "tab_front_l",
              label: "A1",
              edgeIndex: 3,
              p1: { x: 86 + 2, y: 56 + 173 },
              p2: { x: 86 + 2, y: 56 + 173 + 16 },
              tabWidth: 5,
              angle: 45,
              targetFaceId: "side_left"
            },
            {
              id: "tab_front_r",
              label: "B1",
              edgeIndex: 1,
              p1: { x: 86 + 36, y: 56 + 173 + 16 },
              p2: { x: 86 + 36, y: 56 + 173 },
              tabWidth: 5,
              angle: 45,
              targetFaceId: "side_right"
            },
            {
              id: "tab_front_bottom",
              label: "C1",
              edgeIndex: 2,
              p1: { x: 86 + 2, y: 56 + 173 + 16 },
              p2: { x: 86 + 36, y: 56 + 173 + 16 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: "bottom"
            }
          ]
        },
        // 3. 左侧车身 (双层挑高全景侧窗阶梯车体，与车顶风挡完全贴合封闭)
        {
          id: "side_left",
          name: "左侧客车身",
          slotName: "side_left",
          vertices3D: [
            [-19, 42, -80], // 0: 后上角
            [-19, 46, 20],  // 1: 2楼挑高起点
            [-18, 46, 50],  // 2: 2楼挑高顶部
            [-18, 14, 76],  // 3: 1楼全景展望底点
            [-18, 0, 78],   // 4: 前下底角
            [-19, 0, -80]   // 5: 后下底角
          ],
          vertices2D: [
            [86, 56],
            [86, 56 + 100],
            [86 - 4, 56 + 130],
            [86 - 36, 56 + 173],
            [86 - 46, 56 + 173 + 16],
            [86 - 46, 56]
          ],
          uvCoords: [
            [1.0, 1.0],
            [0.38, 1.0],
            [0.19, 1.0],
            [0.02, 0.30],
            [0.0, 0.0],
            [1.0, 0.0]
          ],
          indices: [
            0, 1, 5,
            1, 2, 5,
            2, 3, 5,
            3, 4, 5
          ],
          creases: [
            { type: "cut", p1: { x: 86 - 46, y: 56 }, p2: { x: 86, y: 56 } },
            { type: "cut", p1: { x: 86, y: 56 + 100 }, p2: { x: 86 - 4, y: 56 + 130 } },
            { type: "cut", p1: { x: 86 - 4, y: 56 + 130 }, p2: { x: 86 - 36, y: 56 + 173 } },
            { type: "cut", p1: { x: 86 - 36, y: 56 + 173 }, p2: { x: 86 - 46, y: 56 + 173 + 16 } }
          ],
          tabs: [
            {
              id: "tab_l_back",
              label: "A2",
              edgeIndex: 5,
              p1: { x: 86, y: 56 },
              p2: { x: 86 - 46, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: "back"
            }
          ]
        },
        // 4. 右侧车身 (双层挑高全景侧窗阶梯车体，与车顶风挡完全贴合封闭)
        {
          id: "side_right",
          name: "右侧客车身",
          slotName: "side_right",
          vertices3D: [
            [19, 42, -80],
            [19, 46, 20],
            [18, 46, 50],
            [18, 14, 76],
            [18, 0, 78],
            [19, 0, -80]
          ],
          vertices2D: [
            [86 + 38, 56],
            [86 + 38, 56 + 100],
            [86 + 38 + 4, 56 + 130],
            [86 + 38 + 36, 56 + 173],
            [86 + 38 + 46, 56 + 173 + 16],
            [86 + 38 + 46, 56]
          ],
          uvCoords: [
            [1.0, 1.0],
            [0.38, 1.0],
            [0.19, 1.0],
            [0.02, 0.30],
            [0.0, 0.0],
            [1.0, 0.0]
          ],
          indices: [
            0, 1, 5,
            1, 2, 5,
            2, 3, 5,
            3, 4, 5
          ],
          creases: [
            { type: "cut", p1: { x: 86 + 38, y: 56 }, p2: { x: 86 + 38 + 46, y: 56 } },
            { type: "cut", p1: { x: 86 + 38, y: 56 + 100 }, p2: { x: 86 + 38 + 4, y: 56 + 130 } },
            { type: "cut", p1: { x: 86 + 38 + 4, y: 56 + 130 }, p2: { x: 86 + 38 + 36, y: 56 + 173 } },
            { type: "cut", p1: { x: 86 + 38 + 36, y: 56 + 173 }, p2: { x: 86 + 38 + 46, y: 56 + 173 + 16 } }
          ],
          tabs: [
            {
              id: "tab_r_back",
              label: "B2",
              edgeIndex: 5,
              p1: { x: 86 + 38 + 46, y: 56 },
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
          vertices3D: [[-19, 0, -80], [-18, 0, 78], [18, 0, 78], [19, 0, -80]],
          vertices2D: [
            [86 - 46, 56],
            [86 - 46, 56 + 173 + 16],
            [86 - 46 - 38, 56 + 173 + 16],
            [86 - 46 - 38, 56]
          ],
          uvCoords: [[0, 1], [0, 0], [1, 0], [1, 1]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: "cut", p1: { x: 86 - 46 - 38, y: 56 }, p2: { x: 86 - 46, y: 56 } },
            { type: "cut", p1: { x: 86 - 46 - 38, y: 56 + 173 + 16 }, p2: { x: 86 - 46, y: 56 + 173 + 16 } },
            { type: "cut", p1: { x: 86 - 46 - 38, y: 56 }, p2: { x: 86 - 46 - 38, y: 56 + 173 + 16 } }
          ],
          tabs: [
            {
              id: "tab_bottom_r",
              label: "D1",
              edgeIndex: 2,
              p1: { x: 86 - 46 - 38, y: 56 },
              p2: { x: 86 - 46 - 38, y: 56 + 173 + 16 },
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
      id: "ac_unit_gse",
      name: "车顶冷气与导流罩",
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
      position3D: [0, 46.5, -15],
      layout2D: { x: 172, y: 68, width: 24, height: 36 }
    }
  ]
}

// 2. GSE 中间全景客车
export const romancecarMiddleSchema: PapercraftModelSchema = {
  version: "1.0",
  id: "romancecar-middle-car",
  name: "小田急 GSE 70000形 (客车)",
  category: "shinkansen",
  difficulty: "easy",
  recommendedAge: "5-10 岁",
  estimatedTime: "10-15 分钟",
  description: "小田急 GSE 中间客车，连续落地全景客舱大窗与朱红流线车身。",
  dimensions: {
    length: 160,
    width: 38,
    height: 44
  },
  parts: [
    {
      id: "romancecar-middle-body",
      name: "客车车身主体展开",
      faces: [
        // 1. 车顶
        {
          id: "roof",
          name: "车顶",
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
        // 2. 左侧车身 (统一 UV：u=0 前端底部，u=1 后端顶部)
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
            { type: "cut", p1: { x: 86, y: 56 + 160 + 44 }, p2: { x: 86 + 38, y: 56 + 160 + 44 } }
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
        // 5. 后端贯通连接门
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
        // 6. 底盘
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
      id: "ac_unit_gse_mid",
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

// 3. GSE 尾车
export const romancecarTailSchema: PapercraftModelSchema = {
  ...romancecarHeadSchema,
  id: "romancecar-tail-car",
  name: "小田急 GSE (尾部展望车)"
}

export const romancecarTrainConsist: TrainModelConsist = {
  id: "odakyu-romancecar-gse-consist",
  name: "小田急 GSE 70000形 · 基础版",
  nameEn: "Odakyu GSE 70000 · Basic",
  category: "shinkansen",
  difficulty: "medium",
  recommendedAge: "7-14 岁",
  estimatedTimePerCar: "15-20 分钟",
  description: "简化展望车头，可选GSE朱红与VSE白色风格配色。",
  descriptionEn: "Simplified observation cab with GSE red and VSE-inspired white liveries.",
  defaultThemeId: "romancecar-gse-red",
  carDefinitions: {
    head: {
      type: "head",
      name: "1号车 (先头展望车)",
      description: "GSE 双层挑高展望先头车",
      schema: romancecarHeadSchema
    },
    middle: {
      type: "middle",
      name: "2号车 (客车)",
      description: "GSE 连续落地全景窗客车",
      schema: romancecarMiddleSchema
    },
    tail: {
      type: "tail",
      name: "3号车 (尾部展望车)",
      description: "GSE 双层挑高展望尾车",
      schema: romancecarTailSchema
    }
  }
}
