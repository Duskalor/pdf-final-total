import React, { useState } from 'react';
import * as cv from 'opencv.js'; // Importar OpenCV.js
import Tesseract from 'tesseract.js';

const TextDetection = () => {
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);
  const [detectedText, setDetectedText] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target) return;
        setSelectedImage(event.target.result);
        detectText(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const detectText = (imageSrc: string | ArrayBuffer | null) => {
    const imgElement = new Image();
    imgElement.src = imageSrc as string;
    imgElement.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      context.drawImage(imgElement, 0, 0);

      const src = cv.imread(canvas);
      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
      const binary = new cv.Mat();
      cv.threshold(gray, binary, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(
        binary,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
      );
      for (let i = 0; i < contours.size(); i++) {
        const cnt = contours.get(i);
        const rect = cv.boundingRect(cnt);
        const point1 = new cv.Point(rect.x, rect.y);
        const point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
        cv.rectangle(src, point1, point2, [255, 0, 0, 255], 2);
      }
      cv.imshow('canvasOutput', src);

      src.delete();
      gray.delete();
      binary.delete();
      contours.delete();
      hierarchy.delete();

      Tesseract.recognize(canvas, 'eng', {
        logger: (m) => console.log(m),
      }).then(({ data: { text } }) => {
        setDetectedText(text);
      });
    };
  };

  return (
    <div>
      <input type='file' accept='image/*' onChange={handleImageUpload} />
      {selectedImage && (
        <div>
          <img
            src={selectedImage as string}
            alt='Selected'
            style={{ maxWidth: '100%', maxHeight: '400px' }}
          />
          <canvas id='canvasOutput' style={{ display: 'none' }}></canvas>
        </div>
      )}
      {detectedText && (
        <div>
          <h3>Detected Text:</h3>
          <p>{detectedText}</p>
        </div>
      )}
    </div>
  );
};

export default TextDetection;
