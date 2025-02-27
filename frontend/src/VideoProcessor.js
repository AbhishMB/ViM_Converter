import React, { useState } from "react";
import FileUpload from "./FileUpload";

function VideoProcessor() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [processedUrl, setProcessedUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [sliderPosition, setSliderPosition] = useState(50);

  const startStream = (fileUrl) => {
    setOriginalUrl(`http://127.0.0.1:8000${fileUrl}`);
    setProcessedUrl(`http://127.0.0.1:8000/stream/?file_url=${fileUrl}`);
    setDownloadUrl(`http://127.0.0.1:8000/processed/${fileUrl.split("/").pop()}`);
  };

  return (
    <div>
      <FileUpload onFileUpload={startStream} />

      {processedUrl && (
        <div className="video-container">
          {/* Original Video */}
          <video src={originalUrl} className="original" controls />

          {/* Processed Video Overlay */}
          <div
            className="processed-overlay"
            style={{ width: `${sliderPosition}%` }}
          >
            <video src={processedUrl} className="processed" controls />
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
            Download Processed Video
          </a>
        </div>
      )}
    </div>
  );
}

export default VideoProcessor;
