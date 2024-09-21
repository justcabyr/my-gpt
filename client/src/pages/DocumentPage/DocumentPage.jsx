import { useState } from 'react';
import { API_URL } from '../../config/config.js';

function DocumentPage() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setResponse('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      setResponse(result.message);
    } catch (error) {
      setResponse('Error uploading file');
      console.error(error);
    }
  };

  return (
    <div>
      <div className="document__upload">
        <h1>Upload PDF</h1>
        <form onSubmit={handleFileUpload}>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
        <p>{response}</p>
      </div>

      <div className="document__form"></div>
    </div>
    // Update message variable to something else and update UI to modal. Green for success and red for error and print response
  );
}

export default DocumentPage;
