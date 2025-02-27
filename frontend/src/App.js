import React from "react";
import ImageProcessor from "./ImageProcessor";
import VideoProcessor from "./VideoProcessor";
import FileUpload  from "./FileUpload";
import ImageVideoProcessor from "./ImageVideoProcessor";

function App() {
  return (
    <div className="App">
      <h1>Black & White Image & Video Processor</h1>
      
      {/* <ImageProcessor />
      <VideoProcessor /> */}
      <ImageVideoProcessor />
    </div>
  );
}

export default App;
