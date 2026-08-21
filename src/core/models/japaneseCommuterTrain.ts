// 日本都市通勤电车 (JR E235 山手线 精细立体多部件版)
import { PapercraftModelData, UnfoldedPart, UnfoldedFace } from '../types'
import { calculatePartBounds } from '../unfoldEngine'

export const japaneseCommuterTrain: PapercraftModelData = {
  id: 'japanese-commuter-train',
  name: '日本都市通勤电车 (JR E235系 精细立体版)',
  category: 'train',
  description: '还原日本 JR 车站纸模标准：立体前倾车头、底部排障器铲板、车顶双冷气机、单臂受电弓与立体车轮转向架。',
  difficulty: 'intermediate',
  recommendedAge: '6-10 岁 (亲子手工)',
  estimatedTime: '20-30 分钟',
  partsCount: 5, // 主车身、立体车头鼻、车头排障器、车顶双冷气机、车顶受电弓
  dimensions: {
    length: 160, // mm
    width: 38,   // mm
    height: 52   // mm
  },

  create3DParts: () => {
    const L = 1.6
    const W = 0.38
    const H = 0.44

    const halfL = L / 2
    const halfW = W / 2
    const halfH = H / 2

    // 1. 主车身 (含大车窗与车顶)
    const bodyVertices = [
      // Front (Z+)
      -halfW, -halfH,  halfL * 0.9,
       halfW, -halfH,  halfL * 0.9,
       halfW,  halfH,  halfL * 0.9,
      -halfW,  halfH,  halfL * 0.9,

      // Back (Z-)
       halfW, -halfH, -halfL,
      -halfW, -halfH, -halfL,
      -halfW,  halfH, -halfL,
       halfW,  halfH, -halfL,

      // Roof (Y+)
      -halfW,  halfH,  halfL * 0.9,
       halfW,  halfH,  halfL * 0.9,
       halfW,  halfH, -halfL,
      -halfW,  halfH, -halfL,

      // Bottom (Y-)
      -halfW, -halfH, -halfL,
       halfW, -halfH, -halfL,
       halfW, -halfH,  halfL * 0.9,
      -halfW, -halfH,  halfL * 0.9,

      // Left (X-)
      -halfW, -halfH, -halfL,
      -halfW, -halfH,  halfL * 0.9,
      -halfW,  halfH,  halfL * 0.9,
      -halfW,  halfH, -halfL,

      // Right (X+)
       halfW, -halfH,  halfL * 0.9,
       halfW, -halfH, -halfL,
       halfW,  halfH, -halfL,
       halfW,  halfH,  halfL * 0.9
    ]

    const bodyIndices = [
      0, 1, 2,  0, 2, 3,       // Front
      4, 5, 6,  4, 6, 7,       // Back
      8, 9, 10, 8, 10, 11,     // Top
      12, 13, 14, 12, 14, 15,  // Bottom
      16, 17, 18, 16, 18, 19,  // Left
      20, 21, 22, 20, 22, 23   // Right
    ]

    const bodyUVs = [
      0.0, 0.66,  0.33, 0.66,  0.33, 1.0,  0.0, 1.0,
      0.33, 0.66, 0.66, 0.66,  0.66, 1.0,  0.33, 1.0,
      0.66, 0.66, 1.0, 0.66,   1.0, 1.0,   0.66, 1.0,
      0.66, 0.66, 1.0, 0.66,   1.0, 1.0,   0.66, 1.0,
      0.0, 0.0,   0.5, 0.0,    0.5, 0.66,  0.0, 0.66,
      0.5, 0.0,   1.0, 0.0,    1.0, 0.66,  0.5, 0.66
    ]

    // 2. 突出式立体车头 (3D Cab Nose - 倾斜前挡风与驾驶台)
    const noseL = 0.16
    const noseW = W * 0.96
    const noseH = H * 0.88
    const noseBaseZ = halfL * 0.9

    const noseVertices = [
      // 倾斜挡风玻璃前脸
      -noseW/2, -noseH/2, noseBaseZ + noseL,
       noseW/2, -noseH/2, noseBaseZ + noseL,
       noseW/2 * 0.88, noseH/2, noseBaseZ + noseL * 0.4,
      -noseW/2 * 0.88, noseH/2, noseBaseZ + noseL * 0.4,

      // 车头斜顶
      -noseW/2 * 0.88, noseH/2, noseBaseZ + noseL * 0.4,
       noseW/2 * 0.88, noseH/2, noseBaseZ + noseL * 0.4,
       halfW, halfH, noseBaseZ,
      -halfW, halfH, noseBaseZ,

      // 车头左侧包角
      -halfW, -halfH, noseBaseZ,
      -noseW/2, -noseH/2, noseBaseZ + noseL,
      -noseW/2 * 0.88, noseH/2, noseBaseZ + noseL * 0.4,
      -halfW, halfH, noseBaseZ,

      // 车头右侧包角
       noseW/2, -noseH/2, noseBaseZ + noseL,
       halfW, -halfH, noseBaseZ,
       halfW, halfH, noseBaseZ,
       noseW/2 * 0.88, noseH/2, noseBaseZ + noseL * 0.4
    ]

    const noseIndices = [
      0, 1, 2, 0, 2, 3,
      4, 5, 6, 4, 6, 7,
      8, 9, 10, 8, 10, 11,
      12, 13, 14, 12, 14, 15
    ]

    const noseUVs = [
      0.0, 0.66, 0.33, 0.66, 0.33, 1.0, 0.0, 1.0,
      0.66, 0.66, 1.0, 0.66, 1.0, 0.8, 0.66, 0.8,
      0.0, 0.3, 0.15, 0.3, 0.15, 0.6, 0.0, 0.6,
      0.85, 0.3, 1.0, 0.3, 1.0, 0.6, 0.85, 0.6
    ]

    // 3. 车头底部立体排障器 (Cowcatcher / Skirt)
    const skirtL = 0.12
    const skirtW = W * 0.9
    const skirtH = 0.1
    const skirtY = -halfH - skirtH * 0.4

    const skirtVertices = [
      -skirtW/2, skirtY, noseBaseZ + skirtL,
       skirtW/2, skirtY, noseBaseZ + skirtL,
       halfW, -halfH, noseBaseZ,
      -halfW, -halfH, noseBaseZ
    ]
    const skirtIndices = [0, 1, 2, 0, 2, 3]
    const skirtUVs = [0.1, 0.9, 0.25, 0.9, 0.25, 1.0, 0.1, 1.0]

    // 4. 车顶双立体冷气机组 (Twin AC Units)
    const acL = 0.38
    const acW = 0.24
    const acH = 0.08
    const acY = halfH + acH / 2

    const createAcVertices = (centerZ: number) => [
      -acW/2, acY + acH/2, centerZ + acL/2,
       acW/2, acY + acH/2, centerZ + acL/2,
       acW/2, acY + acH/2, centerZ - acL/2,
      -acW/2, acY + acH/2, centerZ - acL/2,

      -acW/2, acY - acH/2, centerZ + acL/2,
       acW/2, acY - acH/2, centerZ + acL/2,
       acW/2, acY + acH/2, centerZ + acL/2,
      -acW/2, acY + acH/2, centerZ + acL/2
    ]
    const ac1Verts = createAcVertices(0.25)
    const ac2Verts = createAcVertices(-0.35)
    const acAllVerts = [...ac1Verts, ...ac2Verts]
    const acAllIndices = [
      0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7,
      8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15
    ]
    const acAllUVs = [
      0.7, 0.7, 0.95, 0.7, 0.95, 0.95, 0.7, 0.95,
      0.7, 0.7, 0.95, 0.7, 0.95, 0.75, 0.7, 0.75,
      0.7, 0.7, 0.95, 0.7, 0.95, 0.95, 0.7, 0.95,
      0.7, 0.7, 0.95, 0.7, 0.95, 0.75, 0.7, 0.75
    ]

    // 5. 车顶高速立体受电弓 (Pantograph)
    const pantoL = 0.28
    const pantoW = 0.18
    const pantoH = 0.14
    const pantoZ = -0.55
    const pantoY = halfH + pantoH / 2

    const pantoVertices = [
      -pantoW/2, pantoY + pantoH/2, pantoZ + pantoL/2,
       pantoW/2, pantoY + pantoH/2, pantoZ + pantoL/2,
       pantoW/2, pantoY + pantoH/2, pantoZ - pantoL/2,
      -pantoW/2, pantoY + pantoH/2, pantoZ - pantoL/2,

      // 单臂支撑斜梁
      -0.03, halfH, pantoZ - pantoL/2,
       0.03, halfH, pantoZ - pantoL/2,
       0.03, pantoY + pantoH/2, pantoZ,
      -0.03, pantoY + pantoH/2, pantoZ
    ]
    const pantoIndices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7]
    const pantoUVs = [
      0.7, 0.7, 0.95, 0.7, 0.95, 0.95, 0.7, 0.95,
      0.7, 0.7, 0.8, 0.7, 0.8, 0.8, 0.7, 0.8
    ]

    return [
      {
        id: 'body',
        name: '车身主体',
        meshData: { vertices: bodyVertices, indices: bodyIndices, uvs: bodyUVs },
        explodeOffset: [0, 0, 0]
      },
      {
        id: 'nose-cab',
        name: '立体前倾车头',
        meshData: { vertices: noseVertices, indices: noseIndices, uvs: noseUVs },
        explodeOffset: [0, 0, 0.35]
      },
      {
        id: 'cowcatcher',
        name: '车头下部排障器',
        meshData: { vertices: skirtVertices, indices: skirtIndices, uvs: skirtUVs },
        explodeOffset: [0, -0.25, 0.3]
      },
      {
        id: 'twin-ac',
        name: '车顶双冷气机组',
        meshData: { vertices: acAllVerts, indices: acAllIndices, uvs: acAllUVs },
        explodeOffset: [0, 0.35, 0]
      },
      {
        id: 'pantograph',
        name: '车顶金属受电弓',
        meshData: { vertices: pantoVertices, indices: pantoIndices, uvs: pantoUVs },
        explodeOffset: [0, 0.45, -0.15]
      }
    ]
  },

  generateUnfoldedParts: () => {
    const L = 144 // mm
    const W = 38  // mm
    const H = 44  // mm
    const tabW = 8

    const roofX = H + 12
    const roofY = H + 12

    // 1. 主车身 (车顶、左右侧、车尾、车底)
    const roofFace: UnfoldedFace = {
      id: 'roof',
      name: '车顶',
      textureSlot: 'roof',
      polygon2D: [
        { x: roofX, y: roofY },
        { x: roofX + W, y: roofY },
        { x: roofX + W, y: roofY + L },
        { x: roofX, y: roofY + L }
      ],
      uvCoords: [{ x: 0.66, y: 0.66 }, { x: 1, y: 0.66 }, { x: 1, y: 1 }, { x: 0.66, y: 1 }],
      creases: [
        { type: 'mountain', p1: { x: roofX, y: roofY }, p2: { x: roofX + W, y: roofY } },
        { type: 'mountain', p1: { x: roofX + W, y: roofY }, p2: { x: roofX + W, y: roofY + L } },
        { type: 'mountain', p1: { x: roofX + W, y: roofY + L }, p2: { x: roofX, y: roofY + L } },
        { type: 'mountain', p1: { x: roofX, y: roofY + L }, p2: { x: roofX, y: roofY } }
      ],
      glueTabs: []
    }

    const leftFace: UnfoldedFace = {
      id: 'side_left',
      name: '左侧车身',
      textureSlot: 'side_left',
      polygon2D: [
        { x: roofX - H, y: roofY },
        { x: roofX, y: roofY },
        { x: roofX, y: roofY + L },
        { x: roofX - H, y: roofY + L }
      ],
      uvCoords: [{ x: 0, y: 0.66 }, { x: 0.5, y: 0.66 }, { x: 0.5, y: 0 }, { x: 0, y: 0 }],
      creases: [
        { type: 'cut', p1: { x: roofX - H, y: roofY }, p2: { x: roofX - H, y: roofY + L } },
        { type: 'cut', p1: { x: roofX - H, y: roofY }, p2: { x: roofX, y: roofY } },
        { type: 'cut', p1: { x: roofX - H, y: roofY + L }, p2: { x: roofX, y: roofY + L } }
      ],
      glueTabs: [
        {
          id: 'tab_left_front',
          label: 'A1',
          edgeIndex: 2,
          p1: { x: roofX - H, y: roofY + L },
          p2: { x: roofX, y: roofY + L },
          tabWidth: tabW,
          angle: 45,
          targetPartId: 'nose-cab',
          targetEdgeIndex: 0
        },
        {
          id: 'tab_left_back',
          label: 'B1',
          edgeIndex: 1,
          p1: { x: roofX, y: roofY },
          p2: { x: roofX - H, y: roofY },
          tabWidth: tabW,
          angle: 45,
          targetPartId: 'body',
          targetEdgeIndex: 0
        }
      ]
    }

    const rightFace: UnfoldedFace = {
      id: 'side_right',
      name: '右侧车身',
      textureSlot: 'side_right',
      polygon2D: [
        { x: roofX + W, y: roofY },
        { x: roofX + W + H, y: roofY },
        { x: roofX + W + H, y: roofY + L },
        { x: roofX + W, y: roofY + L }
      ],
      uvCoords: [{ x: 0.5, y: 0.66 }, { x: 1, y: 0.66 }, { x: 1, y: 0 }, { x: 0.5, y: 0 }],
      creases: [
        { type: 'cut', p1: { x: roofX + W + H, y: roofY }, p2: { x: roofX + W + H, y: roofY + L } },
        { type: 'cut', p1: { x: roofX + W, y: roofY }, p2: { x: roofX + W + H, y: roofY } },
        { type: 'cut', p1: { x: roofX + W, y: roofY + L }, p2: { x: roofX + W + H, y: roofY + L } }
      ],
      glueTabs: [
        {
          id: 'tab_right_front',
          label: 'A2',
          edgeIndex: 2,
          p1: { x: roofX + W, y: roofY + L },
          p2: { x: roofX + W + H, y: roofY + L },
          tabWidth: tabW,
          angle: 45,
          targetPartId: 'nose-cab',
          targetEdgeIndex: 1
        },
        {
          id: 'tab_right_back',
          label: 'B2',
          edgeIndex: 1,
          p1: { x: roofX + W + H, y: roofY },
          p2: { x: roofX + W, y: roofY },
          tabWidth: tabW,
          angle: 45,
          targetPartId: 'body',
          targetEdgeIndex: 1
        }
      ]
    }

    const backFace: UnfoldedFace = {
      id: 'back',
      name: '车尾',
      textureSlot: 'back',
      polygon2D: [
        { x: roofX, y: roofY - H },
        { x: roofX + W, y: roofY - H },
        { x: roofX + W, y: roofY },
        { x: roofX, y: roofY }
      ],
      uvCoords: [{ x: 0.33, y: 1 }, { x: 0.66, y: 1 }, { x: 0.66, y: 0.66 }, { x: 0.33, y: 0.66 }],
      creases: [
        { type: 'cut', p1: { x: roofX, y: roofY - H }, p2: { x: roofX + W, y: roofY - H } },
        { type: 'cut', p1: { x: roofX, y: roofY - H }, p2: { x: roofX, y: roofY } },
        { type: 'cut', p1: { x: roofX + W, y: roofY - H }, p2: { x: roofX + W, y: roofY } }
      ],
      glueTabs: []
    }

    const bottomFace: UnfoldedFace = {
      id: 'bottom',
      name: '车底与转向架',
      textureSlot: 'bottom',
      polygon2D: [
        { x: roofX, y: roofY + L },
        { x: roofX + W, y: roofY + L },
        { x: roofX + W, y: roofY + L + L * 0.9 },
        { x: roofX, y: roofY + L + L * 0.9 }
      ],
      uvCoords: [{ x: 0.66, y: 0.66 }, { x: 1, y: 0.66 }, { x: 1, y: 1 }, { x: 0.66, y: 1 }],
      creases: [
        { type: 'cut', p1: { x: roofX, y: roofY + L + L * 0.9 }, p2: { x: roofX + W, y: roofY + L + L * 0.9 } },
        { type: 'cut', p1: { x: roofX, y: roofY + L }, p2: { x: roofX, y: roofY + L + L * 0.9 } },
        { type: 'cut', p1: { x: roofX + W, y: roofY + L }, p2: { x: roofX + W, y: roofY + L + L * 0.9 } }
      ],
      glueTabs: [
        {
          id: 'tab_bottom_l',
          label: 'D1',
          edgeIndex: 3,
          p1: { x: roofX, y: roofY + L + L * 0.9 },
          p2: { x: roofX, y: roofY + L },
          tabWidth: tabW,
          angle: 45,
          targetPartId: 'body',
          targetEdgeIndex: 0
        },
        {
          id: 'tab_bottom_r',
          label: 'D2',
          edgeIndex: 1,
          p1: { x: roofX + W, y: roofY + L },
          p2: { x: roofX + W, y: roofY + L + L * 0.9 },
          tabWidth: tabW,
          angle: 45,
          targetPartId: 'body',
          targetEdgeIndex: 0
        }
      ]
    }

    const bodyFaces = [roofFace, leftFace, rightFace, backFace, bottomFace]
    const bodyPart: UnfoldedPart = {
      id: 'body',
      name: '车身主体骨架',
      faces: bodyFaces,
      bounds: calculatePartBounds(bodyFaces)
    }

    // 2. 独立立体车头鼻 (Cab Nose)
    const noseFace: UnfoldedFace = {
      id: 'nose_front',
      name: '立体前倾驾驶室',
      textureSlot: 'front',
      polygon2D: [
        { x: 155, y: 20 },
        { x: 155 + W, y: 20 },
        { x: 155 + W, y: 20 + H * 0.8 },
        { x: 155, y: 20 + H * 0.8 }
      ],
      uvCoords: [{ x: 0, y: 0.66 }, { x: 0.33, y: 0.66 }, { x: 0.33, y: 1 }, { x: 0, y: 1 }],
      creases: [
        { type: 'cut', p1: { x: 155, y: 20 }, p2: { x: 155 + W, y: 20 } },
        { type: 'cut', p1: { x: 155 + W, y: 20 }, p2: { x: 155 + W, y: 20 + H * 0.8 } },
        { type: 'cut', p1: { x: 155 + W, y: 20 + H * 0.8 }, p2: { x: 155, y: 20 + H * 0.8 } },
        { type: 'cut', p1: { x: 155, y: 20 + H * 0.8 }, p2: { x: 155, y: 20 } }
      ],
      glueTabs: [
        {
          id: 'tab_nose_t1',
          label: 'A1',
          edgeIndex: 0,
          p1: { x: 155, y: 20 },
          p2: { x: 155 + W, y: 20 },
          tabWidth: tabW,
          angle: 45,
          targetPartId: 'body',
          targetEdgeIndex: 0
        },
        {
          id: 'tab_nose_t2',
          label: 'A2',
          edgeIndex: 2,
          p1: { x: 155 + W, y: 20 + H * 0.8 },
          p2: { x: 155, y: 20 + H * 0.8 },
          tabWidth: tabW,
          angle: 45,
          targetPartId: 'body',
          targetEdgeIndex: 0
        }
      ]
    }

    const nosePart: UnfoldedPart = {
      id: 'nose-cab',
      name: '立体前倾车头',
      faces: [noseFace],
      bounds: calculatePartBounds([noseFace])
    }

    // 3. 车头下部排障器 (Cowcatcher)
    const skirtFace: UnfoldedFace = {
      id: 'cowcatcher_face',
      name: '车头下部排障器',
      textureSlot: 'front',
      polygon2D: [
        { x: 155, y: 70 },
        { x: 155 + W, y: 70 },
        { x: 155 + W * 0.8, y: 82 },
        { x: 155 + W * 0.2, y: 82 }
      ],
      uvCoords: [{ x: 0.1, y: 0.9 }, { x: 0.25, y: 0.9 }, { x: 0.25, y: 1.0 }, { x: 0.1, y: 1.0 }],
      creases: [
        { type: 'cut', p1: { x: 155, y: 70 }, p2: { x: 155 + W, y: 70 } },
        { type: 'cut', p1: { x: 155 + W, y: 70 }, p2: { x: 155 + W * 0.8, y: 82 } },
        { type: 'cut', p1: { x: 155 + W * 0.8, y: 82 }, p2: { x: 155 + W * 0.2, y: 82 } },
        { type: 'cut', p1: { x: 155 + W * 0.2, y: 82 }, p2: { x: 155, y: 70 } }
      ],
      glueTabs: [
        {
          id: 'tab_skirt',
          label: 'S1',
          edgeIndex: 0,
          p1: { x: 155, y: 70 },
          p2: { x: 155 + W, y: 70 },
          tabWidth: 5,
          angle: 45,
          targetPartId: 'nose-cab',
          targetEdgeIndex: 0
        }
      ]
    }

    const skirtPart: UnfoldedPart = {
      id: 'cowcatcher',
      name: '车头排障器铲板',
      faces: [skirtFace],
      bounds: calculatePartBounds([skirtFace])
    }

    // 4. 车顶双冷气机组
    const acFace1: UnfoldedFace = {
      id: 'ac1',
      name: '空调机组 1',
      textureSlot: 'ac_unit',
      polygon2D: [
        { x: 155, y: 95 },
        { x: 155 + 24, y: 95 },
        { x: 155 + 24, y: 130 },
        { x: 155, y: 130 }
      ],
      uvCoords: [{ x: 0.7, y: 0.7 }, { x: 0.95, y: 0.7 }, { x: 0.95, y: 0.95 }, { x: 0.7, y: 0.95 }],
      creases: [
        { type: 'cut', p1: { x: 155, y: 95 }, p2: { x: 155 + 24, y: 95 } },
        { type: 'cut', p1: { x: 155 + 24, y: 95 }, p2: { x: 155 + 24, y: 130 } },
        { type: 'cut', p1: { x: 155 + 24, y: 130 }, p2: { x: 155, y: 130 } },
        { type: 'cut', p1: { x: 155, y: 130 }, p2: { x: 155, y: 95 } }
      ],
      glueTabs: [
        {
          id: 'tab_ac1',
          label: 'E1',
          edgeIndex: 3,
          p1: { x: 155, y: 130 },
          p2: { x: 155, y: 95 },
          tabWidth: 4,
          angle: 45,
          targetPartId: 'roof',
          targetEdgeIndex: 0
        }
      ]
    }

    const acPart: UnfoldedPart = {
      id: 'twin-ac',
      name: '车顶双冷气机',
      faces: [acFace1],
      bounds: calculatePartBounds([acFace1])
    }

    // 5. 车顶受电弓
    const pantoFace: UnfoldedFace = {
      id: 'panto',
      name: '单臂受电弓',
      textureSlot: 'roof',
      polygon2D: [
        { x: 155, y: 145 },
        { x: 155 + 20, y: 145 },
        { x: 155 + 10, y: 172 },
        { x: 155, y: 172 }
      ],
      uvCoords: [{ x: 0.7, y: 0.7 }, { x: 0.95, y: 0.7 }, { x: 0.95, y: 0.95 }, { x: 0.7, y: 0.95 }],
      creases: [
        { type: 'cut', p1: { x: 155, y: 145 }, p2: { x: 155 + 20, y: 145 } },
        { type: 'cut', p1: { x: 155 + 20, y: 145 }, p2: { x: 155 + 10, y: 172 } },
        { type: 'cut', p1: { x: 155 + 10, y: 172 }, p2: { x: 155, y: 172 } },
        { type: 'cut', p1: { x: 155, y: 172 }, p2: { x: 155, y: 145 } }
      ],
      glueTabs: [
        {
          id: 'tab_panto',
          label: 'P1',
          edgeIndex: 0,
          p1: { x: 155, y: 145 },
          p2: { x: 155 + 20, y: 145 },
          tabWidth: 4,
          angle: 45,
          targetPartId: 'roof',
          targetEdgeIndex: 0
        }
      ]
    }

    const pantoPart: UnfoldedPart = {
      id: 'pantograph',
      name: '车顶立体受电弓',
      faces: [pantoFace],
      bounds: calculatePartBounds([pantoFace])
    }

    return [bodyPart, nosePart, skirtPart, acPart, pantoPart]
  }
}
