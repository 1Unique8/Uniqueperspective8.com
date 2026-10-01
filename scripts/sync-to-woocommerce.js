const fs = require('fs');
const path = require('path');
const { Client } = require('@notionhq/client');
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

const DRY_RUN = String(process.env.DRY_RUN || 'true').toLowerCase() !== 'false';
const ALLOW_CREATE = String(process.env.WC_ALLOW_CREATE || 'false').toLowerCase() === 'true';
const PUBLISH_ASSIGNED = String(process.env.WC_PUBLISH_ASSIGNED || 'false').toLowerCase() === 'true';
const SOURCE = String(process.env.SYNC_SOURCE || 'csv').toLowerCase();
const ASSIGNED_ONLY = String(process.env.WC_ASSIGNED_ONLY || 'true').toLowerCase() !== 'false';
const CSV_PATH = process.env.WOO_CSV_PATH || path.join(process.cwd(), 'data/woo-import-live.csv');

const ASSIGNED_SLUGS = {
  'UP8-WEB-AGATE-PENDANT-001': 'agate-pendant',
  'UP8-WEB-AGATE-SMALL-001': 'agate-small-specimen',
  'UP8-WEB-AUDIT-SNAPSHOT-001': 'perspective-audit-snapshot',
  'UP8-WEB-AUDIT-BUNDLE-001': 'perspective-audit-bundle'
};

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
  Service: 'The Perspective Audit'
};

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error('Missing required env: ' + name);
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

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  const headers = lines.shift().split(',');
  return lines.filter(Boolean).map((line) => {
    const cols = [];
    let current = '';
    let quoted = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (ch === '"') quoted = !quoted;
      else if (ch === ',' && !quoted) {
        cols.push(current);
        current = '';
      } else current += ch;
    }
    cols.push(current);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = cols[index] || '';
    });
    return row;
  });
}

function rowsFromCsv() {
  return parseCsv(fs.readFileSync(CSV_PATH, 'utf8')).map((row) => {
    const sku = row.SKU;
    return {
      sku,
      name: row.Name,
      price: row['Regular price'],
      qty: row.Stock === '' ? undefined : Number(row.Stock),
      category: row.Categories,
      short: row['Short description'],
      description: row.Description,
      virtual: String(row['Meta: _virtual']).toLowerCase() === 'yes',
      manageStock: String(row['Meta: _manage_stock']).toLowerCase() === 'yes',
      slug: ASSIGNED_SLUGS[sku]
    };
  });
}

async function queryAll(notion, databaseId, filter) {
  const pages = [];
  let cursor;
  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
      filter
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
      photo: page.properties['Photo Link']?.url || ''
    });
  }
  return bySku;
}

async function rowsFromNotion() {
  const notion = new Client({ auth: requiredEnv('NOTION_TOKEN') });
  const catalog = await queryAll(notion, SHOP_CATALOG_ID, {
    property: 'Live status',
    select: { equals: 'Live' }
  });
  const goods = finishedGoodsMap(await queryAll(notion, FINISHED_GOODS_ID));
  const rows = [];
  for (const page of catalog) {
    const p = page.properties;
    const sku = plainText(p.SKU);
    const name = plainText(p.Product);
    const brandFit = plainText(p['Brand fit']);
    const action = plainText(p.Action);
    const productType = plainText(p['Product type']);
    const fg = sku ? goods.get(sku) : null;
    const price = p['Price CAD']?.number ?? fg?.price;
    if (!sku || brandFit === 'Off-brand' || action === 'Unpublish' || price == null) {
      console.log('skip ' + (sku || name || page.id) + ': missing sku/price or unpublished/off-brand');
      continue;
    }
    rows.push({
      sku,
      name: name || fg?.name || sku,
      price,
      qty: fg?.qty,
      category: fg?.category || CATEGORY_BY_TYPE[productType],
      short: '',
      description: '',
      virtual: productType === 'Service',
      manageStock: productType !== 'Service',
      photo: fg?.photo || '',
      slug: ASSIGNED_SLUGS[sku]
    });
  }
  return rows;
}

async function findWooBySku(woo, sku) {
  const { data } = await woo.get('products', { sku, per_page: 5 });
  return Array.isArray(data) ? data.find((product) => product.sku === sku) : null;
}

function toPayload(row) {
  const payload = {
    name: row.name,
    sku: row.sku,
    type: 'simple',
    regular_price: String(row.price),
    manage_stock: Boolean(row.manageStock),
    virtual: Boolean(row.virtual),
    short_description: row.short || undefined,
    description: row.description || undefined
  };
  if (row.slug) payload.slug = row.slug;
  if (row.category) payload.categories = [{ name: row.category }];
  if (row.manageStock && typeof row.qty === 'number' && !Number.isNaN(row.qty)) {
    payload.stock_quantity = row.qty;
  }
  if (row.photo) payload.images = [{ src: row.photo }];
  if (PUBLISH_ASSIGNED && ASSIGNED_SLUGS[row.sku]) payload.status = 'publish';
  return payload;
}

async function syncProducts() {
  const woo = new WooCommerceRestApi({
    url: requiredEnv('WC_SITE_URL'),
    consumerKey: requiredEnv('WC_CONSUMER_KEY'),
    consumerSecret: requiredEnv('WC_CONSUMER_SECRET'),
    version: 'wc/v3'
  });

  console.log(
    'Starting Woo sync. source=' +
      SOURCE +
      ' dry_run=' +
      DRY_RUN +
      ' allow_create=' +
      ALLOW_CREATE +
      ' publish_assigned=' +
      PUBLISH_ASSIGNED +
      ' assigned_only=' +
      ASSIGNED_ONLY
  );

  let rows = SOURCE === 'notion' ? await rowsFromNotion() : rowsFromCsv();
  if (ASSIGNED_ONLY) rows = rows.filter((row) => ASSIGNED_SLUGS[row.sku]);

  const summary = { skipped: 0, wouldUpdate: 0, wouldCreate: 0, updated: 0, created: 0, failed: 0 };

  for (const row of rows) {
    if (!row.sku || row.price === '' || row.price == null) {
      summary.skipped += 1;
      console.log('skip ' + (row.sku || row.name) + ': missing sku/price');
      continue;
    }
    const payload = toPayload(row);
    try {
      const existing = await findWooBySku(woo, row.sku);
      if (existing) {
        summary.wouldUpdate += 1;
        if (DRY_RUN) {
          console.log(
            'dry-run update ' + row.sku + ' #' + existing.id + ' slug=' + (payload.slug || existing.slug) + ' price=' + row.price
          );
          continue;
        }
        await woo.put('products/' + existing.id, payload);
        summary.updated += 1;
        console.log('updated ' + row.sku + ' #' + existing.id);
      } else if (!ALLOW_CREATE) {
        summary.skipped += 1;
        console.log('skip create ' + row.sku + ': WC_ALLOW_CREATE is false');
      } else {
        summary.wouldCreate += 1;
        if (DRY_RUN) {
          console.log('dry-run create ' + row.sku + ' slug=' + (payload.slug || '') + ' price=' + row.price);
          continue;
        }
        const created = await woo.post('products', { ...payload, status: payload.status || 'draft' });
        summary.created += 1;
        console.log('created ' + row.sku + ' #' + created.data?.id + ' status=' + (payload.status || 'draft'));
      }
    } catch (error) {
      summary.failed += 1;
      console.error('failed ' + row.sku + ':', error.response?.data || error.message);
    }
  }

  console.log('Done', summary);
  if (summary.failed) process.exitCode = 1;
}

syncProducts().catch((error) => {
  console.error(error);
  process.exit(1);
});
