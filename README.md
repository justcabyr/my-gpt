# Project Title
Chatbot

## Overview

An advanced AI-powered application with AI chat, PDF processing and AI images.

This app will provide a convenient way to interact with OpenAI's powerful language models, such as GPT-3.

### Features

- As a user, I want to be able to chat with an AI.
- As a user, I want to be able to upload a PDF and ask an AI questions about the PDF document.
- As a user, I want to be able to generate random AI images.

## Implementation

### Tech Stack

- React (Frontend)
- Express (Backend)

### APIs

- OpenAI APIs

### Sitemap

- Login page
- Chat page (Landing page)
- PDF Manager page
- Image generation page

### Auth

- Implement a basic access code auth, users will need to provide access code to log in
- Create random access codes (not to be pushed to the server) - and disable after use

### Mockups

#### Login and Chat Page
![](login-and-chat-page.jpeg)

#### PDF Manager and Image Generations Page
![](pdf-and-image-page.jpeg)




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
