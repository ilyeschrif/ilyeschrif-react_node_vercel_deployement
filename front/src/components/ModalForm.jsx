import React, { useState } from 'react';
import '../styles/modalform.css';

const ModalForm = ({ closeModal, id }) => {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [type, setType] = useState('');
  const [taille, setTaille] = useState(''); // New state for size
  const [fileError, setFileError] = useState('');

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFileError('');

    const validFiles = selectedFiles.filter((file) => file.type.startsWith('image/'));
    const filesWithinSizeLimit = validFiles.filter((file) => file.size <= MAX_FILE_SIZE);

    if (validFiles.length !== selectedFiles.length) {
      setFileError('Only image files are allowed.');
    }

    if (filesWithinSizeLimit.length !== validFiles.length) {
      setFileError('Some files are too large. Max file size is 5MB.');
    }

    const filePreviews = filesWithinSizeLimit.map((file) => URL.createObjectURL(file));
    setImages(filePreviews);
    setFiles(filesWithinSizeLimit);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !color || !type || !taille) {
      alert('Please fill out all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('color', color);
    formData.append('type', type);
    formData.append('size', taille); // Include size field
    formData.append('company_id', id);

    files.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    try {
      const response = await fetch('http://localhost/upload.php', {
        method: 'POST',
        mode: 'cors',
        body: formData,
      });

      const responseText = await response.text();
      if (response.ok) {
        const result = JSON.parse(responseText);
        if (result.status === 'success') {
          alert('Data and images uploaded successfully!');
          setName('');
          setColor('');
          setType('');
          setTaille('');
          setImages([]);
          setFiles([]);
        } else {
          alert('Failed to upload data: ' + result.message);
        }
      } else {
        alert('Failed to upload data.');
      }
    } catch (error) {
      alert('An error occurred while uploading data.');
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2 className="modalTitle">إضافة تفاصيل</h2>
        <form onSubmit={handleSubmit} className="modalForm">
          <label>
            الاسم
            <input
              type="text"
              className="inputField"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            اللون
            <input
              type="text"
              className="inputField"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            />
          </label>
          <label>
            النوعية
            <input
              type="text"
              className="inputField"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </label>
          <label>
            الحجم
            <input
              type="text"
              className="inputField"
              value={taille}
              onChange={(e) => setTaille(e.target.value)}
              required
            />
          </label>
          <label>
            صور متعددة
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="fileInput"
              accept="image/*"
            />
          </label>
          {fileError && <p className="fileError">{fileError}</p>}
          <div className="imagePreview">
            {images.length > 0 &&
              images.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`صورة ${index + 1}`}
                  className="previewImage"
                />
              ))}
          </div>
          <div className="buttonGroup">
            <button type="button" onClick={closeModal} className="closeButton">
              إلغاء
            </button>
            <button type="submit" className="submitButton">
              إضافة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
