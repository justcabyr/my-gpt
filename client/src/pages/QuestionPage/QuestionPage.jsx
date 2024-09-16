import { useState } from "react";
import { apiUrl } from "../../config/config.js";

function QuestionPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState("");
  // const [history, setHistory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchChatStream = async (prompt) => {
    setIsLoading(true);
    setMessages(""); // Clear previous messages

    const response = await fetch(`${apiUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      setMessages((prev) => prev + chunk);
    }

    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      fetchChatStream(input);
      setInput("");
    }
  };

  return (
    <div className="App">
      <h1>Chatbot with OpenAI & Streaming</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a prompt..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
      <div className="chat-window">{isLoading ? <p>Loading...</p> : <p>{messages}</p>}</div>
    </div>
  );
}

export default QuestionPage;
