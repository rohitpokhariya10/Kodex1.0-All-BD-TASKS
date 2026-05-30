# Backend Ecommerce Product API

A backend REST API for an ecommerce product platform built with Node.js, Express, MongoDB, Mongoose, JWT authentication, Google OAuth, ImageKit image uploads, and Nodemailer email support.

The API supports user registration/login, protected product management, product image upload, category filtering, owner-only product updates/deletes, Google login, and registration email sending.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- cookie-parser
- multer
- ImageKit
- Nodemailer
- Passport Google OAuth 2.0

## Features

- User registration with hashed password
- Registration success email
- User login with access and refresh token cookies
- User logout with refresh token cleanup
- Google OAuth login
- Protected routes using JWT access token from cookies
- Product creation with up to 5 images
- Product image upload to ImageKit
- Fetch all products
- Filter products by category
- Fetch single product by MongoDB ObjectId
- Update product details and replace product images
- Delete product and remove its ImageKit images
- Owner authorization for update/delete
- Centralized error response middleware

## Project Structure

```txt
.
├── server.js
├── package.json
├── src
│   ├── app.js
│   ├── config
│   │   ├── db.js
│   │   ├── imageKit.js
│   │   ├── mail.js
│   │   └── passwort.js
│   ├── controller
│   │   ├── auth.controller.js
│   │   └── product.controller.js
│   ├── middleware
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── multer.middleware.js
│   ├── models
│   │   ├── product.model.js
│   │   └── user.model.js
│   ├── routes
│   │   ├── auth.routes.js
│   │   └── product.routes.js
│   ├── service
│   │   ├── auth.service.js
│   │   ├── mail.service.js
│   │   └── product.service.js
│   ├── template
│   │   └── email.template.js
│   └── utils
│       ├── apiError.js
│       ├── crypto.utils.js
│       ├── password.util.js
│       ├── token.js
│       └── uploadToImageKit.js
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Create a `.env` file in the project root.

```env
MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_token_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

SMTP_USER=your_gmail_address
SMTP_PASS=your_gmail_app_password
SMTP_FROM=your_sender_email_optional

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Start Production Server

```bash
npm start
```

Server runs on:

```txt
http://localhost:3000
```

## Authentication

Protected product routes require a valid `accessToken` cookie.

After successful register/login/Google login, the API sets:

- `accessToken`
- `refreshToken`

In Postman, keep cookies enabled. After login/register, Postman will automatically send cookies to protected routes if the domain is the same.

## Common Error Response

Most errors follow this shape:

```json
{
  "message": "Error message",
  "success": false
}
```

## API Routes

Base URL:

```txt
http://localhost:3000
```

## Route Documentation Comments

```js
/**
 * @route       POST /api/auth/register
 * @description Register a new user. Requires name, email, and password in the request body.
 * @access      Public
 */
```

```js
/**
 * @route       POST /api/auth/login
 * @description Authenticate an existing user using email and password. Sets accessToken and refreshToken cookies on success.
 * @access      Public
 */
```

```js
/**
 * @route       POST /api/auth/logout
 * @description Logout the current user by removing the stored refresh token hash and clearing auth cookies.
 * @access      Public
 */
```

```js
/**
 * @route       GET /api/auth/google
 * @description Start Google OAuth authentication and redirect the user to Google's consent screen.
 * @access      Public
 */
```

```js
/**
 * @route       GET /api/auth/google/callback
 * @description Handle Google OAuth callback, create or update the user account, and issue auth cookies.
 * @access      Public
 */
```

```js
/**
 * @route       POST /api/product/create
 * @description Create a new product for the logged-in user. Accepts product details and up to 5 images using multipart/form-data.
 * @access      Private
 */
```

```js
/**
 * @route       GET /api/product/get-products
 * @description Fetch all products. Supports optional category query filter.
 * @access      Public
 */
```

```js
/**
 * @route       GET /api/product/get-product/:id
 * @description Fetch a single product by product id.
 * @access      Public
 */
```

```js
/**
 * @route       PUT /api/product/:id
 * @description Update an existing product. Only the product creator can update it.
 * @access      Private
 */
```

```js
/**
 * @route       DELETE /api/product/delete-product/:id
 * @description Delete an existing product and remove its images from ImageKit. Only the product creator can delete it.
 * @access      Private
 */
```

## Auth Routes

### Register User

```http
POST /api/auth/register
```

Creates a new local user, hashes the password, sends a registration email, generates access/refresh tokens, stores hashed refresh token, and sets auth cookies.

Request body:

```json
{
  "name": "Rohit",
  "email": "rohit@example.com",
  "password": "123456"
}
```

Successful response:

```json
{
  "sucess": true,
  "message": "User registered successfully",
  "safeUser": {
    "_id": "USER_ID",
    "name": "Rohit",
    "email": "rohit@example.com",
    "role": "user",
    "authProvider": "local",
    "isEmailVerified": true,
    "avatar": {
      "url": "https://ik.imagekit.io/uosvj5zwr3/Ecommerce/dummy%20profile%20img.png",
      "fileId": ""
    },
    "createdAt": "2026-05-30T00:00:00.000Z",
    "updatedAt": "2026-05-30T00:00:00.000Z"
  }
}
```

Possible errors:

```json
{
  "message": "Name is required",
  "success": false
}
```

```json
{
  "message": "Email is required",
  "success": false
}
```

```json
{
  "message": "Password is required",
  "success": false
}
```

```json
{
  "message": "User already exists with this email",
  "success": false
}
```

### Login User

```http
POST /api/auth/login
```

Logs in a local user, verifies password, generates new tokens, stores hashed refresh token, and sets auth cookies.

Request body:

```json
{
  "email": "rohit@example.com",
  "password": "123456"
}
```

Successful response:

```json
{
  "message": "Rohit loggedIn successfully",
  "user": {
    "_id": "USER_ID",
    "name": "Rohit",
    "email": "rohit@example.com",
    "role": "user",
    "authProvider": "local",
    "isEmailVerified": true,
    "avatar": {
      "url": "https://ik.imagekit.io/uosvj5zwr3/Ecommerce/dummy%20profile%20img.png",
      "fileId": ""
    },
    "createdAt": "2026-05-30T00:00:00.000Z",
    "updatedAt": "2026-05-30T00:00:00.000Z"
  }
}
```

Possible errors:

```json
{
  "message": "Email is required",
  "success": false
}
```

```json
{
  "message": "Password is required",
  "success": false
}
```

```json
{
  "message": "Invalid email or password",
  "success": false
}
```

```json
{
  "message": "Invalid Password",
  "success": false
}
```

```json
{
  "message": "Your account has been disabled",
  "success": false
}
```

### Logout User

```http
POST /api/auth/logout
```

Removes the stored refresh token hash for the current session.

Request cookies:

```txt
refreshToken=JWT_REFRESH_TOKEN
```

Request body:

```json
{}
```

Successful response:

```json
{
  "message": "User logout successfully"
}
```

Possible error:

```json
{
  "message": "User not found",
  "success": false
}
```

### Start Google Login

```http
GET /api/auth/google
```

Redirects the user to Google OAuth consent screen.

Request body:

```json
{}
```

Response:

```txt
Redirects to Google authentication page.
```

### Google OAuth Callback

```http
GET /api/auth/google/callback
```

Google redirects to this route after authentication. The route creates or updates the user, generates tokens, stores hashed refresh token, and sets cookies.

Request body:

```json
{}
```

Successful response:

```json
{
  "sucess": true,
  "message": "Rohit sucessfully loggedIn with google account"
}
```

Possible error:

```json
{
  "message": "Google authentication failed",
  "success": false
}
```

## Product Routes

Allowed categories:

```txt
electronics, fashion, grocery, mobile, laptop, beauty, sports, home, books, toys, other
```

### Create Product

```http
POST /api/product/create
```

Protected route. Creates a product for the logged-in user and uploads product images to ImageKit.

Authentication:

```txt
Required: accessToken cookie
```

Content type:

```txt
multipart/form-data
```

Request body fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| productName | String | Yes | Product name |
| price | Number | Yes | Product price |
| description | String | No | Product description |
| category | String or Array | No | Product category |
| images | File[] | No | Up to 5 product images |

Postman form-data example:

```txt
productName: iPhone 15
price: 79999
description: Apple smartphone
category: mobile
images: image1.jpg
images: image2.jpg
```

Successful response:

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "PRODUCT_ID",
    "user": "USER_ID",
    "productName": "iPhone 15",
    "description": "Apple smartphone",
    "price": 79999,
    "category": ["mobile"],
    "images": [
      {
        "url": "https://ik.imagekit.io/example/product.jpg",
        "fileId": "IMAGEKIT_FILE_ID",
        "_id": "IMAGE_OBJECT_ID"
      }
    ],
    "createdAt": "2026-05-30T00:00:00.000Z",
    "updatedAt": "2026-05-30T00:00:00.000Z"
  }
}
```

Possible errors:

```json
{
  "message": "Invalid or expired access token",
  "success": false
}
```

```json
{
  "message": "Product name is required",
  "success": false
}
```

```json
{
  "message": "Product price is required",
  "success": false
}
```

```json
{
  "message": "Price must be a valid number",
  "success": false
}
```

```json
{
  "message": "Price cannot be negative",
  "success": false
}
```

### Get All Products

```http
GET /api/product/get-products
```

Public route. Returns all products sorted by newest first.

Query parameters:

| Query | Type | Required | Description |
| --- | --- | --- | --- |
| category | String | No | Filter products by category |

Example:

```http
GET /api/product/get-products?category=mobile
```

Request body:

```json
{}
```

Successful response:

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "count": 1,
  "data": [
    {
      "_id": "PRODUCT_ID",
      "user": "USER_ID",
      "productName": "iPhone 15",
      "description": "Apple smartphone",
      "price": 79999,
      "category": ["mobile"],
      "images": [
        {
          "url": "https://ik.imagekit.io/example/product.jpg",
          "fileId": "IMAGEKIT_FILE_ID",
          "_id": "IMAGE_OBJECT_ID"
        }
      ],
      "createdAt": "2026-05-30T00:00:00.000Z",
      "updatedAt": "2026-05-30T00:00:00.000Z"
    }
  ]
}
```

Possible error:

```json
{
  "message": "Invalid category. Allowed categories are: electronics, fashion, grocery, mobile, laptop, beauty, sports, home, books, toys, other",
  "success": false
}
```

### Get Single Product

```http
GET /api/product/get-product/:id
```

Public route. Returns one product by MongoDB ObjectId.

Path params:

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| id | String | Yes | Product ObjectId |

Example:

```http
GET /api/product/get-product/665f1a2b3c4d5e6f78901234
```

Request body:

```json
{}
```

Successful response:

```json
{
  "success": true,
  "message": "Product fetched successfully",
  "product": {
    "_id": "PRODUCT_ID",
    "user": "USER_ID",
    "productName": "iPhone 15",
    "description": "Apple smartphone",
    "price": 79999,
    "category": ["mobile"],
    "images": [
      {
        "url": "https://ik.imagekit.io/example/product.jpg",
        "fileId": "IMAGEKIT_FILE_ID",
        "_id": "IMAGE_OBJECT_ID"
      }
    ],
    "createdAt": "2026-05-30T00:00:00.000Z",
    "updatedAt": "2026-05-30T00:00:00.000Z"
  }
}
```

Possible errors:

```json
{
  "message": "Product id is required",
  "success": false
}
```

```json
{
  "message": "Invalid product id",
  "success": false
}
```

```json
{
  "message": "Productnot found",
  "success": false
}
```

### Update Product

```http
PUT /api/product/:id
```

Protected route. Only the product creator can update the product. If new images are uploaded, the existing product images in the database are replaced.

Authentication:

```txt
Required: accessToken cookie
```

Content type:

```txt
multipart/form-data
```

Path params:

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| id | String | Yes | Product ObjectId |

Request body fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| productName | String | No | New product name |
| price | Number | No | New product price |
| description | String | No | New product description |
| category | String or Array | No | New category |
| images | File[] | No | New images, up to 5 |

Postman form-data example:

```txt
productName: Updated iPhone 15
price: 74999
description: Updated description
category: mobile
images: new-image.jpg
```

Successful response:

```json
{
  "success": true,
  "message": "Product updated successfullly"
}
```

Possible errors:

```json
{
  "message": "Invalid or expired access token",
  "success": false
}
```

```json
{
  "message": "Product id is required",
  "success": false
}
```

```json
{
  "message": "Invalid product id",
  "success": false
}
```

```json
{
  "message": "Product not found",
  "success": false
}
```

```json
{
  "message": "You are not allowed to update",
  "success": false
}
```

```json
{
  "message": "Product name cannot be empty",
  "success": false
}
```

```json
{
  "message": "Price must be a valid number",
  "success": false
}
```

```json
{
  "message": "Price cannot be negative",
  "success": false
}
```

### Delete Product

```http
DELETE /api/product/delete-product/:id
```

Protected route. Only the product creator can delete the product. Product images are also deleted from ImageKit.

Authentication:

```txt
Required: accessToken cookie
```

Path params:

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| id | String | Yes | Product ObjectId |

Example:

```http
DELETE /api/product/delete-product/665f1a2b3c4d5e6f78901234
```

Request body:

```json
{}
```

Successful response:

```json
{
  "message": "iPhone 15 deleted successfully",
  "success": true,
  "deletedProduct": {
    "_id": "PRODUCT_ID",
    "user": "USER_ID",
    "productName": "iPhone 15",
    "description": "Apple smartphone",
    "price": 79999,
    "category": ["mobile"],
    "images": [
      {
        "url": "https://ik.imagekit.io/example/product.jpg",
        "fileId": "IMAGEKIT_FILE_ID",
        "_id": "IMAGE_OBJECT_ID"
      }
    ],
    "createdAt": "2026-05-30T00:00:00.000Z",
    "updatedAt": "2026-05-30T00:00:00.000Z"
  }
}
```

Possible errors:

```json
{
  "message": "Invalid or expired access token",
  "success": false
}
```

```json
{
  "message": "Product id is required",
  "success": false
}
```

```json
{
  "message": "Invalid product id",
  "success": false
}
```

```json
{
  "message": "Product not found",
  "success": false
}
```

```json
{
  "message": "You are not allowed to delete this product",
  "success": false
}
```

## Data Models

### User

```js
{
  name: String,
  email: String,
  password: String,
  authProvider: "local" | "google",
  googleId: String,
  avatar: {
    url: String,
    fileId: String
  },
  role: "user" | "admin",
  isEmailVerified: Boolean,
  emailVerificationOtpHash: String,
  emailVerificationOtpExpiresAt: Date,
  passwordResetOtpHash: String,
  passwordResetOtpExpiresAt: Date,
  refreshTokenHash: String,
  passwordChangedAt: Date,
  lastLoginAt: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product

```js
{
  user: ObjectId,
  productName: String,
  description: String,
  price: Number,
  category: String[],
  images: [
    {
      url: String,
      fileId: String
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

## Postman Testing Flow

1. Register user using `POST /api/auth/register`.
2. Check Postman cookies for `accessToken` and `refreshToken`.
3. Create product using `POST /api/product/create` with `multipart/form-data`.
4. Fetch products using `GET /api/product/get-products`.
5. Fetch one product using `GET /api/product/get-product/:id`.
6. Update own product using `PUT /api/product/:id`.
7. Delete own product using `DELETE /api/product/delete-product/:id`.
8. Logout using `POST /api/auth/logout`.

## Notes

- Product create and update routes accept image files using the form-data key `images`.
- Maximum image upload count is 5 per request.
- Protected routes read the access token from cookies, not from the `Authorization` header.
- Only the user who created a product can update or delete it.
- Registration and login responses set cookies automatically.
- The current API response uses the key `sucess` in some auth responses because that is how it is implemented in the controller.
