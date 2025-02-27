


// import React, { useState } from 'react';
// import axios from 'axios';
// // Import BeforeAfterSlider as the default export:
// import BeforeAfterSlider from 'react-before-after-slider-component';
// import 'react-before-after-slider-component/dist/build.css';

// const ImageVideoProcessor = () => {
//     const [file, setFile] = useState(null);
//     const [original, setOriginal] = useState(null);
//     const [processed, setProcessed] = useState(null);
//     const [isVideo, setIsVideo] = useState(false);

//     const handleFileChange = (e) => {
//         const uploadedFile = e.target.files[0];
//         if (uploadedFile) {
//             setFile(uploadedFile);
//             setOriginal(URL.createObjectURL(uploadedFile));
//             setIsVideo(uploadedFile.type.startsWith("video"));
//         }
//     };

//     const handleUpload = async () => {
//         if (!file) {
//             alert("Please select a file first!");
//             return;
//         }

//         const formData = new FormData();
//         formData.append('file', file);

//         try {
//             const response = await axios.post('http://127.0.0.1:8000/process/', formData);

//             if (response.data.processed_video_url) {
//                 setProcessed(`http://127.0.0.1:8000${response.data.processed_video_url}`);
//             } else if (response.data.processed_image_url) {
//                 setProcessed(`http://127.0.0.1:8000${response.data.processed_image_url}`);
//             } else {
//                 console.error("No processed file received from backend.");
//             }
//         } catch (error) {
//             console.error("Upload failed", error);
//         }
//     };

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//             <input type="file" accept="image/*, video/*" onChange={handleFileChange} />
//             <button onClick={handleUpload} style={{ marginBottom: '20px' }}>Upload & Process</button>

//             {/* For Images */}
//             {original && processed && !isVideo && (
//                 <div style={{ textAlign: 'center', marginBottom: '20px' }}>
//                     <h3>Before & After Processing (Image)</h3>
//                     <BeforeAfterSlider
//                         firstImage={{ imageUrl: original }}
//                         secondImage={{ imageUrl: processed }}
//                         className="before-after-container"
//                     />
//                     <a href={processed} download className="download-btn">Download Processed Image</a>
//                 </div>
//             )}

//             {/* For Videos */}
//             {original && processed && isVideo && (
//                 <div className="video-container" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
//                     <div>
//                         <h3>Original Video</h3>
//                         <video width="300" height="200" controls>
//                             <source src={original} type="video/mp4" />
//                             Your browser does not support the video tag.
//                         </video>
//                     </div>
//                     <div>
//                         <h3>Processed Video</h3>
//                         <video width="300" height="200" controls>
//                             <source src={processed} type="video/mp4" />
//                             Your browser does not support the video tag.
//                         </video>
//                         <br />
//                         <a href={processed} download className="download-btn">Download Processed Video</a>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ImageVideoProcessor;


import React, { useState, useRef } from 'react';
import axios from 'axios';
import BeforeAfterSlider from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css';
import './ImageVideoProcessor.css'; // Import our custom CSS

const ImageVideoProcessor = () => {
  const [file, setFile] = useState(null);
  const [original, setOriginal] = useState(null);
  const [processed, setProcessed] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const fileInputRef = useRef(null);

  // Triggered when a file is selected (either via drag & drop or file dialog)
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const fileURL = URL.createObjectURL(uploadedFile);
      setOriginal(fileURL);
      setIsVideo(uploadedFile.type.startsWith("video"));
      setProcessed(null); // Reset processed result
    }
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const fileURL = URL.createObjectURL(uploadedFile);
      setOriginal(fileURL);
      setIsVideo(uploadedFile.type.startsWith("video"));
      setProcessed(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Upload file to Django backend and get processed URL
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/process/', formData);
      if (response.data.processed_video_url) {
        setProcessed(`http://127.0.0.1:8000${response.data.processed_video_url}`);
      } else if (response.data.processed_image_url) {
        setProcessed(`http://127.0.0.1:8000${response.data.processed_image_url}`);
      } else {
        console.error("No processed file received from backend.", response.data);
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="container">
      <h2>Image & Video Processor</h2>
      
      {/* Drag and drop area */}
      <div 
        className="dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current.click()}
      >
        <p>Drag and drop your image/video here, or click to select a file</p>
        <input 
          type="file" 
          accept="image/*, video/*" 
          onChange={handleFileChange} 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
        />
      </div>
      
      <button className="upload-btn" onClick={handleUpload}>Upload & Process</button>

      {/* --- IMAGE CASE --- */}
      {original && !isVideo && !processed && (
        <div className="preview">
          <h3>Original Image</h3>
          <img src={original} alt="Original" className="preview-image" />
        </div>
      )}

      {original && processed && !isVideo && (
        <div className="result">
          <h3>Before & After Processing (Image)</h3>
          <div className="slider-container">
            <BeforeAfterSlider
              firstImage={{ imageUrl: original }}
              secondImage={{ imageUrl: processed }}
            />
          </div>
          <a href={processed} download className="download-btn">
            Download Processed Image
          </a>
        </div>
      )}

      {/* --- VIDEO CASE (Unchanged) --- */}
      {original && processed && isVideo && (
        <div className="result">
          <h3>Video Processing</h3>
          <div className="video-container">
            <div className="video-wrapper">
              <h4>Original Video</h4>
              <video width="300" height="200" controls>
                <source src={original} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="video-wrapper">
              <h4>Processed Video</h4>
              <video width="300" height="200" controls>
                <source src={processed} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <a href={processed} download className="download-btn">Download Processed Video</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageVideoProcessor;
