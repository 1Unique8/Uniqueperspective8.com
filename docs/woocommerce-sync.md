# WooCommerce product sync

Join key is SKU. Assigned slugs are fixed. The shop host is `shop.uniqueperspective8.com`.

## Assigned studio map

| SKU | Slug |
| --- | --- |
| UP8-WEB-AGATE-PENDANT-001 | `agate-pendant` |
| UP8-WEB-AGATE-SMALL-001 | `agate-small-specimen` |
| UP8-WEB-AUDIT-SNAPSHOT-001 | `perspective-audit-snapshot` |
| UP8-WEB-AUDIT-BUNDLE-001 | `perspective-audit-bundle` |

`UP8-WEB-CRICUT-001` is retired. Do not sync it.

## What runs

`npm run sync:woo` via `.github/workflows/notion-sync-woocommerce.yml`.

Triggers:

- Every day at 15:00 UTC — always dry-run, assigned SKUs only, CSV source
- Push to `data/woo-import-live.csv` or the sync script — dry-run
- Manual **Run workflow** — you choose source, dry-run, create, and publish

Defaults stay safe: `DRY_RUN=true`, `WC_ALLOW_CREATE=false`, `WC_ASSIGNED_ONLY=true`, `SYNC_SOURCE=csv`.

CSV path reads `data/woo-import-live.csv`. Notion path still reads Shop Catalog rows with Live status = Live and joins Finished Goods on SKU.

Creates stay drafts unless you set `publish_assigned` on a manual run.

## Secrets required to write

Repo → Settings → Secrets and variables → Actions:

- `WC_SITE_URL` = `https://shop.uniqueperspective8.com`
- `WC_CONSUMER_KEY`
- `WC_CONSUMER_SECRET`

Notion secrets are required only when source is `notion`.

Do not commit key values. Do not flip live write until the four assigned URLs show the studio titles instead of 404s or candles.
