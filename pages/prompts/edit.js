function loadEdit() {
  const cats = getCategories();
  const select = document.getElementById('category');
  if (select) {
    select.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
  }

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  if (!id) {
    showToast("No prompt ID provided!", "error");
    setTimeout(() => {
      window.location.href = "prompts.html";
    }, 1000);
    return;
  }

  const prompts = getPrompts();
  const prompt = prompts.find(p => p.id == id);

  if (prompt) {
    document.getElementById("title").value = prompt.title || "";
    document.getElementById("text").value = prompt.text || "";
    document.getElementById("category").value = prompt.category || "Other";
    document.getElementById("tags").value = (prompt.tags || []).join(", ");
    document.getElementById("public").checked = !!prompt.public;
  } else {
    showToast("Prompt not found!", "error");
    setTimeout(() => {
      window.location.href = "prompts.html";
    }, 1000);
  }
}

document.getElementById("editPromptForm")?.addEventListener("submit", e => {
  e.preventDefault();

  const id = new URLSearchParams(window.location.search).get("id");
  let prompts = getPrompts();

  let updated = false;
  prompts = prompts.map(p => {
    if (p.id == id) {
      p.title = document.getElementById("title").value.trim();
      p.text = document.getElementById("text").value;
      p.category = document.getElementById("category").value;
      p.tags = document.getElementById("tags").value.split(",").map(t => t.trim()).filter(t => t);
      p.public = document.getElementById("public").checked;
      updated = true;
    }
    return p;
  });

  if (updated) {
    savePrompts(prompts);
    showToast("Prompt updated successfully!");
    setTimeout(() => {
      window.location.href = "prompts.html";
    }, 1000);
  } else {
    showToast("Failed to update prompt. ID mismatch?", "error");
  }
});

document.addEventListener('DOMContentLoaded', loadEdit);
