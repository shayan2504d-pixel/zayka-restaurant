# 👑 ZAYKA VIP Restaurant — Digital Platform & Management System

> **A luxury, modern, and production-ready digital restaurant platform.** Crafted with a dark VIP aesthetic, rich gold accents, full-stack customer authentication, live multi-stage order tracking, table reservations, and an all-in-one Admin Management Control Center.

---

## 🌟 1. Project Overview & Features

### 💎 VIP Visual Experience
* **Luxury Dark & Gold Theme**: Obsidian black (`#070709`), Deep Onyx (`#0C0C10`), Rich Metallic Gold (`#D4AF37`, `#F5E6CA`), and warm crimson accents.
* **Cinematic Typography**: Google Fonts *Playfair Display* & *Cinzel* for royal titles, paired with *Plus Jakarta Sans* for clean, modern readability.
* **Refined Aesthetics**: Glassmorphic backdrops, glowing borders, smooth hover zooms on food imagery, celebratory confetti animations, and mobile-first responsive architecture.

---

## 🔐 2. Customer Authentication System (Production-Grade)

The authentication system is completely functional with secure database persistence and token handling:

1. **Email OR Phone + Password Login**:
   * Single intelligent input accepting either registered email address or phone number.
   * Show/Hide password toggle.
   * "Remember Me" checkbox adjusting session longevity.
   * Clear, user-friendly error banners on invalid credentials.

2. **Customer Registration (Sign Up)**:
   * Full Name, Email, Phone Number, Password, Confirm Password.
   * Strict validation: email format, phone format, password confirmation match, minimum character length.
   * Passwords securely hashed with **bcryptjs** (10 salt rounds).

3. **Secure Forgot Password & Password Reset Flow**:
   * Step 1: Customer submits their registered email or phone.
   * Backend generates a time-limited crypto-secure token (valid 60 minutes) stored in `password_resets` table.
   * Interactive UI preview displays the generated token with a one-click button to immediately set the new password.
   * Step 2: Customer enters token and sets a new password with confirmation.
   * Password is updated in the database and token is invalidated.

4. **Google Login (Functional OAuth 2.0 + Instant Demo Mode)**:
   * Stylized "Continue with Google" button.
   * **Real Google OAuth 2.0**: Backend endpoint accepts Google credential tokens verified with client credentials configured in `.env`.
   * **Instant 1-Click Google Test Flow**: Built-in interactive account picker allowing immediate testing of Google sign-in without external setup prerequisites.
   * Automatically creates or logs into a customer profile with Google avatar, name, and email.

5. **Customer Session & Account Portal**:
   * JWT session management with automatic header injection.
   * **My Profile**: View and edit name, phone, saved delivery coordinates.
   * **My Orders**: View active and past orders with live status badges and one-click "Track Live" button.
   * **My Reservations**: View scheduled table bookings with booking codes.
   * **Change Password**: Secure self-service password update.

---

## 🍽️ 3. Royal Culinary & Service Modules

### 🍔 Menu & Categories Catalog
* **11 Rich Categories**: Gourmet Burgers, Artisan Pizzas, Royal BBQ & Grills, Specialty Chicken, Tuscan Pasta, Dum Biryani & Rice, Club Sandwiches, Fresh Greens & Soups, Royal Desserts, Artisanal Ice Cream, Craft Drinks.
* **Features per Dish**: Image, Title, Detailed Description, Price, Discount Price, Dietary Badges (Chef Special, Halal, Spicy 🌶️), and Customization Modal with kitchen notes.

### 🎁 Exclusive Deals & Combos
* High-value combo packages (Grand Royal Family Banquet, Wagyu Burger Combo, Artisan Pizza Feast, Sweet Tooth Euphoria).
* Itemized checklist of included delicacies, savings calculator, and 1-click addition to cart.

### 🍨 Artisanal Ice Cream & Gourmet Desserts Boutique
* Dedicated sweet tooth showcase featuring hand-churned Madagascar Vanilla, Belgian Dark Chocolate Fudge Gelato, Alfonso Strawberry Swirl, Molten Valrhona Lava Cake, and the Grand Royal VIP Sundae.

### 🛒 Shopping Cart & Online Ordering (Checkout)
* Sliding slide-over cart drawer accessible across all pages.
* Toggle between **VIP Home Delivery** and **Dine-In / Pickup**.
* Free delivery progress bar (automatically grants free shipping on orders above Rs. 2,000).
* Multi-step checkout with customer contact, delivery landmark, kitchen notes, and payment selection (Cash on Delivery / Pay at Counter / Card Simulation).
* Celebratory confetti animation upon order placement with generated Order Reference Number (e.g. `ZYK-47130`).

### 📡 Live Order Tracking
* Interactive 5-Stage Live Status Stepper:
  $$\text{Pending} \longrightarrow \text{Confirmed} \longrightarrow \text{Preparing in Kitchen} \longrightarrow \text{Out for Delivery} \longrightarrow \text{Delivered}$$
* Search any order by Order Number.
* Real-time refresh button, order items breakdown, delivery address, and payment status.

### 📅 VIP Table Reservations
* Interactive calendar date picker, time slot chips (Lunch, High Tea, Dinner, Late Night), guest count selector (1 to 20+).
* Ambiance zone selection (Royal VIP Lounge, Skyline Rooftop Terrace, Garden Patio, Executive Family Hall).
* Generates unique Booking Reference Code (`RES-XXXX`) with status confirmation.

### ⭐ Reviews & Ratings
* 5-star rating system with customer comments.
* Moderated by administrators before appearing on the public showcase.

### 🏛️ Gallery, About Us & Royal Concierge
* Filterable image gallery (Food, Interior, Chef, Events) with interactive lightbox.
* Restaurant heritage story, 100% Halal sourcing philosophy, and Master Chef profile.
* Direct WhatsApp ordering button, toll-free concierge telephone link, opening hours, and location card.

---

## 🛡️ 4. Royal Admin Management Dashboard (`/admin`)

The Admin Portal is a comprehensive control center restricted to administrators (`role === 'admin'`):

* **KPI Analytics**: Total Orders, Today's Orders, Total Revenue, Active Kitchen Orders, Completed Orders, Table Reservations, and Registered Customers.
* **Orders Control Center**: Filter by status, search by order number or customer, 1-click status stepper progression, and printable royal invoices.
* **Products Catalog CRUD**: Add new dish with image URL, edit prices/discounts, toggle availability (`In Stock` / `Sold Out`), and delete dishes.
* **Categories CRUD**: Create, edit, and manage menu categories.
* **Deals CRUD**: Build combo packages, set promotional prices, and manage active status.
* **Table Reservations Manager**: View guest list by date, confirm bookings, or cancel.
* **Customer Directory**: Inspect registered patron accounts, total orders placed, and lifetime spend.
* **Reviews Moderation**: 1-click approve or hide customer reviews.
* **Restaurant Settings**: Live configuration of restaurant name, tagline, phone, WhatsApp number, delivery fees, and opening hours.

---

## 🗄️ 5. Database Architecture (Relational SQLite)

Persistent SQLite database located at `server/data/zayka.db` with WAL mode and foreign keys enabled:

* `users` — Customers and administrators with bcrypt password hashes and OAuth providers.
* `categories` — Menu categories with slugs and sort order.
* `products` — Dishes with prices, discounts, tags, spicy levels, and availability.
* `deals` — Combo packages with items included and promotional pricing.
* `orders` — Order headers with customer information, totals, status pipeline, and notes.
* `order_items` — Relational line items linked to orders.
* `reservations` — Table bookings with codes, dates, times, and seating zones.
* `reviews` — Customer feedback with ratings and approval status.
* `password_resets` — Crypto tokens and verification codes with 1-hour expiry.
* `settings` — Key-value restaurant operational configurations.

---

## 🚀 6. Quick Start & Execution Guide

### Prerequisites
* Node.js v18+ (tested and running on Node.js v24.21.0 on Windows)
* npm

### Step 1: Install Dependencies
```bash
# Install root/backend dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Step 2: Seed the Database
Populate 27+ gourmet dishes, 4 signature deals, admin credentials, demo customer, and reviews:
```bash
npm run seed
```

### Step 3: Start the Application
Start the full-stack server (automatically serves the built VIP client on port 5000):
```bash
npm start
```
Then open your browser at:
👉 **`http://localhost:5000`**

*(For frontend hot-reload development, run `npm run client` in a separate terminal).*

---

## 🔑 7. Ready-to-Test Accounts

| Role | Email / Phone | Password | Access |
| :--- | :--- | :--- | :--- |
| **Royal Admin** | `admin@zayka.com` or `+923001234567` | `admin123` | Full Admin Dashboard (`/admin`) & Management |
| **VIP Customer** | `customer@zayka.com` or `+923219876543` | `customer123` | Orders, Reservations, Profile & VIP Checkout |

---

## 🌐 8. Google OAuth 2.0 Setup Instructions

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project: **ZAYKA VIP Restaurant**.
3. Configure the **OAuth Consent Screen** (User Type: External).
4. Create Credentials ➔ **OAuth Client ID** (Application Type: *Web Application*).
5. In **Authorized JavaScript Origins**, add:
   * `http://localhost:5000`
   * `http://localhost:5173`
6. Copy your **Client ID** and **Client Secret** into your `.env` file:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```
> **Note**: An instant 1-Click Google Test Flow is already active in the application, allowing immediate demonstration without configuring Google Cloud keys.

---

## 🧪 9. Automated Verification Test Suite

Run the automated 12-checkpoint backend API & authentication test suite anytime:
```bash
node test-server-api.js
```
Expected output:
```
✅ 1. Health check: healthy
✅ 2. Email Login: true
✅ 3. Phone Login: true
✅ 4. Admin Login: true
✅ 5. Google Login Flow: true
✅ 6. Products API: 27 dishes returned
✅ 7. Deals API: 4 combos active
✅ 8. Forgot Password Token Generated: true
✅ 9. Password Reset using Token: true
✅ 10. Order Placed: true
✅ 11. Order Live Tracking: true
✅ 12. Admin Analytics: true
🎉 ALL 12 API & AUTH BACKEND VERIFICATION TESTS PASSED SUCCESSFULLY!
```
