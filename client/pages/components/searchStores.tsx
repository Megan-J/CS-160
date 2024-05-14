import React, { useState, useEffect } from "react";
import { backend } from "./Constants";
import { Routes, Route } from "react-router-dom"; // Import BrowserRouter
import Link from "next/link";
import { useRouter } from "next/router"; // Import useRouter
import storefront1 from "../../../data/storeFronts/1.png";
import storefront2 from "../../../data/storeFronts/2.png";
import storefront3 from "../../../data/storeFronts/3.png";
import storefront4 from "../../../data/storeFronts/4.png";
import storefront5 from "../../../data/storeFronts/5.png";
import storefront6 from "../../../data/storeFronts/6.png";

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
      <div className="all-products flex">
        {userList.map((store) => (
          <div className="body_item">
            <div className="center">
              <h1 className="bi bi-shop"></h1>
            </div>
            <br />
            <Link href="/storefront" as={`/storefront?storeID=${store.id}`}>
              <img src={storefront1.src} />
              <br />
              <p className="heading-center">{store.name}</p>
              <p className="indent">Owned by: {store.user}</p>
              <p className="indent">{store.txtDescription}</p>
            </Link>
            <div>Top Hit</div>
            <div>Newest Album</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchStores;
