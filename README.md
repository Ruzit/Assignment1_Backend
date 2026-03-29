# E-commerce Shopping Cart Backend

This is the backend for an **E-commerce Shopping Cart** web application built for an individual assignment. The backend is developed using **Node.js**, **Express.js**, and **MongoDB Atlas**, and it provides REST APIs for products and shopping cart operations.

## Project Overview

This backend supports the following features:

- Connects to MongoDB Atlas database
- Fetches all products
- Fetches all cart items
- Adds products to cart
- Updates cart item quantity
- Deletes cart items
- Supports JSON-based REST API communication for a React frontend

## Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB Atlas**
- **Mongoose**
- **dotenv**
- **cors**
- **nodemon**

## Project Structure

```text
ecommerce-backend/
│
├── config/
│   └── db.js
│
├── models/
│   ├── Product.js
│   └── Cart.js
│
├── routes/
│   ├── productRoutes.js
│   └── cartRoutes.js
│
├── data/
│   └── products.js
│
├── .env
├── seed.js
├── server.js
├── package.json
└── README.md
```

## Prerequisites

Before running this project, make sure you have:

- [Node.js](https://nodejs.org/) installed
- A MongoDB Atlas account
- A MongoDB cluster created in Atlas
- A database user created in Atlas
- Network access enabled in Atlas (`0.0.0.0/0` for development)

## Step-by-Step Setup

### 1. Clone the repository

```bash
git clone <your-github-repository-link>
cd ecommerce-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the `.env` file

Create a `.env` file in the root folder and add:

```env
PORT=5001
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.kik80qi.mongodb.net/ecommerce?retryWrites=true&w=majority
```

### 4. Configure MongoDB Atlas

Make sure in MongoDB Atlas:

- your database name is `ecommerce`
- your products collection is `products`
- your database user credentials match the username and password in `MONGO_URI`
- your IP access list includes `0.0.0.0/0`

### 5. Seed sample products into the database

Run the following command:

```bash
npm run seed
```

This will:

- connect to MongoDB
- remove old product data
- insert sample product data from `data/products.js`

Expected terminal output:

```text
MongoDB connected for seeding
Products seeded successfully
```

### 6. Start the backend server

Run:

```bash
npm start
```

Expected terminal output:

```text
MongoDB connected successfully
Server is running on port 5001
```

## Available Scripts

### Start the server

```bash
npm start
```

Runs the backend using nodemon.

### Seed the database

```bash
npm run seed
```

Deletes existing products and inserts sample products.

## API Endpoints

### Base Route

```http
GET /
```

Response:

```text
Backend API is running
```

### Product Routes

#### Get all products

```http
GET /api/products
```

Returns all products from the database.

### Cart Routes

#### Get all cart items

```http
GET /api/cart
```

Returns all cart items with product details.

#### Add item to cart

```http
POST /api/cart
```

Request body:

```json
{
  "productId": "PRODUCT_ID_HERE",
  "quantity": 1
}
```

#### Update cart item quantity

```http
PUT /api/cart/:id
```

Request body:

```json
{
  "quantity": 2
}
```

#### Delete cart item

```http
DELETE /api/cart/:id
```

## Testing the Backend

After starting the server, test these URLs in the browser or Postman:

```text
http://localhost:5001/
http://localhost:5001/api/products
http://localhost:5001/api/cart
```

You can use **Postman** or **Thunder Client** to test `POST`, `PUT`, and `DELETE` requests.

## Sample Product Data

The sample products are stored in:

```text
data/products.js
```

You can edit this file and run `npm run seed` again to refresh the products.

## Common Issues and Fixes

### 1. `Cannot find module './routes/productRoutes'`

Make sure:

- the `routes` folder exists
- `productRoutes.js` exists inside `routes`
- the file name matches exactly

### 2. `403 Forbidden on localhost`

This usually means another service is already using port `5000`.  
This project uses:

```env
PORT=5001
```

So always open:

```text
http://localhost:5001
```

### 3. Products API returns empty array

Check:

- database name in Atlas matches the URI exactly (`ecommerce`)
- collection name is `products`
- you have run `npm run seed`

### 4. MongoDB connection fails

Check:

- username and password in `MONGO_URI`
- database user exists in Atlas
- network access is enabled in Atlas

## Notes for Assignment Submission

For submission, include:

- source code
- `README.md`
- database export if required by your lecturer
- GitHub repository link or zipped project folder

## Future Improvements

Possible improvements for the full project:

- frontend integration with React
- product search and filtering
- authentication for users
- checkout flow
- better validation and error handling

## Author

**Rujeet Prajapati**
