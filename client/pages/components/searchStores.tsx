import React, { useState, useEffect } from "react";
import { backend } from "./Constants";
import { Routes, Route } from "react-router-dom"; // Import BrowserRouter
import Link from "next/link";
import { useRouter } from "next/router"; // Import useRouter
import PlayButton from "./PlayButton";
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
  let index = 0;

  const storefronts = [
    storefront1,
    storefront2,
    storefront3,
    storefront4,
    storefront5,
    storefront6,
  ];

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

  const handlePlay = () => {
    console.log("Play button clicked");
  };

  return (
    <div>
      <br />
      <div className="all-products flex">
        {userList.map((store) => (
          <div className="body_item">
            <Link href="/storefront" as={`/storefront?storeID=${store.id}`}>
              <img src={storefronts[store.id].src} />
              <br />
              <p className="heading-center">
                <div style={{ padding: "5px" }}>
                  <h1 className="bi bi-shop"></h1>
                </div>
                {store.name}
              </p>
            </Link>
            <p
              style={{
                marginLeft: "20px",
                padding: "10px",
                fontWeight: "bold",
              }}
            >
              Owned by: {store.user}
            </p>
            <p className="center">{store.txtDescription}</p>

            <br />
            <div
              style={{
                marginLeft: "5px",
                padding: "5px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <PlayButton songName="tophit1"></PlayButton>
              <label>Top Hit</label>
            </div>
            <div
              style={{
                marginLeft: "5px",
                padding: "5px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <PlayButton songName="newestsong"></PlayButton>
              <label>Newest Song</label>
            </div>
          </div>
        ))}
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default SearchStores;
