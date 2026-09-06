# Papercraft Studio

[中文](#中文) · [English](#english)

---

<a id="中文"></a>

## 中文

Papercraft Studio 是一个用于列车与车辆纸模型设计、涂装定制与展开图纸导出的浏览器小工具。

用户可以在 3D 视图中查看车辆编组、调整颜色涂装，并将模型展开为带折痕和粘贴边的 2D 打印图纸（A4 PDF）。

![Papercraft Studio 预览图](docs/preview.png)

### 主要功能

- **3D 预览与编组**：在 3D 视图中浏览和旋转车辆，支持增减中间车厢数量，并预览车钩与贯通道连挂效果。
- **预设车型与涂装**：内置高铁（复兴号/和谐号/新干线）、干线货运（东风4B/EF510等）、双节巨龙公交、双层客车与经典有轨电车等车型及基础涂装。
- **涂装与文字定制**：支持调整主色、副色、点缀色和车顶颜色，可按需添加车次与线路铭牌。
- **2D 展开与排版**：3D、展开和贴图共用同一份面片与 UV。复杂表面可拆成多个无重叠纸片，按编号粘合；所有纸片与粘合翼按实际毫米尺寸分页到 A4。
- **图纸导出**：A4 PDF 使用位图贴图和矢量剪折线、接缝编号，附 50 mm 校准标尺。打印时选择“100% / 实际大小”。
- **简易纸质连接件**：提供免额外五金配件的纸质插扣与折棚图纸，用于组装后车厢之间的活动连接。
- **文件导入与导出**：支持以 `.papercraft`（ZIP 格式）导入导出包含模型定义与涂装的车辆包。

### 当前边界

- 模型由平面纸片组成，复杂车头保留折面近似。展开搜索不保证最少切口；纸厚、粘贴顺序和连接强度仍需打印试装。
- 2D 排版目前针对标准 A4 纸张优化，暂未对其他纸张尺寸做自动分页适配。
- 贴图基于 Canvas 2D 程序化绘制，暂不支持任意外部贴图的手动 UV 绘制与烘焙。

### 快速开始

```bash
# 安装依赖
npm install

# 启动本地开发服务
npm run dev

# 几何、接缝、UV 与分页回归检查
npm test

# 构建生产产物
npm run build
```

### 技术栈

- **前端框架**：React 18, TypeScript, Vite
- **3D 渲染**：Three.js
- **样式与图标**：Tailwind CSS, Lucide Icons
- **文件导出**：jsPDF, JSZip

---

<a id="english"></a>

## English

Papercraft Studio is a browser-based tool for previewing, customizing, and exporting 2D printable net layouts for train and vehicle papercraft models.

It allows users to inspect 3D vehicle consists, adjust basic liveries, and generate 2D unfold patterns with folding creases and glue tabs ready for A4 printing.

![Papercraft Studio Preview](docs/preview.png)

### Key Features

- **3D Preview & Consist Assembly**: View and orbit vehicles in 3D, adjust middle car counts, and inspect inter-car couplers and gangways.
- **Built-in Models & Liveries**: Includes high-speed trains, freight locomotives, articulated buses, double-decker coaches, and streetcars with preset liveries.
- **Color & Text Customization**: Customize primary, secondary, accent, and roof colors, with optional custom route and train numbering.
- **2D Net Layout & Packing**: 3D, nets and textures share the same triangles and corner UVs. Complex surfaces can split into non-overlapping pieces with numbered seams; every piece and tab is paginated at its actual millimetre scale.
- **PDF Export**: A4 sheets combine raster artwork with vector construction lines and seam numbers. Print at 100% / Actual size and check the included 50 mm ruler.
- **Paper Couplers**: Simple cut-out paper drawbars and folded bellows for joining assembled cars without extra hardware.
- **File Import & Export**: Import and export `.papercraft` ZIP packages containing model geometries and theme definitions.

### Current Boundaries

- Surfaces use planar paper facets. The search does not guarantee the fewest cuts; paper thickness, assembly order and joint strength still need physical trials.
- Net layout and pagination are currently optimized for standard A4 paper.
- Textures are procedurally generated via 2D Canvas and do not currently support arbitrary external UV texture painting.

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

### Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **3D Graphics**: Three.js
- **Styling & Icons**: Tailwind CSS, Lucide Icons
- **Export & Compression**: jsPDF, JSZip

### License

MIT License.

展开流程、资产约束与验证范围 / Geometry pipeline, asset contracts and validation: [geometry-pipeline.md](docs/geometry-pipeline.md).
