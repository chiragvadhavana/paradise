const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dictionaryEntrySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  word: { type: String, required: true },
  meaning: { type: String, required: true },
});

const DictionaryEntry = mongoose.model(
  "DictionaryEntry",
  dictionaryEntrySchema
);
module.exports = DictionaryEntry;
