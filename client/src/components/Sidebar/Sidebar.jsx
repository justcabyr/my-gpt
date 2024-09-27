import { useState } from 'react';
import { Link } from 'react-router-dom';

function ImagePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          {isSidebarOpen ? 'Close' : 'Open'} Sidebar
        </button>
        {isSidebarOpen && (
          <ul>
            <li>
              <Link to="/" className="sidebar__link">
                Chat Home
              </Link>
            </li>
            <li>
              <Link to="/document" className="sidebar__link">
                Document Processor
              </Link>
            </li>
            <li>
              <Link to="/image" className="sidebar__link">
                Image Processor
              </Link>
            </li>
            <li>
              <Link to="/generator" className="sidebar__link">
                Image Generator
              </Link>
            </li>
          </ul>
        )}
      </div>
    </>
  );
}

export default ImagePage;
