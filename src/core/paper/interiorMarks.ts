import type { Point2D, Point3D, UnfoldedFace } from '../types'
import type { PaperTriangle, Triple } from './types'
import { cross2, dist2, dot3, mapTrianglePoint, signedArea, sub3 } from './geometry'

/** Clip a segment to a triangle; marks crossing triangulation edges remain continuous. */
export function clipSegment(a:Point2D,b:Point2D,triangle:Triple<Point2D>):[Point2D,Point2D]|null {
  let lo=0,hi=1
  const sign=Math.sign(signedArea(triangle))
  if(!sign)return null
  for(let i=0;i<3;i++) {
    const p=triangle[i],q=triangle[(i+1)%3],da=sign*cross2(p,q,a),db=sign*cross2(p,q,b)
    if(da< -1e-7&&db< -1e-7)return null
    if(da<0&&db>da)lo=Math.max(lo,-da/(db-da))
    if(db<0&&da>db)hi=Math.min(hi,da/(da-db))
  }
  const at=(t:number)=>({x:a.x+t*(b.x-a.x),y:a.y+t*(b.y-a.y)})
  return hi>lo&&dist2(at(lo),at(hi))>1e-5?[at(lo),at(hi)]:null
}

export function projectPhysicalMark(p:Point3D,t:PaperTriangle):Point2D|null {
  const a=sub3(t.vertices[1],t.vertices[0]),b=sub3(t.vertices[2],t.vertices[0]),v=sub3(p,t.vertices[0])
  if(Math.abs(dot3(v,t.normal))>1e-5)return null
  const aa=dot3(a,a),bb=dot3(b,b),ab=dot3(a,b),av=dot3(a,v),bv=dot3(b,v),d=aa*bb-ab*ab
  return {x:(bb*av-ab*bv)/d,y:(aa*bv-ab*av)/d}
}

export function transferMark(a:Point2D,b:Point2D,from:Triple<Point2D>,target:UnfoldedFace,type:'cut'|'mountain'|'valley'|'boundary',allowEdge=false) {
  const clipped=clipSegment(a,b,from)
  if(!clipped)return
  if(!allowEdge&&[0,1,2].some(i=>clipped.every(p=>Math.abs(cross2(from[i],from[(i+1)%3],p))<1e-6)))return
  const [p1,p2]=clipped.map(p=>mapTrianglePoint(p,from,target.polygon2D as Triple<Point2D>))
  if(!target.creases.some(c=>c.type===type&&((dist2(c.p1,p1)<1e-5&&dist2(c.p2,p2)<1e-5)||(dist2(c.p1,p2)<1e-5&&dist2(c.p2,p1)<1e-5))))target.creases.push({type,p1,p2})
}
