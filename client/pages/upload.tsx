/*for now, can make it so that anyone can upload new song ie.dont have to be logged in */
import React, { useState, useEffect } from "react";
import NavBar from './components/NavBar';

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
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <NavBar />
                <div>
                    <h1 className="text-2xl font-semibold mb-4">Upload Music</h1>
                    <p>Let the world hear your magic!</p>
                    <br />
                    <input type="file" onChange={onFileChange} />
                    <br />
                    <button onClick={onFileUpload}>Upload!</button>
                </div>
            </div>
        </div>
    );
}
