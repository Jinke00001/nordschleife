# Content Status

## 弯角内容

弯角数据位置：

```text
src/data/corner-records/
```

当前已覆盖主要弯角，包括：

- Hatzenbach
- Hocheichen
- Flugplatz
- Schwedenkreuz
- Aremberg / Adenauer Forst 相关段落
- Fuchsröhre
- Metzgesfeld
- Kallenhard
- Bergwerk
- Kesselchen
- Hohe Acht
- Karussell
- Brünnchen
- Pflanzgarten
- Schwalbenschwanz
- Kleines Karussell
- Galgenkopf
- Döttinger Höhe

弯角页面已有：

- 列表页搜索
- 详情页
- 赛段印象图片
- 小地图高亮当前弯角
- 地图点击跳转详情页

后续重点：

1. 核实每个弯角名称来源和历史资料
2. 为仍然使用较弱图片的弯角替换真实授权图
3. 统一每个弯角详情页的文案密度

## 品牌内容

品牌数据位置：

```text
src/data/brand-records/
```

当前品牌：

- Porsche
- Mercedes-AMG
- BMW
- Audi
- Lamborghini
- Nissan
- Ferrari
- Volkswagen
- Lexus

Porsche 和 Mercedes-AMG 已经有较完整的定制车型详情页。

其余品牌已通过 `brand-expansion-records.js` 接入第一版车型详情内容。

## 车型详情

车型数据位置：

```text
src/data/model-records/
```

独立高完成度文件：

- Porsche 911 GT3 RS
- Porsche 919 Hybrid Evo
- Porsche 935
- Porsche 956
- Mercedes-AMG ONE
- Mercedes-AMG GT Black Series
- Mercedes-AMG GT R
- Mercedes-AMG GT3

批量扩展车型：

```text
src/data/model-records/brand-expansion-records.js
```

这批车型已经能正常跳转和展示，但下一步需要：

- 替换真实授权 hero 图片
- 核实圈速、年份、动力参数
- 根据具体资料进一步润色文案
- 为重点车型拆成独立数据文件

## 图片状态

当前 `src/assets/` 已有大量车型图片和弯角图片。

优先检查项：

1. 图片授权来源是否可追溯
2. hero 图片裁切是否适合桌面和移动端
3. 图片体积是否过大
4. 是否存在同图重复用于多个弯角或车型

