import React, { useState } from "react";
import Image from "next/image";

function FileUploader({ register, setValue }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [files, setFiles] = useState([]);

  const handleFileUpload = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const filesArray = Array.from(selectedFiles);
      setFiles(filesArray);
      setImagePreview(URL.createObjectURL(filesArray[0]));
      setValue("files", filesArray);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles) {
      const filesArray = Array.from(droppedFiles);
      setFiles(filesArray);
      setImagePreview(URL.createObjectURL(filesArray[0]));
      setValue("files", filesArray);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <label htmlFor="fileInput" className="cursor-pointer text-center">
        <div
          className="border-2 border-dashed border-gray-400 p-8 rounded-lg mx-32"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="fileInput"
            multiple
          />
          {!imagePreview && (
            <div className="flex flex-col items-center justify-center">
              <Image
                src="/dragNdrop.png"
                width={70}
                height={25}
                alt="drag and drop"
              />
              <span className="text-gray-500">
                Drop your file here or click to upload.
              </span>
            </div>
          )}
          {imagePreview && (
            <Image
              src={imagePreview}
              alt="Uploaded file"
              className="rounded-xl"
              width={170}
              height={125}
            />
          )}
        </div>
      </label>
    </div>
  );
}

export default FileUploader;
