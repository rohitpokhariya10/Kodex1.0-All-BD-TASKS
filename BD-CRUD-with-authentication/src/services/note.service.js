const Note = require("../models/note.model");
const ApiError = require("../utils/apiError");

const createNoteService = async ({title , description }, user) => {

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
        user: user.email
    });

    return {newNote};

};

module.exports = {createNoteService};
