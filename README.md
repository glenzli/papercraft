# Papercraft Studio

一款专注于列车模型的交互式 3D 纸模设计与 2D 展开导出系统。

![Papercraft Studio 预览图](docs/preview.png)

## 功能特性

- **3D 实时预览**：基于 Three.js 的交互式 3D 实景视口，支持整列编组连结与 360° 旋转展示。
- **智能展开排版**：自动化 2D 纸模网格展开，内置自适应法向量防内翻粘贴翼与四角拼缝折翼。
- **多车型支持**：内置中国高铁（复兴号 / 和谐号）、新干线（E5 / 300系 / 0系）、特急列车（小田急 GSE / 关空特急 Haruka / 南海 Rapi:t）、都市通勤电车与蒸汽机车。
- **矢量涂装与贴图**：程序化多层矢量涂装烘焙系统，支持自定义调色、防眩光文字铭牌与手绘贴图模版导入。
- **高保真图纸导出**：一键导出 300 DPI 印刷级 A4 多页 PDF 纸模图纸与标准裁切折痕指引。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 技术栈

- **框架**：React 18, TypeScript, Vite
- **3D 渲染**：Three.js
- **样式**：Tailwind CSS, Lucide React
- **导出**：jsPDF, html2canvas
