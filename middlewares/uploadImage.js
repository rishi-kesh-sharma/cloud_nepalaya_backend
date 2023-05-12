module.exports = (folder, name) => {
  const multer = require("multer");

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `public/images/${folder}`);
    },
    filename: function (req, file, cb) {
      cb(
        null,
        new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
      ); // 23/08/2022
    },
  });
  // Specify file format that can be saved
  function fileFilter(req, file, cb) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
  const upload = multer({ storage, fileFilter });
  // File Size Formatter
  return upload.single(name);
};
