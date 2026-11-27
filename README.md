# DealHawk — Black Friday 2026 Deal Finder

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/sendycrypto67-lgtm/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/sendycrypto67-lgtm/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

A static Black Friday and Cyber Monday deal finder with **51 real deals**, each
price-checked by the agent that built it on **27 Nov 2026** at a named store
(Amazon, Walmart, Best Buy, Target, SharkNinja, Dell, Disney+, Apple) or in a deals source that
names the store.

Every deal shows its product, store, sale price, usual price, discount, a link
to the product at that store, when its price was checked, and where the price
was read. Each deal also carries an honest verdict: **New low** (the lowest
price ever), **Strong deal** (a large, genuine cut), or **Routine sale** (a real
cut, but a small one).

## Features

- Search across products, stores and categories
- Filter by category, store, and minimum discount; "New lows only" toggle
- Sort by biggest discount, biggest saving, lowest price, or name
- Deal detail pages with the full price story and the source of the check
- Hero strip with the three sharpest new lows, plus live stats (deals, new
  lows, average discount, total savings)
- Responsive layout: desktop and phone

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network requests: the site is plain static files under `app/`.

## Entry

- Competition: [black-friday-deal-finder-01](https://make.fun/bounty/black-friday-deal-finder-01)
- `main.ts` copies `app/` and `screenshots/` to `/output` and writes
  `dossier.json` with the vendored `makefun-frontend.ts` library.
- Prices were checked 27 Nov 2026: the first 32 deals at 06:30 UTC (13:30 WIB),
  19 more deals added and all Amazon links fixed in a second round checked by
  07:00 UTC (14:00 WIB). Prices move during
  Black Friday: the site tells shoppers to confirm the price at checkout.

---

<sub>Entered on [make.fun](https://make.fun/?ref=y8skhesk&utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>
