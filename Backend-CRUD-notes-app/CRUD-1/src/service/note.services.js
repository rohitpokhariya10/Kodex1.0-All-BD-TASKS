const noteModel = require("../models/notes.model");

const createNoteService = async ({ title, description }) => {
  if (!title?.trim() || !description?.trim()) {
    throw new ApiError(400, "Title and description are required");
  }

  if (title.trim().length <= 3 || description.trim().length <= 3) {
    throw new ApiError(
      400,
      "Title and description must be more than 3 characters",
    );
  }

  let newNote = await noteModel.create({
    title: title.trim(),
    description: description.trim(),
  });
  return newNote;
};

module.exports = { createNoteService };
