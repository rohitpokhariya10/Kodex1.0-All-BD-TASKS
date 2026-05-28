const { createNoteService } = require("../services/note.service");

const createNoteController = async (req , res, next)=>{
  try {
    let {newNote} = await createNoteService(req.body, req.user);
    return res.status(201).json({
        message: "Note created successfully",
        note: newNote
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {createNoteController}
