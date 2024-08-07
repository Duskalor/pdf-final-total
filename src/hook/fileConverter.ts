import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/build/pdf';
GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
// import { getDocument } from 'pdfjs-dist';
import tesseract from 'tesseract.js';
// const worker = await createWorker('spa');

const renderPage = async (data: string) => {
  // const imagesList: string[] = [];
  const canvas = document.createElement('canvas');
  // canvas.setAttribute('className', 'canv');
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
  const text = await extractText(img);
  return text;
};

const UrlUploader = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const reader = new FileReader();

  const promiseText = await new Promise((res) => {
    reader.onload = (e) => {
      if (!e.target || !e.target.result) return;
      if (typeof e.target.result !== 'string') return;
      const data = atob(e.target.result.replace(/.*base64,/, ''));
      renderPage(data).then((text) => {
        res(text);
      });
    };
    reader.readAsDataURL(blob);
  });

  return promiseText as string;
};

const extractText = async (base64Image: string) => {
  const {
    data: { text },
  } = await tesseract.recognize(base64Image, 'spa');
  // await worker.terminate();
  return text;
};

const processPdfsInBatches = async (urls: File[], batchSize: number) => {
  const results = [];

  for (let i = 0; i < urls.length; i += batchSize) {
    console.log({ i });
    const batch = urls.slice(i, i + batchSize);
    // const names = urls.map((n) => n.name);
    // console.log(names);
    const AllFile = batch.map((pdf) => {
      const pdfUrl = URL.createObjectURL(pdf);
      return UrlUploader(pdfUrl);
    });
    const batchResults = await Promise.all(AllFile);
    // console.log(batchResults.join('/n'));
    results.push(...batchResults);
  }
  return results;
};

export const FileConverter = async (pdfs: File[]) => {
  console.time('timer');
  if (pdfs.length === 0) return;
  const result = await processPdfsInBatches(pdfs, 10);
  console.timeEnd('timer');
  return result;
};
