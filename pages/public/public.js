let currentPage = 1;
const ITEMS_PER_PAGE = 4;

function loadPublicPrompts(page = 1) {
  currentPage = page;
  const prompts = getPrompts();
  const searchInput = document.getElementById("search");
  const search = searchInput ? searchInput.value.toLowerCase() : "";
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCat = categoryFilter ? categoryFilter.value : "";

  const container = document.getElementById("publicPrompts");
  if (!container) return;

  const filtered = prompts.filter(p => {
    if (!p.public) return false;
    const matchesSearch = p.title.toLowerCase().includes(search) || p.text.toLowerCase().includes(search);
    const matchesCat = selectedCat === "" || (p.category || "Other") === selectedCat;
    return matchesSearch && matchesCat;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 40px;">No public prompts found.</div>`;
    renderPagination(0);
    return;
  }

  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  container.innerHTML = paginated.map(p => `
    <div class="card">
      <div class="card-header">
        <div>
          <span class="card-category">${p.category || 'Other'}</span>
          <h3 class="card-title">${p.title}</h3>
        </div>
      </div>
      
      <div class="card-body mb-2">${p.text}</div>
      
      ${p.tags && p.tags.length > 0 ? `<div class="tags-container mb-2">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ""}

      <div class="card-actions">
        <button onclick="copyText('${escapeHtml(p.text)}')" class="btn btn-primary" style="flex: 2;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
          </svg>
          Copy
        </button>
        <button onclick="viewPrompt(${p.id})" class="btn btn-secondary">View</button>
      </div>
    </div>
  `).join('');

  renderPagination(filtered.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const container = document.getElementById("pagination");
  if (!container) return;

  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  let html = `
    <button onclick="changePage(${currentPage - 1})" class="page-btn arrow-btn" ${currentPage === 1 ? 'disabled' : ''}>&laquo; Prev</button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    // Simple pagination logic
    if (totalPages > 7) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        html += `<button onclick="changePage(${i})" class="page-btn ${i === currentPage ? 'active' : ''}">${i}</button>`;
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        if (i === currentPage - 2 && i > 2) html += `<span class="page-dots">...</span>`;
        if (i === currentPage + 2 && i < totalPages - 1) html += `<span class="page-dots">...</span>`;
      }
    } else {
      html += `<button onclick="changePage(${i})" class="page-btn ${i === currentPage ? 'active' : ''}">${i}</button>`;
    }
  }

  html += `
    <button onclick="changePage(${currentPage + 1})" class="page-btn arrow-btn" ${currentPage === totalPages ? 'disabled' : ''}>Next &raquo;</button>
  `;

  container.innerHTML = html;
}

function changePage(page) {
  loadPublicPrompts(page);
  // Optional: scroll back to top of container
  document.querySelector('.content-area')?.scrollTo({ top: 0, behavior: 'smooth' });
}

function viewPrompt(id) {
  window.location.href = `../prompts/view.html?id=${id}`;
}

function copyText(text) {
  navigator.clipboard.writeText(text.replace(/\\n/g, "\n")).then(() => {
    showToast("Prompt copied to clipboard!");
  });
}

function loadFilters() {
  // Get unique categories from public prompts
  const prompts = getPrompts();
  const cats = [...new Set(prompts.filter(p => p.public).map(p => p.category || 'Other'))];

  const select = document.getElementById("categoryFilter");
  if (!select) return;

  const currentVal = select.value;
  select.innerHTML = '<option value="">All Categories</option>';
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c === 'Other' ? '' : c;
    if (c === 'Other') opt.value = "Other";
    opt.textContent = c;
    if (opt.value === currentVal) opt.selected = true;
    select.appendChild(opt);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadFilters();
  loadPublicPrompts();
});
