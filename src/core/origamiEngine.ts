// 3D 纸模折叠与展开动力学引擎 (Origami Folding Simulation Engine)
import * as THREE from 'three'
import { Point2D, CreaseType } from './types'

export interface OrigamiNode {
  id: string
  name: string
  // 面的顶点坐标 (局部 2D 坐标系，以毫米为单位)
  polygon2D: Point2D[]
  uvCoords: Point2D[]
  textureSlot: string
  // 铰链折叠定义 (相对于父节点)
  parentHinge?: {
    parentId: string
    edgeStart: Point2D // 铰链轴起点
    edgeEnd: Point2D   // 铰链轴终点
    foldAngleRad: number // 3D 折叠目标角度 (弧度，如 Math.PI / 2 为 90度)
    foldType: CreaseType // 'mountain' 或 'valley'
  }
  // 粘合舌片定义 (在展开动画中会展示)
  tabs?: {
    id: string
    label: string
    edgeStart: Point2D
    edgeEnd: Point2D
    tabWidth: number
    angle: number
  }[]
  // 子节点
  children?: OrigamiNode[]
}

export interface OrigamiModelTree {
  id: string
  name: string
  rootNode: OrigamiNode
  // 附加独立立体配件 (如受电弓、空调机、转向架)
  accessoryTrees?: OrigamiNode[]
}

/**
 * 递归构建 Three.js 铰链骨骼层级结构
 * @param node 当前折叠节点
 * @param texture 材质贴图
 * @param isWireframe 是否线框模式
 * @returns Three.js Group 包含了铰链动画结构
 */
export function buildOrigamiHierarchy(
  node: OrigamiNode,
  texture: THREE.Texture,
  isWireframe = false
): {
  group: THREE.Group
  animateFold: (unfoldProgress: number) => void
} {
  const group = new THREE.Group()
  group.name = `origami-node-${node.id}`

  // 1. 创建当前面的 Mesh
  // 使用 Shape / BufferGeometry 构建多边形
  const shape = new THREE.Shape()
  if (node.polygon2D.length > 0) {
    // 缩放到 3D 场景单位 (100mm -> 1.0 unit)
    const scale = 0.01
    shape.moveTo(node.polygon2D[0].x * scale, node.polygon2D[0].y * scale)
    for (let i = 1; i < node.polygon2D.length; i++) {
      shape.lineTo(node.polygon2D[i].x * scale, node.polygon2D[i].y * scale)
    }
    shape.closePath()
  }

  const geometry = new THREE.ShapeGeometry(shape)

  // 计算 UV 坐标
  const posAttr = geometry.attributes.position
  if (node.uvCoords && node.uvCoords.length >= 4) {
    // 简单根据顶点 bounding box 映射 UV
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const p of node.polygon2D) {
      if (p.x < minX) minX = p.x
      if (p.y < minY) minY = p.y
      if (p.x > maxX) maxX = p.x
      if (p.y > maxY) maxY = p.y
    }
    const w = maxX - minX || 1
    const h = maxY - minY || 1

    const uvs: number[] = []
    for (let i = 0; i < posAttr.count; i++) {
      const px = posAttr.getX(i) / 0.01
      const py = posAttr.getY(i) / 0.01
      const uNorm = (px - minX) / w
      const vNorm = (py - minY) / h

      // 映射到目标 UV slot 空间
      const u0 = node.uvCoords[0].x
      const v0 = node.uvCoords[0].y
      const u1 = node.uvCoords[2]?.x ?? (u0 + 0.3)
      const v1 = node.uvCoords[2]?.y ?? (v0 + 0.3)

      uvs.push(u0 + uNorm * (u1 - u0), v0 + vNorm * (v1 - v0))
    }
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  }

  geometry.computeVertexNormals()

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
    roughness: 0.5,
    metalness: 0.1,
    wireframe: isWireframe
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  group.add(mesh)

  // 2. 递归创建子节点并挂载到铰链位置
  const childAnimators: ((unfoldProgress: number) => void)[] = []

  if (node.children) {
    for (const child of node.children) {
      if (!child.parentHinge) continue

      const hinge = child.parentHinge
      const scale = 0.01
      const p1 = new THREE.Vector3(hinge.edgeStart.x * scale, hinge.edgeStart.y * scale, 0)
      const p2 = new THREE.Vector3(hinge.edgeEnd.x * scale, hinge.edgeEnd.y * scale, 0)

      // 铰链中心位置与旋转轴
      const hingeCenter = p1.clone().add(p2).multiplyScalar(0.5)
      const hingeAxis = p2.clone().sub(p1).normalize()

      // 创建铰链旋转 Group
      const hingeGroup = new THREE.Group()
      hingeGroup.position.copy(hingeCenter)

      // 子节点层级构建
      const childResult = buildOrigamiHierarchy(child, texture, isWireframe)
      // 子节点内容需要相对于铰链中心偏移
      childResult.group.position.sub(hingeCenter)
      hingeGroup.add(childResult.group)

      group.add(hingeGroup)

      // 动画更新函数
      const maxFoldAngle = hinge.foldAngleRad
      childAnimators.push((unfoldProgress: number) => {
        // unfoldProgress: 0 为完全折叠 (3D状态), 1 为完全展开 (2D状态)
        const currentAngle = maxFoldAngle * (1 - unfoldProgress)
        hingeGroup.setRotationFromAxisAngle(hingeAxis, currentAngle)
        childResult.animateFold(unfoldProgress)
      })
    }
  }

  const animateFold = (unfoldProgress: number) => {
    for (const anim of childAnimators) {
      anim(unfoldProgress)
    }
  }

  return {
    group,
    animateFold
  }
}
