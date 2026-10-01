import { jsPDF } from 'jspdf'
import type { ConsistCarItem } from '../core/models/consistManager'
import { packConsistToA4Pages, A4_WIDTH_MM, A4_HEIGHT_MM, type ConsistPageLayout } from '../core/unfoldEngine'
import { AffineTextureProjector } from '../core/unfolder/AffineTextureProjector'
import { getPrintMarks, lineStyle, shortPartTitle } from '../core/paper/printMarks'
import type { TextureBaker } from '../texture/textureBaker'

export interface ExportConsistPdfOptions {
  consistName:string
  cars:ConsistCarItem[]
  baker:TextureBaker
  isBlankTemplate?:boolean
  locale?:'zh-CN'|'en-US'
}

const font = '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'

/** Raster art/captions at 300 DPI. PDF adds the same construction marks as vectors. */
export function renderConsistPageToCanvas(page:ConsistPageLayout,consistName:string,totalPages:number,baker:TextureBaker,isBlankTemplate=false,locale:'zh-CN'|'en-US'='zh-CN',includeMarks=true):HTMLCanvasElement {
  const canvas=document.createElement('canvas')
  canvas.width=2480;canvas.height=3508
  const ctx=canvas.getContext('2d')!,scale=canvas.width/A4_WIDTH_MM,isEn=locale==='en-US'
  ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height)
  ctx.scale(scale,canvas.height/A4_HEIGHT_MM)
  ctx.fillStyle='#0f172a';ctx.font=`bold 2.5px ${font}`
  ctx.fillText(`${consistName} · ${page.car?.carNumberText || page.pageTitle}`,10,8,167)
  ctx.textAlign='right';ctx.fillText(`${page.pageIndex+1} / ${totalPages}`,200,8);ctx.textAlign='left'
  const legend=[['cut',isEn?'Cut':'剪切'],['mountain',isEn?'Mountain':'山折'],['valley',isEn?'Valley':'谷折']] as const
  legend.forEach(([type,label],i)=>{
    const x=10+i*30,style=lineStyle(type)
    ctx.strokeStyle=style.color;ctx.lineWidth=style.width;ctx.setLineDash(style.dash)
    ctx.beginPath();ctx.moveTo(x,12);ctx.lineTo(x+7,12);ctx.stroke()
    ctx.fillStyle=style.color;ctx.font=`2px ${font}`;ctx.fillText(label,x+9,12.7)
  })
  ctx.setLineDash([])
  for(const placement of page.placements) {
    const {part,car}=placement
    ctx.save();ctx.translate(placement.x,placement.y)
    ctx.fillStyle='#475569';ctx.font=`2px ${font}`;ctx.textAlign='center'
    ctx.fillText(shortPartTitle(part,car.carIndex),part.bounds.minX+part.bounds.width/2,part.bounds.minY-1.5,Math.max(12,part.bounds.width))
    for(const face of part.faces) {
      const p=face.polygon2D,source=baker.getSurfaceCanvas(face.textureSlot,car.carType,car.carIndex)
      if(!isBlankTemplate&&source&&p.length===3&&face.uvCoords.length===3) {
        AffineTextureProjector.renderTriangleToCanvas(ctx,source,p[0],p[1],p[2],face.uvCoords[0],face.uvCoords[1],face.uvCoords[2])
      }
      for(const tab of face.glueTabs) {
        const poly=tab.polygon2D!
        ctx.beginPath();ctx.moveTo(poly[0].x,poly[0].y);poly.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));ctx.closePath()
        ctx.fillStyle='#f1f5f9';ctx.fill()
      }
    }
    if(includeMarks) {
      const marks=getPrintMarks(part)
      for(const line of marks.lines) {
        const style=lineStyle(line.type)
        ctx.strokeStyle=style.color;ctx.lineWidth=style.width;ctx.setLineDash(style.dash)
        ctx.beginPath();ctx.moveTo(line.p1.x,line.p1.y);ctx.lineTo(line.p2.x,line.p2.y);ctx.stroke()
      }
      ctx.setLineDash([])
      for(const label of marks.labels) {
        ctx.save();ctx.translate(label.point.x,label.point.y);ctx.rotate(label.angle*Math.PI/180)
        ctx.font=`bold ${label.size}px ${font}`;ctx.textAlign='center';ctx.textBaseline='middle'
        ctx.strokeStyle='white';ctx.lineWidth=.5;ctx.strokeText(label.text,0,0)
        ctx.fillStyle='#334155';ctx.fillText(label.text,0,0);ctx.restore()
      }
    }
    ctx.restore()
  }
  ctx.setLineDash([]);ctx.fillStyle='#64748b';ctx.font=`1.9px ${font}`;ctx.textAlign='left'
  ctx.fillText(isEn?'Match seam numbers within the same car; strips join from inside.':'同一车厢内按编号配对；连接条从内侧粘贴。',10,286)
  ctx.fillText(isEn?'Print at 100% / Actual size. Check the 50 mm ruler.':'打印选择 100% / 实际大小，并核对 50 mm 标尺。',10,290)
  ctx.strokeStyle='#0f172a';ctx.lineWidth=.2
  ctx.beginPath();ctx.moveTo(145,287);ctx.lineTo(195,287);ctx.moveTo(145,285);ctx.lineTo(145,289);ctx.moveTo(195,285);ctx.lineTo(195,289);ctx.stroke()
  ctx.textAlign='center';ctx.fillText('50 mm',170,291)
  return canvas
}

/** Explicit millimetre vector lines, folds and pair numbers, with no tab-base cut line. */
export function drawPageVectors(doc:jsPDF,page:ConsistPageLayout) {
  for(const {part,x,y} of page.placements) {
    const marks=getPrintMarks(part)
    for(const line of marks.lines) {
      const style=lineStyle(line.type)
      doc.setDrawColor(style.color);doc.setLineWidth(style.width);doc.setLineDashPattern(style.dash,0)
      doc.line(x+line.p1.x,y+line.p1.y,x+line.p2.x,y+line.p2.y)
    }
    doc.setLineDashPattern([],0);doc.setFont('helvetica','bold');doc.setTextColor('#334155')
    for(const label of marks.labels) {
      doc.setFontSize(label.size*72/25.4)
      const options={align:'center' as const,baseline:'middle' as const,angle:-label.angle}
      doc.setDrawColor('#ffffff');doc.setLineWidth(.5)
      doc.text(label.text,x+label.point.x,y+label.point.y,{...options,renderingMode:'stroke'})
      doc.text(label.text,x+label.point.x,y+label.point.y,options)
    }
  }
  doc.setLineDashPattern([],0)
}

export async function createConsistPdf(options:ExportConsistPdfOptions):Promise<jsPDF> {
  const {consistName,cars,baker,isBlankTemplate=false,locale='zh-CN'}=options
  const steps=cars[0]?.schema.assemblySteps||[]
  const pages=packConsistToA4Pages(cars),totalPages=pages.length+(steps.length?1:0),doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'})
  for(const [i,page] of pages.entries()) {
    if(i)doc.addPage('a4','portrait')
    const canvas=renderConsistPageToCanvas(page,consistName,totalPages,baker,isBlankTemplate,locale,false)
    doc.addImage(canvas,'PNG',0,0,A4_WIDTH_MM,A4_HEIGHT_MM,undefined,'FAST')
    drawPageVectors(doc,page)
    canvas.width=canvas.height=1
  }
  if(steps.length) {
    doc.addPage('a4','portrait')
    const instructions=renderAssemblySteps(consistName,steps,locale)
    doc.addImage(instructions,'PNG',0,0,A4_WIDTH_MM,A4_HEIGHT_MM,undefined,'FAST')
    instructions.width=instructions.height=1
  }
  return doc
}

export async function exportConsistToPdf(options:ExportConsistPdfOptions):Promise<void> {
  const doc=await createConsistPdf(options),isEn=options.locale==='en-US'
  const suffix=options.isBlankTemplate?(isEn?'Coloring-Template':'填色模版'):(isEn?'Assembly-Sheets':'全套组装图纸')
  doc.save(`${options.consistName}-${suffix}.pdf`)
}

export function exportConsistPageToPng(options:{page:ConsistPageLayout;consistName:string;totalPages:number;baker:TextureBaker;isBlankTemplate?:boolean;locale?:'zh-CN'|'en-US'}):void {
  const {page,consistName,totalPages,baker,isBlankTemplate=false,locale='zh-CN'}=options
  const canvas=renderConsistPageToCanvas(page,consistName,totalPages,baker,isBlankTemplate,locale),link=document.createElement('a')
  link.download=`${consistName}-P${page.pageIndex+1}-${isBlankTemplate?'Coloring':'Assembly'}.png`
  link.href=canvas.toDataURL('image/png');link.click()
}

/** Bilingual assembly instructions are an extra sheet, never laid over construction parts. */
export function renderAssemblySteps(name:string,steps:{text:string;textEn:string}[],locale:'zh-CN'|'en-US'):HTMLCanvasElement {
  const c=document.createElement('canvas');c.width=2480;c.height=3508
  const ctx=c.getContext('2d')!;ctx.fillStyle='white';ctx.fillRect(0,0,c.width,c.height);ctx.scale(c.width/210,c.height/297)
  const en=locale==='en-US';ctx.fillStyle='#0f172a';ctx.font=`bold 5px ${font}`;ctx.fillText(name,12,18,186)
  ctx.font=`bold 3.5px ${font}`;ctx.fillText(en?'Assembly sequence':'装配顺序',12,28)
  ctx.font=`3px ${font}`;let y=40
  for(const [i,step] of steps.entries()) {
    const value=`${i+1}. ${en?step.textEn:step.text}`
    let line=''
    for(const ch of value){if(ctx.measureText(line+ch).width>184){ctx.fillText(line,12,y);y+=5;line=''}line+=ch}
    if(line){ctx.fillText(line,12,y);y+=5}y+=4
  }
  ctx.font=`2.8px ${font}`;ctx.fillStyle='#475569'
  ctx.fillText(en?'Print nets at 100% / Actual size; check their 50 mm ruler.':'展开图按 100% / 实际大小打印，并核对 50 mm 标尺。',12,y+6,186)
  ctx.fillText(en?'Geometry checks do not replace a physical paper assembly trial.':'几何检查不能替代纸张实物试装。',12,y+14,186)
  return c
}
