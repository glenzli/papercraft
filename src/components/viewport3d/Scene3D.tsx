// 3D 交互视口 (支持 360° 自由旋转、多节连结构建、PBR 车体与精细贴图预览)
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ConsistCarItem } from '../../core/models/consistManager'
import { TextureBaker } from '../../texture/textureBaker'
import { RotateCw, Layers } from 'lucide-react'

interface Scene3DProps {
  cars: ConsistCarItem[]
  focusedCarIndex: number
  onFocusCarChange?: (idx: number) => void
  baker: TextureBaker
  bakeTick?: number
  themeMode?: 'light' | 'dark'
}

export const Scene3D: React.FC<Scene3DProps> = ({
  cars,
  focusedCarIndex,
  baker,
  bakeTick = 0,
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

  const [isWireframe, setIsWireframe] = useState(false)
  const [autoRotate, setAutoRotate] = useState(false)

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

  useEffect(() => {
    if (!sceneRef.current || !trainRootGroupRef.current) return

    const trainRoot = trainRootGroupRef.current
    while (trainRoot.children.length > 0) {
      trainRoot.remove(trainRoot.children[0])
    }

    const scale = 0.01

    cars.forEach(car => {
      const isFocused = focusedCarIndex === -1 || focusedCarIndex === car.carIndex
      if (!isFocused && focusedCarIndex !== -1) return

      const carGroup = new THREE.Group()
      trainRoot.add(carGroup)
      const schema = car.schema
      const baseZ3D = focusedCarIndex === -1 ? car.spacingOffsetZ : 0
      carGroup.position.set(0, 0, baseZ3D)

      const isTail = car.carType === 'tail'

      const createFaceFromSchema = (face: any) => {
        const v3D = face.vertices3D, uvs = face.uvCoords, numVerts = v3D.length
        let indices = face.indices || (numVerts === 4 ? [0, 1, 2, 1, 3, 2] : [0, 1, 2])
        const pos3DArr = new Float32Array(numVerts * 3), uvArr = new Float32Array(numVerts * 2)
        for (let i = 0; i < numVerts; i++) {
          pos3DArr[i * 3] = (isTail ? -v3D[i][0] : v3D[i][0]) * scale
          pos3DArr[i * 3 + 1] = v3D[i][1] * scale
          pos3DArr[i * 3 + 2] = (isTail ? -v3D[i][2] : v3D[i][2]) * scale
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
      }

      schema.parts.forEach(p => p.faces.forEach(createFaceFromSchema))

      if (schema.accessories) {
        schema.accessories.forEach(acc => {
          const numVerts = acc.vertices3D.length
          const pos3DArr = new Float32Array(numVerts * 3)
          const posOff = acc.position3D || [0, 0, 0]
          for (let i = 0; i < numVerts; i++) {
            pos3DArr[i * 3] = (isTail ? -(acc.vertices3D[i][0] + posOff[0]) : (acc.vertices3D[i][0] + posOff[0])) * scale
            pos3DArr[i * 3 + 1] = (acc.vertices3D[i][1] + posOff[1]) * scale
            pos3DArr[i * 3 + 2] = (isTail ? -(acc.vertices3D[i][2] + posOff[2]) : (acc.vertices3D[i][2] + posOff[2])) * scale
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
        })
      }
    })

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
  }, [cars, focusedCarIndex, baker, bakeTick, isWireframe])

  // 自动 360° 旋转展示
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

      {/* 顶部右侧工具胶囊 (360° 旋转与线框拓扑) */}
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
    </div>
  )
}
