const { mongoose } = require("mongoose");
const noteModel = require("../models/notes.model");
const ApiError = require("../utils/apiError");

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

const getNoteService = async () => {
  let notes = await noteModel.find();
   if(!notes){
      throw new ApiError("404" , "Notes not found")
    }
  return notes;
};

const updateNoteService = async ({ id }, data) => {
  let title = data.title;
  let description = data.description;
  console.log(id, title, description);
  console.log("id-->", id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid note id");
  }
  let updateData = {};
  if (title !== undefined) {
    if (!title.trim()) {
      throw new ApiError(400, "Title cannot be empty");
    }

    if (title.trim().length <= 3) {
      throw new ApiError(400, "Title must be more than 3 characters");
    }

    updateData.title = title.trim();
  }

  if (description !== undefined) {
    if (!description.trim()) {
      throw new ApiError(400, "Description cannot be empty");
    }

    if (description.trim().length <= 3) {
      throw new ApiError(400, "Description must be more than 3 characters");
    }

    updateData.description = description.trim();
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "Please provide title or description to update");
  }

  const updatedNote = await noteModel.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!updatedNote) {
    throw new ApiError(404, "Note not found");
  }

  return updatedNote;
};

const deleteNoteService = async ({ id }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid note id");
  }
  let deletedNote = await noteModel.findByIdAndDelete(id);
  return deletedNote;
};
module.exports = { createNoteService, getNoteService, updateNoteService , deleteNoteService };
