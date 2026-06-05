# Chit-Chat

Industry-style frontend for a real-time one-to-one and group chat application.

## Tech Stack

- React
- Vite
- React Hook Form
- Lucide React
- CSS modules via organized global design tokens

## Completed Frontend Features

- Login and registration UI with React Hook Form validation
- JWT-ready authentication handoff
- One-to-one and group chat workspace
- Conversation search and filters
- Local message sending
- Message deletion UI
- Read/unread state handling
- Typing indicator state
- File and image attachment preview
- Shared files panel
- Group creation flow with member picker
- Notification center with unread counts
- Profile settings and presence switching
- In-chat message search with highlighted matches
- Mobile conversation drawer
- Loading, empty, and error states
- Backend API adapter contracts

## Architecture

The frontend follows a 4-layer architecture:

1. Domain
   - Entity contracts and constants.
   - Example: users, conversations, messages, auth rules.

2. Application
   - Feature state and orchestration.
   - Example: chat store, auth form hook, API client facade.

3. Infrastructure
   - API gateways, HTTP client, realtime gateway, seed data.
   - Backend can be connected here without rewriting UI components.

4. Presentation
   - Screens, components, styles, and user interactions.
   - Example: auth screen, chat workspace, avatar, dashboard UI.

## Run Locally

```bash
cd frontend
npm install
npm run dev
```

## Production Build

```bash
cd frontend
npm run build
```

## Backend Handoff

API contracts are documented in:

```text
frontend/src/application/api/apiContract.md
```

The frontend is currently using local state and seed data so the UI can be evaluated independently. Backend APIs can replace the current local behavior by wiring the gateway methods in `frontend/src/infrastructure/api`.
