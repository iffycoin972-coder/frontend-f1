// Login / Register logic (localStorage demo)
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  const msg = (el, text, isError=false) => {
    if (!el) return;
    el.textContent = text;
    el.classList.toggle("error", !!isError);
    el.style.display = "block";
  };

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const out = document.getElementById("loginMsg");
      out.style.display = "none";

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      try {
        await AM.loginUser(email, password);
        msg(out, "Signed in! Redirecting…");
        setTimeout(() => (window.location.href = "home.html"), 600);
      } catch (err) {
        msg(out, err.message || "Login failed.", true);
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const out = document.getElementById("registerMsg");
      out.style.display = "none";

      const firstName = document.getElementById("regFirst").value.trim();
      const lastName = document.getElementById("regLast").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const role = document.getElementById("regRole").value;
      const password = document.getElementById("regPassword").value;
      const confirm = document.getElementById("regConfirm").value;

      if (password !== confirm) {
        msg(out, "Passwords do not match.", true);
        return;
      }

      try {
        await AM.registerUser({ firstName, lastName, email, password, role });
        msg(out, "Account created! Redirecting…");
        setTimeout(() => (window.location.href = "home.html"), 650);
      } catch (err) {
        msg(out, err.message || "Register failed.", true);
      }
    });
  }
});
