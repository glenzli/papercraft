import * as THREE from 'three'
import { buildSurface, type TriangleInput } from '../paper/topology'
import { buildNets } from '../paper/netBuilder'
import type { PaperDiagnostic, Triple } from '../paper/types'
import type { Point2D, Point3D } from '../types'

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

/** BufferGeometry compatibility adapter. All physical unfolding belongs to paper/. */
export class ThreeMeshUnfolder {
  private vertices: UnfolderVertex3D[] = []
  private faces: UnfolderFace3D[] = []
  public diagnostics: PaperDiagnostic[] = []

  public loadFromBufferGeometry(geo: THREE.BufferGeometry, slotName = 'body'): this {
    const position = geo.getAttribute('position'), uv = geo.getAttribute('uv'), index = geo.getIndex()
    if (!position) throw new Error('BufferGeometry requires position data')
    this.vertices = Array.from({length: position.count}, (_, id) => ({
      id, position: new THREE.Vector3(position.getX(id), position.getY(id), position.getZ(id)),
      uv: uv ? new THREE.Vector2(uv.getX(id), uv.getY(id)) : new THREE.Vector2()
    }))
    this.faces = []
    const count = index?.count ?? position.count
    if (count % 3) throw new Error('Triangle data must be a multiple of three')
    for (let i = 0; i < count; i += 3) this.addFace([0,1,2].map(j => index ? index.getX(i+j) : i+j), slotName)
    return this
  }

  public addVertex(position:THREE.Vector3,uv=new THREE.Vector2()):number {
    const id=this.vertices.length
    this.vertices.push({id,position:position.clone(),uv:uv.clone()})
    return id
  }

  public addFace(vertexIds: number[], slotName = 'body', name?: string): UnfolderFace3D {
    if (vertexIds.length < 3 || vertexIds.some(id => !Number.isInteger(id) || !this.vertices[id])) throw new Error('Expected at least three valid vertex indices')
    const vertices = vertexIds.map(id => this.vertices[id].position.clone())
    const face: UnfolderFace3D = {
      id: this.faces.length, name: name || `Face_${this.faces.length}`, slotName, vertexIds,
      vertices, uvs: vertexIds.map(id => this.vertices[id].uv.clone()),
      normal: new THREE.Vector3().crossVectors(vertices[1].clone().sub(vertices[0]), vertices[2].clone().sub(vertices[0])).normalize(),
      center: vertices.reduce((sum, p) => sum.add(p), new THREE.Vector3()).divideScalar(vertices.length)
    }
    this.faces.push(face)
    return face
  }

  public unfold(options: UnfolderOptions = {}): UnfoldedIsland2D[] {
    this.diagnostics = []
    if (!this.faces.length) return []
    const triangles: TriangleInput[] = this.faces.flatMap(face => {
      const normal=face.normal
      const axis=Math.abs(normal.x)>Math.abs(normal.y)?(Math.abs(normal.x)>Math.abs(normal.z)?'x':'z'):(Math.abs(normal.y)>Math.abs(normal.z)?'y':'z')
      const contour=face.vertices.map(p=>new THREE.Vector2(axis==='x'?p.z:p.x,axis==='y'?p.z:p.y))
      const indices=face.vertices.length===3?[[0,1,2]]:THREE.ShapeUtils.triangulateShape(contour,[])
      const bounds=new THREE.Box2().setFromPoints(contour),size=bounds.getSize(new THREE.Vector2())
      return indices.map((ids,i)=>{
        let uvs=ids.map(id=>({x:face.uvs[id].x,y:face.uvs[id].y})) as Triple<Point2D>
        if(Math.abs((uvs[1].x-uvs[0].x)*(uvs[2].y-uvs[0].y)-(uvs[1].y-uvs[0].y)*(uvs[2].x-uvs[0].x))<1e-10)uvs=ids.map(id=>({x:(contour[id].x-bounds.min.x)/(size.x||1),y:(contour[id].y-bounds.min.y)/(size.y||1)})) as Triple<Point2D>
        return {id:`${face.id}/${i}`,sourceFaceId:String(face.id),name:face.name!,textureSlot:face.slotName!,vertices:ids.map(id=>{const p=face.vertices[id];return {x:p.x,y:p.y,z:p.z}}) as Triple<Point3D>,uvs}
      })
    })
    const cutEdges = (options.seamEdges || []).map(key => {
      const ids = key.split('_').map(Number)
      if (ids.length !== 2 || ids.some(i => !this.vertices[i])) throw new Error(`Invalid seam edge: ${key}`)
      return [this.vertices[ids[0]].position, this.vertices[ids[1]].position] as [Point3D,Point3D]
    })
    const surface = buildSurface({id:'mesh',name:'Mesh',isAccessory:false,triangles,cutEdges}, this.diagnostics)
    const {parts} = buildNets(surface, 1, this.diagnostics, {tabWidth: options.tabWidth, tabAngle: options.tabAngle, rootFaceId: options.rootFaceId === undefined ? undefined : `${options.rootFaceId}/0`})
    const vec = (p: Point2D) => new THREE.Vector2(p.x,p.y)
    return parts.map((part, id) => {
      const faces: UnfoldedFace2D[] = part.faces.map(f => {
        const triangle = surface.triangles.find(t => t.id === f.id)
        return {
          face3DId: triangle ? Number(triangle.sourceFaceId) : -1, name:f.name, slotName:f.textureSlot,
          vertices:f.polygon2D.map((p,i)=>({id:i,vertex3DId:triangle?.vertexIds[i] ?? -1,pos:vec(p),uv:vec(f.uvCoords[i] || {x:0,y:0})})),
          creases:f.creases.map(c=>({...c,type:c.type==='boundary'?'cut':c.type,p1:vec(c.p1),p2:vec(c.p2)})),
          tabs:f.glueTabs.map(t=>({id:t.id,label:t.label,p1:vec(t.p1),p2:vec(t.p2),p3:vec(t.polygon2D![2]),p4:vec(t.polygon2D![1]),tabWidth:t.tabWidth,targetEdgeId:t.seamId}))
        }
      })
      const creases = faces.flatMap(f=>f.creases)
      return {id,faces,creases,tabs:faces.flatMap(f=>f.tabs),boundary:creases.filter(c=>c.type==='cut').map(c=>({p1:c.p1,p2:c.p2})),boundingBox:{min:new THREE.Vector2(part.bounds.minX,part.bounds.minY),max:new THREE.Vector2(part.bounds.maxX,part.bounds.maxY),width:part.bounds.width,height:part.bounds.height}}
    })
  }
}
