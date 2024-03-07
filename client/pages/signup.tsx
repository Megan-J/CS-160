import React, { useState, useEffect } from "react";

function signup() {
  const [message, setMessage] = useState("Loading");

  useEffect(() => {
    fetch("http://localhost:8080/home")
      .then(response => response.json())
      .then(data => setMessage(data.message))
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
      <nav className="main">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="stores">Stores</a></li>
                <li><a href="upload">Upload Music</a></li>
                <li><a href="login">Login</a></li>
                <li><a href="signup">Signup</a></li>
            </ul>
        </nav>
        <h1 className="text-2xl font-semibold mb-4">CloudSound</h1>
        <p>Login</p>

        <p>{message}</p>
      </div>
    </div>
    
  );
}

export default signup;