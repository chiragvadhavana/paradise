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
      res.status(201).json({ message: "Book uploaded successfully", book });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Book upload failed", details: error.message });
    }
  },
];

exports.addHighlight = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const { chapter, paragraphIndex, startOffset, endOffset, text } = req.body;
    const highlight = new Highlight({
      book: bookId,
      chapter,
      paragraphIndex,
      startOffset,
      endOffset,
      text,
    });
    await highlight.save();
    await Book.findByIdAndUpdate(bookId, {
      $push: { highlights: highlight._id },
    });
    res
      .status(201)
      .json({ message: "Highlight added successfully", highlight });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Highlight addition failed", details: error.message });
  }
};

exports.getHighlights = async (req, res) => {
  try {
    const highlights = await Highlight.find({ book: req.params.bookId });
    res.status(200).json(highlights);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch highlights", details: error.message });
  }
};
// Get all books for authenticated user
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id });
    res.status(200).json(books);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch books", details: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    if (book.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to access this book" });
    }
    res.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res
      .status(500)
      .json({ error: "Error fetching book", details: error.message });
  }
};
