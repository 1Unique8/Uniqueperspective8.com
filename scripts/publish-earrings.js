const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
const DRY_RUN = String(process.env.DRY_RUN || 'true').toLowerCase() !== 'false';
const PAIRS = [
  { sku: 'UP8-LEGACY-EAR-001', slug: 'larimar-teardrop-earrings', name: 'Larimar teardrop earrings — silver wire', price: '28', stock: 1, short: 'Finished Goods pair. 1.70 g. Silver-coloured wire, not hallmarked 925. Larimar is not a BC Free Miner stone.', description: 'Original-stock finished pair from Finished Goods (Jewelry — Earrings). Not a Vein Ledger field cobble. Not collected under FMC 292907.' },
  { sku: 'UP8-LEGACY-EAR-002', slug: 'black-glass-bead-earrings', name: 'Faceted black glass bead earrings — silver wire', price: '5', stock: 1, short: 'Finished Goods pair. 2.57 g. Glass beads. Silver-coloured wire, not 925. Not a mineral specimen.', description: 'Resale pair. Not a Vein Ledger Rock_ID. Not a Sourced Series field stone.' },
  { sku: 'UP8-LEGACY-EAR-003', slug: 'jack-o-lantern-earrings', name: 'Enamel jack-o-lantern witch-hat earrings', price: '5', stock: 1, short: 'Seasonal novelty enamel pair. 2.60 g. Not a mineral. Not FMC.', description: 'Novelty findings from Finished Goods. Do not read this as The Sourced Series.' },
  { sku: 'UP8-LEGACY-EAR-004', slug: 'snap-hoop-earrings', name: 'Silver-coloured snap hoop earrings', price: '6', stock: 1, short: 'Metal snap hoops. 2.77 g pair. Not hallmarked 925. Not a field stone.', description: 'Findings pair from Finished Goods. Not a Vein Ledger cobble.' },
  { sku: 'UP8-LEGACY-EAR-005', slug: 'skeleton-dangle-earrings', name: 'Articulated skeleton dangle earrings', price: '10', stock: 1, short: 'Seasonal novelty pair. 10.25 g. Not a mineral. Not 925.', description: 'Novelty resale pair. Not cut from a logged Rock_ID.' },
  { sku: 'UP8-LEGACY-EAR-007', slug: 'two-stone-wrap-earrings', name: 'Two-stone wrap earrings — pink + blue drops', price: '32', stock: 1, short: 'Finished Goods pair. 1.83 g. Pink + blue drops; species not confirmed for print. Wire not hallmarked 925. Not a BC Free Miner pair.', description: 'Original-stock pair. Not a Vein Ledger wrap-queue cobble unless recut and issued a new UP8-EAR Rock_ID.' }
];
function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error('Missing required env: ' + name);
  return value;
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
    description: 'Finished Goods pairs from the studio drawer. These are not Vein Ledger field cobbles unless a new UP8-EAR SKU is cut from a logged Rock_ID. Novelty pairs stay labeled as catalog. Stone pairs are still not BC Free Miner stones unless the card says so.'
  };
  if (found) {
    if (DRY_RUN) { console.log('dry-run update category earrings #' + found.id); return found; }
    const updated = await woo.put('products/categories/' + found.id, spec);
    console.log('updated category earrings #' + found.id);
    return updated.data;
  }
  if (DRY_RUN) { console.log('dry-run create category earrings parent=' + (jewelry ? jewelry.id : 0)); return { id: 'new-earrings', slug: 'earrings' }; }
  const created = await woo.post('products/categories', spec);
  console.log('created category earrings #' + created.data.id);
  return created.data;
}
async function main() {
  const woo = new WooCommerceRestApi({
    url: requiredEnv('WC_SITE_URL'),
    consumerKey: requiredEnv('WC_CONSUMER_KEY'),
    consumerSecret: requiredEnv('WC_CONSUMER_SECRET'),
    version: 'wc/v3'
  });
  console.log('Publishing Finished Goods earring pairs. dry_run=' + DRY_RUN);
  const category = await ensureCategory(woo);
  const summary = { created: 0, updated: 0, skipped: 0, failed: 0 };
  for (const pair of PAIRS) {
    const payload = {
      name: pair.name, slug: pair.slug, sku: pair.sku, type: 'simple', status: 'publish',
      regular_price: pair.price, manage_stock: true, stock_quantity: pair.stock,
      short_description: pair.short, description: pair.description,
      categories: typeof category.id === 'number' ? [{ id: category.id }] : undefined,
      meta_data: [
        { key: '_yoast_wpseo_title', value: (pair.name + ' | Earrings | Unique Perspective 8').slice(0, 60) },
        { key: '_yoast_wpseo_metadesc', value: pair.short.slice(0, 160) }
      ]
    };
    try {
      const existing = await findBySku(woo, pair.sku);
      if (DRY_RUN) { console.log((existing ? 'dry-run update ' : 'dry-run create ') + pair.sku + ' /' + pair.slug); continue; }
      if (typeof category.id !== 'number') { summary.skipped += 1; continue; }
      if (existing) {
        await woo.put('products/' + existing.id, payload);
        summary.updated += 1;
        console.log('updated ' + pair.sku + ' #' + existing.id);
      } else {
        const created = await woo.post('products', payload);
        summary.created += 1;
        console.log('created ' + pair.sku + ' #' + created.data.id);
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
