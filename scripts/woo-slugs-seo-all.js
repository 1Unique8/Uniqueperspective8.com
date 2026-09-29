const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
const DRY_RUN = String(process.env.DRY_RUN || 'true').toLowerCase() !== 'false';
const EAR_DRAFT = new Set(['UP8-LEGACY-EAR-003', 'UP8-LEGACY-EAR-005', 'UP8-LEGACY-EAR-006']);
const STUDIO_SLUGS = new Set(['agate-pendant', 'agate-small-specimen', 'cricut-kit', 'perspective-audit-snapshot', 'perspective-audit-bundle']);
const EAR_CATALOG = 'https://shop.uniqueperspective8.com/product-category/earrings/';
function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error('Missing required env: ' + name);
  return value;
}
function slugify(text) {
  return String(text || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48).replace(/-+$/g, '');
}
function aisle(product) {
  const slugs = (product.categories || []).map((row) => row.slug);
  if (slugs.includes('earrings') || String(product.sku || '').includes('EAR')) return 'earrings';
  if (STUDIO_SLUGS.has(product.slug) || slugs.includes('sourced-series')) return 'sourced-series';
  if (slugs.includes('perspective-audit')) return 'perspective-audit';
  if (slugs.includes('field-studio-kits')) return 'field-studio-kits';
  if (slugs.includes('jewelry')) return 'jewelry';
  if (slugs.includes('candles')) return 'candles';
  if (slugs.includes('home-textiles')) return 'home-textiles';
  return slugs[0] || 'catalog';
}
function wantedSlug(product) {
  if (STUDIO_SLUGS.has(product.slug)) return product.slug;
  const ear = {
    'UP8-LEGACY-EAR-001': 'larimar-teardrop-earrings',
    'UP8-LEGACY-EAR-002': 'black-glass-bead-earrings',
    'UP8-LEGACY-EAR-003': 'jack-o-lantern-earrings',
    'UP8-LEGACY-EAR-004': 'snap-hoop-earrings',
    'UP8-LEGACY-EAR-005': 'skeleton-dangle-earrings',
    'UP8-LEGACY-EAR-006': 'ghost-glass-bead-earrings',
    'UP8-LEGACY-EAR-007': 'two-stone-wrap-earrings',
    'UP8-LEGACY-EAR-008': 'freshwater-pearl-cluster-earrings',
    'UP8-LEGACY-EAR-009': 'star-stud-earrings'
  };
  if (ear[product.sku]) return ear[product.sku];
  const current = product.slug || '';
  if (current.length <= 42 && !current.startsWith('nneags-')) return current;
  return slugify(product.name) || current;
}
function seoFor(product, cat) {
  const name = (product.name || '').replace(/\s+/g, ' ').trim();
  if (cat === 'earrings') {
    return { title: 'Earrings Catalog | Unique Perspective 8', desc: (name + ' is listed in the Unique Perspective 8 earrings catalog. Finished Goods pair, not a Vein Ledger cobble.').slice(0, 160) };
  }
  if (cat === 'sourced-series' || cat === 'perspective-audit' || cat === 'field-studio-kits') {
    return { title: (name + ' | Unique Perspective 8').slice(0, 60), desc: (name + ' is a Unique Perspective 8 studio listing. Origin stays with the object.').slice(0, 160) };
  }
  return { title: (name + ' | Catalog | Unique Perspective 8').slice(0, 60), desc: (name + ' is a catalog item at Unique Perspective 8. Not a field-collected Sourced Series stone.').slice(0, 160) };
}
function meta(product, seo, cat) {
  const rows = [
    { key: '_yoast_wpseo_title', value: seo.title },
    { key: '_yoast_wpseo_metadesc', value: seo.desc },
    { key: 'rank_math_title', value: seo.title },
    { key: 'rank_math_description', value: seo.desc },
    { key: '_aioseo_title', value: seo.title },
    { key: '_aioseo_description', value: seo.desc }
  ];
  if (cat === 'earrings') {
    rows.push(
      { key: '_yoast_wpseo_canonical', value: EAR_CATALOG },
      { key: '_yoast_wpseo_meta-robots-noindex', value: '1' },
      { key: 'rank_math_canonical_url', value: EAR_CATALOG },
      { key: 'rank_math_robots', value: ['noindex'] }
    );
  }
  return rows;
}
async function listAll(woo, endpoint) {
  const rows = [];
  let page = 1;
  while (true) {
    const { data } = await woo.get(endpoint, { per_page: 100, page });
    if (!Array.isArray(data) || data.length === 0) break;
    rows.push(...data);
    if (data.length < 100) break;
    page += 1;
  }
  return rows;
}
async function main() {
  const woo = new WooCommerceRestApi({
    url: requiredEnv('WC_SITE_URL'),
    consumerKey: requiredEnv('WC_CONSUMER_KEY'),
    consumerSecret: requiredEnv('WC_CONSUMER_SECRET'),
    version: 'wc/v3'
  });
  const products = await listAll(woo, 'products');
  const summary = { updated: 0, drafted: 0, published: 0, failed: 0 };
  for (const product of products) {
    const cat = aisle(product);
    const slug = wantedSlug(product);
    const seo = seoFor(product, cat);
    const payload = {
      slug,
      short_description: product.short_description || seo.desc,
      meta_data: meta(product, seo, cat)
    };
    if (String(product.sku || '').startsWith('UP8-LEGACY-EAR-')) {
      payload.status = EAR_DRAFT.has(product.sku) ? 'draft' : 'publish';
      payload.catalog_visibility = 'catalog';
    }
    try {
      if (DRY_RUN) {
        console.log('dry-run #' + product.id, product.sku || '-', product.slug, '->', slug, payload.status || product.status, cat);
        continue;
      }
      await woo.put('products/' + product.id, payload);
      summary.updated += 1;
      if (payload.status === 'draft') summary.drafted += 1;
      if (payload.status === 'publish') summary.published += 1;
      console.log('updated #' + product.id, slug, payload.status || product.status);
    } catch (error) {
      summary.failed += 1;
      console.error('failed #' + product.id, product.sku, error.response?.data || error.message);
    }
  }
  console.log('Done', { dry_run: DRY_RUN, products: products.length, ...summary });
  if (summary.failed) process.exitCode = 1;
}
main().catch((error) => { console.error(error); process.exit(1); });
