> **这是 v1.0 的原始规格（动工前）。**
> 已建成的版本是 `SPEC.html`（v1.1），里面标了每一处「建成差异」与实测数字。
> 实现过程中改了什么、为什么改，见 `QA-REPORT.md`。

# WANDOAK 官网 · 开发规格书 v1.0

**日期** 2026-08-19　**样板** ALO Yoga 首页实测结构（`04-参考-ALO官网结构拆解/alo-spec.edited.json`，707 节点 / 11 区块 / 全部数值 measured）
**技术栈** Vue 3 + Vite　**范围** 首页 + 合作页完整实现 + 全站 8 页骨架　**语言** EN / 中文 双语

---

## 0 · 一句话

把 ALO Yoga 首页**实测出来的版面语法**（1440 布局、45px 边距、70px 区块节奏、313.5×4+32×3 四宫格、83.5px sticky 导航、六档字号、黑底页脚）当成结构母版，往里填 WANDOAK 自己的内容、自己的照片、自己的品牌色——**结构照抄，气质是自己的**。

---

## 1 · 决策记录（已拍板，不再回头讨论）

| # | 决策 | 结论 | 影响 |
|---|---|---|---|
| D1 | 语言 | **EN + 中文双语**，EN 为默认。vue-i18n，右上角切换，`localStorage` 记忆 | 需把 `02-文案/WANDOAK-官网文案.md` 的中文按 `en.json` 的 244 键结构转成 `zh.json` |
| D2 | 范围 | **首页 + 合作页做完整**，其余 6 页出骨架（路由通、导航不 404、有页面 hero + 占位区块） | 8 条路由全部存在；Phase 2 补内容 |
| D3 | 成立年份 | **回避具体年份**。全站统一写 `20+ years focused on sportswear` | `factory.foundedValue` 的 `"TBC"` 必须删除，改成 `foundedLabel: "Experience" / foundedValue: "20+ years in sportswear"` |
| D4 | 客户名单 | **只写 H&M**（英文 profile 口径）。Versace / Stronger 不出现在任何页面 | `partner.clientsBody` 保持现状 |
| D5 | 模特图 | **先全部用上**，同时产出《上线前授权待确认清单》 | 见 §11 |
| D6 | 动效 | **克制**：ALO 忠实（原生滚动、无 pin、无视差、唯一 sticky 是导航）+ 微量入场（IntersectionObserver 淡入上移 / 图片 hover 微缩放 / 数字滚动计数） | 不引入 GSAP / Lenis / ScrollTrigger，与 ALO 实测一致 |
| D7 | 运动员姓名 | 沿用 `en.json` 现状——**不点名**，写作 "A female boxer from Ningbo" | 未经用户确认改口径前保持匿名（见 §11 待确认 Q3） |
| D8 | 电商 | **不做**。主 CTA 是 `Request a Meeting` 询盘，不是购物车 | 展会站定位；商品轮播位改作技术/品类展示 |

---

## 2 · 从 ALO 实测里提炼出来的设计系统

> 下面每一个数字都来自 `alo-spec.edited.json` 的 `measured` 字段，不是估的。

### 2.1 三套容器（ALO 实际同时在用三套，这是最容易被忽略的一点）

| 名称 | 左右 padding | 内容宽 @1440 | ALO 用在哪 | WANDOAK 用在哪 |
|---|---|---|---|---|
| **Container A** | 45px | **1350** | 主导航、品类四宫格、页脚 | 导航、四宫格、数字条、页脚、认证墙 |
| **Container B** | 16px | **1408** | 商品轮播、Shop By Activity 六宫格 | 场景四宫格、技术横滑 |
| **Container C** | 70px | **1300** | 双栏编辑位、全幅 CTA | 双栏编辑位、全幅 CTA、合作页三卡 |

响应式 padding（实测 `containerPadX`）：`45px → 30px (≤991) → 16px (≤767)`

### 2.2 栅格数学（全部验算过）

```
Container A 1350:
  4-up  (1350 − 32×3) / 4 = 313.50   ← ALO 四宫格实测值，完全吻合
  3-up  (1350 − 32×2) / 3 = 428.67   ← 数字条 / 合作页三卡
  5-up  (1350 − 12×4) / 5 = 260.40   ← 合作页五步流程

Container B 1408:
  6-up  (1408 − 12×5) / 6 = 224.67   ← ALO Shop By Activity 实测值，完全吻合
  4-up  (1408 − 12×3) / 4 = 343.00   ← 场景四宫格

Container C 1300:
  2-up  (1300 − 15) / 2   = 642.50   ← ALO 双栏编辑位实测值，完全吻合
```

### 2.3 纵向节奏

* **区块间距恒定 70px** —— ALO 全站 `.hp-section { margin-bottom: 70px }`，一个例外都没有。这是整张页面的呼吸感来源。
* 响应式：`70px → 56px (≤991) → 40px (≤767)`
* 间距标尺（ALO `--spacing-*` 原值）：`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 56 · 64 · 72 · 80 · 96 · 120`

### 2.4 字号级差（只允许出现这六档：60 / 32 / 18 / 16 / 14 / 12）

| Token | size / line-height | weight | letter-spacing | transform | ALO 出现次数 | 用途 |
|---|---|---|---|---|---|---|
| `--t-display` | 60 / 72 | 700 | −1.8px | uppercase | 1 | 全幅 CTA 的唯一大字。**整页最多一次** |
| `--t-h2` | 32 / 40 | 600 | −0.96px | uppercase | 5 | 区块标题 |
| `--t-editorial` | 32 / 35.2 | 400 | normal | none | 2 | 编辑位标题（不大写、不加粗——这是 ALO 的"软"声部） |
| `--t-h6` | 18 / 23.94 | 500 | 0.9px | uppercase | 15 | 卡片标题 / eyebrow |
| `--t-btn` | 18 / 18 | **900** | 1.5px | uppercase | 2 | 按钮文字 |
| `--t-lead` | 18 / 25.2 | 400 | 0.396px | none | 1 | 区块导语 |
| `--t-body` | 16 / 22.4 | 400 | 0.352px | none | **57** | 正文主力 |
| `--t-body-semi` | 16 / 22.4 | 600 | 0.352px | none | 30 | 正文强调 / 页脚列标题 |
| `--t-tag` | 16 / 16 | 500 | 1.12px | uppercase | 2 | 编辑位角标 |
| `--t-sm` | 14 / 19.6 | 400 | 0.308px | none | 12 | 辅助信息 |
| `--t-smcaps` | 14 / 18.2 | 600 | 0.7px | uppercase | 1 | 小号标签 |
| `--t-micro` | 12 / 16.8 | 400 | 0.48px | uppercase | 26 | 角标 / 版权行 |

> **规则**：任何新组件不得引入第七档字号。要新层级，用 weight 和 letter-spacing 解决。

### 2.5 字体

ALO 用 `proxima-nova`（商业授权，我们没有）。替代方案：

| 用途 | 字体 | 理由 |
|---|---|---|
| 拉丁文 | **Figtree Variable (300–900)** | 人文几何 sans，与 Proxima Nova 骨架最接近；有 900 字重（按钮必需） |
| 中文 | **Noto Sans SC (300–900)** | 权重覆盖一致；按 unicode-range 分片，EN 模式下不下载 |

自托管（`@fontsource-variable/figtree` + `@fontsource/noto-sans-sc`）——展会现场网络不可靠，不依赖 Google Fonts CDN。

```css
--font-sans: "Figtree Variable", "Noto Sans SC", -apple-system, Helvetica, sans-serif;
```

### 2.6 颜色

**中性阶（ALO 原值，全站 95% 只用这些）**

```css
--ink:        #000000;   /* 正文、标题、页脚底、主按钮底 */
--ink-90:     #242424;   /* charcoal */
--ink-75:     #3b3b3b;   /* mine */
--ink-60:     #636363;   /* chicago — 次要文字 */
--ink-40:     #a3a3a3;   /* dawn */
--line:       #cccccc;   /* alto — 描边 */
--line-soft:  #e1e1e1;   /* mercury */
--wash:       #f2f2f2;   /* smoke — 角标底 */
--wash-band:  #f0f0f0;   /* 整段区块底（ALO 用在 Shop By Activity / UGC） */
--paper:      #ffffff;
```

**品牌色（从你自己的 logo 位图取样，不是猜的）**

```css
--brand:      #01a04c;   /* WANDOAK 绿 — 取自 03-图片素材/小图与图标/wandoak_p02_1.jpg */
--brand-ink:  #017a3a;   /* hover 加深 */
--parent:     #a40809;   /* K&A 红 — 取自 kna_p19_11.jpg，仅用于母公司标识 */
```

**用色纪律（这条决定了成品像不像 ALO）**

* 页面 95% 是 黑 / 白 / 灰。绿色是**唯一**强调色，只出现在：链接 hover 下划线、导航当前项、数字条的数值、eyebrow 前的短横线。
* 红色 `--parent` **只**出现在页脚的母公司 lockup 里，别处一次都不出现。
* 大面积色彩全部来自照片本身，不来自 CSS。

**自然色系（从照片实测取样，仅作可选的区块淡色底，默认不启用）**

| 名称 | 取样值 | 来源 | 6% 淡底 |
|---|---|---|---|
| Sky | `#7890c0` | `wandoak_p03_1` / `wandoak_p19_0` 天空与海 | `#eef1f7` |
| Lavender | `#a8a8c0` | `wandoak_p14_1` 紫色印花系列 | `#f1f0f5` |
| Sand | `#c0a890` | `wandoak_p03_1` 地面与外套 | `#f6f2ed` |

> 这三个色对应文案里「光的色散 / 天然矿物」的说法，是有出处的，不是装饰。但**默认全站不用**——需要时只做区块底色，绝不做文字色。

### 2.7 断点（ALO 实测 Bootstrap 4 断点，直接沿用）

`576 / 768 / 992 / 1200 / 1440`

移动端实测（591px 处）：导航高 **57px**（桌面 83.5px），Hero 变 **1:1 正方形**，区块全部单列堆叠。

### 2.8 阴影

ALO 首页几乎不用阴影（只有弹窗有）。**WANDOAK 首页与合作页：零阴影**。层级靠留白和色块解决。

---

## 3 · 组件解剖（ALO 组件 → WANDOAK 组件的一一对应）

| ALO 组件 | 实测几何 | WANDOAK 组件 | 说明 |
|---|---|---|---|
| `.main-navbar` | 1440×83.5 sticky top:0 z:200 白底；logo x=45 w=71 h=48；gap 35；菜单 grid gap 30；右簇 gap 32 右 pad 45 | `SiteNav.vue` | logo 换 WANDOAK 绿色字标；菜单 5 项；右簇 = 语言切换 + Enquire 黑底按钮 |
| `.hero-slideshow` | 1440×575.25 全幅，图 aspect 1920/743；caption 绝对定位右下，pad 20，btn 192.88×48 | `HeroFull.vue` | 支持 caption 九宫格定位、明/暗两套文字色 |
| `.image-grid__card` | 313.5 宽；图 313.5×410（≈1:1.308）；标题 `--t-h6` margin-top 20 居中 | `CardGrid4.vue` | 四宫格，产品品类 / 认证 |
| `.PlpTile` | 265.59×558.69，图 265.59×398.39（2:3），margin-right 20 | 不直接用 | 商品瓦片；WANDOAK 无电商，该槽位改用 `EditorialTwoUp` |
| Shop By Activity | Container B，6-up 224.67，gap 12，图 224.67×316.78（≈1:1.41），标题 pad-top 12 | `ScenarioRow.vue` | 改 4-up 343 宽（场景只有 4 个，6 格会太碎） |
| 双栏编辑位 | Container C，2×642.5 gap 15；图 642.5×578.25（≈1:0.9）；白底标签块 512.5×46 压在图底 margin-left 130；`--t-editorial` 标题右对齐 | `EditorialTwoUp.vue` | 保留"白色标签块压图"这一手——ALO 全站最好看的一个细节 |
| 全幅 CTA | Container C 1300×445.9；`--t-display` 60px 白字居中；白底黑字按钮 200×51.5 pad 14/32 | `CtaBanner.vue` | 整站唯一允许出现 60px 的地方 |
| Shop by Color 横滑 | Container B，卡片 272×408（≈1:1.5），gap 12，下方 pad-bottom 32 | `TechScroller.vue` | 七项核心科技横向滚动 |
| UGC 瀑布 | `#f0f0f0` 整段底，pad 70/30/50/30；标题 `--t-h2` 居中 + `--t-lead` 副标题居中 | `CertGrid.vue` | 五张认证卡，同样 `#f0f0f0` 底 |
| `.footer` | `#000`，pad-top 28 / pad-bottom 64；`.container` 1440 pad 15；`.row` margin ∓15；列 236（内容 206）；链接 li margin-bottom 9，`--t-body` 白字；列标题 `--t-body-semi` | `SiteFooter.vue` | 三链接列 + 品牌块 + 母公司 lockup |
| Swiper 箭头 | 27×44，`#e1e1e1` 底，绝对定位垂直居中 margin-top −22 | `ScrollerArrows.vue` | 技术横滑复用 |

### 3.1 新增组件（ALO 没有，但文案要求）

| 组件 | 依据的 ALO 语法 | 几何 |
|---|---|---|
| `StatsBar.vue` | Container A 3-up 428.67 gap 32 | 三格：数值 `--t-display` 降到 48px / 标签 `--t-h6`。**这是展会上最快建立信任的模块，必须在首屏下方第一个** |
| `ProcessSteps.vue` | Container A 5-up 260.4 gap 12 | 五步流程，序号 `--t-h6` + 标题 `--t-body-semi`，节点间 1px 连线 `--line` |
| `OfferCards.vue` | Container C 3-up | 合作页三种合作方式 |
| `EnquiryForm.vue` | 页脚栅格 | 左表单 / 右联系块，2:1 |
| `InnerHero.vue` | 全幅 CTA 的几何（1300×445.9） | 内页页头，`--t-display` 降到 48px |

---

## 4 · 页面结构

### 4.1 首页 Home —— 与 ALO 的 11 个槽位严格一一对应

| # | ALO 原槽位（h） | WANDOAK 区块 | 文案键 | 图片 |
|---|---|---|---|---|
| 0 | 主导航 sticky (83.5) | **SiteNav** | `nav.*` | 绿色字标 |
| 1 | Hero A 全幅 (575.25) | **Hero** — 一家有工厂的品牌，一家懂设计的工厂 | `home.hero.h1/sub1/sub2` + `btn.enquire` `btn.exploreRange` | `wandoak_p03_1.jpg`（湖边网球 4480×6720，取中上部裁 1920:743） |
| 2 | — *(新增)* | **StatsBar** 35,000㎡ / 600,000件 / 500+ | `home.stats.*` | 无 |
| 3 | 商品轮播 (641.09) | **EditorialTwoUp** — 我们是谁：不是从设计稿开始，是从 20,000 个身体开始 | `home.who.*` + `btn.readStory` | `wandoak_p11_1.jpg`（模特特写）/ `kna_p05_7.jpg`（设计室） |
| 4 | 品类四宫格 (547.04) | **CardGrid4** — What we make | `home.products.*` + `btn.allProducts` | `wandoak_p15_5`(bras) `wandoak_p12_3`(bottoms) `wandoak_p15_6`(tees) `kna_p11_6`(outerwear) |
| 5 | Hero B 全幅 (575.25) | **Hero(暗)** — New Naturalism 设计哲学 | `home.design.h2/body/close` + `btn.seeDesign` | `wandoak_p05_0.jpg`（草地瑜伽，绿色系） |
| 6 | Shop By Activity `#f0f0f0` (531.91) | **ScenarioRow** — Shop by how you move | `products.scen1–4` | `wandoak_p05_0`(yoga) `wandoak_p02_0`(running) `wandoak_p12_2`(strength) `wandoak_p19_0`(urban) |
| 7 | 双栏编辑位 (711.04) | **EditorialTwoUp ×2** — 设计研发 / 品质 | `design.s2H2` `quality.braH2` | `wandoak_p13_0`(TransThermal 技术图) `kna_p18_1`(检针机) |
| 8 | 全幅 CTA (445.9) | **CtaBanner** — Every piece you see comes off our own floor | `home.capability.h2` + `btn.tourFactory` | `kna_p14_4.jpg`（吊挂产线全景） |
| 9 | Shop by Color 横滑 (560) | **TechScroller** — 七项核心科技 | `design.tech1–7Name/Desc` | `wandoak_p15_4`(面料肌理) `kna_p12_0` `kna_p12_1` `kna_p12_2` 等 |
| 10 | UGC 瀑布 `#f0f0f0` (558.15) | **CertGrid** — GRS / BSCI / OEKO-TEX / HIGG / QIMA | `quality.cert1–5Name/Desc` | 认证 logo（**缺**，见 §11 Q5） |
| 11 | 页脚 (557.18) | **SiteFooter** | `footer.*` `contact.*` | K&A 红标 `kna_p19_11.jpg` |

**预估文档高**：约 6,400–6,800px @1440（ALO 为 6,435px）——节奏一致就说明抄对了。

### 4.2 合作页 Work With Us

| # | 区块 | 组件 | 文案键 |
|---|---|---|---|
| 1 | 页头 | `InnerHero` | `partner.heroH1` + `kna_p13_0.jpg`（K&A 厂区全景） |
| 2 | 三种合作方式 | `OfferCards` (Container C 3-up) | `partner.odmTitle/odmBody/odmKicker` `brandTitle/brandBody` `teamTitle/teamBody` |
| 3 | 合作流程 | `ProcessSteps` (5-up) | `partner.processH2` `step1–5` |
| 4 | 产能背书 | `StatsBar`（复用） | `home.stats.*` |
| 5 | 合作伙伴 | `EditorialTwoUp` | `partner.clientsH2/clientsBody` + `kna_p03_0.jpg`（样品陈列厅） |
| 6 | 询盘表单 | `EnquiryForm` | `partner.formH2/formLead/field*` |
| 7 | 页脚 | `SiteFooter` | — |

**表单**：纯前端 + 可插拔 endpoint。`VITE_ENQUIRY_ENDPOINT` 为空时降级为 `mailto:ken@chinaqs.com` 预填正文，保证展会现场任何情况下都能发出去。字段与 `partner.field*` 一一对应，含前端校验与 `formSuccess` / `formError` 两态。

### 4.3 其余 6 页（骨架）

`/about` `/design` `/products` `/factory` `/quality` `/contact` —— 每页 = `SiteNav` + `InnerHero`（用各页已有的 `*.heroH1`）+ 一个 `ComingSoon` 占位区块 + `SiteFooter`。路由通、导航不 404、meta 正确。Phase 2 逐页填。

---

## 5 · i18n

* `vue-i18n@11`，`legacy: false`
* `src/i18n/en.json` = 直接搬 `02-文案/en.json`，两处改动：D3 的 `factory.founded*`，以及补 `nav.*` 的 5 项精简导航键
* `src/i18n/zh.json` = 按同一键结构从 `02-文案/WANDOAK-官网文案.md` 转写（我来做，244 键全覆盖）
* 默认 `en`；`localStorage.wandoak-locale` 记忆；`<html lang>` 同步
* **中英文排版差异**：中文不用 `text-transform: uppercase`（对 CJK 无效但会影响混排的拉丁词），`letter-spacing` 减半，`line-height` 加 0.15。用 `:lang(zh)` 覆盖，不写 JS 分支。
* 切换语言**不得引起布局跳变**（CLS < 0.1）——中英文长度差异用 `min-height` 锁定关键区块

---

## 6 · 图片管线

**问题**：源图最大 4480×6720 / 近 4MB，未做色彩管理，54 张原为 JPEG-2000 转出。直接上网页会让 LCP 崩掉。

**方案**：`scripts/build-images.mjs`（`sharp`）

1. 统一转 sRGB，剥离 ICC 与 EXIF
2. 按用途裁切（配置化 focal point，人像默认 `attention` 裁切策略）
3. 输出 AVIF + WebP + JPEG 三格式，宽度档位 `[400, 800, 1200, 1600, 2400]`
4. 生成 20px 宽的 LQIP base64 占位（对应 ALO 的 `blur-up` class）
5. 产出 `src/data/images.json` 清单（尺寸 / 各档路径 / LQIP / 原始出处）

`Picture.vue` 读清单渲染 `<picture>` + `srcset` + `sizes` + `width/height`（防 CLS）+ `loading="lazy"`（首屏 Hero 用 `eager` + `fetchpriority="high"`）。

**预算**：首屏图 ≤ 180KB（AVIF），全站单图 ≤ 300KB。

---

## 7 · 动效规范（D6：克制）

ALO 实测：`animationLib: 无`，`scrollModel: native`，`pinned: false`，唯一 sticky 是导航。我们照此办理，只加三样：

| 动效 | 实现 | 参数 |
|---|---|---|
| 区块入场 | `IntersectionObserver` + CSS class | `opacity 0→1`, `translateY 16px→0`, `600ms cubic-bezier(.22,.61,.36,1)`, 阈值 0.15, 只触发一次 |
| 图片 hover | CSS `transform` | `scale(1.03)`, `600ms`, 容器 `overflow:hidden` |
| 数字滚动 | `useCountUp` composable | 进入视口触发，`1200ms`, `easeOutExpo`，只 StatsBar 用 |

**硬性要求**：`@media (prefers-reduced-motion: reduce)` 下三者全部关闭，直接呈现终态。

---

## 8 · 工程结构

```
05-开发/wandoak-web/
├─ index.html
├─ vite.config.js
├─ package.json
├─ .env.example                    VITE_ENQUIRY_ENDPOINT
├─ scripts/build-images.mjs
├─ public/img/                     ← 生成物
└─ src/
   ├─ main.js  App.vue
   ├─ router/index.js              8 条路由 + scrollBehavior 回顶
   ├─ i18n/{index.js,en.json,zh.json}
   ├─ styles/
   │  ├─ tokens.css                §2 全部 token
   │  ├─ base.css                  reset + 字号工具类 .t-display .t-h2 …
   │  ├─ layout.css                .container-a/b/c  .section  .grid-4/3/5/6
   │  └─ index.css
   ├─ data/
   │  ├─ images.json               ← 生成
   │  └─ site.js                   导航、品类、场景、科技、认证、流程 的结构化数据
   ├─ components/
   │  ├─ layout/       SiteNav  SiteFooter  LangSwitch  MobileDrawer
   │  ├─ primitives/   AppButton  AppLink  Picture  Eyebrow  SectionHead  ScrollerArrows
   │  └─ sections/     HeroFull  StatsBar  EditorialTwoUp  CardGrid4  ScenarioRow
   │                   TechScroller  CtaBanner  CertGrid  ProcessSteps  OfferCards
   │                   EnquiryForm  InnerHero  ComingSoon
   ├─ composables/     useReveal  useCountUp  useLocale
   └─ pages/           HomeView PartnerView AboutView DesignView
                       ProductsView FactoryView QualityView ContactView
```

**依赖**（尽量少）：`vue` `vue-router` `vue-i18n` `@fontsource-variable/figtree` `@fontsource/noto-sans-sc`；devDep `vite` `@vitejs/plugin-vue` `sharp`。**不装 UI 框架、不装动效库、不装 CSS 框架**——ALO 的版面全部可以用原生 grid/flex 写出来。

---

## 9 · 验收标准

> 前 8 条直接改写自 `alo-spec.edited.json` 的 `acceptance` 数组，可用 `/browse` 逐条实测验证。

| # | 断言 | 怎么验 |
|---|---|---|
| A1 | @1440 容器 A 内容宽 = 1350px（1440 − 45×2） | `getBoundingClientRect().width` |
| A2 | 所有 `.section` 之间垂直间距恒为 **70.00px** | 相邻区块 `y` 差 − 前块 `h` |
| A3 | 四宫格卡片宽 **313.5px**，间距 **32px**（313.5×4 + 32×3 = 1350） | 实测四张卡的 x/w |
| A4 | 主导航 `position:sticky` `top:0` `z-index:200`，高 **83.5px**，白底 | computed style |
| A5 | Hero 全幅 1440 宽，比例 1920:743（575.25px 高） | rect |
| A6 | 页脚 `background:#000`，`padding-top:28px` `padding-bottom:64px` | computed style |
| A7 | 全站字号只出现 **60/32/18/16/14/12** 六个值 | 遍历所有文本节点的 `fontSize` 去重 |
| A8 | 断点在 576/768/992/1200 生效；≤767 导航高 57px、Hero 1:1 | 逐宽度截图 |
| A9 | 320–1920px 全程无横向滚动条 | `documentElement.scrollWidth <= clientWidth` |
| A10 | 中英切换后无布局跳变，CLS < 0.1 | PerformanceObserver |
| A11 | Lighthouse：Performance ≥ 90，Accessibility ≥ 95，LCP < 2.5s | Lighthouse CI |
| A12 | 控制台零 error、零 404 | `/browse` console 捕获 |
| A13 | 所有图片有 `width`/`height` 与 `alt`；首屏 Hero `fetchpriority=high` | DOM 审计 |
| A14 | `prefers-reduced-motion` 下所有动效关闭 | 模拟媒体特性 |
| A15 | 询盘表单：校验通过 → success 态；endpoint 缺失 → mailto 降级可用 | 交互测试 |

---

## 10 · QA / Technical Artist 计划

**Phase A —— `/qa` 功能验收**
路由 8 条全通、语言切换、表单三态（空/错/成）、移动端抽屉导航、键盘可达性、屏幕阅读器标签、404 兜底。

**Phase B —— `/browse` 视觉与几何验收**
1. 五档宽度截图：`390 / 768 / 1024 / 1440 / 1920`
2. **逐条跑 A1–A9 的几何断言**（这是"抄得对不对"的唯一客观证据）
3. 与 ALO 结构图并排比对：区块节奏、字号级差、留白密度
4. 控制台 error / 404 / 资源体积清单

**Phase C —— Technical Artist 精修**
* 图片焦点：每张人像重新指定裁切焦点，确认任何断点下都不切脸、不切手
* 文字压图对比度：Hero / CTA 上的白字实测对比度 ≥ 4.5:1，不够就加渐变蒙版（而不是压暗整张图）
* 混排：中英文同屏时的基线、标点挤压、数字与单位间距
* 边缘：最长中文标题、最长英文标题、`600,000 pcs/month` 这类不可断行串
* 性能：LCP 元素确认、字体 FOUT、图片解码耗时

---

## 11 · 上线前待确认清单（阻塞项）

| # | 事项 | 现状 | 需要你做什么 |
|---|---|---|---|
| Q1 | **模特肖像授权** | 46 张大图中 `wandoak_*` 系列含真人模特 | 确认原拍摄合同授权范围是否覆盖"官网 / 海外展会" |
| Q2 | **画面中第三方品牌 logo** | 部分大片中模特的鞋、球拍露出他牌 logo（`wandoak_p03_1` `wandoak_p02_0` `wandoak_p06_0` 尤其明显） | 换图，或做局部修图 |
| Q3 | **运动员姓名** | 现按匿名处理（"A female boxer from Ningbo"） | 若已获本人授权可具名，否则维持匿名 |
| Q4 | **院校具名** | `design.s3Body` 列了 中科院材料所 / 港科大 / 西安工程学院 | 确认三所院校是否同意在官网具名 |
| Q5 | **认证 logo 缺失** | 素材里没有 GRS / BSCI / OEKO-TEX / HIGG / QIMA 的矢量标识 | 提供官方 logo 文件；未提供前用文字卡片渲染 |
| Q6 | **商标符号** | `TransThermal™` 与 `Stretch Lycra` | TransThermal 是否已注册（决定 ™ / ®）；是否正品 LYCRA®，否则改 "Stretch Elastane" |
| Q7 | **专利数量口径** | 品牌手册写 50 余个外观专利，WANDOAK 2.0 写 20 余个 | 定一个（英文文案目前两个都没写，只写了 10 项发明专利，安全） |
| Q8 | **MOQ / 交期** | 三份材料完全没有 | 展会客人第一、第二个问题。合作页已预留位置 |
| Q9 | **车间视频** | 无 | 30 秒产线视频，合作页与工厂页都能用 |
| Q10 | **域名 / 部署环境** | 未定 | 决定后配 canonical、sitemap、OG image |

> Q1 / Q2 是**法务阻塞**，其余是内容阻塞。开发不等这些，先用现有素材做出来；上线前逐条销账。

---

## 12 · 里程碑

| 阶段 | 产出 | 验收 |
|---|---|---|
| **M0** 地基 | Vite 工程、tokens.css、layout.css、图片管线跑通、i18n 双语就绪、8 条路由 | `npm run dev` 起得来；A1/A2 通过 |
| **M1** 骨架 | SiteNav / SiteFooter / InnerHero / ComingSoon，6 页骨架页 | 导航不 404；A4/A6 通过 |
| **M2** 首页 | 11 个槽位全部实装 | A1–A9 全通；文档高 6,400–6,800px |
| **M3** 合作页 | 7 个区块 + 表单 | A15 通过 |
| **M4** QA | `/qa` + `/browse` 三阶段 | A1–A15 全绿 |
| **M5** 精修 | Technical Artist 修完 | Lighthouse 达标；截图归档 |

---

*本规格书的每一个几何数字都可追溯到 `04-参考-ALO官网结构拆解/alo-spec.edited.json` 的 measured 字段；每一句文案都可追溯到 `02-文案/en.json`；每一张图都可追溯到 `03-图片素材/`。无虚构数据。*
