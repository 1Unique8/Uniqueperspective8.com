# GitHub Secrets Setup

Required secrets for Woo inventory sync. Never commit the values.

| Secret Name | Description |
| --- | --- |
| `NOTION_TOKEN` | Notion internal integration token |
| `NOTION_DATABASE_ID` | Fallback Shop Catalog database ID |
| `NOTION_SHOP_CATALOG_ID` | Shop Catalog database ID (`0092ca8896974574844e3eaf7b23f3db`) |
| `NOTION_FINISHED_GOODS_ID` | Finished Goods database ID (`643d61a2fd8044f59ae16cd06e8dc5f5`) |
| `WC_SITE_URL` | Checkout host, e.g. `https://shop.uniqueperspective8.com` — not the GitHub Pages domain |
| `WC_CONSUMER_KEY` | Woo REST key created on the shop host |
| `WC_CONSUMER_SECRET` | Matching secret |

## How to add secrets

1. Repo → Settings → Secrets and variables → Actions
2. New repository secret for each row above

## Safe first run

The workflow lives at `.github/workflows/notion-sync-woocommerce.yml`.
It is manual only. Defaults: `DRY_RUN=true`, `WC_ALLOW_CREATE=false`.

Do not flip those until demo / Syncee SKUs are gone from the shop and SiteGround is not captcha-blocking `/wp-json/`.
