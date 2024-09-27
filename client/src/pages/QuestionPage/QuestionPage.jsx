import { useState } from 'react';
import axios from 'axios';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

function QuestionPage() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  // const [messages, setMessages] = useState('');

  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    console.log(prompt)
    setLoading(true);
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          prompt: prompt,
          n: 1,
          size: '1024x1024',
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Assuming the response contains a URL to the generated image
      setImageUrl(response.data.data[0].url);
    } catch (error) {
      console.error('Error generating image:', error);
    }
    setLoading(false);
  };

  return (
    <div className="chat">
      <h1>Image Generator</h1>
      <div className="chat__message">
        {/* <h2>Generated Image:</h2> */}
        <img src={imageUrl} style={{ maxWidth: '75%', height: 'auto' }} />
      </div>
      <form className="chat__input">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt..."
          disabled={loading}
        />
        <button type="submit" onClick={generateImage} disabled={loading}>
          Send
        </button>
      </form>
      {/* <div className="chat-window">{loading ? <p>Loading...</p> : <p>{history}</p>}</div> */}
    </div>
  );
}

export default QuestionPage;
