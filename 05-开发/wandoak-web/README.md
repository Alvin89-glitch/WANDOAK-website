# WANDOAK 官网

Vue 3 + Vite。版面结构以 ALO Yoga 首页的**实测几何**为母版（见 `../SPEC.md`），内容、照片、品牌色全部来自 WANDOAK 自己的三份资料。

```bash
npm install
npm run dev          # http://localhost:5178
```

## 命令

| 命令 | 做什么 |
|---|---|
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产构建 → `dist/` |
| `npm run preview` | 预览生产构建 |
| `npm run images` | 重建图片管线（读 `../../03-图片素材/`，产出 `public/img/` + `src/data/images.json`） |
| `npm run font` | 重建中文字体子集（改过 `src/i18n/zh.json` 之后必须跑） |
| `npm run verify` | 对着已经跑起来的服务跑验收断言 + 截图 |
| `npm run qa` | 构建 → 起 preview → 跑全套验收 |

`images` 和 `font` 的产物都已提交，日常开发不需要跑。

## 状态

首页、合作页、产品页、工厂页完整实现，产品页下挂四个品类页（`/products/:category`，载入 2026 产品线 16 个款号的真实数据）；其余 3 页（设计研发 / 品质 / 联系）是骨架（路由通、有页头、有占位）。

验收：**26 项断言全绿**（`npm run qa`）。详见 `../QA-REPORT.md`。

## 八件事，改之前先知道

**1 · 区块间距是 70px，全站一个例外都没有。**
ALO 的 `.hp-section { margin-bottom: 70px }` 是整页呼吸感的唯一来源。`.section` 类负责这件事，别在组件里另加外边距。断言 A2 会验。

**2 · 字号只有七档：60 / 44 / 32 / 18 / 16 / 14 / 12。**
前六档来自 ALO 实测，44 是我们加的一档（`--t-dsm`，给数字条和内页页头）。新组件不要引入第八档——要新层级，用 weight 和 letter-spacing。断言 A7 会验。

**3 · 绿色只有一处用途。**
`--brand` `#01a04c` 只出现在：链接 hover、导航当前项、eyebrow 短横线、认证卡缩写。页面 95% 是黑白灰，大面积色彩全部来自照片。`--parent` `#a40809` 只在页脚的母公司标识里出现。

**4 · 内页 hero 的几何归组件所有，不跟图走。**
`InnerHero` 强制 Container C 的 1300×445.9，传进来的图一律 object-fit 裁切。之前它跟着素材自己的比例走，给它一张 editorial 比例的图就会把页头撑成 1170px（`/design` 当时就是这样）。断言 A22 会验六个内页 × 五档宽度。

**5 · 入场动效必须扛得住"瞬间跳到底部"。**
`.reveal` 靠 IntersectionObserver 显形，而 IO 只报告"跨过阈值"的元素——浏览器恢复滚动位置、锚点跳转、按 End 键都会让中间区块从"屏幕下方"直接变成"屏幕上方"，一次都没相交过，于是永远停在 `opacity: 0`。`useReveal` 里那个共享的滚动兜底就是干这个的，断言 A21 会验。

## 图片

源图在 `../../03-图片素材/` 的三个子目录（`可用大图` · `小图与图标` · `产品照片`），最大 4480×6720、近 4MB、无色彩管理。`scripts/build-images.mjs` 负责转 sRGB、按版面比例裁切、出 AVIF/WebP/JPEG 三格式与宽度阶梯、生成 LQIP。

裁切窗口是**逐张人工定的**（`top` / `left` / `width` / `height` 四个比例参数）：sharp 的自动 `attention` 裁切会把地平线切过人脸，把 hero 裁成一整片天空。改图请连带看一眼产出。

`inset` 用来切掉 KNA 幻灯片里烤进位图的白边和投影。

品牌字标是从位图重建的透明 PNG：取反色亮度当 alpha，再把墨色重涂成品牌绿 / 白色，所以黑底页脚和白底导航各有一版。

**6 · `sizes` 提示必须跟着栅格走。**
它决定浏览器从宽度阶梯上取哪一级。四宫格的 `23vw` 留在三宫格上，就会把 331px 的位图铺进 428.7px 的格子里，整页发虚而且不报错。断言 A24 会验六条路由上每一张图的实际位图宽度。

**7 · 库存和条形码不上站，MOQ 与交期必须继续标"面议"。**
产品表里有单款库存和条形码，两样都**有意没进 `products.js`**：库存每天在变，上线当天就是错的；条形码是内部数据。MOQ 与交期是产品表尚未给出的两项（SPEC Q8），是卡片上仅有的两个"面议"。断言 A23 三头盯着：每款恰好 2 个待定格（多了说明有字段被清空，少了说明数字到了但提示条没撤）、款式网格里不得出现库存或条形码、以及规格格子不得为空。

**8 · 去底图的归一化交给 alpha 通道，不要手调。**
`mode: 'cutout'` 会用 `trim()` 削掉透明边距、再按固定占比装进目标比例并合成底色。16 张单款图的原始构图差异很大（衣服占画幅从一半到几乎满幅），平铺出来像同一批货拍了五个距离。底色默认 `--wash-band`，`plate` 可逐张覆盖——品类四宫格那张外套用的是白底，因为它旁边三张是白底平铺图。

## 产品数据

`src/data/products.js` 是 2026 产品线的事实层：16 个款号的品类、性别、尺码范围、配色数量、以及专利/环保等标记。品名、描述、成分、配色列表是文案，走 i18n 的 `products.styles.<款号>`——因为中文字体子集只扫 `zh.json`，中文产品文案放到别处会掉字。

数据来源是 `桌面/豌豆客图片/产品表及介绍.xls`（女士 9 款 + 男士马拉松 7 款）。**库存与条形码没有导入**，原因见上面第 6 条。

`W2306738`（男式立领外套）在产品表里没有卖点文字，所以它的 `desc: false`——组件据此不渲染描述行，而不是印一行空的。

## 中文字体

`Noto Sans SC` 完整分片有 1.35MB。中文文案是构建期已知的，所以 `scripts/build-cjk-font.mjs` 向 Google Fonts 要**只含本站用到的 1,009 个字**的子集，落到 `public/fonts/`，运行时不依赖 CDN（展会现场网络不可靠）。

三个字重合计 **457KB**，且只在切到中文时才加载。

改了 `zh.json` 就要重跑 `npm run font`，否则新字会掉字。脚本会在 Google 因 URL 超长而**静默退回完整字体**时直接报错，不会让 13MB 悄悄进仓库。

## 询盘表单

`VITE_ENQUIRY_ENDPOINT` 配了就 POST JSON；没配就降级成预填好的 `mailto:`。展会现场没有可靠网络时，让访客用自己的邮件客户端把询盘发出去，好过静默失败。

## 目录

```
src/
├─ components/
│  ├─ layout/       SiteNav · SiteFooter
│  ├─ primitives/   AppButton · AppLink · AppPicture · BrandMark · SectionHead · ScrollerArrows
│  └─ sections/     四个成品页面的每一个区块
├─ composables/     useReveal · useCountUp · useLocale
├─ data/            site.js（版面结构）· products.js（2026 产品线）· images.json（生成）
├─ i18n/            en.json · zh.json（354 键，一一对应）
├─ pages/           11 条路由（含 4 个品类页）+ 404
└─ styles/          tokens · base · layout · cjk（生成）
```

`data/site.js` 只存结构，文字一律走 i18n 键——没有任何一句文案需要翻译两遍。
