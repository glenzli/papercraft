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
- **2D 展开与排版**：自动将 3D 面片展开为带粘贴边、山折/谷折线的 2D 展开图，并将车身与配件排布在 A4 页面内。
- **图纸导出**：支持导出用于手工裁剪制作的 A4 PDF 图纸（彩色或空白白模）。
- **简易纸质连接件**：提供免额外五金配件的纸质插扣与折棚图纸，用于组装后车厢之间的活动连接。
- **文件导入与导出**：支持以 `.papercraft`（ZIP 格式）导入导出包含模型定义与涂装的车辆包。

### 当前边界

- 模型主要采用适合初学和亲子手工的箱形简化几何，未追求高精度的复杂曲面复原。
- 2D 排版目前针对标准 A4 纸张优化，暂未对其他纸张尺寸做自动分页适配。
- 贴图基于 Canvas 2D 程序化绘制，暂不支持任意外部贴图的手动 UV 绘制与烘焙。

### 快速开始

```bash
# 安装依赖
npm install

# 启动本地开发服务
npm run dev

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
- **2D Net Layout & Packing**: Automatically flattens 3D faces into 2D cut patterns with mountain/valley crease lines, glue tabs, and accessory nesting on A4 sheets.
- **PDF Export**: Export print-ready A4 PDF sheets (full color or blank coloring templates) for physical crafting.
- **Paper Couplers**: Simple cut-out paper drawbars and folded bellows for joining assembled cars without extra hardware.
- **File Import & Export**: Import and export `.papercraft` ZIP packages containing model geometries and theme definitions.

### Current Boundaries

- Geometries are intentionally simplified into box-fold primitives suitable for easy assembly and family crafting, rather than fine-scale curved fidelity.
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
