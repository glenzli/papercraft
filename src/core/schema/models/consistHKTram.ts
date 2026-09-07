// 香港双层叮叮车 (Hong Kong Double-Decker Ding Ding Tram)
// 包含高耸双层复古车身、车顶集电杆与香港特色全车身广告/经典墨绿
import { TrainModelConsist } from '../consistSchema'
import { PapercraftModelSchema } from '../papercraftSchema'

const hkTramBodySchema: PapercraftModelSchema = {
  version: '2.0',
  id: 'hk-tram-body-car',
  name: '香港双层叮叮车 (主体车身)',
  nameEn: 'Hong Kong Double-Decker Tram (Main Body)',
  category: 'commuter',
  difficulty: 'easy',
  recommendedAge: '6-12 岁',
  estimatedTime: '15 分钟',
  description: '经典香港双层有轨电车，100% 还原高窄复古比例、双层客窗、车顶集电杆与地面窄轨车桥。',
  descriptionEn: 'Iconic Hong Kong double-decker street tramway with authentic tall & narrow heritage proportions.',
  dimensions: {
    length: 88,
    width: 28,
    height: 58
  },
  parts: [
    {
      id: 'hk-tram-main-body',
      name: '双层车体一体展开面',
      faces: [
        // 1. 车顶 (Roof: X=110..138, Y=80..168)
        {
          id: 'roof',
          name: '车顶',
          slotName: 'roof',
          vertices3D: [[-14, 58, 44], [14, 58, 44], [-14, 58, -44], [14, 58, -44]],
          vertices2D: [
            [110, 168],
            [138, 168],
            [110, 80],
            [138, 80]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 110, y: 80 }, p2: { x: 138, y: 80 } },
            { type: 'mountain', p1: { x: 138, y: 80 }, p2: { x: 138, y: 168 } },
            { type: 'mountain', p1: { x: 138, y: 168 }, p2: { x: 110, y: 168 } },
            { type: 'mountain', p1: { x: 110, y: 168 }, p2: { x: 110, y: 80 } }
          ]
        },
        // 2. 左侧双层车身 (Left Side: X=52..110, Y=80..168)
        {
          id: 'side_left',
          name: '左侧双层车身',
          slotName: 'side_left',
          vertices3D: [[-14, 58, 44], [-14, 58, -44], [-14, 0, 44], [-14, 0, -44]],
          vertices2D: [
            [110, 168],
            [110, 80],
            [52, 168],
            [52, 80]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 52, y: 80 }, p2: { x: 110, y: 80 } },
            { type: 'cut', p1: { x: 52, y: 168 }, p2: { x: 110, y: 168 } }
          ],
          tabs: [
            {
              id: 'tab_l_front',
              label: 'A1',
              edgeIndex: 2,
              p1: { x: 52, y: 168 },
              p2: { x: 110, y: 168 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_l_back',
              label: 'B1',
              edgeIndex: 1,
              p1: { x: 110, y: 80 },
              p2: { x: 52, y: 80 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        // 3. 车底 (Bottom: X=24..52, Y=80..168)
        {
          id: 'bottom',
          name: '底盘与窄轨转向架',
          slotName: 'bottom',
          vertices3D: [[-14, 0, 44], [14, 0, 44], [-14, 0, -44], [14, 0, -44]],
          vertices2D: [
            [52, 168],
            [24, 168],
            [52, 80],
            [24, 80]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 52, y: 80 }, p2: { x: 52, y: 168 } }
          ]
        },
        // 4. 右侧双层车身 (Right Side: X=138..196, Y=80..168)
        {
          id: 'side_right',
          name: '右侧双层车身 (带门)',
          slotName: 'side_right',
          vertices3D: [[14, 58, -44], [14, 58, 44], [14, 0, -44], [14, 0, 44]],
          vertices2D: [
            [138, 80],
            [138, 168],
            [196, 80],
            [196, 168]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 138, y: 80 }, p2: { x: 196, y: 80 } },
            { type: 'cut', p1: { x: 138, y: 168 }, p2: { x: 196, y: 168 } }
          ],
          tabs: [
            {
              id: 'tab_r_front',
              label: 'A2',
              edgeIndex: 3,
              p1: { x: 138, y: 168 },
              p2: { x: 196, y: 168 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_r_back',
              label: 'B2',
              edgeIndex: 2,
              p1: { x: 196, y: 80 },
              p2: { x: 138, y: 80 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        // 5. 车头前脸 (Front: X=110..138, Y=168..226)
        {
          id: 'front',
          name: '车头前脸 (双层前窗与行先板)',
          slotName: 'front',
          vertices3D: [[-14, 58, 44], [14, 58, 44], [-14, 0, 44], [14, 0, 44]],
          vertices2D: [
            [110, 168],
            [138, 168],
            [110, 226],
            [138, 226]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 110, y: 168 }, p2: { x: 138, y: 168 } }
          ],
          tabs: [
            {
              id: 'tab_f_bottom',
              label: 'C1',
              edgeIndex: 2,
              p1: { x: 110, y: 226 },
              p2: { x: 138, y: 226 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'bottom'
            }
          ]
        },
        // 6. 车尾后脸 (Back: X=110..138, Y=22..80)
        {
          id: 'back',
          name: '车尾后脸',
          slotName: 'back',
          vertices3D: [[14, 58, -44], [-14, 58, -44], [14, 0, -44], [-14, 0, -44]],
          vertices2D: [
            [138, 80],
            [110, 80],
            [138, 22],
            [110, 22]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 110, y: 80 }, p2: { x: 138, y: 80 } }
          ],
          tabs: [
            {
              id: 'tab_b_bottom',
              label: 'D1',
              edgeIndex: 2,
              p1: { x: 138, y: 22 },
              p2: { x: 110, y: 22 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'bottom'
            }
          ]
        }
      ]
    },
    // 配件：车顶集电杆 (Roof Trolley Pole)
    {
      id: 'hk-tram-trolley-pole',
      name: '车顶立体集电杆配件',
      faces: [
        {
          id: 'pole_top',
          name: '集电滑块与杆体',
          slotName: 'roof',
          vertices3D: [[-6, 68, 6], [6, 68, 6], [-6, 58, -6], [6, 58, -6]],
          vertices2D: [
            [150, 20],
            [170, 20],
            [150, 48],
            [170, 48]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 150, y: 34 }, p2: { x: 170, y: 34 } }
          ],
          tabs: [
            {
              id: 'tab_pole_base',
              label: 'TP',
              edgeIndex: 0,
              p1: { x: 150, y: 20 },
              p2: { x: 170, y: 20 },
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

export const consistHKTram: TrainModelConsist = {
  id: 'hk-tram-consist',
  name: "香港双层电车",
  nameEn: "Hong Kong double-decker tram",
  category: 'commuter',
  description: "窄体双层有轨电车，可选绿、红绿或蓝色涂装。",
  descriptionEn: "Narrow double-deck tram with green, red/green or blue liveries.",
  difficulty: 'easy',
  recommendedAge: '6-12 岁',
  estimatedTimePerCar: '15 分钟',
  defaultThemeId: 'hk-tram-green',
  assembly: {
    type: 'single',
    allowConsistCount: false,
    defaultMiddleCarCount: 0,
    maxMiddleCars: 0
  },
  customization: {
    textSlots: [
      {
        key: 'trainNumber',
        label: '电车车号 (如：120号)',
        labelEn: 'Tram Number',
        placeholder: '如：120 / 88 / 168',
        placeholderEn: 'e.g. 120',
        defaultValue: '120',
        targetSlot: 'front'
      },
      {
        key: 'destination',
        label: '运行总站 (行先方向)',
        labelEn: 'Destination Blind',
        placeholder: '如：堅尼地城 ⇋ 跑馬地 / 中環 ⇋ 筲箕灣',
        placeholderEn: 'e.g. Kennedy Town ⇋ Happy Valley',
        defaultValue: '堅尼地城 ⇋ 跑馬地',
        targetSlot: 'front'
      },
      {
        key: 'kidName',
        label: '车身标牌 / 赞助广告商',
        labelEn: 'Livery Sponsor / Tag',
        placeholder: '如：香港電車 / HONG KONG TRAMWAYS',
        placeholderEn: 'e.g. HONG KONG TRAMWAYS',
        defaultValue: '香港電車 HKTRAMS',
        targetSlot: 'side_left'
      }
    ]
  },
  carDefinitions: {
    head: {
      type: 'head',
      name: '双层叮叮车主体',
      nameEn: 'Double-Decker Tram Body',
      description: '高耸双层复古车身与车顶集电杆',
      descriptionEn: 'Tall double-decker tram body with trolley pole',
      schema: hkTramBodySchema
    }
  }
}
