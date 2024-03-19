import React, { useState } from "react";

const createStores: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [stores, setStores] = useState([]);

  const handleCreateStore = async () => {

    // Fetch all stores
    const response = await fetch("http://127.0.0.1:8080/store/all");
    if (!response.ok) {
        throw new Error("Failed to fetch stores.");
    }
    const storesData = await response.json();
    setStores(storesData);
    
     // Check if store name already exists
     const storeExists = storesData.some((store: { name: string; }) => store.name === storeName.toLowerCase());
     if (storeExists) {
         setError("Store name already exists. Please choose a different name.");
         return;
     }

    // Check if user already has a store
    //const userID = storesData.some()
    //const userResponse = await fetch(`http://127.0.0.1:8080/flask/getStores?user=${username}`);
    //const userData = await userResponse.json();
   // if (userData.hasStore) {
     // setError("You already have a store. You cannot create another one.");
    //  return;
   // }

    // Create the store
    // Proceed with creating the store if name doesn't exist
    const createStoreResponse = await fetch("http://127.0.0.1:8080/store/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ vchStoreName: storeName, nUserID: 4, txtDescription: description })
    });
    const createStoreData = await createStoreResponse.json();


    if (!createStoreResponse.ok) {
        throw new Error("Failed to create store.");
    } else{ // If store created successfully, redirect to the new store page
        const formattedStoreName = storeName.toLowerCase().replace(/\s+/g, '');
        window.location.href = `/stores/${formattedStoreName}`;
    }
    
   
  };

  return (
    <div>
        <button className="create-store-button" onClick={() => setShowPopup(true)}>Create Storefront</button>
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