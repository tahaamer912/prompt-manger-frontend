function loadView() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  if (!id) return;

  const prompts = getPrompts();
  const prompt = prompts.find(p => p.id == id);

  if (prompt) {
    document.getElementById("viewTitle").innerText = prompt.title;
    document.getElementById("viewText").innerText = prompt.text;
    document.getElementById("viewCategory").innerText = (prompt.category || "Uncategorized") + (prompt.public ? ' (🌍 Public)' : ' (🔒 Private)');
    
    const tagsContainer = document.getElementById("viewTags");
    if (tagsContainer && prompt.tags) {
      tagsContainer.innerHTML = prompt.tags.map(t => `<span class="tag">${t}</span>`).join('');
    }
    
    const copyBtn = document.getElementById("copyBtn");
    if (copyBtn) {
      copyBtn.onclick = function() {
        navigator.clipboard.writeText(prompt.text).then(() => {
          const oldText = copyBtn.innerText;
          copyBtn.innerText = "Copied!";
          setTimeout(() => { copyBtn.innerText = oldText; }, 2000);
        });
      };
    }
  } else {
      document.getElementById("viewTitle").innerText = "Prompt Not Found";
      document.getElementById("viewText").innerText = "Sorry, we couldn't find the prompt you're looking for.";
  }
}

document.addEventListener('DOMContentLoaded', loadView);
