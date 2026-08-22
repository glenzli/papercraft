import { SchemaAccessory } from '../papercraftSchema'

/**
 * 纯纸质 T 型活动牵引插扣 (T-Shaped Articulated Drawbar Couplers)
 * 采用中线对折双层复合结构（大幅增加纸张抗拉刚度与韧性），两端带有 14mm 宽的 T 型防脱阻尼扣头。
 * 插入前车与后车底盘暗槽后自动回弹卡死，支持列车左右灵活过弯与整列牵引。
 */
export const couplerDrawbarAccessory: SchemaAccessory = {
  id: 'coupler_drawbar_pair',
  name: 'T型加厚活动牵引挂钩 (2枚)',
  slotName: 'coupler',
  vertices3D: [
    [-3, 1, 14], [3, 1, 14], [3, 1, -14], [-3, 1, -14],
    [-3, -1, 14], [3, -1, 14], [3, -1, -14], [-3, -1, -14]
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
  position3D: [0, 2, 0],
  layout2D: { x: 170, y: 70, width: 44, height: 30 },
  faces: [
    // 挂钩 1 (左侧 T 杆): X: 2..20, Y: 2..30 (无需对折，剪下即为对称工字形活动插扣)
    {
      id: 'coupler_tongue_1',
      name: '工字活动牵引挂钩 (A号)',
      slotName: 'coupler',
      vertices3D: [[-3, 1, 14], [3, 1, 14], [3, 1, -14], [-3, 1, -14]],
      vertices2D: [
        [2, 2], [20, 2], [20, 8], [14, 8], [14, 24], [20, 24], [20, 30],
        [2, 30], [2, 24], [8, 24], [8, 8], [2, 8]
      ],
      uvCoords: [
        [0, 0], [1, 0], [1, 0.2], [0.65, 0.2], [0.65, 0.8], [1, 0.8], [1, 1],
        [0, 1], [0, 0.8], [0.35, 0.8], [0.35, 0.2], [0, 0.2]
      ],
      indices: [0, 1, 2, 0, 2, 3],
      creases: []
    },
    // 挂钩 2 (右侧 T 杆): X: 24..42, Y: 2..30
    {
      id: 'coupler_tongue_2',
      name: '工字活动牵引挂钩 (B号)',
      slotName: 'coupler',
      vertices3D: [[-3, 1, 14], [3, 1, 14], [3, 1, -14], [-3, 1, -14]],
      vertices2D: [
        [24, 2], [42, 2], [42, 8], [36, 8], [36, 24], [42, 24], [42, 30],
        [24, 30], [24, 24], [30, 24], [30, 8], [24, 8]
      ],
      uvCoords: [
        [0, 0], [1, 0], [1, 0.2], [0.65, 0.2], [0.65, 0.8], [1, 0.8], [1, 1],
        [0, 1], [0, 0.8], [0.35, 0.8], [0.35, 0.2], [0, 0.2]
      ],
      indices: [0, 1, 2, 0, 2, 3],
      creases: []
    }
  ]
}

/**
 * 18米双节铰接巨龙公交：立体手风琴折棚风挡 (Articulated Bus Accordion Bellows)
 * 带有交替山折与谷折线的多折风挡纸模，折叠后形成立体多褶皱黑色手风琴过弯风挡。
 */
export const bellowsGangwayAccessory: SchemaAccessory = {
  id: 'bellows_gangway_articulated',
  name: '立体铰接手风琴折棚风挡',
  slotName: 'bellows',
  vertices3D: [
    [-17, 36, 6], [17, 36, 6], [17, 36, -6], [-17, 36, -6],
    [-17, 0, 6], [17, 0, 6], [17, 0, -6], [-17, 0, -6]
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
  position3D: [0, 0, 0],
  layout2D: { x: 170, y: 65, width: 38, height: 38 },
  faces: [
    // 手风琴折棚顶部与两侧连体展开面: X: 2..36, Y: 2..36
    {
      id: 'bellows_pleats',
      name: '手风琴多折褶皱风挡',
      slotName: 'bellows',
      vertices3D: [[-17, 36, 6], [17, 36, 6], [17, 0, 6], [-17, 0, 6]],
      vertices2D: [
        [2, 2], [36, 2], [36, 36], [2, 36]
      ],
      uvCoords: [[0, 0], [1, 0], [1, 1], [0, 1]],
      indices: [0, 1, 2, 0, 2, 3],
      creases: [
        // 4道交替山折与谷折线
        { type: 'mountain', p1: { x: 2, y: 9 }, p2: { x: 36, y: 9 } },
        { type: 'valley', p1: { x: 2, y: 16 }, p2: { x: 36, y: 16 } },
        { type: 'mountain', p1: { x: 2, y: 23 }, p2: { x: 36, y: 23 } },
        { type: 'valley', p1: { x: 2, y: 30 }, p2: { x: 36, y: 30 } }
      ],
      tabs: [
        {
          id: 'tab_bellows_front',
          label: 'F1',
          edgeIndex: 0,
          p1: { x: 2, y: 2 },
          p2: { x: 36, y: 2 },
          tabWidth: 6,
          angle: 45,
          targetFaceId: 'back'
        },
        {
          id: 'tab_bellows_rear',
          label: 'F2',
          edgeIndex: 2,
          p1: { x: 36, y: 36 },
          p2: { x: 2, y: 36 },
          tabWidth: 6,
          angle: 45,
          targetFaceId: 'front'
        }
      ]
    }
  ]
}
