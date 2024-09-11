# nodejs-openai

An advanced AI-powered backend application; AI chat interfaces, semantic search, document QA, function calling, and AI images.

Node.js OpenAI is a simple wrapper library for accessing the OpenAI API in Node.js applications. This library provides a convenient way to interact with OpenAI's powerful language models, such as GPT-3, from within your Node.js projects.

Chatbot
This file implements a simple chatbot using the OpenAI API. The chatbot interacts with the user through a command-line interface (CLI) and responds to user input using the GPT-3.5 language model.

## Roadmap

### Frontend

- UI:
    - Pray to God for help

### Backend

- Chat:
    - Update Chat system from terminal to user input
    - Add response streaming feature
    - GPT feature? Pro?

- Auth:
    - Implement a basic access code auth, sers will need to provide access code to log in
    - Create random access codes (not to be pushed to the server) - and disable after use
    - Track token limit for each access code

- File upload:
    - Handle PDF upload.
    - Handle image upload.
    - Handle image paste into chat
    - Implement GPT feature to work with images

- Image Generator:
    - Handle image export/download
    - Implement a different image upload feature (Like Claude - but still OpenAI)

- Diving Deeper:
    - Other ChatGPT pro features?