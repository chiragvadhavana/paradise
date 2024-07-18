const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const dictionaryRoutes = require("./routes/dictionaryRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/dictionary", dictionaryRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("there is something wrong");
});

const PORT = process.env.PORT || 3001;
app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error("Failed to start server:", err);
  });

