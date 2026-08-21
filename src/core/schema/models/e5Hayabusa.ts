// 标准 Schema 模型 2: 新干线 E5系隼号 (流线长鼻先头车 - 日本专业纸模标准展开版)
import { PapercraftModelSchema } from '../papercraftSchema'

export const e5HayabusaSchema: PapercraftModelSchema = {
  version: '20260820.1',
  id: 'e5-hayabusa-train',
  name: '新干线 E5系隼号 (流线长鼻先头车)',
  category: 'shinkansen',
  difficulty: 'medium',
  recommendedAge: '7-14 岁',
  estimatedTime: '20-30 分钟',
  description: '15 米气动长鼻锥、流线型驾驶舱穹顶与斜三角侧翼承接面。舌片朝外突出，两侧斜面承接贴合，100% 严谨可折叠成型。',
  dimensions: {
    length: 180,
    width: 36,
    height: 42
  },
  parts: [
    {
      id: 'shinkansen-body',
      name: '新干线先头车主体与气动长鼻展开',
      faces: [
        // 1. 直线客舱车顶 (Roof: 宽36, 长115, Y in [60, 175])
        {
          id: 'roof',
          name: '客舱车顶',
          slotName: 'roof',
          vertices3D: [
            [-18, 42, -90], // 0: 后左
            [18, 42, -90],  // 1: 后右
            [18, 42, 25],   // 2: 前右
            [-18, 42, 25]   // 3: 前左
          ],
          vertices2D: [
            [87, 60],
            [123, 60],
            [123, 175],
            [87, 175]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'mountain', p1: { x: 87, y: 60 }, p2: { x: 123, y: 60 } },
            { type: 'mountain', p1: { x: 123, y: 60 }, p2: { x: 123, y: 175 } },
            { type: 'mountain', p1: { x: 87, y: 175 }, p2: { x: 123, y: 175 } },
            { type: 'mountain', p1: { x: 87, y: 175 }, p2: { x: 87, y: 60 } }
          ]
        },
        // 2. 驾驶舱流线斜面 (Cockpit: 上宽36, 下宽28, 斜长35, Y in [175, 210])
        {
          id: 'cockpit',
          name: '驾驶舱流线前挡风',
          slotName: 'cockpit_front',
          vertices3D: [
            [-18, 42, 25],  // 0: 后左
            [18, 42, 25],   // 1: 后右
            [14, 24, 60],   // 2: 前右
            [-14, 24, 60]   // 3: 前左
          ],
          vertices2D: [
            [87, 175],
            [123, 175],
            [119, 210],
            [91, 210]
          ],
          uvCoords: [[0, 1], [1, 1], [0.9, 0.5], [0.1, 0.5]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'mountain', p1: { x: 91, y: 210 }, p2: { x: 119, y: 210 } },
            { type: 'cut', p1: { x: 87, y: 175 }, p2: { x: 91, y: 210 } },
            { type: 'cut', p1: { x: 123, y: 175 }, p2: { x: 119, y: 210 } }
          ],
          tabs: [
            {
              id: 'tab_cockpit_l',
              label: 'N1',
              edgeIndex: 3,
              p1: { x: 87, y: 175 },
              p2: { x: 91, y: 210 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'side_left'
            },
            {
              id: 'tab_cockpit_r',
              label: 'N2',
              edgeIndex: 1,
              p1: { x: 119, y: 210 },
              p2: { x: 123, y: 175 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'side_right'
            }
          ]
        },
        // 3. 鸭嘴长鼻锥尖端 (Duckbill Nose Cone: 上宽28, 下宽16, 斜长30, Y in [210, 240])
        {
          id: 'duckbill_nose',
          name: '气动鸭嘴长鼻尖 (带双高亮前大灯)',
          slotName: 'nose_front',
          vertices3D: [
            [-14, 24, 60], // 0: 后左
            [14, 24, 60],  // 1: 后右
            [8, 6, 90],    // 2: 前右
            [-8, 6, 90]    // 3: 前左
          ],
          vertices2D: [
            [91, 210],
            [119, 210],
            [113, 240],
            [97, 240]
          ],
          uvCoords: [[0.1, 0.5], [0.9, 0.5], [0.8, 0.0], [0.2, 0.0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'mountain', p1: { x: 97, y: 240 }, p2: { x: 113, y: 240 } },
            { type: 'cut', p1: { x: 91, y: 210 }, p2: { x: 97, y: 240 } },
            { type: 'cut', p1: { x: 119, y: 210 }, p2: { x: 113, y: 240 } }
          ],
          tabs: [
            {
              id: 'tab_nose_l',
              label: 'N3',
              edgeIndex: 3,
              p1: { x: 91, y: 210 },
              p2: { x: 97, y: 240 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'side_left'
            },
            {
              id: 'tab_nose_r',
              label: 'N4',
              edgeIndex: 1,
              p1: { x: 113, y: 240 },
              p2: { x: 119, y: 210 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'side_right'
            }
          ]
        },
        // 4. 前鼻底唇与排障器 (Nose Chin: 宽16, 长10, Y in [240, 250])
        {
          id: 'nose_chin',
          name: '前鼻下唇与排障器',
          slotName: 'nose_chin',
          vertices3D: [
            [-8, 6, 90], // 0: 上左
            [8, 6, 90],  // 1: 上右
            [8, 0, 90],  // 2: 下右
            [-8, 0, 90]  // 3: 下左
          ],
          vertices2D: [
            [97, 240],
            [113, 240],
            [113, 250],
            [97, 250]
          ],
          uvCoords: [[0.2, 0.14], [0.8, 0.14], [0.8, 0.0], [0.2, 0.0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 97, y: 250 }, p2: { x: 113, y: 250 } },
            { type: 'cut', p1: { x: 97, y: 240 }, p2: { x: 97, y: 250 } },
            { type: 'cut', p1: { x: 113, y: 240 }, p2: { x: 113, y: 250 } }
          ],
          tabs: [
            {
              id: 'tab_chin_bot',
              label: 'N5',
              edgeIndex: 2,
              p1: { x: 97, y: 250 },
              p2: { x: 113, y: 250 },
              tabWidth: 6,
              angle: 45,
              targetFaceId: 'bottom'
            }
          ]
        },
        // 5. 左侧流线车身 (6 顶点顺时针周长闭合，客舱平直矩形 + 鼻翼流线过渡，UV 绝对对称)
        {
          id: 'side_left',
          name: '左侧流线车身 (含鼻翼斜面)',
          slotName: 'side_left',
          vertices3D: [
            [-18, 42, -90], // 0: 后上
            [-18, 42, 25],  // 1: 坡顶上
            [-8, 6, 90],    // 2: 鼻翼前上
            [-8, 0, 90],    // 3: 鼻翼前下
            [-18, 0, 25],   // 4: 坡底下
            [-18, 0, -90]   // 5: 后下
          ],
          vertices2D: [
            [87, 60],
            [87, 60 + 115],
            [87 - 36, 60 + 115 + 65],
            [87 - 42, 60 + 115 + 65],
            [87 - 42, 60 + 115],
            [87 - 42, 60]
          ],
          uvCoords: [
            [1.0, 1.0],  // 0: 后上 -> U = 1.0 (车尾门)
            [0.36, 1.0], // 1: 坡顶上 -> U = 0.36
            [0.0, 0.14], // 2: 鼻翼前上 -> U = 0.0 (鼻尖驾驶窗)
            [0.0, 0.0],  // 3: 鼻翼前下 -> U = 0.0
            [0.36, 0.0], // 4: 坡底下 -> U = 0.36
            [1.0, 0.0]   // 5: 后下 -> U = 1.0
          ],
          indices: [
            0, 1, 4, 0, 4, 5, // 客舱标准直立矩形 (窗户 100% 正立不斜)
            1, 2, 3, 1, 3, 4  // 气动长鼻翼斜面
          ],
          creases: [
            { type: 'cut', p1: { x: 87 - 42, y: 60 }, p2: { x: 87, y: 60 } },
            { type: 'cut', p1: { x: 87, y: 60 + 115 }, p2: { x: 87 - 36, y: 60 + 115 + 65 } },
            { type: 'cut', p1: { x: 87 - 36, y: 60 + 115 + 65 }, p2: { x: 87 - 42, y: 60 + 115 + 65 } }
          ],
          tabs: [
            {
              id: 'tab_l_back',
              label: 'B1',
              edgeIndex: 0,
              p1: { x: 87, y: 60 },
              p2: { x: 87 - 42, y: 60 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        // 6. 车底板 (Bottom: 位于左侧身外沿)
        {
          id: 'bottom',
          name: '车底板',
          slotName: 'bottom',
          vertices3D: [
            [-18, 0, 90],
            [18, 0, 90],
            [-18, 0, -90],
            [18, 0, -90]
          ],
          vertices2D: [
            [87 - 42, 60 + 115 + 65],
            [87 - 42 - 36, 60 + 115 + 65],
            [87 - 42 - 36, 60],
            [87 - 42, 60]
          ],
          uvCoords: [[0, 0], [1, 0], [1, 1], [0, 1]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 87 - 42 - 36, y: 60 }, p2: { x: 87 - 42 - 36, y: 60 + 115 + 65 } },
            { type: 'cut', p1: { x: 87 - 42 - 36, y: 60 }, p2: { x: 87 - 42, y: 60 } },
            { type: 'cut', p1: { x: 87 - 42 - 36, y: 60 + 115 + 65 }, p2: { x: 87 - 42, y: 60 + 115 + 65 } }
          ],
          tabs: [
            {
              id: 'tab_bottom_seam',
              label: 'D1',
              edgeIndex: 1,
              p1: { x: 87 - 42 - 36, y: 60 + 115 + 65 },
              p2: { x: 87 - 42 - 36, y: 60 },
              tabWidth: 8,
              angle: 45,
              targetFaceId: 'side_right'
            }
          ]
        },
        // 7. 右侧流线车身 (6 顶点顺时针周长闭合，客舱平直矩形 + 鼻翼流线过渡，UV 绝对对称)
        {
          id: 'side_right',
          name: '右侧流线车身 (含鼻翼斜面)',
          slotName: 'side_right',
          vertices3D: [
            [18, 42, -90], // 0: 后上
            [18, 42, 25],  // 1: 坡顶上
            [8, 6, 90],    // 2: 鼻翼前上
            [8, 0, 90],    // 3: 鼻翼前下
            [18, 0, 25],   // 4: 坡底下
            [18, 0, -90]   // 5: 后下
          ],
          vertices2D: [
            [87 + 36, 60],
            [87 + 36, 60 + 115],
            [87 + 36 + 36, 60 + 115 + 65],
            [87 + 36 + 42, 60 + 115 + 65],
            [87 + 36 + 42, 60 + 115],
            [87 + 36 + 42, 60]
          ],
          uvCoords: [
            [1.0, 1.0],  // 0: 后上 -> U = 1.0 (车尾门)
            [0.36, 1.0], // 1: 坡顶上 -> U = 0.36
            [0.0, 0.14], // 2: 鼻翼前上 -> U = 0.0 (鼻尖驾驶窗)
            [0.0, 0.0],  // 3: 鼻翼前下 -> U = 0.0
            [0.36, 0.0], // 4: 坡底下 -> U = 0.36
            [1.0, 0.0]   // 5: 后下 -> U = 1.0
          ],
          indices: [
            0, 1, 4, 0, 4, 5, // 客舱标准直立矩形 (窗户 100% 正立不斜)
            1, 2, 3, 1, 3, 4  // 气动长鼻翼斜面
          ],
          creases: [
            { type: 'cut', p1: { x: 87 + 36 + 42, y: 60 }, p2: { x: 87 + 36, y: 60 } },
            { type: 'cut', p1: { x: 87 + 36, y: 60 + 115 }, p2: { x: 87 + 36 + 36, y: 60 + 115 + 65 } },
            { type: 'cut', p1: { x: 87 + 36 + 36, y: 60 + 115 + 65 }, p2: { x: 87 + 36 + 42, y: 60 + 115 + 65 } }
          ],
          tabs: [
            {
              id: 'tab_r_back',
              label: 'B2',
              edgeIndex: 0,
              p1: { x: 87 + 36 + 42, y: 60 },
              p2: { x: 87 + 36, y: 60 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'back'
            }
          ]
        },
        // 8. 车尾贯通门 (Back: 宽36, 高42, Y in [18, 60])
        {
          id: 'back',
          name: '车尾贯通门',
          slotName: 'back',
          vertices3D: [
            [-18, 42, -90],
            [18, 42, -90],
            [18, 0, -90],
            [-18, 0, -90]
          ],
          vertices2D: [
            [87, 60],
            [123, 60],
            [123, 18],
            [87, 18]
          ],
          uvCoords: [[0, 1], [1, 1], [1, 0], [0, 0]],
          indices: [0, 1, 2, 0, 2, 3],
          creases: [
            { type: 'cut', p1: { x: 87, y: 18 }, p2: { x: 123, y: 18 } },
            { type: 'cut', p1: { x: 87, y: 18 }, p2: { x: 87, y: 60 } },
            { type: 'cut', p1: { x: 123, y: 18 }, p2: { x: 123, y: 60 } }
          ],
          tabs: [
            {
              id: 'tab_back_bottom',
              label: 'C2',
              edgeIndex: 2,
              p1: { x: 123, y: 18 },
              p2: { x: 87, y: 18 },
              tabWidth: 7,
              angle: 45,
              targetFaceId: 'bottom'
            }
          ]
        }
      ]
    }
  ]
}
