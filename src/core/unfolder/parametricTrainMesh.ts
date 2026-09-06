import * as THREE from 'three'
import { ThreeMeshUnfolder } from './ThreeMeshUnfolder'

/**
 * 参数化 3D 列车网格工厂
 */
export class ParametricTrainMeshFactory {
  /**
   * 1. 经典方正客车车身 (Box Car Consist - 中间车 / 经典通勤车)
   * 宽 W, 高 H, 长 L (单位 mm)
   */
  public static createBoxCar(width = 38, height = 44, length = 160): ThreeMeshUnfolder {
    const unfolder = new ThreeMeshUnfolder()
    const hw = width / 2
    const hl = length / 2

    // 8 个立方体顶点
    const v0 = new THREE.Vector3(-hw, height, hl)  // 0: 前上左
    const v1 = new THREE.Vector3(hw, height, hl)   // 1: 前上右
    const v2 = new THREE.Vector3(hw, height, -hl)  // 2: 后上右
    const v3 = new THREE.Vector3(-hw, height, -hl) // 3: 后上左
    const v4 = new THREE.Vector3(-hw, 0, hl)       // 4: 前下左
    const v5 = new THREE.Vector3(hw, 0, hl)        // 5: 前下右
    const v6 = new THREE.Vector3(hw, 0, -hl)       // 6: 后下右
    const v7 = new THREE.Vector3(-hw, 0, -hl)      // 7: 后下左

    const vertices = [v0, v1, v2, v3, v4, v5, v6, v7]
    const uvs = [
      new THREE.Vector2(0, 1), new THREE.Vector2(1, 1), new THREE.Vector2(1, 0), new THREE.Vector2(0, 0),
      new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 0), new THREE.Vector2(0, 0)
    ]

    // 注册顶点
    for (let i = 0; i < vertices.length; i++) {
      unfolder.addVertex(vertices[i], uvs[i])
    }

    // 6 个面 (车顶作为根面 0)
    unfolder.addFace([0, 1, 2, 3], 'roof', '平顶车顶')       // 0: 车顶
    unfolder.addFace([0, 3, 7, 4], 'side_left', '左侧客车身') // 1: 左侧壁
    unfolder.addFace([1, 5, 6, 2], 'side_right', '右侧客车身')// 2: 右侧壁
    unfolder.addFace([0, 4, 5, 1], 'front', '车头前脸')      // 3: 前脸
    unfolder.addFace([2, 6, 7, 3], 'back', '车尾连接壁')     // 4: 车尾
    unfolder.addFace([4, 7, 6, 5], 'bottom', '车身底盘')     // 5: 底盘

    return unfolder
  }

  /**
   * 2. JR 281系 特急 Haruka 先头车 (平顶 + 高位斜面风挡 + 前脸立面)
   */
  public static createHarukaHead(
    width = 38,
    height = 44,
    length = 160,
    slantLen = 18,
    slantDrop = 20
  ): ThreeMeshUnfolder {
    const unfolder = new ThreeMeshUnfolder()
    const hw = width / 2
    const hl = length / 2
    const flatL = hl - slantLen
    const cabH = height - slantDrop

    // 顶点列表
    // 车顶
    const v0 = new THREE.Vector3(-hw, cabH, hl)     // 0: 斜风挡前下左
    const v1 = new THREE.Vector3(hw, cabH, hl)      // 1: 斜风挡前下右
    const v2 = new THREE.Vector3(hw, height, flatL) // 2: 坡顶过渡右
    const v3 = new THREE.Vector3(-hw, height, flatL)// 3: 坡顶过渡左
    const v4 = new THREE.Vector3(-hw, height, -hl)  // 4: 车顶后左
    const v5 = new THREE.Vector3(hw, height, -hl)   // 5: 车顶后右

    // 底盘与立面
    const v6 = new THREE.Vector3(-hw, 0, hl)        // 6: 前下左
    const v7 = new THREE.Vector3(hw, 0, hl)         // 7: 前下右
    const v8 = new THREE.Vector3(hw, 0, -hl)        // 8: 后下右
    const v9 = new THREE.Vector3(-hw, 0, -hl)       // 9: 后下左

    const vertices = [v0, v1, v2, v3, v4, v5, v6, v7, v8, v9]
    const uvs = [
      new THREE.Vector2(0, 1), new THREE.Vector2(1, 1),
      new THREE.Vector2(1, 0.88), new THREE.Vector2(0, 0.88),
      new THREE.Vector2(0, 0), new THREE.Vector2(1, 0),
      new THREE.Vector2(0, 0), new THREE.Vector2(1, 0),
      new THREE.Vector2(1, 0), new THREE.Vector2(0, 0)
    ]

    for (let i = 0; i < vertices.length; i++) {
      unfolder.addVertex(vertices[i], uvs[i])
    }

    // 1. 平顶车顶
    unfolder.addFace([3, 2, 5, 4], 'roof', '平顶车顶')
    // 2. 斜风挡 (驾驶室大风挡)
    unfolder.addFace([0, 1, 2, 3], 'roof', '流线斜风挡')
    // 3. 左侧斜切车身 (五边形)
    unfolder.addFace([0, 3, 4, 9, 6], 'side_left', '左侧客车身')
    // 4. 右侧斜切车身 (五边形)
    unfolder.addFace([1, 7, 8, 5, 2], 'side_right', '右侧客车身')
    // 5. 车头前立面
    unfolder.addFace([0, 6, 7, 1], 'front', '特急前立面')
    // 6. 车尾连接壁
    unfolder.addFace([4, 5, 8, 9], 'back', '车尾连接壁')
    // 7. 车身底盘
    unfolder.addFace([6, 9, 8, 7], 'bottom', '车身底盘')

    return unfolder
  }

  /**
   * 3. 南海电铁 50000系 (铁面人) 先头车与 6 面严格平面流线机甲面罩
   */
  public static createRapitHead(
    width = 38,
    height = 44,
    length = 160,
    prowLen = 16
  ): ThreeMeshUnfolder {
    const unfolder = new ThreeMeshUnfolder()
    const hw = width / 2
    const hl = length / 2
    const midH = height / 2

    // 基础箱体顶点 (0 ~ 7)
    const v0 = new THREE.Vector3(-hw, height, hl)  // 0: 前上左
    const v1 = new THREE.Vector3(hw, height, hl)   // 1: 前上右
    const v2 = new THREE.Vector3(hw, height, -hl)  // 2: 后上右
    const v3 = new THREE.Vector3(-hw, height, -hl) // 3: 后上左
    const v4 = new THREE.Vector3(-hw, 0, hl)       // 4: 前下左
    const v5 = new THREE.Vector3(hw, 0, hl)        // 5: 前下右
    const v6 = new THREE.Vector3(hw, 0, -hl)       // 6: 后下右
    const v7 = new THREE.Vector3(-hw, 0, -hl)      // 7: 后下左

    // 机甲面罩突出尖鼻顶点 (8: 尖端, 9: 左中腮, 10: 右中腮)
    const v8 = new THREE.Vector3(0, midH, hl + prowLen) // 8: 尖鼻锋芒顶点 N_apex
    const v9 = new THREE.Vector3(-hw, midH, hl)         // 9: 左中基座
    const v10 = new THREE.Vector3(hw, midH, hl)         // 10: 右中基座

    const vertices = [v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10]
    const uvs = [
      new THREE.Vector2(0, 1), new THREE.Vector2(1, 1), new THREE.Vector2(1, 0), new THREE.Vector2(0, 0),
      new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 0), new THREE.Vector2(0, 0),
      new THREE.Vector2(0.5, 0.5), new THREE.Vector2(0, 0.5), new THREE.Vector2(1, 0.5)
    ]

    for (let i = 0; i < vertices.length; i++) {
      unfolder.addVertex(vertices[i], uvs[i])
    }

    // 车身基础 5 面
    unfolder.addFace([0, 1, 2, 3], 'roof', '平顶车顶')
    unfolder.addFace([0, 3, 7, 4], 'side_left', '左侧客车身')
    unfolder.addFace([1, 5, 6, 2], 'side_right', '右侧客车身')
    unfolder.addFace([2, 6, 7, 3], 'back', '车尾连接壁')
    unfolder.addFace([4, 7, 6, 5], 'bottom', '车身底盘')

    // 6 面平面等距机甲子弹头面罩
    unfolder.addFace([0, 1, 8], 'front', '中脊上风挡')   // 1. 中脊上穹顶
    unfolder.addFace([8, 5, 4], 'front', '中脊下车鼻')   // 2. 中脊下车鼻
    unfolder.addFace([0, 8, 9], 'front', '左上侧腮')     // 3. 左上侧腮
    unfolder.addFace([9, 8, 4], 'front', '左下侧腮')     // 4. 左下侧腮
    unfolder.addFace([1, 10, 8], 'front', '右上侧腮')    // 5. 右上侧腮
    unfolder.addFace([10, 5, 8], 'front', '右下侧腮')    // 6. 右下侧腮

    return unfolder
  }
}
