const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId =
  process.env.NOTION_SHOP_CATALOG_ID ||
  process.env.NOTION_DATABASE_ID ||
  '0092ca8896974574844e3eaf7b23f3db';

function plainText(prop) {
  if (!prop) return '';
  if (prop.type === 'title') return (prop.title || []).map((t) => t.plain_text).join('').trim();
  if (prop.type === 'rich_text') return (prop.rich_text || []).map((t) => t.plain_text).join('').trim();
  if (prop.type === 'select') return prop.select?.name || '';
  if (prop.type === 'number') return prop.number;
  return '';
}

async function syncToStatic() {
  if (!process.env.NOTION_TOKEN) {
    throw new Error('Missing NOTION_TOKEN');
  }

  console.log('Starting Notion → static catalog list');

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: { property: 'Live status', select: { equals: 'Live' } },
  });

  const rows = response.results.map((page) => {
    const p = page.properties;
    return {
      sku: plainText(p.SKU),
      name: plainText(p.Product),
      price: p['Price CAD']?.number ?? null,
      type: plainText(p['Product type']),
    };
  }).filter((row) => row.sku);

  const out = path.join(__dirname, '..', 'data', 'shop-catalog-live.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(rows, null, 2));
  console.log(`Wrote ${rows.length} live SKUs to ${out}`);
}

syncToStatic().catch((error) => {
  console.error(error);
  process.exit(1);
});
