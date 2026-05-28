const Note = require("../models/note.model");
const ApiError = require("../utils/apiError");

// Validate note data and create a note for the logged-in user.
const createNoteService = async ({ title, description }, user) => {
  // ---- Validation ----
  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  if (!description) {
    throw new ApiError(400, "Description is required");
  }

  if (title.trim().length < 3) {
    throw new ApiError(400, "Title must be at least 3 characters long");
  }

  if (description.trim().length < 10) {
    throw new ApiError(400, "Description must be at least 10 characters long");
  }

  // ---- If validation passes, create the note ----

  const newNote = await Note.create({
    title,
    description,
    user: user.email,
  });

  return { newNote };
};

// Get all notes from the database.
const getNoteService = async () => {
  let notes = await Note.find();
  //console.log("notes-->" , notes)
  return notes;
};

// Validate update data and update one note by id.
const updateNoteService = async ({  title, description } , id) => {
  if (!id) {
    throw new ApiError(400, "Note id is required");
  }

  if (!title && !description) {
    throw new ApiError(400, "Title or description is required");
  }

  const updateData = {};

  if (title) {
    if (title.trim().length < 3) {
      throw new ApiError(400, "Title must be at least 3 characters long");
    }

    updateData.title = title;
  }

  if (description) {
    if (description.trim().length < 10) {
      throw new ApiError(
        400,
        "Description must be at least 10 characters long",
      );
    }

    updateData.description = description;
  }

  const updatedNote = await Note.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!updatedNote) {
    throw new ApiError(404, "Note not found");
  }

  return { updatedNote };
};

// Delete one note by id.
const deleteNoteService = async (id)=>{
  if (!id) {
    throw new ApiError(400, "Note id is required");
  }

  const deletedNote = await Note.findByIdAndDelete(id);

  if (!deletedNote) {
    throw new ApiError(404, "Note not found");
  }

  return { deletedNote };
}
module.exports = { createNoteService, getNoteService, updateNoteService, deleteNoteService };
