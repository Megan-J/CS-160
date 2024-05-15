import React, { useState, useEffect } from "react";
import { backend } from "./Constants";
import { Routes, Route } from "react-router-dom"; // Import BrowserRouter
import Link from "next/link";
import { useRouter } from "next/router"; // Import useRouter

interface Store {
  id: number;
  name: string;
  user: string;
  txtDescription: string;
}

const SearchStores: React.FC = () => {
  const [text, setText] = React.useState("");

  let [ownerName, setOwnerName] = useState("");
  const [userList, setUserList] = useState<Store[]>([]);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = () => {
    // Fetch stores from the backend
    fetch(`${backend}/store/all`)
      .then((res) => res.json())
      .then((data) => {
        setUserList(data);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching stores:", error));
  };

  const handleOnClick = async () => {
    // Fetch all stores
    const response = await fetch(`${backend}/store/all`);
    if (!response.ok) {
      throw new Error("Failed to fetch stores.");
    }
    const storesData = await response.json();

    if (!text.trim()) {
      //if there is no text entered into search
      //setUserList(storesData);
      setUserList(storesData);
      return;
    }

    const filteredStores = userList.filter(
      (s) => s?.name.toLowerCase() === text.toLowerCase()
    );
    setUserList(filteredStores);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleOnClick();
    }
  };

  return (
    <div>
      <br />
      <div className="input_wrapper">
        <input
          type="text"
          placeholder="Search Stores"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button disabled={!text} onClick={handleOnClick}>
          Search
        </button>
      </div>
      <br />
      <div className="all-products flex">
        {userList.map((store) => (
          <div className="body_item">
            <Link href="/storefront" as={`/storefront?storeID=${store.id}`}>
              <p>{store.name}</p>
              <p>Owned by: {store.user}</p>
              <p>{store.txtDescription}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchStores;
