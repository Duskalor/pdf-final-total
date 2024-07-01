import { useEffect, useRef, useState } from 'react';
import uploadImg from '../assets/cloud-upload-regular-240.png';
import filePdf from '../assets/file-pdf-solid-240.png';

export const InputPdf = ({
  onFileChange,
}: {
  onFileChange: (file: File[]) => void;
}) => {
  const wrapperRef = useRef(null);
  const [file, setFile] = useState<null | File[]>(null);

  useEffect(() => {
    if (!file) return;
    onFileChange(file);
  }, [file]);

  const onDragEnter = () => wrapperRef.current.classList.add('dragover');

  const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

  const onDrop = () => wrapperRef.current.classList.remove('dragover');

  const onFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    const validFiles = newFiles.filter(
      (file) => file.type === 'application/pdf'
    );
    if (validFiles.length > 0) setFile(validFiles);
  };

  return (
    <>
      <section className='flex justify-center items-center flex-row mb-3'>
        <h1>PDF </h1>
        <h1>to Excel</h1>
      </section>
      {!file && (
        <button
          ref={wrapperRef}
          className=' w-full h-[200px] rounded-3xl flex items-center justify-center'
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className='text-center font-semibold p-10 '>
            <img src={uploadImg} alt='' className='w-full' />
            <p>Drag & Drop your files here</p>
          </div>
          <input
            className='opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer  dragover:opacity-60'
            type='file'
            accept='.pdf'
            value=''
            multiple
            onChange={onFileDrop}
          />
        </button>
      )}
      {file ? (
        <div className='drop-file-preview'>
          <p className='drop-file-preview__title'>Uploaded file</p>
          <div className='drop-file-preview__item'>
            <img src={filePdf} alt='PDF Icon' />
            <div className='drop-file-preview__item__info'>
              <p>{file.map((file) => file.name)}</p>
              {/* <p>{returnSize(file)}</p> */}
            </div>
            <button onClick={() => setFile(null)}>CERRAR</button>
          </div>
        </div>
      ) : null}
    </>
  );
};
