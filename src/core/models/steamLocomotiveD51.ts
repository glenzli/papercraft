// 大正浪漫复古蒸汽机车 (以 D51 “SL人吉/蒸気機関車” 为蓝本)
import { PapercraftModelData, UnfoldedPart, UnfoldedFace } from '../types'
import { calculatePartBounds } from '../unfoldEngine'

export const steamLocomotiveD51: PapercraftModelData = {
  id: 'steam-locomotive-d51',
  name: '复古蒸汽机车 (JR D51 蒸気機関車)',
  category: 'train',
  description: '经典大正黑金蒸汽火车：圆柱多棱蒸汽锅炉、立式排烟烟囱、蒸汽圆顶、复古大车灯与后部乘务驾驶舱。',
  difficulty: 'advanced',
  recommendedAge: '8-14 岁',
  estimatedTime: '35-50 分钟',
  partsCount: 5, // 蒸汽锅炉主体、后部驾驶舱、排烟烟囱、蒸汽穹顶、车头大灯
  dimensions: {
    length: 170, // mm
    width: 40,   // mm
    height: 56   // mm
  },

  create3DParts: () => {
    const boilerL = 1.1
    const boilerR = 0.22
    const cabL = 0.5
    const cabW = 0.4
    const cabH = 0.48

    // 1. 多面圆柱形蒸汽锅炉 (Octagonal Boiler)
    const segments = 8
    const boilerVerts: number[] = []
    const boilerIndices: number[] = []
    const boilerUVs: number[] = []

    const startZ = -0.1
    const endZ = startZ + boilerL

    for (let i = 0; i < segments; i++) {
      const a1 = (i / segments) * Math.PI * 2
      const a2 = ((i + 1) / segments) * Math.PI * 2

      const x1 = Math.cos(a1) * boilerR
      const y1 = Math.sin(a1) * boilerR
      const x2 = Math.cos(a2) * boilerR
      const y2 = Math.sin(a2) * boilerR

      const baseIdx = boilerVerts.length / 3
      boilerVerts.push(
        x1, y1, endZ,
        x2, y2, endZ,
        x2, y2, startZ,
        x1, y1, startZ
      )
      boilerIndices.push(
        baseIdx, baseIdx + 1, baseIdx + 2,
        baseIdx, baseIdx + 2, baseIdx + 3
      )

      const u1 = i / segments
      const u2 = (i + 1) / segments
      boilerUVs.push(
        u1 * 0.5, 0.0,
        u2 * 0.5, 0.0,
        u2 * 0.5, 0.66,
        u1 * 0.5, 0.66
      )
    }

    // 锅炉前圆盖 (Boiler Front Smokebox Door)
    const frontCenterIdx = boilerVerts.length / 3
    boilerVerts.push(0, 0, endZ)
    boilerUVs.push(0.16, 0.83)
    for (let i = 0; i < segments; i++) {
      const a1 = (i / segments) * Math.PI * 2
      const a2 = ((i + 1) / segments) * Math.PI * 2
      const x1 = Math.cos(a1) * boilerR
      const y1 = Math.sin(a1) * boilerR
      const x2 = Math.cos(a2) * boilerR
      const y2 = Math.sin(a2) * boilerR

      const v1 = boilerVerts.length / 3
      boilerVerts.push(x1, y1, endZ, x2, y2, endZ)
      boilerUVs.push(0.16 + (x1 / boilerR) * 0.15, 0.83 + (y1 / boilerR) * 0.15)
      boilerUVs.push(0.16 + (x2 / boilerR) * 0.15, 0.83 + (y2 / boilerR) * 0.15)

      boilerIndices.push(frontCenterIdx, v1, v1 + 1)
    }

    // 2. 后部乘务驾驶舱 (Rear Cab)
    const cabVerts = [
      // Cab Front
      -cabW/2, -cabH/2, startZ,  cabW/2, -cabH/2, startZ,
       cabW/2,  cabH/2, startZ, -cabW/2,  cabH/2, startZ,
      // Cab Back
       cabW/2, -cabH/2, startZ - cabL, -cabW/2, -cabH/2, startZ - cabL,
      -cabW/2,  cabH/2, startZ - cabL,  cabW/2,  cabH/2, startZ - cabL,
      // Cab Roof
      -cabW/2, cabH/2, startZ, cabW/2, cabH/2, startZ,
       cabW/2, cabH/2, startZ - cabL, -cabW/2, cabH/2, startZ - cabL,
      // Cab Sides
      -cabW/2, -cabH/2, startZ - cabL, -cabW/2, -cabH/2, startZ,
      -cabW/2,  cabH/2, startZ,        -cabW/2,  cabH/2, startZ - cabL,
       cabW/2, -cabH/2, startZ,         cabW/2, -cabH/2, startZ - cabL,
       cabW/2,  cabH/2, startZ - cabL,  cabW/2,  cabH/2, startZ
    ]
    const cabIndices = [
      0, 1, 2, 0, 2, 3,
      4, 5, 6, 4, 6, 7,
      8, 9, 10, 8, 10, 11,
      12, 13, 14, 12, 14, 15,
      16, 17, 18, 16, 18, 19
    ]
    const cabUVs = [
      0.0, 0.66, 0.33, 0.66, 0.33, 1.0, 0.0, 1.0,
      0.33, 0.66, 0.66, 0.66, 0.66, 1.0, 0.33, 1.0,
      0.66, 0.66, 1.0, 0.66, 1.0, 1.0, 0.66, 1.0,
      0.5, 0.0, 0.75, 0.0, 0.75, 0.66, 0.5, 0.66,
      0.75, 0.0, 1.0, 0.0, 1.0, 0.66, 0.75, 0.66
    ]

    // 3. 立式排烟烟囱 (Smokestack Chimney)
    const chimR = 0.08
    const chimH = 0.22
    const chimZ = endZ - 0.2
    const chimY = boilerR + chimH / 2

    const chimVerts = [
      -chimR, chimY + chimH/2, chimZ + chimR,
       chimR, chimY + chimH/2, chimZ + chimR,
       chimR, chimY + chimH/2, chimZ - chimR,
      -chimR, chimY + chimH/2, chimZ - chimR,

      -chimR, boilerR * 0.8, chimZ + chimR,
       chimR, boilerR * 0.8, chimZ + chimR,
       chimR, chimY + chimH/2, chimZ + chimR,
      -chimR, chimY + chimH/2, chimZ + chimR
    ]
    const chimIndices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7]
    const chimUVs = [
      0.7, 0.7, 0.95, 0.7, 0.95, 0.95, 0.7, 0.95,
      0.7, 0.7, 0.95, 0.7, 0.95, 0.8, 0.7, 0.8
    ]

    // 4. 前照大车灯 (Headlight Lamp)
    const lampR = 0.09
    const lampL = 0.12
    const lampZ = endZ + lampL / 2
    const lampY = boilerR * 0.35

    const lampVerts = [
      -lampR, lampY - lampR, lampZ + lampL/2,
       lampR, lampY - lampR, lampZ + lampL/2,
       lampR, lampY + lampR, lampZ + lampL/2,
      -lampR, lampY + lampR, lampZ + lampL/2
    ]
    const lampIndices = [0, 1, 2, 0, 2, 3]
    const lampUVs = [0.0, 0.66, 0.33, 0.66, 0.33, 1.0, 0.0, 1.0]

    return [
      {
        id: 'boiler',
        name: '蒸汽多棱柱锅炉',
        meshData: { vertices: boilerVerts, indices: boilerIndices, uvs: boilerUVs },
        explodeOffset: [0, 0, 0]
      },
      {
        id: 'cab',
        name: '乘务员驾驶室',
        meshData: { vertices: cabVerts, indices: cabIndices, uvs: cabUVs },
        explodeOffset: [0, 0, -0.3]
      },
      {
        id: 'chimney',
        name: '立式排烟烟囱',
        meshData: { vertices: chimVerts, indices: chimIndices, uvs: chimUVs },
        explodeOffset: [0, 0.35, 0]
      },
      {
        id: 'headlight',
        name: '复古前照大灯',
        meshData: { vertices: lampVerts, indices: lampIndices, uvs: lampUVs },
        explodeOffset: [0, 0, 0.3]
      }
    ]
  },

  generateUnfoldedParts: () => {
    const W = 40
    const H = 48
    const L_cab = 50
    const L_boiler = 110
    const tabW = 7

    const startX = H + 12
    const startY = H + 12

    // 1. 驾驶室展开
    const cabRoofFace: UnfoldedFace = {
      id: 'roof',
      name: '驾驶室顶盖',
      textureSlot: 'roof',
      polygon2D: [
        { x: startX, y: startY },
        { x: startX + W, y: startY },
        { x: startX + W, y: startY + L_cab },
        { x: startX, y: startY + L_cab }
      ],
      uvCoords: [{ x: 0.66, y: 0.66 }, { x: 1, y: 0.66 }, { x: 1, y: 1 }, { x: 0.66, y: 1 }],
      creases: [
        { type: 'mountain', p1: { x: startX, y: startY }, p2: { x: startX + W, y: startY } },
        { type: 'mountain', p1: { x: startX + W, y: startY }, p2: { x: startX + W, y: startY + L_cab } },
        { type: 'mountain', p1: { x: startX + W, y: startY + L_cab }, p2: { x: startX, y: startY + L_cab } },
        { type: 'mountain', p1: { x: startX, y: startY + L_cab }, p2: { x: startX, y: startY } }
      ],
      glueTabs: []
    }

    const cabLeftFace: UnfoldedFace = {
      id: 'side_left',
      name: '驾驶室左侧',
      textureSlot: 'side_left',
      polygon2D: [
        { x: startX - H, y: startY },
        { x: startX, y: startY },
        { x: startX, y: startY + L_cab },
        { x: startX - H, y: startY + L_cab }
      ],
      uvCoords: [{ x: 0.5, y: 0.66 }, { x: 0.75, y: 0.66 }, { x: 0.75, y: 0 }, { x: 0.5, y: 0 }],
      creases: [
        { type: 'cut', p1: { x: startX - H, y: startY }, p2: { x: startX, y: startY } },
        { type: 'cut', p1: { x: startX - H, y: startY }, p2: { x: startX - H, y: startY + L_cab } }
      ],
      glueTabs: [
        {
          id: 'tab_cab_l',
          label: 'B1',
          edgeIndex: 0,
          p1: { x: startX, y: startY },
          p2: { x: startX - H, y: startY },
          tabWidth: tabW,
          angle: 45,
          targetPartId: 'cab',
          targetEdgeIndex: 0
        }
      ]
    }

    const cabRightFace: UnfoldedFace = {
      id: 'side_right',
      name: '驾驶室右侧',
      textureSlot: 'side_right',
      polygon2D: [
        { x: startX + W, y: startY },
        { x: startX + W + H, y: startY },
        { x: startX + W + H, y: startY + L_cab },
        { x: startX + W, y: startY + L_cab }
      ],
      uvCoords: [{ x: 0.75, y: 0.66 }, { x: 1.0, y: 0.66 }, { x: 1.0, y: 0 }, { x: 0.75, y: 0 }],
      creases: [
        { type: 'cut', p1: { x: startX + W + H, y: startY }, p2: { x: startX + W, y: startY } },
        { type: 'cut', p1: { x: startX + W + H, y: startY }, p2: { x: startX + W + H, y: startY + L_cab } }
      ],
      glueTabs: [
        {
          id: 'tab_cab_r',
          label: 'B2',
          edgeIndex: 0,
          p1: { x: startX + W + H, y: startY },
          p2: { x: startX + W, y: startY },
          tabWidth: tabW,
          angle: 45,
          targetPartId: 'cab',
          targetEdgeIndex: 0
        }
      ]
    }

    const cabFaces = [cabRoofFace, cabLeftFace, cabRightFace]
    const cabPart: UnfoldedPart = {
      id: 'cab',
      name: '后部乘务驾驶舱',
      faces: cabFaces,
      bounds: calculatePartBounds(cabFaces)
    }

    // 2. 蒸汽多棱柱锅炉展开
    const boilerFace: UnfoldedFace = {
      id: 'boiler_net',
      name: '蒸汽圆筒多棱柱锅炉',
      textureSlot: 'side_left',
      polygon2D: [
        { x: startX, y: startY + L_cab + 10 },
        { x: startX + W * 1.5, y: startY + L_cab + 10 },
        { x: startX + W * 1.5, y: startY + L_cab + 10 + L_boiler },
        { x: startX, y: startY + L_cab + 10 + L_boiler }
      ],
      uvCoords: [{ x: 0.0, y: 0.0 }, { x: 0.5, y: 0.0 }, { x: 0.5, y: 0.66 }, { x: 0.0, y: 0.66 }],
      creases: [
        { type: 'mountain', p1: { x: startX + W * 0.3, y: startY + L_cab + 10 }, p2: { x: startX + W * 0.3, y: startY + L_cab + 10 + L_boiler } },
        { type: 'mountain', p1: { x: startX + W * 0.6, y: startY + L_cab + 10 }, p2: { x: startX + W * 0.6, y: startY + L_cab + 10 + L_boiler } },
        { type: 'mountain', p1: { x: startX + W * 0.9, y: startY + L_cab + 10 }, p2: { x: startX + W * 0.9, y: startY + L_cab + 10 + L_boiler } },
        { type: 'mountain', p1: { x: startX + W * 1.2, y: startY + L_cab + 10 }, p2: { x: startX + W * 1.2, y: startY + L_cab + 10 + L_boiler } },
        { type: 'cut', p1: { x: startX, y: startY + L_cab + 10 }, p2: { x: startX + W * 1.5, y: startY + L_cab + 10 } },
        { type: 'cut', p1: { x: startX, y: startY + L_cab + 10 + L_boiler }, p2: { x: startX + W * 1.5, y: startY + L_cab + 10 + L_boiler } }
      ],
      glueTabs: [
        {
          id: 'tab_boiler_seal',
          label: 'S1',
          edgeIndex: 3,
          p1: { x: startX, y: startY + L_cab + 10 + L_boiler },
          p2: { x: startX, y: startY + L_cab + 10 },
          tabWidth: 6,
          angle: 45,
          targetPartId: 'boiler',
          targetEdgeIndex: 0
        }
      ]
    }

    const boilerPart: UnfoldedPart = {
      id: 'boiler',
      name: '圆柱蒸汽锅炉',
      faces: [boilerFace],
      bounds: calculatePartBounds([boilerFace])
    }

    // 3. 烟囱与车灯配件
    const chimFace: UnfoldedFace = {
      id: 'chimney_face',
      name: '立式烟囱与大灯',
      textureSlot: 'ac_unit',
      polygon2D: [
        { x: 155, y: 20 },
        { x: 155 + 24, y: 20 },
        { x: 155 + 24, y: 55 },
        { x: 155, y: 55 }
      ],
      uvCoords: [{ x: 0.7, y: 0.7 }, { x: 0.95, y: 0.7 }, { x: 0.95, y: 0.95 }, { x: 0.7, y: 0.95 }],
      creases: [
        { type: 'cut', p1: { x: 155, y: 20 }, p2: { x: 155 + 24, y: 20 } },
        { type: 'cut', p1: { x: 155 + 24, y: 20 }, p2: { x: 155 + 24, y: 55 } },
        { type: 'cut', p1: { x: 155 + 24, y: 55 }, p2: { x: 155, y: 55 } },
        { type: 'cut', p1: { x: 155, y: 55 }, p2: { x: 155, y: 20 } }
      ],
      glueTabs: [
        {
          id: 'tab_chim',
          label: 'C1',
          edgeIndex: 0,
          p1: { x: 155, y: 20 },
          p2: { x: 155 + 24, y: 20 },
          tabWidth: 4,
          angle: 45,
          targetPartId: 'boiler',
          targetEdgeIndex: 0
        }
      ]
    }

    const chimPart: UnfoldedPart = {
      id: 'accessories',
      name: '立式烟囱与前照大灯',
      faces: [chimFace],
      bounds: calculatePartBounds([chimFace])
    }

    return [cabPart, boilerPart, chimPart]
  }
}
