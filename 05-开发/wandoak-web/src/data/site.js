/**
 * Structured site content. Everything here is a *shape* — the words live in
 * the locale files and are referenced by key, so nothing needs translating
 * twice. Image ids resolve against src/data/images.json.
 */

/* ALO's desktop bar carries four primary categories. The copy deck lists
   eight pages; the variable table (§1.2) recommends condensing to five.
   Factory and Work-With-Us must never be buried — trade-show visitors
   come for exactly those two. */
export const primaryNav = [
  { name: 'products', key: 'nav.products' },
  { name: 'factory', key: 'nav.factory' },
  { name: 'partner', key: 'nav.partner' },
  { name: 'contact', key: 'nav.contact' },
]

export const allPages = [
  { name: 'home', key: 'nav.home' },
  { name: 'design', key: 'nav.design' },
  { name: 'products', key: 'nav.products' },
  { name: 'factory', key: 'nav.factory' },
  { name: 'quality', key: 'nav.quality' },
  { name: 'partner', key: 'nav.partner' },
  { name: 'contact', key: 'nav.contact' },
]

export const footerColumns = [
  { titleKey: 'footer.colBrand', links: ['design', 'products'] },
  { titleKey: 'footer.colCapability', links: ['factory', 'quality'] },
  { titleKey: 'footer.colConnect', links: ['partner', 'contact'] },
]

export const stats = [
  { valueKey: 'home.stats.areaValue', labelKey: 'home.stats.areaLabel', to: 35000, suffix: ' ㎡', prefixCount: true },
  { valueKey: 'home.stats.capacityValue', labelKey: 'home.stats.capacityLabel', to: 600000, suffix: '', prefixCount: true },
  { valueKey: 'home.stats.peopleValue', labelKey: 'home.stats.peopleLabel', to: 500, suffix: '+', prefixCount: true },
]

/* The four categories, and the only description of them. `image` is the card
   crop for a four-up, `hero` the band for the category's own page, and `to`
   is where a card click lands — the home page's four-up and the products hub
   both go to the same second-level pages. */
const category = (id, nameKey) => ({
  id,
  slug: id,
  image: `cat-${id}`,
  hero: `cat-hero-${id}`,
  nameKey,
  titleKey: `home.products.${id}Title`,
  descKey: `home.products.${id}Desc`,
  to: { name: 'productCategory', params: { category: id } },
})

export const categories = [
  category('bra', 'products.catBra'),
  category('bottoms', 'products.catBottoms'),
  category('tops', 'products.catTops'),
  category('outer', 'products.catOuter'),
]

export const categoryBySlug = (slug) => categories.find((c) => c.slug === slug) ?? null

export const scenarios = [
  { id: 'yoga', image: 'scen-yoga', labelKey: 'products.scen1' },
  { id: 'run', image: 'scen-run', labelKey: 'products.scen2' },
  { id: 'strength', image: 'scen-strength', labelKey: 'products.scen3' },
  { id: 'urban', image: 'scen-urban', labelKey: 'products.scen4' },
]

export const technologies = [
  { id: 1, image: 'tech-1', nameKey: 'design.tech1Name', descKey: 'design.tech1Desc' },
  { id: 2, image: 'tech-2', nameKey: 'design.tech2Name', descKey: 'design.tech2Desc' },
  { id: 3, image: 'tech-3', nameKey: 'design.tech3Name', descKey: 'design.tech3Desc' },
  { id: 4, image: 'tech-4', nameKey: 'design.tech4Name', descKey: 'design.tech4Desc' },
  { id: 5, image: 'tech-5', nameKey: 'design.tech5Name', descKey: 'design.tech5Desc' },
  { id: 6, image: 'tech-6', nameKey: 'design.tech6Name', descKey: 'design.tech6Desc' },
  { id: 7, image: 'tech-7', nameKey: 'design.tech7Name', descKey: 'design.tech7Desc' },
]

/* No official cert marks were supplied — rendered as type cards until they
   are (SPEC §11 Q5). Abbreviation is what a buyer scans for. */
export const certifications = [
  { id: 'grs', abbr: 'GRS', nameKey: 'quality.cert1Name', descKey: 'quality.cert1Desc' },
  { id: 'bsci', abbr: 'BSCI', nameKey: 'quality.cert2Name', descKey: 'quality.cert2Desc' },
  { id: 'oeko', abbr: 'OEKO-TEX®', nameKey: 'quality.cert3Name', descKey: 'quality.cert3Desc' },
  { id: 'higg', abbr: 'HIGG', nameKey: 'quality.cert4Name', descKey: 'quality.cert4Desc' },
  { id: 'qima', abbr: 'QIMA', nameKey: 'quality.cert5Name', descKey: 'quality.cert5Desc' },
]

export const capabilities = [
  { id: 1, titleKey: 'home.capability.item1Title', descKey: 'home.capability.item1Desc' },
  { id: 2, titleKey: 'home.capability.item2Title', descKey: 'home.capability.item2Desc' },
  { id: 3, titleKey: 'home.capability.item3Title', descKey: 'home.capability.item3Desc' },
  { id: 4, titleKey: 'home.capability.item4Title', descKey: 'home.capability.item4Desc' },
]

export const offers = [
  { id: 'odm', titleKey: 'partner.odmTitle', bodyKey: 'partner.odmBody', kickerKey: 'partner.odmKicker' },
  { id: 'brand', titleKey: 'partner.brandTitle', bodyKey: 'partner.brandBody' },
  { id: 'team', titleKey: 'partner.teamTitle', bodyKey: 'partner.teamBody' },
]

/* Numbered because the content genuinely is a sequence — a buyer reads this
   to learn what happens in what order. */
export const processSteps = [
  { n: 1, key: 'partner.step1' },
  { n: 2, key: 'partner.step2' },
  { n: 3, key: 'partner.step3' },
  { n: 4, key: 'partner.step4' },
  { n: 5, key: 'partner.step5' },
]

export const enquiryTypes = [
  'partner.fieldTypeOpt1',
  'partner.fieldTypeOpt2',
  'partner.fieldTypeOpt3',
  'partner.fieldTypeOpt4',
]

/* Which built pages a skeleton page should point visitors at. */
export const skeletonFallbacks = ['home', 'partner', 'contact']

/* ---------------- factory page ---------------- */

/* The five numbers a sourcing buyer actually writes down. StatsBar animates
   three of them on the home page; this is the full sheet, address included,
   so the factory page says something the home page cannot. */
export const factorySpecs = [
  { id: 'area', labelKey: 'factory.specAreaLabel', valueKey: 'factory.specAreaValue' },
  { id: 'people', labelKey: 'factory.specPeopleLabel', valueKey: 'factory.specPeopleValue' },
  { id: 'capacity', labelKey: 'factory.specCapacityLabel', valueKey: 'factory.specCapacityValue' },
  { id: 'machines', labelKey: 'factory.specMachinesLabel', valueKey: 'factory.specMachinesValue' },
  { id: 'founded', labelKey: 'factory.foundedLabel', valueKey: 'factory.foundedValue' },
]

/* The two construction methods, each shown by the machines that make it. */
export const makeMethods = [
  { id: 'cutsew', image: 'cap-cutsew', titleKey: 'factory.cutSewnTitle', descKey: 'factory.cutSewnDesc', coversKey: 'factory.cutSewnCovers' },
  { id: 'seamless', image: 'cap-seamless', titleKey: 'factory.seamlessTitle', descKey: 'factory.seamlessDesc', coversKey: 'factory.seamlessCovers' },
]

/* Read left to right in process order: cut → set → sort → finish. */
export const floorStations = [
  { id: 'cut', image: 'fac-cut', labelKey: 'factory.stationCut' },
  { id: 'setting', image: 'fac-setting', labelKey: 'factory.stationSetting' },
  { id: 'warehouse', image: 'fac-warehouse', labelKey: 'factory.stationWarehouse' },
  { id: 'finishing', image: 'fac-finishing', labelKey: 'factory.stationFinishing' },
]

export const floorPillars = [
  { id: 'efficiency', titleKey: 'factory.opsEfficiencyTitle', descKey: 'factory.opsEfficiencyDesc' },
  { id: 'quality', titleKey: 'factory.opsQualityTitle', descKey: 'factory.opsQualityDesc' },
]

/* ---------------- products page ---------------- */

/* Five studio cut-outs, ordered light to dark so the row reads as a range
   rather than five unrelated photographs. */
export const productLine = [
  { id: 'tee', image: 'pl-tee', titleKey: 'products.line.teeTitle', descKey: 'products.line.teeDesc' },
  { id: 'sage', image: 'pl-sage', titleKey: 'products.line.sageTitle', descKey: 'products.line.sageDesc' },
  { id: 'short', image: 'pl-short', titleKey: 'products.line.shortTitle', descKey: 'products.line.shortDesc' },
  { id: 'crop', image: 'pl-crop', titleKey: 'products.line.cropTitle', descKey: 'products.line.cropDesc' },
  { id: 'black', image: 'pl-black', titleKey: 'products.line.blackTitle', descKey: 'products.line.blackDesc' },
]

/* ---------------- product categories (second level) ---------------- */

