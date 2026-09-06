import type { CreaseType, Point2D, UnfoldedPart } from '../types'
import { centroid2, dist2 } from './geometry'

export interface PrintLine {p1:Point2D;p2:Point2D;type:CreaseType}
export interface PrintLabel {point:Point2D;text:string;angle:number;size:number}
export interface PrintMarks {lines:PrintLine[];labels:PrintLabel[]}
export const lineStyle=(type:CreaseType)=>type==='mountain'?{color:'#dc2626',width:.2,dash:[2,1.5]}:type==='valley'?{color:'#0284c7',width:.2,dash:[3,1,1,1]}:{color:'#0f172a',width:.25,dash:[]}
const readableAngle=(a:Point2D,b:Point2D)=>{let d=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI; if(d>90)d-=180;if(d< -90)d+=180;return d}

/** Shared millimetre geometry for SVG, PNG and vector PDF annotations. */
export function getPrintMarks(part:UnfoldedPart,showCreases=true,showTabs=true):PrintMarks {
  const lines:PrintLine[]=[],labels:PrintLabel[]=[],seen=new Set<string>()
  const addLine=(p1:Point2D,p2:Point2D,type:CreaseType)=>{
    const key=[p1,p2].map(p=>`${p.x.toFixed(5)},${p.y.toFixed(5)}`).sort().join('/')+type
    if(!seen.has(key)){seen.add(key);lines.push({p1,p2,type})}
  }
  for(const face of part.faces) {
    if(showTabs)for(const tab of face.glueTabs) {
      const poly=tab.polygon2D!
      for(let i=0;i<poly.length-1;i++)addLine(poly[i],poly[i+1],'cut')
      labels.push({point:centroid2(poly),text:tab.label,angle:readableAngle(tab.p1,tab.p2),size:1.8})
    }
    if(showCreases)for(const crease of face.creases) {
      addLine(crease.p1,crease.p2,crease.type)
      if(!crease.label)continue
      const a=crease.p1,b=crease.p2,mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2},centre=centroid2(face.polygon2D),length=dist2(a,b)
      let nx=-(b.y-a.y)/length,ny=(b.x-a.x)/length
      if(nx*(centre.x-mid.x)+ny*(centre.y-mid.y)<0){nx=-nx;ny=-ny}
      labels.push({point:{x:mid.x+nx*1.4,y:mid.y+ny*1.4},text:crease.label,angle:readableAngle(a,b),size:1.8})
    }
  }
  return {lines,labels:labels.filter((label,i)=>!labels.slice(0,i).some(other=>other.text===label.text&&dist2(other.point,label.point)<2.5))}
}

export function shortPartTitle(part:UnfoldedPart,carIndex:number):string {
  const name=part.kind==='join-strip'?part.faces[0].name:part.bounds.width<25?(part.name.includes('磁铁')?'磁铁条 / Magnet':part.name.split(/ \/ |[（(]/)[0].slice(0,10)):part.name
  return `${carIndex+1} · ${name}`
}

/** Reserve the centred 2 mm caption in both renderers, including compressed narrow titles. */
export function partCaptionPolygon(part:UnfoldedPart,carIndex:number):Point2D[] {
  const b=part.bounds,width=Math.min(Math.max(12,b.width),shortPartTitle(part,carIndex).length*2)+2
  const centre=b.minX+b.width/2
  return [{x:centre-width/2,y:b.minY-4},{x:centre+width/2,y:b.minY-4},{x:centre+width/2,y:b.minY},{x:centre-width/2,y:b.minY}]
}
