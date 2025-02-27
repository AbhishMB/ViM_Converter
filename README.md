# 🎨 ViM_Converter

ViM_Converter is a web application that allows you to transform images and videos into grayscale. The processed files can be downloaded for analysis or used as training data for machine learning models.

## 📋 Table of Contents
- [Features](#✨-features)
- [Installation](#🛠️-installation)
- [Usage](#🚀-usage)
- [Contributing](#🤝-contributing)
- [License](#📄-license)
- [Acknowledgments](#🙏-acknowledgments)

## ✨ Features
- **Image Conversion**: Upload images in various formats and convert them to grayscale.
- **Video Conversion**: Upload videos and convert them into grayscale versions.
- **Downloadable Outputs**: Download the processed files directly after conversion.
- **Machine Learning Integration**: Use the grayscale outputs for analysis and as training data for machine learning models.

## 🛠️ Installation

To set up **ViM_Converter** locally:

### 1. Clone the Repository:

```bash
git clone https://github.com/AbhishMB/ViM_Converter.git
cd ViM_Converter
```

### 2. Backend Setup:

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python3 -m venv env
source env/bin/activate  # On Windows, use `env\Scripts\activate`
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Start the backend server:

```bash
python app.py
```

### 3. Frontend Setup:

Navigate to the frontend directory:

```bash
cd ../frontend
```

Install the necessary packages:

```bash
npm install
```

Start the frontend application:

```bash
npm start
```

You can now access the application in your web browser at [http://localhost:3000](http://localhost:3000).

## 🚀 Usage

- **Access the Application**: Open your web browser and go to [http://localhost:3000](http://localhost:3000).
- **Upload Files**: Use the upload interface to select images or videos from your device.
- **Convert Files**: After uploading, click on the "Convert to Grayscale" button to process the files.
- **Download Outputs**: Once the conversion is complete, download the grayscale files for your use.

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:

```bash
git checkout -b feature/YourFeatureName
```

3. Make your changes.
4. Commit your changes:

```bash
git commit -m 'Add some feature'
```

5. Push to the branch:

```bash
git push origin feature/YourFeatureName
```

6. Open a pull request.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🙏 Acknowledgments

- Inspiration and initial concept by **AbhishMB**.
- Thanks to all contributors and the open-source community for their valuable input and support.

---

Enjoy using ViM_Converter! 🎨
