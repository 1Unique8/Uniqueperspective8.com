# WooCommerce inventory sync

Join key is SKU. Shop Catalog decides what may be public. Finished Goods owns sellable quantity and cost.

## Errors that were in the first draft

- Workflow file sat in `.github/workflow/` so GitHub Actions never saw it.
- Script filtered Notion `Status = Active` and read `Name` / `Suggested Retail Price`. Shop Catalog uses `Live status`, `Product`, `SKU`, `Price CAD`.
- Script always `POST`ed a new product, so a second run duplicated the catalogue.
- No `sku` or `stock_quantity` was sent, so Woo could not be inventory.
- Images were guessed on uniqueperspective8.com, which is not the media library.

## What the script does now

`npm run sync:woo`

1. Reads Shop Catalog rows with Live status = Live.
2. Joins Finished Goods on SKU for qty and selling price fallback.
3. Skips blank SKU, missing price, Off-brand, and Unpublish.
4. `GET /products?sku=` then `PUT` if found.
5. Creates only when `WC_ALLOW_CREATE=true`, and then only as a draft.
6. Defaults to `DRY_RUN=true`.

## Still not automatic

Paid-order decrement back into Finished Goods is not built. SiteGround captcha on public REST will still fail the job until a shop-host key is allowlisted.
