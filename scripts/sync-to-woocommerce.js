const { Client } = require('@notionhq/client');
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

const DRY_RUN = String(process.env.DRY_RUN || 'true').toLowerCase() !== 'false';
const ALLOW_CREATE = String(process.env.WC_ALLOW_CREATE || 'false').toLowerCase() === 'true';

const SHOP_CATALOG_ID =
  process.env.NOTION_SHOP_CATALOG_ID ||
  process.env.NOTION_DATABASE_ID ||
  '0092ca8896974574844e3eaf7b23f3db';

const FINISHED_GOODS_ID =
  process.env.NOTION_FINISHED_GOODS_ID ||
  '643d61a2fd8044f59ae16cd06e8dc5f5';

const CATEGORY_BY_TYPE = {
  Specimen: 'The Sourced Series',
  Jewelry: 'The Sourced Series',
  Kit: 'Field & Studio Kits',
  Service: 'The Perspective Audit',
};

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env: ${name}`);
  return value;
}

function plainText(prop) {
  if (!prop) return '';
  if (prop.type === 'title') return (prop.title || []).map((t) => t.plain_text).join('').trim();
  if (prop.type === 'rich_text') return (prop.rich_text || []).map((t) => t.plain_text).join('').trim();
  if (prop.type === 'select') return prop.select?.name || '';
  if (prop.type === 'url') return prop.url || '';
  if (prop.type === 'number') return prop.number;
  return '';
}

async function queryAll(notion, databaseId, filter) {
  const pages = [];
  let cursor;
  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
      filter,
    });
    pages.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);
  return pages;
}

function finishedGoodsMap(pages) {
  const bySku = new Map();
  for (const page of pages) {
    const sku = plainText(page.properties['SKU / Item ID']);
    if (!sku) continue;
    bySku.set(sku, {
      sku,
      name: plainText(page.properties['Product Name']),
      qty: page.properties['Qty In Stock']?.number,
      price: page.properties['Selling Price']?.number,
      category: plainText(page.properties['Shop Category']),
      photo: page.properties['Photo Link']?.url || '',
    });
  }
  return bySku;
}

async function findWooBySku(woo, sku) {
  const { data } = await woo.get('products', { sku, per_page: 5 });
  return Array.isArray(data) ? data.find((product) => product.sku === sku) : null;
}

async function syncProducts() {
  const notion = new Client({ auth: requiredEnv('NOTION_TOKEN') });
  const woo = new WooCommerceRestApi({
    url: requiredEnv('WC_SITE_URL'),
    consumerKey: requiredEnv('WC_CONSUMER_KEY'),
    consumerSecret: requiredEnv('WC_CONSUMER_SECRET'),
    version: 'wc/v3',
  });

  console.log(
    `Starting Notion → Woo sync. dry_run=${DRY_RUN} allow_create=${ALLOW_CREATE} catalog=${SHOP_CATALOG_ID}`
  );

  const catalog = await queryAll(notion, SHOP_CATALOG_ID, {
    property: 'Live status',
    select: { equals: 'Live' },
  });
  const goods = finishedGoodsMap(await queryAll(notion, FINISHED_GOODS_ID));

  const summary = { skipped: 0, wouldUpdate: 0, wouldCreate: 0, updated: 0, created: 0, failed: 0 };

  for (const page of catalog) {
    const p = page.properties;
    const sku = plainText(p.SKU);
    const name = plainText(p.Product);
    const brandFit = plainText(p['Brand fit']);
    const action = plainText(p.Action);
    const productType = plainText(p['Product type']);
    const fg = sku ? goods.get(sku) : null;
    const price = p['Price CAD']?.number ?? fg?.price;
    const qty = fg?.qty;
    const categoryName = fg?.category || CATEGORY_BY_TYPE[productType];

    if (!sku || brandFit === 'Off-brand' || action === 'Unpublish' || price == null) {
      summary.skipped += 1;
      console.log(`skip ${sku || name || page.id}: missing sku/price or unpublished/off-brand`);
      continue;
    }

    const payload = {
      name: name || fg?.name || sku,
      sku,
      type: productType === 'Service' ? 'simple' : 'simple',
      regular_price: String(price),
      manage_stock: productType !== 'Service',
      categories: categoryName ? [{ name: categoryName }] : undefined,
      virtual: productType === 'Service',
    };
    if (productType !== 'Service' && typeof qty === 'number') {
      payload.stock_quantity = qty;
    }
    if (fg?.photo) payload.images = [{ src: fg.photo }];

    try {
      const existing = await findWooBySku(woo, sku);
      if (existing) {
        summary.wouldUpdate += 1;
        if (DRY_RUN) {
          console.log(`dry-run update ${sku} #${existing.id} price=${price} qty=${qty ?? 'n/a'}`);
          continue;
        }
        await woo.put(`products/${existing.id}`, payload);
        summary.updated += 1;
        console.log(`updated ${sku} #${existing.id}`);
      } else if (!ALLOW_CREATE) {
        summary.skipped += 1;
        console.log(`skip create ${sku}: WC_ALLOW_CREATE is false`);
      } else {
        summary.wouldCreate += 1;
        if (DRY_RUN) {
          console.log(`dry-run create ${sku} price=${price} qty=${qty ?? 'n/a'}`);
          continue;
        }
        await woo.post('products', { ...payload, status: 'draft' });
        summary.created += 1;
        console.log(`created draft ${sku}`);
      }
    } catch (error) {
      summary.failed += 1;
      const detail = error.response?.data || error.message;
      console.error(`failed ${sku}:`, detail);
    }
  }

  console.log('Done', summary);
  if (summary.failed) process.exitCode = 1;
}

syncProducts().catch((error) => {
  console.error(error);
  process.exit(1);
});
