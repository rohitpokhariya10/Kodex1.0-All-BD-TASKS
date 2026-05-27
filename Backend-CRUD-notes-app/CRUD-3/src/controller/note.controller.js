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


module.exports = { createNoteController };
