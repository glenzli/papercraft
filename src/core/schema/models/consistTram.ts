// 经典有轨电车与街头轻轨 (Heritage Streetcar & Modern Tram / 镰仓江之电)
// 包含先头车（带立体车顶受电弓）+ 中间铰接客车 + 尾部驾驶车
import { TrainModelConsist } from '../consistSchema'
import { PapercraftModelSchema } from '../papercraftSchema'

// 1. 先头车 (Head Tram with Pantograph / 95mm)
const tramHeadSchema: PapercraftModelSchema = {
  version: '2.0',
  id: 'tram-head-car',
  name: '有轨电车 - 先头驾驶车 (带受电弓)',
  nameEn: 'Streetcar Tram - Lead Cab (with Pantograph)',
  category: 'commuter',
  difficulty: 'medium',
  recommendedAge: '6-12 岁',
  estimatedTime: '20 分钟',
  description: '有轨电车先头车，包含经典复古大风挡、车顶折叠受电弓与低地板客舱。',
  dimensions: {
    length: 95,
    width: 36,
    height: 44
  },
  parts: [
    {
      id: 'tram-head-body',
      name: '电车先头车体展开面',
      faces: [
        // 1. 车顶 (Roof: X=85..121, Y=60..155)
        {
          id: 'roof',
          name: '车顶 (受电弓基座)',
          slotName: 'roof',
          vertices3D: [[-18, 44, 47.5], [18, 44, 47.5], [-18, 44, -47.5], [18, 44, -47.5]],
          vertices2D: [
            [85, 60 + 95],
            [85 + 36, 60 + 95],
            [85, 60],
            [85 + 36, 60]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 85, y: 60 }, p2: { x: 85 + 36, y: 60 } },
            { type: 'mountain', p1: { x: 85 + 36, y: 60 }, p2: { x: 85 + 36, y: 60 + 95 } },
            { type: 'mountain', p1: { x: 85 + 36, y: 60 + 95 }, p2: { x: 85, y: 60 + 95 } },
            { type: 'mountain', p1: { x: 85, y: 60 + 95 }, p2: { x: 85, y: 60 } }
          ]
        },
        // 2. 左侧车身 (Left Side: X=41..85, Y=60..155)
        {
          id: 'side_left',
          name: '左侧电车身',
          slotName: 'side_left',
          vertices3D: [[-18, 44, 47.5], [-18, 44, -47.5], [-18, 0, 47.5], [-18, 0, -47.5]],
          vertices2D: [
            [85, 60 + 95],
            [85, 60],
            [85 - 44, 60 + 95],
            [85 - 44, 60]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 85 - 44, y: 60 }, p2: { x: 85, y: 60 } },
            { type: 'cut', p1: { x: 85 - 44, y: 60 + 95 }, p2: { x: 85, y: 60 + 95 } }
          ],
          tabs: [
            {
              id: 'tab_t_l_front',
              label: 'A1',
              edgeIndex: 2,
              p1: { x: 85 - 44, y: 60 + 95 },
              p2: { x: 85, y: 60 + 95 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_t_l_back',
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
        // 3. 车底 (Bottom: X=5..41, Y=60..155)
        {
          id: 'bottom',
          name: '电车底盘',
          slotName: 'bottom',
          vertices3D: [[-18, 0, 47.5], [18, 0, 47.5], [-18, 0, -47.5], [18, 0, -47.5]],
          vertices2D: [
            [85 - 44, 60 + 95],
            [85 - 44 - 36, 60 + 95],
            [85 - 44, 60],
            [85 - 44 - 36, 60]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 85 - 44, y: 60 }, p2: { x: 85 - 44, y: 60 + 95 } }
          ],
          tabs: [
            {
              id: 'tab_t_bottom_outer',
              label: 'C1',
              edgeIndex: 3,
              p1: { x: 85 - 44 - 36, y: 60 },
              p2: { x: 85 - 44 - 36, y: 60 + 95 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'side_right'
            }
          ]
        },
        // 4. 右侧车身 (Right Side: X=121..165, Y=60..155)
        {
          id: 'side_right',
          name: '右侧电车身',
          slotName: 'side_right',
          vertices3D: [[18, 44, -47.5], [18, 44, 47.5], [18, 0, -47.5], [18, 0, 47.5]],
          vertices2D: [
            [121, 60],
            [121, 60 + 95],
            [121 + 44, 60],
            [121 + 44, 60 + 95]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 121, y: 60 }, p2: { x: 121 + 44, y: 60 } },
            { type: 'cut', p1: { x: 121, y: 60 + 95 }, p2: { x: 121 + 44, y: 60 + 95 } }
          ],
          tabs: [
            {
              id: 'tab_t_r_front',
              label: 'A2',
              edgeIndex: 2,
              p1: { x: 121, y: 60 + 95 },
              p2: { x: 121 + 44, y: 60 + 95 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_t_r_back',
              label: 'B2',
              edgeIndex: 1,
              p1: { x: 121 + 44, y: 60 },
              p2: { x: 121, y: 60 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        // 5. 电车前脸 (Front: X=85..121, Y=155..199)
        {
          id: 'front',
          name: '前驾驶室 (观景大挡风)',
          slotName: 'front',
          vertices3D: [[-18, 44, 47.5], [18, 44, 47.5], [-18, 0, 47.5], [18, 0, 47.5]],
          vertices2D: [
            [85, 60 + 95],
            [121, 60 + 95],
            [85, 60 + 95 + 44],
            [121, 60 + 95 + 44]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 85, y: 60 + 95 + 44 }, p2: { x: 121, y: 60 + 95 + 44 } }
          ],
          tabs: [
            {
              id: 'tab_t_front_bottom',
              label: 'C2',
              edgeIndex: 3,
              p1: { x: 85, y: 60 + 95 + 44 },
              p2: { x: 121, y: 60 + 95 + 44 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'bottom'
            }
          ]
        },
        // 6. 尾部连接风挡面 (Back: X=85..121, Y=16..60)
        {
          id: 'back',
          name: '后部连接贯通道口',
          slotName: 'back',
          vertices3D: [[18, 44, -47.5], [-18, 44, -47.5], [18, 0, -47.5], [-18, 0, -47.5]],
          vertices2D: [
            [121, 60],
            [85, 60],
            [121, 60 - 44],
            [85, 60 - 44]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 85, y: 60 - 44 }, p2: { x: 121, y: 60 - 44 } }
          ],
          tabs: [
            {
              id: 'tab_t_back_bottom',
              label: 'C3',
              edgeIndex: 3,
              p1: { x: 121, y: 60 - 44 },
              p2: { x: 85, y: 60 - 44 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'bottom'
            }
          ]
        }
      ]
    },
    // 配件：车顶金属立体菱形受电弓 (Roof Pantograph)
    {
      id: 'tram-pantograph',
      name: '车顶立体折叠受电弓',
      faces: [
        {
          id: 'panto_arm',
          name: '受电弓滑板与连杆',
          slotName: 'roof',
          vertices3D: [[-10, 56, 10], [10, 56, 10], [-10, 44, -10], [10, 44, -10]],
          vertices2D: [
            [170, 60],
            [170 + 20, 60],
            [170, 60 + 35],
            [170 + 20, 60 + 35]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 170, y: 60 + 17 }, p2: { x: 170 + 20, y: 60 + 17 } }
          ],
          tabs: [
            {
              id: 'tab_panto_base',
              label: 'PT',
              edgeIndex: 0,
              p1: { x: 170, y: 60 },
              p2: { x: 170 + 20, y: 60 },
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

// 2. 中间铰接客车 (Middle Tram / 85mm)
const tramMiddleSchema: PapercraftModelSchema = {
  version: '2.0',
  id: 'tram-middle-car',
  name: '有轨电车 - 中间客车',
  nameEn: 'Streetcar Tram - Middle Coach',
  category: 'vehicle',
  difficulty: 'easy',
  recommendedAge: '6-12 岁',
  estimatedTime: '15 分钟',
  description: '双向贯通铰接客舱，带大开度全景落地窗与低地板车身。',
  dimensions: {
    length: 85,
    width: 36,
    height: 44
  },
  parts: [
    {
      id: 'tram-middle-body',
      name: '中间客车展开面',
      faces: [
        {
          id: 'roof',
          name: '车顶',
          slotName: 'roof',
          vertices3D: [[-18, 44, 42.5], [18, 44, 42.5], [-18, 44, -42.5], [18, 44, -42.5]],
          vertices2D: [
            [85, 60 + 85],
            [85 + 36, 60 + 85],
            [85, 60],
            [85 + 36, 60]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 85, y: 60 }, p2: { x: 85 + 36, y: 60 } },
            { type: 'mountain', p1: { x: 85 + 36, y: 60 }, p2: { x: 85 + 36, y: 60 + 85 } },
            { type: 'mountain', p1: { x: 85 + 36, y: 60 + 85 }, p2: { x: 85, y: 60 + 85 } },
            { type: 'mountain', p1: { x: 85, y: 60 + 85 }, p2: { x: 85, y: 60 } }
          ]
        },
        {
          id: 'side_left',
          name: '左侧客车身',
          slotName: 'side_left',
          vertices3D: [[-18, 44, 42.5], [-18, 44, -42.5], [-18, 0, 42.5], [-18, 0, -42.5]],
          vertices2D: [
            [85, 60 + 85],
            [85, 60],
            [85 - 44, 60 + 85],
            [85 - 44, 60]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 85 - 44, y: 60 }, p2: { x: 85, y: 60 } },
            { type: 'cut', p1: { x: 85 - 44, y: 60 + 85 }, p2: { x: 85, y: 60 + 85 } }
          ],
          tabs: [
            {
              id: 'tab_tm_l_f',
              label: 'M1',
              edgeIndex: 2,
              p1: { x: 85 - 44, y: 60 + 85 },
              p2: { x: 85, y: 60 + 85 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_tm_l_b',
              label: 'M2',
              edgeIndex: 1,
              p1: { x: 85, y: 60 },
              p2: { x: 85 - 44, y: 60 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        {
          id: 'bottom',
          name: '车底',
          slotName: 'bottom',
          vertices3D: [[-18, 0, 42.5], [18, 0, 42.5], [-18, 0, -42.5], [18, 0, -42.5]],
          vertices2D: [
            [85 - 44, 60 + 85],
            [85 - 44 - 36, 60 + 85],
            [85 - 44, 60],
            [85 - 44 - 36, 60]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 85 - 44, y: 60 }, p2: { x: 85 - 44, y: 60 + 85 } }
          ],
          tabs: [
            {
              id: 'tab_tm_bottom_outer',
              label: 'MC',
              edgeIndex: 3,
              p1: { x: 85 - 44 - 36, y: 60 },
              p2: { x: 85 - 44 - 36, y: 60 + 85 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'side_right'
            }
          ]
        },
        {
          id: 'side_right',
          name: '右侧客车身',
          slotName: 'side_right',
          vertices3D: [[18, 44, -42.5], [18, 44, 42.5], [18, 0, -42.5], [18, 0, 42.5]],
          vertices2D: [
            [121, 60],
            [121, 60 + 85],
            [121 + 44, 60],
            [121 + 44, 60 + 85]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 121, y: 60 }, p2: { x: 121 + 44, y: 60 } },
            { type: 'cut', p1: { x: 121, y: 60 + 85 }, p2: { x: 121 + 44, y: 60 + 85 } }
          ],
          tabs: [
            {
              id: 'tab_tm_r_f',
              label: 'M3',
              edgeIndex: 2,
              p1: { x: 121, y: 60 + 85 },
              p2: { x: 121 + 44, y: 60 + 85 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_tm_r_b',
              label: 'M4',
              edgeIndex: 1,
              p1: { x: 121 + 44, y: 60 },
              p2: { x: 121, y: 60 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        {
          id: 'front',
          name: '前端贯通铰接面',
          slotName: 'front',
          vertices3D: [[-18, 44, 42.5], [18, 44, 42.5], [-18, 0, 42.5], [18, 0, 42.5]],
          vertices2D: [
            [85, 60 + 85],
            [121, 60 + 85],
            [85, 60 + 85 + 44],
            [121, 60 + 85 + 44]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 85, y: 60 + 85 + 44 }, p2: { x: 121, y: 60 + 85 + 44 } }
          ],
          tabs: [
            {
              id: 'tab_tm_front_bottom',
              label: 'MF',
              edgeIndex: 3,
              p1: { x: 85, y: 60 + 85 + 44 },
              p2: { x: 121, y: 60 + 85 + 44 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'bottom'
            }
          ]
        },
        {
          id: 'back',
          name: '后端贯通铰接面',
          slotName: 'back',
          vertices3D: [[18, 44, -42.5], [-18, 44, -42.5], [18, 0, -42.5], [-18, 0, -42.5]],
          vertices2D: [
            [121, 60],
            [85, 60],
            [121, 60 - 44],
            [85, 60 - 44]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 85, y: 60 - 44 }, p2: { x: 121, y: 60 - 44 } }
          ],
          tabs: [
            {
              id: 'tab_tm_back_bottom',
              label: 'MB',
              edgeIndex: 3,
              p1: { x: 121, y: 60 - 44 },
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

export const consistTram: TrainModelConsist = {
  id: 'tram-consist',
  name: '镰仓江之电 300形 (江ノ電)',
  nameEn: 'Kamakura Enoden 300 Series (Streetcar Tram)',
  category: 'commuter',
  description: '湘南海岸传奇有轨电车，经典 2 两连结编组，标配车顶立体金属受电弓与「鎌倉 ⇋ 藤沢」行先木板。',
  descriptionEn: 'Iconic Shonan coast 2-car coupled heritage tramway featuring roof-mounted pantograph.',
  difficulty: 'medium',
  recommendedAge: '6-12 岁',
  estimatedTimePerCar: '15 分钟',
  defaultThemeId: 'tram-enoden-green',
  assembly: {
    type: 'consist',
    allowConsistCount: true,
    defaultMiddleCarCount: 0,
    maxMiddleCars: 2
  },
  customization: {
    textSlots: [
      {
        key: 'trainNumber',
        label: '电车车号 / 车系',
        labelEn: 'Tram Service / Car No.',
        placeholder: '如：江ノ電 305 / T-101',
        placeholderEn: 'e.g. Enoden 305 / Tram 101',
        defaultValue: '江ノ電 305',
        targetSlot: 'front'
      },
      {
        key: 'destination',
        label: '运行区间 (LED / 方向幕)',
        labelEn: 'Destination Blind',
        placeholder: '如：鎌倉 ⇋ 藤沢 / 中央站 ⇋ 滨海港湾',
        placeholderEn: 'e.g. Kamakura ⇋ Fujisawa',
        defaultValue: '鎌倉 ⇋ 藤沢',
        targetSlot: 'side_left'
      },
      {
        key: 'kidName',
        label: '电铁所属公司 / 铭牌',
        labelEn: 'Railway Operator',
        placeholder: '如：江之岛电铁 / 都市现代轻轨',
        placeholderEn: 'e.g. Enoshima Electric Railway',
        defaultValue: '江之岛电铁',
        targetSlot: 'side_left'
      }
    ]
  },
  carDefinitions: {
    head: {
      type: 'head',
      name: '先头驾驶车 (带受电弓)',
      nameEn: 'Lead Cab (with Pantograph)',
      description: '前驾驶室车厢与车顶立体受电弓',
      descriptionEn: 'Front cab with foldable metal pantograph',
      schema: tramHeadSchema
    },
    middle: {
      type: 'middle',
      name: '中间铰接客车',
      nameEn: 'Middle Articulated Coach',
      description: '双向贯通低地板落地窗客舱',
      descriptionEn: 'Articulated middle coach with large windows',
      schema: tramMiddleSchema
    },
    tail: {
      type: 'tail',
      name: '尾部驾驶车',
      nameEn: 'Rear Cab',
      description: '尾部双向驾驶室车厢',
      descriptionEn: 'Rear cab for bidirectional operations',
      schema: tramHeadSchema
    }
  }
}
