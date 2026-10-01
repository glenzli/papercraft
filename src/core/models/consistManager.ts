import { ARTICULATED_GAP_MM, withArticulatedJoint } from '../schema/accessories/articulatedJoint'
import { compactCarConsist, pickupConsist } from '../schema/models/transport/roadVehicles'
import { travelPlaneConsist } from '../schema/models/transport/travelPlane'
import { haruka281ProConsist } from '../schema/models/pro/haruka281'
import { rapit50000ProConsist } from '../schema/models/pro/rapit50000'
// 载具与多节车厢编组管理器 (Consist & Vehicle Manager)
import { TrainModelConsist } from '../schema/consistSchema'
import { e235TrainConsist } from '../schema/models/consistE235'
import { nankaiRapitConsist } from '../schema/models/consistRapit'
import { harukaTrainConsist } from '../schema/models/consistHaruka'
import { e5TrainConsist } from '../schema/models/consistE5'
import { cr400TrainConsist } from '../schema/models/consistCR400'
import { shinkansen300TrainConsist } from '../schema/models/consistShinkansen300'
import { romancecarTrainConsist } from '../schema/models/consistRomancecar'
import { romancecarTrainConsistMaster } from '../schema/models/consistRomancecarMaster'
import { cr400TrainConsistMaster } from '../schema/models/consistCR400Master'
import { d51TrainConsist } from '../schema/models/consistD51'
import { consistCityBus } from '../schema/models/consistCityBus'
import { consistArticulatedBus } from '../schema/models/consistArticulatedBus'
import { consistDoubleDeckerBus } from '../schema/models/consistDoubleDeckerBus'
import { consistTram } from '../schema/models/consistTram'
import { consistHKTram } from '../schema/models/consistHKTram'
import { consistDF4BFreight } from '../schema/models/consistDF4BFreight'
import { loadPapercraftFromSchema } from '../schema/modelLoader'
import { couplerDrawbarAccessory } from '../schema/accessories/couplerAccessories'
import { PapercraftModelData } from '../types'

export const CONSIST_REGISTRY: TrainModelConsist[] = [
  cr400TrainConsistMaster,   // ★ 中国高铁 CR400 复兴号 (八面流线车身 + 刀锋破风长鼻 · 旗舰大师版)
  romancecarTrainConsistMaster, // ★ 小田急 70000形 Romancecar GSE (阶梯全景双层展望席 · 大师版)
  haruka281ProConsist,
  rapit50000ProConsist,
  cr400TrainConsist,
  consistDF4BFreight,        // 东风 4B 经典重载货运列车
  consistCityBus,            // 都市低地板公交车
  consistArticulatedBus,     // 18米双节铰接巨龙公交车
  consistDoubleDeckerBus,    // 经典双层公路客车 (伦敦红 / 香港九巴)
  consistTram,               // 镰仓江之电 300形 (江ノ電)
  consistHKTram,             // 香港双层叮叮车
  shinkansen300TrainConsist,
  romancecarTrainConsist,
  e235TrainConsist,
  nankaiRapitConsist,
  harukaTrainConsist,
  e5TrainConsist,
  d51TrainConsist,
  compactCarConsist,
  pickupConsist,
  travelPlaneConsist
]

export interface ConsistCarItem {
  carIndex: number       // 0-based index
  carNumberText: string  // 如 "1号车 (头车)", "车身主体"
  carType: 'head' | 'middle' | 'tail' | 'tender'
  modelData: PapercraftModelData
  schema: import('../schema/papercraftSchema').PapercraftModelSchema
  rotationY?: number    // Explicit orientation, preserving imported tail schemas
  spacingOffsetZ: number // 在 3D 编组连结中的 Z 轴世界位置偏移 (m)
}

/**
 * 根据编组/单车配置构建整车/整列的全部车厢数据 (支持中英双语标签)
 */
export function buildTrainConsistCars(
  consistOrId: TrainModelConsist | string,
  middleCarCount: number = 1,
  locale: 'zh-CN' | 'en-US' = 'zh-CN'
): ConsistCarItem[] {
  const consist: TrainModelConsist = typeof consistOrId === 'object'
    ? consistOrId
    : CONSIST_REGISTRY.find(c => c.id === consistOrId) || CONSIST_REGISTRY[0]
  const requested=Number.isFinite(middleCarCount)?Math.floor(middleCarCount):0
  middleCarCount=Math.max(0,Math.min(consist.assembly?.maxMiddleCars??5,requested))
  const cars: ConsistCarItem[] = []
  const isEn = locale === 'en-US'
  const loadLocalized=(schema:ConsistCarItem['schema'])=>{
    const model=loadPapercraftFromSchema(schema)
    return {...model,name:isEn?(schema.nameEn||schema.name):schema.name}
  }
  const isArticulated = consist.assembly?.type === 'articulated'
  const isSingle = consist.assembly?.type === 'single' || (!consist.carDefinitions.middle && !consist.carDefinitions.tail)

  let currentZ = 0
  const couplerGap = isArticulated ? ARTICULATED_GAP_MM*.01 : 0.08 // Paper joint 24 mm; ordinary display spacing 8 mm

  // 1. 单体车辆 (如单节公交车 / 双层大巴 / 叮叮车)
  if (isSingle) {
    const bodySchema = consist.carDefinitions.head.schema
    const bodyModel = loadLocalized(bodySchema)
    let bodyText = isEn ? 'Vehicle Body (Single)' : '车身主体 (单车制作)'
    if (consist.id === 'hk-tram-consist') {
      bodyText = isEn ? 'HK Double-Decker Tram' : '香港双层叮叮车 (单车制作)'
    } else if (consist.id === 'double-decker-bus-consist') {
      bodyText = isEn ? 'Double-Decker Bus' : '经典双层客车 (单车制作)'
    } else if (consist.id === 'city-bus-consist') {
      bodyText = isEn ? 'City Bus Body' : '城市公交客车 (单车制作)'
    }

    cars.push({
      carIndex: 0,
      carNumberText: bodyText,
      carType: 'head',
      modelData: bodyModel,
      schema: bodySchema,
      spacingOffsetZ: 0
    })
    return cars
  }

  // 2. 多节编组列车/铰接车：头车 (Head Car / Lead Section)
  const headSchema = consist.carDefinitions.head.schema
  const headAccessories = [...(headSchema.accessories || [])]
  if (!isArticulated && !isSingle) {
    headAccessories.push(couplerDrawbarAccessory)
  }
  const headWithJoint=isArticulated?withArticulatedJoint(headSchema):headSchema
  const effectiveHeadSchema: import('../schema/papercraftSchema').PapercraftModelSchema = {
    ...headWithJoint,
    accessories: isArticulated?headWithJoint.accessories:headAccessories
  }
  const headModel = loadLocalized(effectiveHeadSchema)
  const headLen = headModel.dimensions.length * 0.01 // 转换为米/3D单位
  currentZ = headLen / 2

  let headText = isEn ? 'Car 1 (Lead Car)' : '1号车 (先头车)'
  if (isArticulated) {
    headText = isEn ? 'Lead Section (Front)' : '前节主车身 (驾驶室/上客门)'
  } else if (consist.id === 'df4b-freight-consist') {
    headText = isEn ? 'DF4B Locomotive' : '东风4B重载机车 (1号车)'
  } else if (consist.id === 'tram-consist') {
    headText = isEn ? 'Lead Cab (Pantograph)' : '1号车 (先头车·带受电弓)'
  }

  cars.push({
    carIndex: 0,
    carNumberText: headText,
    carType: 'head',
    modelData: headModel,
    schema: effectiveHeadSchema,
    spacingOffsetZ: currentZ
  })

  // 3. 如果是蒸汽火车，紧接煤水车 (Tender Car)
  if (consist.carDefinitions.tender) {
    const tenderSchema = consist.carDefinitions.tender.schema
    const tenderModel = loadLocalized(tenderSchema)
    const tenderLen = tenderModel.dimensions.length * 0.01
    currentZ -= (headLen / 2 + couplerGap + tenderLen / 2)

    cars.push({
      carIndex: cars.length,
      carNumberText: isEn ? `Car ${cars.length + 1} (Tender)` : `${cars.length + 1}号车 (煤水车)`,
      carType: 'tender',
      modelData: tenderModel,
      schema: tenderSchema,
      spacingOffsetZ: currentZ
    })
  }

  // 4. 中间客车/货车 (Middle Cars, 数量 0 ~ 5 节)
  if (consist.carDefinitions.middle) {
    for (let i = 0; i < middleCarCount; i++) {
      const middleSchema = consist.carDefinitions.middle.schema
      const middleModel = loadLocalized(middleSchema)
      const middleLen = middleModel.dimensions.length * 0.01
      const prevLen = cars[cars.length - 1].modelData.dimensions.length * 0.01

      currentZ -= (prevLen / 2 + couplerGap + middleLen / 2)

      let middleText = isEn ? `Car ${cars.length + 1} (Coach)` : `${cars.length + 1}号车 (中间客车)`
      if (consist.id === 'df4b-freight-consist') {
        middleText = isEn ? `Car ${cars.length + 1} (Container Flatcar)` : `${cars.length + 1}号车 (集装箱平车)`
      } else if (consist.id === 'tram-consist') {
        middleText = isEn ? `Car ${cars.length + 1} (Middle Coach)` : `${cars.length + 1}号车 (中间铰接客舱)`
      }

      cars.push({
        carIndex: cars.length,
        carNumberText: middleText,
        carType: 'middle',
        modelData: middleModel,
        schema: middleSchema,
        spacingOffsetZ: currentZ
      })
    }
  }

  // 5. 尾部驾驶车/铰接副车身/散货车 (Tail Car)
  if (consist.carDefinitions.tail) {
    const tailSchema = consist.carDefinitions.tail.schema
    const tailModel = loadLocalized(tailSchema)
    const tailLen = tailModel.dimensions.length * 0.01
    const prevLen = cars[cars.length - 1].modelData.dimensions.length * 0.01

    currentZ -= (prevLen / 2 + couplerGap + tailLen / 2)

    let tailText = isEn ? `Car ${cars.length + 1} (Tail Cab)` : `${cars.length + 1}号车 (尾部驾驶车)`
    if (isArticulated) {
      tailText = isEn ? 'Rear Section (Bellows)' : '后节副车身 (立体铰接折棚)'
    } else if (consist.id === 'df4b-freight-consist') {
      tailText = isEn ? `Car ${cars.length + 1} (Open Hopper Car)` : `${cars.length + 1}号车 (煤炭敞车)`
    } else if (consist.id === 'tram-consist') {
      tailText = isEn ? `Car ${cars.length + 1} (Tail Cab)` : `${cars.length + 1}号车 (尾部驾驶舱)`
    }

    cars.push({
      carIndex: cars.length,
      carNumberText: tailText,
      carType: 'tail',
      rotationY: isArticulated?0:Math.PI,
      modelData: tailModel,
      schema: tailSchema,
      spacingOffsetZ: currentZ
    })
  }

  return cars
}
