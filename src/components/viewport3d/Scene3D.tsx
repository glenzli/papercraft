// 3D 交互视口 (支持无缝主题切换不丢模型、展开时铁轨自动平滑避让隐藏、5面微型立体配件完整展开)
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ConsistCarItem } from '../../core/models/consistManager'
import { TextureBaker } from '../../texture/textureBaker'
import { RotateCw, Layers, Sparkles, Play, Pause, Scissors } from 'lucide-react'

interface Scene3DProps {
  cars: ConsistCarItem[]
  focusedCarIndex: number
  onFocusCarChange?: (idx: number) => void
  baker: TextureBaker
  bakeTick?: number
  explodeRatio: number
  onExplodeChange: (val: number) => void
  themeMode?: 'light' | 'dark'
}

interface MorphMeshFace {
  geometry: THREE.BufferGeometry
  pos3D: Float32Array
  pos2D: Float32Array
  explodeOffset: [number, number, number]
}

interface CarMeshGroup {
  carIndex: number
  group: THREE.Group
  baseZ3D: number
  baseZ2D: number
  morphFaces: MorphMeshFace[]
}

export const Scene3D: React.FC<Scene3DProps> = ({
  cars,
  focusedCarIndex,
  baker,
  bakeTick = 0,
  explodeRatio,
  onExplodeChange,
  themeMode = 'dark'
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const trainRootGroupRef = useRef<THREE.Group | null>(null)

  const ambientLightRef = useRef<THREE.AmbientLight | null>(null)
  const mainLightRef = useRef<THREE.DirectionalLight | null>(null)
  const railGroupRef = useRef<THREE.Group | null>(null)
  const gridHelperRef = useRef<THREE.GridHelper | null>(null)

  const carMeshGroupsRef = useRef<CarMeshGroup[]>([])

  const [unfoldRatio, setUnfoldRatio] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isWireframe, setIsWireframe] = useState(false)
  const [autoRotate, setAutoRotate] = useState(false)
  const [activeTab, setActiveTab] = useState<'fold' | 'explode'>('fold')

  const isLight = themeMode === 'light'

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    const bgColor = isLight ? 0xf1f5f9 : 0x090d16
    scene.background = new THREE.Color(bgColor)
    scene.fog = new THREE.FogExp2(bgColor, 0.06)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 60)
    camera.position.set(3.0, 2.2, 3.4)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = isLight ? 1.05 : 1.2
    rendererRef.current = renderer

    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.maxDistance = 20
    controls.minDistance = 0.5
    controls.target.set(0, 0.22, 0)
    controlsRef.current = controls

    const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 1.6 : 1.3)
    scene.add(ambientLight)
    ambientLightRef.current = ambientLight

    const mainLight = new THREE.DirectionalLight(0xffffff, isLight ? 1.8 : 2.2)
    mainLight.position.set(6, 10, 6)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.width = 1024
    mainLight.shadow.mapSize.height = 1024
    scene.add(mainLight)
    mainLightRef.current = mainLight

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.8)
    fillLight.position.set(-6, 5, -6)
    scene.add(fillLight)

    const gridColor1 = isLight ? 0xcfd8dc : 0x334155
    const gridColor2 = isLight ? 0xe2e8f0 : 0x1e293b
    const grid = new THREE.GridHelper(24, 48, gridColor1, gridColor2)
    grid.position.y = -0.005
    scene.add(grid)
    gridHelperRef.current = grid

    const railGroup = new THREE.Group()
    scene.add(railGroup)
    railGroupRef.current = railGroup

    const railMat = new THREE.MeshStandardMaterial({ color: isLight ? 0x94a3b8 : 0x475569, roughness: 0.3 })
    const railGeo = new THREE.BoxGeometry(0.03, 0.02, 24)
    const railLeft = new THREE.Mesh(railGeo, railMat)
    railLeft.position.set(-0.16, 0.01, 0)
    railGroup.add(railLeft)

    const railRight = new THREE.Mesh(railGeo, railMat)
    railRight.position.set(0.16, 0.01, 0)
    railGroup.add(railRight)

    const trainRootGroup = new THREE.Group()
    scene.add(trainRootGroup)
    trainRootGroupRef.current = trainRootGroup

    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      const h = containerRef.current.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      container.innerHTML = ''
    }
  }, [])

  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current) return

    const bgColor = isLight ? 0xf1f5f9 : 0x090d16
    sceneRef.current.background = new THREE.Color(bgColor)
    sceneRef.current.fog = new THREE.FogExp2(bgColor, 0.06)

    rendererRef.current.toneMappingExposure = isLight ? 1.05 : 1.2

    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = isLight ? 1.6 : 1.3
    }
    if (mainLightRef.current) {
      mainLightRef.current.intensity = isLight ? 1.8 : 2.2
    }
  }, [isLight])

  const updateMorphAndExplode = (tFold: number, eExplode: number) => {
    if (railGroupRef.current) {
      if (tFold > 0.05) {
        railGroupRef.current.position.y = -tFold * 0.3
        railGroupRef.current.visible = tFold < 0.6
      } else {
        railGroupRef.current.position.y = 0
        railGroupRef.current.visible = true
      }
    }

    if (gridHelperRef.current) {
      gridHelperRef.current.position.y = -0.005 - tFold * 0.05
    }

    carMeshGroupsRef.current.forEach(({ group, baseZ3D, baseZ2D, morphFaces }) => {
      const currentZ = baseZ3D + (baseZ2D - baseZ3D) * tFold
      group.position.set(0, 0, currentZ)

      morphFaces.forEach(({ geometry, pos3D, pos2D, explodeOffset }) => {
        const posAttr = geometry.attributes.position as THREE.BufferAttribute
        const arr = posAttr.array as Float32Array

        for (let i = 0; i < pos3D.length; i += 3) {
          if (activeTab === 'explode') {
            arr[i] = pos3D[i] + explodeOffset[0] * eExplode
            arr[i + 1] = pos3D[i + 1] + explodeOffset[1] * eExplode
            arr[i + 2] = pos3D[i + 2] + explodeOffset[2] * eExplode
          } else {
            const x3 = pos3D[i], y3 = pos3D[i + 1], z3 = pos3D[i + 2]
            const x2 = pos2D[i], y2 = pos2D[i + 1], z2 = pos2D[i + 2]
            arr[i] = x3 + (x2 - x3) * tFold
            arr[i + 1] = y3 + (y2 - y3) * tFold
            arr[i + 2] = z3 + (z2 - z3) * tFold
          }
        }
        posAttr.needsUpdate = true
        geometry.computeVertexNormals()
      })
    })
  }

  useEffect(() => {
    if (!sceneRef.current || !trainRootGroupRef.current) return

    const trainRoot = trainRootGroupRef.current
    while (trainRoot.children.length > 0) {
      trainRoot.remove(trainRoot.children[0])
    }
    carMeshGroupsRef.current = []

    let cumulativeZ2D = 0
    const scale = 0.01
    const y2DFlat = 0.006

    const getExplodeOffset = (slot: string, isTail: boolean, isAcc: boolean = false): [number, number, number] => {
      if (isAcc) {
        if (slot === 'front') return isTail ? [0, 0.1, -0.85] : [0, 0.1, 0.85]
        if (slot === 'roof') return [0, 0.85, 0]
        return [0, 0.5, 0]
      }
      switch (slot) {
        case 'roof': return [0, 0.55, 0]
        case 'side_left': return [-0.45, 0, 0]
        case 'side_right': return [0.45, 0, 0]
        case 'front': return isTail ? [0, 0, -0.5] : [0, 0, 0.5]
        case 'back': return isTail ? [0, 0, 0.5] : [0, 0, -0.5]
        case 'bottom': return [0, -0.35, 0]
        default: return [0, 0.3, 0]
      }
    }

    cars.forEach(car => {
      const isFocused = focusedCarIndex === -1 || focusedCarIndex === car.carIndex
      if (!isFocused && focusedCarIndex !== -1) return

      const carGroup = new THREE.Group()
      trainRoot.add(carGroup)
      const morphFaces: MorphMeshFace[] = []
      const schema = car.schema
      const L = schema.dimensions.length * scale
      const H = schema.dimensions.height * scale
      const unfoldedLength = L + H * 2 + 0.12
      const baseZ3D = focusedCarIndex === -1 ? car.spacingOffsetZ : 0
      const baseZ2D = focusedCarIndex === -1 ? cumulativeZ2D : 0
      cumulativeZ2D -= unfoldedLength

      let minX2D = Infinity, maxX2D = -Infinity, minY2D = Infinity, maxY2D = -Infinity
      schema.parts.forEach(p => { p.faces.forEach(f => { f.vertices2D.forEach(v => { minX2D = Math.min(minX2D, v[0]); maxX2D = Math.max(maxX2D, v[0]); minY2D = Math.min(minY2D, v[1]); maxY2D = Math.max(maxY2D, v[1]) }) }) })
      const centerX2D = (minX2D + maxX2D) / 2
      const centerY2D = (minY2D + maxY2D) / 2
      const isTail = car.carType === 'tail'

      const createFaceFromSchema = (face: any) => {
        const v3D = face.vertices3D, v2D = face.vertices2D, uvs = face.uvCoords, numVerts = v3D.length
        let indices = face.indices || (numVerts === 4 ? [0, 1, 2, 1, 3, 2] : [0, 1, 2])
        const pos3DArr = new Float32Array(numVerts * 3), pos2DArr = new Float32Array(numVerts * 3), uvArr = new Float32Array(numVerts * 2)
        for (let i = 0; i < numVerts; i++) {
          pos3DArr[i * 3] = (isTail ? -v3D[i][0] : v3D[i][0]) * scale
          pos3DArr[i * 3 + 1] = v3D[i][1] * scale
          pos3DArr[i * 3 + 2] = (isTail ? -v3D[i][2] : v3D[i][2]) * scale
          pos2DArr[i * 3] = (v2D[i][0] - centerX2D) * scale
          pos2DArr[i * 3 + 1] = y2DFlat
          pos2DArr[i * 3 + 2] = (v2D[i][1] - centerY2D) * scale
          if (uvs && uvs[i]) { uvArr[i * 2] = uvs[i][0]; uvArr[i * 2 + 1] = uvs[i][1] }
        }
        const geo = new THREE.BufferGeometry()
        geo.setIndex(indices)
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos3DArr, 3))
        geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvArr, 2))
        geo.computeVertexNormals()
        const slot3DName = `${face.slotName}_${car.carType}_3d`
        const canvas = baker.getSlotCanvas(slot3DName) || baker.getSlotCanvas(`${face.slotName}_3d`) || baker.getSlotCanvas(face.slotName)
        const tex = canvas ? new THREE.CanvasTexture(canvas) : baker.getTexture()
        tex.colorSpace = THREE.SRGBColorSpace
        const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: 0.45, metalness: 0.1, wireframe: isWireframe }))
        mesh.castShadow = true
        mesh.receiveShadow = true
        carGroup.add(mesh)
        morphFaces.push({ geometry: geo, pos3D: pos3DArr, pos2D: pos2DArr, explodeOffset: getExplodeOffset(face.slotName, isTail) })
      }

      schema.parts.forEach(p => p.faces.forEach(createFaceFromSchema))
      if (schema.accessories) {
        schema.accessories.forEach(acc => {
          const numVerts = acc.vertices3D.length
          const pos3DArr = new Float32Array(numVerts * 3), pos2DArr = new Float32Array(numVerts * 3)
          const posOff = acc.position3D || [0, 0, 0]
          for (let i = 0; i < numVerts; i++) {
            pos3DArr[i * 3] = (isTail ? -(acc.vertices3D[i][0] + posOff[0]) : (acc.vertices3D[i][0] + posOff[0])) * scale
            pos3DArr[i * 3 + 1] = (acc.vertices3D[i][1] + posOff[1]) * scale
            pos3DArr[i * 3 + 2] = (isTail ? -(acc.vertices3D[i][2] + posOff[2]) : (acc.vertices3D[i][2] + posOff[2])) * scale
            const layX = acc.layout2D?.x ?? 160
            const layY = acc.layout2D?.y ?? 20
            pos2DArr[i * 3] = (layX - centerX2D + acc.vertices3D[i][0]) * scale
            pos2DArr[i * 3 + 1] = y2DFlat
            pos2DArr[i * 3 + 2] = (layY - centerY2D + acc.vertices3D[i][2]) * scale
          }

          const geo = new THREE.BufferGeometry()
          geo.setIndex(acc.indices)
          geo.setAttribute('position', new THREE.Float32BufferAttribute(pos3DArr, 3))
          if (acc.uvCoords) {
            const uvArr = new Float32Array(numVerts * 2)
            for (let i = 0; i < numVerts; i++) {
              if (acc.uvCoords[i]) {
                uvArr[i * 2] = acc.uvCoords[i][0]
                uvArr[i * 2 + 1] = acc.uvCoords[i][1]
              }
            }
            geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvArr, 2))
          }
          geo.computeVertexNormals()

          const slot3DName = `${acc.slotName}_${car.carType}_3d`
          const canvas = baker.getSlotCanvas(slot3DName) || baker.getSlotCanvas(`${acc.slotName}_3d`) || baker.getSlotCanvas(acc.slotName)
          const tex = canvas ? new THREE.CanvasTexture(canvas) : baker.getTexture()
          tex.colorSpace = THREE.SRGBColorSpace
          const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: 0.45, metalness: 0.1, wireframe: isWireframe }))
          mesh.castShadow = true
          mesh.receiveShadow = true
          carGroup.add(mesh)

          morphFaces.push({ geometry: geo, pos3D: pos3DArr, pos2D: pos2DArr, explodeOffset: getExplodeOffset(acc.slotName, isTail, true) })
        })
      }

      carMeshGroupsRef.current.push({
        carIndex: car.carIndex,
        group: carGroup,
        baseZ3D,
        baseZ2D,
        morphFaces
      })

      cumulativeZ2D -= (unfoldedLength + 0.1)
    })

    updateMorphAndExplode(activeTab === 'fold' ? unfoldRatio : 0, activeTab === 'explode' ? explodeRatio : 0)

    if (cameraRef.current && controlsRef.current) {
      if (focusedCarIndex === -1) {
        const totalCars = cars.length
        cameraRef.current.position.set(3.0 + totalCars * 0.4, 2.2 + totalCars * 0.2, 3.2 + totalCars * 0.4)
        controlsRef.current.target.set(0, 0.22, -0.4 * (totalCars - 1))
      } else {
        cameraRef.current.position.set(2.4, 1.8, 2.6)
        controlsRef.current.target.set(0, 0.22, 0)
      }
      controlsRef.current.update()
    }
  }, [cars, focusedCarIndex, baker, bakeTick, isWireframe, activeTab])

  // 5. 自动播放
  useEffect(() => {
    if (!isPlaying) return

    let dir = 1
    const interval = setInterval(() => {
      setUnfoldRatio(prev => {
        let next = prev + 0.025 * dir
        if (next >= 1) {
          next = 1
          dir = -1
        } else if (next <= 0) {
          next = 0
          dir = 1
        }
        return next
      })
    }, 35)

    return () => clearInterval(interval)
  }, [isPlaying])

  // 6. 自动旋转
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate
      controlsRef.current.autoRotateSpeed = 1.6
    }
  }, [autoRotate])

  return (
    <div className={`relative w-full h-full flex flex-col ${isLight ? 'bg-slate-100' : 'bg-zinc-950'} overflow-hidden select-none`}>
      {/* 3D 渲染 Canvas 容器 */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 顶部右侧工具按钮 */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-1.5 rounded-lg border backdrop-blur-md transition-all ${
            autoRotate
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
              : isLight
                ? 'bg-white/90 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
          }`}
          title="自动 360° 旋转展示"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={() => setIsWireframe(!isWireframe)}
          className={`p-1.5 rounded-lg border backdrop-blur-md transition-all ${
            isWireframe
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
              : isLight
                ? 'bg-white/90 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
          }`}
          title="折痕与多边形拓扑线框"
        >
          <Layers className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 底部折叠/展开控制中心 */}
      <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 ${isLight ? 'bg-white/95 border-zinc-200 shadow-lg text-zinc-800' : 'bg-zinc-900/95 border-zinc-800 shadow-2xl text-zinc-200'} backdrop-blur-md px-4 py-2 rounded-xl border z-10 min-w-[420px]`}>
        <div className={`flex items-center ${isLight ? 'bg-zinc-100' : 'bg-zinc-950'} p-0.5 rounded-lg text-xs w-full`}>
          <button
            onClick={() => {
              setActiveTab('fold')
              onExplodeChange(0)
            }}
            className={`flex-1 py-1 rounded-md font-medium flex items-center justify-center gap-1.5 transition-all text-xs ${
              activeTab === 'fold'
                ? isLight
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'bg-zinc-800 text-white shadow-sm'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <Scissors className="w-3 h-3" />
            3D 纸模折叠 / 展平模拟
          </button>
          <button
            onClick={() => {
              setActiveTab('explode')
              setUnfoldRatio(0)
              setIsPlaying(false)
            }}
            className={`flex-1 py-1 rounded-md font-medium flex items-center justify-center gap-1.5 transition-all text-xs ${
              activeTab === 'explode'
                ? isLight
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'bg-zinc-800 text-white shadow-sm'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            零件拆解 (爆炸图)
          </button>
        </div>

        {activeTab === 'fold' ? (
          <div className="flex items-center justify-between w-full gap-3 pt-0.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium text-xs transition-all ${
                isPlaying
                  ? 'bg-amber-600 text-white'
                  : isLight
                    ? 'bg-zinc-900 hover:bg-zinc-800 text-white'
                    : 'bg-zinc-100 hover:bg-white text-zinc-900'
              }`}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isPlaying ? '暂停' : '折叠演示'}
            </button>

            <div className="flex-1 flex items-center gap-2">
              <span className="text-[10px] opacity-60 whitespace-nowrap">3D 拼合</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={unfoldRatio}
                onChange={e => {
                  setUnfoldRatio(parseFloat(e.target.value))
                  setIsPlaying(false)
                }}
                className="w-full h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
              />
              <span className="text-[10px] opacity-60 whitespace-nowrap">2D 展平纸张</span>
            </div>

            <span className="text-xs font-mono font-bold w-10 text-right">
              {Math.round(unfoldRatio * 100)}%
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full gap-3 pt-0.5">
            <span className="text-xs font-medium opacity-70 whitespace-nowrap">拆解距离:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explodeRatio}
              onChange={e => onExplodeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
            />
            <span className="text-xs font-mono font-bold w-10 text-right">
              {Math.round(explodeRatio * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
