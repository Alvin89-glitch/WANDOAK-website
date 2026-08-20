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
  { name: 'about', key: 'nav.about' },
  { name: 'products', key: 'nav.products' },
  { name: 'factory', key: 'nav.factory' },
  { name: 'partner', key: 'nav.partner' },
  { name: 'contact', key: 'nav.contact' },
]

export const allPages = [
  { name: 'home', key: 'nav.home' },
  { name: 'about', key: 'nav.about' },
  { name: 'design', key: 'nav.design' },
  { name: 'products', key: 'nav.products' },
  { name: 'factory', key: 'nav.factory' },
  { name: 'quality', key: 'nav.quality' },
  { name: 'partner', key: 'nav.partner' },
  { name: 'contact', key: 'nav.contact' },
]

export const footerColumns = [
  { titleKey: 'footer.colBrand', links: ['about', 'design', 'products'] },
  { titleKey: 'footer.colCapability', links: ['factory', 'quality'] },
  { titleKey: 'footer.colConnect', links: ['partner', 'contact'] },
]

export const stats = [
  { valueKey: 'home.stats.areaValue', labelKey: 'home.stats.areaLabel', to: 35000, suffix: ' ㎡', prefixCount: true },
  { valueKey: 'home.stats.capacityValue', labelKey: 'home.stats.capacityLabel', to: 600000, suffix: '', prefixCount: true },
  { valueKey: 'home.stats.peopleValue', labelKey: 'home.stats.peopleLabel', to: 500, suffix: '+', prefixCount: true },
]

export const categories = [
  { id: 'bra', image: 'cat-bra', titleKey: 'home.products.braTitle', descKey: 'home.products.braDesc' },
  { id: 'bottoms', image: 'cat-bottoms', titleKey: 'home.products.bottomsTitle', descKey: 'home.products.bottomsDesc' },
  { id: 'tops', image: 'cat-tops', titleKey: 'home.products.topsTitle', descKey: 'home.products.topsDesc' },
  { id: 'outer', image: 'cat-outer', titleKey: 'home.products.outerTitle', descKey: 'home.products.outerDesc' },
]

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
