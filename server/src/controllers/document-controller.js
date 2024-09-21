import fs from 'fs'
import path from 'path'
import multer from 'multer'

// const apiKey = process.env.OPENAI_API_KEY

const checkFileType = (file, cb) => {
  const filetypes = /pdf/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Error: PDFs Only!')
  }
}

export const uploadPDF = async (req, res) => {
  // Set storage engine
  const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
      cb(null, 'doc1.pdf')
    },
  })

  // Initialize upload
  const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB file size limit
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb)
    },
  }).single('file')

  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    res.status(200).send({ message: 'File uploaded and saved as doc.pdf' })
  })
}
