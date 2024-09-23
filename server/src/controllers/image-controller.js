import Tesseract from 'tesseract.js'
import path from 'path'
import { openai } from '../config/openai.js'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const imagePath = path.resolve(__dirname, '../../uploads/sample.png')

export const createStore = (docs) =>
  MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings())

const textFromImage = async () => {
  const result = await Tesseract.recognize(imagePath, 'eng')
  return result.data.text
}

const loadStoreFromImage = async () => {
  const text = await textFromImage()

  if (!typeof text !== 'string') {
    // This block is not working. Handle empty image text
    return res
      .status(400)
      .json({ error: 'Unable to extract information from the image.' })
  }

  const docs = [{ pageContent: text }]

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
