const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  htmlContent: { type: String, required: true },
  highlights: [{ type: Schema.Types.ObjectId, ref: "Highlight" }],
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
