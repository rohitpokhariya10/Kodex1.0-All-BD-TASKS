const { createNoteService, getNoteService, updateNoteService, deleteNoteService } = require("../services/note.service");

// Create a note using the request body and authenticated user.
const createNoteController = async (req, res) => {
  let { newNote } = await createNoteService(req.body, req.user);
  return res.status(201).json({
    message: "Note created successfully",
    note: newNote,
  });
};

// Fetch all notes.
const getNoteController = async (req, res) => {
    let notes = await getNoteService();
    //console.log("Notes" , notes)
    return res.status(200).json({
        message:"Notes fetched successfully",
        notes
    })
};

// Update a note using the URL id and request body.
const updateNoteController = async (req , res) =>{
    let updatedNote = await  updateNoteService(req.body , req.params.id);
    return res.status(200).json({
        message:"Note updated successfully",
        updatedNote
    })
}

// Delete a note using the URL id.
const deleteNoteController = async (req , res)=>{
let {deletedNote} = await deleteNoteService(req.params.id);
return res.status(200).json({
    message:"Note deleted successfully",
    deletedNote
})
}
module.exports = { createNoteController  , getNoteController , updateNoteController , deleteNoteController};
