function initCreate() {
  const cats = getCategories();
  const select = document.getElementById('category');
  if (select) {
    select.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
  }
}

document.getElementById("createPromptForm")?.addEventListener("submit", e => {
  e.preventDefault();
  
  const prompts = getPrompts();
  const newPrompt = {
    id: Date.now(),
    title: document.getElementById("title").value.trim(),
    text: document.getElementById("text").value,
    category: document.getElementById("category").value,
    tags: document.getElementById("tags").value.split(",").map(t => t.trim()).filter(t => t),
    public: document.getElementById("public").checked,
    favorite: false
  };

  prompts.push(newPrompt);
  savePrompts(prompts);
  
  showToast("Prompt created successfully!");
  setTimeout(() => {
    window.location.href = "prompts.html";
  }, 1000);
});

document.addEventListener('DOMContentLoaded', initCreate);
