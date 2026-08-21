// 标准 Schema 模型 3: 大正复古蒸汽机车 (JR D51 蒸気機関車 - 经典分段锅炉与乘务舱)
import { PapercraftModelSchema } from '../papercraftSchema'

export const d51SteamSchema: PapercraftModelSchema = {
  version: '20260820.1',
  id: 'd51-steam-locomotive',
  name: '大正复古蒸汽机车 (JR D51 蒸気機関車)',
  category: 'steam',
  difficulty: 'hard',
  recommendedAge: '8-14 岁',
  estimatedTime: '30-45 分钟',
  description: '经典分段阶梯式车身（前部圆筒高压锅炉 + 后部加高乘务驾驶舱）、立式排烟烟囱、蒸汽集气穹顶与连杆式大动轮。',
  dimensions: {
    length: 165,
    width: 38,
    height: 48
  },
  parts: [
    {
      id: 'd51-loco-body',
      name: '机车主体展开 (锅炉与驾驶舱)',
      faces: [
        // 1. 车底板 (Bottom: 中央平齐中轴基准, 宽38, 长165)
        {
          id: 'bottom',
          name: '车底板',
          slotName: 'bottom',
          vertices3D: [
            [-19, 0, 85],
            [19, 0, 85],
            [-19, 0, -80],
            [19, 0, -80]
          ],
          vertices2D: [
            [86, 56],
            [86 + 38, 56],
            [86, 56 + 165],
            [86 + 38, 56 + 165]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 86, y: 56 }, p2: { x: 86, y: 56 + 165 } },
            { type: 'mountain', p1: { x: 86 + 38, y: 56 }, p2: { x: 86 + 38, y: 56 + 165 } },
            { type: 'mountain', p1: { x: 86, y: 56 + 165 }, p2: { x: 86 + 38, y: 56 + 165 } },
            { type: 'mountain', p1: { x: 86, y: 56 }, p2: { x: 86 + 38, y: 56 } }
          ]
        },
        // 2. 左侧机车身 (Left Side: 底部与底盘完全平齐直线相连, 顶部阶梯)
        {
          id: 'side_left',
          name: '左侧机车身 (锅炉与驾驶室)',
          slotName: 'side_left',
          vertices3D: [
            [-19, 0, -80],
            [-19, 0, 85],
            [-19, 40, 85],
            [-19, 40, -25],
            [-19, 48, -25],
            [-19, 48, -80]
          ],
          vertices2D: [
            [86, 56],
            [86, 56 + 165],
            [86 - 40, 56 + 165],
            [86 - 40, 56 + 55],
            [86 - 48, 56 + 55],
            [86 - 48, 56]
          ],
          uvCoords: [[1.0, 0.0], [0.0, 0.0], [0.0, 0.83], [0.67, 0.83], [0.67, 1.0], [1.0, 1.0]],
          indices: [0, 1, 3, 0, 3, 5, 3, 4, 5, 1, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 86 - 48, y: 56 }, p2: { x: 86, y: 56 } },
            { type: 'cut', p1: { x: 86 - 40, y: 56 + 165 }, p2: { x: 86, y: 56 + 165 } },
            { type: 'cut', p1: { x: 86 - 40, y: 56 + 55 }, p2: { x: 86 - 48, y: 56 + 55 } },
            { type: 'cut', p1: { x: 86 - 48, y: 56 }, p2: { x: 86 - 48, y: 56 + 55 } },
            { type: 'cut', p1: { x: 86 - 40, y: 56 + 55 }, p2: { x: 86 - 40, y: 56 + 165 } }
          ],
          tabs: [
            {
              id: 'tab_steam_fl',
              label: 'A1',
              edgeIndex: 2,
              p1: { x: 86 - 40, y: 56 + 165 },
              p2: { x: 86, y: 56 + 165 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front_smokebox'
            },
            {
              id: 'tab_steam_bl',
              label: 'B1',
              edgeIndex: 5,
              p1: { x: 86, y: 56 },
              p2: { x: 86 - 48, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'cab_back'
            }
          ]
        },
        // 3. 右侧机车身 (Right Side: 底部与底盘完全平齐直线相连, 顶部阶梯)
        {
          id: 'side_right',
          name: '右侧机车身 (锅炉与驾驶室)',
          slotName: 'side_right',
          vertices3D: [
            [19, 0, -80],
            [19, 0, 85],
            [19, 40, 85],
            [19, 40, -25],
            [19, 48, -25],
            [19, 48, -80]
          ],
          vertices2D: [
            [86 + 38, 56],
            [86 + 38, 56 + 165],
            [86 + 38 + 40, 56 + 165],
            [86 + 38 + 40, 56 + 55],
            [86 + 38 + 48, 56 + 55],
            [86 + 38 + 48, 56]
          ],
          uvCoords: [[1.0, 0.0], [0.0, 0.0], [0.0, 0.83], [0.67, 0.83], [0.67, 1.0], [1.0, 1.0]],
          indices: [0, 1, 3, 0, 3, 5, 3, 4, 5, 1, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 86 + 38 + 48, y: 56 }, p2: { x: 86 + 38 + 48, y: 56 + 55 } },
            { type: 'cut', p1: { x: 86 + 38, y: 56 }, p2: { x: 86 + 38 + 48, y: 56 } },
            { type: 'cut', p1: { x: 86 + 38, y: 56 + 165 }, p2: { x: 86 + 38 + 40, y: 56 + 165 } },
            { type: 'mountain', p1: { x: 86 + 38 + 40, y: 56 + 55 }, p2: { x: 86 + 38 + 40, y: 56 + 165 } },
            { type: 'mountain', p1: { x: 86 + 38 + 48, y: 56 }, p2: { x: 86 + 38 + 48, y: 56 + 55 } }
          ],
          tabs: [
            {
              id: 'tab_steam_fr',
              label: 'A2',
              edgeIndex: 2,
              p1: { x: 86 + 38, y: 56 + 165 },
              p2: { x: 86 + 38 + 40, y: 56 + 165 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front_smokebox'
            },
            {
              id: 'tab_steam_br',
              label: 'B2',
              edgeIndex: 1,
              p1: { x: 86 + 38 + 48, y: 56 },
              p2: { x: 86 + 38, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'cab_back'
            }
          ]
        },
        // 4. 蒸汽锅炉顶板 (Boiler Top: 连在右侧身前段锅炉外沿, 宽38, 长110)
        {
          id: 'boiler_top',
          name: '蒸汽锅炉顶板',
          slotName: 'roof',
          vertices3D: [
            [-19, 40, 85],
            [19, 40, 85],
            [-19, 40, -25],
            [19, 40, -25]
          ],
          vertices2D: [
            [86 + 38 + 40, 56 + 165],
            [86 + 38 + 40 + 38, 56 + 165],
            [86 + 38 + 40, 56 + 55],
            [86 + 38 + 40 + 38, 56 + 55]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 86 + 38 + 40, y: 56 + 165 }, p2: { x: 86 + 38 + 40 + 38, y: 56 + 165 } },
            { type: 'cut', p1: { x: 86 + 38 + 40 + 38, y: 56 + 55 }, p2: { x: 86 + 38 + 40 + 38, y: 56 + 165 } },
            { type: 'cut', p1: { x: 86 + 38 + 40, y: 56 + 55 }, p2: { x: 86 + 38 + 40 + 38, y: 56 + 55 } }
          ],
          tabs: [
            {
              id: 'tab_boiler_top_l',
              label: 'T1',
              edgeIndex: 1,
              p1: { x: 86 + 38 + 40 + 38, y: 56 + 55 },
              p2: { x: 86 + 38 + 40 + 38, y: 56 + 165 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'side_left'
            },
            {
              id: 'tab_boiler_top_f',
              label: 'T2',
              edgeIndex: 0,
              p1: { x: 86 + 38 + 40, y: 56 + 165 },
              p2: { x: 86 + 38 + 40 + 38, y: 56 + 165 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front_smokebox'
            }
          ]
        },
        // 5. 乘务驾驶舱顶盖 (Cab Roof: 连在右侧身后段驾驶室外沿, 宽38, 长55)
        {
          id: 'cab_roof',
          name: '乘务驾驶舱顶盖',
          slotName: 'roof',
          vertices3D: [
            [-19, 48, -25],
            [19, 48, -25],
            [-19, 48, -80],
            [19, 48, -80]
          ],
          vertices2D: [
            [86 + 38 + 48, 56 + 55],
            [86 + 38 + 48 + 38, 56 + 55],
            [86 + 38 + 48, 56],
            [86 + 38 + 48 + 38, 56]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 86 + 38 + 48, y: 56 }, p2: { x: 86 + 38 + 48 + 38, y: 56 } },
            { type: 'cut', p1: { x: 86 + 38 + 48 + 38, y: 56 }, p2: { x: 86 + 38 + 48 + 38, y: 56 + 55 } },
            { type: 'cut', p1: { x: 86 + 38 + 48, y: 56 + 55 }, p2: { x: 86 + 38 + 48 + 38, y: 56 + 55 } }
          ],
          tabs: [
            {
              id: 'tab_cab_top_l',
              label: 'K1',
              edgeIndex: 1,
              p1: { x: 86 + 38 + 48 + 38, y: 56 },
              p2: { x: 86 + 38 + 48 + 38, y: 56 + 55 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'side_left'
            },
            {
              id: 'tab_cab_top_b',
              label: 'K2',
              edgeIndex: 0,
              p1: { x: 86 + 38 + 48, y: 56 },
              p2: { x: 86 + 38 + 48 + 38, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'cab_back'
            }
          ]
        },
        // 6. 前端锅炉烟箱门 (Front Smokebox Door: 连在底盘前端, 宽38, 高40)
        {
          id: 'front_smokebox',
          name: '前端锅炉烟箱门',
          slotName: 'front',
          vertices3D: [
            [-19, 40, 85],
            [19, 40, 85],
            [-19, 0, 85],
            [19, 0, 85]
          ],
          vertices2D: [
            [86, 56 + 165],
            [86 + 38, 56 + 165],
            [86, 56 + 165 + 40],
            [86 + 38, 56 + 165 + 40]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 86, y: 56 + 165 + 40 }, p2: { x: 86 + 38, y: 56 + 165 + 40 } },
            { type: 'cut', p1: { x: 86, y: 56 + 165 }, p2: { x: 86, y: 56 + 165 + 40 } },
            { type: 'cut', p1: { x: 86 + 38, y: 56 + 165 }, p2: { x: 86 + 38, y: 56 + 165 + 40 } }
          ]
        },
        // 7. 乘务舱后壁 (Cab Back: 连在底盘后端, 宽38, 高48)
        {
          id: 'cab_back',
          name: '乘务驾驶舱后壁',
          slotName: 'back',
          vertices3D: [
            [19, 48, -80],
            [-19, 48, -80],
            [19, 0, -80],
            [-19, 0, -80]
          ],
          vertices2D: [
            [86, 56],
            [86 + 38, 56],
            [86, 56 - 48],
            [86 + 38, 56 - 48]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 86, y: 56 - 48 }, p2: { x: 86 + 38, y: 56 - 48 } },
            { type: 'cut', p1: { x: 86, y: 56 - 48 }, p2: { x: 86, y: 56 } },
            { type: 'cut', p1: { x: 86 + 38, y: 56 - 48 }, p2: { x: 86 + 38, y: 56 } }
          ]
        }
      ]
    }
  ],
  accessories: [
    {
      id: 'chimney',
      name: '立式排气烟囱',
      slotName: 'roof',
      vertices3D: [
        [-5, 7, 5], [5, 7, 5], [5, 7, -5], [-5, 7, -5],
        [-5, -7, 5], [5, -7, 5], [5, -7, -5], [-5, -7, -5]
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
      position3D: [0, 47, 60],
      layout2D: { x: 172, y: 30, width: 22, height: 28 }
    },
    {
      id: 'steam_dome',
      name: '蒸汽集气穹顶',
      slotName: 'roof',
      vertices3D: [
        [-7, 5, 10], [7, 5, 10], [7, 5, -10], [-7, 5, -10],
        [-7, -5, 10], [7, -5, 10], [7, -5, -10], [-7, -5, -10]
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
      position3D: [0, 45, 15],
      layout2D: { x: 172, y: 80, width: 24, height: 36 }
    }
  ]
}
