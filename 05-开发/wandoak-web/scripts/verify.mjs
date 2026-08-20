/**
 * Acceptance harness — SPEC §9, A1 … A15.
 *
 * A1–A9 are transcribed from the `acceptance` array of
 * 04-参考-ALO官网结构拆解/alo-spec.edited.json, so "did we copy the layout
 * correctly" gets an objective answer instead of an opinion.
 *
 *   node scripts/verify.mjs [baseUrl]
 */
import { chromium, devices } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = process.argv[2] || 'http://localhost:5178'
const HERE = path.dirname(fileURLToPath(import.meta.url))
const SHOTS = path.resolve(HERE, '../qa/shots')

const ROUTES = ['/', '/partner', '/about', '/design', '/products', '/factory', '/quality', '/contact']
const WIDTHS = [390, 768, 1024, 1440, 1920]

const results = []
const record = (id, label, pass, detail) => {
  results.push({ id, label, pass, detail })
  const mark = pass === true ? 'PASS' : pass === false ? 'FAIL' : 'INFO'
  console.log(`${mark.padEnd(4)}  ${id.padEnd(4)} ${label}${detail ? ` — ${detail}` : ''}`)
}

const near = (a, b, tol = 0.75) => Math.abs(a - b) <= tol

const parseRgb = (css) => {
  const m = css.match(/rgba?\(([^)]+)\)/)
  if (!m) return [0, 0, 0]
  const [r, g, b] = m[1].split(',').map((v) => parseFloat(v))
  return [r, g, b]
}

const relLum = ([r, g, b]) => {
  const f = (c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

const contrastRatio = (a, b) => {
  const [hi, lo] = [relLum(a), relLum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/**
 * The worst-case ground behind light type is the *brightest* patch of the
 * photograph under it, so take the 90th-percentile luminance rather than the
 * mean — an average would hide a blown-out corner of sky.
 */
async function brightestGround(png) {
  const sharp = (await import('sharp')).default
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true })
  const n = info.channels
  const px = []
  for (let i = 0; i < data.length; i += n) px.push([data[i], data[i + 1], data[i + 2]])
  px.sort((a, b) => relLum(b) - relLum(a))
  return px[Math.min(Math.floor(px.length * 0.1), px.length - 1)]
}

async function settle(page) {
  // Step down the page rather than jumping to the bottom. Lazy images need
  // the scroll to load, and IntersectionObserver samples at frame
  // boundaries — a single jump can skip whole sections, leaving their
  // reveal transform applied and every measured gap off by 16px.
  await page.evaluate(async () => {
    const frame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 70)))
    const vh = window.innerHeight
    let y = 0
    for (let i = 0; i < 200; i += 1) {
      window.scrollTo(0, y)
      await frame()
      if (y >= document.documentElement.scrollHeight - vh) break
      y += vh * 0.6
    }
    window.scrollTo(0, 0)
    await frame()
  })
  await page.waitForLoadState('networkidle').catch(() => {})
  await settleReveals(page)
  await settleCounters(page)
}

/**
 * StatsBar counts up to its figure over 1.2s. Screenshotting mid-count would
 * publish a plausible but wrong factory size, so wait for the numbers to
 * land before measuring or capturing anything.
 */
async function settleCounters(page) {
  await page.waitForFunction(
    () => {
      const vals = [...document.querySelectorAll('.stats__value')].map((e) => e.textContent.trim())
      if (!vals.length) return true
      return vals.some((v) => /35[,，]?000/.test(v)) && vals.some((v) => /600[,，]?000/.test(v))
    },
    null,
    { timeout: 8000 },
  ).catch(() => {})
}

/**
 * Reveal-on-scroll offsets elements by 16px until its transition completes.
 * Measuring mid-flight turns a 70px gap into 54 or 86, so wait until every
 * .reveal has landed before taking any geometry.
 */
async function settleReveals(page) {
  await page.waitForFunction(
    () => {
      const els = [...document.querySelectorAll('.reveal')]
      if (!els.length) return true
      return els.every((e) => {
        const cs = getComputedStyle(e)
        return e.classList.contains('is-in') && (cs.transform === 'none' || cs.transform === 'matrix(1, 0, 0, 1, 0, 0)')
      })
    },
    null,
    { timeout: 8000 },
  ).catch(() => {})
}

async function main() {
  await mkdir(SHOTS, { recursive: true })
  const browser = await chromium.launch()

  // ---------------------------------------------------------------- console
  const consoleErrors = []
  const failedRequests = []

  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(`${page.url()} :: ${m.text()}`)
  })
  page.on('requestfailed', (r) => failedRequests.push(`${r.url()} :: ${r.failure()?.errorText}`))
  page.on('response', (r) => {
    if (r.status() >= 400) failedRequests.push(`${r.url()} :: HTTP ${r.status()}`)
  })

  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  await settle(page)

  const stuck = await page.evaluate(
    () => [...document.querySelectorAll('.reveal')].filter((e) => !e.classList.contains('is-in')).length,
  )
  record('A2a', 'every reveal fired after a full scroll', stuck === 0, `${stuck} sections never revealed`)

  // ---------------------------------------------------------------- A1
  const containerW = await page.evaluate(() => {
    const el = document.querySelector('.container-a')
    if (!el) return null
    const cs = getComputedStyle(el)
    return el.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
  })
  record('A1', 'container-a content width = 1350', near(containerW, 1350), `${containerW?.toFixed(2)}px`)

  // ---------------------------------------------------------------- A2
  const gaps = await page.evaluate(() => {
    const secs = [...document.querySelectorAll('main .section')]
    const out = []
    for (let i = 1; i < secs.length; i += 1) {
      const prev = secs[i - 1].getBoundingClientRect()
      const cur = secs[i].getBoundingClientRect()
      out.push(Math.round((cur.top - prev.bottom) * 100) / 100)
    }
    return out
  })
  const gapsOk = gaps.length > 0 && gaps.every((g) => near(g, 70, 1))
  record('A2', 'section rhythm = 70.00px', gapsOk, `${gaps.length} gaps: ${[...new Set(gaps)].join(', ')}`)

  // ---------------------------------------------------------------- A3
  const grid = await page.evaluate(() => {
    const ul = document.querySelector('.cards .grid-4')
    if (!ul) return null
    const cards = [...ul.children].map((li) => li.getBoundingClientRect())
    if (cards.length < 4) return null
    return {
      w: Math.round(cards[0].width * 100) / 100,
      gap: Math.round((cards[1].left - cards[0].right) * 100) / 100,
      total: Math.round((cards[3].right - cards[0].left) * 100) / 100,
    }
  })
  record(
    'A3',
    '4-up = 313.5 wide, 32 gap, 1350 total',
    grid && near(grid.w, 313.5) && near(grid.gap, 32) && near(grid.total, 1350),
    grid ? `w ${grid.w} · gap ${grid.gap} · total ${grid.total}` : 'grid not found',
  )

  // ---------------------------------------------------------------- A4
  const nav = await page.evaluate(() => {
    const el = document.querySelector('header.nav')
    if (!el) return null
    const cs = getComputedStyle(el)
    return {
      h: Math.round(el.getBoundingClientRect().height * 100) / 100,
      position: cs.position,
      top: cs.top,
      z: cs.zIndex,
      bg: cs.backgroundColor,
    }
  })
  record(
    'A4',
    'nav sticky top:0 z:200 h=83.5 white',
    nav && near(nav.h, 83.5) && nav.position === 'sticky' && nav.top === '0px' &&
      nav.z === '200' && nav.bg === 'rgb(255, 255, 255)',
    nav ? `${nav.h}px · ${nav.position} · top ${nav.top} · z ${nav.z} · ${nav.bg}` : 'nav not found',
  )

  // ---------------------------------------------------------------- A5
  const hero = await page.evaluate(() => {
    const el = document.querySelector('.hero .hero__media--wide .pic')
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100 }
  })
  record(
    'A5',
    'hero full-bleed 1440 × 575.25',
    hero && near(hero.w, 1440) && near(hero.h, 575.25, 1.5),
    hero ? `${hero.w} × ${hero.h}` : 'hero not found',
  )

  // ---------------------------------------------------------------- A6
  const foot = await page.evaluate(() => {
    const el = document.querySelector('footer.foot')
    if (!el) return null
    const cs = getComputedStyle(el)
    return { bg: cs.backgroundColor, pt: cs.paddingTop, pb: cs.paddingBottom }
  })
  record(
    'A6',
    'footer #000, pad-top 28 / pad-bottom 64',
    foot && foot.bg === 'rgb(0, 0, 0)' && foot.pt === '28px' && foot.pb === '64px',
    foot ? `${foot.bg} · ${foot.pt} / ${foot.pb}` : 'footer not found',
  )

  // ---------------------------------------------------------------- A7
    // SPEC §2.4: six ALO sizes plus one named display step-down (--t-dsm).
  const ALLOWED = new Set([60, 44, 32, 18, 16, 14, 12])
  const sizes = await page.evaluate(() => {
    const seen = new Map()
    const walk = (node) => {
      if (node.nodeType === 3) {
        if (!node.textContent.trim()) return
        const el = node.parentElement
        if (!el) return
        const fs = Math.round(parseFloat(getComputedStyle(el).fontSize) * 100) / 100
        const tag = `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}`
        if (!seen.has(fs)) seen.set(fs, tag)
        return
      }
      for (const c of node.childNodes) walk(c)
    }
    walk(document.body)
    return [...seen.entries()].map(([size, where]) => ({ size, where })).sort((a, b) => b.size - a.size)
  })
  const strays = sizes.filter((s) => !ALLOWED.has(s.size))
  record(
    'A7',
    'font sizes confined to the scale',
    strays.length === 0,
    strays.length ? strays.map((s) => `${s.size}px @ ${s.where}`).join(' · ') : sizes.map((s) => s.size).join('/'),
  )

  // ---------------------------------------------------------------- A9
  const overflow = []
  for (const w of [320, 375, 390, 576, 768, 992, 1200, 1440, 1920]) {
    await page.setViewportSize({ width: w, height: 900 })
    await page.waitForTimeout(120)
    const bad = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }))
    if (bad.sw > bad.cw + 1) overflow.push(`${w}px → scrollWidth ${bad.sw} > ${bad.cw}`)
  }
  record('A9', 'no horizontal scroll 320–1920', overflow.length === 0, overflow.join(' · ') || 'clean at 9 widths')

  // ---------------------------------------------------------------- A8 (mobile)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(200)
  const mob = await page.evaluate(() => {
    const nav = document.querySelector('header.nav')
    const sq = document.querySelector('.hero .hero__media--sq .pic')
    const wide = document.querySelector('.hero .hero__media--wide')
    return {
      navH: nav ? Math.round(nav.getBoundingClientRect().height * 100) / 100 : null,
      sq: sq ? { w: Math.round(sq.getBoundingClientRect().width), h: Math.round(sq.getBoundingClientRect().height) } : null,
      wideHidden: wide ? getComputedStyle(wide).display === 'none' : null,
    }
  })
  record(
    'A8',
    'mobile: nav 57px, hero 1:1',
    mob.navH !== null && near(mob.navH, 57, 1) && mob.wideHidden === true && mob.sq && near(mob.sq.w, mob.sq.h, 2),
    `nav ${mob.navH}px · hero ${mob.sq?.w}×${mob.sq?.h} · wide hidden ${mob.wideHidden}`,
  )

  // ---------------------------------------------------------------- A18
  // Overlay captions must never spill above their own section — at narrow
  // widths a tall caption slides under the sticky nav and loses its first line.
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(250)
  await settleReveals(page)
  const spill = await page.evaluate(() =>
    [...document.querySelectorAll('.hero, .cta__frame, .ih__frame')].map((sec) => {
      const cap = sec.querySelector('.hero__caption, .cta__inner, .ih__inner')
      if (!cap) return 0
      return Math.round(sec.getBoundingClientRect().top - cap.getBoundingClientRect().top)
    }),
  )
  record('A18', 'no overlay caption spills above its section', spill.every((v) => v <= 0), `overflow px: ${spill.join(', ')}`)

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.waitForTimeout(200)

  // ---------------------------------------------------------------- A13
  await page.setViewportSize({ width: 1440, height: 900 })
  await settle(page)
  const imgAudit = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')]
    return {
      total: imgs.length,
      noDim: imgs.filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).length,
      noAlt: imgs.filter((i) => i.getAttribute('alt') === null).length,
      broken: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
      heroPriority: document.querySelector('.hero img')?.getAttribute('fetchpriority') ?? null,
    }
  })
  record(
    'A13',
    'images: dimensions, alt, hero priority',
    imgAudit.noDim === 0 && imgAudit.noAlt === 0 && imgAudit.broken === 0 && imgAudit.heroPriority === 'high',
    `${imgAudit.total} imgs · missing dims ${imgAudit.noDim} · missing alt ${imgAudit.noAlt} · broken ${imgAudit.broken} · hero fetchpriority ${imgAudit.heroPriority}`,
  )

  // ---------------------------------------------------------------- A17
  const finalStats = await page.evaluate(() =>
    [...document.querySelectorAll('.stats__value')].map((e) => e.textContent.trim()),
  )
  record(
    'A17',
    'stat figures settle on the exact published values',
    finalStats.join('|') === '35,000 m²|600,000 pcs|500+',
    finalStats.join(' · ') || 'no stats found',
  )

  // ---------------------------------------------------------------- A16
  // Text-over-image contrast. Sample the composited pixels behind each
  // overlay headline from a screenshot rather than trusting the CSS: the
  // scrim, the photograph and the type all contribute.
  const overlayTargets = [
    { sel: '.hero .hero__title', name: 'hero h1' },
    { sel: '.hero .hero__sub', name: 'hero sub' },
    { sel: '.cta__title', name: 'cta display' },
    { sel: '.cta__lead', name: 'cta lead' },
  ]
  const contrastRows = []
  for (const target of overlayTargets) {
    // Hide the glyphs and photograph what is behind them. Sampling the text
    // in place would just measure white against white.
    const box = await page.evaluate((sel) => {
      const el = document.querySelector(sel)
      if (!el) return null
      el.scrollIntoView({ block: 'center' })
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      el.dataset.qaHidden = '1'
      el.style.visibility = 'hidden'
      return { x: r.x, y: r.y, w: r.width, h: r.height, color: cs.color }
    }, target.sel)

    if (!box || box.w < 2 || box.h < 2) {
      contrastRows.push({ ...target, ratio: null, note: 'not found' })
      continue
    }

    await page.waitForTimeout(220)
    const shot = await page.screenshot({
      clip: {
        x: Math.max(0, Math.round(box.x)),
        y: Math.max(0, Math.round(box.y)),
        width: Math.max(2, Math.min(Math.round(box.w), 1400)),
        height: Math.max(2, Math.min(Math.round(box.h), 400)),
      },
    })

    await page.evaluate((sel) => {
      const el = document.querySelector(sel)
      if (el) {
        el.style.visibility = ''
        delete el.dataset.qaHidden
      }
    }, target.sel)

    const ground = await brightestGround(shot)
    const fg = parseRgb(box.color)
    const ratio = contrastRatio(fg, ground)
    contrastRows.push({ ...target, ratio, note: `fg ${box.color} vs worst ground rgb(${ground.join(',')})` })
  }

  const worst = contrastRows.filter((r) => r.ratio !== null).sort((a, b) => a.ratio - b.ratio)[0]
  record(
    'A16',
    'overlay text contrast >= 4.5:1',
    contrastRows.every((r) => r.ratio !== null && r.ratio >= 4.5),
    contrastRows.map((r) => `${r.name} ${r.ratio ? r.ratio.toFixed(2) : '?'}:1`).join(' · ') +
      (worst ? ` — worst ${worst.name}, ${worst.note}` : ''),
  )

  // ---------------------------------------------------------------- A10 (locale swap)
  const beforeH = await page.evaluate(() => document.documentElement.scrollHeight)
  await page.click('.nav__lang')
  await page.waitForTimeout(700)
  await settle(page)
  const afterLang = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    h: document.documentElement.scrollHeight,
    heroHasCjk: /[一-鿿]/.test(document.querySelector('.hero__title')?.textContent ?? ''),
  }))
  const drift = Math.abs(afterLang.h - beforeH) / beforeH
  record(
    'A10',
    'locale switch: lang attr, copy swaps, height stable',
    afterLang.lang === 'zh-CN' && afterLang.heroHasCjk && drift < 0.08,
    `lang=${afterLang.lang} · cjk=${afterLang.heroHasCjk} · height ${beforeH}→${afterLang.h} (${(drift * 100).toFixed(1)}%)`,
  )
  await page.click('.nav__lang')
  await page.waitForTimeout(500)

  // ---------------------------------------------------------------- doc height
  await settle(page)
  const docH = await page.evaluate(() => document.documentElement.scrollHeight)
  record('D1', 'document height (ALO reference 6435px)', null, `${docH}px`)

  // ---------------------------------------------------------------- routes
  const routeIssues = []
  for (const r of ROUTES) {
    await page.goto(`${BASE}${r}`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(350)
    const ok = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      title: document.title,
      main: !!document.querySelector('#main'),
    }))
    if (!ok.main || ok.h1 === 0 || !ok.title) routeIssues.push(`${r} → h1:${ok.h1} title:"${ok.title}"`)
  }
  await page.goto(`${BASE}/no-such-page`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(300)
  const nf = await page.evaluate(() => document.body.textContent.includes('404'))
  record('R1', `${ROUTES.length} routes render + 404 fallback`, routeIssues.length === 0 && nf, routeIssues.join(' · ') || `all ok · 404 ${nf}`)

  // ---------------------------------------------------------------- A15 (form)
  await page.goto(`${BASE}/partner`, { waitUntil: 'domcontentloaded' })
  await settle(page)
  await page.locator('form button[type="submit"]').click()
  await page.waitForTimeout(250)
  const errCount = await page.locator('.field__err').count()
  record('A15', 'empty submit blocks with field errors', errCount >= 4, `${errCount} field errors shown`)

  await page.fill('input[name="company"]', 'Nordic Activewear AB')
  await page.fill('input[name="name"]', 'Test Buyer')
  await page.fill('input[name="email"]', 'not-an-email')
  await page.locator('input[name="email"]').blur()
  await page.waitForTimeout(200)
  const emailErr = await page.locator('.field__err').filter({ hasText: /valid|有效/ }).count()
  record('A15b', 'invalid email is rejected', emailErr === 1, `${emailErr} email error`)

  // ---------------------------------------------------------------- A14 (reduced motion)
  const rmCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  const rmPage = await rmCtx.newPage()
  await rmPage.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  await rmPage.waitForTimeout(600)
  const rm = await rmPage.evaluate(() => {
    const els = [...document.querySelectorAll('.reveal')]
    return {
      count: els.length,
      hidden: els.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length,
      statValue: document.querySelector('.stats__value')?.textContent?.trim() ?? '',
    }
  })
  record(
    'A14',
    'prefers-reduced-motion: reveals resolved, counters final',
    rm.hidden === 0 && /35,000/.test(rm.statValue),
    `${rm.count} reveal nodes · ${rm.hidden} still faded · stat "${rm.statValue}"`,
  )
  await rmCtx.close()

  // ---------------------------------------------------------------- A12
  record('A12', 'console errors / failed requests', consoleErrors.length === 0 && failedRequests.length === 0,
    `${consoleErrors.length} console errors, ${failedRequests.length} failed requests` +
      (consoleErrors[0] ? ` — e.g. ${consoleErrors[0].slice(0, 160)}` : '') +
      (failedRequests[0] ? ` — e.g. ${failedRequests[0].slice(0, 160)}` : ''))

  // ---------------------------------------------------------------- screenshots
  for (const w of WIDTHS) {
    const sctx = await browser.newContext({
      viewport: { width: w, height: w < 500 ? 844 : 900 },
      deviceScaleFactor: 1,
      ...(w < 500 ? devices['iPhone 13'].userAgent ? { userAgent: devices['iPhone 13'].userAgent } : {} : {}),
    })
    const sp = await sctx.newPage()
    for (const [name, route] of [['home', '/'], ['partner', '/partner']]) {
      await sp.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' })
      await settle(sp)
      await sp.screenshot({ path: path.join(SHOTS, `${name}-${w}.png`), fullPage: true })
    }
    await sctx.close()
  }
  console.log(`\nscreenshots → qa/shots/{home,partner}-{${WIDTHS.join(',')}}.png`)

  await browser.close()

  // ---------------------------------------------------------------- report
  const fails = results.filter((r) => r.pass === false)
  await writeFile(
    path.resolve(HERE, '../qa/report.json'),
    JSON.stringify({ base: BASE, when: null, results }, null, 2) + '\n',
    'utf8',
  )
  console.log(`\n${results.filter((r) => r.pass === true).length} pass · ${fails.length} fail · ${results.filter((r) => r.pass === null).length} info`)
  if (fails.length) {
    console.log('\nFAILURES')
    for (const f of fails) console.log(`  ${f.id} ${f.label} — ${f.detail}`)
  }
  process.exitCode = fails.length ? 1 : 0
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
