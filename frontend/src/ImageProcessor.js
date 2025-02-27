import React, { useState } from "react";
import axios from "axios";
import FileUpload from "./FileUpload";

function ImageProcessor() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [processedUrl, setProcessedUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [sliderPosition, setSliderPosition] = useState(50); // Default in center

  const processImage = async (fileUrl) => {
    setOriginalUrl(`http://127.0.0.1:8000${fileUrl}`);

    try {
      let response = await axios.post("http://127.0.0.1:8000/process/", {
        file_url: fileUrl,
      });

      setProcessedUrl(`http://127.0.0.1:8000${response.data.processed_url}`);
      setDownloadUrl(`http://127.0.0.1:8000${response.data.download_url}`);
    } catch (error) {
      console.error("Processing failed", error);
    }
  };

  return (
    <div>
      <FileUpload onFileUpload={processImage} />

      {processedUrl && (
        <div className="image-container">
          {/* Original Image */}
          <img src={originalUrl} className="original" alt="Original" />

          {/* Processed Image - Initially Hidden by Width */}
          <div
            className="processed-overlay"
            style={{ width: `${sliderPosition}%` }}
          >
            <img src={processedUrl} className="processed" alt="Processed" />
          </div>

          {/* Vertical Slider Handle */}
          <div
            className="slider-handle"
            style={{ left: `${sliderPosition}%` }}
          ></div>

          {/* Invisible Slider Input */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(e.target.value)}
            className="slider"
          />

          {/* ✅ Download Button */}
          <a href={downloadUrl} download className="download-button">
            Download Processed Image
          </a>
        </div>
      )}
    </div>
  );
}

export default ImageProcessor;
