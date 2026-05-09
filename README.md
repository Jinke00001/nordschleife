# 纽博格林北环中文科普网站

这是一个 Vite + React 项目，介绍 Nürburgring Nordschleife 的弯角故事、驾驶特点和品牌文化预留内容。

## 推荐打开方式

开发预览：

```bash
npm install
npm run dev
```

然后打开：

```text
http://localhost:5173/
```

## 直接打开文件

不要直接打开项目根目录或根目录下的 `index.html`。如果想用 `file://` 打开，请先构建：

```bash
npm run build
```

然后打开：

```text
dist/index.html
```

项目使用 HashRouter 和相对资源路径，因此构建后的 `dist/index.html` 可以直接从文件系统打开。

## 主要文件

- `src/data/corners.js`：弯角数据，后续补真实资料主要改这里。
- `src/data/brands.js`：品牌故事预留数据。
- `src/assets/nordschleife-map.svg`：真实 Nordschleife 矢量赛道图，来自 Wikimedia Commons，作者 Will Pittenger，Public Domain。
- `src/components/TrackMap.jsx`：地图展台和红色进度路径。前景路径与 dash 动画机制参考 `JJYing/Nurburgring-Map`，该项目为 MIT License。
- `src/pages/HomePage.jsx`：首页。
- `src/pages/CornersPage.jsx`：弯角列表和搜索。
- `src/pages/CornerDetailPage.jsx`：弯角详情页。
- `src/pages/BrandsPage.jsx`：品牌故事预留页。
- `src/styles.css`：整体视觉和响应式样式。
