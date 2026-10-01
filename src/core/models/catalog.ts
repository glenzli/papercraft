/** Presentation and search only: category identifiers remain compatible with saved model packages. */
export function modelCategoryLabel(category:string,isZh:boolean):string {
  const labels:Record<string,[string,string]>={
    commuter:['通勤、货运与电车','Commuter, freight & trams'],shinkansen:['高速与特急列车','High-speed & express'],
    steam:['蒸汽机车','Steam'],bus:['公交与客车','Buses & coaches'],vehicle:['道路车辆','Road vehicles'],
    aircraft:['飞机','Aircraft'],car:['汽车','Cars'],truck:['卡车','Trucks'],freight:['货运列车','Freight'],retro:['复古车辆','Heritage vehicles'],custom:['其他模型','Other models']
  }
  return labels[category]?.[isZh?0:1]||category
}
export function difficultyLabel(difficulty:string,isZh:boolean):string {
  return ({easy:isZh?'入门':'Easy',medium:isZh?'中等':'Intermediate',hard:isZh?'进阶':'Advanced'} as Record<string,string>)[difficulty]||difficulty
}
const normalize=(text:string)=>text.normalize('NFKC').toLocaleLowerCase().replace(/[\p{P}\p{Z}\p{S}]/gu,'')
export function matchesCatalogQuery(query:string,fields:(string|undefined)[]):boolean {
  const haystack=normalize(fields.filter(Boolean).join(' '))
  return query.trim().split(/\s+/).every(word=>haystack.includes(normalize(word)))
}
