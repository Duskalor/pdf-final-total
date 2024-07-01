import { useState } from 'react';
import './App.css';
import { FileConverter } from './Components/Converter';
import { InputPdf } from './Components/ImputPdf';
// export const primary = '#176ede';
function App() {
  const [pdfFile, setPdfFile] = useState<null | File[]>(null);
  // const [finalJson, setfinalJson] = useState([]);
  // console.log(finalJson);
  return (
    <section className='max-h-screen '>
      <div className='flex justify-center items-center h-full w-full'>
        <div className='w-full p-[30px] rounded-3xl relative'>
          <InputPdf onFileChange={(file: File[]) => setPdfFile(file)} />
        </div>
        {pdfFile &&
          pdfFile.map((pdf) => {
            return (
              <FileConverter
                key={pdf.name}
                pdfUrl={URL.createObjectURL(pdf)}
                fileName={pdf.name}
                // onGetText={(text: FinalJson) =>
                //   setfinalJson((e) => [...e, text])
                // }
              />
            );
          })}
      </div>
    </section>
  );
}

export default App;
