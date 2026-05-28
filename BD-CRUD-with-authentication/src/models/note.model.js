const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title: String,
    description: String,
    user: String
})

const Note = mongoose.model('notes', noteSchema);
module.exports = Note;