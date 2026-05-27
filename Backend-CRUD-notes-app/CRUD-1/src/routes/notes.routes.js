const express = require("express");
const { createNoteController } = require("../controller/note.controller");

const router = express.Router();

router.post("/notes" , createNoteController);

module.exports = router;