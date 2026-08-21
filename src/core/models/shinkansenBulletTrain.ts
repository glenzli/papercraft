// 新干线 E5 隼号 (超长流线气动长鼻锥与多段立体几何)
import { PapercraftModelData, UnfoldedPart, UnfoldedFace } from '../types'
import { calculatePartBounds } from '../unfoldEngine'

export const shinkansenBulletTrain: PapercraftModelData = {
  id: 'shinkansen-bullet-train',
  name: '新干线 E5系隼号 (流线长鼻进阶版)',
  category: 'train',
  description: '还原 15 米超长气动鸭嘴鼻锥、双曲面流线驾驶舱穹顶、侧面低风阻裙板与车顶大型隔音导流受电弓。',
  difficulty: 'advanced',
  recommendedAge: '7-14 岁',
  estimatedTime: '30-45 分钟',
  partsCount: 4, // 主车身、流线长鼻锥复合面、车顶导流板、高速单臂受电弓
  dimensions: {
    length: 190, // mm
    width: 36,   // mm
    height: 48   // mm
  },

  create3DParts: () => {
    const L = 1.9
    const W = 0.36
    const H = 0.42
    const noseL = 0.65 // 超长流线气动鼻锥

    const halfW = W / 2
    const halfH = H / 2
    const rearZ = -L / 2
    const bodyZ = L / 2 - noseL
    const noseMidZ = bodyZ + noseL * 0.55
    const noseTipZ = L / 2

    // 1. 直线车身段
    const bodyVertices = [
      // 车尾 (-Z)
       halfW, -halfH, rearZ,
      -halfW, -halfH, rearZ,
      -halfW,  halfH, rearZ,
       halfW,  halfH, rearZ,

      // 车身顶面 (+Y)
      -halfW,  halfH, bodyZ,
       halfW,  halfH, bodyZ,
       halfW,  halfH, rearZ,
      -halfW,  halfH, rearZ,

      // 车身底面 (-Y)
      -halfW, -halfH, rearZ,
       halfW, -halfH, rearZ,
       halfW, -halfH, bodyZ,
      -halfW, -halfH, bodyZ,

      // 左侧车身
      -halfW, -halfH, rearZ,
      -halfW, -halfH, bodyZ,
      -halfW,  halfH, bodyZ,
      -halfW,  halfH, rearZ,

      // 右侧车身
       halfW, -halfH, bodyZ,
       halfW, -halfH, rearZ,
       halfW,  halfH, rearZ,
       halfW,  halfH, bodyZ
    ]

    const bodyIndices = [
      0, 1, 2,  0, 2, 3,
      4, 5, 6,  4, 6, 7,
      8, 9, 10, 8, 10, 11,
      12, 13, 14, 12, 14, 15,
      16, 17, 18, 16, 18, 19
    ]

    const bodyUVs = [
      0.33, 0.66, 0.66, 0.66, 0.66, 1.0, 0.33, 1.0,
      0.66, 0.66, 1.0, 0.66, 1.0, 1.0, 0.66, 1.0,
      0.66, 0.66, 1.0, 0.66, 1.0, 1.0, 0.66, 1.0,
      0.0, 0.0, 0.35, 0.0, 0.35, 0.66, 0.0, 0.66,
      0.5, 0.0, 0.85, 0.0, 0.85, 0.66, 0.5, 0.66
    ]

    // 2. 超长流线气动鼻锥 (Multi-segment Aerodynamic Long Nose)
    const noseVertices = [
      // 驾驶舱挡风斜面 (Cockpit Canopy)
      -halfW * 0.85, halfH * 0.6, noseMidZ,
       halfW * 0.85, halfH * 0.6, noseMidZ,
       halfW,        halfH,       bodyZ,
      -halfW,        halfH,       bodyZ,

      // 鸭嘴前端长鼻锥顶面 (Flat Duckbill Nose Top)
      -halfW * 0.4, -halfH * 0.1, noseTipZ,
       halfW * 0.4, -halfH * 0.1, noseTipZ,
       halfW * 0.85, halfH * 0.6, noseMidZ,
      -halfW * 0.85, halfH * 0.6, noseMidZ,

      // 鸭嘴前端下巴 (Lower Chin)
      -halfW * 0.35, -halfH * 0.85, noseTipZ,
       halfW * 0.35, -halfH * 0.85, noseTipZ,
       halfW * 0.4,  -halfH * 0.1,  noseTipZ,
      -halfW * 0.4,  -halfH * 0.1,  noseTipZ,

      // 左侧流线鼻翼 (Left Nose Wing)
      -halfW, -halfH, bodyZ,
      -halfW * 0.35, -halfH * 0.85, noseTipZ,
      -halfW * 0.4, -halfH * 0.1, noseTipZ,
      -halfW * 0.85, halfH * 0.6, noseMidZ,
      -halfW, halfH, bodyZ,

      // 右侧流线鼻翼 (Right Nose Wing)
       halfW * 0.35, -halfH * 0.85, noseTipZ,
       halfW, -halfH, bodyZ,
       halfW, halfH, bodyZ,
       halfW * 0.85, halfH * 0.6, noseMidZ,
       halfW * 0.4, -halfH * 0.1, noseTipZ
    ]

    const noseIndices = [
      0, 1, 2, 0, 2, 3,        // Cockpit canopy
      4, 5, 6, 4, 6, 7,        // Duckbill top
      8, 9, 10, 8, 10, 11,     // Lower chin
      12, 13, 14, 12, 14, 15, 12, 15, 16, // Left wing
      17, 18, 19, 17, 19, 20, 17, 20, 21  // Right wing
    ]

    const noseUVs = [
      0.0, 0.66, 0.33, 0.66, 0.33, 0.85, 0.0, 0.85,
      0.0, 0.85, 0.33, 0.85, 0.33, 1.0,  0.0, 1.0,
      0.1, 0.9,  0.25, 0.9,  0.25, 1.0,  0.1, 1.0,
      0.35, 0.0, 0.5, 0.0, 0.5, 0.3, 0.4, 0.66, 0.35, 0.66,
      0.85, 0.0, 1.0, 0.0, 1.0, 0.66, 0.9, 0.66, 0.85, 0.3
    ]

    // 3. 车顶气动隔音导流罩 (Aerodynamic Sound Barrier Shroud)
    const shroudL = 0.45
    const shroudW = 0.28
    const shroudH = 0.12
    const shroudZ = -0.3
    const shroudY = halfH + shroudH / 2

    const shroudVertices = [
      -shroudW/2, shroudY + shroudH/2, shroudZ + shroudL/2,
       shroudW/2, shroudY + shroudH/2, shroudZ + shroudL/2,
       shroudW/2, shroudY + shroudH/2, shroudZ - shroudL/2,
      -shroudW/2, shroudY + shroudH/2, shroudZ - shroudL/2,

      -shroudW/2, halfH, shroudZ + shroudL/2,
       shroudW/2, halfH, shroudZ + shroudL/2,
       shroudW/2, shroudY + shroudH/2, shroudZ + shroudL/2,
      -shroudW/2, shroudY + shroudH/2, shroudZ + shroudL/2
    ]
    const shroudIndices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7]
    const shroudUVs = [
      0.7, 0.7, 0.95, 0.7, 0.95, 0.95, 0.7, 0.95,
      0.7, 0.7, 0.95, 0.7, 0.95, 0.8, 0.7, 0.8
    ]

    return [
      {
        id: 'shinkansen-body',
        name: '高速列车车身段',
        meshData: { vertices: bodyVertices, indices: bodyIndices, uvs: bodyUVs },
        explodeOffset: [0, 0, 0]
      },
      {
        id: 'aerodynamic-nose',
        name: '气动长鼻与多曲面驾驶舱',
        meshData: { vertices: noseVertices, indices: noseIndices, uvs: noseUVs },
        explodeOffset: [0, 0, 0.45]
      },
      {
        id: 'sound-shroud',
        name: '车顶气动隔音导流罩',
        meshData: { vertices: shroudVertices, indices: shroudIndices, uvs: shroudUVs },
        explodeOffset: [0, 0.35, 0]
      }
    ]
  },

  generateUnfoldedParts: () => {
    const L_body = 120
    const L_nose = 65
    const W = 36
    const H = 42
    const tabW = 7

    const startX = H + 15
    const startY = H + 15

    // 车顶
    const roofFace: UnfoldedFace = {
      id: 'roof',
      name: '车顶',
      textureSlot: 'roof',
      polygon2D: [
        { x: startX, y: startY },
        { x: startX + W, y: startY },
        { x: startX + W, y: startY + L_body },
        { x: startX, y: startY + L_body }
      ],
      uvCoords: [{ x: 0.66, y: 0.66 }, { x: 1, y: 0.66 }, { x: 1, y: 1 }, { x: 0.66, y: 1 }],
      creases: [
        { type: 'mountain', p1: { x: startX, y: startY }, p2: { x: startX + W, y: startY } },
        { type: 'mountain', p1: { x: startX + W, y: startY }, p2: { x: startX + W, y: startY + L_body } },
        { type: 'mountain', p1: { x: startX + W, y: startY + L_body }, p2: { x: startX, y: startY + L_body } },
        { type: 'mountain', p1: { x: startX, y: startY + L_body }, p2: { x: startX, y: startY } }
      ],
      glueTabs: []
    }

    // 流线气动鸭嘴长鼻
    const noseFace: UnfoldedFace = {
      id: 'front',
      name: '流线鸭嘴长鼻锥',
      textureSlot: 'front',
      polygon2D: [
        { x: startX, y: startY + L_body },
        { x: startX + W, y: startY + L_body },
        { x: startX + W * 0.7, y: startY + L_body + L_nose },
        { x: startX + W * 0.3, y: startY + L_body + L_nose }
      ],
      uvCoords: [{ x: 0, y: 0.66 }, { x: 0.33, y: 0.66 }, { x: 0.33, y: 1 }, { x: 0, y: 1 }],
      creases: [
        { type: 'cut', p1: { x: startX + W, y: startY + L_body }, p2: { x: startX + W * 0.7, y: startY + L_body + L_nose } },
        { type: 'cut', p1: { x: startX + W * 0.7, y: startY + L_body + L_nose }, p2: { x: startX + W * 0.3, y: startY + L_body + L_nose } },
        { type: 'cut', p1: { x: startX + W * 0.3, y: startY + L_body + L_nose }, p2: { x: startX, y: startY + L_body } }
      ],
      glueTabs: [
        {
          id: 'tab_nose_tip',
          label: 'A1',
          edgeIndex: 1,
          p1: { x: startX + W * 0.7, y: startY + L_body + L_nose },
          p2: { x: startX + W * 0.3, y: startY + L_body + L_nose },
          tabWidth: tabW,
          angle: 45,
          targetPartId: 'shinkansen-body',
          targetEdgeIndex: 0
        }
      ]
    }

    // 左侧车身 (含鼻翼)
    const leftFace: UnfoldedFace = {
      id: 'side_left',
      name: '左侧流线车身',
      textureSlot: 'side_left',
      polygon2D: [
        { x: startX - H, y: startY },
        { x: startX, y: startY },
        { x: startX, y: startY + L_body },
        { x: startX, y: startY + L_body + L_nose * 0.75 },
        { x: startX - H * 0.3, y: startY + L_body + L_nose },
        { x: startX - H, y: startY + L_body }
      ],
      uvCoords: [{ x: 0, y: 0.66 }, { x: 0.5, y: 0.66 }, { x: 0.5, y: 0 }, { x: 0, y: 0 }],
      creases: [
        { type: 'cut', p1: { x: startX - H, y: startY }, p2: { x: startX, y: startY } },
        { type: 'cut', p1: { x: startX - H, y: startY }, p2: { x: startX - H, y: startY + L_body } },
        { type: 'cut', p1: { x: startX - H, y: startY + L_body }, p2: { x: startX - H * 0.3, y: startY + L_body + L_nose } }
      ],
      glueTabs: [
        {
          id: 'tab_l_nose',
          label: 'N1',
          edgeIndex: 3,
          p1: { x: startX - H * 0.3, y: startY + L_body + L_nose },
          p2: { x: startX, y: startY + L_body + L_nose * 0.75 },
          tabWidth: tabW,
          angle: 45,
          targetPartId: 'shinkansen-body',
          targetEdgeIndex: 0
        }
      ]
    }

    // 右侧车身 (含鼻翼)
    const rightFace: UnfoldedFace = {
      id: 'side_right',
      name: '右侧流线车身',
      textureSlot: 'side_right',
      polygon2D: [
        { x: startX + W, y: startY },
        { x: startX + W + H, y: startY },
        { x: startX + W + H, y: startY + L_body },
        { x: startX + W + H * 0.3, y: startY + L_body + L_nose },
        { x: startX + W, y: startY + L_body + L_nose * 0.75 },
        { x: startX + W, y: startY + L_body }
      ],
      uvCoords: [{ x: 0.5, y: 0.66 }, { x: 1, y: 0.66 }, { x: 1, y: 0 }, { x: 0.5, y: 0 }],
      creases: [
        { type: 'cut', p1: { x: startX + W, y: startY }, p2: { x: startX + W + H, y: startY } },
        { type: 'cut', p1: { x: startX + W + H, y: startY }, p2: { x: startX + W + H, y: startY + L_body } },
        { type: 'cut', p1: { x: startX + W + H, y: startY + L_body }, p2: { x: startX + W + H * 0.3, y: startY + L_body + L_nose } }
      ],
      glueTabs: [
        {
          id: 'tab_r_nose',
          label: 'N2',
          edgeIndex: 3,
          p1: { x: startX + W, y: startY + L_body + L_nose * 0.75 },
          p2: { x: startX + W + H * 0.3, y: startY + L_body + L_nose },
          tabWidth: tabW,
          angle: 45,
          targetPartId: 'shinkansen-body',
          targetEdgeIndex: 1
        }
      ]
    }

    // 车尾
    const backFace: UnfoldedFace = {
      id: 'back',
      name: '车尾',
      textureSlot: 'back',
      polygon2D: [
        { x: startX, y: startY - H },
        { x: startX + W, y: startY - H },
        { x: startX + W, y: startY },
        { x: startX, y: startY }
      ],
      uvCoords: [{ x: 0.33, y: 1 }, { x: 0.66, y: 1 }, { x: 0.66, y: 0.66 }, { x: 0.33, y: 0.66 }],
      creases: [
        { type: 'cut', p1: { x: startX, y: startY - H }, p2: { x: startX + W, y: startY - H } },
        { type: 'cut', p1: { x: startX, y: startY - H }, p2: { x: startX, y: startY } },
        { type: 'cut', p1: { x: startX + W, y: startY - H }, p2: { x: startX + W, y: startY } }
      ],
      glueTabs: []
    }

    const bodyFaces = [roofFace, noseFace, leftFace, rightFace, backFace]
    const bodyPart: UnfoldedPart = {
      id: 'shinkansen-body',
      name: '新干线主体骨架',
      faces: bodyFaces,
      bounds: calculatePartBounds(bodyFaces)
    }

    // 车顶隔音导流罩
    const shroudFace: UnfoldedFace = {
      id: 'shroud',
      name: '隔音导流罩',
      textureSlot: 'roof',
      polygon2D: [
        { x: 155, y: 20 },
        { x: 155 + 24, y: 20 },
        { x: 155 + 24, y: 65 },
        { x: 155, y: 65 }
      ],
      uvCoords: [{ x: 0.7, y: 0.7 }, { x: 0.95, y: 0.7 }, { x: 0.95, y: 0.95 }, { x: 0.7, y: 0.95 }],
      creases: [
        { type: 'cut', p1: { x: 155, y: 20 }, p2: { x: 155 + 24, y: 20 } },
        { type: 'cut', p1: { x: 155 + 24, y: 20 }, p2: { x: 155 + 24, y: 65 } },
        { type: 'cut', p1: { x: 155 + 24, y: 65 }, p2: { x: 155, y: 65 } },
        { type: 'cut', p1: { x: 155, y: 65 }, p2: { x: 155, y: 20 } }
      ],
      glueTabs: [
        {
          id: 'tab_shroud',
          label: 'H1',
          edgeIndex: 3,
          p1: { x: 155, y: 65 },
          p2: { x: 155, y: 20 },
          tabWidth: 4,
          angle: 45,
          targetPartId: 'roof',
          targetEdgeIndex: 0
        }
      ]
    }

    const shroudPart: UnfoldedPart = {
      id: 'sound-shroud',
      name: '车顶气动隔音导流罩',
      faces: [shroudFace],
      bounds: calculatePartBounds([shroudFace])
    }

    return [bodyPart, shroudPart]
  }
}
