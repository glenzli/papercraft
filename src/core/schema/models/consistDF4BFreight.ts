// 东风 4B 经典重载货运火车 (DF4B Heavy Freight Train & Containers)
// 包含东风4B重载内燃机车头 + 集装箱平车 (带可拆卸立体集装箱) + 散货煤炭敞车
import { TrainModelConsist } from '../consistSchema'
import { PapercraftModelSchema } from '../papercraftSchema'

// 1. 东风 4B 重载内燃机车头 (DF4B Heavy Diesel Locomotive / 140mm)
const df4bLocomotiveSchema: PapercraftModelSchema = {
  version: '2.0',
  id: 'df4b-locomotive-head',
  name: '东风 4B 重载内燃机车',
  nameEn: 'DF4B Heavy Diesel Locomotive',
  category: 'commuter',
  difficulty: 'medium',
  recommendedAge: '6-12 岁',
  estimatedTime: '20 分钟',
  description: '中国铁路经典大功率重载干线内燃机车，带双前倾观察窗、车顶散热风扇与前排障器。',
  dimensions: {
    length: 140,
    width: 38,
    height: 44
  },
  parts: [
    {
      id: 'df4b-loco-body',
      name: '机车车身展开面',
      faces: [
        // 1. 车顶 (Roof: X=86..124, Y=60..200)
        {
          id: 'roof',
          name: '车顶 (百叶散热风扇与排气管)',
          slotName: 'roof',
          vertices3D: [[-19, 44, 70], [19, 44, 70], [-19, 44, -70], [19, 44, -70]],
          vertices2D: [
            [86, 60 + 140],
            [86 + 38, 60 + 140],
            [86, 60],
            [86 + 38, 60]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 86, y: 60 }, p2: { x: 86 + 38, y: 60 } },
            { type: 'mountain', p1: { x: 86 + 38, y: 60 }, p2: { x: 86 + 38, y: 60 + 140 } },
            { type: 'mountain', p1: { x: 86 + 38, y: 60 + 140 }, p2: { x: 86, y: 60 + 140 } },
            { type: 'mountain', p1: { x: 86, y: 60 + 140 }, p2: { x: 86, y: 60 } }
          ]
        },
        // 2. 左侧车身 (Left Side: X=42..86, Y=60..200)
        {
          id: 'side_left',
          name: '左侧机舱壁 (百叶窗+机械室门)',
          slotName: 'side_left',
          vertices3D: [[-19, 44, 70], [-19, 44, -70], [-19, 0, 70], [-19, 0, -70]],
          vertices2D: [
            [86, 60 + 140],
            [86, 60],
            [86 - 44, 60 + 140],
            [86 - 44, 60]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 86 - 44, y: 60 }, p2: { x: 86, y: 60 } },
            { type: 'cut', p1: { x: 86 - 44, y: 60 + 140 }, p2: { x: 86, y: 60 + 140 } }
          ],
          tabs: [
            {
              id: 'tab_df_l_front',
              label: 'A1',
              edgeIndex: 2,
              p1: { x: 86 - 44, y: 60 + 140 },
              p2: { x: 86, y: 60 + 140 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_df_l_back',
              label: 'B1',
              edgeIndex: 1,
              p1: { x: 86, y: 60 },
              p2: { x: 86 - 44, y: 60 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        // 3. 车底 (Bottom: X=4..42, Y=60..200)
        {
          id: 'bottom',
          name: '重载机车底盘与大燃油箱',
          slotName: 'bottom',
          vertices3D: [[-19, 0, 70], [19, 0, 70], [-19, 0, -70], [19, 0, -70]],
          vertices2D: [
            [86 - 44, 60 + 140],
            [86 - 44 - 38, 60 + 140],
            [86 - 44, 60],
            [86 - 44 - 38, 60]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 86 - 44, y: 60 }, p2: { x: 86 - 44, y: 60 + 140 } }
          ],
          tabs: [
            {
              id: 'tab_df_bottom_outer',
              label: 'C1',
              edgeIndex: 3,
              p1: { x: 86 - 44 - 38, y: 60 },
              p2: { x: 86 - 44 - 38, y: 60 + 140 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'side_right'
            }
          ]
        },
        // 4. 右侧车身 (Right Side: X=124..168, Y=60..200)
        {
          id: 'side_right',
          name: '右侧机舱壁',
          slotName: 'side_right',
          vertices3D: [[19, 44, -70], [19, 44, 70], [19, 0, -70], [19, 0, 70]],
          vertices2D: [
            [124, 60],
            [124, 60 + 140],
            [124 + 44, 60],
            [124 + 44, 60 + 140]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 124, y: 60 }, p2: { x: 124 + 44, y: 60 } },
            { type: 'cut', p1: { x: 124, y: 60 + 140 }, p2: { x: 124 + 44, y: 60 + 140 } }
          ],
          tabs: [
            {
              id: 'tab_df_r_front',
              label: 'A2',
              edgeIndex: 2,
              p1: { x: 124, y: 60 + 140 },
              p2: { x: 124 + 44, y: 60 + 140 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_df_r_back',
              label: 'B2',
              edgeIndex: 1,
              p1: { x: 124 + 44, y: 60 },
              p2: { x: 124, y: 60 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        // 5. 机车前端大面罩 (Front: X=86..124, Y=200..244)
        {
          id: 'front',
          name: 'I端机车头 (观察窗/红五星/排障器)',
          slotName: 'front',
          vertices3D: [[-19, 44, 70], [19, 44, 70], [-19, 0, 70], [19, 0, 70]],
          vertices2D: [
            [86, 60 + 140],
            [124, 60 + 140],
            [86, 60 + 140 + 44],
            [124, 60 + 140 + 44]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 86, y: 60 + 140 + 44 }, p2: { x: 124, y: 60 + 140 + 44 } }
          ],
          tabs: [
            {
              id: 'tab_df_front_bottom',
              label: 'C2',
              edgeIndex: 3,
              p1: { x: 86, y: 60 + 140 + 44 },
              p2: { x: 124, y: 60 + 140 + 44 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'bottom'
            }
          ]
        },
        // 6. II端机车后端 (Back: X=86..124, Y=16..60)
        {
          id: 'back',
          name: 'II端机车后部',
          slotName: 'back',
          vertices3D: [[19, 44, -70], [-19, 44, -70], [19, 0, -70], [-19, 0, -70]],
          vertices2D: [
            [124, 60],
            [86, 60],
            [124, 60 - 44],
            [86, 60 - 44]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 86, y: 60 - 44 }, p2: { x: 124, y: 60 - 44 } }
          ],
          tabs: [
            {
              id: 'tab_df_back_bottom',
              label: 'C3',
              edgeIndex: 3,
              p1: { x: 124, y: 60 - 44 },
              p2: { x: 86, y: 60 - 44 },
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

// 2. 集装箱平板货车 (Container Flatcar with Containers / 130mm)
const containerFlatcarSchema: PapercraftModelSchema = {
  version: '2.0',
  id: 'container-flatcar-car',
  name: '铁路集装箱平车 (中远海运/中欧班列)',
  nameEn: 'Railway Container Flatcar',
  category: 'commuter',
  difficulty: 'easy',
  recommendedAge: '6-12 岁',
  estimatedTime: '15 分钟',
  description: '重载集装箱专用平车，包含平板底盘与可独立折叠国际标准集装箱。',
  dimensions: {
    length: 130,
    width: 38,
    height: 44
  },
  parts: [
    {
      id: 'container-car-body',
      name: '集装箱平车车身展开面',
      faces: [
        {
          id: 'roof',
          name: '集装箱顶板 (瓦楞钢板结构)',
          slotName: 'roof',
          vertices3D: [[-19, 44, 65], [19, 44, 65], [-19, 44, -65], [19, 44, -65]],
          vertices2D: [
            [86, 60 + 130],
            [86 + 38, 60 + 130],
            [86, 60],
            [86 + 38, 60]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 86, y: 60 }, p2: { x: 86 + 38, y: 60 } },
            { type: 'mountain', p1: { x: 86 + 38, y: 60 }, p2: { x: 86 + 38, y: 60 + 130 } },
            { type: 'mountain', p1: { x: 86 + 38, y: 60 + 130 }, p2: { x: 86, y: 60 + 130 } },
            { type: 'mountain', p1: { x: 86, y: 60 + 130 }, p2: { x: 86, y: 60 } }
          ]
        },
        {
          id: 'side_left',
          name: '集装箱左侧身 (COSCO / CR Express 徽标)',
          slotName: 'side_left',
          vertices3D: [[-19, 44, 65], [-19, 44, -65], [-19, 0, 65], [-19, 0, -65]],
          vertices2D: [
            [86, 60 + 130],
            [86, 60],
            [86 - 44, 60 + 130],
            [86 - 44, 60]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 86 - 44, y: 60 }, p2: { x: 86, y: 60 } },
            { type: 'cut', p1: { x: 86 - 44, y: 60 + 130 }, p2: { x: 86, y: 60 + 130 } }
          ],
          tabs: [
            {
              id: 'tab_fc_l_f',
              label: 'K1',
              edgeIndex: 2,
              p1: { x: 86 - 44, y: 60 + 130 },
              p2: { x: 86, y: 60 + 130 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_fc_l_b',
              label: 'K2',
              edgeIndex: 1,
              p1: { x: 86, y: 60 },
              p2: { x: 86 - 44, y: 60 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        {
          id: 'bottom',
          name: '重载平车底盘',
          slotName: 'bottom',
          vertices3D: [[-19, 0, 65], [19, 0, 65], [-19, 0, -65], [19, 0, -65]],
          vertices2D: [
            [86 - 44, 60 + 130],
            [86 - 44 - 38, 60 + 130],
            [86 - 44, 60],
            [86 - 44 - 38, 60]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 86 - 44, y: 60 }, p2: { x: 86 - 44, y: 60 + 130 } }
          ],
          tabs: [
            {
              id: 'tab_fc_bottom_outer',
              label: 'KC',
              edgeIndex: 3,
              p1: { x: 86 - 44 - 38, y: 60 },
              p2: { x: 86 - 44 - 38, y: 60 + 130 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'side_right'
            }
          ]
        },
        {
          id: 'side_right',
          name: '集装箱右侧身',
          slotName: 'side_right',
          vertices3D: [[19, 44, -65], [19, 44, 65], [19, 0, -65], [19, 0, 65]],
          vertices2D: [
            [124, 60],
            [124, 60 + 130],
            [124 + 44, 60],
            [124 + 44, 60 + 130]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 124, y: 60 }, p2: { x: 124 + 44, y: 60 } },
            { type: 'cut', p1: { x: 124, y: 60 + 130 }, p2: { x: 124 + 44, y: 60 + 130 } }
          ],
          tabs: [
            {
              id: 'tab_fc_r_f',
              label: 'K3',
              edgeIndex: 2,
              p1: { x: 124, y: 60 + 130 },
              p2: { x: 124 + 44, y: 60 + 130 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_fc_r_b',
              label: 'K4',
              edgeIndex: 1,
              p1: { x: 124 + 44, y: 60 },
              p2: { x: 124, y: 60 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        {
          id: 'front',
          name: '集装箱双开箱门端',
          slotName: 'front',
          vertices3D: [[-19, 44, 65], [19, 44, 65], [-19, 0, 65], [19, 0, 65]],
          vertices2D: [
            [86, 60 + 130],
            [124, 60 + 130],
            [86, 60 + 130 + 44],
            [124, 60 + 130 + 44]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 86, y: 60 + 130 + 44 }, p2: { x: 124, y: 60 + 130 + 44 } }
          ],
          tabs: [
            {
              id: 'tab_fc_front_bottom',
              label: 'KF',
              edgeIndex: 3,
              p1: { x: 86, y: 60 + 130 + 44 },
              p2: { x: 124, y: 60 + 130 + 44 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'bottom'
            }
          ]
        },
        {
          id: 'back',
          name: '集装箱盲端面板',
          slotName: 'back',
          vertices3D: [[19, 44, -65], [-19, 44, -65], [19, 0, -65], [-19, 0, -65]],
          vertices2D: [
            [124, 60],
            [86, 60],
            [124, 60 - 44],
            [86, 60 - 44]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 86, y: 60 - 44 }, p2: { x: 124, y: 60 - 44 } }
          ],
          tabs: [
            {
              id: 'tab_fc_back_bottom',
              label: 'KB',
              edgeIndex: 3,
              p1: { x: 124, y: 60 - 44 },
              p2: { x: 86, y: 60 - 44 },
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

// 3. 散货煤炭敞车 (Open Coal Hopper Car / 120mm)
const coalGondolaSchema: PapercraftModelSchema = {
  version: '2.0',
  id: 'coal-gondola-car',
  name: '铁路散货敞车 (煤炭/矿石运输)',
  nameEn: 'Open Coal Hopper Car',
  category: 'commuter',
  difficulty: 'easy',
  recommendedAge: '6-12 岁',
  estimatedTime: '15 分钟',
  description: 'C70 经典下沉式铁路敞车，带强化加强筋与立体煤炭装载纹理。',
  dimensions: {
    length: 120,
    width: 38,
    height: 44
  },
  parts: [
    {
      id: 'gondola-car-body',
      name: '敞车车身展开面',
      faces: [
        {
          id: 'roof',
          name: '顶部装煤口 (立体煤堆纹理)',
          slotName: 'roof',
          vertices3D: [[-19, 44, 60], [19, 44, 60], [-19, 44, -60], [19, 44, -60]],
          vertices2D: [
            [86, 60 + 120],
            [86 + 38, 60 + 120],
            [86, 60],
            [86 + 38, 60]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 86, y: 60 }, p2: { x: 86 + 38, y: 60 } },
            { type: 'mountain', p1: { x: 86 + 38, y: 60 }, p2: { x: 86 + 38, y: 60 + 120 } },
            { type: 'mountain', p1: { x: 86 + 38, y: 60 + 120 }, p2: { x: 86, y: 60 + 120 } },
            { type: 'mountain', p1: { x: 86, y: 60 + 120 }, p2: { x: 86, y: 60 } }
          ]
        },
        {
          id: 'side_left',
          name: '左侧加强筋板',
          slotName: 'side_left',
          vertices3D: [[-19, 44, 60], [-19, 44, -60], [-19, 0, 60], [-19, 0, -60]],
          vertices2D: [
            [86, 60 + 120],
            [86, 60],
            [86 - 44, 60 + 120],
            [86 - 44, 60]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 86 - 44, y: 60 }, p2: { x: 86, y: 60 } },
            { type: 'cut', p1: { x: 86 - 44, y: 60 + 120 }, p2: { x: 86, y: 60 + 120 } }
          ],
          tabs: [
            {
              id: 'tab_gn_l_f',
              label: 'G1',
              edgeIndex: 2,
              p1: { x: 86 - 44, y: 60 + 120 },
              p2: { x: 86, y: 60 + 120 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_gn_l_b',
              label: 'G2',
              edgeIndex: 1,
              p1: { x: 86, y: 60 },
              p2: { x: 86 - 44, y: 60 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        {
          id: 'bottom',
          name: '敞车车底与卸货漏斗底',
          slotName: 'bottom',
          vertices3D: [[-19, 0, 60], [19, 0, 60], [-19, 0, -60], [19, 0, -60]],
          vertices2D: [
            [86 - 44, 60 + 120],
            [86 - 44 - 38, 60 + 120],
            [86 - 44, 60],
            [86 - 44 - 38, 60]
          ],
          uvCoords: [[0, 0], [1, 0], [0, 1], [1, 1]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'mountain', p1: { x: 86 - 44, y: 60 }, p2: { x: 86 - 44, y: 60 + 120 } }
          ],
          tabs: [
            {
              id: 'tab_gn_bottom_outer',
              label: 'GC',
              edgeIndex: 3,
              p1: { x: 86 - 44 - 38, y: 60 },
              p2: { x: 86 - 44 - 38, y: 60 + 120 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'side_right'
            }
          ]
        },
        {
          id: 'side_right',
          name: '右侧加强筋板',
          slotName: 'side_right',
          vertices3D: [[19, 44, -60], [19, 44, 60], [19, 0, -60], [19, 0, 60]],
          vertices2D: [
            [124, 60],
            [124, 60 + 120],
            [124 + 44, 60],
            [124 + 44, 60 + 120]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 124, y: 60 }, p2: { x: 124 + 44, y: 60 } },
            { type: 'cut', p1: { x: 124, y: 60 + 120 }, p2: { x: 124 + 44, y: 60 + 120 } }
          ],
          tabs: [
            {
              id: 'tab_gn_r_f',
              label: 'G3',
              edgeIndex: 2,
              p1: { x: 124, y: 60 + 120 },
              p2: { x: 124 + 44, y: 60 + 120 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_gn_r_b',
              label: 'G4',
              edgeIndex: 1,
              p1: { x: 124 + 44, y: 60 },
              p2: { x: 124, y: 60 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        {
          id: 'front',
          name: '敞车端板 (带爬梯与车钩)',
          slotName: 'front',
          vertices3D: [[-19, 44, 60], [19, 44, 60], [-19, 0, 60], [19, 0, 60]],
          vertices2D: [
            [86, 60 + 120],
            [124, 60 + 120],
            [86, 60 + 120 + 44],
            [124, 60 + 120 + 44]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 86, y: 60 + 120 + 44 }, p2: { x: 124, y: 60 + 120 + 44 } }
          ],
          tabs: [
            {
              id: 'tab_gn_front_bottom',
              label: 'GF',
              edgeIndex: 3,
              p1: { x: 86, y: 60 + 120 + 44 },
              p2: { x: 124, y: 60 + 120 + 44 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'bottom'
            }
          ]
        },
        {
          id: 'back',
          name: '敞车尾端板',
          slotName: 'back',
          vertices3D: [[19, 44, -60], [-19, 44, -60], [19, 0, -60], [-19, 0, -60]],
          vertices2D: [
            [124, 60],
            [86, 60],
            [124, 60 - 44],
            [86, 60 - 44]
          ],
          uvCoords: [[0, 1], [1, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 1, 3, 2],
          creases: [
            { type: 'cut', p1: { x: 86, y: 60 - 44 }, p2: { x: 124, y: 60 - 44 } }
          ],
          tabs: [
            {
              id: 'tab_gn_back_bottom',
              label: 'GB',
              edgeIndex: 3,
              p1: { x: 124, y: 60 - 44 },
              p2: { x: 86, y: 60 - 44 },
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

export const consistDF4BFreight: TrainModelConsist = {
  id: 'df4b-freight-consist',
  name: "东风4B 货运列车",
  nameEn: "DF4B freight train",
  category: 'commuter',
  description: "内燃机车与货车编组，可选多种货运配色。",
  descriptionEn: "Diesel locomotive and freight cars with several freight-inspired liveries.",
  difficulty: 'medium',
  recommendedAge: '6-12 岁',
  estimatedTimePerCar: '15 分钟',
  defaultThemeId: 'df4b-watermelon',
  assembly: {
    type: 'consist',
    allowConsistCount: true,
    defaultMiddleCarCount: 2,
    maxMiddleCars: 5
  },
  customization: {
    textSlots: [
      {
        key: 'trainNumber',
        label: '机车车号',
        labelEn: 'Locomotive Number',
        placeholder: '如：DF4B-2121 / EF510-1 / BNSF 7210',
        placeholderEn: 'e.g. DF4B-2121 / EF510-1',
        defaultValue: '',
        targetSlot: 'front'
      },
      {
        key: 'destination',
        label: '运行班列 / 区段',
        labelEn: 'Freight Route',
        placeholder: '如：中欧班列 / JRF 貨物高速 / 80001次重载',
        placeholderEn: 'e.g. CR Express / JRF Freight',
        defaultValue: '',
        targetSlot: 'side_left'
      },
      {
        key: 'operator',
        label: '运营机构 / 铁路所属局段',
        labelEn: 'Railway Bureau / Operator',
        placeholder: '如：京局京段 / JR 貨物 JRF',
        placeholderEn: 'e.g. CR Beijing / JR Freight',
        defaultValue: '',
        targetSlot: 'side_left'
      }
    ]
  },
  carDefinitions: {
    head: {
      type: 'head',
      name: '东风4B 重载内燃机车',
      nameEn: 'DF4B Heavy Diesel Locomotive',
      description: '大功率内燃机车头（双端驾驶台）',
      descriptionEn: 'High-power main line diesel locomotive',
      schema: df4bLocomotiveSchema
    },
    middle: {
      type: 'middle',
      name: '集装箱平车 (中远海运/中欧班列)',
      nameEn: 'Container Flatcar (COSCO / CR Express)',
      description: '重载集装箱平板货运车厢',
      descriptionEn: 'Intermodal freight container flatcar',
      schema: containerFlatcarSchema
    },
    tail: {
      type: 'tail',
      name: '散货煤炭敞车 (C70)',
      nameEn: 'Open Coal Hopper Car (C70)',
      description: '重载煤炭矿石散货运输敞车',
      descriptionEn: 'Heavy gondola open hopper car',
      schema: coalGondolaSchema
    }
  }
}
