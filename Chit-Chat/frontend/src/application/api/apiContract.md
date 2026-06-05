# Frontend API Contract

These routes are the frontend integration points for the backend.

## Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/presence`

## Conversations and Groups
- `GET /api/conversations`
- `POST /api/groups`
- `GET /api/conversations/:conversationId/messages`
- `POST /api/conversations/:conversationId/messages`
- `PATCH /api/conversations/:conversationId/read`

## Messages
- `DELETE /api/messages/:messageId`

## Files
- `POST /api/files`
- `GET /api/conversations/:conversationId/files`

## Realtime Events
- `message:new`
- `typing:update`
- `presence:update`
