'use strict';
const multer = require('multer');

const storage = multer.diskStorage({
 destination: (req, file, cb) => {
  cb(null, 'uploads/1');
 },
 filename: (req, file, cb) => {
  cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
 }
});
const filefilter = (req, file, cb) => {
 console.log("file ===> ", file.mimetype)
 if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg'
  || file.mimetype === 'image/jpeg') {
  cb(null, true);
 }
 else if (file.mimetype === 'application/pdf') {
  cb(null, true);
 }
 else {
  cb(null, false);
 }
}

const upload = multer({ storage: storage, fileFilter: filefilter });

module.exports = { upload }