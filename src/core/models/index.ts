// 统一模型注册表与数据管理工厂
import { PapercraftModelData } from '../types'
import { loadPapercraftFromSchema } from '../schema/modelLoader'
import { e235CommuterSchema } from '../schema/models/e235Commuter'
import { e5HayabusaSchema } from '../schema/models/e5Hayabusa'
import { d51SteamSchema } from '../schema/models/d51Steam'

// 基于标准 Schema 解析生成运行时模型
export const MODEL_REGISTRY: PapercraftModelData[] = [
  loadPapercraftFromSchema(e235CommuterSchema),
  loadPapercraftFromSchema(e5HayabusaSchema),
  loadPapercraftFromSchema(d51SteamSchema)
]

export function getModelById(id: string): PapercraftModelData {
  const model = MODEL_REGISTRY.find(m => m.id === id)
  return model || MODEL_REGISTRY[0]
}
