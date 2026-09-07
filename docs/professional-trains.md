# 精细版列车 / Detailed trains

| 车型 / Model | 几何特征 / Geometry | 默认三节编组 / Default three-car consist |
| --- | --- | --- |
| Haruka 281 | 圆肩车体、抬高驾驶室、后倾前脸、内收下裙 / Faceted shoulders, raised cab, raked face, inset skirt | 23 个部件，3 张 A4 / 23 pieces, 3 A4 sheets |
| 南海 Rapi:t 50000 | 圆拱车体、隆起驾驶室、向前弯出的鼻部 / Arched body, domed cab, bowed nose | 31 个部件（含 4 条连接条），3 张 A4 / 31 pieces including 4 joining strips, 3 A4 sheets |

两款车身长约 18 cm，按纸模制作比例设计，并非精确工程缩尺。Haruka 可选 281 系经典白蓝与 Hello Kitty 樱花涂装；Rapi:t 使用深蓝涂装和接近圆形的轻微椭圆舷窗，前脸中央形成明显凸出的折脊。色彩和文字仍可手动定制。原有基础版模型与涂装继续保留。

Each car body is about 18 cm long. These are paper-friendly interpretations, not certified scale replicas. Haruka offers classic 281 white/blue and Hello Kitty Sakura liveries. Rapi:t uses navy blue, nearly round oval portholes and a pronounced central nose ridge. Colors and text remain customizable. Existing simpler models and their liveries remain available.

## 制作顺序 / Assembly sequence

1. 按实际大小 / 100% 打印，核对图纸底部 50 mm 标尺；先压折痕，再沿实线剪切。Print at Actual size / 100%, check the 50 mm ruler, score the folds, then cut the solid outlines.
2. 先预折驾驶室后顶、左右后侧，再组合顶壳与左右侧片；按同一车厢内相同接缝编号配对。Pre-fold the cab rear panels, then join the roof and side panels by matching seam numbers within the same car.
3. Haruka 的车头前面是一整片，先折出下裙与风挡倾角。Rapi:t 的前脸分为下鼻、风挡与前额；连接条从内侧跨接同号切口。Haruka has one complete face panel. Rapi:t separates the lower nose, windshield and brow; glue the numbered joining strips behind their matching cut edges.
4. 将车头组件接到车体前端，再闭合车体纵向接缝、后壁和底部。留好底部车钩插槽，最后安装车顶空调与纸车钩。Attach the cab to the body before closing the longitudinal seam, rear and floor. Keep the coupler slots clear; add the roof equipment and paper drawbar last.

以上是建议装配次序，尚未完成纸张实物试装。折面近似、纸厚、内侧粘贴空间与接缝强度仍需实物验证。

This is a suggested assembly sequence; no physical paper trial has been completed. Faceted approximations, paper thickness, glue access and joint strength still need practical verification.

## 几何与贴图 / Geometry and artwork

`facetedTrainBody.ts` 按纵向截面生成闭合车体。制作分区只控制哪些邻面可保留折边，不改变 3D 面片或复制装饰表面。肩部与侧墙使用统一的纵向 / 高度 UV，驾驶室侧窗可跨过肩部；正面、车顶冠部和底面各有对应投影。3D、SVG 展开和 PDF 使用同一套面片与涂装画布。

`facetedTrainBody.ts` lofts a closed shell from longitudinal profiles. Construction regions constrain retained fold edges without changing the physical triangles. Side walls and shoulders share a longitudinal/height UV projection, allowing cab windows to continue over the shoulders. Front, crown and floor use their own projections. 3D, SVG nets and PDF use the same triangles and artwork canvases.

自动回归检查覆盖全部内置车型，并对这两款模型检查闭合拓扑、完整分区、无孤立三角片、等距展开、UV、粘合翼碰撞、接缝配对、A4 分页和模型 JSON 往返。浏览器画面和实际导出的 PDF 另行核对。

Automated checks cover all built-in models, with dedicated checks for closed shells, intact panels, no isolated triangles, isometry, UV projection, tab collisions, seam pairing, A4 packing and model JSON round trips. Browser rendering and actual PDF downloads are also inspected.

外形参考 / Silhouette references: [JR 西日本 Haruka](https://www.jr-odekake.net/railroad/train/haruka/), [南海 Rapi:t](https://www.nankai.co.jp/traffic/express/rapit.html). 涂装由程序绘制，未将参考照片作为贴图打包。Artwork is drawn procedurally; reference photographs are not bundled as textures.
