import { useEffect, useState } from 'react';
import './App.css';
import { InputPdf } from './Components/ImputPdf';
import { FileConverter } from './hook/fileConverter';
import { extract } from './utils/extract';
import { toXlsx } from './utils/toxlsx';
import { FinalJson } from './types/final';
// import { FinalJson } from './types/final';
function App() {
  const [pdfFile, setPdfFile] = useState<File[]>([]);
  const [text, setText] = useState<string[]>([]);
  const [excel, setExcel] = useState<FinalJson[]>([]);
  // console.log(text);
  useEffect(() => {
    if (text.length === 0) return;
    const Json = text.map((tx) => extract(tx));
    console.log(Json);
    if (!Json) return;

    setExcel(Json);
  }, [text]);

  useEffect(() => {
    if (pdfFile.length === 0) return;
    FileConverter(pdfFile).then((res) => {
      if (!res) return;
      setText(res);
      // setLoading(false);
    });
  }, [pdfFile]);

  const handleXLSX = () => {
    toXlsx(excel);
  };

  return (
    <section className='max-h-screen'>
      <div className='flex justify-center items-center h-full w-full'>
        <div className='w-full p-[30px] rounded-3xl relative'>
          <InputPdf
            onFileChange={(file: File[]) => setPdfFile(file)}
            setExcel={() => setExcel([])}
          />
        </div>
      </div>
      {/* <TextDetection /> */}
      {pdfFile.length !== 0 && text.length === 0 && <div>Cargando ... </div>}
      {excel.length !== 0 && (
        <button onClick={() => handleXLSX()}>Descargar XLSX</button>
      )}
    </section>
  );
}

export default App;
