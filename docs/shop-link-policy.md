# Shop link policy

Observed 27 September 2026.

uniqueperspective8.com may point at the shop host. It may not point at a product permalink until that SKU is Live in Shop Catalog, present on shop.uniqueperspective8.com under its own title, and not carrying another vendor's name.

## What the two hosts say today

| Host | What a visitor sees |
| --- | --- |
| uniqueperspective8.com | Ethical minerals, handcrafted jewelry, Field & Studio Kits, Perspective Audit™ |
| shop.uniqueperspective8.com | 51 Uncategorized listings. Homepage featured acrylic throw blankets. Shop index opens on candles and wax melts. No public product titled Wire-Wrapped Agate Pendant, Polished Similkameen Agate, Cricut Vinyl Starter Bundle, or Perspective Audit. |

A Shop button to `https://shop.uniqueperspective8.com/` already exists on the static site. That is a host link, not a product link. Leave it until the catalog is cleaned. Do not add product-level URLs in the meantime.

## SKUs that may receive a product link later

Source: `data/woo-import-live.csv` and `data/woo-import-live-with-barcodes.csv`.

| SKU | Name | Price CAD | Category | Allowed static page |
| --- | --- | --- | --- | --- |
| UP8-WEB-AGATE-PENDANT-001 | Wire-Wrapped Agate Pendant — Similkameen | 58.50 | The Sourced Series | wear.html |
| UP8-WEB-AGATE-SMALL-001 | Polished Similkameen Agate — Small | 18 | The Sourced Series | specimens.html |
| UP8-WEB-CRICUT-001 | Cricut Vinyl Starter Bundle — UP8 Curated | 38 | Field & Studio Kits | field-studio-kits.html |
| UP8-WEB-AUDIT-SNAPSHOT-001 | The Perspective Audit™ — Snapshot | 297 | The Perspective Audit | services.html |
| UP8-WEB-AUDIT-BUNDLE-001 | The Perspective Audit™ — Audit + Roadmap Bundle | 795 | The Perspective Audit | services.html |

`catalog.html` lists twenty drop-ship cards (UP8-CAT-001 through UP8-CAT-020). Those cards stay unlinked until each SKU exists on the shop host under that same name. Do not map them onto the live candle or blanket listings.

## Gate before a permalink is written into HTML

A product URL may enter a static page only when all of these are true:

1. Shop Catalog Live status is Live.
2. The Woo product title matches the catalog name.
3. The SKU on the product is the UP8 SKU, not a supplier code.
4. The category is The Sourced Series, Field & Studio Kits, The Perspective Audit, or an explicit drop-ship category — not Uncategorized.
5. Opening the permalink does not show a candle, blanket, or other off-brand title.
6. Notion fields Woo URL and Woo product slug are filled and Sync status is Mapped.

If any check fails, keep the host link only.

## Clean the shop host first

Grok cannot write Woo products without shop-host REST keys. Cleanup happens in WP Admin on shop.uniqueperspective8.com.

1. Draft or unpublish every Uncategorized listing that is not in Shop Catalog.
2. Import `data/woo-import-live-with-barcodes.csv` (or confirm the five SKUs already exist and fix titles).
3. Assign categories: The Sourced Series, Field & Studio Kits, The Perspective Audit.
4. Set the shop homepage to featured UP8 SKUs, not NNEAGS blankets.
5. Paste each permalink into Notion Shop Catalog. Set Sync status to Mapped.
6. Only then add those permalinks to wear.html, specimens.html, field-studio-kits.html, and services.html.

See also `docs/woo-snapshot-listing.md` and `docs/woocommerce-sync.md`.

## What this commit does not do

It does not add product URLs to public HTML.
It does not change shop.html, which already redirects to the shop host.
It does not claim the five SKUs are live on the shop host.
