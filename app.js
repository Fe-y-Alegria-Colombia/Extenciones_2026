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

  const icon = document.createElement("span");
  icon.className = "card-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = "&#9742;";

  const area = document.createElement("div");
  area.className = "card-area";
  area.textContent = item.area || "SIN ÁREA";

  card.appendChild(icon);
  card.appendChild(area);

  const card2 = document.createElement("div");
  card2.className = "card2";

  const upper = document.createElement("div");
  upper.className = "upper";

  const nameText = document.createElement("div");
  nameText.className = "nametext";
  nameText.textContent = item.name || "SIN NOMBRE";

  upper.appendChild(nameText);

  const lower = document.createElement("div");
  lower.className = "lower";

  const extText = document.createElement("div");
  extText.className = "exttext";
  extText.textContent = item.extension;

  const extLabel = document.createElement("div");
  extLabel.className = "extlabel";
  extLabel.textContent = "EXTENSIÓN";

  lower.appendChild(extText);
  lower.appendChild(extLabel);

  card2.appendChild(upper);
  card2.appendChild(lower);

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
