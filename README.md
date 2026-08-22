# Papercraft Studio

<p align="center">
  <a href="#papercraft-studio---交互式-3d-纸模设计与-2d-展开导出系统">中文</a> &nbsp;|&nbsp; <a href="#papercraft-studio---interactive-3d-papercraft-design--2d-unfold-system">English</a>
</p>

---

<a name="papercraft-studio---交互式-3d-纸模设计与-2d-展开导出系统"></a>
## Papercraft Studio (中文)

**Papercraft Studio** 是一款专注于轨道交通、干线铁路重载货运、巨龙铰接客车与经典公路客运车型的专业级交互式 3D 纸模设计、程序化贴图烘焙与 2D 智能展开排版导出系统。

无需专业 3D 建模技能，即可在浏览器中实时预览 3D 列车编组、自定义涂装车次，并一键生成极致排版的 300 DPI 印刷级 A4 纸模图纸。

![Papercraft Studio 预览图](docs/preview.png)

### 🌟 核心特性

#### 1. 🚄 丰富的世界级车型与编组矩阵 (14+ 款经典车型)
- **高铁与高速动车组**：中国高铁复兴号 CR400 / 和谐号 CRH380、日本新干线 300系 (白银希望号) / E5系 (隼号) / 0系、小田急 70000形 (浪漫特快 GSE)、南海 50000系 (Rapi:t)、JR 281系 (Haruka 关空特急)。
- **干线重载铁路货运**：东风 4B 经典「西瓜皮」/「橘子皮」/「蓝太湖」、JR 货物 EF510「红雷」/ EF210「桃太郎」、北美重载 BNSF、瑞士 SBB Cargo（支持第 2/3 节异色多宝集装箱平车与煤炭敞车组合）。
- **城市公交与经典客车**：18米双节铰接巨龙公交车（上海 71 路 BRT / 北京经典红白大通道 / 欧洲 Metro Express）、经典双层公路客车（伦敦 Routemaster / 香港九巴 KMB 金巴 / 都市观光大巴）、都市低地板双门公交车。
- **经典有轨电车与机车**：镰仓江之电 300形、香港双层叮叮车 (120号经典墨绿与怀旧双拼)、日本国铁 D51形 蒸汽机车。

#### 2. 🧲 纯纸质物理连接与 3D 跨车厢贯通道系统
- **免折叠工字活动牵引挂钩**：剪下即用的对称双头工字插扣，插入底盘暗槽后自动弹开锁止，支持整列自由过弯转向牵引（0 额外耗材）。
- **18米巨龙立折手风琴折棚**：交替山折/谷折立体风挡，真实还原双节客车铰接结构。
- **底盘极简指示标线**：纯净裁切暗槽刻度线与 5mm 磁铁定位圆标。
- **3D 连挂与贯通道**：3D 视口动态生成跨车厢密封外风挡、密接式车钩、重载詹氏车钩与回转转盘。

#### 3. 📐 智能 A4 装箱与「1 节车厢 = 1 张图纸」排版引擎
- **4mm 细粒度全域角落探测**：自动计算 0°/90° 旋转组合，冷气组、导流罩、受电弓与连接挂钩就地紧凑容纳于车身四周空白区。
- **零额外配件页**：全系 4 节编组列车均达成「4 节车 = 4 张 A4 纸」。
- **单行极简页眉**：标题、页码与剪折图例单行对齐，释放最大打印空间，彻底消除文字与零件重叠。

#### 4. 🎨 矢量涂装烘焙与高精度导出
- **程序化贴图烘焙**：40+ 套高精度预设涂装，支持低反差车顶机械纹理、3 轴/2 轴逼真轮对与双层客车全高落地车门。
- **.papercraft 容器格式**：标准化 ZIP 容器打包，支持多涂装、几何定义与材质贴图的无损导入导出与还原。
- **300 DPI PDF 导出**：支持彩色成品图纸与涂色白模一键导出。

---

### 🚀 快速开始

```bash
# 1. 克隆代码仓库
git clone https://github.com/glenzli/papercraft.git
cd papercraft

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 构建生产版本
npm run build
```

---

<a name="papercraft-studio---interactive-3d-papercraft-design--2d-unfold-system"></a>
## Papercraft Studio (English)

**Papercraft Studio** is a professional-grade interactive 3D papercraft design, procedural livery baking, and 2D net layout export system for railway trains, heavy-haul freight trains, articulated bendy buses, and classic double-decker coaches.

Create, customize, and print authentic miniature paper models directly in the browser with real-time 3D viewport rendering and print-ready 300 DPI A4 PDF export.

---

### ✨ Features

#### 1. 🚄 Comprehensive World Vehicle Fleet (14+ Models)
- **High-Speed EMUs**: China Railway Fuxing CR400 / Harmony CRH380, Shinkansen 300 Series (Nozomi) / E5 Series (Hayabusa) / 0 Series, Odakyu 70000 GSE Romancecar, Nankai 50000 Rapi:t, JR 281 Series Haruka.
- **Heavy Haul Freight Consists**: DF4B Diesel Locomotive in Watermelon / Orange / Blue Taohu, JR Freight EF510 Red Thunder / EF210 Momotaro, BNSF Heritage, SBB Cargo (featuring heterogeneous container flatcars and open hoppers).
- **Transit & Highway Buses**: 18m Articulated Dual-Section Bendy Bus (Shanghai Line 71 BRT, Beijing Classic, Metro Express), Classic Double-Decker Coach (London Routemaster, HK KMB Champagne Gold, City Sightseeing), City Low-Floor Bus.
- **Historic Trams & Steam Engines**: Enoshima Electric Railway (Enoden 300), Hong Kong Double-Decker Tram (Ding Ding #120), JNR Class D51 Steam Locomotive.

#### 2. 🧲 Paper Mechanical Drawbars & 3D Inter-Car Gangways
- **Ready-to-Use Double-T Couplers**: Symmetrical flat drawbars that slide and self-lock into chassis slots for train articulation and curve-pulling with 0 extra hardware.
- **Articulated Bellows Gangways**: Multi-crease mountain/valley accordion gangway papercraft for articulated bendy buses.
- **Minimalist Chassis Guidelines**: Clean cut slots with end ticks and 5mm magnetic alignment guides.
- **Dynamic 3D Inter-Car Coupling**: Diaphragm gangways, tight-lock couplers, knuckle couplers, and turntable bellows rendered seamlessly in 3D.

#### 3. 📐 Smart A4 Packing Engine ("1 Car = 1 Page")
- **4mm Stepwise Corner Void Detection**: Rotates accessories (0° / 90°) to snugly nest air conditioners, aero fairings, pantographs, and couplers into peripheral whitespace.
- **0 Extra Spoilage Pages**: Every 4-car consist packs strictly onto 4 A4 pages.
- **Ultra-Compact Single-Line Header**: Merges title, page counter, and folding legends into a single top row to prevent any text overlaps.

#### 4. 🎨 Procedural Livery Baking & Lossless Export
- **Vector Texture Engine**: 40+ iconic liveries with authentic triple/double-axle wheelsets, low-contrast mechanical roof textures, and full-height passenger doors.
- **.papercraft ZIP Container**: Open archive format bundling geometry schemas, procedural themes, and textures for seamless round-trip importing and sharing.
- **Print-Ready 300 DPI PDF**: Generates crisp, high-resolution vector/raster cut sheets ready for cardstock printing.

---

### 💻 Tech Stack

- **Frontend & Core**: React 18, TypeScript, Vite
- **3D Graphics**: Three.js, React Three Fiber
- **Styling & UI**: Tailwind CSS, Lucide Icons
- **PDF & Packing**: jsPDF, html2canvas, JSZip

---

### 📄 License

MIT License © 2026 Papercraft Studio Contributors.
