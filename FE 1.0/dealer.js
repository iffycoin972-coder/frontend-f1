document.addEventListener("DOMContentLoaded", () => {
  const user = AM.getCurrentUser();
  const gate = document.getElementById("dealerGate");
  const form = document.getElementById("dealerForm");
  const out = document.getElementById("dealerMsg");

  if (!gate) return;

  if (!user || user.role !== "dealer") {
    gate.innerHTML = `
      <div class="detail-card">
        <h2 style="margin:0; font-size:26px; font-weight:950;">Dealer dashboard</h2>
        <p class="small" style="margin-top:10px;">You must be signed in as a <b>dealer</b> to access this page.</p>
        <div style="margin-top:14px; display:flex; gap:12px; flex-wrap:wrap;">
          <a class="btn btn-primary" href="index.html">Sign in</a>
          <a class="btn btn-ghost" href="register.html">Create dealer account</a>
        </div>
      </div>
    `;
    return;
  }

  // Dealer can add cars (front-end demo)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    out.style.display = "none";

    const car = {
      id: `d_${Date.now()}`,
      vin: document.getElementById("dVin").value.trim(),
      year: Number(document.getElementById("dYear").value),
      make: document.getElementById("dMake").value.trim(),
      model: document.getElementById("dModel").value.trim(),
      trim: document.getElementById("dTrim").value.trim(),
      price: Number(document.getElementById("dPrice").value),
      mileage: Number(document.getElementById("dMiles").value),
      image: document.getElementById("dImage").value.trim() || "card1.jpg",
      dealerId: user.id,
      dealerName: `${user.firstName} ${user.lastName} (Dealer)`,
      description: document.getElementById("dDesc").value.trim()
    };

    if (!car.vin || !car.make || !car.model || !car.year || !car.price) {
      out.classList.add("error");
      out.style.display = "block";
      out.textContent = "Please fill required fields (VIN, year, make, model, price).";
      return;
    }

    AM.addCar(car);

    out.classList.remove("error");
    out.style.display = "block";
    out.textContent = "Listing added! Check Inventory.";

    form.reset();
  });
});
