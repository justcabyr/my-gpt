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
                Home
              </Link>
            </li>
            <li>
              <Link to="/" className="sidebar__link">
                Document
              </Link>
            </li>
            <li>
              <Link to="/" className="sidebar__link">
                Image
              </Link>
            </li>
          </ul>
        )}
      </div>
    </>
  );
}

export default ImagePage;
