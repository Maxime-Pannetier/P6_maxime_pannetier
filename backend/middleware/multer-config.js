const multer = require('multer');
const crypto = require('crypto');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
  };
  
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'images');
    },
    filename: (req, file, callback) => {
      const name = crypto.randomBytes(5).toString("hex");
      const extension = MIME_TYPES[file.mimetype];
      callback(null, Date.now() + '_' + name + '.' + extension);
    }
  });
  
  module.exports = multer({storage: storage}).single('image');