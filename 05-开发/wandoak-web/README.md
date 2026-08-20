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

首页与合作页完整实现；其余 6 页是骨架（路由通、有页头、有占位）。

验收：**20 项断言全绿**（`npm run qa`）。详见 `../QA-REPORT.md`。

## 三件事，改之前先知道

**1 · 区块间距是 70px，全站一个例外都没有。**
ALO 的 `.hp-section { margin-bottom: 70px }` 是整页呼吸感的唯一来源。`.section` 类负责这件事，别在组件里另加外边距。断言 A2 会验。

**2 · 字号只有七档：60 / 44 / 32 / 18 / 16 / 14 / 12。**
前六档来自 ALO 实测，44 是我们加的一档（`--t-dsm`，给数字条和内页页头）。新组件不要引入第八档——要新层级，用 weight 和 letter-spacing。断言 A7 会验。

**3 · 绿色只有一处用途。**
`--brand` `#01a04c` 只出现在：链接 hover、导航当前项、eyebrow 短横线、认证卡缩写。页面 95% 是黑白灰，大面积色彩全部来自照片。`--parent` `#a40809` 只在页脚的母公司标识里出现。

## 图片

源图在 `../../03-图片素材/`，最大 4480×6720、近 4MB、无色彩管理。`scripts/build-images.mjs` 负责转 sRGB、按版面比例裁切、出 AVIF/WebP/JPEG 三格式与宽度阶梯、生成 LQIP。

裁切窗口是**逐张人工定的**（`top` / `left` / `width` / `height` 四个比例参数）：sharp 的自动 `attention` 裁切会把地平线切过人脸，把 hero 裁成一整片天空。改图请连带看一眼产出。

`inset` 用来切掉 KNA 幻灯片里烤进位图的白边和投影。

品牌字标是从位图重建的透明 PNG：取反色亮度当 alpha，再把墨色重涂成品牌绿 / 白色，所以黑底页脚和白底导航各有一版。

## 中文字体

`Noto Sans SC` 完整分片有 1.35MB。中文文案是构建期已知的，所以 `scripts/build-cjk-font.mjs` 向 Google Fonts 要**只含本站用到的 865 个字**的子集，落到 `public/fonts/`，运行时不依赖 CDN（展会现场网络不可靠）。

三个字重合计 **383KB**，且只在切到中文时才加载。

改了 `zh.json` 就要重跑 `npm run font`，否则新字会掉字。脚本会在 Google 因 URL 超长而**静默退回完整字体**时直接报错，不会让 13MB 悄悄进仓库。

## 询盘表单

`VITE_ENQUIRY_ENDPOINT` 配了就 POST JSON；没配就降级成预填好的 `mailto:`。展会现场没有可靠网络时，让访客用自己的邮件客户端把询盘发出去，好过静默失败。

## 目录

```
src/
├─ components/
│  ├─ layout/       SiteNav · SiteFooter
│  ├─ primitives/   AppButton · AppLink · AppPicture · BrandMark · SectionHead · ScrollerArrows
│  └─ sections/     首页与合作页的每一个区块
├─ composables/     useReveal · useCountUp · useLocale
├─ data/            site.js（结构）· images.json（生成）
├─ i18n/            en.json · zh.json（266 键，一一对应）
├─ pages/           8 条路由 + 404
└─ styles/          tokens · base · layout · cjk（生成）
```

`data/site.js` 只存结构，文字一律走 i18n 键——没有任何一句文案需要翻译两遍。
