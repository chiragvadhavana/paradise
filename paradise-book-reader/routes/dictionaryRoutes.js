const express = require("express");
const {
  addDictionaryEntry,
  getDictionaryEntries,
} = require("../controllers/dictionaryController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, addDictionaryEntry);
router.get("/", authMiddleware, getDictionaryEntries);

module.exports = router;
