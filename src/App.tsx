import { useEffect, useState } from 'react';
import './App.css';
import { InputPdf } from './Components/ImputPdf';
import { FileConverter } from './hook/fileConverter';
import { extract } from './utils/extract';
import { toXlsx } from './utils/toxlsx';
// import { FinalJson } from './types/final';
function App() {
  const [pdfFile, setPdfFile] = useState<File[]>([]);
  const [text, setText] = useState<string[]>([]);
  console.log(text);
  useEffect(() => {
    if (text.length === 0) return;

    const Json = text.map((tx) => extract(tx));
    console.log(Json);
    if (!Json) return;
    // toXlsx(Json);
  }, [text]);

  useEffect(() => {
    if (pdfFile.length === 0) return;
    FileConverter(pdfFile).then((res) => {
      if (!res) return;
      setText(res);
    });
  }, [pdfFile]);

  return (
    <section className='max-h-screen'>
      <div className='flex justify-center items-center h-full w-full'>
        <div className='w-full p-[30px] rounded-3xl relative'>
          <InputPdf onFileChange={(file: File[]) => setPdfFile(file)} />
        </div>
        {/* {pdfFile &&
          pdfFile.map((pdf) => {
            return (
              <FileConverter
                key={pdf.name}
                pdfUrl={URL.createObjectURL(pdf)}
                fileName={pdf.name}
              />
            );
          })} */}
      </div>
    </section>
  );
}

export default App;
