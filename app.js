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
    badge.textContent = "NAC. BOGOTA";
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
    const sectionTitle = createSectionTitle("NAC. BOGOTÁ", index * 0.04);
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
