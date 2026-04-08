# 🛍️ E-Commerce Shopping Cart (Backend API)

## 📌 Project Overview

This repository contains the **backend API** for an e-commerce shopping cart system. It provides RESTful endpoints for managing products and cart operations, including filtering, sorting, validation, and summary calculations.

The backend is designed to support a Single Page Application (SPA) frontend.

---

## 🔗 Related Repository

The frontend for this project is maintained in a separate repository:

- Frontend Repository: https://github.com/Ruzit/Assignment1_Frontend.git

---

## 🚀 Features

### 🛍️ Product APIs

- Get all products
- Search products by name
- Filter by category
- Sort products by price and name

### 🛒 Cart APIs (CRUD)

- Add item to cart (Create)
- Get cart items (Read)
- Update quantity (Update)
- Remove item (Delete)
- Clear cart
- Get cart summary

### ⚙️ Backend Features

- RESTful API design
- MongoDB Atlas integration
- Data validation
- Standardized API responses
- Modular MVC structure
- Database seeding

---

## 🧰 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- dotenv
- nodemon

---

## 📁 Folder Structure

```text
config/
controllers/
models/
routes/
data/
seed.js
server.js
```

---

## ⚙️ Setup Instructions

### 1. Install dependencies

```bash
npm install
```

---

### 2. Create `.env` file

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
```

---

### 3. Start server

```bash
npm start
```

Backend runs at:

```text
http://localhost:5001
```

---

## 🌱 Seed Database

```bash
npm run seed
```

This will:

- clear products
- clear cart items
- insert fresh product data

---

## 📡 API Endpoints

### Products

```http
GET /api/products
```

Supports:

- search (name)
- filter (category)
- sorting

---

### Cart

```http
GET    /api/cart
POST   /api/cart
PUT    /api/cart/:id
DELETE /api/cart/:id
DELETE /api/cart
GET    /api/cart/summary
```

---

## 🔄 API Response Format

### Success

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## ⚠️ Challenges Faced

- Designing scalable API structure → implemented MVC pattern
- Handling invalid inputs → added validation for IDs and quantities
- Managing cart consistency → ensured cart reset during seeding
- Implementing filtering and sorting → built dynamic query logic

---

## 📂 Database Export

Include:

- products.json
- cart.json

---

## 👤 Author

**Rujeet Prajapati**
