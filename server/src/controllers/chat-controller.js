import axios from 'axios'

const apiKey = process.env.OPENAI_API_KEY

export const chatController = async (req, res) => {
  const { prompt } = req.body

  try {
    const openaiRes = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: 'gpt-4', // Or 'gpt-3.5-turbo'
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      },
      responseType: 'stream',
    })

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    openaiRes.data.on('data', (chunk) => {
      const jsonString = chunk.toString('utf-8').trim()

      // Handle the streaming chunks from OpenAI API
      if (jsonString.startsWith('data:')) {
        const jsonResponse = JSON.parse(jsonString.slice(5))

        if (jsonResponse.choices) {
          const token = jsonResponse.choices[0].delta.content
          if (token) {
            res.write(token)
          }
        }
      }
    })

    openaiRes.data.on('end', () => {
      res.end()
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send('Something went wrong.')
  }
}
