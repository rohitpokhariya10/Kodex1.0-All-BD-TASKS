const noteModel = require("../models/notes.model");
const { createNoteService, getNoteService } = require("../service/note.services");

const createNoteController = async (req, res) => {
let newNote = await  createNoteService(req.body);
 
 
  console.log(newNote);

  return res.status(201).json({
    message:"Note Created",
    newNote
  })
};

const getNoteController = async (req , res) =>{
 let notes = await getNoteService();
return res.status(200).json({
    message:"Fetched all notes",
    notes
})
}
module.exports = { createNoteController , getNoteController };
