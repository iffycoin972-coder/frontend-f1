document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("cartList");
  const sum = document.getElementById("cartSummary");

  function render(){
    const cart = AM.getCart();
    const cars = AM.getCars();
    const { subtotal, tax, total } = AM.cartTotals();

    if (list) {
      if (!cart.length) {
        list.innerHTML = `
          <div class="small">Your cart is empty.</div>
          <div style="margin-top:14px;"><a class="btn btn-primary" href="inventory.html">Browse inventory</a></div>
        `;
      } else {
        list.innerHTML = cart.map(it => {
          const c = cars.find(x => x.id === it.carId);
          if (!c) return "";
          return `
            <div class="cart-item">
              <img src="${c.image}" alt="${c.year} ${c.make} ${c.model}">
              <div>
                <div style="font-weight:950;">${c.year} ${c.make} ${c.model}</div>
                <div class="small">VIN: ${c.vin}</div>
                <div class="small">Dealer: ${c.dealerName}</div>
                <div class="price" style="margin-top:8px;">${AM.money(c.price)}</div>
                <div class="qty" style="margin-top:10px;">
                  <span class="small">Qty</span>
                  <input class="input" type="number" min="1" max="99" value="${it.qty}" data-qty="${c.id}">
                  <button class="btn btn-ghost" data-remove="${c.id}">Remove</button>
                </div>
              </div>
              <div style="text-align:right; font-weight:950;">
                ${AM.money(c.price * it.qty)}
              </div>
            </div>
          `;
        }).join("");

        list.querySelectorAll("[data-qty]").forEach(inp => {
          inp.addEventListener("change", () => {
            AM.setQty(inp.getAttribute("data-qty"), inp.value);
            AM.updateNav();
            render();
          });
        });

        list.querySelectorAll("[data-remove]").forEach(btn => {
          btn.addEventListener("click", () => {
            AM.removeFromCart(btn.getAttribute("data-remove"));
            AM.updateNav();
            render();
          });
        });
      }
    }

    if (sum) {
      sum.innerHTML = `
        <h3>Order summary</h3>
        <div class="sum-row"><span>Subtotal</span><span>${AM.money(subtotal)}</span></div>
        <div class="sum-row"><span>Estimated tax</span><span>${AM.money(tax)}</span></div>
        <div class="sum-total"><span>Total</span><span>${AM.money(total)}</span></div>
        <div style="margin-top:14px; display:grid; gap:10px;">
          <a class="btn btn-primary" href="checkout.html" ${subtotal ? "" : 'style="pointer-events:none; opacity:.6"'}>Checkout</a>
          <a class="btn btn-ghost" href="inventory.html">Continue shopping</a>
        </div>
        <div class="small" style="margin-top:10px;">
          Cart persists even if you sign out (front-end requirement).
        </div>
      `;
    }
  }

  render();
});
