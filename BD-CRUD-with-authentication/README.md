# BD CRUD With Authentication

A Node.js, Express, MongoDB CRUD API for notes with JWT-based authentication. Users can register, receive an authentication cookie, and then create, read, update, and delete notes through protected routes.

## Features

- User registration
- JWT token generation
- HTTP-only cookie authentication
- Protected note routes
- Create, read, update, and delete notes
- Central error handling
- MongoDB persistence using Mongoose

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- cookie-parser
- dotenv
- nodemon

## Project Structure

```txt
BD-CRUD-with-authentication/
├── server.js
├── package.json
├── .env
└── src/
    ├── app.js
    ├── config/
    │   └── db.js
    ├── controller/
    │   ├── auth.controller.js
    │   └── note.controller.js
    ├── middleware/
    │   ├── auth.middleware.js
    │   └── error.middleware.js
    ├── models/
    │   ├── user.model.js
    │   └── note.model.js
    ├── routes/
    │   ├── auth.routes.js
    │   └── note.routes.js
    ├── services/
    │   ├── auth.service.js
    │   └── note.service.js
    └── utils/
        ├── apiError.js
        └── token.js
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
TOKEN_EXPIRY=1d
```

### 3. Start Development Server

```bash
npm run dev
```

The server will start on:

```txt
http://localhost:3000
```

## API Endpoints

### Auth

#### Register User

```http
POST /api/auth/register
```

Request body:

```json
{
  "name": "Test User",
  "email": "test@example.com"
}
```

Successful response:

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

This endpoint also sets a `JWT_TOKEN` cookie.

### Notes

All note routes require authentication through the `JWT_TOKEN` cookie.

#### Create Note

```http
POST /api/note
```

Request body:

```json
{
  "title": "My Note",
  "description": "This is my first note"
}
```

#### Get Notes

```http
GET /api/notes
```

#### Update Note

```http
PATCH /api/note/:id
```

Request body:

```json
{
  "title": "Updated Note",
  "description": "This note description has been updated"
}
```

#### Delete Note

```http
DELETE /api/note/:id
```

## Scripts

```bash
npm start
```

Starts the server using Node.js.

```bash
npm run dev
```

Starts the server using nodemon for development.

## Authentication Flow

1. Register a user with `POST /api/auth/register`.
2. The server generates a JWT token.
3. The token is stored in an HTTP-only cookie named `JWT_TOKEN`.
4. Protected note routes read and verify this cookie.
5. If the token is valid, the request continues to the note controller.

## Error Handling

The project uses a central error middleware. Service and middleware errors are passed to the error handler and returned as JSON responses.

Example error response:

```json
{
  "message": "Unauthorized user",
  "success": false
}
```

## Author

Created as a backend CRUD project with authentication using Express and MongoDB.
