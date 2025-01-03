# nodejs-openai

An advanced AI-powered backend application; AI chat interfaces, semantic search, document QA, function calling, and AI images.

Node.js OpenAI is a simple wrapper library for accessing the OpenAI API in Node.js applications. This library provides a convenient way to interact with OpenAI's powerful language models, such as GPT-3, from within your Node.js projects.

Installation
To use Node.js OpenAI in your project, you can install it via npm:
`npm i`

Chatbot
This file implements a simple chatbot using the OpenAI API. The chatbot interacts with the user through a command-line interface (CLI) and responds to user input using the GPT-3.5 language model.

Usage
To start the chatbot, run the following command:

bash
node chatbot.js
Once the chatbot is initialized, you can start typing your messages. The chatbot will respond to your input based on the GPT-3.5 language model. To exit the chat, simply type 'exit' and press Enter.

Notes
This chatbot uses the GPT-3.5 language model from OpenAI. You need to provide your OpenAI API key in the openai.js file.
The chatbot initializes with a greeting message and continues the conversation until the user types 'exit'.
User input is read from the command-line interface using the readline module.
The chatbot sends the conversation history along with the user's message to the OpenAI API to generate responses.
Feel free to customize the chatbot behavior or extend its functionality based on your requirements.



Chat experience
langchain
vector store
openAI apis
baby agi
autogpt
cursor code editor

## Project Plans
1. Add a frontend
    -Auth

2. Add ChatGPT Pro features
    -Paste image into text chat
    -Image/PDF upload


## Roadmap

- Check for input validation for all entries
- Put external request in try catch and handle errors accordingly
- Reusable components and styling
- Middlewares?

### Frontend

- UI:
    - Create a mockup for the four pages
    - Create pages with basic styling and complete app functionalities
    - Create re-usable components
    - Finish up styling

### Backend

- Chat:
    - Update Chat system from terminal to user input
    - Add response streaming feature
    - Implement webscoket for real time communication
    - Add other GPT pro features

- Auth:
    - Implement a basic access code auth, users will need to provide access code to log in
    - Create random access codes (not to be pushed to the server) - and disable after first time use
    - Track token limit for each access code and log users out after reaching limit

- File upload:
    - Allow users to upload PDF, set a PDF size limit.
    - Allow users to image upload.
    - Allow users paste image into the chat
    - Allow users drag/drop PDFs and images

- Image Generator:
    - Handle image export/download
    - Implement a different image upload feature (Like Fooocus/Claude)

- Database:
    - Store user email
    - Access Codes and status
    - PDF filename
