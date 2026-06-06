# Chit-Chat Backend

Express, MongoDB, and JWT backend for the real-time chat app.

## Feature 1: User Management

Implemented routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/presence`
- `GET /api/health`

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
