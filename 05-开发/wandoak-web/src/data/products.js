/**
 * The 2026 range, as supplied in 豌豆客图片/产品表及介绍.xls.
 *
 * Only the facts a buyer needs are here. The source sheet also carries
 * per-SKU stock counts and barcodes; neither belongs on a public page —
 * stock moves daily and would be wrong the moment it shipped, and the
 * barcodes are internal. They are deliberately not imported.
 *
 * Sizes and colour counts are locale-neutral and live here. Names,
 * descriptions, fabric composition and colour lists are copy and live in the
 * locale files under `products.styles.<code>`.
 *
 * MOQ and lead time are still missing from every style (SPEC §11 Q8) and are
 * the only fields the card still renders as pending.
 */
export const styles = [
  // ---- women's, sports bras & vests ----
  { code: 'W2002543', category: 'bra', gender: 'women', image: 'sku-W2002543', sizes: 'S–2XL', colours: 3, use: 'yoga' },
  { code: 'W2102745', category: 'bra', gender: 'women', image: 'sku-W2102745', sizes: 'S–XL', colours: 5, use: 'strength', lead: true },
  { code: 'W2102781', category: 'bra', gender: 'women', image: 'sku-W2102781', sizes: 'S–XL', colours: 2, use: 'tennis', recycled: true },
  { code: 'W2302511', category: 'bra', gender: 'women', image: 'sku-W2302511', sizes: 'S–XL', colours: 4, use: 'running' },
  { code: 'W2302719', category: 'bra', gender: 'women', image: 'sku-W2302719', sizes: 'S–XL', colours: 4, use: 'strength' },
  { code: 'W2302736', category: 'bra', gender: 'women', image: 'sku-W2302736', sizes: 'S–XL', colours: 4, use: 'running', patented: true },
  { code: 'W2302740', category: 'bra', gender: 'women', image: 'sku-W2302740', sizes: 'S–XL', colours: 3, use: 'yoga', patented: true },

  // ---- tops ----
  { code: 'W2306505', category: 'tops', gender: 'women', image: 'sku-W2306505', sizes: 'S–XL', colours: 6, use: 'marathon' },
  { code: 'W2304567', category: 'tops', gender: 'men', image: 'sku-W2304567', sizes: 'S–2XL', colours: 6, use: 'marathon' },
  { code: 'W2304570', category: 'tops', gender: 'men', image: 'sku-W2304570', sizes: 'S–XL', colours: 5, use: 'marathon' },

  // ---- bottoms ----
  { code: 'W2107742', category: 'bottoms', gender: 'women', image: 'sku-W2107742', sizes: 'S–XL', colours: 4, use: 'running' },
  { code: 'W2307555', category: 'bottoms', gender: 'men', image: 'sku-W2307555', sizes: 'S–2XL', colours: 5, use: 'marathon' },
  { code: 'W2307571', category: 'bottoms', gender: 'men', image: 'sku-W2307571', sizes: 'S–XL', colours: 3, use: 'marathon' },
  { code: 'W2307573', category: 'bottoms', gender: 'men', image: 'sku-W2307573', sizes: 'S–XL', colours: 3, use: 'marathon' },
  { code: 'W2307578', category: 'bottoms', gender: 'men', image: 'sku-W2307578', sizes: 'S–XL', colours: 4, use: 'marathon' },

  // ---- outerwear ----
  // The sheet supplies fabric and colourways for this style but no selling
  // points, so its card carries no description. `desc: false` is what the
  // component reads to leave that line out rather than print an empty one.
  { code: 'W2306738', category: 'outer', gender: 'men', image: 'sku-W2306738', sizes: 'M–2XL', colours: 2, use: 'marathon', desc: false },
]

export const stylesForCategory = (slug) => styles.filter((s) => s.category === slug)

export const styleCount = (slug) => stylesForCategory(slug).length

/* Rows on a style card. `pending` marks the two the range sheet still does
   not answer — they are the last thing standing between this page and a
   quotable spec (SPEC §11 Q8). */
export const styleSpecFields = [
  { id: 'fabric', labelKey: 'products.cat.specFabric', from: 'copy' },
  { id: 'sizes', labelKey: 'products.cat.specSizes', from: 'data' },
  { id: 'colours', labelKey: 'products.cat.specColours', from: 'copy' },
  { id: 'moq', labelKey: 'products.cat.specMoq', pending: true },
  { id: 'lead', labelKey: 'products.cat.specLead', pending: true },
]
