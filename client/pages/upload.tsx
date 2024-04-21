import React, { useState, useEffect } from "react";
import Panel from "./components/Panel";
import SearchStores from "./components/searchStores";

export default function upload() {
  const onFileChange = (event: any) => {
    event.preventDefault();
    console.log("selected file!");
  };

  const onFileUpload = () => {
    console.log("uploaded file!");
    alert("file successfully uploaded!");
  };

  return (
     
        <Panel title="Upload Music" >
        <div>
          <p>Let the world hear your magic!</p>
          <br />
          <></>
          <input type="file" onChange={onFileChange} />
          <br />
          <button onClick={onFileUpload}>Upload!</button>
        </div>
        </Panel>
  );
}

