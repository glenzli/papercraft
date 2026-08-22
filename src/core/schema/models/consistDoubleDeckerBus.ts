// 经典双层客车 (Classic Double-Decker Bus / 伦敦 Routemaster & 香港九巴 KMB)
// 包含 2 楼全景大风挡、1 楼前上后下乘客门与 3 轴重型车身底盘
import { TrainModelConsist } from '../consistSchema'
import { PapercraftModelSchema } from '../papercraftSchema'

const doubleDeckerBusSchema: PapercraftModelSchema = {
  version: '2.0',
  id: 'double-decker-bus-car',
  name: '经典双层客车 (主体车身)',
  nameEn: 'Double-Decker Bus (Main Body)',
  category: 'bus',
  difficulty: 'easy',
  recommendedAge: '6-12 岁',
  estimatedTime: '15 分钟',
  description: '经典双层公路客车，100% 还原超宽双层视野、前上后下乘客门、3 轴承载底盘与伦敦/香港经典涂装。',
  descriptionEn: 'Grand double-decker transit bus featuring panoramic 2nd floor windows and tri-axle chassis.',
  dimensions: {
    length: 135,
    width: 36,
    height: 56
  },
  parts: [
    {
      id: 'double-decker-bus-net',
      name: '双层客车一体展开面',
      faces: [
        // 1. 车顶 (Roof: X=112..148, Y=60..195)
        {
          id: 'roof',
          name: '车顶',
          slotName: 'roof',
          vertices3D: [[-18, 56, 67.5], [18, 56, 67.5], [-18, 56, -67.5], [18, 56, -67.5]],
          vertices2D: [
            [112, 195],
            [148, 195],
            [112, 60],
            [148, 60]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 112, y: 60 }, p2: { x: 148, y: 60 } },
            { type: 'mountain', p1: { x: 148, y: 60 }, p2: { x: 148, y: 195 } },
            { type: 'mountain', p1: { x: 148, y: 195 }, p2: { x: 112, y: 195 } },
            { type: 'mountain', p1: { x: 112, y: 195 }, p2: { x: 112, y: 60 } }
          ]
        },
        // 2. 左侧车身 (Left Side: X=56..112, Y=60..195)
        {
          id: 'side_left',
          name: '左侧双层车身',
          slotName: 'side_left',
          vertices3D: [[-18, 56, 67.5], [-18, 56, -67.5], [-18, 0, 67.5], [-18, 0, -67.5]],
          vertices2D: [
            [112, 195],
            [112, 60],
            [56, 195],
            [56, 60]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 56, y: 60 }, p2: { x: 112, y: 60 } },
            { type: 'cut', p1: { x: 56, y: 195 }, p2: { x: 112, y: 195 } }
          ],
          tabs: [
            {
              id: 'tab_l_front',
              label: 'A1',
              edgeIndex: 2,
              p1: { x: 56, y: 195 },
              p2: { x: 112, y: 195 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_l_back',
              label: 'B1',
              edgeIndex: 1,
              p1: { x: 112, y: 60 },
              p2: { x: 56, y: 60 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        // 3. 车底 (Bottom: X=20..56, Y=60..195)
        {
          id: 'bottom',
          name: '车底与底盘',
          slotName: 'bottom',
          vertices3D: [[-18, 0, 67.5], [18, 0, 67.5], [-18, 0, -67.5], [18, 0, -67.5]],
          vertices2D: [
            [56, 195],
            [20, 195],
            [56, 60],
            [20, 60]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 56, y: 60 }, p2: { x: 56, y: 195 } }
          ]
        },
        // 4. 右侧车身 (Right Side: X=148..204, Y=60..195)
        {
          id: 'side_right',
          name: '右侧双层车身 (带车门)',
          slotName: 'side_right',
          vertices3D: [[18, 56, -67.5], [18, 56, 67.5], [18, 0, -67.5], [18, 0, 67.5]],
          vertices2D: [
            [148, 60],
            [148, 195],
            [204, 60],
            [204, 195]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 148, y: 60 }, p2: { x: 204, y: 60 } },
            { type: 'cut', p1: { x: 148, y: 195 }, p2: { x: 204, y: 195 } }
          ],
          tabs: [
            {
              id: 'tab_r_front',
              label: 'A2',
              edgeIndex: 3,
              p1: { x: 148, y: 195 },
              p2: { x: 204, y: 195 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_r_back',
              label: 'B2',
              edgeIndex: 2,
              p1: { x: 204, y: 60 },
              p2: { x: 148, y: 60 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        // 5. 车头前脸 (Front: X=112..148, Y=195..251)
        {
          id: 'front',
          name: '车头前脸 (双层观景前挡)',
          slotName: 'front',
          vertices3D: [[-18, 56, 67.5], [18, 56, 67.5], [-18, 0, 67.5], [18, 0, 67.5]],
          vertices2D: [
            [112, 195],
            [148, 195],
            [112, 251],
            [148, 251]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 112, y: 195 }, p2: { x: 148, y: 195 } }
          ],
          tabs: [
            {
              id: 'tab_f_bottom',
              label: 'C1',
              edgeIndex: 2,
              p1: { x: 112, y: 251 },
              p2: { x: 148, y: 251 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'bottom'
            }
          ]
        },
        // 6. 车尾后脸 (Back: X=112..148, Y=4..60)
        {
          id: 'back',
          name: '车尾后脸',
          slotName: 'back',
          vertices3D: [[18, 56, -67.5], [-18, 56, -67.5], [18, 0, -67.5], [-18, 0, -67.5]],
          vertices2D: [
            [148, 60],
            [112, 60],
            [148, 4],
            [112, 4]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 112, y: 60 }, p2: { x: 148, y: 60 } }
          ],
          tabs: [
            {
              id: 'tab_b_bottom',
              label: 'D1',
              edgeIndex: 2,
              p1: { x: 148, y: 4 },
              p2: { x: 112, y: 4 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'bottom'
            }
          ]
        }
      ]
    }
  ]
}

export const consistDoubleDeckerBus: TrainModelConsist = {
  id: 'double-decker-bus-consist',
  name: '经典双层公路客车',
  nameEn: 'Classic Double-Decker Bus',
  category: 'bus',
  description: '风靡全球的经典双层客车，拥有开阔的二楼观景视野与伦敦/香港九巴传奇涂装。',
  descriptionEn: 'Iconic double-decker city bus with panoramic 2nd-floor observation windows and authentic tri-axle chassis.',
  difficulty: 'easy',
  recommendedAge: '6-12 岁',
  estimatedTimePerCar: '15 分钟',
  defaultThemeId: 'bus-double-london-red',
  assembly: {
    type: 'single',
    allowConsistCount: false,
    defaultMiddleCarCount: 0,
    maxMiddleCars: 0
  },
  customization: {
    textSlots: [
      {
        key: 'routeNumber',
        label: '线路路号 (如：15路 / 1A)',
        labelEn: 'Route Number',
        placeholder: '如：15 / 1A / 101',
        placeholderEn: 'e.g. 15',
        defaultValue: '15',
        targetSlot: 'front'
      },
      {
        key: 'destination',
        label: '目的地 (行先方向)',
        labelEn: 'Destination Blind',
        placeholder: '如：TRAFALGAR SQUARE / 尖沙咀碼頭',
        placeholderEn: 'e.g. TRAFALGAR SQUARE',
        defaultValue: 'TRAFALGAR SQ',
        targetSlot: 'front'
      },
      {
        key: 'operator',
        label: '公交营运公司 / 铭牌',
        labelEn: 'Bus Operator',
        placeholder: '如：LONDON TRANSPORT / 九龙巴士 KMB',
        placeholderEn: 'e.g. LONDON TRANSPORT',
        defaultValue: 'LONDON TRANSPORT',
        targetSlot: 'side_left'
      }
    ]
  },
  carDefinitions: {
    head: {
      type: 'head',
      name: '双层大巴车体',
      nameEn: 'Double-Decker Bus Body',
      description: '双层宽视野客车展开面',
      descriptionEn: 'Double-decker bus body net with 2-floor windows',
      schema: doubleDeckerBusSchema
    }
  }
}
