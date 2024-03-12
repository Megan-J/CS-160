import React, { useState, useEffect } from "react";

function signup() {
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
        <h1 className="text-2xl font-semibold mb-4"></h1>
        <div>
          <h2 className="text-xl mb-4">Sign Up</h2>
          <form>
            <label className="font-semibold">
              Name
              <input type="text" name="username" />
            </label>
            <label className="font-semibold">
              Password
              <input type="text" name="password" />
            </label>
            <label className="font-semibold">
              Confirm Password
              <input type="text" name="password" />
            </label>
            <br />
            <button type="button">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default signup;
