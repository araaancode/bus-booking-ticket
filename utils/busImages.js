const multer = require('multer')
const path = require('path');
const mkdirp = require('mkdirp');
const busUploadDir = path.join(__dirname, '../public/bus/');

module.exports = {
    busUpload: multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                const made = mkdirp.sync(busUploadDir);
                cb(null, busUploadDir)
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + path.extname(file.originalname));
            }
        })
    })
}