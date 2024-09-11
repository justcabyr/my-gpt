import 'dotenv/config'
import OpenAI from "openai";

export const openai = new OpenAI()
const results = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    'messages': [
        {
            role: 'system', content: 'You are an AI assistant, answer any questions to the best of your ability.',
        },
        {
            role: 'user',
            content: 'Hi! Tell me about Martin Luther King',
        }
    ]
})

console.log(results.choices[0].message.content)