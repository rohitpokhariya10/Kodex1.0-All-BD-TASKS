const express = require("express");
const { createNoteController, getNoteController } = require("../controller/note.controller");
const authMiddleware = require("../middleware/auth.middleware");

const noteRouter = express.Router();


noteRouter.post("/note" ,authMiddleware ,createNoteController);
noteRouter.get("/notes" , authMiddleware , getNoteController);
module.exports = noteRouter;