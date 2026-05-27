const express = require("express");
const { createNoteController, getNoteController } = require("../controller/note.controller");

const router = express.Router();

router.post("/notes" , createNoteController);
router.get("/notes" ,  getNoteController);
module.exports = router;