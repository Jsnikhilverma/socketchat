const path = require("path");

exports.uploadFile = (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");
  res.json({ fileUrl: `/uploads/${req.file.filename}` });
};
