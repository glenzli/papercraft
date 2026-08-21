import * as THREE from 'three'

/**
 * 3D 原始顶点与 UV
 */
export interface UnfolderVertex3D {
  id: number
  position: THREE.Vector3
  uv: THREE.Vector2
}

/**
 * 3D 多边形/三角形面
 */
export interface UnfolderFace3D {
  id: number
  name?: string
  slotName?: string
  vertexIds: number[]
  vertices: THREE.Vector3[]
  uvs: THREE.Vector2[]
  normal: THREE.Vector3
  center: THREE.Vector3
}

/**
 * 3D 边（连接两个顶点，关联 1 或 2 个面）
 */
export interface UnfolderEdge3D {
  id: string // "v1_v2" where v1 < v2
  v1: number
  v2: number
  faceIds: number[]
  dihedralAngle: number // 弧度：> 0 为凸面（山折），< 0 为凹面（谷折），~0 为平面
  isSeam: boolean       // 是否强制剪开为接缝
}

/**
 * 2D 展开顶点（单位：mm）
 */
export interface UnfoldedVertex2D {
  id: number
  vertex3DId: number
  pos: THREE.Vector2
  uv: THREE.Vector2
}

/**
 * 2D 折痕与剪切线
 */
export interface UnfoldedCrease2D {
  type: 'mountain' | 'valley' | 'cut' | 'none'
  p1: THREE.Vector2
  p2: THREE.Vector2
  edgeId?: string
}

/**
 * 2D 粘合翼（梯形胶水舌片）
 */
export interface UnfoldedTab2D {
  id: string
  label: string
  p1: THREE.Vector2 // 底部起点 (连接在面上)
  p2: THREE.Vector2 // 底部终点
  p3: THREE.Vector2 // 顶部终点 (45° 倒角向内)
  p4: THREE.Vector2 // 顶部起点
  tabWidth: number
  targetEdgeId?: string
  targetFaceId?: string
}

/**
 * 2D 展开面（单位：mm）
 */
export interface UnfoldedFace2D {
  face3DId: number
  name?: string
  slotName?: string
  vertices: UnfoldedVertex2D[]
  creases: UnfoldedCrease2D[]
  tabs: UnfoldedTab2D[]
}

/**
 * 2D 展开岛屿（一个连通的纸模拼图块）
 */
export interface UnfoldedIsland2D {
  id: number
  faces: UnfoldedFace2D[]
  creases: UnfoldedCrease2D[]
  tabs: UnfoldedTab2D[]
  boundary: { p1: THREE.Vector2; p2: THREE.Vector2 }[]
  boundingBox: { min: THREE.Vector2; max: THREE.Vector2; width: number; height: number }
}

/**
 * 展开配置项
 */
export interface UnfolderOptions {
  tabWidth?: number       // 粘合翼宽度（默认 6mm）
  tabAngle?: number       // 粘合翼倒角角度（默认 45°）
  seamEdges?: string[]    // 指定为切口的边 (形如 "0_1")
  rootFaceId?: number     // 展开生成树的根面
}

/**
 * 工业级 Three.js 纸模展开引擎
 */
export class ThreeMeshUnfolder {
  private vertices: UnfolderVertex3D[] = []
  private faces: UnfolderFace3D[] = []
  private edges: Map<string, UnfolderEdge3D> = new Map()

  /**
   * 从 Three.js BufferGeometry 加载并解析网格
   */
  public loadFromBufferGeometry(geo: THREE.BufferGeometry, slotName = 'body'): this {
    this.vertices = []
    this.faces = []
    this.edges.clear()

    const posAttr = geo.getAttribute('position')
    const uvAttr = geo.getAttribute('uv')
    const indexAttr = geo.getIndex()

    if (!posAttr) throw new Error('BufferGeometry 缺少 position 属性')

    // 1. 读取顶点
    const numVerts = posAttr.count
    for (let i = 0; i < numVerts; i++) {
      const v = new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i))
      const uv = uvAttr ? new THREE.Vector2(uvAttr.getX(i), uvAttr.getY(i)) : new THREE.Vector2(0, 0)
      this.vertices.push({ id: i, position: v, uv })
    }

    // 2. 读取面
    if (indexAttr) {
      for (let i = 0; i < indexAttr.count; i += 3) {
        const i0 = indexAttr.getX(i)
        const i1 = indexAttr.getX(i + 1)
        const i2 = indexAttr.getX(i + 2)
        this.addFace([i0, i1, i2], slotName)
      }
    } else {
      for (let i = 0; i < numVerts; i += 3) {
        this.addFace([i, i + 1, i + 2], slotName)
      }
    }

    this.calculateDihedralAngles()
    return this
  }

  /**
   * 手动添加面
   */
  public addFace(vertexIds: number[], slotName = 'body', name?: string): UnfolderFace3D {
    const faceId = this.faces.length
    const v0 = this.vertices[vertexIds[0]].position
    const v1 = this.vertices[vertexIds[1]].position
    const v2 = this.vertices[vertexIds[2]].position

    // 计算法线与中心
    const edge1 = new THREE.Vector3().subVectors(v1, v0)
    const edge2 = new THREE.Vector3().subVectors(v2, v0)
    const normal = new THREE.Vector3().crossVectors(edge1, edge2).normalize()

    const center = new THREE.Vector3()
    for (const vid of vertexIds) {
      center.add(this.vertices[vid].position)
    }
    center.divideScalar(vertexIds.length)

    const face: UnfolderFace3D = {
      id: faceId,
      name: name || `Face_${faceId}`,
      slotName,
      vertexIds: [...vertexIds],
      vertices: vertexIds.map(vid => this.vertices[vid].position.clone()),
      uvs: vertexIds.map(vid => this.vertices[vid].uv.clone()),
      normal,
      center
    }

    this.faces.push(face)

    // 注册面所包含的所有边
    for (let i = 0; i < vertexIds.length; i++) {
      const vidA = vertexIds[i]
      const vidB = vertexIds[(i + 1) % vertexIds.length]
      const edgeKey = this.getEdgeKey(vidA, vidB)

      if (!this.edges.has(edgeKey)) {
        this.edges.set(edgeKey, {
          id: edgeKey,
          v1: Math.min(vidA, vidB),
          v2: Math.max(vidA, vidB),
          faceIds: [faceId],
          dihedralAngle: 0,
          isSeam: false
        })
      } else {
        const edge = this.edges.get(edgeKey)!
        if (!edge.faceIds.includes(faceId)) {
          edge.faceIds.push(faceId)
        }
      }
    }

    return face
  }

  /**
   * 计算所有共享边的二面角 (Dihedral Angle)
   */
  private calculateDihedralAngles() {
    for (const edge of this.edges.values()) {
      if (edge.faceIds.length === 2) {
        const fA = this.faces[edge.faceIds[0]]
        const fB = this.faces[edge.faceIds[1]]

        // 法线夹角余弦
        const dot = THREE.MathUtils.clamp(fA.normal.dot(fB.normal), -1, 1)
        const angle = Math.acos(dot)

        // 判定凸凹：计算边向量与法线交叉积的方向
        const vA = this.vertices[edge.v1].position
        const vB = this.vertices[edge.v2].position
        const edgeVec = new THREE.Vector3().subVectors(vB, vA).normalize()

        // 从面 A 中心指向面 B 中心的向量
        const crossNormals = new THREE.Vector3().crossVectors(fA.normal, fB.normal)

        // 如果交叉向量与边向量同向，则为山折（凸折），否则为谷折
        const sign = crossNormals.dot(edgeVec) >= 0 ? 1 : -1
        edge.dihedralAngle = sign * angle
      }
    }
  }

  /**
   * 运行对偶图生成树等距展开
   */
  public unfold(options: UnfolderOptions = {}): UnfoldedIsland2D[] {
    const tabWidth = options.tabWidth ?? 6
    const tabAngle = options.tabAngle ?? 45
    const seamEdges = new Set(options.seamEdges || [])

    if (this.faces.length === 0) return []

    // 1. 构建面与面的邻接图（对偶图 Dual Graph）
    const faceAdjacency: Map<number, { faceId: number; edge: UnfolderEdge3D; commonV1: number; commonV2: number }[]> = new Map()
    for (const f of this.faces) {
      faceAdjacency.set(f.id, [])
    }

    for (const edge of this.edges.values()) {
      if (edge.faceIds.length === 2 && !seamEdges.has(edge.id)) {
        const [f0, f1] = edge.faceIds
        faceAdjacency.get(f0)!.push({ faceId: f1, edge, commonV1: edge.v1, commonV2: edge.v2 })
        faceAdjacency.get(f1)!.push({ faceId: f0, edge, commonV1: edge.v1, commonV2: edge.v2 })
      }
    }

    // 2. 广度优先生成树（BFS Spanning Tree）寻找展开拓扑
    const visitedFaces = new Set<number>()
    const treeHingeEdges = new Set<string>() // 树上的折痕边
    const cutEdges = new Set<UnfolderEdge3D>() // 被剪开的边

    const rootFaceId = options.rootFaceId !== undefined && this.faces[options.rootFaceId] ? options.rootFaceId : 0
    const islandFaces: UnfoldedFace2D[] = []
    const face2DMap: Map<number, Map<number, THREE.Vector2>> = new Map() // faceId -> (vertex3DId -> 2D pos)

    // 队列中存放: [当前面ID, 来自的父面ID, 共享的两个顶点A, B]
    const queue: { faceId: number; parentFaceId: number | null; edge: UnfolderEdge3D | null }[] = [
      { faceId: rootFaceId, parentFaceId: null, edge: null }
    ]
    visitedFaces.add(rootFaceId)

    // 展开根面 (放在原点)
    const rootFace = this.faces[rootFaceId]
    const root2DVerts = this.flattenFaceTo2D(rootFace)
    face2DMap.set(rootFaceId, root2DVerts)

    while (queue.length > 0) {
      const { faceId, parentFaceId, edge } = queue.shift()!
      const currentFace = this.faces[faceId]

      if (parentFaceId !== null && edge !== null) {
        treeHingeEdges.add(edge.id)

        // 刚性等距对齐：利用两圆交点计算当前面在 2D 平面中的严格等距坐标
        const parent2DVerts = face2DMap.get(parentFaceId)!
        const current2DVerts = this.isometricallyUnfoldFace(currentFace, parentFaceId, edge, parent2DVerts)
        face2DMap.set(faceId, current2DVerts)
      }

      // 遍历相邻面
      const neighbors = faceAdjacency.get(faceId) || []
      // 按照边长从长到短排序，优先让长边作为折痕铰链
      neighbors.sort((a, b) => {
        const lenA = this.vertices[a.edge.v1].position.distanceTo(this.vertices[a.edge.v2].position)
        const lenB = this.vertices[b.edge.v1].position.distanceTo(this.vertices[b.edge.v2].position)
        return lenB - lenA
      })

      for (const nb of neighbors) {
        if (!visitedFaces.has(nb.faceId)) {
          visitedFaces.add(nb.faceId)
          queue.push({ faceId: nb.faceId, parentFaceId: faceId, edge: nb.edge })
        }
      }
    }

    // 3. 统计所有切开的缝（Cut Edges）
    for (const edge of this.edges.values()) {
      if (!treeHingeEdges.has(edge.id)) {
        cutEdges.add(edge)
      }
    }

    // 4. 生成所有 2D 面、折痕与自动粘合翼
    const creases: UnfoldedCrease2D[] = []
    const tabs: UnfoldedTab2D[] = []
    let tabIndex = 1

    for (const face of this.faces) {
      if (!face2DMap.has(face.id)) continue
      const v2dMap = face2DMap.get(face.id)!

      const faceVertices2D: UnfoldedVertex2D[] = face.vertexIds.map(vid => ({
        id: vid,
        vertex3DId: vid,
        pos: v2dMap.get(vid)!.clone(),
        uv: this.vertices[vid].uv.clone()
      }))

      const faceCreases: UnfoldedCrease2D[] = []
      const faceTabs: UnfoldedTab2D[] = []

      // 检查面的每一条边
      for (let i = 0; i < face.vertexIds.length; i++) {
        const vidA = face.vertexIds[i]
        const vidB = face.vertexIds[(i + 1) % face.vertexIds.length]
        const edgeKey = this.getEdgeKey(vidA, vidB)
        const edge = this.edges.get(edgeKey)!

        const pA = v2dMap.get(vidA)!
        const pB = v2dMap.get(vidB)!

        if (treeHingeEdges.has(edgeKey)) {
          // 铰链折痕
          const creaseType: 'mountain' | 'valley' = edge.dihedralAngle >= 0 ? 'mountain' : 'valley'
          const crease: UnfoldedCrease2D = { type: creaseType, p1: pA.clone(), p2: pB.clone(), edgeId: edgeKey }
          faceCreases.push(crease)
          creases.push(crease)
        } else {
          // 切切实线
          const cutCrease: UnfoldedCrease2D = { type: 'cut', p1: pA.clone(), p2: pB.clone(), edgeId: edgeKey }
          faceCreases.push(cutCrease)
          creases.push(cutCrease)

          // 如果该边在 3D 中连接了两个面，且当前面是较小序号的面，在此边上自动生成粘合翼
          if (edge.faceIds.length === 2 && edge.faceIds[0] === face.id) {
            const flap = this.createGlueTab(pA, pB, tabWidth, tabAngle, `T${tabIndex++}`, edgeKey)
            faceTabs.push(flap)
            tabs.push(flap)
          }
        }
      }

      islandFaces.push({
        face3DId: face.id,
        name: face.name,
        slotName: face.slotName,
        vertices: faceVertices2D,
        creases: faceCreases,
        tabs: faceTabs
      })
    }

    // 5. 计算包围盒
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const f of islandFaces) {
      for (const v of f.vertices) {
        minX = Math.min(minX, v.pos.x)
        minY = Math.min(minY, v.pos.y)
        maxX = Math.max(maxX, v.pos.x)
        maxY = Math.max(maxY, v.pos.y)
      }
      for (const t of f.tabs) {
        minX = Math.min(minX, t.p3.x, t.p4.x)
        minY = Math.min(minY, t.p3.y, t.p4.y)
        maxX = Math.max(maxX, t.p3.x, t.p4.x)
        maxY = Math.max(maxY, t.p3.y, t.p4.y)
      }
    }

    const island: UnfoldedIsland2D = {
      id: 0,
      faces: islandFaces,
      creases,
      tabs,
      boundary: [],
      boundingBox: {
        min: new THREE.Vector2(minX, minY),
        max: new THREE.Vector2(maxX, maxY),
        width: maxX - minX,
        height: maxY - minY
      }
    }

    return [island]
  }

  /**
   * 将单个 3D 面刚性平摊到 2D 原点
   */
  private flattenFaceTo2D(face: UnfolderFace3D): Map<number, THREE.Vector2> {
    const result = new Map<number, THREE.Vector2>()
    const v0 = face.vertices[0]
    const v1 = face.vertices[1]

    // 第一个点放在 (0, 0)
    result.set(face.vertexIds[0], new THREE.Vector2(0, 0))

    // 第二个点放在 X 轴正方向，距离为 3D 边长
    const len01 = v0.distanceTo(v1)
    result.set(face.vertexIds[1], new THREE.Vector2(len01, 0))

    // 后续点通过两圆交点确定
    const p0_2d = result.get(face.vertexIds[0])!
    const p1_2d = result.get(face.vertexIds[1])!

    for (let i = 2; i < face.vertexIds.length; i++) {
      const vi = face.vertices[i]
      const d0 = v0.distanceTo(vi)
      const d1 = v1.distanceTo(vi)

      const pi_2d = this.findCircleIntersection(p0_2d, p1_2d, d0, d1, true)
      result.set(face.vertexIds[i], pi_2d)
    }

    return result
  }

  /**
   * 刚性等距展开：给定父面的两个 2D 顶点，计算当前面剩余顶点的 2D 坐标（保长保角）
   */
  private isometricallyUnfoldFace(
    face: UnfolderFace3D,
    _parentFaceId: number,
    edge: UnfolderEdge3D,
    parent2DVerts: Map<number, THREE.Vector2>
  ): Map<number, THREE.Vector2> {
    const result = new Map<number, THREE.Vector2>()

    // 共享边的两个点在 2D 中的位置已确定
    const pA_2d = parent2DVerts.get(edge.v1)!
    const pB_2d = parent2DVerts.get(edge.v2)!
    result.set(edge.v1, pA_2d.clone())
    result.set(edge.v2, pB_2d.clone())

    const vA_3d = this.vertices[edge.v1].position
    const vB_3d = this.vertices[edge.v2].position

    // 计算当前面剩余顶点
    for (const vid of face.vertexIds) {
      if (vid === edge.v1 || vid === edge.v2) continue

      const vC_3d = this.vertices[vid].position
      const dAC = vA_3d.distanceTo(vC_3d)
      const dBC = vB_3d.distanceTo(vC_3d)

      // 在 2D 中求解圆 A(r=dAC) 与 圆 B(r=dBC) 的交点
      // 选择使 2D 面朝向与 3D 面朝向一致的那个交点
      const pC_candidate1 = this.findCircleIntersection(pA_2d, pB_2d, dAC, dBC, true)
      const pC_candidate2 = this.findCircleIntersection(pA_2d, pB_2d, dAC, dBC, false)

      // 通过多边形顶点环绕方向（右手定则 / 叉积）选择唯一正确的一侧
      const isCandidate1Correct = this.isWindingCorrect(edge.v1, edge.v2, face, pA_2d, pB_2d, pC_candidate1)
      result.set(vid, isCandidate1Correct ? pC_candidate1 : pC_candidate2)
    }

    return result
  }

  /**
   * 两圆交点几何求解
   */
  private findCircleIntersection(
    p0: THREE.Vector2,
    p1: THREE.Vector2,
    r0: number,
    r1: number,
    positiveSide: boolean
  ): THREE.Vector2 {
    const d = p0.distanceTo(p1)
    if (d === 0) return p0.clone()

    // 余弦定理
    const a = (r0 * r0 - r1 * r1 + d * d) / (2 * d)
    const h = Math.sqrt(Math.max(0, r0 * r0 - a * a))

    // 基向量
    const ex = new THREE.Vector2().subVectors(p1, p0).divideScalar(d)
    const ey = new THREE.Vector2(-ex.y, ex.x) // 垂直正向

    const pMid = new THREE.Vector2().addVectors(p0, ex.clone().multiplyScalar(a))
    const offset = ey.clone().multiplyScalar(positiveSide ? h : -h)

    return new THREE.Vector2().addVectors(pMid, offset)
  }

  /**
   * 检验 2D 三角形的环绕方向与 3D 是否一致
   */
  private isWindingCorrect(
    v1: number,
    v2: number,
    face: UnfolderFace3D,
    p1: THREE.Vector2,
    p2: THREE.Vector2,
    p3: THREE.Vector2
  ): boolean {
    const cross2D = (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x)

    // 在 3D 面的顶点环序中检查 v1 -> v2 -> v3 的顺序
    const idx1 = face.vertexIds.indexOf(v1)
    const idx2 = face.vertexIds.indexOf(v2)
    const isConsecutive = (idx2 - idx1 + face.vertexIds.length) % face.vertexIds.length === 1

    return isConsecutive ? cross2D > 0 : cross2D < 0
  }

  /**
   * 创建标准 45° 倒角梯形粘合翼 (Glue Tab)
   */
  private createGlueTab(
    pA: THREE.Vector2,
    pB: THREE.Vector2,
    width: number,
    angleDeg: number,
    label: string,
    edgeId: string
  ): UnfoldedTab2D {
    const edgeVec = new THREE.Vector2().subVectors(pB, pA)
    const edgeLen = edgeVec.length()
    const dir = edgeVec.clone().normalize()
    const normal = new THREE.Vector2(-dir.y, dir.x) // 向外法线

    const angleRad = THREE.MathUtils.degToRad(angleDeg)
    const inset = Math.min(width / Math.tan(angleRad), edgeLen * 0.35)

    const p1 = pA.clone()
    const p2 = pB.clone()
    const p3 = new THREE.Vector2()
      .addVectors(pB, normal.clone().multiplyScalar(width))
      .sub(dir.clone().multiplyScalar(inset))
    const p4 = new THREE.Vector2()
      .addVectors(pA, normal.clone().multiplyScalar(width))
      .add(dir.clone().multiplyScalar(inset))

    return {
      id: `tab_${edgeId}`,
      label,
      p1,
      p2,
      p3,
      p4,
      tabWidth: width,
      targetEdgeId: edgeId
    }
  }

  private getEdgeKey(v1: number, v2: number): string {
    return v1 < v2 ? `${v1}_${v2}` : `${v2}_${v1}`
  }
}
