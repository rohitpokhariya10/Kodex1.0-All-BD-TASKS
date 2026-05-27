# Notes CRUD API

A RESTful notes management backend built with Node.js, Express, MongoDB, and
Mongoose. This repository tracks the project through multiple CRUD iterations,
with `CRUD-3` representing the current layered application structure.

## Practice Purpose

The three folders, `CRUD-1`, `CRUD-2`, and `CRUD-3`, contain the same core
notes CRUD functionality intentionally. I implemented the create, read, update,
and delete operations three times as hands-on practice to strengthen my
understanding of backend structure, routing, controllers, services, database
operations, validation, and error handling.

This repetition is deliberate: each implementation is part of my learning
process and helps build confidence in developing CRUD APIs independently.

## Overview

The API is designed to support the essential lifecycle of a note:

- Create a note with a title and description.
- Retrieve stored notes.
- Update an existing note by its MongoDB document ID.
- Delete a note by its MongoDB document ID.
- Return consistent JSON responses and application errors.

## Technology Stack

| Technology | Purpose |
| --- | --- |
| Node.js | JavaScript runtime for the backend service |
| Express 5 | HTTP server and routing layer |
| MongoDB | Document database for persistent note storage |
| Mongoose | Schema modeling and MongoDB operations |
| dotenv | Environment variable loading |
| nodemon | Development server auto-reload |

## Project Structure

```text
Backend-CRUD-notes-app/
|-- CRUD-1/                 # Notes CRUD practice implementation
|-- CRUD-2/                 # Repeated Notes CRUD practice implementation
|-- CRUD-3/                 # Current Notes CRUD practice implementation
|   |-- src/
|   |   |-- config/
|   |   |   `-- db.js       # MongoDB connection configuration
|   |   |-- controller/
|   |   |   `-- note.controller.js
|   |   |-- middleware/
|   |   |   `-- error.middleware.js
|   |   |-- models/
|   |   |   `-- notes.model.js
|   |   |-- routes/
|   |   |   `-- notes.routes.js
|   |   |-- service/
|   |   |   `-- note.services.js
|   |   |-- utils/
|   |   |   `-- apiError.js
|   |   `-- app.js
|   |-- .env
|   |-- package.json
|   `-- server.js
`-- README.md
```

## Architecture

`CRUD-3` follows a layered backend structure:

| Layer | Responsibility |
| --- | --- |
| Routes | Maps HTTP endpoints to controller handlers |
| Controllers | Processes requests and builds HTTP responses |
| Services | Contains note validation and database operations |
| Models | Defines the persisted note schema |
| Middleware | Formats errors returned to API clients |
| Configuration | Establishes the MongoDB database connection |

## Getting Started

### Prerequisites

- Node.js installed locally
- npm installed with Node.js
- A running MongoDB instance on your machine or a MongoDB connection URI

### Installation

From the repository root:

```bash
cd CRUD-3
npm install
```

### Environment Configuration

Create or update `CRUD-3/.env` with a MongoDB connection string:

```env
MONGO_URI=mongodb://localhost:27017/CRUD-3
```

The current local configuration may use a different database name while the
project is being developed. Set the database name appropriate for your
environment before using stored data.

### Run the Application

Start the API normally:

```bash
npm start
```

Start in development mode with automatic restarts:

```bash
npm run dev
```

The current server entry point listens on:

```text
http://localhost:3000
```

## API Reference

Base path:

```text
/api
```

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/notes` | Create a new note |
| `GET` | `/api/notes` | Retrieve all notes |
| `PATCH` | `/api/notes/:id` | Update title and/or description |
| `DELETE` | `/api/notes/:id` | Delete a note |

## Data Model

A note is stored with the following fields:

| Field | Type | Rules |
| --- | --- | --- |
| `title` | String | Required, trimmed, minimum length validation |
| `description` | String | Required and trimmed |
| `createdAt` | Date | Added automatically by Mongoose timestamps |
| `updatedAt` | Date | Updated automatically by Mongoose timestamps |

## Request Examples

### Create a Note

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Project plan","description":"Finish the notes API documentation"}'
```

Example successful response:

```json
{
  "message": "Note Created",
  "newNote": {
    "title": "Project plan",
    "description": "Finish the notes API documentation"
  }
}
```

### Get All Notes

```bash
curl http://localhost:3000/api/notes
```

### Update a Note

```bash
curl -X PATCH http://localhost:3000/api/notes/<note-id> \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated project plan"}'
```

### Delete a Note

```bash
curl -X DELETE http://localhost:3000/api/notes/<note-id>
```

## Validation and Error Handling

The service layer is designed to validate:

- Required title and description values on creation.
- Minimum meaningful input length.
- Valid MongoDB object IDs for update and delete operations.
- At least one editable field for update requests.

Errors are intended to be returned as JSON:

```json
{
  "message": "Validation message",
  "success": false
}
```

## Current Development Status

`CRUD-3` contains the intended complete route, controller, service, model, and
middleware layout. The current controller still has in-progress service wiring:
it imports `createNoteService` from `CRUD-1`, while the remaining service
handlers are not yet imported into the controller. Error status propagation
also requires alignment between `ApiError` and the error middleware before the
API should be considered deployment-ready.

These notes describe the current repository state; the application source code
has not been changed as part of this documentation.

## Future Improvements

- Complete standalone controller-to-service wiring in `CRUD-3`.
- Add automated API and service tests.
- Add request schema validation.
- Add configuration for selectable server ports and deployment environments.
- Add authentication and authorization for user-owned notes.

## License

This project is licensed under the ISC License as declared in
`CRUD-3/package.json`.
