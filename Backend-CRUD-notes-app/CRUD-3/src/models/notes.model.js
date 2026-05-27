const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
    },
    description: {
      type: String,
      require: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const noteModel = mongoose.model("notes", noteSchema);
module.exports = noteModel;
