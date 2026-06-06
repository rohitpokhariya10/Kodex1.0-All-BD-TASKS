# Chit-Chat Backend

Express, MongoDB, and JWT backend for the real-time chat app.

## Feature 1: User Management

Implemented routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/presence`
- `GET /api/health`

## Feature 2: One-to-One Chat

Implemented routes:

- `GET /api/users`
- `GET /api/conversations`
- `POST /api/conversations/direct`
- `GET /api/conversations/:conversationId/messages`
- `POST /api/conversations/:conversationId/messages`
- `PATCH /api/conversations/:conversationId/read`

## Run Locally

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Update `.env` with your MongoDB URI and a strong `JWT_SECRET` before running.

## Auth Response Shape

Register and login return:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "mongodb-id",
    "name": "Rohit Pokhariya",
    "email": "rohit@student.dev",
    "status": "online",
    "lastSeenAt": null
  }
}
```
