AutoMarket Frontend (Project Demo)

What’s included (front-end only):
- Home page (home.html) with hero, cards, testimonials, FAQ, contact, footer
- Login page (index.html) and Register page (register.html)
- Inventory page (inventory.html) with:
  - search bar (make/model/year/VIN)
  - VIN decoder (API lookup via NHTSA VPIC)
  - add-to-cart button
- Car details page (car.html?id=carId) with:
  - dealer details
  - customer-only dealer review system
- Cart page (cart.html) persists when signed in OR not (localStorage)
- Checkout page (checkout.html) demo (extra credit) that clears the cart
- Dealer dashboard (dealer.html) demo to add listings (dealer-only)

Important notes:
- This is NOT connected to a backend yet. Auth, cart, reviews, dealer listings are stored in localStorage.
- For the full stack project, replace localStorage with API calls to your backend (Node/Express + DB).

How to run locally (recommended):
1) Put all files in the same folder (including images: hero.jpg, card1.jpg, card2.jpg, card3.jpg, featured.jpg, logo.png).
2) Start a simple server in that folder:
   python3 -m http.server 8000
3) Open:
   http://localhost:8000/home.html

Tip: Using a server avoids browser restrictions when calling the VIN API.

How to test quickly:
- Register a CUSTOMER and a DEALER
- Login as DEALER -> Dealer dashboard -> Add listing -> check Inventory
- Login as CUSTOMER -> Inventory -> View a car -> Leave dealer review
- Add cars to cart -> Cart -> Checkout -> verify cart clears

Files:
- home.html
- index.html
- register.html
- inventory.html
- car.html
- cart.html
- checkout.html
- dealer.html
- financing.html
- styles.css
- app.js
- home.js
- auth.js
- inventory.js
- car.js
- cart.js
- checkout.js
- dealer.js
