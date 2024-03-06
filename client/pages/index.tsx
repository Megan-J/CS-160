import React, { useState, useEffect } from "react";

function index() {
  const [message, setMessage] = useState("Loading");

  useEffect(() => {
    fetch("http://localhost:8080/home")
      .then(response => response.json())
      .then(data => setMessage(data.message))
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">CloudSound</h1>
        <p>{message}</p>
      </div>
    </div>
    
  );
}

export default index;
