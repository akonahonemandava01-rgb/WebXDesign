const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Files land in backend-sep/uploads (created here if it doesn't exist yet)
const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const allowedExtensions = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];

function fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type. Allowed: PDF, Word docs, JPG, PNG."));
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB per file
});

module.exports = upload;