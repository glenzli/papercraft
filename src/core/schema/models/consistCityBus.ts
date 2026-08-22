// 经典都市无障碍低地板双门公交车 (City Low-Floor Transit Bus)
// 包含单体车身完整展开面 + 4组独立立体轮对折盒 + 车顶空调机组
import { TrainModelConsist } from '../consistSchema'
import { PapercraftModelSchema } from '../papercraftSchema'

const cityBusSchema: PapercraftModelSchema = {
  version: '2.0',
  id: 'city-bus-main-body',
  name: '都市低地板公交车主体',
  nameEn: 'City Transit Bus Body',
  category: 'bus',
  difficulty: 'easy',
  recommendedAge: '5-10 岁',
  estimatedTime: '20-25 分钟',
  description: '单体经典都市无障碍低地板双门公交车，包含大视窗前挡、双开折叠客门、车顶空调与独立立体轮组。',
  descriptionEn: 'Classic city low-floor transit bus with large front windshield, dual folding doors, and roof AC.',
  dimensions: {
    length: 150,
    width: 40,
    height: 44
  },
  parts: [
    {
      id: 'bus-body-net',
      name: '车身一体展开面',
      faces: [
        // 1. 车顶 (Roof: X=85..125, Y=60..210)
        {
          id: 'roof',
          name: '车顶',
          slotName: 'roof',
          vertices3D: [[-20, 44, 75], [20, 44, 75], [-20, 44, -75], [20, 44, -75]],
          vertices2D: [
            [85, 60 + 150],
            [85 + 40, 60 + 150],
            [85, 60],
            [85 + 40, 60]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 85, y: 60 }, p2: { x: 85 + 40, y: 60 } },
            { type: 'mountain', p1: { x: 85 + 40, y: 60 }, p2: { x: 85 + 40, y: 60 + 150 } },
            { type: 'mountain', p1: { x: 85 + 40, y: 60 + 150 }, p2: { x: 85, y: 60 + 150 } },
            { type: 'mountain', p1: { x: 85, y: 60 + 150 }, p2: { x: 85, y: 60 } }
          ]
        },
        // 2. 左侧车身 (Left Side: X=41..85, Y=60..210)
        {
          id: 'side_left',
          name: '左侧车身 (全景大窗)',
          slotName: 'side_left',
          vertices3D: [[-20, 44, 75], [-20, 44, -75], [-20, 0, 75], [-20, 0, -75]],
          vertices2D: [
            [85, 60 + 150],
            [85, 60],
            [85 - 44, 60 + 150],
            [85 - 44, 60]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 85 - 44, y: 60 }, p2: { x: 85, y: 60 } },
            { type: 'cut', p1: { x: 85 - 44, y: 60 + 150 }, p2: { x: 85, y: 60 + 150 } }
          ],
          tabs: [
            {
              id: 'tab_l_front',
              label: 'A1',
              edgeIndex: 2,
              p1: { x: 85 - 44, y: 60 + 150 },
              p2: { x: 85, y: 60 + 150 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_l_back',
              label: 'B1',
              edgeIndex: 1,
              p1: { x: 85, y: 60 },
              p2: { x: 85 - 44, y: 60 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        // 3. 车底 (Bottom: X=1..41, Y=60..210)
        {
          id: 'bottom',
          name: '车底与底盘',
          slotName: 'bottom',
          vertices3D: [[-20, 0, 75], [20, 0, 75], [-20, 0, -75], [20, 0, -75]],
          vertices2D: [
            [85 - 44, 60 + 150],
            [85 - 44 - 40, 60 + 150],
            [85 - 44, 60],
            [85 - 44 - 40, 60]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 85 - 44, y: 60 }, p2: { x: 85 - 44, y: 60 + 150 } }
          ],
          tabs: [
            {
              id: 'tab_bottom_outer',
              label: 'C1',
              edgeIndex: 3,
              p1: { x: 85 - 44 - 40, y: 60 },
              p2: { x: 85 - 44 - 40, y: 60 + 150 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'side_right'
            }
          ]
        },
        // 4. 右侧车身 (Right Side: X=125..169, Y=60..210, 包含双乘客门)
        {
          id: 'side_right',
          name: '右侧车身 (双乘客门)',
          slotName: 'side_right',
          vertices3D: [[20, 44, -75], [20, 44, 75], [20, 0, -75], [20, 0, 75]],
          vertices2D: [
            [125, 60],
            [125, 60 + 150],
            [125 + 44, 60],
            [125 + 44, 60 + 150]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 125, y: 60 }, p2: { x: 125 + 44, y: 60 } },
            { type: 'cut', p1: { x: 125, y: 60 + 150 }, p2: { x: 125 + 44, y: 60 + 150 } }
          ],
          tabs: [
            {
              id: 'tab_r_front',
              label: 'A2',
              edgeIndex: 2,
              p1: { x: 125, y: 60 + 150 },
              p2: { x: 125 + 44, y: 60 + 150 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_r_back',
              label: 'B2',
              edgeIndex: 1,
              p1: { x: 125 + 44, y: 60 },
              p2: { x: 125, y: 60 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        // 5. 车头前脸 (Front: X=85..125, Y=16..60)
        {
          id: 'front',
          name: '车头 (LED路牌/前挡风)',
          slotName: 'front',
          vertices3D: [[-20, 44, 75], [20, 44, 75], [-20, 0, 75], [20, 0, 75]],
          vertices2D: [
            [85, 60 + 150],
            [125, 60 + 150],
            [85, 60 + 150 + 44],
            [125, 60 + 150 + 44]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 85, y: 60 + 150 + 44 }, p2: { x: 125, y: 60 + 150 + 44 } }
          ],
          tabs: [
            {
              id: 'tab_front_bottom',
              label: 'C2',
              edgeIndex: 3,
              p1: { x: 85, y: 60 + 150 + 44 },
              p2: { x: 125, y: 60 + 150 + 44 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'bottom'
            }
          ]
        },
        // 6. 车尾后背 (Back: X=85..125, Y=16..60)
        {
          id: 'back',
          name: '车尾 (散热格栅/车牌)',
          slotName: 'back',
          vertices3D: [[20, 44, -75], [-20, 44, -75], [20, 0, -75], [-20, 0, -75]],
          vertices2D: [
            [125, 60],
            [85, 60],
            [125, 60 - 44],
            [85, 60 - 44]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 85, y: 60 - 44 }, p2: { x: 125, y: 60 - 44 } }
          ],
          tabs: [
            {
              id: 'tab_back_bottom',
              label: 'C3',
              edgeIndex: 3,
              p1: { x: 125, y: 60 - 44 },
              p2: { x: 85, y: 60 - 44 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'bottom'
            }
          ]
        }
      ]
    },
    // 配件 1: 车顶一体式空调机组 (Roof AC Unit)
    {
      id: 'bus-ac-unit',
      name: '车顶中央空调机组',
      faces: [
        {
          id: 'ac_top',
          name: '空调机顶盖',
          slotName: 'roof',
          vertices3D: [[-12, 49, 15], [12, 49, 15], [-12, 49, -15], [12, 49, -15]],
          vertices2D: [
            [174, 50],
            [174 + 24, 50],
            [174, 50 + 30],
            [174 + 24, 50 + 30]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 174, y: 50 }, p2: { x: 174 + 24, y: 50 } },
            { type: 'mountain', p1: { x: 174 + 24, y: 50 }, p2: { x: 174 + 24, y: 50 + 30 } },
            { type: 'mountain', p1: { x: 174 + 24, y: 50 + 30 }, p2: { x: 174, y: 50 + 30 } },
            { type: 'mountain', p1: { x: 174, y: 50 + 30 }, p2: { x: 174, y: 50 } }
          ],
          tabs: [
            {
              id: 'tab_ac_base',
              label: 'AC',
              edgeIndex: 0,
              p1: { x: 174, y: 50 },
              p2: { x: 174 + 24, y: 50 },
              tabWidth: 5,
              angle: 45,
              targetFaceId: 'roof'
            }
          ]
        }
      ]
    }
  ]
}

export const consistCityBus: TrainModelConsist = {
  id: 'city-bus-consist',
  name: '都市低地板双门公交车',
  nameEn: 'City Low-Floor Transit Bus',
  category: 'bus',
  description: '经典都市无障碍低地板公交车，带前后车牌与车头 LED 线路牌、双开折叠客门与车顶空调。',
  descriptionEn: 'Iconic city transit low-floor bus with front LED route display, license plates, and dual folding doors.',
  difficulty: 'easy',
  recommendedAge: '5-10 岁',
  estimatedTimePerCar: '20 分钟',
  defaultThemeId: 'bus-71-blue',
  // 装配形态：锁定单车
  assembly: {
    type: 'single',
    allowConsistCount: false,
    defaultMiddleCarCount: 0,
    maxMiddleCars: 0
  },
  // 数据驱动的 DIY 文本与标识插槽
  customization: {
    textSlots: [
      {
        key: 'routeNumber',
        label: '线路路号 (路牌)',
        labelEn: 'Route Number',
        placeholder: '如：71路 / M101',
        placeholderEn: 'e.g. Route 71 / M101',
        defaultValue: '71路',
        targetSlot: 'front'
      },
      {
        key: 'destination',
        label: '终点站方向 (LED)',
        labelEn: 'Destination',
        placeholder: '如：延安东路外滩 ⇋ 申昆路',
        placeholderEn: 'e.g. Downtown ⇋ Central Stn',
        defaultValue: '延安东路外滩 ⇋ 申昆路',
        targetSlot: 'side_left'
      },
      {
        key: 'operator',
        label: '所属公交集团 / 铭牌',
        labelEn: 'Transit Operator',
        placeholder: '如：巴士三公司 / 城市公共交通',
        placeholderEn: 'e.g. City Transit Fleet',
        defaultValue: '巴士三公司',
        targetSlot: 'side_left'
      },
      {
        key: 'licensePlate',
        label: '前后车牌号',
        labelEn: 'License Plate',
        placeholder: '如：沪A·71001 / 京A·88888',
        placeholderEn: 'e.g. LT02 BUS / 71001',
        defaultValue: '沪A·71001',
        targetSlot: 'front'
      }
    ]
  },
  carDefinitions: {
    head: {
      type: 'body',
      name: '都市低地板公交车',
      nameEn: 'City Low-Floor Bus',
      description: '单体低地板公交车车身主体',
      descriptionEn: 'Single-body transit bus main structure',
      schema: cityBusSchema
    }
  }
}
