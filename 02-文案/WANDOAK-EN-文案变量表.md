# WANDOAK 官网 · 英文文案变量表

配套文件：**`en.json`**（244 个键，可直接丢进 i18n）
命名规则：`区块.用途` 两到三层点分。`nav.*` `btn.*` `footer.*` 是全站复用，其余按页面归组。
调用示例：`t('home.hero.h1')`

约定：
- `h1` = 页面唯一主标题｜`h2` = 板块标题｜`eyebrow` = 标题上方的小字标签｜`lead` = 导语｜`body` = 正文段
- 值里的 `\n\n` 表示分段，前端按段落渲染
- **粗体标红项**表示需要你确认后才能上线

---

## 1 · 全站通用

### 1.1 站点元信息 `site.*`

| Key | English | 放在哪里 |
|---|---|---|
| `site.name` | WANDOAK | Logo 旁文字版品牌名、`<title>` 后缀 |
| `site.company` | Ningbo K&A Technology Co., Ltd. | 页脚公司全称、联系页、法务声明 |
| `site.tagline` | Professional · Healthy · Comfortable · Sustainable | 页脚 logo 下一行；展会 banner 副标题 |
| `site.metaTitle` | WANDOAK — Women's Performance Sportswear, Made in Our Own Factory | 浏览器标签页 / 搜索结果标题 / 分享卡片标题 |
| `site.metaDescription` | WANDOAK is a women's sportswear brand backed by a 35,000 m² factory… | `<meta description>`、微信/LinkedIn 分享摘要 |

> `metaTitle` 特意把 "Made in Our Own Factory" 写进去了——展会后客人回去搜你们，搜索结果第一行就该说清"有厂"。

### 1.2 导航 `nav.*`

| Key | English | 放在哪里 |
|---|---|---|
| `nav.home` | Home | 顶部导航第 1 项 |
| `nav.about` | Our Story | 第 2 项 |
| `nav.design` | Design & R&D | 第 3 项 |
| `nav.products` | Products | 第 4 项 |
| `nav.factory` | Our Factory | 第 5 项 |
| `nav.quality` | Quality | 第 6 项 |
| `nav.partner` | Work With Us | 第 7 项 |
| `nav.contact` | Contact | 第 8 项 |
| `nav.cta` | Enquire | 导航最右侧的高亮按钮（黑底白字，全站常驻） |

> 8 项对桌面导航偏多。若要精简到 5 项，建议合并为：Our Story ／ Products ／ **Our Factory**（吞掉 Quality）／ **Work With Us**（吞掉 Design & R&D 做锚点）／ Contact。展会场景下 `nav.factory` 和 `nav.partner` 绝不能藏进二级菜单。

### 1.3 按钮 `btn.*`

| Key | English | 放在哪里 |
|---|---|---|
| `btn.enquire` | Request a Meeting | 首页 Hero 主 CTA、各页页尾转化条 |
| `btn.exploreRange` | Explore the Range | 首页 Hero 次 CTA（描边按钮） |
| `btn.readStory` | Read the full story | 首页"我们是谁"板块底部文字链 |
| `btn.seeDesign` | See how we design | 首页"设计思路"板块底部文字链 |
| `btn.allProducts` | View all products | 首页产品速览板块底部文字链 |
| `btn.tourFactory` | Tour the factory | 首页能力板块底部文字链 |
| `btn.sendEnquiry` | Send Enquiry | 合作页表单提交按钮 |
| `btn.downloadProfile` | Download Company Profile | 工厂页 / 合作页侧边，挂 KNA Profile PDF |

> `btn.enquire` 用 "Request a Meeting" 而不是 "Buy Now"——展会阶段主 CTA 是**约谈**，不是下单。电商按钮等零售功能上线后再单独加 `btn.addToCart`。

---

## 2 · 首页 `home.*`

### 2.1 Hero 首屏

| Key | English | 放在哪里 |
|---|---|---|
| `home.hero.h1` | A brand that owns its factory.<br>A factory that thinks like a brand. | 首屏 H1，**两行断开显示**（值里已含 `\n`）。整站最重要的一句 |
| `home.hero.sub1` | WANDOAK — by Ningbo K&A Technology Co., Ltd. | H1 下方第一行小字，建立"品牌+母公司"关系 |
| `home.hero.sub2` | From yarn to finished garment, from body data to industry standards — all of it happens under our own roof. | H1 下方第二行，一句话说完全链路 |

按钮用 `btn.enquire` + `btn.exploreRange`。

### 2.2 数字条 `home.stats.*`

紧贴 Hero 下方的横排三格，展会上建立信任最快的模块。每格上大下小。

| Key | English | 放在哪里 |
|---|---|---|
| `home.stats.areaValue` | 35,000 m² | 第 1 格大字 |
| `home.stats.areaLabel` | Owned production facility | 第 1 格小字 |
| `home.stats.capacityValue` | 600,000 pcs | 第 2 格大字 |
| `home.stats.capacityLabel` | Monthly production capacity | 第 2 格小字 |
| `home.stats.peopleValue` | 500+ | 第 3 格大字 |
| `home.stats.peopleLabel` | Skilled garment workers | 第 3 格小字 |

### 2.3 板块二 · 我们是谁

| Key | English | 放在哪里 |
|---|---|---|
| `home.who.eyebrow` | Who we are | H2 上方小标签 |
| `home.who.h2` | We didn't start from a sketch. We started from 20,000 bodies. | 板块 H2 |
| `home.who.body` | WANDOAK was founded in 2012…（3 段，全文见 en.json） | H2 下方正文，配品牌形象图 |

底部接 `btn.readStory`。

### 2.4 板块三 · 设计思路

| Key | English | 放在哪里 |
|---|---|---|
| `home.design.eyebrow` | Design philosophy | H2 上方小标签 |
| `home.design.h2` | New Naturalism — design that begins with observation | 板块 H2 |
| `home.design.body` | We believe physical and mental wellbeing already belong to the natural world… | H2 下方导语段 |
| `home.design.item1` | Light dispersion — the purest spectrum sunlight breaks into | 四条自然参照，列表第 1 条 |
| `home.design.item2` | The golden ratio of the nautilus shell | 第 2 条 |
| `home.design.item3` | The Fibonacci sequence in a sunflower head | 第 3 条 |
| `home.design.item4` | Crown shyness, raw minerals, a night sky | 第 4 条 |
| `home.design.close` | These are not prints we put on garments… | 列表下方收尾段——**这句是关键**，它把"自然意象"从装饰澄清成方法论 |

底部接 `btn.seeDesign`。

### 2.5 板块四 · 产品速览

四格卡片，每格一图 + 标题 + 一句话。

| Key | English | 放在哪里 |
|---|---|---|
| `home.products.h2` | What we make | 板块 H2 |
| `home.products.braTitle` / `braDesc` | Sports Bras / Our core category. Five-way support engineered for high-impact movement. | 卡片 1 |
| `home.products.bottomsTitle` / `bottomsDesc` | Bottoms / Including our compression line — lift, shape and hold. | 卡片 2 |
| `home.products.topsTitle` / `topsDesc` | Tees & Tanks / Where technical fabric meets everyday wear. | 卡片 3 |
| `home.products.outerTitle` / `outerDesc` | Outerwear / From the studio floor to light outdoor. | 卡片 4 |

底部接 `btn.allProducts`。

### 2.6 板块五 · 我们的能力

| Key | English | 放在哪里 |
|---|---|---|
| `home.capability.h2` | Every piece you see comes off our own floor. | 板块 H2 |
| `home.capability.item1Title` / `item1Desc` | Our own factory / 35,000 m² in Zhenhai Economic Zone… | 四格图标区第 1 格 |
| `home.capability.item2Title` / `item2Desc` | Two construction lines / 1,000+ machines — 700 cut & sew, 300 seamless knitting | 第 2 格 |
| `home.capability.item3Title` / `item3Desc` | 600,000 pcs a month / A complete path from first sample to full production | 第 3 格 |
| `home.capability.item4Title` / `item4Desc` | International standards / GRS · BSCI · OEKO-TEX® Standard 100 · HIGG · QIMA | 第 4 格 |

底部接 `btn.tourFactory`。

---

## 3 · 品牌故事页 `about.*`

| Key | English | 放在哪里 |
|---|---|---|
| `about.heroH1` | The strap that started a brand | 页面 H1，配大图首屏 |
| `about.originH2` | London, 2012. | 第一板块 H2，建议大字号单独一行 |
| `about.originBody` | A female boxer from Ningbo had to pause her match…（3 段） | 品牌初心正文 |
| `about.nameH2` | Where the name comes from | 第二板块 H2 |
| `about.nameBody` | WANDOAK = WAND + OAK…（3 段） | 名字释义正文。建议 WAND / OAK 两词做视觉强调 |
| `about.believeH2` | What we believe | 第三板块 H2 |
| `about.believeQuote` | We move in pursuit of a youth that never compromises.…（3 行） | 引言样式，大字居中，**三行分行排** |
| `about.philosophyLabel` / `philosophyValue` | Brand philosophy / To give Chinese women a sporting experience… | 定义列表第 1 行 |
| `about.sloganLabel` / `sloganValue` | Brand slogan / Serious support for serious movement. | 定义列表第 2 行 ⚠️ 见第 7 节 |
| `about.keywordsLabel` / `keywordsValue` | Four words we hold to / Professional · Healthy · Comfortable · Sustainable | 定义列表第 3 行 |
| `about.audienceH2` | Who we make it for | 第四板块 H2 |
| `about.audienceBody1` | Our customer is financially independent, warm, open… | 客群画像第 1 段 |
| `about.audienceBody2` | What she asks for is specific: it has to be wearable… | 第 2 段（需求） |
| `about.audienceBody3` | But movement has no age limit… | 第 3 段（包容性收尾） |
| `about.sloganInternal` | Fast. Passionate. Accountable. | 页尾三句之一 |
| `about.vision` | To lead the sports underwear industry. | 页尾三句之二（Vision） |
| `about.mission` | Built for the health and movement of Chinese women. | 页尾三句之三（Mission） |

---

## 4 · 设计与研发页 `design.*`

> 这一页是"设计思路优点"的主场，也是唯一能同时说服**买手**和**下单客户**的页面。四个板块按 哲学 → 数据 → 标准 → 技术 顺序递进，越往下越硬。

| Key | English | 放在哪里 |
|---|---|---|
| `design.heroH1` | How we think before we cut | 页面 H1 |
| `design.heroSub` | Our design case rests on three things: a philosophy, a dataset, and a seat at the table where the standards get written. | H1 下导语，**预告下面三段结构** |

**板块 1 · 新自然主义**

| Key | English | 放在哪里 |
|---|---|---|
| `design.s1H2` | New Naturalism | 板块 H2 |
| `design.s1Lead` | Nature · Balance · Coexistence | H2 下三词导语 |
| `design.s1Body` | New Naturalism isn't a visual style…（3 段） | 正文，配色卡/自然意象图 |

**板块 2 · 人体数据**

| Key | English | 放在哪里 |
|---|---|---|
| `design.s2H2` | 20,000 Chinese women, measured | 板块 H2 |
| `design.s2Body` | East Asian women have their own proportions…（3 段） | 正文，配 3D 人体扫描图 |

**板块 3 · 参与制定标准**

| Key | English | 放在哪里 |
|---|---|---|
| `design.s3H2` | We help write the rules | 板块 H2 |
| `design.s3Body` | Together with the Ningbo Institute of Materials Technology (CAS)…（3 段） | 正文，配院校 logo 墙 ⚠️ 见第 7 节 |

**板块 4 · 核心科技**（七格网格，每格名称 + 一句说明）

| Key | English |
|---|---|
| `design.tech1Name` / `tech1Desc` | Five-Way Support / A structural support system built for high-impact movement |
| `design.tech2Name` / `tech2Desc` | One-Way Moisture Transfer / Co-developed with the Ningbo Institute of Materials Technology, CAS |
| `design.tech3Name` / `tech3Desc` | TransThermal™ Cooling Fabric / We call it the shape-shifter of our fabric library |
| `design.tech4Name` / `tech4Desc` | Graphene / Functional material application |
| `design.tech5Name` / `tech5Desc` | Stretch Lycra / The basis of recovery and hold |
| `design.tech6Name` / `tech6Desc` | Seamless One-Piece Knit / Fewer contact points, less friction |
| `design.tech7Name` / `tech7Desc` | Recycled & Sustainable / A recycled-material system running across the range |

`design.s4H2` = **Core technology**，放在七格上方。

**板块 4 尾 · 三原则**（横排三栏）

| Key | English | 放在哪里 |
|---|---|---|
| `design.principlesH2` | Three principles behind every fabric we develop | 三栏上方 H2 |
| `design.principleSpeedTitle` / `Desc` | Speed / Instant cooling + one-way moisture transfer | 第 1 栏 |
| `design.principleDesignTitle` / `Desc` | Design / Ergonomics + contemporary Chinese aesthetics | 第 2 栏 |
| `design.principlePowerTitle` / `Desc` | Power / Exceptional resilience + water repellency | 第 3 栏 |

---

## 5 · 产品页 `products.*`

| Key | English | 放在哪里 |
|---|---|---|
| `products.heroH1` | Built for how she actually moves | 页面 H1 |
| `products.heroLead` | Technical performance and everyday wearability, in one wardrobe… | H1 下导语 |
| `products.catBra` | Sports Bras & Underwear | 品类筛选器 / 品类卡片 1 |
| `products.catTops` | Tees & Tanks | 品类 2 |
| `products.catOuter` | Outerwear | 品类 3 |
| `products.catBottoms` | Bottoms | 品类 4 |
| `products.scenariosH2` | Shop by how you move | 场景分组区 H2 |
| `products.scen1` | Yoga & Balance | 场景标签 1 |
| `products.scen2` | Running & Cardio | 场景标签 2 |
| `products.scen3` | Strength & Cross-Training | 场景标签 3 |
| `products.scen4` | Urban Everyday | 场景标签 4 |
| `products.compressionH3` | Compression | 页面下方独立小板块 H3 |
| `products.compressionBody` | Alongside our core sports underwear line… | 压缩裤线说明正文 |

> 展会陈列建议按**场景**而不是品类分组——客人问的是"跑步穿什么"，不是"你们文胸有几款"。所以 `products.scen*` 建议放在品类筛选器**上方**。

---

## 6 · 工厂页 `factory.*`（接单能力的核心页）

| Key | English | 放在哪里 |
|---|---|---|
| `factory.heroH1` | Our own floor. Our own machines. Our own standards. | 页面 H1，配车间大图 |
| `factory.heroSub` | A leading ODM manufacturer in Eastern China, with 20+ years focused on sportswear. | H1 下导语 |
| `factory.companyH2` | Company overview | 第一板块 H2 |
| `factory.companyName` | Ningbo K&A Technology Co., Ltd. | 板块内公司名 |
| `factory.companyBody` | K&A has grown into a leading ODM manufacturer in Eastern China… | 公司简介正文 |
| `factory.companyCreed` | To serve the best to the best — we help our clients excel… | 引言样式突出显示，这是他们自己的信条 |
| **`factory.foundedLabel` / `foundedValue`** | Founded / **TBC — see confirmation note** | 参数表首行 ⚠️ **上线前必须替换，见第 7 节** |
| `factory.specAreaLabel` / `specAreaValue` | Total area / 35,000 m² — No.158 Jinyuan Rd, Zhenhai Economic Zone… | 参数表第 2 行 |
| `factory.specPeopleLabel` / `specPeopleValue` | Workforce / 500+ skilled and experienced workers | 参数表第 3 行 |
| `factory.specCapacityLabel` / `specCapacityValue` | Capacity / 600,000 pcs per month | 参数表第 4 行 |
| `factory.specMachinesLabel` / `specMachinesValue` | Equipment / 1,000+ machines — 700 cut & sew, 300 seamless knitting | 参数表第 5 行 |
| `factory.capabilityH2` | What we can build for you | 第二板块 H2 |
| `factory.cutSewnTitle` / `Desc` / `Covers` | Cut & Sewn / Traditional and versatile garments… / Sports bras · Leggings · Shorts & skirts · T-shirts · Jackets | 双工艺对比区左栏 |
| `factory.seamlessTitle` / `Desc` / `Covers` | Seamless / Innovative garments knitted from a single piece… / Bra & panty sets · Tops · Bra & legging sets · Dresses & bodysuits | 双工艺对比区右栏 |
| `factory.capabilityNote` | Our range extends from sports bras and leggings through to swimwear and beachwear. | 双栏下方补充行 |
| `factory.rdH2` | Development & sourcing | 第三板块 H2 |
| `factory.rdBody1` | We run our own sourcing, development and design teams… | 研发正文第 1 段 |
| `factory.rdBody2` | Our professional service team is fluent in English… | 第 2 段（**对海外客户是强信号，别删**） |
| `factory.fabricH2` | Functional fabrics | 第四板块 H2 |
| `factory.fabricBody` | Our advanced functional fabrics are engineered to elevate… | 面料正文 |
| `factory.fabricTags` | Recycled · Bio-based / plant-based · Quick-dry · UV protection · Cooling / ice-touch | 面料标签行，建议做成 chip |
| `factory.opsH2` | How the floor runs | 第五板块 H2 |
| `factory.opsItems` | Clean & organised environment · Advanced hanging system · Professional management team · Clear quality control process | 四条打勾列表 |
| `factory.opsEquipBody` | Our production lines are fully integrated with the latest computerised sewing machines… | 设备说明段 |
| `factory.opsEfficiencyTitle` / `Desc` | High efficiency / Automated systems reduce manual labour… | 双栏左 |
| `factory.opsQualityTitle` / `Desc` | Superior quality / Precision control ensures every stitch… | 双栏右 |
| `factory.opsWarehouse` | Warehouse management — standardised process · safe protection · clean environment | 板块收尾单行 |

---

## 7 · 品质页 `quality.*`

| Key | English | 放在哪里 |
|---|---|---|
| `quality.heroH1` | Nothing leaves this building unchecked | 页面 H1 |
| `quality.processH2` | Quality control | 第一板块 H2 |
| `quality.processMultiTitle` / `Desc` | Multi-stage inspection / Every product is rigorously inspected… | 双栏左 |
| `quality.processAqlTitle` / `Desc` | AQL 2.5 / 100% pass rate before delivery. | 双栏右 |
| `quality.processGerman` | Our products are manufactured to a German quality standard system… | 双栏下方补充行 |
| `quality.braH2` | What one sports bra goes through | 第二板块 H2 —— **全站最好的一个故事模块** |
| `quality.braStat1Value` / `Label` | 35 / operations on the production line, at minimum | 三格数字区第 1 格 |
| `quality.braStat2Value` / `Label` | 400 m / of thread — roughly one lap of a standard running track | 第 2 格 |
| `quality.braStat3Value` / `Label` | 20 / soap washes at 40°C (10 for bonded styles, 20 for non-bonded)… | 第 3 格 |
| `quality.certsH2` | Certifications | 第三板块 H2 |
| `quality.cert1Name` / `Desc` | GRS — Global Recycled Standard / Ensures products are made with recycled materials… | 认证卡 1（配 logo） |
| `quality.cert2Name` / `Desc` | BSCI / Promotes ethical and responsible business practices… | 认证卡 2 |
| `quality.cert3Name` / `Desc` | OEKO-TEX® Standard 100 / Guarantees that textiles are tested for harmful substances… | 认证卡 3 |
| `quality.cert4Name` / `Desc` | HIGG Index / A tool for measuring and improving environmental and social impact… | 认证卡 4 |
| `quality.cert5Name` / `Desc` | QIMA / Provides inspection, testing and certification services… | 认证卡 5 |
| `quality.certsCommitment` | We uphold the highest standards in product safety… | 认证墙下方收尾段 |

> `quality.braStat*` 那三个数字（35 道工序 / 400 米线 / 20 次皂洗）是全站最容易被客人复述给同事听的内容。建议做成大字滚动数字，别埋在正文里。

---

## 8 · 合作页 `partner.*`（展会转化页）

| Key | English | 放在哪里 |
|---|---|---|
| `partner.heroH1` | From an idea to a shelf — we're with you the whole way | 页面 H1 |
| `partner.odmTitle` / `odmBody` | ODM / OEM Production / You have the brand and the market… | 三卡片区卡片 1 |
| `partner.odmKicker` | We don't just manufacture; we empower success. | 卡片 1 尾句，斜体或强调色 |
| `partner.brandTitle` / `brandBody` | WANDOAK Brand Partnership / A complete brand story, product range… | 卡片 2 |
| `partner.teamTitle` / `teamBody` | Team & Custom Orders / Training kit and competition uniforms… | 卡片 3 |
| `partner.processH2` | How we work together | 五步流程图上方 H2 |
| `partner.step1` … `step5` | Brief & requirements → Design & material selection → Sampling & approval → Production (AQL 2.5, fully inspected) → Delivery | 流程图五个节点 |
| `partner.clientsH2` | Who we work with | 客户板块 H2 |
| `partner.clientsBody` | We are a primary supplier to H&M China… | 客户板块正文 ⚠️ 见第 9 节 |
| `partner.formH2` | Tell us what you need | 表单区 H2 |
| `partner.formLead` | Whether you're looking for a production partner… | 表单区导语 |
| `partner.fieldCompany` | Company | 表单字段 1 label |
| `partner.fieldName` | Contact name | 字段 2 |
| `partner.fieldCountry` | Country / region | 字段 3 |
| `partner.fieldEmail` | Email | 字段 4 |
| `partner.fieldType` | Type of enquiry | 字段 5（下拉框 label） |
| `partner.fieldTypeOpt1` … `Opt4` | ODM / OEM production ｜ Brand partnership / distribution ｜ Team & custom orders ｜ Other | 下拉框四个选项 |
| `partner.fieldMessage` | Tell us about your project | 字段 6（多行文本） |
| `partner.formSuccess` | Thank you — we've received your enquiry and will reply within one business day. | 提交成功提示 |
| `partner.formError` | Something went wrong. Please email us directly at ken@chinaqs.com. | 提交失败提示 |

---

## 9 · 联系页 `contact.*`

| Key | English | 放在哪里 |
|---|---|---|
| `contact.h1` | Contact us | 页面 H1 |
| `contact.companyCn` | 宁波凯丽安科技股份有限公司 | 公司名中文行（**英文站保留中文名有用**：海外客户核对营业执照、报关抬头时要用） |
| `contact.companyEn` | Ningbo K&A Technology Co., Ltd. | 公司名英文行 |
| `contact.addressLabel` / `addressValue` | Address / No.158 Jinyuan Rd, Zhenhai Economic Developing Zone, Ningbo 315220, P.R. China | 信息表第 1 行，右侧配地图 |
| `contact.phoneLabel` / `phoneValue` | Tel / +86 574 55015959 / +86 574 55015955 | 第 2 行 |
| `contact.faxLabel` / `faxValue` | Fax / +86 574 55015933 | 第 3 行 |
| `contact.extLabel` / `extValue` | Extension / +86 574 55015959-5927 / +86 574 55015956 | 第 4 行 |
| `contact.exportLabel` / `exportValue` | Export & ODM / Ken Lee — ken@chinaqs.com · Anne Qiu — anne@chinaqs.com | 第 5 行，**海外客户最需要的一行，建议置顶加粗** |
| `contact.teamLabel` / `teamValue` | Team & custom orders / +86 138 5744 6472 (WeChat available on the same number) | 第 6 行 |
| `contact.channelsLabel` / `channelsValue` | Online / Tmall flagship store · WeChat Official Account · WeChat | 第 7 行，配二维码 |

---

## 10 · 页脚 `footer.*`

| Key | English | 放在哪里 |
|---|---|---|
| `footer.tagline` | LIVE ACTIVE · LIVE FASHION · LIVE COMFORT | 页脚顶部横幅（取自 KNA profile 封面，是他们现成的英文 tagline） |
| `footer.brandLine` | Professional · Healthy · Comfortable · Sustainable | logo 下一行 |
| `footer.craft` | Every stitch, a craft passed down. | 可选装饰句／工厂页页尾 |
| `footer.everywhere` | Movement, everywhere. | 可选装饰句／品牌页页尾 |
| `footer.creed` | To serve the best to the best. | 可选装饰句／合作页页尾 |
| `footer.colBrand` | Brand | 页脚链接列 1 标题 |
| `footer.colCapability` | Capability | 链接列 2 标题 |
| `footer.colConnect` | Connect | 链接列 3 标题 |
| `footer.copyright` | © 2026 Ningbo K&A Technology Co., Ltd. All rights reserved. | 页脚最底行 |

---

## 11 · ⚠️ 上线前必须处理的 4 处

| # | Key | 问题 | 怎么办 |
|---|---|---|---|
| 1 | `factory.foundedValue` | 值现在是 **"TBC"**。品牌手册页脚写 SINCE 1993，KNA 英文 profile 写 Founded in 2004（且 "20+ years" 与 2004 吻合） | 确认对外口径后替换。**留着 TBC 上线会很尴尬**，我故意没替你猜 |
| 2 | `about.sloganValue` | 中文原文「运动要防震，就穿 WANDOAK」直译成英文会很生硬。我改写成 **"Serious support for serious movement."**，保住了"防震/支撑"的核心但更像品牌语 | 若你要严格直译，可换成 "For impact, wear WANDOAK." —— 但我不推荐，英文母语者会觉得别扭 |
| 3 | `partner.clientsBody` | 只写了 H&M。中文材料里还提到 Versace、Stronger，**我没写进去**——代工合同通常带保密条款，公开官网点名客户有法律风险 | 确认已获授权再加；否则保持现状，或改成 "trusted by leading international brands" 这类不点名写法 |
| 4 | `design.s3Body` | 提到中科院材料所、港科大、西安工程学院三所院校 | 官网上列合作院校名，最好确认一下院校方是否同意具名。配 logo 墙尤其要注意 |

另有两个小项：
- `design.tech5Name` 写的是 **Stretch Lycra**。Lycra® 是英威达的注册商标，若产品确实使用正品莱卡，规范写法是 **LYCRA®**；若只是普通氨纶，建议改成 "Stretch Elastane" 避免商标风险。
- `design.tech3Name` 的 **TransThermal™** 我保留了 ™ 符号。请确认这个商标是否已实际注册；未注册用 ™ 通常没问题，但已注册应改 ®。

---

## 12 · 现在还缺的键（等你补料我再加）

这三组内容在你给的三份 PDF 里完全没有，但展会客人一定会问，建议尽快补上：

| 建议 Key | 内容 | 为什么重要 |
|---|---|---|
| `partner.moqLabel` / `moqValue` | 起订量 MOQ | 找工厂的客人**第一个问题**就是这个 |
| `partner.leadTimeLabel` / `leadTimeValue` | 打样交期 / 量产交期 | 第二个问题 |
| `factory.videoCaption` | 车间实景视频说明 | 30 秒产线视频胜过一页文案 |
| `partner.case1.*` | 1–2 个合作案例（可匿名，如 "A Nordic activewear brand — 45 days from sample to first delivery"） | 纯参数没有故事有说服力 |

---

*生成于 2026-08-19。所有英文文案溯源自《KNA Profile 2026 V4》《WANDOAK品牌介绍2.0》《豌豆客品牌手册2024-7-16》，无虚构事实。涉及英文表达的地方按母语习惯改写，未逐字直译。*
