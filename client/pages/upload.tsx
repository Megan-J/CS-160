/*for now, can make it so that anyone can upload new song ie.dont have to be logged in */
import React, { useState, useEffect } from "react";

export default function upload() {
  const onFileChange = (event) => {
    console.log("selected file!");
  };

  const onFileUpload = () => {
    console.log("uploaded file!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <nav className="main">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="stores">Stores</a>
            </li>
            <li>
              <a href="upload">Upload Music</a>
            </li>
            <li>
              <a href="login">Login</a>
            </li>
            <li>
              <a href="signup">Signup</a>
            </li>
          </ul>
        </nav>
        <div>
          <h1 className="text-2xl font-semibold mb-4">Upload Music</h1>
          <p>Let the world hear your magic!</p>

          <input type="file" onChange={onFileChange} />
          <br />
          <button onClick={onFileUpload}>Upload!</button>
        </div>
      </div>
    </div>
  );
}
