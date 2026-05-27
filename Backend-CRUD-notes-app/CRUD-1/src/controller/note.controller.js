const noteModel = require("../models/notes.model");
const { createNoteService } = require("../service/note.services");

const createNoteController = async (req, res) => {
let newNote = await  createNoteService(req.body);
 
 
  console.log(newNote);

  return res.status(201).json({
    message:"Note Created",
    newNote
  })
};

module.exports = { createNoteController };
