const Book = require("../models/Book");
const Highlight = require("../models/Highlight");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.uploadBook = [
  upload.single("file"),
  async (req, res) => {
    try {
      const { title } = req.body;
      const htmlContent = req.file.buffer.toString();
      const book = new Book({ user: req.user._id, title, htmlContent });
      await book.save();
      res.status(201).json({ message: "book uploaded", book });
    } catch (error) {
      res.status(500).json({ error: "upload failed", details: error.message });
    }
  },
];

exports.addHighlight = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const {
      chapter,
      paragraphIndex,
      startOffset: startOfHighlight,
      endOffset: endOfHighlight,
      text,
    } = req.body;
    const highlight = new Highlight({
      book: bookId,
      chapter,
      paragraphIndex,
      startOffset: startOfHighlight,
      endOffset: endOfHighlight,
      text,
    });
    await highlight.save();
    await Book.findByIdAndUpdate(bookId, {
      $push: { highlights: highlight._id },
    });
    res.status(201).json({ message: "Highlight added in db", highlight });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Highlight adding failed", details: error.message });
  }
};

exports.getHighlights = async (req, res) => {
  try {
    const highlights = await Highlight.find({ book: req.params.bookId });
    res.status(200).json(highlights);
  } catch (error) {
    res.status(500).json({
      error: "can't fetch highlights from db",
      details: error.message,
    });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id });
    res.status(200).json(books);
  } catch (error) {
    res
      .status(500)
      .json({ error: "failed to get books from dbs", details: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ error: "book not found" });
    }
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "can't acces this book" });
    }
    res.json(book);
  } catch (error) {
    console.error("can't fetch book from db", error);
    res
      .status(500)
      .json({ error: "error while fetching book", details: error.message });
  }
};
