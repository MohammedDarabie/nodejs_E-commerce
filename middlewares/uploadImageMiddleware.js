const multer = require("multer");
const ApiError = require("../utils/apiError");
// 
const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  //    File Filter
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images Allowed", 400), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};
/* --------------------------- Upload Single Image -------------------------- */
exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);
/* ------------------------- Upload multiple Images ------------------------- */
exports.uploadImages = (arrayofFields) => multerOptions().fields(arrayofFields);
