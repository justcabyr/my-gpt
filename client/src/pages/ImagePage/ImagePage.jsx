function ImagePage() {
  const handleImageUpload = async (imageFile, prompt) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('prompt', prompt);

    const response = await fetch('http://localhost:5000/api/queryImage', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    console.log('Answer:', data.answer);
  };

  return (
    <div>
      <p></p>
    </div>
  );
}

export default ImagePage;
