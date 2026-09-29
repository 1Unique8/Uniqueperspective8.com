const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
const DRY_RUN = String(process.env.DRY_RUN || 'true').toLowerCase() !== 'false';
const CATEGORY = {
  name: 'The Thin Veil',
  slug: 'the-thin-veil',
  description: 'October novelty pairs from the Finished Goods drawer. Jack-o-lanterns, walking bones, ghosts in glass. Not minerals. Not FMC. Not The Sourced Series. They come out when the lanterns do.'
};
const PAIRS = [
  { sku: 'UP8-LEGACY-EAR-003', slug: 'jack-o-lantern-earrings', name: 'Jack-o-lantern at the witching hour', price: '5', short: 'Enamel pumpkin-and-hat pair. 2.60 g. October novelty. Not a stone.' },
  { sku: 'UP8-LEGACY-EAR-005', slug: 'skeleton-dangle-earrings', name: 'The walking bone pair', price: '10', short: 'Articulated skeleton dangles. 10.25 g. October novelty. Not a mineral.' },
  { sku: 'UP8-LEGACY-EAR-006', slug: 'ghost-glass-bead-earrings', name: 'Ghost in the glass', price: '5', short: 'Clear glass beads with a white ghost. 4.10 g. October novelty. Price set for the lantern season.' }
];
function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error('Missing required env: ' + name);
  return value;
}
async function findCategory(woo, slug) {
  const { data } = await woo.get('products/categories', { slug, per_page: 20 });
  return Array.isArray(data) ? data.find((row) => row.slug === slug) : null;
}
async function findBySku(woo, sku) {
  const { data } = await woo.get('products', { sku, per_page: 5 });
  return Array.isArray(data) ? data.find((row) => row.sku === sku) : null;
}
async function main() {
  const woo = new WooCommerceRestApi({
    url: requiredEnv('WC_SITE_URL'),
    consumerKey: requiredEnv('WC_CONSUMER_KEY'),
    consumerSecret: requiredEnv('WC_CONSUMER_SECRET'),
    version: 'wc/v3'
  });
  let veil = await findCategory(woo, CATEGORY.slug);
  if (!veil) {
    if (DRY_RUN) { console.log('dry-run create category ' + CATEGORY.slug); veil = { id: 'new' }; }
    else {
      const created = await woo.post('products/categories', CATEGORY);
      veil = created.data;
      console.log('created category #' + veil.id, CATEGORY.slug);
    }
  } else if (!DRY_RUN) {
    await woo.put('products/categories/' + veil.id, CATEGORY);
    console.log('updated category #' + veil.id);
  }
  for (const pair of PAIRS) {
    const existing = await findBySku(woo, pair.sku);
    const payload = {
      name: pair.name, slug: pair.slug, sku: pair.sku, status: 'publish', type: 'simple',
      regular_price: pair.price, short_description: pair.short,
      description: pair.short + ' Lives in The Thin Veil, not beside the Similkameen stones.',
      catalog_visibility: 'visible',
      meta_data: [
        { key: '_yoast_wpseo_title', value: pair.name + ' | The Thin Veil' },
        { key: '_yoast_wpseo_metadesc', value: pair.short.slice(0, 160) },
        { key: 'rank_math_title', value: pair.name + ' | The Thin Veil' },
        { key: 'rank_math_description', value: pair.short }
      ]
    };
    if (typeof veil.id === 'number') payload.categories = [{ id: veil.id }];
    if (DRY_RUN) { console.log((existing ? 'dry-run update ' : 'dry-run create ') + pair.sku); continue; }
    if (!existing) {
      const created = await woo.post('products', payload);
      console.log('created ' + pair.sku + ' #' + created.data.id);
    } else {
      await woo.put('products/' + existing.id, payload);
      console.log('moved ' + pair.sku + ' #' + existing.id + ' into the-thin-veil');
    }
  }
}
main().catch((error) => { console.error(error); process.exit(1); });
