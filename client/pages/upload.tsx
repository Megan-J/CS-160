/*for now, can make it so that anyone can upload new song ie.dont have to be logged in */
import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";

export default function upload() {
  const [filesList, setFilesList] = useState([]);

  const onFileChange = (event: any) => {
    // event.preventDefault();
    // console.log("selected file!");
    const files = event.target.files;
    for (let file of files) {
      console.log('File info: ', file.name, file.size, file.type);
    }
  };

  const createInput = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("multiple", "true");
    input.setAttribute("name", "files");

    input.addEventListener("change", () => {
      submitInput(input);
    }, false);

    return input;
  };

  const submitInput = (input: HTMLInputElement) => {
    const form = document.createElement("form");
    form.appendChild(input);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/upload"); // Ensure this matches the Flask endpoint URL

    // Optional: Listen for upload progress
    xhr.upload.addEventListener("progress", (e) => {
        const percent = e.lengthComputable? (e.loaded / e.total) * 100 : 0;
        console.log(percent.toFixed(2));
    });

    xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.send(new FormData(form));
  };

  const triggerUpload = () => {
    const input = createInput();
    input.click();
    return false;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div>
          <h1 className="text-2xl font-semibold mb-4">Upload Music</h1>
          <p>Let the world hear your magic!</p>
          <br />
          <input type="file" onChange={onFileChange} multiple/>
          <br />
          <button onClick={triggerUpload}>Upload!</button>
        </div>

        <div className="files-display">
        { 
          filesList && filesList.length > 0
          ? filesList.map((file: any, i) => (
            <div className="files" key={i}>
                <div className="files-title">{file.name}</div>
                <div className="files-type">{file.type}</div>
                <div className="files-size">{file.size}</div>
            </div>
          ))
          : <div></div>
        }
        </div>
      </div>
    </div>
  );
}
