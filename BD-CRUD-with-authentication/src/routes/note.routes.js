const express = require("express");
const { createNoteController, getNoteController, updateNoteController } = require("../controller/note.controller");
const authMiddleware = require("../middleware/auth.middleware");

const noteRouter = express.Router();


noteRouter.post("/note" ,authMiddleware ,createNoteController);
noteRouter.get("/notes" , authMiddleware , getNoteController);
noteRouter.patch("/note/:id" , authMiddleware ,  updateNoteController);
module.exports = noteRouter;