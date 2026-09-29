const fs = require('fs');
const path = require('path');
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

const DRY_RUN = String(process.env.DRY_RUN || 'true').toLowerCase() !== 'false';
const CSV_PATH = process.env.DROPSHIP_SLUG_CSV || path.join(process.cwd(), 'data/dropship-slugs.csv');
const STUDIO = new Set([
  'agate-pendant',
  'agate-small-specimen',
  'cricut-kit',
  'perspective-audit-snapshot',
  'perspective-audit-bundle'
]);

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error('Missing required env: ' + name);
  return value;
}

function parseCsv(text) {
  return text.replace(/^\uFEFF/, '').trim().split(/\r?\n/).slice(1).filter(Boolean).map((line) => {
    const [kind, current_slug, assigned_slug] = line.split(',');
    return { kind, current_slug, assigned_slug };
  });
}

async function listProducts(woo) {
  const products = [];
  let page = 1;
  while (true) {
    const { data } = await woo.get('products', { per_page: 100, page });
    if (!Array.isArray(data) || data.length === 0) break;
    products.push(...data);
    if (data.length < 100) break;
    page += 1;
  }
  return products;
}

async function main() {
  const woo = new WooCommerceRestApi({
    url: requiredEnv('WC_SITE_URL'),
    consumerKey: requiredEnv('WC_CONSUMER_KEY'),
    consumerSecret: requiredEnv('WC_CONSUMER_SECRET'),
    version: 'wc/v3'
  });

  const map = parseCsv(fs.readFileSync(CSV_PATH, 'utf8'));
  const products = await listProducts(woo);
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const summary = { matched: 0, missing: 0, skippedStudio: 0, wouldUpdate: 0, updated: 0, failed: 0 };

  for (const row of map) {
    if (STUDIO.has(row.assigned_slug) || STUDIO.has(row.current_slug)) {
      summary.skippedStudio += 1;
      console.log('skip studio ' + row.current_slug);
      continue;
    }
    const product = bySlug.get(row.current_slug);
    if (!product) {
      summary.missing += 1;
      console.log('missing current slug ' + row.current_slug);
      continue;
    }
    summary.matched += 1;
    if (product.slug === row.assigned_slug) {
      console.log('already ' + row.assigned_slug + ' #' + product.id);
      continue;
    }
    summary.wouldUpdate += 1;
    if (DRY_RUN) {
      console.log('dry-run slug ' + product.slug + ' -> ' + row.assigned_slug + ' #' + product.id + ' (' + row.kind + ')');
      continue;
    }
    try {
      await woo.put('products/' + product.id, { slug: row.assigned_slug });
      summary.updated += 1;
      console.log('updated slug ' + row.assigned_slug + ' #' + product.id);
    } catch (error) {
      summary.failed += 1;
      console.error('failed ' + row.current_slug + ':', error.response?.data || error.message);
    }
  }

  console.log('Done', { dry_run: DRY_RUN, ...summary });
  if (summary.failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
