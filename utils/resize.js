const fs = require('fs')
const sharp = require('sharp')

const resizeAvatar = async (req, res, next) => {
  await sharp(req.file.path)
    .resize(100,100)
    .toFile(`../tmp/${req.file.filename}`)
  await fs.unlinkSync(req.file.path)
  next()
}

module.exports = resizeAvatar
