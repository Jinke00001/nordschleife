# Workflow

## 本地运行

进入项目目录：

```bash
cd ~/Desktop/纽北赛道
```

启动开发服务器：

```bash
npm run dev
```

打开：

```text
http://127.0.0.1:5173/
```

如果 Safari 显示无法连接服务器，通常是开发服务器没有运行，或者终端不在项目目录。

## 构建检查

每次较大改动后执行：

```bash
npm run build
```

如果构建通过，说明 Vite 能完成生产包构建。

## 部署

项目已连接 Vercel。生产部署命令曾使用：

```bash
HTTP_PROXY=http://127.0.0.1:1082 HTTPS_PROXY=http://127.0.0.1:1082 npx --registry https://registry.npmjs.org vercel --prod --yes
```

部署前建议：

1. 运行 `npm run build`
2. 本地检查几个关键页面
3. 再部署生产版本

## 内容更新规则

### 新增弯角

1. 在 `src/data/corner-records/` 新增文件
2. 在 `src/data/corner-records/index.js` 注册
3. 如有图片，放入 `src/assets/corners/`
4. 运行 `npm run build`

### 新增品牌

1. 在 `src/data/brand-records/` 新增品牌文件
2. 在 `src/data/brand-records/index.js` 注册
3. 品牌 `modelStories` 里的车型如需跳转，必须有 `slug`

### 新增车型详情

1. 在 `src/data/model-records/` 新增车型数据
2. 在 `src/data/model-records/index.js` 注册
3. 品牌记录中的 `modelStories[].slug` 必须与车型详情 `slug` 对应
4. 运行 `npm run build`

## 质量检查清单

改动完成前检查：

- 桌面端标题是否溢出
- 移动端文字是否被压缩或重叠
- 品牌卡片长车型名是否使用 `displayName`
- 车型详情长标题是否不会从英文单词中间断开
- 图片是否过暗、过糊或裁切不合理
- 路由是否能从卡片正常跳转
- `npm run build` 是否通过

