const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
const DRY_RUN = String(process.env.DRY_RUN || 'true').toLowerCase() !== 'false';
const DROPSHIP_CATS = new Set(['candles', 'home-textiles', 'jewelry']);
const SKIP_CATS = new Set(['earrings', 'the-thin-veil', 'sourced-series', 'field-studio-kits', 'perspective-audit']);
function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error('Missing required env: ' + name);
  return value;
}
function cats(product) {
  return (product.categories || []).map((row) => row.slug);
}
function isDropship(product) {
  const slugs = cats(product);
  if (slugs.some((slug) => SKIP_CATS.has(slug))) return false;
  if (String(product.sku || '').startsWith('UP8-WEB-')) return false;
  if (String(product.sku || '').startsWith('UP8-LEGACY-EAR-')) return false;
  return slugs.some((slug) => DROPSHIP_CATS.has(slug));
}
function titleFromSlug(slug) {
  const special = {
    'apple-bottom-jeans-candle': 'Apple Bottom Jeans candle',
    'apple-strudel-candle': 'Apple strudel candle',
    'arabian-nights-oud-candle': 'Arabian Nights oud candle',
    'bad-boy-leather-candle': 'Bad Boy leather candle',
    'battenberg-candle': 'Battenberg candle',
    'battenberg-wax-melts': 'Battenberg wax melts',
    'bounty-hunter-coconut-candle': 'Bounty Hunter coconut candle',
    'burnt-out-lemongrass-candle': 'Burnt Out lemongrass candle',
    'candle-scent-samples': 'Candle scent samples',
    'cappuccino-coffee-candle': 'Cappuccino coffee candle',
    'cashmere-outside-candle': 'Cashmere Outside candle',
    'cherry-picker-candle': 'Cherry Picker candle',
    'cuban-tobacco-candle': 'Cuban tobacco candle',
    'egyptian-amber-candle': 'Egyptian amber candle',
    'forager-berry-candle': 'Forager berry candle',
    'full-steam-ahead-candle': 'Full Steam Ahead candle',
    'garden-party-candle': 'Garden Party candle',
    'gentle-giant-candle': 'Gentle Giant candle',
    'grass-candle': 'Grass candle',
    'hawaiian-shirt-candle': 'Hawaiian Shirt candle',
    'hearth-sandalwood-candle': 'Hearth sandalwood candle',
    'honey-im-home-candle': "Honey I'm Home candle",
    'lemon-candle': 'Lemon candle',
    'lost-at-sea-candle': 'Lost at Sea candle',
    'lumberjack-pine-candle': 'Lumberjack pine candle',
    'mango-candle': 'Mango candle',
    'massage-candle': 'Massage candle',
    'midnight-bloom-candle': 'Midnight Bloom candle',
    'spring-clean-candle': 'Spring Clean candle',
    'whisky-candle': 'Whisky candle',
    'wild-mint-candle': 'Wild mint candle',
    'cinnamon-candle': 'Cinnamon candle',
    'caramel-candle': 'Caramel candle',
    'throw-orange-acrylic': 'Orange acrylic throw',
    'throw-pink-acrylic': 'Pink acrylic throw',
    'throw-coffee-textured': 'Coffee textured throw',
    'throw-teal-acrylic': 'Teal acrylic throw',
    'throw-coffee-acrylic': 'Coffee acrylic throw',
    'throw-yellow-acrylic': 'Yellow acrylic throw',
    'throw-mustard-textured': 'Mustard textured throw',
    'throw-green-diamond': 'Green diamond throw',
    'throw-green-acrylic': 'Green acrylic throw',
    'throw-blue-acrylic': 'Blue acrylic throw',
    'throw-grey-acrylic': 'Grey acrylic throw',
    'throw-coffee-textured-2x': 'Coffee textured throw, 2x',
    'wearable-blanket-hoodie': 'Wearable blanket hoodie',
    'throw-white-acrylic': 'White acrylic throw',
    'throw-pink-textured': 'Pink textured throw',
    'milk-fleece-sheet-grey': 'Grey milk-fleece fitted sheet',
    'milk-fleece-sheet-grey-alt': 'Grey milk-fleece fitted sheet (alt)',
    'knitted-fitted-sheet': 'Knitted fitted sheet',
    'botanical-garden-ring': 'Botanical Garden ring',
    'emerald-glow-halo-ring': 'Emerald Glow halo ring',
    'golden-teardrop-bracelet': 'Golden Teardrop bracelet',
    'honey-baroque-necklace': 'Honey Baroque necklace',
    'mystic-harmony-bracelet': 'Mystic Harmony bracelet',
    'rainbow-statement-necklace': 'Rainbow Statement necklace',
    'sculptural-pearl-ring': 'Sculptural Pearl ring'
  };
  return special[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
}
function needsRename(name) {
  const text = String(name || '');
  return /nneags/i.test(text) || /\bUK\b/.test(text) || text.length > 58 || /Luxury|Scented Candle UK|Warm Cozy Woven/i.test(text);
}
function seo(name, aisle) {
  const title = (name + ' | Catalog | Unique Perspective 8').slice(0, 60);
  const desc = (name + ' is a drop-ship catalog item in ' + aisle + ' at Unique Perspective 8. Supplier goods. Not field-collected. Not The Sourced Series.').slice(0, 160);
  return { title, desc };
}
async function listAll(woo) {
  const rows = [];
  let page = 1;
  while (true) {
    const { data } = await woo.get('products', { per_page: 100, page });
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
  const products = (await listAll(woo)).filter(isDropship);
  const summary = { updated: 0, renamed: 0, failed: 0 };
  for (const product of products) {
    const slugs = cats(product);
    const aisle = slugs.find((slug) => DROPSHIP_CATS.has(slug)) || 'catalog';
    const slug = product.slug;
    const name = needsRename(product.name) ? titleFromSlug(slug) : product.name;
    const copy = seo(name, aisle);
    const payload = {
      slug,
      name,
      short_description: copy.desc,
      meta_data: [
        { key: '_yoast_wpseo_title', value: copy.title },
        { key: '_yoast_wpseo_metadesc', value: copy.desc },
        { key: 'rank_math_title', value: copy.title },
        { key: 'rank_math_description', value: copy.desc },
        { key: '_aioseo_title', value: copy.title },
        { key: '_aioseo_description', value: copy.desc }
      ]
    };
    try {
      if (DRY_RUN) {
        console.log('dry-run', slug, name === product.name ? 'keep-name' : 'rename:' + name);
        continue;
      }
      await woo.put('products/' + product.id, payload);
      summary.updated += 1;
      if (name !== product.name) summary.renamed += 1;
      console.log('updated', slug);
    } catch (error) {
      summary.failed += 1;
      console.error('failed', slug, error.response?.data || error.message);
    }
  }
  console.log('Done', { dry_run: DRY_RUN, dropship: products.length, ...summary });
  if (summary.failed) process.exitCode = 1;
}
main().catch((error) => { console.error(error); process.exit(1); });
