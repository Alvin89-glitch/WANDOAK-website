/**
 * WANDOAK image pipeline
 * ----------------------
 * Sources live in ../../03-图片素材/. They come straight out of the three
 * source PDFs: up to 4480×6720, up to ~4MB, no colour management, 54 of them
 * originally JPEG-2000. Shipping them as-is would destroy LCP.
 *
 * This produces, per asset: sRGB, EXIF/ICC stripped, cropped to the exact
 * aspect ratio its layout slot needs, in AVIF + WebP + JPEG across a width
 * ladder, plus a 20px LQIP for the blur-up placeholder.
 *
 *   npm run images
 */
import sharp from 'sharp'
import { mkdir, writeFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')
const MATERIALS = path.resolve(ROOT, '../../03-图片素材')
const BIG = path.join(MATERIALS, '可用大图')
const SMALL = path.join(MATERIALS, '小图与图标')
const OUT = path.join(ROOT, 'public/img')

/* Aspect ratios are taken from the measured ALO geometry (see SPEC §3). */
const R = {
  // The hero *box* measures 1440×575.25 on ALO; the photograph inside it has
  // its own 1920/743 intrinsic ratio and is object-fit cover. The box is what
  // the layout must reproduce, so that is what we crop to.
  hero: 1440 / 575.25, //  2.5033  full-bleed hero band
  cta: 1300 / 445.9, //  2.9155  full-width CTA / inner hero
  square: 1, //  1.0000  mobile hero
  editorial: 642.5 / 578.25, //  1.1111  2-up editorial image
  card: 313.5 / 410, //  0.7646  4-up category card
  scenario: 224.67 / 316.78, //  0.7093  scenario tile
  tech: 272 / 408, //  0.6667  tech scroller card
}

/**
 * `top` is the fraction of the source's native height at which the crop
 * window starts. `left` and `width` (fractions, default 0 and 1) narrow the
 * window horizontally — used to lift a single garment out of a flat-lay
 * grid. `inset` trims that fraction off every edge first: several KNA slides
 * carry a white frame and drop shadow baked into the bitmap.
 * Every value was chosen by eye against the actual photograph — sharp's
 * automatic `attention` gravity put horizons through faces and left the
 * heroes as mostly sky.
 */
const ASSETS = [
  // ---- heroes -------------------------------------------------------------
  { id: 'hero-home', src: 'wandoak_p02_0.jpg', ratio: R.hero, maxW: 2600, top: 0.155, alt: { en: 'Two women running along the lakefront in WANDOAK bras', zh: '湖畔跑步，身着 WANDOAK 运动内衣' } },
  { id: 'hero-home-sq', src: 'wandoak_p02_0.jpg', ratio: R.square, maxW: 1200, top: 0.10, alt: { en: 'Two women running along the lakefront in WANDOAK bras', zh: '湖畔跑步，身着 WANDOAK 运动内衣' } },
  { id: 'hero-design', src: 'wandoak_p05_0.jpg', ratio: R.hero, maxW: 2600, top: 0.26, alt: { en: 'Sage-green WANDOAK set against open sky', zh: '晴空下的 WANDOAK 鼠尾草绿套装' } },
  { id: 'hero-design-sq', src: 'wandoak_p05_0.jpg', ratio: R.square, maxW: 1200, top: 0.16, alt: { en: 'Two women practising yoga on grass in sage-green WANDOAK sets', zh: '草地瑜伽，WANDOAK 鼠尾草绿套装' } },
  { id: 'hero-partner', src: 'kna_p13_0.jpg', ratio: R.cta, maxW: 1200, top: 0.5, alt: { en: 'The K&A production facility in Zhenhai, Ningbo', zh: '宁波镇海 K&A 厂区' } },

  // ---- editorial ----------------------------------------------------------
  { id: 'ed-who', src: 'wandoak_p11_1.jpg', ratio: R.editorial, maxW: 1400, top: 0.30, alt: { en: 'Close portrait of a model in a lilac WANDOAK bra', zh: '身着淡紫色 WANDOAK 运动内衣的模特特写' } },
  // The TransThermal slide is dense Chinese-language artwork; it reads as
  // noise at editorial size on an English page. Reserved for the R&D page.
  { id: 'ed-fit', src: 'wandoak_p14_1.jpg', ratio: R.editorial, maxW: 1200, top: 0.18, alt: { en: 'A printed WANDOAK bra and leggings in motion', zh: '印花运动内衣与紧身裤' } },
  { id: 'ed-transthermal', src: 'wandoak_p13_0.jpg', ratio: R.editorial, maxW: 1400, top: 0.5, alt: { en: 'TransThermal cooling fabric technical diagram', zh: 'TransThermal 凉感面料技术图' } },
  { id: 'ed-quality', src: 'kna_p18_0.jpg', ratio: R.editorial, maxW: 800, top: 0.30, inset: 0.04, alt: { en: 'Final inspection and folding on the finishing line', zh: '成品线上的终检与折叠' } },
  { id: 'ed-clients', src: 'kna_p03_0.jpg', ratio: R.editorial, maxW: 1400, top: 0.5, alt: { en: 'K&A sample showroom with rails of garments', zh: 'K&A 样品陈列厅' } },
  { id: 'ed-sourcing', src: 'kna_p16_1.jpg', ratio: R.editorial, maxW: 1400, top: 0.5, alt: { en: 'Fabric library racks in the K&A warehouse', zh: 'K&A 面料仓货架' } },

  // ---- category cards -----------------------------------------------------
  // The source is a 2×2 flat-lay; lifting one garment out of it fills the
  // card instead of floating four small products in white space.
  { id: 'cat-bra', src: 'wandoak_p15_5.jpg', ratio: R.card, maxW: 800, top: 0.02, height: 0.48, left: 0, width: 0.5, alt: { en: 'A WANDOAK sports bra in sage', zh: '鼠尾草绿 WANDOAK 运动内衣' } },
  { id: 'cat-bottoms', src: 'wandoak_p12_3.jpg', ratio: R.card, maxW: 900, top: 0.22, alt: { en: 'Back view of a model running in lilac top and blue leggings', zh: '淡紫上衣与蓝色紧身裤背面' } },
  { id: 'cat-tops', src: 'wandoak_p15_6.jpg', ratio: R.card, maxW: 800, top: 0.02, height: 0.48, left: 0, width: 0.5, alt: { en: 'A WANDOAK long-sleeve top in sage', zh: '鼠尾草绿 WANDOAK 长袖上衣' } },
  // Cropped to the garment, not the wearer: the only outerwear photography
  // in the source material is menswear, and this is a women's brand page.
  { id: 'cat-outer', src: 'kna_p11_6.jpg', ratio: R.card, maxW: 800, top: 0.44, height: 0.56, alt: { en: 'Quarter-zip technical outerwear, collar and seam detail', zh: '半拉链功能外套的领口与拼缝细节' } },

  // ---- scenarios ----------------------------------------------------------
  { id: 'scen-yoga', src: 'wandoak_p05_0.jpg', ratio: R.scenario, maxW: 900, top: 0.20, alt: { en: 'Yoga and balance', zh: '瑜伽 · 平衡' } },
  { id: 'scen-run', src: 'wandoak_p02_0.jpg', ratio: R.scenario, maxW: 900, top: 0.14, alt: { en: 'Running and cardio', zh: '跑步 · 有氧' } },
  { id: 'scen-strength', src: 'wandoak_p12_2.jpg', ratio: R.scenario, maxW: 900, top: 0.06, alt: { en: 'Strength and cross-training', zh: '力量训练 · 综训' } },
  { id: 'scen-urban', src: 'wandoak_p19_0.jpg', ratio: R.scenario, maxW: 900, top: 0.10, alt: { en: 'Urban everyday', zh: '城市出行' } },

  // ---- full-width CTA -----------------------------------------------------
  { id: 'cta-floor', src: 'kna_p14_4.jpg', ratio: R.cta, maxW: 1400, top: 0.5, inset: 0.035, alt: { en: 'The cut-and-sew line with its overhead hanging system', zh: '裁缝产线与吊挂系统' } },

  // ---- tech scroller ------------------------------------------------------
  { id: 'tech-1', src: 'wandoak_p14_2.jpg', ratio: R.tech, maxW: 700, top: 0.10, alt: { en: 'Five-way support construction', zh: '五向支撑结构' } },
  { id: 'tech-2', src: 'wandoak_p11_0.jpg', ratio: R.tech, maxW: 700, top: 0.12, alt: { en: 'Quick-dry jersey stretched to show the hand of the fabric', zh: '速干针织面料的手感展示' } },
  { id: 'tech-3', src: 'kna_p20_0.jpg', ratio: R.tech, maxW: 700, top: 0.06, alt: { en: 'Cooling-fabric set in a studio yoga pose', zh: '凉感面料套装' } },
  { id: 'tech-4', src: 'kna_p11_6.jpg', ratio: R.tech, maxW: 700, top: 0.44, height: 0.56, alt: { en: 'Graphene-treated technical fabric', zh: '石墨烯功能面料' } },
  { id: 'tech-5', src: 'wandoak_p12_2.jpg', ratio: R.tech, maxW: 700, top: 0.18, alt: { en: 'Stretch and recovery in compression leggings', zh: '压缩裤的弹力与回弹' } },
  { id: 'tech-6', src: 'kna_p15_0.jpg', ratio: R.tech, maxW: 700, top: 0.5, inset: 0.05, alt: { en: 'Seamless circular knitting machines', zh: '无缝针织圆机' } },
  { id: 'tech-7', src: 'kna_p16_1.jpg', ratio: R.tech, maxW: 700, top: 0.2, alt: { en: 'Recycled and bio-based fabric rolls in the library', zh: '面料仓中的再生与生物基面料' } },

  // ---- factory floor ------------------------------------------------------
  { id: 'floor-cutting', src: 'kna_p15_1.jpg', ratio: R.editorial, maxW: 1000, top: 0.5, inset: 0.05, alt: { en: 'Computerised cutting station', zh: '电脑裁床工位' } },
  { id: 'floor-line', src: 'kna_p15_3.jpg', ratio: R.editorial, maxW: 1000, top: 0.5, inset: 0.05, alt: { en: 'Sewing line with hanging system', zh: '吊挂缝制产线' } },
]

/**
 * Wordmarks. The source scans are flat ink on white, so we rebuild them as
 * transparent PNGs: the inverted luminance becomes the alpha channel and the
 * ink is repainted in a flat colour. That gives one file per ground —
 * brand green for the white nav, white for the black footer.
 */
const LOGOS = [
  {
    id: 'mark-wandoak',
    src: 'wandoak_p02_1.jpg',
    tints: { brand: '#01a04c', light: '#ffffff' },
    maxW: 640,
    alt: { en: 'WANDOAK', zh: 'WANDOAK 豌豆客' },
  },
  {
    id: 'mark-kna',
    src: 'kna_p19_11.jpg',
    tints: { parent: '#a40809', light: '#ffffff' },
    maxW: 480,
    alt: { en: 'K&A — Ningbo K&A Technology', zh: 'K&A 宁波凯丽安' },
  },
]

const LADDER = [400, 700, 1000, 1400, 2000, 2600]
const FORMATS = [
  { ext: 'avif', opts: { quality: 52, effort: 4 } },
  { ext: 'webp', opts: { quality: 76 } },
  { ext: 'jpg', opts: { quality: 80, mozjpeg: true } },
]

async function resolveSource(name, dir) {
  const primary = path.join(dir ?? BIG, name)
  if (existsSync(primary)) return primary
  const fallback = path.join(SMALL, name)
  if (existsSync(fallback)) return fallback
  throw new Error(`source not found: ${name}`)
}

async function emit(asset, { crop }) {
  const file = await resolveSource(asset.src, asset.dir)
  const meta = await sharp(file).metadata()
  const nativeW = meta.width ?? 0

  const targetW = Math.min(asset.maxW, nativeW)
  const widths = LADDER.filter((w) => w <= targetW)
  if (widths.length === 0 || widths[widths.length - 1] !== targetW) widths.push(targetW)

  // Explicit crop window. `top` is the fraction of native height the window
  // starts at, clamped so it never runs past the edge. Chosen per image by
  // eye — automatic gravity put horizons through faces.
  // The crop window is the largest rectangle of the target ratio that fits
  // inside a declared *region* of the source, anchored at the region's top
  // and centred across it.
  //   inset   trims this fraction off every edge first — several KNA slides
  //           carry a white frame and drop shadow baked into the bitmap
  //   left/width, top/height  fractions of the inset box bounding the region
  // Every value was chosen by eye against the photograph; sharp's automatic
  // `attention` gravity put horizons through faces and left heroes all sky.
  let window = null
  if (crop) {
    const nativeH = meta.height ?? 0
    const inset = asset.inset ?? 0
    const boxX = Math.round(nativeW * inset)
    const boxY = Math.round(nativeH * inset)
    const boxW = nativeW - 2 * boxX
    const boxH = nativeH - 2 * boxY

    const rx = asset.left ?? 0
    const ry = asset.top ?? 0
    const regionX = boxX + Math.round(boxW * rx)
    const regionY = boxY + Math.round(boxH * ry)
    const regionW = Math.round(boxW * (asset.width ?? 1 - rx))
    const regionH = Math.round(boxH * (asset.height ?? 1 - ry))

    const ch = Math.max(1, Math.min(regionH, Math.round(regionW / asset.ratio)))
    const cw = Math.max(1, Math.min(regionW, Math.round(ch * asset.ratio)))

    window = {
      left: Math.max(0, Math.min(regionX + Math.round((regionW - cw) / 2), nativeW - cw)),
      top: Math.max(0, Math.min(regionY, nativeH - ch)),
      width: cw,
      height: ch,
    }
  }

  const record = {
    id: asset.id,
    src: asset.src,
    source: `03-图片素材/${asset.dir === SMALL ? '小图与图标' : '可用大图'}/${asset.src}`,
    native: { w: nativeW, h: meta.height ?? 0 },
    ratio: crop ? asset.ratio : nativeW / (meta.height || 1),
    alt: asset.alt,
    widths,
    sets: {},
    lqip: '',
  }

  for (const { ext, opts } of FORMATS) {
    record.sets[ext] = []
    for (const w of widths) {
      const h = crop ? Math.round(w / asset.ratio) : null
      let pipe = sharp(file, { failOn: 'none' })
        .rotate()
        .toColourspace('srgb')
        .withMetadata({ icc: 'srgb' })

      pipe = crop
        ? pipe.extract(window).resize(w, h, { fit: 'cover' })
        : pipe.resize(w, null, { withoutEnlargement: true })

      const out = `${asset.id}-${w}.${ext}`
      await pipe[ext === 'jpg' ? 'jpeg' : ext](opts).toFile(path.join(OUT, out))
      record.sets[ext].push({ w, url: `/img/${out}` })
    }
  }

  // LQIP: 20px wide, inlined as a data URI for the blur-up placeholder.
  const lq = sharp(file, { failOn: 'none' }).rotate().toColourspace('srgb')
  const lqBuf = await (crop
    ? lq.extract(window).resize(20, Math.max(1, Math.round(20 / asset.ratio)), { fit: 'cover' })
    : lq.resize(20)
  )
    .webp({ quality: 40 })
    .toBuffer()
  record.lqip = `data:image/webp;base64,${lqBuf.toString('base64')}`

  return record
}

async function emitLogo(logo) {
  const file = path.join(SMALL, logo.src)
  if (!existsSync(file)) throw new Error(`logo source not found: ${file}`)

  // Trim the white margin, then downscale to the working width.
  const trimmed = await sharp(file)
    .toColourspace('srgb')
    .trim({ threshold: 28 })
    .resize(logo.maxW, null, { withoutEnlargement: true, fit: 'inside' })
    .toBuffer()

  // Build the coverage mask by hand. sharp's linear() works in linear-light
  // space, so a curve steep enough in 8-bit terms comes back crushed; doing
  // the arithmetic on the raw bytes is both exact and cheap at this size.
  // `b-w` is required — greyscale() alone leaves three channels, and raw()
  // would hand joinChannel an interleaved buffer three times too long.
  const { data: grey, info } = await sharp(trimmed)
    .greyscale()
    .toColourspace('b-w')
    .raw()
    .toBuffer({ resolveWithObject: true })

  if (info.channels !== 1) {
    throw new Error(`expected a 1-channel mask for ${logo.id}, got ${info.channels}`)
  }

  let darkest = 255
  for (let i = 0; i < grey.length; i += 1) if (grey[i] < darkest) darkest = grey[i]
  const span = Math.max(1, 255 - darkest)
  const TOE = 0.06 // scanner noise just off pure paper stays transparent

  const alpha = Buffer.allocUnsafe(grey.length)
  for (let i = 0; i < grey.length; i += 1) {
    const cov = (255 - grey[i]) / span
    const v = Math.round((Math.max(0, cov - TOE) / (1 - TOE)) * 255)
    alpha[i] = v > 255 ? 255 : v
  }

  const record = {
    id: logo.id,
    src: logo.src,
    source: `03-图片素材/小图与图标/${logo.src}`,
    native: { w: info.width, h: info.height },
    ratio: info.width / info.height,
    alt: logo.alt,
    tints: {},
  }

  for (const [name, hex] of Object.entries(logo.tints)) {
    const out = `${logo.id}-${name}.png`
    await sharp({
      create: { width: info.width, height: info.height, channels: 3, background: hex },
    })
      .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT, out))
    record.tints[name] = `/img/${out}`
  }

  return record
}

async function main() {
  if (!existsSync(MATERIALS)) throw new Error(`materials folder missing: ${MATERIALS}`)
  await mkdir(OUT, { recursive: true })

  const manifest = {}
  let n = 0
  for (const asset of ASSETS) {
    manifest[asset.id] = await emit(asset, { crop: true })
    n += 1
    process.stdout.write(`  ${String(n).padStart(2)}/${ASSETS.length + LOGOS.length}  ${asset.id}\n`)
  }
  for (const logo of LOGOS) {
    manifest[logo.id] = await emitLogo(logo)
    n += 1
    process.stdout.write(`  ${String(n).padStart(2)}/${ASSETS.length + LOGOS.length}  ${logo.id}\n`)
  }

  await writeFile(
    path.join(ROOT, 'src/data/images.json'),
    JSON.stringify(manifest, null, 2) + '\n',
    'utf8',
  )

  const files = await readdir(OUT)
  console.log(`\n${Object.keys(manifest).length} assets → ${files.length} files in public/img`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
