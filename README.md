# GraminCraft - Local Artisan E-Commerce Platform for Rural Handicrafts 🪔

> **Empowering rural Indian artisans to sell handmade products directly through a community-focused MERN platform.**

---

## 🌟 Key Features

1. **Role-Based Authentication & Profiles**:
   - **Artisan / Seller Studio**: Register with craft specialty, state of origin, district, village, and heritage bio. Dashboard access for sales analytics and order fulfillment.
   - **Conscious Buyer**: Browse crafts by traditional craft form or region, add items to cart, checkout, track order status timeline, and submit verified reviews.

2. **Product Listing & Media Management (Cloudinary)**:
   - Artisans can create, edit, and delete craft listings with multi-image previews.
   - Cloudinary integration for cloud storage + automatic server fallback disk storage (`/uploads`).
   - Rich craft metadata: Category, materials used, size/dimensions, weight, and stock count.

3. **Order Placement & Real-Time Tracking**:
   - Cart subtotal calculation and checkout with address entry and payment choice (UPI, COD, Card, NetBanking).
   - Order fulfillment tracking timeline (`Pending` → `Processing / Crafting` → `Dispatched / Shipped` → `Delivered`).

4. **Artisan Sales Analytics Dashboard**:
   - Statistics for Total Sales Revenue, Pending Orders, Active Listings, and Average Rating.
   - Instant order fulfillment dropdown updates.

5. **Rural Digital Inclusion & Accessibility**:
   - **Multi-Language Selector**: Live switcher supporting English + 6 regional Indian languages (Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati).
   - **Audio Storytelling**: Built-in Web Speech synthesis allowing buyers to hear the artisan's narrative and craft heritage out loud.

---

## 🛠 Tech Stack

- **Frontend**: React.js (Vite), TailwindCSS, Lucide Icons, React Router DOM
- **Backend**: Node.js, Express.js, JWT Authentication, Multer
- **Database**: MongoDB (Mongoose Schema Models)
- **Media Upload**: Cloudinary API + Local Disk Fallback

---

## 🚀 Quick Start Guide

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
*Backend API will run on `http://localhost:5000`*

Optionally seed MongoDB with sample artisan data:
```bash
npm run seed
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend application will run on `http://localhost:3000`*

---

## 🧪 Demo Credentials

- **Demo Rural Artisan**: `sunita.artisan@example.com` / `password123`
- **Demo Buyer**: `buyer@example.com` / `password123`
