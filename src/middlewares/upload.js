const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDir = path.join(__dirname, "..", "..", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, "-");
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const upload = multer({ storage });
const imageUpload = upload.fields([
  { name: "file", maxCount: 1 },
  { name: "File", maxCount: 1 },
]);

function getUploadedFile(req) {
  if (req.file) return req.file;
  if (req.files && req.files.file && req.files.file[0]) return req.files.file[0];
  if (req.files && req.files.File && req.files.File[0]) return req.files.File[0];
  return null;
}

module.exports = { upload, uploadDir, imageUpload, getUploadedFile };
