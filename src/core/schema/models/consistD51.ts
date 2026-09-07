// 大正复古蒸汽机车 (JR D51) 完整编组定义 (蒸汽机头 + 煤水车 + 复古客车厢，统一侧面车底紧凑展开)
import { TrainModelConsist } from '../consistSchema'
import { d51SteamSchema } from './d51Steam'
import { PapercraftModelSchema } from '../papercraftSchema'

// 1. 煤水车 (Tender Car: 紧随蒸汽机车后面的煤炭与水箱车)
const d51TenderSchema: PapercraftModelSchema = {
  version: '1.0',
  id: 'd51-tender-car',
  name: 'D51 煤水车 (Tender)',
  category: 'steam',
  difficulty: 'easy',
  recommendedAge: '8-14 岁',
  estimatedTime: '15-20 分钟',
  description: '紧跟在蒸汽机车头后面的煤炭储斗与水箱专用补给车。',
  dimensions: {
    length: 100,
    width: 38,
    height: 38
  },
  parts: [
    {
      id: 'd51-tender-body',
      name: '煤水车主体展开',
      faces: [
        // 1. 顶面 (Roof)
        {
          id: 'roof',
          name: '煤斗顶面',
          slotName: 'bottom',
          vertices3D: [[-19, 38, -50], [19, 38, -50], [19, 38, 50], [-19, 38, 50]],
          vertices2D: [
            [86, 56],
            [124, 56],
            [124, 156],
            [86, 156]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'mountain', p1: { x: 86, y: 56 }, p2: { x: 124, y: 56 } },
            { type: 'mountain', p1: { x: 124, y: 56 }, p2: { x: 124, y: 156 } },
            { type: 'mountain', p1: { x: 86, y: 156 }, p2: { x: 124, y: 156 } },
            { type: 'mountain', p1: { x: 86, y: 56 }, p2: { x: 86, y: 156 } }
          ]
        },
        // 2. 左侧面 (Left Side)
        {
          id: 'side_left',
          name: '左侧水箱壁',
          slotName: 'side_left',
          vertices3D: [[-19, 38, -50], [-19, 38, 50], [-19, 0, 50], [-19, 0, -50]],
          vertices2D: [
            [86, 56],
            [86, 156],
            [48, 156],
            [48, 56]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 48, y: 56 }, p2: { x: 86, y: 56 } },
            { type: 'cut', p1: { x: 48, y: 156 }, p2: { x: 86, y: 156 } }
          ],
          tabs: [
            {
              id: 'tab_tender_fl',
              label: 'A1',
              edgeIndex: 1,
              p1: { x: 48, y: 156 },
              p2: { x: 86, y: 156 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_tender_bl',
              label: 'B1',
              edgeIndex: 3,
              p1: { x: 86, y: 56 },
              p2: { x: 48, y: 56 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        // 3. 车底 (Bottom: 连在左侧身外沿)
        {
          id: 'bottom',
          name: '车底',
          slotName: 'bottom',
          vertices3D: [[-19, 0, -50], [-19, 0, 50], [19, 0, 50], [19, 0, -50]],
          vertices2D: [
            [48, 56],
            [48, 156],
            [10, 156],
            [10, 56]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 10, y: 56 }, p2: { x: 10, y: 156 } },
            { type: 'cut', p1: { x: 10, y: 56 }, p2: { x: 48, y: 56 } },
            { type: 'cut', p1: { x: 10, y: 156 }, p2: { x: 48, y: 156 } }
          ],
          tabs: [
            {
              id: 'tab_tender_bottom',
              label: 'D1',
              edgeIndex: 2,
              p1: { x: 10, y: 56 },
              p2: { x: 10, y: 156 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'side_right'
            }
          ]
        },
        // 4. 右侧面 (Right Side)
        {
          id: 'side_right',
          name: '右侧水箱壁',
          slotName: 'side_right',
          vertices3D: [[19, 38, -50], [19, 38, 50], [19, 0, 50], [19, 0, -50]],
          vertices2D: [
            [124, 56],
            [124, 156],
            [162, 156],
            [162, 56]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 162, y: 56 }, p2: { x: 162, y: 156 } },
            { type: 'cut', p1: { x: 124, y: 56 }, p2: { x: 162, y: 56 } },
            { type: 'cut', p1: { x: 124, y: 156 }, p2: { x: 162, y: 156 } }
          ],
          tabs: [
            {
              id: 'tab_tender_fr',
              label: 'A2',
              edgeIndex: 1,
              p1: { x: 124, y: 156 },
              p2: { x: 162, y: 156 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_tender_br',
              label: 'B2',
              edgeIndex: 3,
              p1: { x: 162, y: 56 },
              p2: { x: 124, y: 56 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        // 5. 前端 (Front)
        {
          id: 'front',
          name: '煤车前端',
          slotName: 'back',
          vertices3D: [[-19, 38, 50], [19, 38, 50], [19, 0, 50], [-19, 0, 50]],
          vertices2D: [
            [86, 156],
            [124, 156],
            [124, 194],
            [86, 194]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 86, y: 194 }, p2: { x: 124, y: 194 } },
            { type: 'cut', p1: { x: 86, y: 156 }, p2: { x: 86, y: 194 } },
            { type: 'cut', p1: { x: 124, y: 156 }, p2: { x: 124, y: 194 } }
          ]
        },
        // 6. 后端 (Back)
        {
          id: 'back',
          name: '煤车后端',
          slotName: 'back',
          vertices3D: [[19, 38, -50], [-19, 38, -50], [-19, 0, -50], [19, 0, -50]],
          vertices2D: [
            [124, 56],
            [86, 56],
            [86, 18],
            [124, 18]
          ],
          uvCoords: [[1, 1], [0, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 86, y: 18 }, p2: { x: 124, y: 18 } },
            { type: 'cut', p1: { x: 86, y: 18 }, p2: { x: 86, y: 56 } },
            { type: 'cut', p1: { x: 124, y: 18 }, p2: { x: 124, y: 56 } }
          ]
        }
      ]
    }
  ]
}

// 2. 复古客车厢 (大正浪漫木质客车)
const d51CoachSchema: PapercraftModelSchema = {
  version: '1.0',
  id: 'd51-coach-car',
  name: '大正浪漫 复古客车厢 (Coach)',
  category: 'steam',
  difficulty: 'medium',
  recommendedAge: '8-14 岁',
  estimatedTime: '20-30 分钟',
  description: '复古拱形小车窗、木质车壁纹理与红铜铆钉装饰的经典蒸汽火车客厢。',
  dimensions: {
    length: 150,
    width: 38,
    height: 44
  },
  parts: [
    {
      id: 'd51-coach-body',
      name: '复古客车身展开',
      faces: [
        // 1. 车顶
        {
          id: 'roof',
          name: '车顶',
          slotName: 'roof',
          vertices3D: [[-19, 44, -75], [19, 44, -75], [19, 44, 75], [-19, 44, 75]],
          vertices2D: [
            [86, 56],
            [124, 56],
            [124, 206],
            [86, 206]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'mountain', p1: { x: 86, y: 56 }, p2: { x: 124, y: 56 } },
            { type: 'mountain', p1: { x: 124, y: 56 }, p2: { x: 124, y: 206 } },
            { type: 'mountain', p1: { x: 86, y: 206 }, p2: { x: 124, y: 206 } },
            { type: 'mountain', p1: { x: 86, y: 56 }, p2: { x: 86, y: 206 } }
          ]
        },
        // 2. 左侧面
        {
          id: 'side_left',
          name: '左侧复古车窗壁',
          slotName: 'side_left',
          vertices3D: [[-19, 44, -75], [-19, 44, 75], [-19, 0, 75], [-19, 0, -75]],
          vertices2D: [
            [86, 56],
            [86, 206],
            [42, 206],
            [42, 56]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 42, y: 56 }, p2: { x: 42, y: 206 } }
          ],
          tabs: [
            {
              id: 'tab_coach_fl',
              label: 'A1',
              edgeIndex: 1,
              p1: { x: 42, y: 206 },
              p2: { x: 86, y: 206 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_coach_bl',
              label: 'B1',
              edgeIndex: 3,
              p1: { x: 86, y: 56 },
              p2: { x: 42, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        // 3. 车底 (Bottom: 连在左侧身外沿)
        {
          id: 'bottom',
          name: '车底',
          slotName: 'bottom',
          vertices3D: [[-19, 0, -75], [-19, 0, 75], [19, 0, 75], [19, 0, -75]],
          vertices2D: [
            [42, 56],
            [42, 206],
            [4, 206],
            [4, 56]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 4, y: 56 }, p2: { x: 4, y: 206 } },
            { type: 'cut', p1: { x: 4, y: 56 }, p2: { x: 42, y: 56 } },
            { type: 'cut', p1: { x: 4, y: 206 }, p2: { x: 42, y: 206 } }
          ],
          tabs: [
            {
              id: 'tab_coach_bottom',
              label: 'D1',
              edgeIndex: 2,
              p1: { x: 4, y: 56 },
              p2: { x: 4, y: 206 },
              tabWidth: 8,
              angle: 45,
              targetFaceId: 'side_right'
            }
          ]
        },
        // 4. 右侧面
        {
          id: 'side_right',
          name: '右侧复古车窗壁',
          slotName: 'side_right',
          vertices3D: [[19, 44, -75], [19, 44, 75], [19, 0, 75], [19, 0, -75]],
          vertices2D: [
            [124, 56],
            [124, 206],
            [168, 206],
            [168, 56]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 168, y: 56 }, p2: { x: 168, y: 206 } }
          ],
          tabs: [
            {
              id: 'tab_coach_fr',
              label: 'A2',
              edgeIndex: 1,
              p1: { x: 124, y: 206 },
              p2: { x: 168, y: 206 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'front'
            },
            {
              id: 'tab_coach_br',
              label: 'B2',
              edgeIndex: 3,
              p1: { x: 168, y: 56 },
              p2: { x: 124, y: 56 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        // 5. 前门
        {
          id: 'front',
          name: '前贯通门',
          slotName: 'back',
          vertices3D: [[-19, 44, 75], [19, 44, 75], [19, 0, 75], [-19, 0, 75]],
          vertices2D: [
            [86, 206],
            [124, 206],
            [124, 250],
            [86, 250]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 86, y: 250 }, p2: { x: 124, y: 250 } }
          ]
        },
        // 6. 后门
        {
          id: 'back',
          name: '后贯通门',
          slotName: 'back',
          vertices3D: [[19, 44, -75], [-19, 44, -75], [-19, 0, -75], [19, 0, -75]],
          vertices2D: [
            [124, 56],
            [86, 56],
            [86, 12],
            [124, 12]
          ],
          uvCoords: [[1, 1], [0, 1], [0, 0], [1, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 86, y: 12 }, p2: { x: 124, y: 12 } }
          ]
        }
      ]
    }
  ]
}

export const d51TrainConsist: TrainModelConsist = {
  id: 'd51-consist',
  name: "D51 蒸汽列车",
  nameEn: "D51 steam train",
  category: 'steam',
  defaultThemeId: 'vintage-steam',
  description: "蒸汽机车、煤水车与客车编组。",
  descriptionEn: "Steam locomotive, tender and passenger coaches.",
  difficulty: 'hard',
  recommendedAge: '8-14 岁',
  estimatedTimePerCar: '30 分钟/节',
  carDefinitions: {
    head: {
      type: 'head',
      name: '1号车 (机车头)',
      description: 'D51 蒸汽机车头',
      schema: d51SteamSchema
    },
    tender: {
      type: 'tender',
      name: '2号车 (煤水车)',
      description: '煤炭储斗与水箱补给车',
      schema: d51TenderSchema
    },
    middle: {
      type: 'middle',
      name: '3号车 (复古客车)',
      description: '大正浪漫复古客车厢',
      schema: d51CoachSchema
    },
    tail: {
      type: 'tail',
      name: '尾车 (复古客尾)',
      description: '复古木质客车尾',
      schema: d51CoachSchema
    }
  }
}
