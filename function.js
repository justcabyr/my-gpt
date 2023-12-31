import 'dotenv/config'
import { openai } from './openai.js'
import math from 'advanced-calculator'
const QUESTION = process.argv[2] || 'hi'

const messages = [
  {
    role: 'user',
    content: QUESTION,
  },
]

const functions = {
  calculate: ({ expression }) => {
    return math.evaluate(expression)
  },

  generateImage: async ({ prompt }) => {
    const result = await openai.images.generate({ prompt })
    console.log(prompt)
    console.log(result)
    return result.data[0].url
  },
}

const getCompletion = (messages) => {
  return openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0613',
    messages,
    temperature: 0,
    // function_call: { name: 'calculate' },
    functions: [
      {
        name: 'calculate',
        description: 'Run a math expression',
        parameters: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description:
                'The math expression to evaluate like "2 * 3 + (21 / 2) ^ 2"',
            },
          },
          required: ['expression'],
        },
      },
      {
        name: 'generateImage',
        description: 'Create or generate an image based on a description',
        parameters: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description:
                'The description of the image to be generated',
            },
          },
          required: ['prompt'],
        },
      },
    ],
  })
}

let response
while (true) {
  response = await getCompletion(messages)

  if (response.choices[0].finish_reason === 'stop') {
    console.log(response.choices[0].message.content)
    break
  } else if (response.choices[0].finish_reason === 'function_call') {
    const fnName = response.choices[0].message.function_call.name
    const args = response.choices[0].message.function_call.arguments

    const funcToCall = await functions[fnName]
    const params = JSON.parse(args)

    const result = funcToCall(params)

    messages.push({
      role: 'assistant',
      content: null,
      function_call: {
        name: fnName,
        arguments: args,
      },
    })

    messages.push({
      role: 'function',
      name: fnName,
      content: JSON.stringify({ result }),
    })
  }
}
