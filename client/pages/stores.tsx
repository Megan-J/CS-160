import React, { useState, useEffect } from "react";

function stores() {
  const [message, setMessage] = useState("Loading");

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

        <h1 className="text-2xl font-semibold mb-4">Stores</h1>
        <p>Explore all the stores created by our very own users!</p>

        <p>{message}</p>
      </div>
    </div>
  );
}

export default stores;
