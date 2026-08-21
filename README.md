# Papercraft Studio

一款专注于列车模型的交互式 3D 纸模设计与 2D 展开导出系统。

## 功能特性

- **3D 实时渲染**：基于 Three.js 的实时列车 3D 预览与装配视角。
- **智能展开引擎**：自动化 2D 纸模网格展开，内置自适应法向量防内翻粘贴翼算法。
- **多车型支持**：内置中国高铁（复兴号 / 和谐号）、新干线（E5 / 300系 / 0系）、日本特急（小田急 GSE / 关空特急 Haruka / 南海 Rapi:t）、通勤电车与蒸汽机车。
- **矢量涂装烘焙**：基于 Canvas 2D 的程序化涂装系统，支持配色微调与车头方向幕自定义。
- **高清图纸导出**：支持一键导出标准 A4 / Letter 比例的 PDF 打印图纸与折痕指引。

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
- **3D 渲染**：Three.js, @react-three/fiber
- **样式**：Tailwind CSS, Lucide React
- **导出**：jsPDF, html2canvas
