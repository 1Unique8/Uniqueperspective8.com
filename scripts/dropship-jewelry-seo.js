const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
const DRY_RUN = String(process.env.DRY_RUN || 'true').toLowerCase() !== 'false';
const PIECES = [
  { slug: 'botanical-garden-ring', name: 'Botanical Garden ring', desc: 'Catalog fashion ring. Drop-shipped. Not a studio wrap. Not a Vein Ledger stone.' },
  { slug: 'emerald-glow-halo-ring', name: 'Emerald Glow halo ring', desc: 'Catalog fashion ring. Drop-shipped. Colour name is the listing name, not a lab report.' },
  { slug: 'golden-teardrop-bracelet', name: 'Golden Teardrop bracelet', desc: 'Catalog fashion bracelet. Drop-shipped. Not hallmarked studio gold.' },
  { slug: 'honey-baroque-necklace', name: 'Honey Baroque necklace', desc: 'Catalog fashion necklace. Drop-shipped. Not a Finished Goods drawer piece.' },
  { slug: 'mystic-harmony-bracelet', name: 'Mystic Harmony bracelet', desc: 'Catalog fashion bracelet. Drop-shipped. Not a field-collected Sourced Series object.' },
  { slug: 'rainbow-statement-necklace', name: 'Rainbow Statement necklace', desc: 'Catalog fashion necklace. Drop-shipped. Not a studio pendant.' },
  { slug: 'sculptural-pearl-ring', name: 'Sculptural Pearl ring', desc: 'Catalog fashion ring. Drop-shipped. Pearl type is as listed by the supplier.' }
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
async function findBySlug(woo, slug) {
  const { data } = await woo.get('products', { slug, per_page: 10 });
  return Array.isArray(data) ? data.find((row) => row.slug === slug) : null;
}
async function main() {
  const woo = new WooCommerceRestApi({
    url: requiredEnv('WC_SITE_URL'),
    consumerKey: requiredEnv('WC_CONSUMER_KEY'),
    consumerSecret: requiredEnv('WC_CONSUMER_SECRET'),
    version: 'wc/v3'
  });
  const jewelry = await findCategory(woo, 'jewelry');
  if (!jewelry) throw new Error('Missing jewelry category');
  if (!DRY_RUN) {
    await woo.put('products/categories/' + jewelry.id, {
      name: 'Jewelry',
      slug: 'jewelry',
      description: 'Catalog fashion jewelry, drop-shipped. Not studio wraps. Not Finished Goods earrings. Not Vein Ledger stones.'
    });
  }
  for (const piece of PIECES) {
    const existing = await findBySlug(woo, piece.slug);
    if (!existing) { console.log('missing ' + piece.slug); continue; }
    const title = (piece.name + ' | Catalog | Unique Perspective 8').slice(0, 60);
    const payload = {
      name: piece.name,
      slug: piece.slug,
      categories: [{ id: jewelry.id }],
      short_description: piece.desc,
      description: piece.desc + ' Sold from the catalog aisle, not the cabinet.',
      meta_data: [
        { key: '_yoast_wpseo_title', value: title },
        { key: '_yoast_wpseo_metadesc', value: piece.desc },
        { key: 'rank_math_title', value: title },
        { key: 'rank_math_description', value: piece.desc },
        { key: '_aioseo_title', value: title },
        { key: '_aioseo_description', value: piece.desc }
      ]
    };
    if (DRY_RUN) { console.log('dry-run #' + existing.id + ' ' + piece.slug); continue; }
    await woo.put('products/' + existing.id, payload);
    console.log('updated #' + existing.id + ' /' + piece.slug);
  }
}
main().catch((error) => { console.error(error); process.exit(1); });
