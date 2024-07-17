const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tokens: [{ token: { type: String, required: true } }],
  books: [{ type: Schema.Types.ObjectId, ref: "Book" }],
  dictionary: [{ type: Schema.Types.ObjectId, ref: "DictionaryEntry" }],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
