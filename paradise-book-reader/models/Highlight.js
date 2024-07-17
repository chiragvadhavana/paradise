const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const highlightSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  chapter: { type: String, required: true },
  paragraphIndex: { type: Number, required: true },
  startOffset: { type: Number, required: true },
  endOffset: { type: Number, required: true },
  text: { type: String, required: true }, // Add this line
});

const Highlight = mongoose.model("Highlight", highlightSchema);
module.exports = Highlight;
