const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const noResults = document.getElementById("noResults");

function renderTable(data) {
  tableBody.innerHTML = "";

  if (data.length === 0) {
    noResults.hidden = false;
    return;
  }

  noResults.hidden = true;

  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(item.extension)}</td>
      <td>${escapeHtml(item.area)}</td>
      <td>${escapeHtml(item.name)}</td>
    `;
    tableBody.appendChild(row);
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
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
  renderTable(filtered);
});

renderTable(window.extensionsData || []);
