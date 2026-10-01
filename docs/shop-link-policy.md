# Shop link policy

Last update: 30 September 2026.
Source of shop listings: `1Unique8/up8-platform` `lib/shop-catalog.ts`.
House host tells the story. Shop host sells. Do not paste Amazon titles onto Ethics or Provenance.

Next.js paths (after cutover): `https://shop.uniqueperspective8.com/product/{slug}` and aisle anchors on `/shop#{category}`.

## Connect these from uniqueperspective8.com

### Already wired (keep)

| House page | Shop listing | SKU | Slug |
| --- | --- | --- | --- |
| sourced-series.html, wear.html, index.html | Wire-Wrapped Agate Pendant — Similkameen | UP8-WEB-AGATE-PENDANT-001 | agate-pendant |
| sourced-series.html, specimens.html, index.html | Polished Similkameen Agate — Small | UP8-WEB-AGATE-SMALL-001 | agate-small-specimen |
| services.html, services-audit.html, contact.html | Perspective Audit Snapshot | UP8-WEB-AUDIT-SNAPSHOT-001 | perspective-audit-snapshot |
| services.html, services-audit.html, contact.html | Perspective Audit Bundle | UP8-WEB-AUDIT-BUNDLE-001 | perspective-audit-bundle |

### Need a house link (not yet on static pages)

Point field-studio-kits.html, a new rockhounding block, and ethics.html (tools only, not origin claims) at these shop URLs.

**Rockhounding** — house page: field-studio-kits.html + ethics.html (leave-no-trace card)

- `/shop#rockhounding`
- `/product/rock-pick-kit` (B091KMJW5C)
- `/product/geology-kit-15` (B0887RPKCK)
- `/product/geology-kit-26` (B0CQX5YQBD)
- `/product/geology-kit-7` (B0D7LWKP3Z)
- `/product/rockhounding-field-kit` (B0BHCG57L8)
- `/product/estwing-22-pick` (B0002OVCMO)
- `/product/estwing-eo-22p` (B01EKZFJVK)

**Creek kits** — house page: field-studio-kits.html

- `/shop#field-studio-kits`
- `/product/folding-sluice-kit` (B08CS4C48D)
- `/product/panning-kit-22` (B01DQ2A1P2)
- `/product/panning-kit-19` (B00GP3JWVO)
- `/product/panning-kit-11` (B078HT47BS)
- `/product/panning-kit-14` (B0CV2NY3ZP)
- `/product/xp-gold-pan-kit` (B091BGTMVT)
- `/product/sluice-fox-kit` (B087YK8ZQ8)

**Look closer** — house page: downloads/UP8-08-Mineral-Identification-and-Testing.html

- `/shop#look-closer`
- `/product/loupe-10x-uv`
- `/product/loupe-10x-fold`

**Cabinet** — house page: specimens.html (storage, not Vein Ledger IDs)

- `/shop#cabinet`
- `/product/gem-jar-case`
- `/product/gemstone-display-boxes`
- `/product/rock-display-case`

**Bench** — house page: wear.html

- `/shop#bench`
- `/product/wrap-wire-20ga`
- `/product/wrap-wire-square-20ga`

**Home decor** — house page: catalog.html only. Not sourced-series.html.

- `/shop#home-decor`
- `/product/natural-agate-bookends` (undyed catalog)
- `/product/blue-agate-bookends` (dyed — title must say dyed)
- `/product/framed-agate-slices` (dyed slices)

**Rough ground** — house page: field-studio-kits.html footer, not ethics.html

- `/shop#extreme-sports`
- `/product/approach-helmet`
- `/product/carbon-trekking-poles`
- `/product/aluminum-trekking-poles`

## Do not connect from the house story pages

These exist on catalog.html or old Woo. They do not get Sourced Series, Ethics, or Provenance sentences.

- UP8-CAT-001 through UP8-CAT-020 (geodes, catalog jewelry, printables, salt lamp, yoga, diffuser, blanket, jade roller)
- UP8-DS-MINE-001 through 006 (Doba cards)
- UP8-WEB-CRICUT-001 / `cricut-kit`
- Any Uncategorized Woo row still on the live host until DNS cutover

## Gate

A house button that says Shop listing must open that slug on the Next shop, not a candle and not a 404. Until cutover, treat assigned studio URLs as the only public promises.
