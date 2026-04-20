document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkoutForm");
  const msg = document.getElementById("checkoutMsg");
  const totals = document.getElementById("checkoutTotals");

  const { subtotal, tax, total } = AM.cartTotals();
  if (totals) {
    totals.innerHTML = `
      <div class="sum-row"><span>Subtotal</span><span>${AM.money(subtotal)}</span></div>
      <div class="sum-row"><span>Estimated tax</span><span>${AM.money(tax)}</span></div>
      <div class="sum-total"><span>Total</span><span>${AM.money(total)}</span></div>
    `;
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      msg.style.display = "none";

      if (subtotal <= 0) {
        msg.classList.add("error");
        msg.style.display = "block";
        msg.textContent = "Your cart is empty.";
        return;
      }

      // Front-end demo: pretend payment succeeded
      AM.clearCart();
      AM.updateNav();

      msg.classList.remove("error");
      msg.style.display = "block";
      msg.textContent = "Payment successful! (Demo) Order placed. Redirecting to Home…";

      setTimeout(() => (window.location.href = "home.html"), 1200);
    });
  }
});
