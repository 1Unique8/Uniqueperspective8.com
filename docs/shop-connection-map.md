# What uniqueperspective8.com must connect

Reviewed 30 September 2026. House tells the story. Shop is the till.

Connect means a visible link to `https://shop.uniqueperspective8.com/product/{slug}` (no trailing slash) or `/shop#{aisle}`.
Next already 301s `/product/:slug/` → `/product/:slug`.

| House file | Status | Must connect | Must not connect |
| --- | --- | --- | --- |
| site-search.js | Wired | Shop aisles by hash | Woo `/shop/jewelry/`, candles, `?s=` |
| ethics.html | Wired | Field kits page + `/shop#rockhounding` | Shop root, helmet, decor |
| field-studio-kits.html | Wired | Rockhounding, creek, rough ground | Doba 001–006 as shop listings |
| wear.html | Wired | Pendant + bench wire | Estwing, sluices |
| specimens.html | Partial | Small agate; cabinet aisle still to add on page | Dyed bookends |
| sourced-series.html | Keep | Pendant, small agate only | Home decor, creek kits |
| index.html | Keep | Pendant, small agate, Live shop | Amazon kits as FMC stones |
| catalog.html | Open | Home decor aisle, labeled dyed | Sourced Series language |
| services-audit.html / contact.html | Keep | Two Audit slugs | Kits |
| downloads/UP8-08-... | Open | Look closer loupes | Creek sluices |

Still open: catalog.html home-decor block, specimens.html cabinet links, mineral-ID download loupes, sourced-series trailing-slash cleanup.
