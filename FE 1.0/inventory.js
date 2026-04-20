document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("carsGrid");
  const search = document.getElementById("searchInput");
  const sort = document.getElementById("sortSelect");
  const vinForm = document.getElementById("vinForm");
  const vinMsg = document.getElementById("vinMsg");

  function render(cars){
    if (!list) return;
    list.innerHTML = cars.map(c => `
      <div class="card car-card">
        <img class="card-media" src="${c.image}" alt="${c.year} ${c.make} ${c.model}">
        <div class="card-body">
          <div class="pill">${c.year} • ${c.make} ${c.model} ${c.trim ? "• " + c.trim : ""}</div>
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-top:10px;">
            <div class="price">${AM.money(c.price)}</div>
            <div class="small">${c.mileage.toLocaleString()} mi</div>
          </div>
          <div class="meta">VIN: <span class="small">${c.vin}</span></div>
          <div class="card-actions">
            <a class="btn btn-ghost" href="car.html?id=${encodeURIComponent(c.id)}">View</a>
            <button class="btn btn-primary" data-add="${c.id}">Add to cart</button>
          </div>
        </div>
      </div>
    `).join("");

    list.querySelectorAll("[data-add]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-add");
        AM.addToCart(id, 1);
        AM.updateNav();
        btn.textContent = "Added!";
        setTimeout(() => (btn.textContent = "Add to cart"), 800);
      });
    });
  }

  function apply(){
    let cars = AM.getCars();

    const q = (search?.value || "").trim().toLowerCase();
    if (q) {
      cars = cars.filter(c =>
        `${c.make} ${c.model} ${c.year} ${c.trim} ${c.vin}`.toLowerCase().includes(q)
      );
    }

    const s = sort?.value || "relevance";
    if (s === "price_asc") cars.sort((a,b) => a.price - b.price);
    if (s === "price_desc") cars.sort((a,b) => b.price - a.price);
    if (s === "year_desc") cars.sort((a,b) => b.year - a.year);
    if (s === "miles_asc") cars.sort((a,b) => a.mileage - b.mileage);

    render(cars);
  }

  if (search) search.addEventListener("input", apply);
  if (sort) sort.addEventListener("change", apply);

  // VIN decode (API lookup requirement)
  if (vinForm) {
    vinForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      vinMsg.style.display = "none";
      const vin = document.getElementById("vinInput").value.trim();
      try {
        const info = await AM.decodeVIN(vin);
        vinMsg.classList.remove("error");
        vinMsg.style.display = "block";
        vinMsg.textContent = `VIN: ${info.vin} • ${info.year} ${info.make} ${info.model} ${info.trim} (${info.bodyClass})`;
      } catch (err) {
        vinMsg.classList.add("error");
        vinMsg.style.display = "block";
        vinMsg.textContent = err.message || "VIN lookup failed.";
      }
    });
  }

  apply();
});
