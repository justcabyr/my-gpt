import Tesseract from 'tesseract.js'
import path from 'path'
import multer from 'multer'
import { openai } from '../config/openai.js'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { fileURLToPath } from 'url'

const apiKey = process.env.OPENAI_API_KEY

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const imageFilePath = path.resolve(__dirname, '../../uploads', 'sample')

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Error: Images Only! (jpeg, jpg, png)')
  }
}

export const uploadImage = async (req, res) => {
  // Set storage engine
  const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase()
      cb(null, `sample${ext}`)
    },
  })

  // Initialize upload
  const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB file size limit
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb)
    },
  }).single('image')

  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err })
    }

    // If no file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Respond success
    res.status(200).send({
      message: `File uploaded and saved as sample${path
        .extname(req.file.originalname)
        .toLowerCase()}`,
    })
  })
}

const imagePath = path.resolve(__dirname, '../../uploads/sample.png')
// resolve for all image format types

export const createStore = (docs) =>
  MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings())

const textFromImage = async () => {
  const result = await Tesseract.recognize(imagePath, 'eng')
  return result.data.text
}

const loadStoreFromImage = async () => {
  const text = await textFromImage()
  const docs = [{ pageContent: text }]
  console.log("docs", docs)
  return createStore(docs)
}

export const queryImage = async (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt || typeof prompt !== 'string') {
      return res
        .status(400)
        .json({ error: 'Invalid prompt. Please provide a valid text prompt.' })
    }

    const store = await loadStoreFromImage()
    const results = await store.similaritySearch(prompt, 2)

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature: 0,
      messages: [
        {
          role: 'assistant',
          content:
            'You are a helpful AI assistant. Answer any questions to the best of your ability.',
        },
        {
          role: 'user',
          content: `Answer the following question using the provided context. If you cannot answer the question with the context, don't lie and make up stuff. Just say you need more context.
          Question: ${prompt}

          Context: ${results.map((r) => r.pageContent).join('\n')}`,
        },
      ],
    })

    res.status(200).send({
      answer: response.choices[0].message.content,
      sources: 'Uploaded Image',
    })
  } catch (error) {
    console.error('Error processing image:', error)
    res.status(500).json({ error: 'Error processing the image' })
  }
}
