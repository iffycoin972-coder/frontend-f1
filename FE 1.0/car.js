document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const car = AM.getCarById(id);

  const mount = document.getElementById("carMount");
  if (!mount) return;

  if (!car) {
    mount.innerHTML = `<div class="container section"><h2>Car not found.</h2><p><a class="btn btn-ghost" href="inventory.html">Back to inventory</a></p></div>`;
    return;
  }

  const user = AM.getCurrentUser();
  const reviews = AM.getDealerReviews(car.dealerId);
  const avg = AM.avgRating(car.dealerId);

  const stars = (n) => "★★★★★☆☆☆☆☆".slice(5 - n, 10 - n);
  const fmtDate = (iso) => new Date(iso).toLocaleDateString();

  mount.innerHTML = `
    <div class="container section-sm">
      <a class="btn btn-ghost" href="inventory.html">← Back to inventory</a>

      <div class="detail">
        <div class="detail-media">
          <img src="${car.image}" alt="${car.year} ${car.make} ${car.model}">
        </div>

        <div class="detail-card">
          <div class="pill">${car.year} • ${car.make} ${car.model} ${car.trim || ""}</div>
          <h2 style="margin:12px 0 6px; font-size:34px; font-weight:950;">${car.year} ${car.make} ${car.model}</h2>
          <div class="price">${AM.money(car.price)}</div>
          <p class="small" style="margin:10px 0 0; line-height:1.6;">${car.description}</p>

          <div class="kv">
            <div><div class="k">Mileage</div><div class="v">${car.mileage.toLocaleString()} mi</div></div>
            <div><div class="k">VIN</div><div class="v" style="font-size:14px;">${car.vin}</div></div>
            <div><div class="k">Dealer</div><div class="v">${car.dealerName}</div></div>
            <div><div class="k">Dealer Rating</div><div class="v">${avg ? `${avg} / 5` : "No reviews yet"}</div></div>
          </div>

          <div class="hr"></div>

          <div style="display:flex; gap:12px; flex-wrap:wrap;">
            <button class="btn btn-primary" id="addToCartBtn">Add to cart</button>
            <a class="btn btn-ghost" href="cart.html">View cart</a>
          </div>

          <div class="msg" id="carMsg"></div>
        </div>
      </div>

      <div class="section-sm">
        <h3 style="margin:0; font-size:26px; font-weight:950;">Dealer reviews</h3>
        <p class="small" style="margin:8px 0 0;">Customers can leave reviews for dealers. (Front-end demo stored in localStorage.)</p>

        <div style="margin-top:14px;">
          ${reviews.length ? reviews.map(r => `
            <div class="review">
              <div class="top">
                <div class="name">${r.userName}</div>
                <div class="date">${fmtDate(r.date)}</div>
              </div>
              <div class="stars">${stars(r.rating).slice(0,5)}</div>
              <div class="text">${r.text}</div>
            </div>
          `).join("") : `<div class="small">No reviews yet. Be the first.</div>`}
        </div>

        <div class="hr"></div>

        <div class="detail-card" style="padding:16px;">
          <h4 style="margin:0; font-size:18px; font-weight:950;">Leave a review</h4>
          <p class="small" style="margin:6px 0 0;">You must be signed in as a <b>customer</b>.</p>

          <form class="form" id="reviewForm">
            <label class="label">Rating</label>
            <select id="reviewRating" required>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Okay</option>
              <option value="2">2 - Not great</option>
              <option value="1">1 - Bad</option>
            </select>

            <label class="label">Comment</label>
            <textarea id="reviewText" rows="4" class="input" placeholder="Write your experience..." required></textarea>

            <div class="form-actions">
              <button class="btn btn-primary" type="submit">Post review</button>
              <div class="small" id="reviewHint"></div>
            </div>

            <div class="msg" id="reviewMsg"></div>
          </form>
        </div>
      </div>
    </div>
  `;

  // Add to cart
  const addBtn = document.getElementById("addToCartBtn");
  const carMsg = document.getElementById("carMsg");
  addBtn.addEventListener("click", () => {
    AM.addToCart(car.id, 1);
    AM.updateNav();
    carMsg.style.display = "block";
    carMsg.textContent = "Added to cart!";
    setTimeout(() => (carMsg.style.display = "none"), 900);
  });

  // Review rules
  const hint = document.getElementById("reviewHint");
  const form = document.getElementById("reviewForm");
  const out = document.getElementById("reviewMsg");

  function setReviewHint(){
    if (!user) {
      hint.textContent = "Sign in to leave a review.";
      return;
    }
    if (user.role !== "customer") {
      hint.textContent = "Dealers cannot review dealers (customer-only).";
      return;
    }
    hint.textContent = `Posting as ${user.firstName} ${user.lastName}`;
  }
  setReviewHint();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    out.style.display = "none";

    const u = AM.getCurrentUser();
    if (!u) {
      out.classList.add("error");
      out.style.display = "block";
      out.textContent = "Please sign in first.";
      return;
    }
    if (u.role !== "customer") {
      out.classList.add("error");
      out.style.display = "block";
      out.textContent = "Only customers can post reviews.";
      return;
    }

    const rating = Number(document.getElementById("reviewRating").value);
    const text = document.getElementById("reviewText").value.trim();

    AM.addReview(car.dealerId, {
      rating,
      text,
      userName: `${u.firstName} ${u.lastName}`
    });

    out.classList.remove("error");
    out.style.display = "block";
    out.textContent = "Review posted! Refreshing…";

    setTimeout(() => window.location.reload(), 700);
  });
});
