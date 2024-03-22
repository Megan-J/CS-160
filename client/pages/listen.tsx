import React, { useState, useEffect } from "react";

function Listen() {
  const [message, setMessage] = useState("Loading");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //implement search function here
    console.log("Searching for:", searchQuery);
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
        <h1 className="text-2x1 font-semibold mb-4">Listen</h1>
        <p>Listen to music!</p>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search for music..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-lg px-4 py-2 mt-4 mb-2 block w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

export default Listen;
