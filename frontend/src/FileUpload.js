import React, { useState } from "react";
import axios from "axios";

function FileUpload({ onFileUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    uploadFile(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setSelectedFile(event.dataTransfer.files[0]);
    uploadFile(event.dataTransfer.files[0]);
  };

  const uploadFile = async (file) => {
    let formData = new FormData();
    formData.append("file", file);
    try {
      let response = await axios.post("http://127.0.0.1:8000/upload/", formData);
      onFileUpload(response.data.file_url);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div
      className="dropzone"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input type="file" onChange={handleFileSelect} />
      <p>Drop an image or video, or click to select one</p>
    </div>
  );
}

export default FileUpload;
