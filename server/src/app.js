import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import chatRouter from './routes/chat.js'

const PORT = process.env.PORT || 8088
const app = express()
app.use(express.json())
app.use(cors())
app.use('/api/chat', chatRouter)

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})
