import React, { useState, useEffect } from "react";
import { backend } from "./components/Constants";
import { Routes, Route } from "react-router-dom"; // Import BrowserRouter
import Link from "next/link";
import { useRouter } from "next/router"; // Import useRouter
import PlayButton from "./components/PlayButton";
import storefront1 from "../public/data/storeFronts/1.png";
import storefront2 from "../public/data/storeFronts/2.png";
import storefront3 from "../public/data/storeFronts/3.png";
import storefront4 from "../public/data/storeFronts/4.png";
import storefront5 from "../public/data/storeFronts/5.png";
import storefront6 from "../public/data/storeFronts/6.png";

interface Store {
  id: number;
  name: string;
  user: string;
  txtDescription: string;
  user_id: number;
  user_name: string;
}

interface Props {
  setAudioSrc: (audioSrc: string) => void; // Define setAudioSrc as a function that takes a string argument and returns void
  setSongName: (songName: string) => void;
}

const SearchStores: React.FC<Props> = ({ setAudioSrc, setSongName }) => {
  const [text, setText] = React.useState("");

  let [error, setError] = useState("");
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

  const handlePlayButton = (storeID) => {
    const newAudioSrc = `./data/storeFronts/${storeID}.mp3`;
    setAudioSrc(newAudioSrc);
  };

  const handleSongChange = (newSongName) => {
    setSongName(newSongName);
  };

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
            <Link href="/storefront" as={`/storefront?storeID=${store.id}`}>
              <img src={storefronts[store.id].src} />
              <p></p>
              <p className="heading-center">
                <div style={{ padding: "5px" }}>
                  <i className="bi bi-shop-window"></i>
                </div>
                <div style={{ paddingBottom: "10px" }}>{store.name}</div>
              </p>
            </Link>
            <Link
              href="/user-profile"
              as={`/user-profile?userID=${store.user_id}`}
            >
              <p
                style={{
                  marginLeft: "20px",
                  padding: "10px",
                  fontWeight: "bold",
                }}
              >
                <i className="bi bi-person-fill"></i>
                {store.user_name}
              </p>
            </Link>

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
              <button
                className="bi bi-play-circle-fill button-hover-grow"
                onClick={() => {
                  handlePlayButton(store.id);
                  handleSongChange(`${store.user_name}'s top hit`);
                }}
              ></button>
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
              <button
                className="bi bi-play-circle-fill button-hover-grow"
                onClick={() => {
                  handlePlayButton(store.id + 0.1);
                  handleSongChange(`${store.user_name}'s newest song`);
                }}
              ></button>
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
