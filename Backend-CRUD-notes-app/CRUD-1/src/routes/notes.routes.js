const express = require("express");
const { createNoteController, getNoteController, updateNoteController } = require("../controller/note.controller");

const router = express.Router();

router.post("/notes" , createNoteController);
router.get("/notes" ,  getNoteController);
router.patch("/notes/:id" , updateNoteController);
module.exports = router;