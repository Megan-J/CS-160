/*MAIN PAGE*/
import React, { useState, useEffect } from "react";

export default function index() {
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
              <a href="listen">Listen</a>
            </li>
            <li>
              <a href="upload">Upload Music</a>
            </li>
            <li>
              <a href="login">Login</a>
            </li>
            <li>
              <a href="signup">Sign Up</a>
            </li>
            <li>
              <a href="/checkout">Checkout</a>
            </li>
          </ul>
        </nav>
        <h1 className="text-2xl font-semibold mb-4">Radar</h1>
        <p>Start Listening today!</p>
      </div>
    </div>
  );
}
