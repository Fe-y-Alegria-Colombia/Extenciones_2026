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

  const card = document.createElement("div");
  card.className = "card";

  const top = document.createElement("div");
  top.className = "card-top";

  const icon = document.createElement("span");
  icon.className = "card-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = item.icon || "&#9742;";

  const area = document.createElement("div");
  area.className = "card-area";
  area.textContent = item.area || "SIN ÁREA";

  top.appendChild(icon);
  top.appendChild(area);

  const ext = document.createElement("div");
  ext.className = "card-extension";
  ext.textContent = item.extension;

  const name = document.createElement("div");
  name.className = "card-name";
  name.textContent = item.name ? escapeHtml(item.name) : "SIN NOMBRE";

  card.appendChild(top);
  card.appendChild(ext);
  card.appendChild(name);

  const card2 = document.createElement("div");
  card2.className = "card2";

  cardm.appendChild(card);
  cardm.appendChild(card2);

  return cardm;
}

function renderCards(data) {
  cardsContainer.innerHTML = "";

  if (data.length === 0) {
    noResults.hidden = false;
    return;
  }

  noResults.hidden = true;

  data.forEach((item, index) => {
    const card = createCard(item);
    card.style.animation = `rowIn 0.35s ease-out both`;
    card.style.animationDelay = `${index * 0.04}s`;
    cardsContainer.appendChild(card);
  });
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
