const { createNoteService, getNoteService } = require("../services/note.service");

const createNoteController = async (req, res) => {
  let { newNote } = await createNoteService(req.body, req.user);
  return res.status(201).json({
    message: "Note created successfully",
    note: newNote,
  });
};

const getNoteController = async (req, res) => {
    let notes = await getNoteService();
    //console.log("Notes" , notes)
    return res.status(200).json({
        message:"Notes fetched successfully",
        notes
    })
};
module.exports = { createNoteController  , getNoteController};
