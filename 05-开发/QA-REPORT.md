# WANDOAK 官网 · QA 报告

跑于生产构建（`npm run build` → `vite preview`），2026-08-19。
harness：`wandoak-web/scripts/verify.mjs`（Playwright + Chromium），可重复执行 `npm run qa`。

**结果：20 项断言全绿，0 失败。**

---

## 1 · 关于 /browse

`/browse` 的一次性构建在本机装 bun 这一步被它自己的**校验和守卫拦下**：skill 里锁定的 `bun.sh/install` 哈希是
`bab8acf…68dd`，实际下载到的是 `04882bf…3be8`——上游脚本在 skill 固定之后改过。

**我没有绕过这个守卫。** 供应链校验拦下来就是拦下来了。改用 Playwright 走同一条路：装在项目 devDependency 里，
断言脚本留在仓库中可重复跑，覆盖面比手动截图更广（几何、对比度、性能、可达性全部是实测数字）。

---

## 2 · 断言明细

| # | 断言 | 结果 | 实测 |
|---|---|---|---|
| `A2a` | every reveal fired after a full scroll | ✅ PASS | 0 sections never revealed |
| `A1` | container-a content width = 1350 | ✅ PASS | 1350.00px |
| `A2` | section rhythm = 70.00px | ✅ PASS | 10 gaps: 70 |
| `A3` | 4-up = 313.5 wide, 32 gap, 1350 total | ✅ PASS | w 313.5 · gap 32 · total 1350 |
| `A4` | nav sticky top:0 z:200 h=83.5 white | ✅ PASS | 83.5px · sticky · top 0px · z 200 · rgb(255, 255, 255) |
| `A5` | hero full-bleed 1440 × 575.25 | ✅ PASS | 1440 × 575.25 |
| `A6` | footer #000, pad-top 28 / pad-bottom 64 | ✅ PASS | rgb(0, 0, 0) · 28px / 64px |
| `A7` | font sizes confined to the scale | ✅ PASS | 60/44/32/18/16/14/12 |
| `A9` | no horizontal scroll 320–1920 | ✅ PASS | clean at 9 widths |
| `A8` | mobile: nav 57px, hero 1:1 | ✅ PASS | nav 57px · hero 390×390 · wide hidden true |
| `A18` | no overlay caption spills above its section | ✅ PASS | overflow px: -390, -390, -24 |
| `A13` | images: dimensions, alt, hero priority | ✅ PASS | 26 imgs · missing dims 0 · missing alt 0 · broken 0 · hero fetchpriority high |
| `A17` | stat figures settle on the exact published values | ✅ PASS | 35,000 m² · 600,000 pcs · 500+ |
| `A16` | overlay text contrast >= 4.5:1 | ✅ PASS | hero h1 6.50:1 · hero sub 6.82:1 · cta display 10.50:1 · cta lead 11.58:1 — worst hero h1, fg rgb(255, 255, 255) vs worst ground rgb(78,95,120) |
| `A10` | locale switch: lang attr, copy swaps, height stable | ✅ PASS | lang=zh-CN · cjk=true · height 7249→7203 (0.6%) |
| `D1` | document height (ALO reference 6435px) | — INFO | 7249px |
| `R1` | 8 routes render + 404 fallback | ✅ PASS | all ok · 404 true |
| `A15` | empty submit blocks with field errors | ✅ PASS | 4 field errors shown |
| `A15b` | invalid email is rejected | ✅ PASS | 1 email error |
| `A14` | prefers-reduced-motion: reveals resolved, counters final | ✅ PASS | 9 reveal nodes · 0 still faded · stat "35,000 m²" |
| `A12` | console errors / failed requests | ✅ PASS | 0 console errors, 0 failed requests |

`D1` 是信息项：文档高 7,249px，比 ALO 的 6,435px 高约 12.6%。多出来的是数字条（ALO 没有）和第二块双栏编辑位。
区块节奏本身仍然恒为 70px（`A2`），所以纵向韵律和样板一致。

---

## 3 · 性能（生产构建，1440×900，本地）

| 指标 | EN | 中文 | 预算 |
|---|---|---|---|
| LCP | **604 ms** | **544 ms** | < 2500 ms |
| FCP | 164 ms | 108 ms | — |
| CLS | **0** | **0** | < 0.1 |
| 首屏总传输 | **279 KB** | **656 KB** | — |
| 其中字体 | 20 KB | 397 KB | — |
| 其中图片 | 259 KB | 259 KB | — |

中文多出来的 377 KB 是 CJK 字体，**只在切到中文时才加载**，不阻塞首屏。

---

## 4 · Technical artist 阶段修掉的问题

按发现顺序，全部有实测或截图证据。

### 严重

**1 · Hero 文字被自己的蒙版盖住。**
`.hero::after` 的渐变蒙版和 `.hero__inner` 在同一个层叠上下文里，伪元素在源码顺序上更靠后，
所以蒙版画在了文字上面。白色 60px 标题实测对比度约 **2:1**，按钮看起来是灰的。
修法：`.hero__inner { z-index: 2 }` / `::after { z-index: 1 }`，并按实际天空亮度加重了渐变。
现在最差一处（hero h1 压最亮的 10% 天空）是 **6.50:1**。新增断言 `A16` 盯着这件事——
它是把文字藏起来、只拍文字底下的像素来测的，直接测文字会量到白对白。

**2 · 移动端 Hero 标题被截掉。**
390px 下 caption 比 1:1 的图还高，`align-items: flex-end` 让它向上溢出，第一行钻到 sticky 导航底下。
修法：≤767px 改为图在上、文字在下的堆叠版式，蒙版取消，文字直接压黑底。新增断言 `A18`。

**3 · CLS 0.507。**
首页路由是动态 import，首屏 `<main>` 是空的，页脚直接顶到导航底下；chunk 到了之后页脚整屏下移。
修法：首页路由改为静态导入（它是落地页，拆包只换来一次往返），并给 `main` 加
`min-height: calc(100svh - var(--nav-h))` 兜住所有懒加载路由。**CLS 0.507 → 0。**

**4 · 中文站白下载 1.35 MB 字体。**
`@fontsource/noto-sans-sc` 按 unicode-range 切成上百片，中文页面会拉走其中约 40 片 × 3 字重。
修法：构建期向 Google Fonts 要**只含本站 865 个字**的子集并落到本地。**1350 KB → 383 KB**，运行时不依赖 CDN。
第一版脚本还踩了个坑：`text=` 参数在 URL 过长时会被**静默忽略**、退回完整字体（13 MB）。
脚本现在分批请求，并在返回超过一个 `@font-face` 时直接报错。

### 几何（对着 alo-spec 实测值）

| 问题 | 实测 | 修法 |
|---|---|---|
| 导航高 84.5px，应为 83.5 | 1px 描边加在了 sticky 外层 | 描边移进 `.nav__bar` 内侧——ALO 本来就是 82.5px 行 + 1px 线 |
| Hero 高 557.25px，应为 575.25 | 用了图片自身的 1920/743 比例 | 版面要复刻的是**盒子**比例 1440/575.25；照片是 object-fit cover 进去的 |
| 区块间距 70/86/54 混杂 | 是 harness 的问题：入场动画的 16px 位移还没走完就量了 | harness 改成像人一样逐屏滚动（IntersectionObserver 会跳过一次跳到底的元素），并等位移归零 |
| 字号出现 48 和 44 两档额外的 | 内页页头 48、数字条 44 | 统一成一档 `--t-dsm: 44px`，字号表保持七档 |

### 内容与图片

| 问题 | 修法 |
|---|---|
| 品类卡是 2×2 平铺图，产品浮在一片白里 | 裁切窗口加 `left`/`width`/`height`，单独取出一件衣服铺满卡片 |
| 外套卡是男模特下巴特写（女装品牌页） | 裁到只剩衣服的领口与拼缝。**素材里根本没有女装外套实拍**，见待确认清单 |
| 编辑位用了满屏中文的 TransThermal 技术幻灯片（英文页面） | 换成真实产品照，技术图留给后续的研发页 |
| 科技横滑里有三张烤了文字的幻灯片，272px 下糊成一团 | 七张全部换成干净的产品／车间实拍 |
| KNA 幻灯片图带烤进位图的白边和投影 | 管线加 `inset` 参数，裁切前先切掉边框 |
| 场景区导语挂错了文案（用的是设计哲学那段） | 换成 `products.heroLead` |
| 科技区导语写"三条原则"，底下却是七张卡 | 去掉导语，改成 ALO 轮播头的样式：标题在左，文字链 + 箭头在右 |
| 认证卡把缩写印两遍（"GRS" / "GRS — Global Recycled Standard"） | 组件里剥掉重复前缀；QIMA 展开为空时整行不渲染 |
| 认证区导语只是把下面五张卡再列一遍 | 换成德标品控体系 + 自有检测中心这句（是新信息） |
| 中文标题在 我们 / 的 之间断行 | 长中文标题加显式换行点，caption measure 620 → 700px |
| 询盘邮箱里的 `@` 让 vue-i18n 编译崩溃（`/contact` 整页白） | 按 vue-i18n 规范转义成 `{'@'}` |
| 截图抓到数字条动画中途的 **34,671 ㎡** | harness 等计数落定再截图；新增 `A17` 断言最终值必须精确等于公开数字 |

---

## 5 · 截图

`wandoak-web/qa/shots/`

| 文件 | 内容 |
|---|---|
| `home-{390,768,1024,1440,1920}.png` | 首页五档宽度整页 |
| `partner-{390,768,1024,1440,1920}.png` | 合作页五档宽度整页 |
| `home-zh-1440.png` `partner-zh-1440.png` `factory-zh-1440.png` | 中文版 |

---

## 6 · 还没做的

| 项 | 说明 |
|---|---|
| Lighthouse 跑分 | 没装 Lighthouse。LCP / CLS / 传输量是 Playwright 用 PerformanceObserver 实测的（见 §3），够判断达标，但不是 Lighthouse 的那个分数 |
| 屏幕阅读器实测 | 结构性可达性已覆盖（skip link、`aria-*`、焦点样式、`inert` 抽屉、语义标签、图片 alt 100%）；没有用 VoiceOver 走一遍 |
| 其余 6 页 | 按约定只出骨架 |
| 跨浏览器 | 只在 Chromium 上测过。Safari 的 `:has()` 和 `100svh` 都支持，但没实机验证 |
