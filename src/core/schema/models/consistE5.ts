// 新干线 E5 隼号 完整多节列车编组定义 (统一侧面车底紧凑展开)
import { TrainModelConsist } from '../consistSchema'
import { e5HayabusaSchema } from './e5Hayabusa'
import { PapercraftModelSchema } from '../papercraftSchema'

// 新干线中间客车 (流线型平滑车身 + 车顶大型隔音受电弓 + 侧面连结车底)
const e5MiddleSchema: PapercraftModelSchema = {
  version: '1.0',
  id: 'e5-middle-car',
  name: 'E5系 中间客车 (带大型隔音受电弓)',
  category: 'shinkansen',
  difficulty: 'medium',
  recommendedAge: '7-14 岁',
  estimatedTime: '20-25 分钟',
  description: '全包覆流线型车身、低阻力侧裙板与车顶气动隔音导流罩。',
  dimensions: {
    length: 170,
    width: 36,
    height: 42
  },
  parts: [
    {
      id: 'e5-middle-body',
      name: '中间车身展开',
      faces: [
        // 1. 车顶 (Roof)
        {
          id: 'roof',
          name: '车顶',
          slotName: 'roof',
          vertices3D: [[-18, 42, -85], [18, 42, -85], [18, 42, 85], [-18, 42, 85]],
          vertices2D: [
            [86, 56],
            [122, 56],
            [122, 226],
            [86, 226]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'mountain', p1: { x: 86, y: 56 }, p2: { x: 122, y: 56 } },
            { type: 'mountain', p1: { x: 122, y: 56 }, p2: { x: 122, y: 226 } },
            { type: 'mountain', p1: { x: 86, y: 226 }, p2: { x: 122, y: 226 } },
            { type: 'mountain', p1: { x: 86, y: 56 }, p2: { x: 86, y: 226 } }
          ]
        },
        // 2. 左侧车身 (Left Side)
        {
          id: 'side_left',
          name: '左侧流线车身',
          slotName: 'side_left',
          vertices3D: [[-18, 42, -85], [-18, 42, 85], [-18, 0, 85], [-18, 0, -85]],
          vertices2D: [
            [86, 56],
            [86, 226],
            [44, 226],
            [44, 56]
          ],
          uvCoords: [[1, 1], [0, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 44, y: 56 }, p2: { x: 86, y: 56 } },
            { type: 'cut', p1: { x: 44, y: 226 }, p2: { x: 86, y: 226 } }
          ],
          tabs: [
            {
              id: 'tab_l_front',
              label: 'A1',
              edgeIndex: 1,
              p1: { x: 44, y: 226 },
              p2: { x: 86, y: 226 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front_gangway'
            },
            {
              id: 'tab_l_back',
              label: 'B1',
              edgeIndex: 3,
              p1: { x: 86, y: 56 },
              p2: { x: 44, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back_gangway'
            }
          ]
        },
        // 3. 车底 (Bottom: 连在左侧身外沿)
        {
          id: 'bottom',
          name: '车底',
          slotName: 'bottom',
          vertices3D: [[-18, 0, -85], [-18, 0, 85], [18, 0, 85], [18, 0, -85]],
          vertices2D: [
            [44, 56],
            [44, 226],
            [8, 226],
            [8, 56]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 8, y: 56 }, p2: { x: 8, y: 226 } },
            { type: 'cut', p1: { x: 8, y: 56 }, p2: { x: 44, y: 56 } },
            { type: 'cut', p1: { x: 8, y: 226 }, p2: { x: 44, y: 226 } }
          ],
          tabs: [
            {
              id: 'tab_bottom_seam',
              label: 'D1',
              edgeIndex: 2,
              p1: { x: 8, y: 56 },
              p2: { x: 8, y: 226 },
              tabWidth: 8,
              angle: 45,
              targetFaceId: 'side_right'
            }
          ]
        },
        // 4. 右侧车身 (Right Side)
        {
          id: 'side_right',
          name: '右侧流线车身',
          slotName: 'side_right',
          vertices3D: [[18, 42, -85], [18, 42, 85], [18, 0, 85], [18, 0, -85]],
          vertices2D: [
            [122, 56],
            [122, 226],
            [164, 226],
            [164, 56]
          ],
          uvCoords: [[1, 1], [0, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 164, y: 56 }, p2: { x: 164, y: 226 } },
            { type: 'cut', p1: { x: 122, y: 56 }, p2: { x: 164, y: 56 } },
            { type: 'cut', p1: { x: 122, y: 226 }, p2: { x: 164, y: 226 } }
          ],
          tabs: [
            {
              id: 'tab_r_front',
              label: 'A2',
              edgeIndex: 1,
              p1: { x: 122, y: 226 },
              p2: { x: 164, y: 226 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front_gangway'
            },
            {
              id: 'tab_r_back',
              label: 'B2',
              edgeIndex: 3,
              p1: { x: 164, y: 56 },
              p2: { x: 122, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back_gangway'
            }
          ]
        },
        // 5. 前贯通门 (Front Gangway)
        {
          id: 'front_gangway',
          name: '前贯通门',
          slotName: 'back',
          vertices3D: [[-18, 42, 85], [18, 42, 85], [18, 0, 85], [-18, 0, 85]],
          vertices2D: [
            [86, 226],
            [122, 226],
            [122, 268],
            [86, 268]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 86, y: 268 }, p2: { x: 122, y: 268 } },
            { type: 'cut', p1: { x: 86, y: 226 }, p2: { x: 86, y: 268 } },
            { type: 'cut', p1: { x: 122, y: 226 }, p2: { x: 122, y: 268 } }
          ],
          tabs: [
            {
              id: 'tab_front_bot',
              label: 'C1',
              edgeIndex: 2,
              p1: { x: 86, y: 268 },
              p2: { x: 122, y: 268 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'bottom'
            }
          ]
        },
        // 6. 后贯通门 (Back Gangway)
        {
          id: 'back_gangway',
          name: '后贯通门',
          slotName: 'back',
          vertices3D: [[18, 42, -85], [-18, 42, -85], [-18, 0, -85], [18, 0, -85]],
          vertices2D: [
            [122, 56],
            [86, 56],
            [86, 14],
            [122, 14]
          ],
          uvCoords: [[1, 1], [0, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 86, y: 14 }, p2: { x: 122, y: 14 } },
            { type: 'cut', p1: { x: 86, y: 14 }, p2: { x: 86, y: 56 } },
            { type: 'cut', p1: { x: 122, y: 14 }, p2: { x: 122, y: 56 } }
          ],
          tabs: [
            {
              id: 'tab_back_bot',
              label: 'C2',
              edgeIndex: 2,
              p1: { x: 122, y: 14 },
              p2: { x: 86, y: 14 },
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
      id: 'e5_pantograph',
      name: '车顶气动隔音受电弓',
      slotName: 'roof',
      vertices3D: [
        [-9, 3.5, 14], [9, 3.5, 14], [9, 3.5, -14], [-9, 3.5, -14],
        [-9, -3.5, 14], [9, -3.5, 14], [9, -3.5, -14], [-9, -3.5, -14]
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
      position3D: [0, 45.5, 20],
      layout2D: { x: 172, y: 40, width: 24, height: 38 }
    }
  ]
}

const e5TailSchema: PapercraftModelSchema = {
  ...e5HayabusaSchema,
  id: 'e5-tail-car',
  name: 'E5系 (尾车)',
  description: '新干线末尾车辆，带有气动减阻后鼻与红色尾灯。'
}

export const e5TrainConsist: TrainModelConsist = {
  id: 'e5-consist',
  name: '新干线 E5系 (隼号)',
  nameEn: 'Shinkansen E5 Series (Hayabusa)',
  category: 'shinkansen',
  defaultThemeId: 'hayabusa-emerald',
  description: '超长气动长鼻与高速流线客车，支持自由组合多节新干线高铁编组。',
  descriptionEn: 'High-speed bullet train featuring long aerodynamic nose and streamline coaches.',
  difficulty: 'medium',
  recommendedAge: '7-14 岁',
  estimatedTimePerCar: '25 分钟/节',
  carDefinitions: {
    head: {
      type: 'head',
      name: '1号车 (先头车)',
      description: 'E5系 气动长鼻先头车',
      schema: e5HayabusaSchema
    },
    middle: {
      type: 'middle',
      name: '2号车 (客车)',
      description: 'E5系 中间客车',
      schema: e5MiddleSchema
    },
    tail: {
      type: 'tail',
      name: '3号车 (尾车)',
      description: 'E5系 尾部车厢',
      schema: e5TailSchema
    }
  }
}
