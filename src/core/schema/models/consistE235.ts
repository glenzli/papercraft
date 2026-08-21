// 日本都市通勤电车 (JR E235系) 完整 3 节车厢编组定义 (统一侧面车底紧凑展开 + 右侧立体配件展开)
import { TrainModelConsist } from '../consistSchema'
import { e235CommuterSchema } from './e235Commuter'
import { PapercraftModelSchema } from '../papercraftSchema'

// 1. 中间客车 (双端贯通门 + 侧面4组大客车门 + 车顶高速受电弓)
const e235MiddleSchema: PapercraftModelSchema = {
  version: '1.0',
  id: 'e235-middle-car',
  name: 'E235系 中间客车 (带受电弓)',
  category: 'commuter',
  difficulty: 'easy',
  recommendedAge: '5-9 岁',
  estimatedTime: '15-20 分钟',
  description: '双端贯通门连接通道、双侧4组标准客门与车顶高速受电弓。',
  dimensions: {
    length: 160,
    width: 38,
    height: 44
  },
  parts: [
    {
      id: 'middle-body',
      name: '中间车身展开',
      faces: [
        // 1. 车顶 (Roof)
        {
          id: 'roof',
          name: '车顶',
          slotName: 'roof',
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
            { type: 'mountain', p1: { x: 86, y: 56 }, p2: { x: 86 + 38, y: 56 } },
            { type: 'mountain', p1: { x: 86 + 38, y: 56 }, p2: { x: 86 + 38, y: 56 + 160 } },
            { type: 'mountain', p1: { x: 86 + 38, y: 56 + 160 }, p2: { x: 86, y: 56 + 160 } },
            { type: 'mountain', p1: { x: 86, y: 56 + 160 }, p2: { x: 86, y: 56 } }
          ]
        },
        // 2. 左侧车身 (Left Side)
        {
          id: 'side_left',
          name: '左侧客车身',
          slotName: 'side_left',
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
              targetFaceId: 'front_gangway'
            },
            {
              id: 'tab_l_back',
              label: 'B1',
              edgeIndex: 1,
              p1: { x: 86, y: 56 },
              p2: { x: 86 - 44, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back_gangway'
            }
          ]
        },
        // 3. 车底 (Bottom: 连结在左侧身外沿)
        {
          id: 'bottom',
          name: '车底',
          slotName: 'bottom',
          vertices3D: [[-19, 0, 80], [19, 0, 80], [-19, 0, -80], [19, 0, -80]],
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
          name: '右侧客车身',
          slotName: 'side_right',
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
              targetFaceId: 'front_gangway'
            },
            {
              id: 'tab_r_back',
              label: 'B2',
              edgeIndex: 1,
              p1: { x: 86 + 38 + 44, y: 56 },
              p2: { x: 86 + 38, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back_gangway'
            }
          ]
        },
        // 5. 前贯通门 (Front Gangway)
        {
          id: 'front_gangway',
          name: '前连结贯通门',
          slotName: 'back',
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
        // 6. 后贯通门 (Back Gangway)
        {
          id: 'back_gangway',
          name: '后连结贯通门',
          slotName: 'back',
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
      id: 'pantograph',
      name: '车顶受电弓组件',
      slotName: 'roof',
      vertices3D: [
        [-9, 4, 12], [9, 4, 12], [9, 4, -12], [-9, 4, -12],
        [-9, -4, 12], [9, -4, 12], [9, -4, -12], [-9, -4, -12]
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
      position3D: [0, 48, 40],
      layout2D: { x: 172, y: 35, width: 24, height: 36 }
    },
    {
      id: 'ac_unit_mid',
      name: '车顶冷气机组',
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
      layout2D: { x: 172, y: 80, width: 24, height: 36 }
    }
  ]
}

// 2. 车尾车厢 (带尾灯的驾驶室)
const e235TailSchema: PapercraftModelSchema = {
  ...e235CommuterSchema,
  id: 'e235-tail-car',
  name: 'E235系 (尾车)',
  description: '列车末尾驾驶室，搭载红色尾灯与尾部安全连结器。'
}

export const e235TrainConsist: TrainModelConsist = {
  id: 'e235-consist',
  name: 'JR E235系 (山手线)',
  category: 'commuter',
  description: '经典日本都市电车，包含先头驾驶车、带受电弓中间客车与尾部驾驶车。',
  difficulty: 'easy',
  recommendedAge: '5-9 岁',
  estimatedTimePerCar: '15 分钟/节',
  carDefinitions: {
    head: {
      type: 'head',
      name: '1号车 (先头车)',
      description: 'E235系 先头驾驶车',
      schema: e235CommuterSchema
    },
    middle: {
      type: 'middle',
      name: '2号车 (客车)',
      description: 'E235系 中间客车',
      schema: e235MiddleSchema
    },
    tail: {
      type: 'tail',
      name: '3号车 (尾车)',
      description: 'E235系 尾部驾驶车',
      schema: e235TailSchema
    }
  }
}
