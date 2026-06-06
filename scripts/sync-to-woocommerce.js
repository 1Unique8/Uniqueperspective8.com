const { Client } = require('@notionhq/client');
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

const woo = new WooCommerceRestApi({
  url: process.env.WC_SITE_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: 'wc/v3'
});

async function syncProducts() {
  console.log("🔄 Starting Notion → WooCommerce sync...");

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: { property: "Status", select: { equals: "Active" } }
  });

  console.log(`Found ${response.results.length} active products.`);

  for (const page of response.results) {
    const p = page.properties;
    
    const name = p.Name?.title[0]?.plain_text || 'Untitled';
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const price = p["Suggested Retail Price"]?.number || 0;
    const story = p["Product Story / Description"]?.rich_text[0]?.plain_text || '';
    const stone = p["Stone Type"]?.select?.name || '';
    const location = p["Location / Region"]?.select?.name || '';
    const source = p["Supplier / Source"]?.rich_text[0]?.plain_text || '';

    const productData = {
      name: name,
      type: "simple",
      regular_price: price.toString(),
      description: story,
      short_description: `${stone} • ${location}`,
      categories: [{ name: "Jewelry" }],
      images: [{ src: `https://uniqueperspective8.com/wp-content/uploads/${slug}.jpg` }],
      meta_data: [
        { key: "_supplier_source", value: source },
        { key: "_stone_type", value: stone }
      ]
    };

    try {
      await woo.post("products", productData);
      console.log(`✅ Synced: ${name}`);
    } catch (error) {
      console.error(`❌ Failed ${name}:`, error.message);
    }
  }
}

syncProducts().catch(console.error);
