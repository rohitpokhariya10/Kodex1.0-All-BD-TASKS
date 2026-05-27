const express = require("express");
const { createNoteController, getNoteController, updateNoteController, deleteNoteController } = require("../controller/note.controller");

const router = express.Router();

router.post("/notes" , createNoteController);
router.get("/notes" ,  getNoteController);
router.patch("/notes/:id" , updateNoteController);
router.delete("/notes/:id" , deleteNoteController);
module.exports = router;