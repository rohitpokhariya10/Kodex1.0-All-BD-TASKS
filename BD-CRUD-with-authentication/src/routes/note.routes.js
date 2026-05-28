const express = require("express");
const { createNoteController, getNoteController, updateNoteController, deleteNoteController } = require("../controller/note.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Router for note CRUD endpoints.
const noteRouter = express.Router();


// Create a note for the logged-in user.
noteRouter.post("/note" ,authMiddleware ,createNoteController);

// Fetch notes after checking authentication.
noteRouter.get("/notes" , authMiddleware , getNoteController);

// Update a note by id after checking authentication.
noteRouter.patch("/note/:id" , authMiddleware ,  updateNoteController);

// Delete a note by id after checking authentication.
noteRouter.delete("/note/:id" , authMiddleware , deleteNoteController)
module.exports = noteRouter;
