# Content Guide

这个项目的内容数据已经拆成“独立记录 + 聚合入口”的结构。日后补真实资料时，优先改数据文件，不需要先改页面组件。

## 弯角内容

单个弯角文件放在：

```text
src/data/corner-records/
```

例如：

```text
src/data/corner-records/flugplatz.js
src/data/corner-records/karussell.js
```

新增或调整弯角时，主要维护这些字段：

```js
export default {
  order: 3,
  slug: 'flugplatz',
  name: 'Flugplatz',
  chineseName: '飞行场',
  explanation: '一句话解释这个弯角。',
  section: '所在赛段',
  location: '更具体的位置描述',
  origin: '名字来源',
  history: '历史背景',
  story: '偏故事化的叙述',
  driving: '驾驶特点',
  fame: '为什么有名',
  tags: ['高速', '跳跃'],
  dangerLevel: '预留：高',
  difficulty: '预留：★★★★☆'
};
```

新增弯角文件后，需要到这里注册顺序：

```text
src/data/corner-records/index.js
```

`src/data/corners.js` 是聚合入口，负责自动补充：

- `media`
- `resources`
- 首页精选弯角
- 新手阅读路线
- 查询函数

## 品牌内容

单个品牌文件放在：

```text
src/data/brand-records/
```

例如：

```text
src/data/brand-records/porsche.js
src/data/brand-records/mercedes-amg.js
```

品牌记录主要维护这些字段：

```js
export default {
  name: 'Porsche',
  slug: 'porsche',
  status: 'Endurance DNA',
  heroModel: '911 GT3 RS / 919 Hybrid Evo',
  focus: '品牌和纽北之间的核心介绍。',
  story: '品牌列表页使用的故事描述。',
  keywords: ['耐力赛', '下压力'],
  exhibit: '品牌详情页展柜文案。',
  relationship: '品牌与纽北的关系。',
  technology: '技术关键词展开。',
  lapStory: '圈速故事预留说明。',
  modelStories: [
    {
      model: '911 GT3 RS',
      type: '量产 GT',
      hook: '一句车型钩子。',
      story: '车型故事。',
      tags: ['下压力', '轻量化']
    }
  ]
};
```

新增品牌文件后，需要到这里注册顺序：

```text
src/data/brand-records/index.js
```

`src/data/brands.js` 是聚合入口，负责自动补充品牌资料接入位和查询函数。

## 品牌详情模板

Porsche 现在是品牌详情页的样板。后续扩展 Mercedes-AMG、BMW、Audi 等品牌时，先不要急着填满所有车型，而是先把品牌展区的“阅读路线”搭好。

### 品牌页结构

一个成熟品牌页应包含四层信息：

1. `focus`：品牌名下方的核心定位，一句话说明它为什么值得进入纽北展区。
2. `detailBlocks`：品牌与纽北的关系、技术性格、历史线索，避免只写“很快”。
3. `modelStories`：四台代表车型，每台承担一个明确角色。
4. `archiveNote`：右侧品牌档案里的阅读顺序，帮助新手知道先看什么、再看什么。

推荐写法：

```js
export default {
  name: 'Mercedes-AMG',
  slug: 'mercedes-amg',
  status: 'Black Series',
  heroModel: 'AMG GT Black Series / AMG ONE / AMG GT3 / AMG GT R',
  focus: '一句有品牌气质的总述，不只说快，要说它如何把速度变成一种性格。',
  archiveNote: '先看 A，再看 B，最后回到 C。这里要说明阅读顺序，而不是堆车型名。',
  detailBlocks: [
    {
      title: '品牌与纽北的关系',
      content: '讲品牌为什么需要北环，而不是只列成绩。'
    },
    {
      title: '赛车经验如何回到公路',
      content: '讲技术如何从赛事、测试或旗舰车进入更广泛的品牌叙事。'
    },
    {
      title: '技术性格',
      content: '讲这个品牌最稳定的工程语言：空气动力、动力系统、底盘、制动或耐力赛经验。'
    },
    {
      title: '北环叙事线索',
      content: '把四台代表车型串成一条可阅读的展线。'
    }
  ],
  modelStories: [
    {
      model: 'AMG GT Black Series',
      slug: 'amg-gt-black-series',
      type: '量产极限',
      hook: '一句清晰钩子，说明这台车在展线里负责什么。',
      story: '两到三句，不重复 detailBlocks。它要解释为什么这台车值得点进详情页。',
      tags: ['V8', '空气动力', '量产纪录']
    }
  ]
};
```

### 四台车型如何分工

每个品牌优先选择四台车。四台车之间要有分工，不要只是四台“很快的车”。

推荐角色组合：

- 历史锚点：帮助用户理解品牌传统从哪里来。
- 赛事锚点：连接耐力赛、GT3、原型车或厂队经验。
- 技术宣言：展示品牌最极端或最清晰的工程能力。
- 公路转译：把赛道经验带回普通用户更容易理解的量产车。

Porsche 样板：

- `956`：旧北环封印，Bellof 与 Group C。
- `935`：宽体图腾，Group 5 与 911 轮廓。
- `919 Hybrid Evo`：技术宣言，现代混动原型车。
- `911 GT3 RS`：公路转译，赛车空气动力进入量产 911。

### 车型详情页结构

车型详情文件放在：

```text
src/data/model-records/
```

新增车型后，在这里注册：

```text
src/data/model-records/index.js
```

品牌页里的车型卡片要加 `slug`，才能跳转到详情页：

```js
{
  model: '911 GT3 RS',
  slug: '911-gt3-rs',
  type: '公路转译',
  hook: '把赛车化空气动力和可上路身份压进同一台 911。',
  story: '车型卡片上的短故事。',
  tags: ['下压力', '轻量化', '赛道日']
}
```

车型详情记录建议包含：

```js
export default {
  brandSlug: 'porsche',
  brandName: 'Porsche',
  slug: '911-gt3-rs',
  name: '911 GT3 RS',
  status: 'Road-Legal GT',
  heroImage,
  heroCredit: '图片作者与授权',
  heroSourceHref: '图片来源链接',
  headline: '车型详情页标题下的一句话。',
  summary: '一段杂志式总述，说明这台车的核心意义。',
  stats: [
    { label: 'Nordschleife', value: '6:49.328', note: '数字背景' }
  ],
  storySections: [
    {
      eyebrow: '研发故事',
      title: '不要写成百科标题，要像展览小标题。',
      content: '讲它为什么这样被设计。'
    },
    {
      eyebrow: '北环位置',
      title: '解释北环如何放大这台车的性格。',
      content: '把具体赛段、速度、地形或系统放进叙述。'
    },
    {
      eyebrow: '圈速故事',
      title: '圈速是结果，不是唯一主角。',
      content: '讲这个数字说明了什么工程问题。'
    },
    {
      eyebrow: '工程性格',
      title: '给这台车一个清晰性格。',
      content: '总结它的驾驶、工业或品牌气质。'
    }
  ],
  systems: [
    { label: 'AIR', title: '系统标题', content: '一句说明。' }
  ],
  techDeck: [
    { title: '技术点', content: '解释技术点和车型意义。' }
  ],
  timelineTitle: '它站在一条车型时间线上',
  timeline: [
    { year: '2022', title: '事件', content: '事件意义。' }
  ],
  readingGuide: [
    '右侧工程索引，告诉读者怎么读这台车。'
  ],
  closingPoints: [
    '底部四个短句，像展览出口的关键词。'
  ],
  sources: [
    { title: '资料标题', href: 'https://example.com' }
  ]
};
```

### 写作原则

- 每台车型只承担一个核心角色，避免四台车都写成“很快、很强、很有名”。
- 品牌页卡片只负责引导，细节放进车型详情页。
- 车型详情页可以写具体年份、圈速和技术参数，但必须有来源。
- 先解释数字的意义，再展示数字本身。
- 少用“先……再……”这类机械句式，除非是在 `archiveNote` 或 `readingGuide` 里明确做阅读顺序。
- 不写“后续可补充”“即将上线”给普通用户看；这些只适合开发文档。

## 图片、视频与资料来源

当前详情页的资料卡由 `resources` 字段驱动。默认资料位会自动生成。如果某个弯角或品牌已经有真实资料，可以直接在对应记录文件里加入自定义 `resources`，它会覆盖默认资料位。

推荐资源格式：

```js
resources: [
  {
    id: 'flugplatz-photo-1',
    type: 'photo',
    label: 'Official Photo',
    title: 'Flugplatz 实拍图',
    description: '图片内容说明。',
    href: 'https://example.com/photo'
  }
]
```

支持的 `type`：

- `photo`
- `video`
- `article`
- `source`

有 `href` 时，资料卡会自动变成新窗口打开的外链。没有 `href` 时，资料卡会显示为占位。

## 文案风格

- 中文为主，弯角保留德语原名。
- 少写百科定义，多写画面感和驾驶场景。
- 不要把圈速当作唯一核心，先解释为什么这个弯、这台车、这个品牌值得看。
- 没有核实的圈速和年份不要硬写具体数字，先用“圈速故事预留”或“后续可补充”占位。
