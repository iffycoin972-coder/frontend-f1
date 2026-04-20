/*
  AutoMarket Frontend (no backend yet)
  - Auth, cart, inventory, reviews are simulated with localStorage
  - API lookup (VIN decode) uses NHTSA VPIC
*/

const AM = (() => {
  const KEYS = {
    USERS: "am_users",
    USER: "am_user",
    CART: "am_cart",
    REVIEWS: "am_reviews",
    CARS_CUSTOM: "am_cars_custom"
  };

  const DEFAULT_CARS = [
    {
      id: "c1",
      vin: "WBSBF9324WEH12345",
      year: 1998,
      make: "BMW",
      model: "M3",
      trim: "E36",
      price: 27995,
      mileage: 112340,
      image: "card1.jpg",
      dealerId: "dealer-automarket",
      dealerName: "AutoMarket Dealer",
      description: "Clean title. Fresh service. A classic driver-focused build with tasteful upgrades."
    },
    {
      id: "c2",
      vin: "WBABD5341WEH67890",
      year: 1992,
      make: "BMW",
      model: "325i",
      trim: "E30 Convertible",
      price: 21950,
      mileage: 143210,
      image: "card2.jpg",
      dealerId: "dealer-automarket",
      dealerName: "AutoMarket Dealer",
      description: "Weekend cruiser. Strong maintenance history. A fun, open-top classic."
    },
    {
      id: "c3",
      vin: "JN1AR54F99M000001",
      year: 1975,
      make: "BMW",
      model: "E9",
      trim: "Premium Coupe",
      price: 69900,
      mileage: 58400,
      image: "featured.jpg",
      dealerId: "dealer-automarket",
      dealerName: "AutoMarket Dealer",
      description: "High-performance AWD with strong service records. Ready for a test drive."
    },
    {
      id: "c4",
      vin: "1HGCM82633A004352",
      year: 1973,
      make: "BMW",
      model: "02 Series",
      trim: "Tii",
      price: 23995,
      mileage: 40500,
      image: "card3.jpg",
      dealerId: "dealer-automarket",
      dealerName: "AutoMarket Dealer",
      description: "Reliable daily driver with modern safety features and great fuel economy."
    }
  ];

  // Helpers
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

  const money = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  const read = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  // Password hashing (demo-only; real apps should hash server-side)
  async function sha256(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  }

  // Users
  const getUsers = () => read(KEYS.USERS, []);
  const saveUsers = (users) => write(KEYS.USERS, users);

  const getCurrentUser = () => read(KEYS.USER, null);
  const setCurrentUser = (u) => write(KEYS.USER, u);
  const logout = () => localStorage.removeItem(KEYS.USER);

  async function registerUser({ firstName, lastName, email, password, role }) {
    const users = getUsers();
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error("That email is already registered.");

    const passwordHash = await sha256(password);

    const newUser = {
      id: `u_${Date.now()}`,
      firstName,
      lastName,
      email,
      passwordHash,
      role // "customer" | "dealer"
    };

    users.push(newUser);
    saveUsers(users);

    // Auto-login after register
    setCurrentUser({ id: newUser.id, firstName, lastName, email, role });
    return newUser;
  }

  async function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error("No account found for that email.");

    const passwordHash = await sha256(password);
    if (passwordHash !== user.passwordHash) throw new Error("Incorrect password.");

    setCurrentUser({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });

    return user;
  }

  // Cars (default + dealer-added)
  function getCars() {
    const custom = read(KEYS.CARS_CUSTOM, []);
    const merged = [...DEFAULT_CARS, ...custom];
    return merged;
  }

  function getCarById(id) {
    return getCars().find(c => c.id === id);
  }

  function addCar(car) {
    const custom = read(KEYS.CARS_CUSTOM, []);
    custom.push(car);
    write(KEYS.CARS_CUSTOM, custom);
  }

  // Cart
  const getCart = () => read(KEYS.CART, []);
  const saveCart = (cart) => write(KEYS.CART, cart);

  function cartCount() {
    return getCart().reduce((sum, it) => sum + it.qty, 0);
  }

  function addToCart(carId, qty = 1) {
    const cart = getCart();
    const existing = cart.find(i => i.carId === carId);
    if (existing) existing.qty += qty;
    else cart.push({ carId, qty });

    saveCart(cart);
    return cart;
  }

  function setQty(carId, qty) {
    const cart = getCart();
    const it = cart.find(i => i.carId === carId);
    if (!it) return cart;
    it.qty = Math.max(1, Math.min(99, Number(qty) || 1));
    saveCart(cart);
    return cart;
  }

  function removeFromCart(carId) {
    const cart = getCart().filter(i => i.carId !== carId);
    saveCart(cart);
    return cart;
  }

  function clearCart() {
    localStorage.removeItem(KEYS.CART);
  }

  function cartTotals() {
    const cart = getCart();
    const cars = getCars();
    const subtotal = cart.reduce((sum, it) => {
      const c = cars.find(x => x.id === it.carId);
      return sum + (c ? c.price * it.qty : 0);
    }, 0);
    const tax = subtotal * 0.06625; // NJ-ish estimate
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }

  // Reviews (keyed by dealerId)
  const getReviews = () => read(KEYS.REVIEWS, {});
  const saveReviews = (r) => write(KEYS.REVIEWS, r);

  function addReview(dealerId, { rating, text, userName }) {
    const all = getReviews();
    all[dealerId] = all[dealerId] || [];
    all[dealerId].unshift({
      id: `r_${Date.now()}`,
      rating,
      text,
      userName,
      date: new Date().toISOString()
    });
    saveReviews(all);
    return all[dealerId];
  }

  function getDealerReviews(dealerId) {
    const all = getReviews();
    return all[dealerId] || [];
  }

  function avgRating(dealerId) {
    const r = getDealerReviews(dealerId);
    if (!r.length) return 0;
    const avg = r.reduce((sum, x) => sum + x.rating, 0) / r.length;
    return Math.round(avg * 10) / 10;
  }

  // Nav UI
  function updateNav() {
    const user = getCurrentUser();

    const signIn = qs("#navSignIn");
    const register = qs("#navRegister");
    const logoutBtn = qs("#navLogout");
    const userChip = qs("#navUserChip");
    const cartBadge = qs("#cartCount");

    if (cartBadge) cartBadge.textContent = cartCount();

    if (!signIn || !logoutBtn) return;

    if (user) {
      signIn.style.display = "none";
      if (register) register.style.display = "none";
      logoutBtn.style.display = "inline-flex";
      if (userChip) {
        userChip.style.display = "inline-flex";
        userChip.textContent = `${user.firstName} (${user.role})`;
      }
    } else {
      signIn.style.display = "inline-flex";
      if (register) register.style.display = "inline-flex";
      logoutBtn.style.display = "none";
      if (userChip) userChip.style.display = "none";
    }

    if (logoutBtn) {
      logoutBtn.onclick = () => {
        logout();
        updateNav();
        // keep cart (requirement)
        window.location.href = "home.html";
      };
    }
  }

  // VIN API lookup (NHTSA)
  async function decodeVIN(vin) {
    const clean = (vin || "").trim();
    if (!clean) throw new Error("Enter a VIN first.");
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${encodeURIComponent(clean)}?format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("VIN lookup failed.");
    const data = await res.json();
    const row = data?.Results?.[0] || {};
    return {
      vin: clean,
      make: row.Make || "",
      model: row.Model || "",
      year: row.ModelYear || "",
      trim: row.Trim || "",
      engine: row.EngineModel || "",
      bodyClass: row.BodyClass || ""
    };
  }

  return {
    qs, qsa, money,
    sha256,
    getUsers, saveUsers,
    getCurrentUser, setCurrentUser, logout,
    registerUser, loginUser,
    getCars, getCarById, addCar,
    getCart, saveCart, cartCount, addToCart, setQty, removeFromCart, clearCart, cartTotals,
    addReview, getDealerReviews, avgRating,
    updateNav,
    decodeVIN
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  AM.updateNav();
});
