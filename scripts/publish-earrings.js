const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
const DRY_RUN = String(process.env.DRY_RUN || 'true').toLowerCase() !== 'false';
const PAIRS = [
  { sku: 'UP8-LEGACY-EAR-001', slug: 'larimar-teardrop-earrings', name: 'Larimar teardrop earrings — silver wire', price: '28', status: 'publish', stock: 1, seoTitle: 'Larimar Teardrop Earrings | Unique Perspective 8', seoDesc: 'Finished Goods larimar teardrop pair. 1.70 g. Silver-coloured wire, not 925. Not a BC Free Miner stone. One pair in stock.' },
  { sku: 'UP8-LEGACY-EAR-002', slug: 'black-glass-bead-earrings', name: 'Faceted black glass bead earrings — silver wire', price: '5', status: 'publish', stock: 1, seoTitle: 'Black Glass Bead Earrings | Unique Perspective 8', seoDesc: 'Finished Goods glass bead pair. 2.57 g. Not a mineral specimen. Not a Vein Ledger Rock_ID. One pair in stock.' },
  { sku: 'UP8-LEGACY-EAR-003', slug: 'jack-o-lantern-earrings', name: 'Enamel jack-o-lantern witch-hat earrings', price: '5', status: 'publish', stock: 1, seoTitle: 'Jack-o-Lantern Earrings | Unique Perspective 8', seoDesc: 'Seasonal enamel novelty pair. 2.60 g. Not a mineral. Not The Sourced Series. One pair in stock.' },
  { sku: 'UP8-LEGACY-EAR-004', slug: 'snap-hoop-earrings', name: 'Silver-coloured snap hoop earrings', price: '6', status: 'publish', stock: 1, seoTitle: 'Snap Hoop Earrings | Unique Perspective 8', seoDesc: 'Metal snap hoop pair. 2.77 g. Not hallmarked 925. Finished Goods findings, not a field cobble.' },
  { sku: 'UP8-LEGACY-EAR-005', slug: 'skeleton-dangle-earrings', name: 'Articulated skeleton dangle earrings', price: '10', status: 'publish', stock: 1, seoTitle: 'Skeleton Dangle Earrings | Unique Perspective 8', seoDesc: 'Seasonal novelty dangles. 10.25 g pair. Not a mineral. Not cut from a logged Rock_ID.' },
  { sku: 'UP8-LEGACY-EAR-006', slug: 'ghost-glass-bead-earrings', name: 'Ghost-in-glass bead earrings — gold-coloured hooks', price: '', status: 'draft', stock: 1, seoTitle: 'Ghost Glass Bead Earrings | Unique Perspective 8', seoDesc: 'Novelty glass ghost beads. 4.10 g pair. Price not set. Draft listing only.' },
  { sku: 'UP8-LEGACY-EAR-007', slug: 'two-stone-wrap-earrings', name: 'Two-stone wrap earrings — pink + blue drops', price: '32', status: 'publish', stock: 1, seoTitle: 'Two-Stone Wrap Earrings | Unique Perspective 8', seoDesc: 'Finished Goods wrap pair. 1.83 g. Species unconfirmed. Wire not 925. Not a BC Free Miner pair.' },
  { sku: 'UP8-LEGACY-EAR-008', slug: 'freshwater-pearl-cluster-earrings', name: 'Freshwater pearl cluster earrings — gold-coloured hooks', price: '', status: 'draft', stock: 1, seoTitle: 'Pearl Cluster Earrings | Unique Perspective 8', seoDesc: 'Freshwater pearl clusters. 6.86 g pair. Hooks not 14k. Price not set. Draft listing only.' },
  { sku: 'UP8-LEGACY-EAR-009', slug: 'star-stud-earrings', name: 'Star stud earrings — mismatched purple + black', price: '', status: 'draft', stock: 1, seoTitle: 'Star Stud Earrings | Unique Perspective 8', seoDesc: 'Mismatched fashion star studs. 1.98 g pair. Glass/CZ, not 925. Price not set. Draft listing only.' }
];
function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error('Missing required env: ' + name);
  return value;
}
function seoMeta(pair) {
  return [
    { key: '_yoast_wpseo_title', value: pair.seoTitle },
    { key: '_yoast_wpseo_metadesc', value: pair.seoDesc },
    { key: '_yoast_wpseo_focuskw', value: pair.slug.replace(/-/g, ' ') },
    { key: 'rank_math_title', value: pair.seoTitle },
    { key: 'rank_math_description', value: pair.seoDesc },
    { key: '_aioseo_title', value: pair.seoTitle },
    { key: '_aioseo_description', value: pair.seoDesc }
  ];
}
async function findBySku(woo, sku) {
  const { data } = await woo.get('products', { sku, per_page: 5 });
  return Array.isArray(data) ? data.find((row) => row.sku === sku) : null;
}
async function ensureCategory(woo) {
  const { data: existing } = await woo.get('products/categories', { slug: 'earrings', per_page: 20 });
  const found = Array.isArray(existing) ? existing.find((row) => row.slug === 'earrings') : null;
  const { data: jewelryRows } = await woo.get('products/categories', { slug: 'jewelry', per_page: 20 });
  const jewelry = Array.isArray(jewelryRows) ? jewelryRows.find((row) => row.slug === 'jewelry') : null;
  const spec = {
    name: 'Earrings',
    slug: 'earrings',
    parent: jewelry ? jewelry.id : 0,
    description: 'Finished Goods earring pairs from Unique Perspective 8. Public slugs include larimar-teardrop-earrings and two-stone-wrap-earrings. These are not Vein Ledger field cobbles unless a new UP8-EAR SKU is cut from a logged Rock_ID.'
  };
  if (!found) {
    if (DRY_RUN) return { id: 'new', slug: 'earrings' };
    const created = await woo.post('products/categories', spec);
    return created.data;
  }
  if (!DRY_RUN) await woo.put('products/categories/' + found.id, spec);
  return found;
}
async function main() {
  const woo = new WooCommerceRestApi({
    url: requiredEnv('WC_SITE_URL'),
    consumerKey: requiredEnv('WC_CONSUMER_KEY'),
    consumerSecret: requiredEnv('WC_CONSUMER_SECRET'),
    version: 'wc/v3'
  });
  const category = await ensureCategory(woo);
  const summary = { created: 0, updated: 0, failed: 0 };
  for (const pair of PAIRS) {
    const payload = {
      name: pair.name, slug: pair.slug, sku: pair.sku, type: 'simple', status: pair.status,
      short_description: pair.seoDesc, description: pair.seoDesc + ' SKU ' + pair.sku + '.',
      manage_stock: true, stock_quantity: pair.stock, meta_data: seoMeta(pair)
    };
    if (pair.price) payload.regular_price = pair.price;
    if (typeof category.id === 'number') payload.categories = [{ id: category.id }];
    try {
      const existing = await findBySku(woo, pair.sku);
      if (DRY_RUN) {
        console.log((existing ? 'dry-run update ' : 'dry-run create ') + pair.sku + ' -> /' + pair.slug + ' [' + pair.status + ']');
        continue;
      }
      if (existing) {
        await woo.put('products/' + existing.id, payload);
        summary.updated += 1;
        console.log('updated ' + pair.sku + ' #' + existing.id + ' /' + pair.slug);
      } else {
        const created = await woo.post('products', payload);
        summary.created += 1;
        console.log('created ' + pair.sku + ' #' + created.data.id + ' /' + pair.slug);
      }
    } catch (error) {
      summary.failed += 1;
      console.error('failed ' + pair.sku + ':', error.response?.data || error.message);
    }
  }
  console.log('Done', { dry_run: DRY_RUN, ...summary });
  if (summary.failed) process.exitCode = 1;
}
main().catch((error) => { console.error(error); process.exit(1); });
