import React, { useState, useEffect } from "react";
import SearchStores from "./components/searchStores";
import CreateStores from "./components/createStores";

function stores() {
  const [message, setMessage] = useState("Loading");
  //const [userLoggedIn, setUserLoggedIn] = useState(false); // Assuming user login state
  //const [searchQuery, setSearchQuery] = useState(""); // State for search query
  //const [storesList, setStoresList] = useState([]); // State for storing fetched stores

  // Function to fetch stores data
  // const fetchStores = () => {
  //   // Assuming API endpoint for fetching stores
  //   fetch("http://localhost:8080/stores")
  //     .then(response => response.json())
  //     .then(data => setStoresList(data));
  // };

  // Function to handle search input change
  // const handleSearchInputChange = (event) => {
  //   setSearchQuery(event.target.value);
  // };

  // // Function to filter stores based on search query
  // const filteredStores = storesList.filter(store =>
  //   store.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // Function to handle creating a new TikTok shop
  // const handleCreateShop = () => {
  //   // Assuming logic to create a new shop
  //   // Redirect to the new shop's URL
  //   window.location.href = "/stores/newShop"; // Redirect to the new shop's URL
  // };

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

        <div className="title">
          <h1 className="text-2xl font-semibold mb-4">Stores</h1>
          <p>Explore all the stores created by our very own users!</p>
        </div>

        {/* Check if user is logged in to show the create shop button */}
        {/* {//userLoggedIn && (
          <button 
            className="absolute left-4 top-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleCreateShop}>
            Create TikTok Shop
          </button>
        //)
        } */}

        {/* Search bar */}
        {/* <div className="text-center mt-4">
          <input
            type="text"
            placeholder="Search stores..."
            className="border border-gray-300 rounded-md px-4 py-2"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div> */}
        <div className="createStore">
          <CreateStores />
        </div>

        <div className="searchStore">
          <SearchStores />
        </div>
        {/* Display filtered stores */}
      </div>
    </div>
  );
}

export default stores;

// {filteredStores.map(store => (
//   <div key={store.id} className="mt-4 border border-gray-200 p-4 rounded">
//     <h2 className="text-lg font-semibold">{store.name}</h2>
//     {/* Add link to store page */}
//     <a href={`/stores/${store.name}`} className="text-blue-500">Visit Store</a>
//   </div>
// ))}
