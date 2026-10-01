import type { Point2D, Point3D } from '../types'
import type { Triple } from './types'

// Millimetres, independent of camera/world scaling. Area predicates use mm².
export const LENGTH_EPS = 1e-6
export const AREA_EPS = 1e-7
export const sub3 = (a: Point3D, b: Point3D): Point3D => ({ x: a.x-b.x, y: a.y-b.y, z: a.z-b.z })
export const dot3 = (a: Point3D, b: Point3D) => a.x*b.x+a.y*b.y+a.z*b.z
export const cross3 = (a: Point3D, b: Point3D): Point3D => ({ x:a.y*b.z-a.z*b.y, y:a.z*b.x-a.x*b.z, z:a.x*b.y-a.y*b.x })
export const norm3 = (a: Point3D) => Math.hypot(a.x,a.y,a.z)
export const unit3 = (a: Point3D): Point3D => { const n=norm3(a); return { x:a.x/n, y:a.y/n, z:a.z/n } }
export const dist3 = (a: Point3D, b: Point3D) => norm3(sub3(a,b))
export const dist2 = (a: Point2D, b: Point2D) => Math.hypot(a.x-b.x,a.y-b.y)
export const cross2 = (a: Point2D,b: Point2D,c: Point2D) => (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x)
export const signedArea = (p: Point2D[]) => p.reduce((s,a,i)=> { const b=p[(i+1)%p.length]; return s+a.x*b.y-a.y*b.x },0)/2
export const centroid2 = (p: Point2D[]): Point2D => ({x:p.reduce((s,v)=>s+v.x,0)/p.length,y:p.reduce((s,v)=>s+v.y,0)/p.length})
export const triangleNormal = (v: Triple<Point3D>) => unit3(cross3(sub3(v[1],v[0]),sub3(v[2],v[0])))

export function bounds2(polygons: Point2D[][]) {
  const pts=polygons.flat()
  const minX=pts.length?Math.min(...pts.map(p=>p.x)):0, maxX=pts.length?Math.max(...pts.map(p=>p.x)):0
  const minY=pts.length?Math.min(...pts.map(p=>p.y)):0, maxY=pts.length?Math.max(...pts.map(p=>p.y)):0
  return { minX,minY,maxX,maxY,width:maxX-minX,height:maxY-minY }
}

/** Convex clipping: triangles and glue-tab trapezoids. Shared edges have zero area. */
export function intersectionArea(a: Point2D[], b: Point2D[]): number {
  if(a.length<3 || b.length<3) return 0
  const ba=bounds2([a]),bb=bounds2([b])
  if(ba.maxX<=bb.minX+LENGTH_EPS || bb.maxX<=ba.minX+LENGTH_EPS || ba.maxY<=bb.minY+LENGTH_EPS || bb.maxY<=ba.minY+LENGTH_EPS) return 0
  let out=a.slice()
  const direction=signedArea(b)>=0?1:-1
  for(let i=0;i<b.length && out.length;i++) {
    const p=b[i],q=b[(i+1)%b.length],input=out
    out=[]
    for(let j=0;j<input.length;j++) {
      const s=input[j],e=input[(j+1)%input.length]
      const ds=direction*cross2(p,q,s),de=direction*cross2(p,q,e)
      if(ds>=0) out.push(s)
      if((ds<0 && de>0)||(ds>0 && de<0)) {
        const t=ds/(ds-de)
        out.push({x:s.x+t*(e.x-s.x),y:s.y+t*(e.y-s.y)})
      }
    }
  }
  return Math.abs(signedArea(out))
}

export const overlaps = (a: Point2D[], b: Point2D[]) => intersectionArea(a,b)>AREA_EPS

export function flattenTriangle(v: Triple<Point3D>): Triple<Point2D> {
  const d=dist3(v[0],v[1]),b=dist3(v[0],v[2]),c=dist3(v[1],v[2])
  const x=(b*b+d*d-c*c)/(2*d),y=Math.sqrt(Math.max(0,b*b-x*x))
  // SVG/PDF y points down: negative area puts the oriented surface's printed face up.
  // Its signed dihedral then agrees with the physical mountain/valley convention.
  return [{x:0,y:0},{x:d,y:0},{x,y:-y}]
}

export function isIsometric(v: Triple<Point3D>,p: Triple<Point2D>): boolean {
  return p.every(a=>Number.isFinite(a.x)&&Number.isFinite(a.y)) &&
    Math.abs(signedArea(p))>AREA_EPS && [0,1,2].every(i=>Math.abs(dist3(v[i],v[(i+1)%3])-dist2(p[i],p[(i+1)%3]))<LENGTH_EPS*10)
}

/** Attach a rigid triangle on the opposite side of its parent's shared edge. */
export function attachTriangle(v: Triple<Point3D>,edgeIndex: number,a: Point2D,b: Point2D,parentInterior: Point2D): Triple<Point2D> {
  const j=(edgeIndex+1)%3,k=(edgeIndex+2)%3,d=dist2(a,b)
  const ra=dist3(v[edgeIndex],v[k]),rb=dist3(v[j],v[k])
  const x=(ra*ra-rb*rb+d*d)/(2*d),height=Math.sqrt(Math.max(0,ra*ra-x*x))
  const ux=(b.x-a.x)/d,uy=(b.y-a.y)/d,side=cross2(a,b,parentInterior)>=0?-1:1
  const result=[] as unknown as Triple<Point2D>
  result[edgeIndex]={...a};result[j]={...b}
  result[k]={x:a.x+x*ux-side*height*uy,y:a.y+x*uy+side*height*ux}
  return result
}

/** Map a point between corresponding triangles, also used for authored interior marks. */
export function mapTrianglePoint(point: Point2D,from: Triple<Point2D>,to: Triple<Point2D>): Point2D {
  const d=cross2(from[0],from[1],from[2])
  const w1=cross2(from[0],point,from[2])/d,w2=cross2(from[0],from[1],point)/d
  return {x:to[0].x+w1*(to[1].x-to[0].x)+w2*(to[2].x-to[0].x),y:to[0].y+w1*(to[1].y-to[0].y)+w2*(to[2].y-to[0].y)}
}
