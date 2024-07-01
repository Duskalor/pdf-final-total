import { useEffect, useMemo, useState } from 'react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/build/pdf';
GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

import Tesseract from 'tesseract.js';
// import { FinalJson } from '../types/final';
// eslint-disable-next-line @typescript-eslint/no-explicit-any

export const FileConverter = ({
  pdfUrl,
  fileName,
}: // setfinalJson,
{
  pdfUrl: string;
  fileName: string;
  // sett: (final: string) => void;
}) => {
  console.log(fileName);
  // const myRef = React.createRef();
  const [value, setValue] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [text, setText] = useState('');
  useEffect(() => {
    setLoading(false);
  }, [imageUrls]);

  useEffect(() => {
    if (value === 1) return;
    console.log(imageUrls);

    const extractText = (base64Image: string) => {
      Tesseract.recognize(
        base64Image,
        'eng', // Cambia el idioma según sea necesario
        {
          // logger: (m) => console.log(m),
        }
      ).then(({ data: { text } }) => {
        setText(text);
      });
    };

    extractText(imageUrls[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const UrlUploader = (url: string) => {
    fetch(url).then((response) => {
      response.blob().then((blob) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (!e.target || !e.target.result) return;
          if (typeof e.target.result !== 'string') return;
          const data = atob(e.target.result.replace(/.*base64,/, ''));
          renderPage(data);
        };
        reader.readAsDataURL(blob);
      });
    });
  };

  useMemo(() => {
    UrlUploader(pdfUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderPage = async (data: string) => {
    setLoading(true);
    const imagesList: string[] = [];
    const canvas = document.createElement('canvas');
    canvas.setAttribute('className', 'canv');
    const pdf = await getDocument({ data }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 4 });
    canvas.height = viewport.height / 5;
    canvas.width = viewport.width;
    const render_context = {
      canvasContext: canvas.getContext('2d'),
      viewport: viewport,
    };
    await page.render(render_context).promise;
    const img = canvas.toDataURL('image/png');
    imagesList.push(img);
    setImageUrls((e) => [...e, ...imagesList]);
    setValue(2);
  };

  return <div>{text}</div>;
};
