// Views: the home list (hero, stats, filters, deal grid) and the deal detail page.
// All rendering is plain DOM built from the deals in data.js; nothing loads over
// the network. Prices are formatted in US dollars; streaming deals show "/mo".

import { deals, CHECKED_LABEL } from "./data.js";

export const VERDICT_LABEL = {
  "new-low": "New low",
  strong: "Strong deal",
  routine: "Routine sale",
};

export const CATEGORIES = [
  "TVs",
  "Laptops",
  "Audio",
  "Smart home",
  "Gaming",
  "Kitchen & home",
  "Streaming",
];

export function money(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

export function discountPct(d) {
  return Math.round((1 - d.price / d.was) * 100);
}

export function savedAmount(d) {
  return d.was - d.price;
}

export function tileLabel(category) {
  const map = {
    TVs: "TV",
    Laptops: "PC",
    Audio: "AU",
    "Smart home": "HOME",
    Gaming: "PLAY",
    "Kitchen & home": "HOME",
    Streaming: "TV",
  };
  return map[category] ?? "DEAL";
}

export function tileClass(category) {
  return "tile " + category.toLowerCase().replace(/[^a-z]+/g, "-");
}

function storeOf(d) {
  return d.store;
}

export function statsLine() {
  const total = deals.length;
  const lows = deals.filter((d) => d.verdict === "new-low").length;
  const avg = Math.round(deals.reduce((s, d) => s + discountPct(d), 0) / total);
  const saved = deals.reduce((s, d) => s + savedAmount(d), 0);
  return { total, lows, avg, saved };
}

export function heroDeals() {
  // The three sharpest new lows, by discount, lead the page.
  return [...deals]
    .filter((d) => d.verdict === "new-low")
    .sort((a, b) => discountPct(b) - discountPct(a))
    .slice(0, 3);
}

export function filterDeals(state) {
  const q = state.q.trim().toLowerCase();
  return deals.filter((d) => {
    if (state.category !== "All" && d.category !== state.category) return false;
    if (state.store !== "All" && d.store !== state.store) return false;
    if (discountPct(d) < state.minDiscount) return false;
    if (state.newLowsOnly && d.verdict !== "new-low") return false;
    if (q && !(d.title + " " + d.store + " " + d.category).toLowerCase().includes(q)) return false;
    return true;
  }).sort((a, b) => {
    if (state.sort === "discount") return discountPct(b) - discountPct(a);
    if (state.sort === "saving") return savedAmount(b) - savedAmount(a);
    if (state.sort === "price") return a.price - b.price;
    return a.title.localeCompare(b.title);
  });
}

export function renderHome(app, state, onState) {
  const stats = statsLine();
  const hero = heroDeals();
  const shown = filterDeals(state);
  const stores = ["All", ...new Set(deals.map((d) => d.store))];

  app.innerHTML = `
    <section class="hero">
      <h1>Black Friday 2026, <em>checked deal by deal.</em></h1>
      <p>${stats.total} real deals from Amazon, Walmart, Best Buy, Dell, Disney+ and Apple. Every price was read at the store on 27 Nov 2026, and every deal carries an honest verdict: a new low, a strong deal, or a routine sale.</p>
      <div class="stats">
        <div class="stat"><b>${stats.total}</b><span>deals checked</span></div>
        <div class="stat"><b>${stats.lows}</b><span>new lows</span></div>
        <div class="stat"><b>${stats.avg}%</b><span>average discount</span></div>
        <div class="stat"><b>${money(stats.saved)}</b><span>total savings</span></div>
      </div>
      <div class="hero-deals">
        ${hero.map((d) => `
          <a class="hero-deal" href="#/deal/${d.id}">
            <span class="kicker">Top new low</span>
            <h3>${d.title}</h3>
            <span class="store">${d.store} · ${d.category}</span>
            <div class="prices"><b>${money(d.price)}${d.monthly ? "/mo" : ""}</b><s>${money(d.was)}${d.monthly ? "/mo" : ""}</s><span class="pct">-${discountPct(d)}%</span></div>
          </a>`).join("")}
      </div>
    </section>
    <section class="filters" aria-label="Search and filter deals">
      <div class="filters-row">
        <input type="search" id="q" placeholder="Search deals, stores, categories…" value="${state.q}" aria-label="Search deals">
        <select id="store" aria-label="Filter by store">
          ${stores.map((s) => `<option ${s === state.store ? "selected" : ""}>${s}</option>`).join("")}
        </select>
        <select id="minDiscount" aria-label="Minimum discount">
          ${[0, 20, 30, 40, 50].map((n) => `<option value="${n}" ${state.minDiscount === n ? "selected" : ""}>${n === 0 ? "Any discount" : n + "% off or more"}</option>`).join("")}
        </select>
        <select id="sort" aria-label="Sort deals">
          <option value="discount" ${state.sort === "discount" ? "selected" : ""}>Biggest discount</option>
          <option value="saving" ${state.sort === "saving" ? "selected" : ""}>Biggest saving</option>
          <option value="price" ${state.sort === "price" ? "selected" : ""}>Lowest price</option>
          <option value="name" ${state.sort === "name" ? "selected" : ""}>Name A–Z</option>
        </select>
        <label class="check"><input type="checkbox" id="newLowsOnly" ${state.newLowsOnly ? "checked" : ""}> New lows only</label>
      </div>
      <div class="chips" role="group" aria-label="Filter by category">
        ${["All", ...CATEGORIES].map((c) => `<button class="chip" data-category="${c}" aria-pressed="${state.category === c}">${c}</button>`).join("")}
      </div>
    </section>
    <p class="count-line">Showing <b>${shown.length}</b> of ${deals.length} deals · Prices checked ${CHECKED_LABEL}</p>
    <section class="grid" aria-label="Deals">
      ${shown.map((d) => `
        <a class="card" href="#/deal/${d.id}">
          <div class="card-top">
            <span class="${tileClass(d.category)}">${tileLabel(d.category)}</span>
            <span class="verdict ${d.verdict}">${VERDICT_LABEL[d.verdict]}</span>
          </div>
          <h3>${d.title}</h3>
          <div class="meta">${storeOf(d)} · ${d.category}</div>
          <div class="prices"><b>${money(d.price)}${d.monthly ? "/mo" : ""}</b><s>${money(d.was)}${d.monthly ? "/mo" : ""}</s><span class="pct">-${discountPct(d)}%</span></div>
          <div class="save">Save ${money(savedAmount(d))}${d.monthly ? " a month" : ""}</div>
          <div class="checked">Checked ${CHECKED_LABEL} · ${d.source}</div>
          <div class="cta">View at ${d.store} →</div>
        </a>`).join("")}
    </section>
    ${shown.length === 0 ? `<p class="empty">No deals match those filters. Try clearing the search or lowering the minimum discount.</p>` : ""}
  `;

  app.querySelector("#q").addEventListener("input", (e) => onState({ q: e.target.value }));
  app.querySelector("#store").addEventListener("change", (e) => onState({ store: e.target.value }));
  app.querySelector("#minDiscount").addEventListener("change", (e) => onState({ minDiscount: Number(e.target.value) }));
  app.querySelector("#sort").addEventListener("change", (e) => onState({ sort: e.target.value }));
  app.querySelector("#newLowsOnly").addEventListener("change", (e) => onState({ newLowsOnly: e.target.checked }));
  app.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => onState({ category: chip.dataset.category }));
  });
}

export function renderDetail(app, id) {
  const d = deals.find((x) => x.id === id);
  if (!d) {
    app.innerHTML = `<div class="detail"><p><a class="back" href="#/">← All deals</a></p><p class="empty">That deal is not in this finder.</p></div>`;
    return;
  }
  app.innerHTML = `
    <div class="detail">
      <p><a class="back" href="#/">← All deals</a></p>
      <span class="verdict ${d.verdict}">${VERDICT_LABEL[d.verdict]}</span>
      <h1>${d.title}</h1>
      <p class="meta">${d.store} · ${d.category} · Checked ${CHECKED_LABEL}</p>
      <div class="detail-box">
        <div class="big-price">${money(d.price)}${d.monthly ? "/mo" : ""}<s>${money(d.was)}${d.monthly ? "/mo" : ""}</s><span class="pct">-${discountPct(d)}%</span></div>
        <div class="save-line">Save ${money(savedAmount(d))}${d.monthly ? " every month" : ""} off the usual price.</div>
        <p class="note">${d.note}</p>
        <p class="source">Price read at ${d.store} on 27 Nov 2026. Source: ${d.source}. Prices move during Black Friday: confirm the price at checkout before you buy.</p>
        <a class="buy-btn" href="${d.url}" target="_blank" rel="noopener">View at ${d.store} →</a>
      </div>
    </div>
  `;
}
