
const SEED_TEMPLATES = [
  {
    id: "tpl-1",
    title: "SEO Blog Post Writer",
    category: "SEO",
    prompt: "Write a high-quality, SEO-optimized blog post of about [Length] words about [Topic]. Include the primary keyword '[Primary Keyword]' and the secondary keywords [Secondary Keywords] naturally throughout the text. Ensure a compelling headline, an engaging introduction, structured subheadings (H2, H3), and a strong conclusion with a call to action.",
    tags: ["SEO", "writing", "blog"],
    createdAt: "2026-05-01T12:00:00Z"
  },
  {
    id: "tpl-2",
    title: "JavaScript Refactoring Assistant",
    category: "Coding",
    prompt: "Refactor the following JavaScript code to improve its readability, performance, and maintainability. Follow clean code principles, such as reducing complexity, using modern ES6+ features, and ensuring proper variable naming. Explain the improvements you made.\n\nCode:\n[Insert Code Here]",
    tags: ["coding", "javascript", "refactor"],
    createdAt: "2026-05-02T10:30:00Z"
  },
  {
    id: "tpl-3",
    title: "Cold Email Outreach Template",
    category: "Marketing",
    prompt: "Draft a personalized cold email outreach to [Prospect Name], the [Prospect Role] at [Prospect Company]. The goal is to introduce our product/service '[My Product Name]' which helps businesses solve [Pain Point]. Keep the email concise, professional, and under 150 words, ending with a clear, low-pressure call to action.",
    tags: ["marketing", "email", "outreach"],
    createdAt: "2026-05-03T15:45:00Z"
  },
  {
    id: "tpl-4",
    title: "Business SWOT Analysis",
    category: "Business",
    prompt: "Conduct a comprehensive SWOT analysis for [Company Name]. Provide detailed insights for each quadrant:\n1. Strengths (Internal, positive factors)\n2. Weaknesses (Internal, negative factors)\n3. Opportunities (External, positive factors)\n4. Threats (External, negative factors)\nFormat the output in a clear, structured list with actionable recommendations.",
    tags: ["business", "strategy", "analysis"],
    createdAt: "2026-05-04T09:15:00Z"
  },
  {
    id: "tpl-5",
    title: "Instagram Caption Generator",
    category: "Social Media",
    prompt: "Write 3 different engaging Instagram captions for a post about [Post Subject]. For each caption, provide:\n1. An attention-grabbing hook\n2. Body text with a clear message and personality\n3. Relevant hashtags and a call-to-action (CTA) to encourage comments.",
    tags: ["social media", "instagram", "marketing"],
    createdAt: "2026-05-05T14:20:00Z"
  },
  {
    id: "tpl-6",
    title: "Weekly Planning Planner",
    category: "Productivity",
    prompt: "Help me organize my weekly schedule based on my top 3 priorities: [Priority 1], [Priority 2], and [Priority 3]. Distribute my key tasks: [Task List] across a Monday-to-Friday schedule, optimizing for high-energy times in the morning for deep work, and administrative tasks in the afternoon.",
    tags: ["productivity", "planning", "schedule"],
    createdAt: "2026-05-06T08:00:00Z"
  }
];


let currentPage = 1;
const ITEMS_PER_PAGE = 4;
let activeTagFilter = "";
let modalTags = [];
let activeUseTemplate = null;
let placeholderValues = {};


function getTemplates() {
  let templates = JSON.parse(localStorage.getItem("prompt_templates"));
  if (!templates || !Array.isArray(templates) || templates.length === 0) {
    templates = SEED_TEMPLATES;
    localStorage.setItem("prompt_templates", JSON.stringify(templates));
  }
  return templates;
}

function saveTemplates(templates) {
  localStorage.setItem("prompt_templates", JSON.stringify(templates));
}


function safeEscape(unsafe) {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function filterTemplates(page = 1) {
  currentPage = page;
  const templates = getTemplates();
  const searchInput = document.getElementById("search");
  const search = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCat = categoryFilter ? categoryFilter.value : "";
  
  const filtered = templates.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(search) || 
      t.category.toLowerCase().includes(search) || 
      t.prompt.toLowerCase().includes(search) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(search)));
      
    const matchesCat = selectedCat === "" || t.category === selectedCat;
    const matchesTag = activeTagFilter === "" || (t.tags && t.tags.includes(activeTagFilter));
    
    return matchesSearch && matchesCat && matchesTag;
  });

  const grid = document.getElementById("templatesGrid");
  if (!grid) return;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 60px 20px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16" style="margin-bottom: 16px; opacity: 0.5;">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.274-2.24-2.607-2.24-1.503 0-2.586.84-2.655 2.217zm2.49 5.86a.602.602 0 1 0 0-1.204.602.602 0 0 0 0 1.204z"/>
        </svg>
        <h3>No templates found</h3>
        <p style="margin-top: 8px;">Try adjusting your search query, selecting another category, or creating a new template.</p>
      </div>
    `;
    renderPagination(0);
    return;
  }

  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  grid.innerHTML = paginated.map(t => {
    
    const escapedPrompt = safeEscape(t.prompt);
    const jsonPreviewObj = {
      id: t.id,
      title: t.title,
      category: t.category,
      tags: t.tags,
      createdAt: t.createdAt
    };
    const jsonString = JSON.stringify(jsonPreviewObj, null, 2);

    return `
      <div class="card" id="card-${t.id}">
        <div class="card-header">
          <div>
            <span class="card-category">${t.category}</span>
            <h3 class="card-title">${t.title}</h3>
          </div>
          <button onclick="copyTemplateJSON('${t.id}')" class="btn-icon" title="Copy JSON Data" style="position: relative;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M10.478 1.602a.5.5 0 0 0-.956-.29l-.4 1.335a.5.5 0 0 0 .956.29l.4-1.335zM7.105 1.15a.5.5 0 0 0-.555.432l-.2 1.335a.5.5 0 1 0 .99.148l.2-1.335a.5.5 0 0 0-.435-.555zm-3.21 1.2a.5.5 0 0 0-.84.542l.5 1.335a.5.5 0 0 0 .93-.348l-.5-1.335zm10.22 3.12a.5.5 0 0 0-.916.398l.5 1.335a.5.5 0 1 0 .93-.348l-.5-1.335zm-1.897 4.23a.5.5 0 0 0-.29.956l1.335.4a.5.5 0 1 0 .29-.956l-1.335-.4zm-3.12 10.22a.5.5 0 0 0 .398-.916l1.335-.5a.5.5 0 1 0-.348.93l-1.335.5zm-4.23-1.897a.5.5 0 0 0 .956.29l.4-1.335a.5.5 0 1 0-.956-.29l-.4 1.335zm-3.12-10.22a.5.5 0 0 0-.398.916l-1.335.5a.5.5 0 1 0 .348-.93l1.335-.5z"/>
              <path d="M9 15c-1.12 0-2.32-.46-3.21-1.22A5.4 5.4 0 0 1 4 9.5c0-3.04 2.46-5.5 5.5-5.5s5.5 2.46 5.5 5.5-2.46 5.5-5.5 5.5zm0-10C6.46 5 4 7.46 4 10.5S6.46 16 9.5 16s5.5-2.46 5.5-5.5S12.54 5 9.5 5z"/>
            </svg>
          </button>
        </div>
        
        <div class="card-body mb-1" style="font-size: 14px;">${escapedPrompt}</div>
        
        ${t.tags && t.tags.length > 0 ? `
          <div class="tags-container mb-1">
            ${t.tags.map(tag => `<span class="tag" style="cursor: pointer;" onclick="setTagFilter('${tag}')">${tag}</span>`).join('')}
          </div>
        ` : ""}

        <!-- JSON Preview Block -->
        <div style="margin-top: 8px; margin-bottom: 8px;">
          <span style="font-size: 11px; font-weight: bold; color: var(--text-secondary); text-transform: uppercase; display: block; margin-bottom: 4px;">Template Metadata (JSON)</span>
          <pre class="json-preview"><code>${safeEscape(jsonString)}</code></pre>
        </div>

        <div class="card-actions" style="gap: 12px;">
          <button onclick="copyTemplatePrompt('${t.id}')" class="btn btn-secondary" style="flex: 1;" title="Copy Raw Template">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
            </svg>
            Copy
          </button>
          <button onclick="loadUseTemplate('${t.id}')" class="btn btn-primary" style="flex: 1.5;" title="Fill Out and Use">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
            </svg>
            Use Template
          </button>
        </div>
      </div>
    `;
  }).join('');

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
  filterTemplates(page);
  document.querySelector('.content-area')?.scrollTo({ top: 0, behavior: 'smooth' });
}


function copyTemplatePrompt(id) {
  const templates = getTemplates();
  const t = templates.find(tpl => tpl.id === id);
  if (t) {
    navigator.clipboard.writeText(t.prompt).then(() => {
      showToast("Template prompt copied to clipboard!");
    });
  }
}

function copyTemplateJSON(id) {
  const templates = getTemplates();
  const t = templates.find(tpl => tpl.id === id);
  if (t) {
    const jsonString = JSON.stringify(t, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      showToast("Template JSON data copied!");
      
      
      const card = document.getElementById(`card-${id}`);
      if (card && !card.querySelector('.copy-success-badge')) {
        const badge = document.createElement('div');
        badge.className = 'copy-success-badge';
        badge.textContent = 'Copied JSON!';
        card.appendChild(badge);
        setTimeout(() => badge.remove(), 1500);
      }
    });
  }
}


function loadTagsFilter() {
  const templates = getTemplates();
  const allTags = new Set();
  templates.forEach(t => {
    if (t.tags) t.tags.forEach(tag => allTags.add(tag.toLowerCase()));
  });

  const container = document.getElementById("tagsFilterContainer");
  if (!container) return;

  let html = `<button class="filter-tag-btn ${activeTagFilter === "" ? "active" : ""}" onclick="setTagFilter('')">All Tags</button>`;
  
  Array.from(allTags).sort().forEach(tag => {
    html += `<button class="filter-tag-btn ${activeTagFilter === tag ? "active" : ""}" onclick="setTagFilter('${tag}')">${tag}</button>`;
  });

  container.innerHTML = html;
}

function setTagFilter(tag) {
  activeTagFilter = tag;
  loadTagsFilter();
  filterTemplates(1);
}


function loadDropdowns() {
  
  const cats = getCategories();
  const selectFilter = document.getElementById("categoryFilter");
  if (selectFilter) {
    selectFilter.innerHTML = '<option value="">All Categories</option>';
    cats.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      selectFilter.appendChild(opt);
    });
  }

  
  const selectModal = document.getElementById("templateCategory");
  if (selectModal) {
    selectModal.innerHTML = '';
    cats.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      selectModal.appendChild(opt);
    });
  }
}


function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}


function openAddTemplateModal() {
  modalTags = [];
  renderModalTags();
  document.getElementById("addTemplateForm").reset();
  openModal("addTemplateModal");
}

function closeAddTemplateModal() {
  closeModal("addTemplateModal");
}


document.getElementById("tagsInput")?.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    const tagVal = e.target.value.trim().toLowerCase();
    if (tagVal && !modalTags.includes(tagVal)) {
      modalTags.push(tagVal);
      renderModalTags();
    }
    e.target.value = "";
  }
});

function renderModalTags() {
  const container = document.getElementById("modalTagsList");
  if (!container) return;
  container.innerHTML = modalTags.map(tag => `
    <span class="tag-badge">
      ${tag}
      <span class="remove-tag" onclick="removeModalTag('${tag}')">&times;</span>
    </span>
  `).join('');
}

function removeModalTag(tag) {
  modalTags = modalTags.filter(t => t !== tag);
  renderModalTags();
}


document.getElementById("addTemplateForm")?.addEventListener("submit", e => {
  e.preventDefault();
  
  const title = document.getElementById("templateTitle").value.trim();
  const category = document.getElementById("templateCategory").value;
  const prompt = document.getElementById("templatePrompt").value;
  
  const templates = getTemplates();
  const newTemplate = {
    id: "tpl-" + Date.now(),
    title,
    category,
    prompt,
    tags: [...modalTags],
    createdAt: new Date().toISOString()
  };

  templates.push(newTemplate);
  saveTemplates(templates);
  
  closeAddTemplateModal();
  showToast("Template created successfully!");
  
  
  loadTagsFilter();
  filterTemplates(1);
});


function extractPlaceholders(text) {
  const matches = text.match(/\[[^\]]+\]/g) || [];
  return [...new Set(matches.map(m => m.slice(1, -1)))];
}

function loadUseTemplate(id) {
  const templates = getTemplates();
  const tpl = templates.find(t => t.id === id);
  if (!tpl) return;
  
  activeUseTemplate = tpl;
  document.getElementById("useTemplateTitle").textContent = `Use Template: ${tpl.title}`;
  document.getElementById("useTemplateCategory").textContent = tpl.category;
  document.getElementById("useTemplateDesc").textContent = tpl.prompt.substring(0, 150) + (tpl.prompt.length > 150 ? "..." : "");
  
  const placeholders = extractPlaceholders(tpl.prompt);
  const container = document.getElementById("placeholdersContainer");
  container.innerHTML = "";
  
  placeholderValues = {};
  
  if (placeholders.length === 0) {
    container.innerHTML = `<p style="color: var(--text-secondary); font-size: 14px;">No custom placeholders in this template. You can copy the full prompt directly.</p>`;
  } else {
    placeholders.forEach(p => {
      placeholderValues[p] = "";
      const fg = document.createElement("div");
      fg.className = "form-group";
      fg.innerHTML = `
        <label for="ph-${p}">${p}</label>
        <input type="text" id="ph-${p}" class="form-control" placeholder="Enter value for [${p}]..." oninput="updatePlaceholder('${p}', this.value)">
      `;
      container.appendChild(fg);
    });
  }
  
  updateCompiledPromptDisplay();
  openModal("useTemplateModal");
}

function closeUseTemplateModal() {
  closeModal("useTemplateModal");
  activeUseTemplate = null;
  placeholderValues = {};
}

function updatePlaceholder(placeholder, value) {
  placeholderValues[placeholder] = value;
  updateCompiledPromptDisplay();
}

function updateCompiledPromptDisplay() {
  if (!activeUseTemplate) return;
  let compiled = activeUseTemplate.prompt;
  Object.keys(placeholderValues).forEach(p => {
    const val = placeholderValues[p] || `[${p}]`;
    compiled = compiled.split(`[${p}]`).join(val);
  });
  document.getElementById("compiledPromptText").value = compiled;
}

function copyCompiledPrompt() {
  const text = document.getElementById("compiledPromptText").value;
  if (text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Compiled prompt copied to clipboard!");
      closeUseTemplateModal();
    });
  }
}


document.addEventListener('DOMContentLoaded', () => {
  loadDropdowns();
  loadTagsFilter();
  filterTemplates(1);
});
