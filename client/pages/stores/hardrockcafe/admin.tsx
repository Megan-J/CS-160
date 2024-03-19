import React, { useState, useEffect } from "react";

export default function Admin() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
      <nav className="main">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/stores">Stores</a>
            </li>
            <li>
              <a href="/upload">Upload Music</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
            <li>
              <a href="/signup">Signup</a>
            </li>
          </ul>
        </nav>
        <div>
          <h1 className="text-xl mb-4">Welcome Admin!</h1>
          
        </div>
      </div>
    </div>
  );
}
