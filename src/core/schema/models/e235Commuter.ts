// 标准 Schema 模型 1: 日本都市通勤电车 (JR E235系) - 紧凑筒形侧面车底排版
import { PapercraftModelSchema } from '../papercraftSchema'

export const e235CommuterSchema: PapercraftModelSchema = {
  version: '1.0',
  id: 'e235-commuter-train',
  name: '日本都市通勤电车 (JR E235系)',
  category: 'commuter',
  difficulty: 'easy',
  recommendedAge: '5-9 岁',
  estimatedTime: '15-20 分钟',
  description: '经典的日本箱式地铁/电车，大车窗与平整车头，易于裁剪折叠，最适合初学者和小朋友。',
  dimensions: {
    length: 160,
    width: 38,
    height: 44
  },
  parts: [
    {
      id: 'body-main',
      name: '车身主体展开',
      faces: [
        // 1. 车顶 (Roof)
        {
          id: 'roof',
          name: '车顶',
          slotName: 'roof',
          vertices3D: [
            [-19, 44, 80],
            [19, 44, 80],
            [-19, 44, -80],
            [19, 44, -80]
          ],
          vertices2D: [
            [86, 56 + 160],
            [86 + 38, 56 + 160],
            [86, 56],
            [86 + 38, 56]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 86, y: 56 }, p2: { x: 86 + 38, y: 56 } },
            { type: 'mountain', p1: { x: 86 + 38, y: 56 }, p2: { x: 86 + 38, y: 56 + 160 } },
            { type: 'mountain', p1: { x: 86 + 38, y: 56 + 160 }, p2: { x: 86, y: 56 + 160 } },
            { type: 'mountain', p1: { x: 86, y: 56 + 160 }, p2: { x: 86, y: 56 } }
          ]
        },
        // 2. 左侧车身 (Left Side)
        {
          id: 'side_left',
          name: '左侧车身',
          slotName: 'side_left',
          vertices3D: [
            [-19, 44, 80],
            [-19, 44, -80],
            [-19, 0, 80],
            [-19, 0, -80]
          ],
          vertices2D: [
            [86, 56 + 160],
            [86, 56],
            [86 - 44, 56 + 160],
            [86 - 44, 56]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 86 - 44, y: 56 }, p2: { x: 86 - 44, y: 56 + 160 } },
            { type: 'cut', p1: { x: 86 - 44, y: 56 }, p2: { x: 86, y: 56 } },
            { type: 'cut', p1: { x: 86 - 44, y: 56 + 160 }, p2: { x: 86, y: 56 + 160 } }
          ],
          tabs: [
            {
              id: 'tab_l_front',
              label: 'A1',
              edgeIndex: 2,
              p1: { x: 86 - 44, y: 56 + 160 },
              p2: { x: 86, y: 56 + 160 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_l_back',
              label: 'B1',
              edgeIndex: 1,
              p1: { x: 86, y: 56 },
              p2: { x: 86 - 44, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        // 3. 车底 (Bottom: 连结在左侧身外沿向左展开，极省空间!)
        {
          id: 'bottom',
          name: '车底',
          slotName: 'bottom',
          vertices3D: [
            [-19, 0, 80],
            [19, 0, 80],
            [-19, 0, -80],
            [19, 0, -80]
          ],
          vertices2D: [
            [86 - 44, 56 + 160],
            [86 - 44 - 38, 56 + 160],
            [86 - 44, 56],
            [86 - 44 - 38, 56]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 86 - 44 - 38, y: 56 }, p2: { x: 86 - 44 - 38, y: 56 + 160 } },
            { type: 'cut', p1: { x: 86 - 44 - 38, y: 56 }, p2: { x: 86 - 44, y: 56 } },
            { type: 'cut', p1: { x: 86 - 44 - 38, y: 56 + 160 }, p2: { x: 86 - 44, y: 56 + 160 } }
          ],
          tabs: [
            {
              id: 'tab_bottom_seam',
              label: 'D1',
              edgeIndex: 0,
              p1: { x: 86 - 44 - 38, y: 56 },
              p2: { x: 86 - 44 - 38, y: 56 + 160 },
              tabWidth: 8,
              angle: 45,
              targetFaceId: 'side_right'
            }
          ]
        },
        // 4. 右侧车身 (Right Side)
        {
          id: 'side_right',
          name: '右侧车身',
          slotName: 'side_right',
          vertices3D: [
            [19, 44, -80],
            [19, 44, 80],
            [19, 0, -80],
            [19, 0, 80]
          ],
          vertices2D: [
            [86 + 38, 56],
            [86 + 38, 56 + 160],
            [86 + 38 + 44, 56],
            [86 + 38 + 44, 56 + 160]
          ],
          uvCoords: [[1, 1], [0, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 86 + 38 + 44, y: 56 }, p2: { x: 86 + 38 + 44, y: 56 + 160 } },
            { type: 'cut', p1: { x: 86 + 38, y: 56 }, p2: { x: 86 + 38 + 44, y: 56 } },
            { type: 'cut', p1: { x: 86 + 38, y: 56 + 160 }, p2: { x: 86 + 38 + 44, y: 56 + 160 } }
          ],
          tabs: [
            {
              id: 'tab_r_front',
              label: 'A2',
              edgeIndex: 2,
              p1: { x: 86 + 38, y: 56 + 160 },
              p2: { x: 86 + 38 + 44, y: 56 + 160 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_r_back',
              label: 'B2',
              edgeIndex: 1,
              p1: { x: 86 + 38 + 44, y: 56 },
              p2: { x: 86 + 38, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        // 5. 车头 (Front)
        {
          id: 'front',
          name: '车头驾驶室',
          slotName: 'front',
          vertices3D: [
            [-19, 44, 80],
            [19, 44, 80],
            [-19, 0, 80],
            [19, 0, 80]
          ],
          vertices2D: [
            [86, 56 + 160],
            [86 + 38, 56 + 160],
            [86, 56 + 160 + 44],
            [86 + 38, 56 + 160 + 44]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 86, y: 56 + 160 + 44 }, p2: { x: 86 + 38, y: 56 + 160 + 44 } },
            { type: 'cut', p1: { x: 86, y: 56 + 160 }, p2: { x: 86, y: 56 + 160 + 44 } },
            { type: 'cut', p1: { x: 86 + 38, y: 56 + 160 }, p2: { x: 86 + 38, y: 56 + 160 + 44 } }
          ],
          tabs: [
            {
              id: 'tab_front_bottom',
              label: 'C1',
              edgeIndex: 2,
              p1: { x: 86, y: 56 + 160 + 44 },
              p2: { x: 86 + 38, y: 56 + 160 + 44 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'bottom'
            }
          ]
        },
        // 6. 车尾 (Back)
        {
          id: 'back',
          name: '车尾',
          slotName: 'back',
          vertices3D: [
            [19, 44, -80],
            [-19, 44, -80],
            [19, 0, -80],
            [-19, 0, -80]
          ],
          vertices2D: [
            [86 + 38, 56],
            [86, 56],
            [86 + 38, 56 - 44],
            [86, 56 - 44]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 86, y: 56 - 44 }, p2: { x: 86 + 38, y: 56 - 44 } },
            { type: 'cut', p1: { x: 86, y: 56 - 44 }, p2: { x: 86, y: 56 } },
            { type: 'cut', p1: { x: 86 + 38, y: 56 - 44 }, p2: { x: 86 + 38, y: 56 } }
          ],
          tabs: [
            {
              id: 'tab_back_bottom',
              label: 'C2',
              edgeIndex: 2,
              p1: { x: 86 + 38, y: 56 - 44 },
              p2: { x: 86, y: 56 - 44 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'bottom'
            }
          ]
        }
      ]
    }
  ],
  accessories: [
    {
      id: 'ac_unit_1',
      name: '车顶冷气机组 A',
      slotName: 'roof',
      vertices3D: [
        [-11, 2.5, 16], [11, 2.5, 16], [11, 2.5, -16], [-11, 2.5, -16],
        [-11, -2.5, 16], [11, -2.5, 16], [11, -2.5, -16], [-11, -2.5, -16]
      ],
      indices: [
        0, 1, 2, 0, 2, 3, // 顶面
        4, 6, 5, 4, 7, 6, // 底面
        0, 4, 5, 0, 5, 1, // 前面
        2, 6, 7, 2, 7, 3, // 后面
        3, 7, 4, 3, 4, 0, // 左面
        1, 5, 6, 1, 6, 2  // 右面
      ],
      uvCoords: [
        [0, 1], [1, 1], [1, 0], [0, 0],
        [0, 1], [1, 1], [1, 0], [0, 0]
      ],
      position3D: [0, 46.5, 30],
      layout2D: { x: 172, y: 30, width: 24, height: 36 }
    },
    {
      id: 'ac_unit_2',
      name: '车顶冷气机组 B',
      slotName: 'roof',
      vertices3D: [
        [-11, 2.5, 16], [11, 2.5, 16], [11, 2.5, -16], [-11, 2.5, -16],
        [-11, -2.5, 16], [11, -2.5, 16], [11, -2.5, -16], [-11, -2.5, -16]
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
      position3D: [0, 46.5, -35],
      layout2D: { x: 172, y: 75, width: 24, height: 36 }
    }
  ]
}
