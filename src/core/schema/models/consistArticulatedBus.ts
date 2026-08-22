// 18米超长双节铰接巨龙公交车 (18m Articulated Low-Floor BRT Bus / "Bendy Bus")
// 包含前节主车身（带驾驶室与上客门）+ 后节铰接副车身（带立体手风琴铰接折棚与下客门）
import { TrainModelConsist } from '../consistSchema'
import { PapercraftModelSchema } from '../papercraftSchema'

// 1. 前节主车身 (Front Section / 110mm)
const frontBusSchema: PapercraftModelSchema = {
  version: '2.0',
  id: 'articulated-bus-front',
  name: '18米巨龙公交 - 前节主车身',
  nameEn: '18m Articulated Bus - Front Section',
  category: 'bus',
  difficulty: 'medium',
  recommendedAge: '6-12 岁',
  estimatedTime: '20 分钟',
  description: '18米铰接公交前段车身，包含大弧度前挡风玻璃、前上客门、驾驶室与铰接连接隔板。',
  dimensions: {
    length: 110,
    width: 40,
    height: 44
  },
  parts: [
    {
      id: 'front-body-net',
      name: '前节车身一体展开面',
      faces: [
        // 1. 车顶 (Roof: X=85..125, Y=60..170)
        {
          id: 'roof',
          name: '车顶',
          slotName: 'roof',
          vertices3D: [[-20, 44, 55], [20, 44, 55], [-20, 44, -55], [20, 44, -55]],
          vertices2D: [
            [85, 60 + 110],
            [85 + 40, 60 + 110],
            [85, 60],
            [85 + 40, 60]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 85, y: 60 }, p2: { x: 85 + 40, y: 60 } },
            { type: 'mountain', p1: { x: 85 + 40, y: 60 }, p2: { x: 85 + 40, y: 60 + 110 } },
            { type: 'mountain', p1: { x: 85 + 40, y: 60 + 110 }, p2: { x: 85, y: 60 + 110 } },
            { type: 'mountain', p1: { x: 85, y: 60 + 110 }, p2: { x: 85, y: 60 } }
          ]
        },
        // 2. 左侧车身 (Left Side: X=41..85, Y=60..170)
        {
          id: 'side_left',
          name: '左侧车身 (司机大窗+客舱观景窗)',
          slotName: 'side_left',
          vertices3D: [[-20, 44, 55], [-20, 44, -55], [-20, 0, 55], [-20, 0, -55]],
          vertices2D: [
            [85, 60 + 110],
            [85, 60],
            [85 - 44, 60 + 110],
            [85 - 44, 60]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 85 - 44, y: 60 }, p2: { x: 85, y: 60 } },
            { type: 'cut', p1: { x: 85 - 44, y: 60 + 110 }, p2: { x: 85, y: 60 + 110 } }
          ],
          tabs: [
            {
              id: 'tab_f_l_front',
              label: 'A1',
              edgeIndex: 2,
              p1: { x: 85 - 44, y: 60 + 110 },
              p2: { x: 85, y: 60 + 110 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_f_l_back',
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
        // 3. 车底 (Bottom: X=1..41, Y=60..170)
        {
          id: 'bottom',
          name: '前段底盘',
          slotName: 'bottom',
          vertices3D: [[-20, 0, 55], [20, 0, 55], [-20, 0, -55], [20, 0, -55]],
          vertices2D: [
            [85 - 44, 60 + 110],
            [85 - 44 - 40, 60 + 110],
            [85 - 44, 60],
            [85 - 44 - 40, 60]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 85 - 44, y: 60 }, p2: { x: 85 - 44, y: 60 + 110 } }
          ],
          tabs: [
            {
              id: 'tab_f_bottom_outer',
              label: 'C1',
              edgeIndex: 3,
              p1: { x: 85 - 44 - 40, y: 60 },
              p2: { x: 85 - 44 - 40, y: 60 + 110 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'side_right'
            }
          ]
        },
        // 4. 右侧车身 (Right Side: X=125..169, Y=60..170)
        {
          id: 'side_right',
          name: '右侧车身 (前上客门+中门)',
          slotName: 'side_right',
          vertices3D: [[20, 44, -55], [20, 44, 55], [20, 0, -55], [20, 0, 55]],
          vertices2D: [
            [125, 60],
            [125, 60 + 110],
            [125 + 44, 60],
            [125 + 44, 60 + 110]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 125, y: 60 }, p2: { x: 125 + 44, y: 60 } },
            { type: 'cut', p1: { x: 125, y: 60 + 110 }, p2: { x: 125 + 44, y: 60 + 110 } }
          ],
          tabs: [
            {
              id: 'tab_f_r_front',
              label: 'A2',
              edgeIndex: 2,
              p1: { x: 125, y: 60 + 110 },
              p2: { x: 125 + 44, y: 60 + 110 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_f_r_back',
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
        // 5. 车头前脸 (Front: X=85..125, Y=170..214)
        {
          id: 'front',
          name: '车头 (LED路牌/前挡风)',
          slotName: 'front',
          vertices3D: [[-20, 44, 55], [20, 44, 55], [-20, 0, 55], [20, 0, 55]],
          vertices2D: [
            [85, 60 + 110],
            [125, 60 + 110],
            [85, 60 + 110 + 44],
            [125, 60 + 110 + 44]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 85, y: 60 + 110 + 44 }, p2: { x: 125, y: 60 + 110 + 44 } }
          ],
          tabs: [
            {
              id: 'tab_f_front_bottom',
              label: 'C2',
              edgeIndex: 3,
              p1: { x: 85, y: 60 + 110 + 44 },
              p2: { x: 125, y: 60 + 110 + 44 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'bottom'
            }
          ]
        },
        // 6. 前段铰接连接面 (Back Partition: X=85..125, Y=16..60)
        {
          id: 'back',
          name: '前段铰接连接通道口',
          slotName: 'back',
          vertices3D: [[20, 44, -55], [-20, 44, -55], [20, 0, -55], [-20, 0, -55]],
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
              id: 'tab_f_back_bottom',
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
    }
  ]
}

// 2. 后节铰接副车身 (Rear Section / 105mm 带手风琴折棚风挡)
const rearBusSchema: PapercraftModelSchema = {
  version: '2.0',
  id: 'articulated-bus-rear',
  name: '18米巨龙公交 - 后节铰接副车身',
  nameEn: '18m Articulated Bus - Rear Section',
  category: 'bus',
  difficulty: 'medium',
  recommendedAge: '6-12 岁',
  estimatedTime: '20 分钟',
  description: '18米铰接公交后段车身，配备手风琴式立体折叠铰接棚、后下客门与尾部散热百叶。',
  dimensions: {
    length: 105,
    width: 40,
    height: 44
  },
  parts: [
    {
      id: 'rear-body-net',
      name: '后节车身一体展开面',
      faces: [
        // 1. 车顶 (Roof: X=85..125, Y=60..165)
        {
          id: 'roof',
          name: '车顶',
          slotName: 'roof',
          vertices3D: [[-20, 44, 52.5], [20, 44, 52.5], [-20, 44, -52.5], [20, 44, -52.5]],
          vertices2D: [
            [85, 60 + 105],
            [85 + 40, 60 + 105],
            [85, 60],
            [85 + 40, 60]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 85, y: 60 }, p2: { x: 85 + 40, y: 60 } },
            { type: 'mountain', p1: { x: 85 + 40, y: 60 }, p2: { x: 85 + 40, y: 60 + 105 } },
            { type: 'mountain', p1: { x: 85 + 40, y: 60 + 105 }, p2: { x: 85, y: 60 + 105 } },
            { type: 'mountain', p1: { x: 85, y: 60 + 105 }, p2: { x: 85, y: 60 } }
          ]
        },
        // 2. 左侧车身 (Left Side: X=41..85, Y=60..165)
        {
          id: 'side_left',
          name: '左侧后车身',
          slotName: 'side_left',
          vertices3D: [[-20, 44, 52.5], [-20, 44, -52.5], [-20, 0, 52.5], [-20, 0, -52.5]],
          vertices2D: [
            [85, 60 + 105],
            [85, 60],
            [85 - 44, 60 + 105],
            [85 - 44, 60]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 85 - 44, y: 60 }, p2: { x: 85, y: 60 } },
            { type: 'cut', p1: { x: 85 - 44, y: 60 + 105 }, p2: { x: 85, y: 60 + 105 } }
          ],
          tabs: [
            {
              id: 'tab_r_l_front',
              label: 'D1',
              edgeIndex: 2,
              p1: { x: 85 - 44, y: 60 + 105 },
              p2: { x: 85, y: 60 + 105 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_r_l_back',
              label: 'E1',
              edgeIndex: 1,
              p1: { x: 85, y: 60 },
              p2: { x: 85 - 44, y: 60 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        // 3. 车底 (Bottom: X=1..41, Y=60..165)
        {
          id: 'bottom',
          name: '后段底盘 (第三驱动轴)',
          slotName: 'bottom',
          vertices3D: [[-20, 0, 52.5], [20, 0, 52.5], [-20, 0, -52.5], [20, 0, -52.5]],
          vertices2D: [
            [85 - 44, 60 + 105],
            [85 - 44 - 40, 60 + 105],
            [85 - 44, 60],
            [85 - 44 - 40, 60]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 85 - 44, y: 60 }, p2: { x: 85 - 44, y: 60 + 105 } }
          ],
          tabs: [
            {
              id: 'tab_r_bottom_outer',
              label: 'F1',
              edgeIndex: 3,
              p1: { x: 85 - 44 - 40, y: 60 },
              p2: { x: 85 - 44 - 40, y: 60 + 105 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'side_right'
            }
          ]
        },
        // 4. 右侧车身 (Right Side: X=125..169, Y=60..165)
        {
          id: 'side_right',
          name: '右侧后车身 (后下客双开门)',
          slotName: 'side_right',
          vertices3D: [[20, 44, -52.5], [20, 44, 52.5], [20, 0, -52.5], [20, 0, 52.5]],
          vertices2D: [
            [125, 60],
            [125, 60 + 105],
            [125 + 44, 60],
            [125 + 44, 60 + 105]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 125, y: 60 }, p2: { x: 125 + 44, y: 60 } },
            { type: 'cut', p1: { x: 125, y: 60 + 105 }, p2: { x: 125 + 44, y: 60 + 105 } }
          ],
          tabs: [
            {
              id: 'tab_r_r_front',
              label: 'D2',
              edgeIndex: 2,
              p1: { x: 125, y: 60 + 105 },
              p2: { x: 125 + 44, y: 60 + 105 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_r_r_back',
              label: 'E2',
              edgeIndex: 1,
              p1: { x: 125 + 44, y: 60 },
              p2: { x: 125, y: 60 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        // 5. 手风琴式铰接风挡折棚 (Front: X=85..125, Y=165..209)
        {
          id: 'front',
          name: '手风琴式折叠铰接风挡 (Bellows)',
          slotName: 'front',
          vertices3D: [[-20, 44, 52.5], [20, 44, 52.5], [-20, 0, 52.5], [20, 0, 52.5]],
          vertices2D: [
            [85, 60 + 105],
            [125, 60 + 105],
            [85, 60 + 105 + 44],
            [125, 60 + 105 + 44]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 85, y: 60 + 105 + 44 }, p2: { x: 125, y: 60 + 105 + 44 } }
          ],
          tabs: [
            {
              id: 'tab_r_front_bottom',
              label: 'F2',
              edgeIndex: 3,
              p1: { x: 85, y: 60 + 105 + 44 },
              p2: { x: 125, y: 60 + 105 + 44 },
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
          vertices3D: [[20, 44, -52.5], [-20, 44, -52.5], [20, 0, -52.5], [-20, 0, -52.5]],
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
              id: 'tab_r_back_bottom',
              label: 'F3',
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
    }
  ]
}

export const consistArticulatedBus: TrainModelConsist = {
  id: 'articulated-bus-consist',
  name: '18米双节铰接巨龙公交车',
  nameEn: '18m Articulated Transit Bus (Bendy Bus)',
  category: 'bus',
  description: '经典 18 米双节大容量中运量铰接客车，带黑色手风琴立体风挡与 3 组车轴。',
  descriptionEn: 'Iconic 18m high-capacity articulated transit bus with flexible folding bellows and 3 axles.',
  difficulty: 'medium',
  recommendedAge: '6-12 岁',
  estimatedTimePerCar: '20 分钟',
  defaultThemeId: 'bus-articulated-71',
  assembly: {
    type: 'articulated',
    allowConsistCount: false,
    defaultMiddleCarCount: 0,
    maxMiddleCars: 0
  },
  customization: {
    textSlots: [
      {
        key: 'routeNumber',
        label: '巨龙线路路号',
        labelEn: 'Route Number',
        placeholder: '如：71路巨龙 / 101路大通道',
        placeholderEn: 'e.g. BRT 71 / Line 101',
        defaultValue: '71路巨龙',
        targetSlot: 'front'
      },
      {
        key: 'destination',
        label: '中运量方向 (LED)',
        labelEn: 'Destination',
        placeholder: '如：延安东路外滩 ⇋ 申昆路枢纽',
        placeholderEn: 'e.g. Downtown ⇋ Central Hub',
        defaultValue: '延安东路外滩 ⇋ 申昆路枢纽',
        targetSlot: 'side_left'
      },
      {
        key: 'operator',
        label: '所属公交集团',
        labelEn: 'Transit Operator',
        placeholder: '如：上海巴士三公司 / 城市公共交通',
        placeholderEn: 'e.g. City Transit Fleet',
        defaultValue: '上海巴士三公司',
        targetSlot: 'side_left'
      },
      {
        key: 'licensePlate',
        label: '巨龙前后车牌号',
        labelEn: 'License Plate',
        placeholder: '如：沪A·71888',
        placeholderEn: 'e.g. SH-71888',
        defaultValue: '沪A·71888',
        targetSlot: 'front'
      }
    ]
  },
  carDefinitions: {
    head: {
      type: 'head',
      name: '前节主车身',
      nameEn: 'Lead Section',
      description: '前段驾驶室与上客门车体',
      descriptionEn: 'Front section with cab and boarding doors',
      schema: frontBusSchema
    },
    tail: {
      type: 'tail',
      name: '后节铰接车身',
      nameEn: 'Rear Section (Bellows)',
      description: '后段车身带手风琴铰接风挡',
      descriptionEn: 'Rear section with folding bellows',
      schema: rearBusSchema
    }
  }
}
