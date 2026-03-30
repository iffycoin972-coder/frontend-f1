const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const successMsg = document.getElementById("successMsg");

const togglePw = document.getElementById("togglePw");

togglePw.addEventListener("click", () => {
  const isHidden = password.type === "password";
  password.type = isHidden ? "text" : "password";
  togglePw.textContent = isHidden ? "Hide" : "Show";
});

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clearMessages() {
  emailError.textContent = "";
  passwordError.textContent = "";
  successMsg.textContent = "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearMessages();

  const emailVal = email.value.trim();
  const passVal = password.value;

  let ok = true;

  if (!emailVal) {
    emailError.textContent = "Email is required.";
    ok = false;
  } else if (!isValidEmail(emailVal)) {
    emailError.textContent = "Enter a valid email address.";
    ok = false;
  }

  if (!passVal) {
    passwordError.textContent = "Password is required.";
    ok = false;
  } else if (passVal.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters.";
    ok = false;
  }

  if (!ok) return;

  // Demo login only (no backend yet)
  if (emailVal.toLowerCase() === "demo@automarket.com" && passVal === "password123") {
    successMsg.textContent = "Login successful! (Demo mode)";
    localStorage.setItem("automarket_logged_in", "true");
    localStorage.setItem("automarket_user", emailVal);
  } else {
    successMsg.textContent = "Login submitted (Demo mode). No backend connected yet.";
    localStorage.setItem("automarket_last_email", emailVal);
  }
});

const last = localStorage.getItem("automarket_last_email");
if (last) email.value = last;

document.getElementById("createAccount").addEventListener("click", (e) => {
  e.preventDefault();
  alert("Create account page not built yet (frontend only).");
});

document.getElementById("forgotPassword").addEventListener("click", (e) => {
  e.preventDefault();
  alert("Password reset not built yet (frontend only).");
});