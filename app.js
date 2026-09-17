const cardsContainer = document.getElementById("cardsContainer");
const searchInput = document.getElementById("searchInput");
const noResults = document.getElementById("noResults");

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function createCard(item) {
  const cardm = document.createElement("div");
  cardm.className = "cardm";
  if (item.regional) cardm.classList.add("regional");

  const card = document.createElement("div");
  card.className = item.regional ? "card card--regional" : "card";

  const left = document.createElement("div");
  left.className = "card-left";
  if (item.regional) left.classList.add("card-left--regional");

  const leftIcons = document.createElement("div");
  leftIcons.className = "card-left-icons";

  for (let i = 0; i < 7; i++) {
    const icon = document.createElement("span");
    icon.className = "card-left-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = item.icon || "&#9742;";
    leftIcons.appendChild(icon);
  }

  left.appendChild(leftIcons);

  const right = document.createElement("div");
  right.className = "card-right";

  const icon = document.createElement("span");
  icon.className = item.regional ? "card-icon card-icon--regional" : "card-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = item.icon || "&#9742;";

  const area = document.createElement("div");
  area.className = "card-area";
  area.textContent = item.area || "SIN ÁREA";

  const ext = document.createElement("div");
  ext.className = "card-extension";
  ext.textContent = item.extension;

  const name = document.createElement("div");
  name.className = "card-name";
  name.textContent = item.name ? escapeHtml(item.name) : "SIN NOMBRE";

  if (item.regional) {
    const badge = document.createElement("span");
    badge.className = "regional-badge";
    badge.textContent = "REG. BOGOTÁ";
    right.appendChild(badge);
  } else {
    const badge = document.createElement("span");
    badge.className = "nac-badge";
    badge.textContent = "OFICINA NACIONAL";
    right.appendChild(badge);
  }

  right.appendChild(icon);
  right.appendChild(area);
  right.appendChild(ext);
  right.appendChild(name);

  const card2 = document.createElement("div");
  card2.className = "card2";

  card.appendChild(left);
  card.appendChild(right);
  cardm.appendChild(card);
  cardm.appendChild(card2);

  return cardm;
}

function createSectionTitle(text, index) {
  const title = document.createElement("div");
  title.className = "section-title";
  title.style.animationDelay = `${index * 0.04}s`;
  title.innerHTML = `<span class="section-title__bar"></span><span class="section-title__text">${escapeHtml(text)}</span>`;
  return title;
}

function renderCards(data) {
  cardsContainer.innerHTML = "";

  if (data.length === 0) {
    noResults.hidden = false;
    return;
  }

  noResults.hidden = true;

  const mainItems = data.filter((item) => !item.regional);
  const regionalItems = data.filter((item) => item.regional);

  let index = 0;

  mainItems.forEach((item) => {
    const card = createCard(item);
    card.style.animation = `rowIn 0.35s ease-out both`;
    card.style.animationDelay = `${index * 0.04}s`;
    cardsContainer.appendChild(card);
    index++;
  });

  if (regionalItems.length > 0) {
    const sectionTitle = createSectionTitle("REGIONAL BOGOTÁ", index * 0.04);
    cardsContainer.appendChild(sectionTitle);
    index++;

    regionalItems.forEach((item) => {
      const card = createCard(item);
      card.style.animation = `rowIn 0.35s ease-out both`;
      card.style.animationDelay = `${index * 0.04}s`;
      cardsContainer.appendChild(card);
      index++;
    });
  }
}

function filterExtensions(query) {
  const term = query.toLowerCase().trim();

  if (!term) {
    return window.extensionsData || [];
  }

  return (window.extensionsData || []).filter((item) => {
    return (
      item.extension.toLowerCase().includes(term) ||
      item.area.toLowerCase().includes(term) ||
      item.name.toLowerCase().includes(term)
    );
  });
}

searchInput.addEventListener("input", () => {
  const filtered = filterExtensions(searchInput.value);
  renderCards(filtered);
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    searchInput.value = "";
    renderCards(window.extensionsData || []);
    searchInput.blur();
  }
});

renderCards(window.extensionsData || []);

(function initEyeTracking() {
  const svg = document.querySelector("svg.side-blob-img");
  const track = document.getElementById("eyeTrack");
  const eyes = document.getElementById("eyeScale");
  if (!svg || !track || !eyes) return;

  const MAX = 26;
  const EYE_CX = -26;
  const EYE_CY = 20;
  const DEG = Math.PI / 180;

  const EXPR = {
    neutral: { sx: 1, sy: 1, rot: 0 },
    curious: { sx: 1.4, sy: 1.4, rot: 0 },
    happy: { sx: 1.22, sy: 0.78, rot: 0 },
    sad: { sx: 1.5, sy: 0.38, rot: -8 },
  };

  let expression = "neutral";
  let targetX = 0;
  let targetY = 0;
  let curX = 0;
  let curY = 0;
  let v = { sx: 1, sy: 1, rot: 0 };

  track.removeAttribute("transform");

  window.addEventListener("pointermove", (event) => {
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const half = Math.max(rect.width / 2, 1);
    const nx = Math.max(-1, Math.min(1, (event.clientX - cx) / half));
    const ny = Math.max(-1, Math.min(1, (event.clientY - cy) / half));
    targetX = nx * MAX;
    targetY = ny * MAX;
  });

  document.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
  });

  function setExpression(name) {
    if (EXPR[name]) expression = name;
  }

  searchInput.addEventListener("focus", () => {
    const term = searchInput.value.trim();
    setExpression(term ? "happy" : "curious");
  });

  searchInput.addEventListener("blur", () => {
    const term = searchInput.value.trim();
    setExpression(term && filterExtensions(term).length ? "happy" : "neutral");
  });

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.trim();
    if (!term) {
      setExpression("neutral");
      return;
    }
    setExpression(filterExtensions(term).length ? "happy" : "sad");
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setExpression("neutral");
  });

  function tick() {
    const k = 0.14;
    curX += (targetX - curX) * 0.12;
    curY += (targetY - curY) * 0.12;

    const t = EXPR[expression];
    v.sx += (t.sx - v.sx) * k;
    v.sy += (t.sy - v.sy) * k;
    v.rot += (t.rot - v.rot) * k;

    const a = v.rot * DEG;
    const sa = Math.sin(a);
    const ca = Math.cos(a);
    const qx = EYE_CX * (v.sx - 1);
    const qy = EYE_CY * (v.sy - 1);
    const tx = curX - (ca * qx - sa * qy);
    const ty = curY - (sa * qx + ca * qy);

    eyes.setAttribute(
      "transform",
      `translate(${tx.toFixed(3)} ${ty.toFixed(3)}) rotate(${v.rot.toFixed(2)} ${EYE_CX} ${EYE_CY}) scale(${v.sx.toFixed(3)} ${v.sy.toFixed(3)})`
    );

    requestAnimationFrame(tick);
  }

  tick();
})();