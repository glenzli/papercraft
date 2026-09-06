import type { SchemaUnfoldRegion } from '../schema/papercraftSchema'
import type { TriangleInput } from './topology'

/** Assign before topology refinement, so subdivided triangles inherit construction ownership. */
export function assignUnfoldRegions(partId:string,triangles:TriangleInput[],regions:SchemaUnfoldRegion[] = []) {
  const ids=new Set<string>()
  for(const region of regions) {
    if(!region.id||ids.has(region.id))throw new Error(`${partId}: duplicate or empty unfold region ID`)
    ids.add(region.id)
    if(!region.name||!region.faces.length)throw new Error(`${partId}/${region.id}: empty unfold region`)
    for(const selection of region.faces) {
      const faces=triangles.filter(t=>t.sourceFaceId===selection.faceId)
      const selected=selection.triangles===undefined?faces:selection.triangles.map(index=>{
        const triangle=faces.find(t=>t.id===`${partId}/${selection.faceId}/${index}`)
        if(!Number.isInteger(index)||!triangle)throw new Error(`${partId}/${region.id}: unknown unfold triangle`)
        return triangle
      })
      if(!selected.length)throw new Error(`${partId}/${region.id}: empty or unknown unfold face`)
      for(const triangle of selected) {
        if(triangle.unfoldRegion)throw new Error(`${partId}/${triangle.id}: overlapping unfold regions`)
        triangle.unfoldRegion={id:region.id,name:region.name}
      }
    }
  }
}
