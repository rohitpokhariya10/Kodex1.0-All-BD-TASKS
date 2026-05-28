const mongoose = require("mongoose");

// Schema for notes created by users.
const noteSchema = new mongoose.Schema({
    title: String,
    description: String,
    user: String
})

// Note collection model.
const Note = mongoose.model('notes', noteSchema);
module.exports = Note;
