import { useState, useEffect } from 'react';
import './ChatPage.scss';
import bot from '../../assets/icons/bot.png';
import user from '../../assets/icons/user.png';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    const savedMessages = sessionStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { role: 'user', content: input };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: input }],
          stream: true,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        const lines = chunk.split('\n').filter((line) => line.trim() !== '');
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const json = line.replace(/^data: /, '');

            if (json === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(json);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                botResponse += content;
              }
            } catch (error) {
              console.error('Error parsing streamed response:', error);
            }
          }
        }
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: botResponse }]);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="chat">
      <h1>Chat with an AI</h1>
      <div className="chat__wrapper">
        {messages.map((msg, index) => (
          <div key={index} className={`chat__message ${msg.role === 'user' ? 'left' : 'right'}`}>
           <div>
           <img src={msg.role === 'user' ? user : bot} className={'avatar'} alt="profile avatar" />
            </div> 
            {msg.content}
          </div>
        ))}
      </div>
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
  );
}

export default ChatPage;
