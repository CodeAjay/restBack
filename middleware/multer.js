// multer.js
const multer = require('multer');

const storage = multer.memoryStorage();  // Store files in memory
const upload = multer({ storage });  // Multer configuration

module.exports = upload;
