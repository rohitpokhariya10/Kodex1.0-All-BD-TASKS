const {
  createNoteService,
} = require("../../../CRUD-1/src/service/note.services");

const createNoteController = async (req, res) => {
  let newNote = await createNoteService(req.body);

  console.log(newNote);

  return res.status(201).json({
    message: "Note Created",
    newNote,
  });
};

const getNoteController = async (req, res) => {
  let notes = await getNoteService();
  return res.status(200).json({
    message: "Fetched all notes",
    notes,
  });
};

const updateNoteController = async (req , res)=>{
    let updatedNote = await updateNoteService(req.params , req.body)
    return res.status(201).json({
        message:"Note updated successfully",
        updatedNote
    })
}


module.exports = { createNoteController , getNoteController , updateNoteController };
