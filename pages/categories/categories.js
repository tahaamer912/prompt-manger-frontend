let currentPage = 1;
const ITEMS_PER_PAGE = 5; // Slightly smaller for list items

function loadCategoriesUI(page = 1) {
  currentPage = page;
  const cats = getCategories();
  const list = document.getElementById("categoryList");
  if (!list) return;

  const paginated = cats.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  list.innerHTML = paginated.map(c => `
    <li style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-primary); padding: 12px 16px; border-radius: 8px; border: 1px solid var(--border);">
      <span>${c}</span>
      <button onclick="deleteCategory('${c}')" class="btn-icon" style="color: var(--danger);" title="Delete 🗑">🗑</button>
    </li>
  `).join('');

  renderPagination(cats.length);
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
  loadCategoriesUI(page);
  document.querySelector('.content-area')?.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById("addCategoryForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const newCat = document.getElementById("newCategory").value.trim();
  let cats = getCategories();

  if (newCat && !cats.includes(newCat)) {
    cats.push(newCat);
    saveCategories(cats);
    document.getElementById("newCategory").value = "";
    loadCategoriesUI();
  } else {
    showToast("Category already exists or invalid!", "error");
  }
});

function deleteCategory(cat) {
  if (cat === "Other") {
    showToast("Cannot delete the 'Other' category.", "error");
    return;
  }

  if (confirm(`Delete category "${cat}"? Prompts in this category will become 'Other'.`)) {
    let cats = getCategories().filter(c => c !== cat);
    saveCategories(cats);

    // Update prompts using this category
    let prompts = getPrompts();
    prompts = prompts.map(p => {
      if (p.category === cat) p.category = "Other";
      return p;
    });
    savePrompts(prompts);

    loadCategoriesUI();
  }
}

document.addEventListener('DOMContentLoaded', () => loadCategoriesUI(1));
