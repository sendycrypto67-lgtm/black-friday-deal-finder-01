// DealHawk entry point: hash routing (#/ for the list, #/deal/<id> for a deal)
// and the filter state for the home view. Re-renders on every hash change.

import { CHECKED_LABEL } from "./data.js";
import { renderHome, renderDetail } from "./views.js";

const app = document.getElementById("app");
const topbarChecked = document.getElementById("topbar-checked");
topbarChecked.textContent = "Prices checked " + CHECKED_LABEL;

const state = {
  q: "",
  category: "All",
  store: "All",
  minDiscount: 0,
  sort: "discount",
  newLowsOnly: false,
};

function renderList() {
  renderHome(app, state, (patch) => {
    Object.assign(state, patch);
    renderList();
    const q = document.getElementById("q");
    if (q && patch.q !== undefined) {
      q.focus();
      q.setSelectionRange(q.value.length, q.value.length);
    }
  });
}

function route() {
  const hash = window.location.hash || "#/";
  const match = hash.match(/^#\/deal\/([\w-]+)$/);
  if (match) {
    renderDetail(app, match[1]);
    window.scrollTo(0, 0);
    return;
  }
  renderList();
}

window.addEventListener("hashchange", route);
route();
