# Public provenance slice

This is the only ledger cut the website is allowed to read.

Source of the area rows: `Vein_Ledger_Rocks_by_Area_2026-09-18.xlsx` → `Areas_Summary`, checked against Notion Vein Ledger on 24 September 2026.
File on the site: [`/data/provenance-public.csv`](../data/provenance-public.csv)

## Columns that may leave the ledger

- area_code
- verified (YES only)
- may_print_place
- public_location
- region
- land_status
- fmc
- collector
- specimen_count
- collected_dates_public (only dates written on stone rows)
- public_page
- notes_public

## Columns that must not leave the ledger

- MINFILE Number
- MINFILE URL
- neighbourhood geology
- assay / PHOTO-GUESS working names
- cost, margin, Woo status
- unpublished GPS beyond the two roadside points already on `provenance.html`

## Rule

A provenance page may print a date or a mineral name only if that cell is green in the ledger and the area is Verified = YES.
GAL, HED, and OKAN stay off this file until Verified flips.

## How a later Action would use this

1. Keep this CSV as the contract.
2. When a Drive/Notion export runs, overwrite only these columns.
3. HTML pages stay static until a row in this file changes.
