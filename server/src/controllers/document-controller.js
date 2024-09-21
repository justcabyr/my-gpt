import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import { openai } from '../config/openai.js'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { CharacterTextSplitter } from 'langchain/text_splitter'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'

const apiKey = process.env.OPENAI_API_KEY

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pdfFilePath = path.resolve(__dirname, '../../uploads', 'doc.pdf')

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
      cb(null, 'doc.pdf')
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

export const createStore = (docs) =>
  MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings())

const docsFromPDF = () => {
  const loader = new PDFLoader(pdfFilePath)
  return loader.loadAndSplit(
    new CharacterTextSplitter({
      separator: '. ',
      chunkSize: 2500,
      chunkOverlap: 200,
    })
  )
}

const loadStore = async () => {
  const pdfDocs = await docsFromPDF()

  return createStore([...pdfDocs])
}

export const queryPDF = async (req, res) => {
  const { prompt } = req.body

  if (!prompt || typeof prompt !== 'string') {
    return res
      .status(400)
      .json({ error: 'Invalid prompt. Please provide a valid text prompt.' })
  }

  const store = await loadStore()
  const results = await store.similaritySearch(prompt, 2)

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    temperature: 0,
    messages: [
      {
        role: 'assistant',
        content:
          'You are a helpful AI assistant, answer any questions to the best of your ability.',
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
    answer: `${response.choices[0].message.content}`,
    sources: 'Uploaded PDF', // Store PDF title and replace in source
    // sources: `${results.map((r) => r.metadata.source).join(', ')}`,
  })
}
