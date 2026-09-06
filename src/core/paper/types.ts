import type { Point2D, Point3D, UnfoldedPart } from '../types'

export type Triple<T> = [T, T, T]

/** A physical triangle. UVs belong to corners, never to welded topology vertices. */
export interface PaperTriangle {
  id: string
  sourceFaceId: string
  name: string
  textureSlot: string
  unfoldRegion?: { id: string; name: string }
  vertexIds: Triple<number>
  vertices: Triple<Point3D>
  uvs: Triple<Point2D>
  normal: Point3D
  /** An authored layout is only a hint, accepted after metric and overlap checks. */
  layoutHint?: Triple<Point2D>
}

export interface PaperEdge {
  id: string
  vertexIds: [number, number]
  faces: { faceIndex: number; edgeIndex: number }[]
  length: number
  foldAngle: number
  preferKeep: boolean
  forceCut: boolean
}

export interface PaperSurface {
  id: string
  name: string
  isAccessory: boolean
  triangles: PaperTriangle[]
  edges: PaperEdge[]
  vertices: Point3D[]
}

export interface PaperDiagnostic {
  code: string
  severity: 'info' | 'warning' | 'error'
  partId: string
  faceId?: string
  message: string
}

export interface PaperSeam {
  id: string
  label: string
  surfaceId: string
  edgeId: string
  length: number
  sides: [
    { partId: string; faceId: string; edgeIndex: number },
    { partId: string; faceId: string; edgeIndex: number }
  ]
  attachment: 'tab' | 'strip'
}

export interface PaperModel {
  surfaces: PaperSurface[]
  parts: UnfoldedPart[]
  seams: PaperSeam[]
  diagnostics: PaperDiagnostic[]
}
