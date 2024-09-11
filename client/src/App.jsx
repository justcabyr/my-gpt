import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "./pages/ChatPage/ChatPage";
import DocumentPage from "./pages/DocumentPage/DocumentPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div className="app">
        {/* <Header /> */}
        <main className="app__main">
          <Routes>
            <Route path="/" element={<Navigate to="/chat" replace={true} />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/document" element={<DocumentPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;