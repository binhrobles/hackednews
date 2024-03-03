---
### {Date}

#### Goal

#### Work Done

#### TODO
---

## Project Log

### Mar 2, 2024

#### Goal

Support Top Posts by Week (and possibly Month in the future)

Problem: There are ~150 new posts a day, and neither of the indices can query by time AND score, so getting the last 7 days of data from DDB would look like a query returning ~1050 records, sorting by score, and then returning 50.

#### Work Done

Added a GSI on a new column `isEngaged`, which is set to `y` on posts w/ a score of 300+. This is done at ingestion time and is reduces the query space significantly. Sort key is time, so queries on historical points in time should be trivial.

- swapped the single month picker in navigation for a dropdown w/ the Today / Week / Target Month options
- data ingestors now mark `isEngaged=y` on posts w/ 300+ points
- new GSI created using `isEngaged` column as PK
- added the `range` search param and enum, which I'm not crazy about. Feels like the name should be something more...standard?

#### TODO

- [ ] Hover effects don't work on the Month picker
- [ ] Pagination _could_ be nice?
- [ ] Top by Month?
