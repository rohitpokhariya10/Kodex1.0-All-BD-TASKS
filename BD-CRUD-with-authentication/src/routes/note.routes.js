const express = require("express");
const { createNoteController } = require("../controller/note.controller");
const authMiddleware = require("../middleware/auth.middleware");

const noteRouter = express.Router();


noteRouter.post("/note" ,authMiddleware ,createNoteController);

module.exports = noteRouter;