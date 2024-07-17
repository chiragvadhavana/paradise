const express = require("express");
const {
  uploadBook,
  addHighlight,
  getBooks,
  getHighlights,
  getBookById,
} = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/upload", authMiddleware, uploadBook);
router.post("/highlights", authMiddleware, addHighlight);
router.get("/", authMiddleware, getBooks);
router.get("/:bookId/highlights", authMiddleware, getHighlights);
router.get("/:bookId", authMiddleware, getBookById);

module.exports = router;
