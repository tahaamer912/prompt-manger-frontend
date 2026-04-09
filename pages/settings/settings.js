function loadSettings() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    document.getElementById("profileName").value = user.name || '';
    document.getElementById("profileEmail").value = user.email || '';
  }
}

document.getElementById("settingsForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  let user = JSON.parse(localStorage.getItem("user")) || {};
  user.name = document.getElementById("profileName").value.trim();
  user.email = document.getElementById("profileEmail").value.trim();
  
  const pwd = document.getElementById("profilePassword").value;
  if (pwd) {
    user.password = pwd;
  }
  
  localStorage.setItem("user", JSON.stringify(user));
  showToast("Settings updated successfully!");
  document.getElementById("profilePassword").value = "";
});

document.addEventListener('DOMContentLoaded', loadSettings);
