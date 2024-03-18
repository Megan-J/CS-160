import React, { useState } from "react";

const createStores: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleCreateStore = async () => {
    // Check if store name already exists
    const response = await fetch(`http://127.0.0.1:8080/flask/getStores?name=${storeName}`);
    const data = await response.json();
    if (!data.available) {
      setError("Store name already exists. Please choose a different name.");
      return;
    }

    // Check if user already has a store
    const userResponse = await fetch(`http://your-backend-server/check-user-store?username=${username}`);
    const userData = await userResponse.json();
    if (userData.hasStore) {
      setError("You already have a store. You cannot create another one.");
      return;
    }

    // Create the store
    const createStoreResponse = await fetch("http://your-backend-server/create-store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ storeName, username, description })
    });
    const createStoreData = await createStoreResponse.json();
    
    // If store created successfully, redirect to the new store page
    if (createStoreData.success) {
      window.location.href = `/stores/${storeName}`;
    } else {
      setError("Failed to create store. Please try again later.");
    }
  };

  return (
    <div>
      <button onClick={() => setShowPopup(true)}>Create Storefront</button>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={() => setShowPopup(false)}>&times;</span>
            <h2>Create Store</h2>
            <input type="text" placeholder="Store Name" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <textarea placeholder="Description (max 500 chars)" value={description} onChange={(e) => setDescription(e.target.value)} />
            <button onClick={handleCreateStore}>Create</button>
            {error && <p className="error">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default createStores;