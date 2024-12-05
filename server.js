const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(
    "mongodb+srv://officePc:Ewsl7PZcOLC4zFyT@cluster0.wn4j5.mongodb.net/multer"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  uploadDate: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema);

//multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = new File({
      filename: req.file.filename,
      path: req.file.path,
    });
    await file.save();
    res.status(200).json({ message: "File uploaded successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error yploading file" });
  }
});

app.get("/files", async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ error: "Error fetching files" });
  }
});
const port = 3000;
app.listen(port, () =>
  console.log(`Example app listening on port http://localhost:${port}`)
);
