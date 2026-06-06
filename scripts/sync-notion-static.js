const { Client } = require('@notionhq/client');
const fs = require('fs');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

async function syncToStatic() {
  console.log("🔄 Starting Notion → Static Site sync...");

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: { property: "Status", select: { equals: "Active" } }
  });

  let shopCardsHTML = '';

  for (const page of response.results) {
    const p = page.properties;
    
    const name = p.Name?.title[0]?.plain_text || 'Untitled';
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const price = p["Suggested Retail Price"]?.number || 0;
    const story = p["Product Story / Description"]?.rich_text[0]?.plain_text || '';
    const stone = p["Stone Type"]?.select?.name || '';
    const location = p["Location / Region"]?.select?.name || '';

    shopCardsHTML += `
    <!-- ${name} -->
    <div class="product-card">
        <img src="images/products/${slug}.jpg" alt="${name}" loading="lazy">
        <div class="card-body">
            <h3>${name}</h3>
            <p class="stone-type">${stone} • ${location}</p>
            <p class="price">$${price} CAD</p>
            <span class="ethical-badge">Ethically Sourced in BC</span>
            <p>${story.substring(0, 160)}...</p>
            <button class="add-to-cart">Add to Cart</button>
            <a href="product-detail.html?id=${slug}" class="view-details">View Details →</a>
        </div>
    </div>`;
  }

  // Update shop.html (using markers)
  let shopContent = fs.readFileSync('../shop.html', 'utf8'); // Adjust path if needed
  const startMarker = '<!-- PRODUCTS_START -->';
  const endMarker = '<!-- PRODUCTS_END -->';

  if (shopContent.includes(startMarker)) {
    const before = shopContent.split(startMarker)[0];
    const after = shopContent.split(endMarker)[1] || '';
    shopContent = `${before}${startMarker}\n${shopCardsHTML}\n${endMarker}${after}`;
    fs.writeFileSync('../shop.html', shopContent);
    console.log(`✅ Updated shop.html with ${response.results.length} products`);
  } else {
    console.log("⚠️  Markers not found in shop.html");
  }
}

syncToStatic().catch(console.error);
