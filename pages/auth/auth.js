// Register logic
document.getElementById("registerForm")?.addEventListener("submit", e => {
  e.preventDefault();

  const user = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value
  };

  localStorage.setItem("user", JSON.stringify(user));
  showToast("Account created successfully!");
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);
});

// Login logic
document.getElementById("loginForm")?.addEventListener("submit", e => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));
  const emailInput = document.getElementById("email").value.trim();
  const passInput = document.getElementById("password").value;

  if (user && emailInput === user.email && passInput === user.password) {
    localStorage.setItem("loggedIn", true);
    window.location.href = "../analytics/analytics.html";
  } else {
    showToast("Invalid credentials, please try again.", "error");
  }
});
