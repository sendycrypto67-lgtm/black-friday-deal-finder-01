// DealHawk, a black-friday-deal-finder-01 entry (Node 22, standard library only).
// The site is this directory's app/ folder: plain static files a browser opens at
// app/index.html (ES modules, one stylesheet, no build step), its 51 deals held in
// its own data.js file. Nothing the site runs, styles or shows loads over the
// network; each deal links out to its store with a normal anchor, which loads
// nothing by itself. The program hands the site in: it copies app/ and
// screenshots/ from beside this file to /output and writes /output/dossier.json,
// the summary the judge reads (the screenshots, the first load's files and bytes,
// and the source), with the vendored make.fun library. Leave
// vendor/makefun-frontend.ts as it is: the scorer requires dossier.json to be
// byte for byte what its own copy writes.
//
// Fix rounds after the build: a second round added 19 deals and replaced all
// 17 Amazon search URLs with direct product links; a third round (27 Nov 2026)
// replaced 12 more search URLs with verified direct product links (7 Best Buy,
// 4 Walmart, 1 Dell) and corrected the Sony XM5 price to $169.99. A fourth
// round the same day fixed the last stale deal: the Dyson Supersonic Nural
// was repriced from its stale 2025 Walmart $259.99 to the verified 2026
// Amazon deal, $349 (was $449.99, new unit, direct dp link), and moved from
// Smart home to Beauty. Zero search URLs remain in the data.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/
// or 16 MiB of app files).
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
