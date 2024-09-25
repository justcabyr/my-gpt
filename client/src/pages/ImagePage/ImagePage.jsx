import { useEffect, useState } from 'react';
import { API_URL } from '../../config/config.js';
import axios from 'axios';
import './ImagePage.scss';

function ImagePage() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    const savedMessages = sessionStorage.getItem('imageQueryMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('imageQueryMessages', JSON.stringify(messages));
  }, [messages]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setResponse('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_URL}/upload-image`, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      setResponse(result.message);
    } catch (error) {
      setResponse('Error uploading image');
      console.error(error);
    }
  };

  const sendImageQuery = async () => {
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const { data } = await axios.post(`${API_URL}/image`, { prompt: input });

    setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendImageQuery();
  };

  return (
    <div className="chat">
      <div className="document__upload">
        <h1>Upload an Image and ask questions</h1>
        <div className="chat__wrapper">
          {messages.map((msg, index) => (
            <div key={index} className={`chat__message ${msg.role === 'user' ? 'left' : 'right'}`}>
              {msg.content}
            </div>
          ))}
        </div>
        <form onSubmit={handleFileUpload}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
        <p>{response}</p>
      </div>

      <div className="document__form">
        <form onSubmit={handleSubmit} className="chat__input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
    // Update message variable to something else and update UI to modal. Green for success and red for error and print response
  );
}

export default ImagePage;
