import { PapercraftModelData, UnfoldedFace } from '../types'
import { calculatePartBounds } from '../unfoldEngine'

export const retroDoubleDeckerBus: PapercraftModelData = {
  id: 'retro-double-decker-bus',
  name: '经典复古双层巴士 (伦敦风)',
  category: 'bus',
  description: '经典的红色双层大巴造型，双层大排观光窗与标志性复古车头格栅，拼装极具成就感。',
  difficulty: 'intermediate',
  recommendedAge: '6-10 岁',
  estimatedTime: '20-30 分钟',
  partsCount: 1,
  dimensions: {
    length: 140, // mm
    width: 44,   // mm
    height: 60   // mm
  },

  create3DParts: () => {
    const L = 1.4
    const W = 0.44
    const H = 0.60

    const halfL = L / 2
    const halfW = W / 2
    const halfH = H / 2

    const vertices = [
      // Front (+Z)
      -halfW, -halfH,  halfL,
       halfW, -halfH,  halfL,
       halfW,  halfH,  halfL,
      -halfW,  halfH,  halfL,

      // Back (-Z)
       halfW, -halfH, -halfL,
      -halfW, -halfH, -halfL,
      -halfW,  halfH, -halfL,
       halfW,  halfH, -halfL,

      // Top (+Y)
      -halfW,  halfH,  halfL,
       halfW,  halfH,  halfL,
       halfW,  halfH, -halfL,
      -halfW,  halfH, -halfL,

      // Bottom (-Y)
      -halfW, -halfH, -halfL,
       halfW, -halfH, -halfL,
       halfW, -halfH,  halfL,
      -halfW, -halfH,  halfL,

      // Left (-X)
      -halfW, -halfH, -halfL,
      -halfW, -halfH,  halfL,
      -halfW,  halfH,  halfL,
      -halfW,  halfH, -halfL,

      // Right (+X)
       halfW, -halfH,  halfL,
       halfW, -halfH, -halfL,
       halfW,  halfH, -halfL,
       halfW,  halfH,  halfL
    ]

    const indices = [
      0, 1, 2,  0, 2, 3,
      4, 5, 6,  4, 6, 7,
      8, 9, 10, 8, 10, 11,
      12, 13, 14, 12, 14, 15,
      16, 17, 18, 16, 18, 19,
      20, 21, 22, 20, 22, 23
    ]

    const uvs = [
      0.0, 0.66,  0.33, 0.66,  0.33, 1.0,  0.0, 1.0,
      0.33, 0.66, 0.66, 0.66,  0.66, 1.0,  0.33, 1.0,
      0.66, 0.66, 1.0, 0.66,   1.0, 1.0,   0.66, 1.0,
      0.66, 0.66, 1.0, 0.66,   1.0, 1.0,   0.66, 1.0,
      0.0, 0.0,   0.5, 0.0,    0.5, 0.66,  0.0, 0.66,
      0.5, 0.0,   1.0, 0.0,    1.0, 0.66,  0.5, 0.66
    ]

    return [
      {
        id: 'bus-body',
        name: '双层巴士主体',
        meshData: {
          vertices,
          indices,
          uvs
        },
        explodeOffset: [0, 0, 0]
      }
    ]
  },

  generateUnfoldedParts: () => {
    const L = 140
    const W = 44
    const H = 60
    const tabW = 8

    const roofX = H + 10
    const roofY = H + 10

    const roofFace: UnfoldedFace = {
      id: 'roof',
      name: '巴士车顶',
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
      name: '左侧双层车身',
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
          targetPartId: 'bus-body',
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
          targetPartId: 'bus-body',
          targetEdgeIndex: 0
        }
      ]
    }

    const rightFace: UnfoldedFace = {
      id: 'side_right',
      name: '右侧双层车身',
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
        { type: 'cut', p1: { x: roofX + W + H, y: roofY + L }, p2: { x: roofX + W, y: roofY + L } }
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
          targetPartId: 'bus-body',
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
          targetPartId: 'bus-body',
          targetEdgeIndex: 1
        }
      ]
    }

    const frontFace: UnfoldedFace = {
      id: 'front',
      name: '巴士前脸',
      textureSlot: 'front',
      polygon2D: [
        { x: roofX, y: roofY + L },
        { x: roofX + W, y: roofY + L },
        { x: roofX + W, y: roofY + L + H },
        { x: roofX, y: roofY + L + H }
      ],
      uvCoords: [{ x: 0, y: 0.66 }, { x: 0.33, y: 0.66 }, { x: 0.33, y: 1 }, { x: 0, y: 1 }],
      creases: [
        { type: 'mountain', p1: { x: roofX, y: roofY + L + H }, p2: { x: roofX + W, y: roofY + L + H } },
        { type: 'cut', p1: { x: roofX, y: roofY + L }, p2: { x: roofX, y: roofY + L + H } },
        { type: 'cut', p1: { x: roofX + W, y: roofY + L }, p2: { x: roofX + W, y: roofY + L + H } }
      ],
      glueTabs: []
    }

    const backFace: UnfoldedFace = {
      id: 'back',
      name: '巴士车尾',
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

    const faces = [roofFace, leftFace, rightFace, frontFace, backFace]
    const bounds = calculatePartBounds(faces)

    return [
      {
        id: 'bus-body',
        name: '双层巴士主体',
        faces,
        bounds
      }
    ]
  }
}
