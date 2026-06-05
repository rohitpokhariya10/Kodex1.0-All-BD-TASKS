# Chit-Chat Frontend

Production-minded frontend for a real-time communication system using React and Vite.

## Folder Structure

```text
src/
  domain/
    entities/
  application/
    api/
    auth/
    state/
  infrastructure/
    api/
    seed/
  presentation/
    components/
    screens/
    styles/
    utils/
```

## Layer Responsibilities

- `domain`: business entities and constants.
- `application`: state, hooks, feature orchestration, API client facade.
- `infrastructure`: HTTP, realtime, file, auth, chat gateways and seed data.
- `presentation`: UI screens, components, CSS, and browser interactions.

## Main Screens

- `AuthScreen.jsx`: login/register UI powered by React Hook Form.
- `ChatWorkspace.jsx`: full chat dashboard with conversations, messages, attachments, notifications, settings, and mobile drawer.

## Backend-Ready API Gateways

- `AuthGateway`
- `ChatGateway`
- `FileGateway`
- `RealtimeGateway`
- `HttpClient`

Create the backend routes listed in `src/application/api/apiContract.md`, then call the gateways from the application layer.

## Commands

```bash
npm install
npm run dev
npm run build
```

## Notes

The current frontend uses seed data and local state so every feature is demonstrable before backend integration. This keeps the UI submission complete while allowing the backend to be connected later with minimal changes.
