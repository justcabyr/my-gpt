import "./App.scss";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "./pages/ChatPage/ChatPage";
import DocumentPage from "./pages/DocumentPage/DocumentPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import Sidebar from './components/Sidebar/Sidebar';
import QuestionPage from "./pages/QuestionPage/QuestionPage";
import ImagePage from './pages/ImagePage/ImagePage';

function App() {

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/chat" replace={true} />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/generator" element={<QuestionPage />} />
            <Route path="/document" element={<DocumentPage />} />
            <Route path="/image" element={<ImagePage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
