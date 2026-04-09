// ===== DATA MANAGEMENT =====
// NOTE: Seed data (DEFAULT_CATEGORIES and SEED_PROMPTS) has been moved to:
// - js/data/categories.js
// - js/data/prompts.js
// Please ensure these files are included in your HTML before utils.js or that this file is updated to load them.


function getCategories() {
  let cats = JSON.parse(localStorage.getItem("categories"));
  
  // If no data OR someone has the old 5 default categories only, seed with the new 20+ list
  const isOldDefault = cats && cats.length === 5 && cats.includes("Marketing") && cats.includes("Other");
  
  if (!cats || !Array.isArray(cats) || cats.length === 0 || isOldDefault) {
    if (typeof DEFAULT_CATEGORIES !== 'undefined') {
      cats = DEFAULT_CATEGORIES;
    } else {
      cats = ["Marketing", "Programming", "Content Writing", "Productivity", "Other"];
    }
    localStorage.setItem("categories", JSON.stringify(cats));
  }
  return [...new Set(cats.map(c => c.trim()))];
}

function getPrompts() {
  let prompts = JSON.parse(localStorage.getItem("prompts"));
  if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
    if (typeof SEED_PROMPTS !== 'undefined') {
      prompts = SEED_PROMPTS;
    } else {
      prompts = [];
    }
    localStorage.setItem("prompts", JSON.stringify(prompts));
  }
  return prompts;
}

function savePrompts(prompts) {
  localStorage.setItem("prompts", JSON.stringify(prompts));
}

function saveCategories(categories) {
  localStorage.setItem("categories", JSON.stringify(categories));
}

// ===== THEME =====
function initTheme() {
  const theme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeIcon(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeIcon(next);
  
  // Custom event for pages that need to react to theme change
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: next } }));
}

function updateThemeIcon(theme) {
  const btn = document.getElementById("themeToggleBtn");
  if (btn) {
    btn.innerHTML = theme === "dark" ? "☀️ Light" : "🌙 Dark";
  }
}

// ===== AUTH =====
function checkAuth() {
  const publicPages = ['login.html', 'register.html', 'public.html', 'index.html'];
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  const loggedIn = localStorage.getItem("loggedIn");
  
  if (!loggedIn && !publicPages.includes(currentPage)) {
    // Determine the path to login.html based on current location
    const depth = window.location.pathname.split('/').length - 2;
    const prefix = depth > 0 ? '../'.repeat(depth) : '';
    // window.location.href = prefix + 'pages/auth/login.html';
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  const depth = window.location.pathname.split('/').length - 2;
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  window.location.href = prefix + 'pages/auth/login.html';
}

// Helper for escaping HTML
function escapeHtml(unsafe) {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "\\n");
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  // Create icon based on type
  let icon = '';
  if (type === 'success') icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>';
  if (type === 'error') icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>';

  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Initialize on load
initTheme();
// Seeding check on every page load to ensure data exists
getCategories();
getPrompts();
