// const DictionaryEntry = require("../models/DictionaryEntry");

// exports.addDictionaryEntry = async (req, res) => {
//   try {
//     const { word, meaning } = req.body;
//     const entry = new DictionaryEntry({ user: req.user._id, word, meaning });
//     await entry.save();
//     res
//       .status(201)
//       .json({ message: "Dictionary entry added successfully", entry });
//   } catch (error) {
//     res.status(500).json({ error: "Dictionary entry addition failed" });
//   }
// };

const DictionaryEntry = require("../models/DictionaryEntry");

exports.addDictionaryEntry = async (req, res) => {
  try {
    const { word, meaning } = req.body;
    const entry = new DictionaryEntry({
      user: req.user._id,
      word,
      meaning,
    });
    await entry.save();
    res.status(201).json({ message: "word meaning entry added", entry });
  } catch (error) {
    res.status(500).json({
      error: "error while adding the word to dictionary",
      details: error.message,
    });
  }
};

exports.getDictionaryEntries = async (req, res) => {
  try {
    const entries = await DictionaryEntry.find({ user: req.user._id });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch dictionary entries",
      details: error.message,
    });
  }
};
