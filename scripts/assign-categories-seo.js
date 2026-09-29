const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

const DRY_RUN = String(process.env.DRY_RUN || 'true').toLowerCase() !== 'false';

const CATEGORIES = [
  {
    slug: 'sourced-series',
    name: 'The Sourced Series',
    description:
      'Studio minerals and finished wraps from Unique Perspective 8. Field origin stays visible. These are not drop-ship catalog goods.'
  },
  {
    slug: 'field-studio-kits',
    name: 'Field & Studio Kits',
    description:
      'Tools and starter kits for looking closer and working by hand. Studio-curated kits sit here. Mining-supply drop-ship kits stay labeled as catalog.'
  },
  {
    slug: 'perspective-audit',
    name: 'The Perspective Audit',
    description:
      'Paid studio services: Snapshot and Audit + Roadmap. Virtual. Book and pay through the listing or services@uniqueperspective8.com.'
  },
  {
    slug: 'jewelry',
    name: 'Jewelry',
    description:
      'Catalog jewelry sold on the shop host. These pieces are not Similkameen studio wraps unless the title says so.'
  },
  {
    slug: 'candles',
    name: 'Candles',
    description:
      'Drop-ship scented candles and wax melts. Supplier catalog. Not field-collected. Not The Sourced Series.'
  },
  {
    slug: 'home-textiles',
    name: 'Home textiles',
    description:
      'Drop-ship throws, sheets, and wearable blankets. Supplier catalog. Not studio minerals or jewelry.'
  }
];

const STUDIO = {
  'agate-pendant': 'sourced-series',
  'agate-small-specimen': 'sourced-series',
  'cricut-kit': 'field-studio-kits',
  'perspective-audit-snapshot': 'perspective-audit',
  'perspective-audit-bundle': 'perspective-audit'
};

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error('Missing required env: ' + name);
  return value;
}

function kindFor(product) {
  if (STUDIO[product.slug]) return STUDIO[product.slug];
  const name = (product.name || '').toLowerCase();
  const slug = (product.slug || '').toLowerCase();
  const cats = (product.categories || []).map((c) => c.slug);
  if (cats.includes('jewelry') || /ring|necklace|bracelet/.test(slug)) {
    if (!/candle|throw|blanket|sheet|hoodie/.test(name + slug)) return 'jewelry';
  }
  if (/candle|wax-melt|wax melts/.test(name + ' ' + slug)) return 'candles';
  if (/blanket|throw|sheet|hoodie|fleece|textile/.test(name + ' ' + slug)) return 'home-textiles';
  if (cats.includes('jewelry')) return 'jewelry';
  return null;
}

function seoFor(product, categoryName) {
  const name = product.name.replace(/\s+/g, ' ').trim();
  const dropship = !STUDIO[product.slug];
  const title = dropship
    ? name + ' | Catalog | Unique Perspective 8'
    : name + ' | Unique Perspective 8';
  const description = dropship
    ? name + ' is a drop-ship catalog item at Unique Perspective 8. Not a field-collected Sourced Series stone. Sold at shop.uniqueperspective8.com.'
    : name + ' is a Unique Perspective 8 studio listing in ' + categoryName + '. Origin stays with the object.';
  return { title: title.slice(0, 60), description: description.slice(0, 160) };
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

async function ensureCategories(woo) {
  const existing = await listAll(woo, 'products/categories');
  const bySlug = new Map(existing.map((row) => [row.slug, row]));
  for (const spec of CATEGORIES) {
    const found = bySlug.get(spec.slug);
    if (!found) {
      if (DRY_RUN) {
        console.log('dry-run create category ' + spec.slug);
        bySlug.set(spec.slug, { id: 'new-' + spec.slug, slug: spec.slug, name: spec.name });
        continue;
      }
      const created = await woo.post('products/categories', spec);
      bySlug.set(spec.slug, created.data);
      console.log('created category ' + spec.slug + ' #' + created.data.id);
    } else if (found.description !== spec.description || found.name !== spec.name) {
      if (DRY_RUN) {
        console.log('dry-run update category ' + spec.slug + ' #' + found.id);
      } else {
        await woo.put('products/categories/' + found.id, {
          name: spec.name,
          description: spec.description
        });
        console.log('updated category ' + spec.slug + ' #' + found.id);
      }
    } else {
      console.log('category ok ' + spec.slug + ' #' + found.id);
    }
  }
  return bySlug;
}

async function main() {
  const woo = new WooCommerceRestApi({
    url: requiredEnv('WC_SITE_URL'),
    consumerKey: requiredEnv('WC_CONSUMER_KEY'),
    consumerSecret: requiredEnv('WC_CONSUMER_SECRET'),
    version: 'wc/v3'
  });

  console.log('Starting category + SEO assign. dry_run=' + DRY_RUN);
  const bySlug = await ensureCategories(woo);
  const products = await listAll(woo, 'products');
  const summary = { assigned: 0, skipped: 0, failed: 0, wouldUpdate: 0 };

  for (const product of products) {
    const catSlug = kindFor(product);
    if (!catSlug) {
      summary.skipped += 1;
      console.log('skip unclassified #' + product.id + ' ' + product.slug);
      continue;
    }
    const category = bySlug.get(catSlug);
    if (!category || typeof category.id === 'string') {
      summary.wouldUpdate += 1;
      console.log('dry-run would assign ' + product.slug + ' -> ' + catSlug);
      continue;
    }
    const seo = seoFor(product, category.name);
    const payload = {
      categories: [{ id: category.id }],
      meta_data: [
        { key: '_yoast_wpseo_title', value: seo.title },
        { key: '_yoast_wpseo_metadesc', value: seo.description },
        { key: 'rank_math_title', value: seo.title },
        { key: 'rank_math_description', value: seo.description }
      ]
    };
    if (!product.short_description) payload.short_description = seo.description;
    summary.wouldUpdate += 1;
    if (DRY_RUN) {
      console.log('dry-run ' + product.slug + ' -> ' + catSlug + ' seo="' + seo.title + '"');
      continue;
    }
    try {
      await woo.put('products/' + product.id, payload);
      summary.assigned += 1;
      console.log('assigned ' + product.slug + ' -> ' + catSlug);
    } catch (error) {
      summary.failed += 1;
      console.error('failed ' + product.slug + ':', error.response?.data || error.message);
    }
  }

  console.log('Done', { dry_run: DRY_RUN, ...summary, products: products.length });
  if (summary.failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
