# Woo Snapshot listing

Grok cannot write to shop.uniqueperspective8.com without Woo REST keys. This file is the listing spec. Import it in WP Admin → Products → Import.

## File

`data/woo-import-audit.csv`

## Snapshot row (do this first)

| Field | Value |
| --- | --- |
| SKU | `UP8-WEB-AUDIT-SNAPSHOT-001` |
| Name | The Perspective Audit™ — Snapshot |
| Regular price | 297 |
| Published | yes |
| Virtual | yes |
| Manage stock | no |
| Category | The Perspective Audit |
| Book/pay until checkout works | services@uniqueperspective8.com |

Do not create `UP8-CON-001`. That SKU is retired.

## After import

1. Open the product. Confirm SKU and $297.
2. Paste the permalink into Shop Catalog `Woo URL` and `Woo product slug`.
3. Set Sync status to Mapped.
4. Only then consider flipping `WC_ALLOW_CREATE` on the GitHub Action.

Bundle is in the same CSV because it is now Live in Shop Catalog. Import both or Snapshot alone.
