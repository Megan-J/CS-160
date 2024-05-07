import React, { useState, useEffect } from "react";
import { backend } from './Constants';
import HardRockCafe from "../stores/hardrockcafe";
//import { BrowserRouter as Router, Link } from 'react-router-dom'; // Import BrowserRouter
import Link from 'next/link';
import { useRouter } from 'next/router'; // Import useRouter


interface Store {
  id: number;
  name: string;
  user: string;
  txtDescription: string;
}

const SearchStores: React.FC = () => {
  const [text, setText] = React.useState("");

  const [userList, setUserList] = useState<Store[]>([]);

  useEffect(() => {
    fetchStores();
}, []);

const fetchStores = () => {
    // Fetch stores from the backend
    fetch(`${backend}/store/all`)
        .then(res => res.json())
        .then(data => {
            setUserList(data);
            console.log(data);
        })
        .catch(error => console.error('Error fetching stores:', error));
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
      <div className="all-products flex">
        {userList.map((product) => (
          <div className="body_item">
            {/* <a href={`/stores/<HardRockCafe storeID=${product.id}/>`}>
              <p>{product.name}</p>
            </a>  */}
            {/* <Link to="/stores/my-little-store" state={{ storeID: product.id }}>
            <p>{product.name}</p>
            </Link> */}
            <Link href="/stores/my-little-store" as={`/stores/my-little-store?storeID=${product.id}`}>
            <p>{product.name}</p>
            </Link>
            <p>Owned by: {product.user}</p>
            <p>{product.txtDescription}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchStores;

/*
import React from "react";

const searchStores: React.FC = () => {
  const users = [
    {
      name: "Body Shop",
      user: "alicesmith",
      image: "@/public/store_img/user1",
      description: "Buy Rad Pop products!",
    },
    {
      name: "Hard Rock Cafe",
      user: "johndoe",
      image: "@/public/store_img/user3",
      description: "Rock Your World, Dine with Soul",
    },
    {
      name: "Bobity",
      user: "johndoe",
      image: "@/public/store_img/user3",
      description: "Rock Your World, Dine with Soul",
    },
    {
      name: "Vintage Record",
      user: "bobjohnson",
      image: "user2",
      description: "Get my custom vinyl records: SALE",
    },
  ];
  */