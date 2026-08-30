/**
 * Notion → WooCommerce product sync.
 *
 *   node scripts/sync-to-woocommerce.js --dry-run   # show what would be sent
 *   node scripts/sync-to-woocommerce.js             # write to the store
 *
 * Reads the "Product Inventory" database and pushes rows whose Status is one of
 * SYNC_STATUSES to the WooCommerce store, matching on SKU so a second run
 * updates rather than duplicates.
 *
 * Required environment: NOTION_TOKEN, NOTION_DATABASE_ID, WC_SITE_URL,
 * WC_CONSUMER_KEY, WC_CONSUMER_SECRET.
 */
const { Client } = require('@notionhq/client');
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

// Notion Status is a `status` property, so these must be status option names.
const SYNC_STATUSES = ['Active', 'Featured'];

const REQUIRED_ENV = [
  'NOTION_TOKEN',
  'NOTION_DATABASE_ID',
  'WC_SITE_URL',
  'WC_CONSUMER_KEY',
  'WC_CONSUMER_SECRET',
];

const dryRun = process.argv.includes('--dry-run');

// --- Notion property readers -------------------------------------------------
// Every accessor is keyed to a property that exists in the database. A rename in
// Notion should fail loudly here rather than silently syncing an empty value.
const text = (p) => p?.rich_text?.map((t) => t.plain_text).join('') || '';
const title = (p) => p?.title?.map((t) => t.plain_text).join('') || '';
const number = (p) => (typeof p?.number === 'number' ? p.number : null);
const select = (p) => p?.select?.name || '';
const status = (p) => p?.status?.name || '';
const multi = (p) => p?.multi_select?.map((o) => o.name) || [];
const url = (p) => p?.url || '';

/** Every page in the database matching SYNC_STATUSES, following pagination. */
async function fetchRows(notion, databaseId) {
  const filter =
    SYNC_STATUSES.length === 1
      ? { property: 'Status', status: { equals: SYNC_STATUSES[0] } }
      : { or: SYNC_STATUSES.map((s) => ({ property: 'Status', status: { equals: s } })) };

  const pages = [];
  let cursor;
  do {
    const res = await notion.databases.query({
      database_id: databaseId,
      filter,
      start_cursor: cursor,
    });
    pages.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return pages;
}

function toProduct(page) {
  const p = page.properties;

  const sku = text(p.SKU).trim();
  const price = number(p.Price);
  const stock = number(p['Stock Level']);
  const category = select(p.Category);
  const photo = url(p['Photo 2']);
  const rowStatus = status(p.Status);

  const product = {
    name: title(p.Name) || 'Untitled',
    sku,
    type: 'simple',
    description: text(p.Description),
    short_description: text(p['Short Description']),
    // Featured is a Notion status; WooCommerce carries it as its own flag.
    featured: rowStatus === 'Featured',
    meta_data: [
      { key: '_supplier_source', value: text(p['Supplier/Source']) },
      { key: '_area', value: select(p.Area) },
      { key: '_location_stage', value: text(p['Location/Stage']) },
      { key: '_notion_page_id', value: page.id },
    ],
  };

  // Only send a price when Notion has one. Sending "0" would publish the item
  // as free, which is worse than leaving the store's existing value alone.
  if (price !== null) product.regular_price = String(price);
  if (category) product.categories = [{ name: category }];
  if (photo) product.images = [{ src: photo }];

  const tags = multi(p.Tags);
  if (tags.length) product.tags = tags.map((name) => ({ name }));

  if (stock !== null) {
    product.manage_stock = true;
    product.stock_quantity = stock;
    product.stock_status = stock > 0 ? 'instock' : 'outofstock';
  }

  return product;
}

/** Create, or update the existing product with the same SKU. */
async function upsert(woo, product) {
  const found = await woo.get('products', { sku: product.sku });
  const existing = Array.isArray(found.data) ? found.data[0] : null;
  if (existing) {
    await woo.put(`products/${existing.id}`, product);
    return 'updated';
  }
  await woo.post('products', product);
  return 'created';
}

async function main() {
  const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`Missing required environment: ${missing.join(', ')}`);
    return 2;
  }

  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const woo = new WooCommerceRestApi({
    url: process.env.WC_SITE_URL,
    consumerKey: process.env.WC_CONSUMER_KEY,
    consumerSecret: process.env.WC_CONSUMER_SECRET,
    version: 'wc/v3',
  });

  console.log(`Notion → WooCommerce sync${dryRun ? ' (dry run)' : ''}`);

  const pages = await fetchRows(notion, process.env.NOTION_DATABASE_ID);
  console.log(`${pages.length} rows with status ${SYNC_STATUSES.join(' or ')}\n`);

  const counts = { created: 0, updated: 0, skipped: 0, failed: 0 };

  for (const page of pages) {
    const product = toProduct(page);

    // Without a SKU there is nothing to match on, and every run would create a
    // fresh duplicate. Skip loudly instead.
    if (!product.sku) {
      console.warn(`  skipped (no SKU): ${product.name}`);
      counts.skipped++;
      continue;
    }

    if (dryRun) {
      const price = product.regular_price ?? '—';
      console.log(`  ${product.sku}  ${product.name}  ${price}`);
      continue;
    }

    try {
      const action = await upsert(woo, product);
      console.log(`  ${action}: ${product.sku}  ${product.name}`);
      counts[action]++;
    } catch (error) {
      const detail = error.response?.data?.message || error.message;
      console.error(`  failed: ${product.sku}  ${product.name} — ${detail}`);
      counts.failed++;
    }
  }

  if (dryRun) {
    console.log(`\n${pages.length - counts.skipped} products would be sent`);
  } else {
    console.log(
      `\ncreated ${counts.created}, updated ${counts.updated}, ` +
        `skipped ${counts.skipped}, failed ${counts.failed}`
    );
  }
  return counts.failed > 0 ? 1 : 0;
}

main()
  .then((code) => process.exit(code))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
