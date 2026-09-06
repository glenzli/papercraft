// 2D 展开图与工程排版预览器 (双语支持、无顶栏堆叠、右上方浮动微型工具胶囊、大幅放大与平移)
import React, { useState, useRef, useEffect } from 'react'
import { ConsistCarItem } from '../../core/models/consistManager'
import { TextureBaker } from '../../texture/textureBaker'
import { packConsistToA4Pages, A4_WIDTH_MM, A4_HEIGHT_MM, generateTabPoints, ConsistPageLayout, ConsistPartPlacement } from '../../core/unfoldEngine'
import { ZoomIn, ZoomOut, Maximize2, Scissors, Compass, Move } from 'lucide-react'
import { useI18n } from '../../i18n'

interface NetViewer2DProps {
  cars: ConsistCarItem[]
  currentPageIndex?: number
  onSelectPageIndex?: (idx: number) => void
  currentCarIndex?: number
  onSelectCar?: (idx: number) => void
  baker: TextureBaker
  themeMode?: 'light' | 'dark'
}

export const NetViewer2D: React.FC<NetViewer2DProps> = ({
  cars,
  currentPageIndex: controlledPageIndex,
  onSelectPageIndex,
  currentCarIndex = 0,
  onSelectCar,
  baker,
  themeMode = 'dark'
}) => {
  const { t } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)

  // 缩放与平移状态 (默认大幅放大 2.4x)
  const [scale, setScale] = useState(2.4)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0 })

  const [showTextures, setShowTextures] = useState(true)
  const [showCreases, setShowCreases] = useState(true)
  const [showTabs, setShowTabs] = useState(true)
  const [internalPageIndex, setInternalPageIndex] = useState(0)

  const consistPages: ConsistPageLayout[] = packConsistToA4Pages(cars)

  const currentPageIndex = controlledPageIndex !== undefined ? controlledPageIndex : internalPageIndex
  const setCurrentPageIndex = (valOrFn: number | ((prev: number) => number)) => {
    const nextVal = typeof valOrFn === 'function' ? valOrFn(currentPageIndex) : valOrFn
    setInternalPageIndex(nextVal)
    if (onSelectPageIndex) {
      onSelectPageIndex(nextVal)
    }
  }

  // 当外部切换车厢时，跳转到对应车厢的主体图纸页
  useEffect(() => {
    if (controlledPageIndex === undefined) {
      const targetIdx = consistPages.findIndex((p: ConsistPageLayout) => p.carIndex === currentCarIndex && !p.isAccessoryPage)
      if (targetIdx !== -1) {
        setCurrentPageIndex(targetIdx)
      }
    }
  }, [currentCarIndex, controlledPageIndex])

  // 当页数变动时，确保当前页码在合法范围内
  useEffect(() => {
    if (currentPageIndex >= consistPages.length) {
      setCurrentPageIndex(0)
    }
  }, [consistPages.length, currentPageIndex])

  const activePage = consistPages[currentPageIndex] || consistPages[0]

  const isLight = themeMode === 'light'

  // 自适应视口铺满计算
  const fitToScreen = () => {
    if (!containerRef.current) return
    const containerW = containerRef.current.clientWidth - 48
    const containerH = containerRef.current.clientHeight - 48
    const scaleW = containerW / A4_WIDTH_MM
    const scaleH = containerH / A4_HEIGHT_MM
    const fitScale = Math.max(1.5, Math.min(scaleW, scaleH) * 0.95)
    setScale(fitScale)
    setPanOffset({ x: 0, y: 0 })
  }

  useEffect(() => {
    fitToScreen()
  }, [])

  // 鼠标滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88
    setScale(prev => Math.min(5.0, Math.max(0.8, prev * zoomFactor)))
  }

  // 拖拽平移
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 || e.button === 1) {
      setIsDragging(true)
      dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className={`relative w-full h-full flex flex-col ${isLight ? 'bg-zinc-100 text-zinc-800' : 'bg-zinc-950 text-zinc-200'} overflow-hidden select-none`}>
      {/* 悬浮微型工具胶囊 (右上角，不占用顶部整排空间) */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
        {/* 全编组多页翻页控制器 */}
        {consistPages.length > 1 && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border backdrop-blur-md shadow-md text-xs mr-1 ${
            isLight ? 'bg-white/95 border-zinc-200 text-zinc-800' : 'bg-zinc-900/95 border-zinc-700 text-zinc-200'
          }`}>
            <button
              onClick={() => {
                const nextIdx = Math.max(0, currentPageIndex - 1)
                setCurrentPageIndex(nextIdx)
                if (consistPages[nextIdx]?.carIndex !== undefined && onSelectCar) {
                  onSelectCar(consistPages[nextIdx].carIndex!)
                }
              }}
              disabled={currentPageIndex === 0}
              className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
              title={t('viewer2D.prevPage')}
            >
              ◀
            </button>
            <span className="font-semibold text-[11px] px-1 max-w-[260px] truncate">
              {t('viewer2D.pageTitle', {
                current: currentPageIndex + 1,
                total: consistPages.length,
                title: activePage?.pageTitle || t('viewer2D.sheetTitle')
              })}
            </span>
            <button
              onClick={() => {
                const nextIdx = Math.min(consistPages.length - 1, currentPageIndex + 1)
                setCurrentPageIndex(nextIdx)
                if (consistPages[nextIdx]?.carIndex !== undefined && onSelectCar) {
                  onSelectCar(consistPages[nextIdx].carIndex!)
                }
              }}
              disabled={currentPageIndex === consistPages.length - 1}
              className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
              title={t('viewer2D.nextPage')}
            >
              ▶
            </button>
          </div>
        )}

        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border backdrop-blur-md shadow-md text-xs ${
          isLight ? 'bg-white/90 border-zinc-200 text-zinc-700' : 'bg-zinc-900/90 border-zinc-800 text-zinc-300'
        }`}>
          <button
            onClick={() => setShowTextures(!showTextures)}
            className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
              showTextures
                ? isLight ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-900'
                : 'opacity-50 hover:opacity-100'
            }`}
          >
            {t('viewer2D.toggleTexture')}
          </button>
          <button
            onClick={() => setShowCreases(!showCreases)}
            className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
              showCreases
                ? isLight ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-900'
                : 'opacity-50 hover:opacity-100'
            }`}
          >
            {t('viewer2D.toggleCreases')}
          </button>
          <button
            onClick={() => setShowTabs(!showTabs)}
            className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
              showTabs
                ? isLight ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-900'
                : 'opacity-50 hover:opacity-100'
            }`}
          >
            {t('viewer2D.toggleTabs')}
          </button>

          <div className={`h-3 w-px ${isLight ? 'bg-zinc-200' : 'bg-zinc-800'} mx-0.5`} />

          <button
            onClick={() => setScale(s => Math.min(5.0, s * 1.2))}
            className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800"
            title={t('viewer2D.zoomIn')}
          >
            <ZoomIn className="w-3 h-3" />
          </button>
          <button
            onClick={() => setScale(s => Math.max(0.8, s / 1.2))}
            className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800"
            title={t('viewer2D.zoomOut')}
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <button
            onClick={fitToScreen}
            className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800"
            title={t('viewer2D.fitScreen')}
          >
            <Maximize2 className="w-3 h-3" />
          </button>
          <span className="text-[10px] font-mono opacity-60 w-8 text-right">
            {Math.round((scale / 2.0) * 100)}%
          </span>
        </div>
      </div>

      {/* SVG 画布渲染视口 */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden p-6"
      >
        <div
          style={{
            width: `${A4_WIDTH_MM * scale}px`,
            height: `${A4_HEIGHT_MM * scale}px`,
            minWidth: `${A4_WIDTH_MM * scale}px`,
            minHeight: `${A4_HEIGHT_MM * scale}px`,
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: 'center center'
          }}
          className="relative bg-white shadow-2xl rounded-sm border border-zinc-300 select-none transition-transform duration-75"
        >
          <svg
            viewBox={`0 0 ${A4_WIDTH_MM} ${A4_HEIGHT_MM}`}
            className="w-full h-full"
            style={{ shapeRendering: 'geometricPrecision' }}
          >
            <defs>
              <pattern id="tab-stripe" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="4" stroke="#cbd5e1" strokeWidth="1.2" />
              </pattern>
            </defs>

            {/* 1. 单行紧凑页眉：车厢标题 + 页码 + 剪折图例 (极度节约纵向空间) */}
            <g transform="translate(10, 8)">
              <text x="0" y="3.5" fontSize="3.6" fontWeight="bold" fill="#0f172a">
                {activePage?.pageTitle || t('viewer2D.sheetTitle')}
                <tspan fontSize="2.5" fontWeight="normal" fill="#64748b" dx="4">
                  (P. {currentPageIndex + 1} / {consistPages.length})
                </tspan>
              </text>

              <g transform="translate(115, 2.5)">
                <line x1="0" y1="0" x2="6" y2="0" stroke="#0f172a" strokeWidth="0.4" />
                <text x="7.5" y="1" fontSize="2.2" fill="#334155">{t('viewer2D.legendCut')}</text>

                <line x1="20" y1="0" x2="26" y2="0" stroke="#dc2626" strokeWidth="0.35" strokeDasharray="1.5, 1" />
                <text x="27.5" y="1" fontSize="2.2" fill="#dc2626">{t('viewer2D.legendMountain')}</text>

                <line x1="40" y1="0" x2="46" y2="0" stroke="#0284c7" strokeWidth="0.35" strokeDasharray="2.5, 1, 0.8, 1" />
                <text x="47.5" y="1" fontSize="2.2" fill="#0284c7">{t('viewer2D.legendValley')}</text>
              </g>
            </g>

            {/* 2. 渲染当前页的所有零件 (车身独立或配件专页) */}
            {activePage?.placements.map((placement: ConsistPartPlacement, pIdx: number) => {
              const part = placement.part
              const car = placement.car
              const offsetX = placement.x
              const offsetY = placement.y
              const title = placement.displayName || part.name

              return (
                <g key={`${part.id}_${pIdx}`} transform={`translate(${offsetX}, ${offsetY})`}>
                  {activePage.isAccessoryPage && (
                    <text
                      x={(part.bounds.minX || 0) + part.bounds.width / 2}
                      y={(part.bounds.minY || 0) - 4}
                      textAnchor="middle"
                      fontSize="2.6"
                      fontWeight="bold"
                      fill="#475569"
                    >
                      {title}
                    </text>
                  )}

                  {part.faces.map((face: any) => {
                    const ptsStr = face.polygon2D.map((p: any) => `${p.x},${p.y}`).join(' ')

                    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
                    face.polygon2D.forEach((p: any) => {
                      if (p.x < minX) minX = p.x
                      if (p.y < minY) minY = p.y
                      if (p.x > maxX) maxX = p.x
                      if (p.y > maxY) maxY = p.y
                    })
                    const faceW = maxX - minX
                    const faceH = maxY - minY
                    let imgX = minX
                    let imgY = minY
                    let imgW = faceW
                    let imgH = faceH

                    if (face.uvCoords && face.uvCoords.length > 0) {
                      let minU = Infinity, minV = Infinity, maxU = -Infinity, maxV = -Infinity
                      face.uvCoords.forEach((uv: any) => {
                        const u = uv.x !== undefined ? uv.x : uv[0]
                        const v = uv.y !== undefined ? uv.y : uv[1]
                        if (u < minU) minU = u
                        if (v < minV) minV = v
                        if (u > maxU) maxU = u
                        if (v > maxV) maxV = v
                      })

                      const du = maxU - minU
                      const dv = maxV - minV
                      if (du > 0.02 && dv > 0.02) {
                        const wScale = faceW / du
                        const hScale = faceH / dv
                        imgX = minX - minU * wScale
                        imgY = minY - (1 - maxV) * hScale
                        imgW = wScale
                        imgH = hScale
                      }
                    }

                    const roleSuffix = car.carType === 'middle' ? `middle_${car.carIndex}` : car.carType
                    const slotUrl = baker.getSlotDataURL(`${face.textureSlot}_${roleSuffix}`) || baker.getSlotDataURL(`${face.textureSlot}_${car.carType}`) || baker.getSlotDataURL(face.textureSlot)

                    const isFlippedV = face.id === 'back' || (face.textureSlot === 'back' && face.id.includes('back'))
                    const transformStr = isFlippedV ? `translate(0, ${minY + maxY}) scale(1, -1)` : undefined

                    return (
                      <g key={face.id}>
                        {showTextures && face.textureSlot && slotUrl && (
                          <>
                            <defs>
                              <clipPath id={`clip-${face.id}-${pIdx}`}>
                                <polygon points={ptsStr} />
                              </clipPath>
                            </defs>
                            <g clipPath={`url(#clip-${face.id}-${pIdx})`}>
                              <image
                                href={slotUrl}
                                x={imgX}
                                y={imgY}
                                width={imgW}
                                height={imgH}
                                preserveAspectRatio="none"
                                transform={transformStr}
                              />
                            </g>
                          </>
                        )}

                        <polygon
                          points={ptsStr}
                          fill={showTextures ? 'transparent' : '#f8fafc'}
                          stroke={showTextures ? 'none' : '#cbd5e1'}
                          strokeWidth="0.1"
                        />

                        {showTabs &&
                          face.glueTabs.map((tab: any) => {
                            if (!tab || !tab.p1 || !tab.p2) return null
                            const tabPts = generateTabPoints(tab.p1, tab.p2, tab.tabWidth, tab.angle, placement.part.faces)
                            if (!tabPts || tabPts.length < 4) return null
                            const tabPtsStr = tabPts.map((p: any) => `${p.x},${p.y}`).join(' ')
                            const cx = (tabPts[1].x + tabPts[2].x) / 2
                            const cy = (tabPts[1].y + tabPts[2].y) / 2

                            return (
                              <g key={tab.id}>
                                <polygon points={tabPtsStr} fill="url(#tab-stripe)" stroke="#94a3b8" strokeWidth="0.25" />
                                <text x={cx} y={cy + 1} fontSize="2.4" fontWeight="bold" fill="#475569" textAnchor="middle">
                                  {tab.label}
                                </text>
                              </g>
                            )
                          })}

                        {showCreases &&
                          face.creases.map((crease: any, cIdx: number) => {
                            let strokeColor = '#0f172a'
                            let strokeWidth = '0.35'
                            let strokeDasharray = 'none'

                            if (crease.type === 'mountain') {
                              strokeColor = '#dc2626'
                              strokeWidth = '0.25'
                              strokeDasharray = '2, 1.5'
                            } else if (crease.type === 'valley') {
                              strokeColor = '#0284c7'
                              strokeWidth = '0.25'
                              strokeDasharray = '3, 1, 1, 1'
                            }

                            return (
                              <line
                                key={cIdx}
                                x1={crease.p1.x}
                                y1={crease.p1.y}
                                x2={crease.p2.x}
                                y2={crease.p2.y}
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                                strokeDasharray={strokeDasharray}
                              />
                            )
                          })}

                        {/* 配件安装位指引：极简素雅细虚线框，不遮挡车顶贴图 */}
                        {face.mountingGuides?.map((guide: any) => (
                          <rect
                            key={guide.id}
                            x={guide.x}
                            y={guide.y}
                            width={guide.width}
                            height={guide.height}
                            fill="none"
                            stroke="#94a3b8"
                            strokeWidth="0.25"
                            strokeDasharray="1.5, 1.2"
                          />
                        ))}
                      </g>
                    )
                  })}
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* 底部微型信息条 */}
      <div className={`flex items-center justify-between px-3 py-1.5 border-t ${isLight ? 'bg-white/80 border-zinc-200 text-zinc-500' : 'bg-zinc-900/80 border-zinc-800 text-zinc-400'} text-[11px] shrink-0`}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Scissors className="w-3 h-3 text-emerald-500" />
            {t('viewer2D.statusCutAligned')}
          </span>
          <span className="flex items-center gap-1">
            <Compass className="w-3 h-3 text-blue-500" />
            {t('viewer2D.statusTabsChamfered')}
          </span>
          <span className="flex items-center gap-1 opacity-60">
            <Move className="w-3 h-3" />
            {t('viewer2D.statusNavHint')}
          </span>
        </div>
        <div className="font-mono text-[10px] opacity-70">A4 (210×297mm) · Page {currentCarIndex + 1}/{cars.length}</div>
      </div>
    </div>
  )
}
