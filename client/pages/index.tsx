/*MAIN PAGE*/
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Panel from "./components/Panel";
import Footer from "./components/Footer";
import PlayButton from "./components/PlayButton";
import Link from "next/link";
import { backend } from "./components/Constants";
import song1 from "../public/data/newSongs/ai-generated-7926621_640.jpg";
import song2 from "../public/data/newSongs/ai-generated-8716960_640.jpg";
import song3 from "../public/data/newSongs/universe-8418706_640.jpg";
import song4 from "../public/data/newSongs/walkTogether.jpg";
import song5 from "../public/data/newSongs/LoFi Chill.png";
import product1 from "../public/data/trendingProducts/duck.jpg";
import product2 from "../public/data/trendingProducts/sweater.jpg";
import product3 from "../public/data/trendingProducts/ring.jpg";
import product4 from "../public/data/trendingProducts/art.jpg";
import product5 from "../public/data/trendingProducts/teddyBear.jpg";
import listen1 from "../public/data/recentlyListened/riseAndShine.jpg";
import listen2 from "../public/data/recentlyListened/i will be here.png";
import listen3 from "../public/data/recentlyListened/OneStepFurther.png";
import path from "../public/data/storeMusic/flashback-184686.mp3";

interface Track {
  id: number;
  author: string;
  title: string;
  decription: string;
  audio: string;
  genre: number;
}

export default function index() {
  const router = useRouter();
  const [text, setText] = React.useState("");
  let [user, setUser] = useState(null);
  const [audioSrc, setAudioSrc] = useState(
    "../public/data/storeMusic/titanium.mp3"
  );

  const [userList, setUserList] = useState<Track[]>([]);

  useEffect(() => {
    let userJson = sessionStorage.getItem("user");
    let productsJson = sessionStorage.getItem("products");

    let user = userJson ? JSON.parse(userJson) : null;
    let products = productsJson ? JSON.parse(productsJson) : null;

    setUser(user);

    if (user && user.vchUsername !== null) {
      let initials = "";
      if (user.vchUsername != null) {
        initials = user.vchFirstName.charAt(0) + user.vchLastName.charAt(0);
        initials = initials.toUpperCase();
      }
    }
  }, []);

  const fetchStores = () => {
    // Fetch stores from the backend
    fetch(`${backend}/tracks/all`)
      .then((res) => res.json())
      .then((data) => {
        setUserList(data);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching stores:", error));
  };

  useEffect(() => {
    const userJSON = sessionStorage.getItem("user");
    let user = userJSON ? JSON.parse(userJSON) : null;

    if (user && user.vchUsername !== null) {
      router.push("/");
    }
  }, []);

  interface Track {
    track_id: number;
    title: string;
    hearted: boolean;
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/tracks`);
        const data = await response.json();
        setTracks(data.tracks);
      } catch (error) {
        console.error("Failed to fetch tracks:", error);
      }
    };
    fetchTracks();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/track?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setTracks(data.results);
    } catch (error) {
      console.error("Error searching for tracks:", error);
    }
  };

  const toggleHeart = async (trackId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/heart/${trackId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        //
        body: JSON.stringify({ user_id: 123 }), //replace 123 with userId
        //
      });
      if (response.ok) {
        const data = await response.json();
        setTracks((prevTracks) =>
          prevTracks.map((track) =>
            track.id === trackId ? { ...track, hearted: data.hearted } : track
          )
        );
      } else {
        console.error("Failed to toggle heart status");
      }
    } catch (error) {
      console.error("Error toggling heart:", error);
    }
  };

  const handleShare = async (trackId: number) => {
    const url = `http://127.0.0.1:5000/track/${trackId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this song!",
          url: url,
        });
        console.log("Shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(url).then(
        () => {
          alert("Link copied to clipboard!");
        },
        (err) => {
          console.error("Could not copy text: ", err);
        }
      );
    }
  };

  const handleOnClick = async () => {
    // Fetch all tracks
    const response = await fetch(`${backend}/tracks/all`);
    if (!response.ok) {
      throw new Error("Failed to fetch tracks.");
    }
    const storesData = await response.json();

    if (!text.trim()) {
      //if there is no text entered into search
      setUserList(storesData);
      return;
    }

    const filteredStores = userList.filter(
      (s) => s?.title.toLowerCase() === text.toLowerCase()
    );
    setUserList(filteredStores);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleOnClick();
    }
  };

  const handlePlayButton = (newAudioSrc) => {
    setAudioSrc(newAudioSrc);
  };

  return (
    <>
      <Panel title="Welcome!">
        <div>
          {user ? (
            <div>Dive back in</div>
          ) : (
            <div>
              <br />
              <div className="box">
                <br />
                <p className="center" style={{ padding: "10px" }}>
                  You haven't heard of Radar? Well get on ours!
                </p>
                <p className="center" style={{ padding: "10px" }}>
                  Listen to your favorite songs from up and coming artists! Shop
                  around and see what they're selling while listening to their
                  songs!
                </p>
                <br />
              </div>
            </div>
          )}
        </div>

        <br />

        <div>
          {user ? (
            <div>
              <div className="box">
                <div className="heading">Recently Listened To</div>
                <div className="all-images">
                  <div className="img-hover-shadow">
                    <div className="center">
                      <img
                        src={listen1.src}
                        style={{
                          padding: "15px",
                          boxSizing: "border-box",
                          borderRadius: "20px",
                        }}
                        alt="Song 1 Image"
                      />
                      <p className="song-names">Rise & Shine</p>
                      <button
                        className="bi bi-play-circle-fill button-hover-grow"
                        onClick={() =>
                          handlePlayButton(
                            "./data/recentlyListened/rise-and-shine-203779.mp3"
                          )
                        }
                      ></button>
                    </div>
                  </div>
                  <div className="img-hover-shadow">
                    <div className="center">
                      <img
                        src={listen2.src}
                        style={{
                          padding: "15px",
                          boxSizing: "border-box",
                          borderRadius: "20px",
                        }}
                        alt="Song 2 Image"
                      />
                      <p className="song-names">I'll be Here</p>
                      <button
                        className="bi bi-play-circle-fill button-hover-grow"
                        onClick={() =>
                          handlePlayButton(
                            "./data/recentlyListened/i-will-be-here-vocal-edm-140857.mp3"
                          )
                        }
                      ></button>
                    </div>
                  </div>
                  <div className="img-hover-shadow">
                    <div className="center">
                      <img
                        src={listen3.src}
                        style={{
                          padding: "15px",
                          boxSizing: "border-box",
                          borderRadius: "20px",
                        }}
                        alt="Song 3 Image"
                      />
                      <p className="song-names">One Step Further</p>
                      <button
                        className="bi bi-play-circle-fill button-hover-grow"
                        onClick={() =>
                          handlePlayButton(
                            "./data/recentlyListened/one-step-further-141064.mp3"
                          )
                        }
                      ></button>
                    </div>
                  </div>
                </div>
                <br />
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
        <br />
        <div>
          <div className="box">
            <div className="heading">Discover new songs</div>
            <div className="all-images">
              <div className="img-hover-shadow">
                <div className="center">
                  <img
                    src={song1.src}
                    style={{
                      padding: "15px",
                      boxSizing: "border-box",
                      borderRadius: "20px",
                    }}
                    alt="Song 1 Image"
                  />
                  <p className="song-names">Call to the Soul</p>
                  <button
                    className="bi bi-play-circle-fill button-hover-grow"
                    onClick={() =>
                      handlePlayButton("./data/newSongs/a-call-to-the-soul.mp3")
                    }
                  ></button>
                </div>
              </div>
              <div className="img-hover-shadow">
                <div className="center">
                  <img
                    src={song2.src}
                    style={{
                      padding: "15px",
                      boxSizing: "border-box",
                      borderRadius: "20px",
                    }}
                    alt="Song 2 Image"
                  />
                  <p className="song-names">Powerful Rock</p>
                  <button
                    className="bi bi-play-circle-fill button-hover-grow"
                    onClick={() =>
                      handlePlayButton(
                        "./data/newSongs/powerful-gym-rock-121485.mp3"
                      )
                    }
                  ></button>
                </div>
              </div>
              <div className="img-hover-shadow">
                <div className="center">
                  <img
                    src={song3.src}
                    style={{
                      padding: "15px",
                      boxSizing: "border-box",
                      borderRadius: "20px",
                    }}
                    alt="Song 3 Image"
                  />
                  <p className="song-names">Funk Kingdom</p>
                  <button
                    className="bi bi-play-circle-fill button-hover-grow"
                    onClick={() =>
                      handlePlayButton(
                        "./data/newSongs/funk-in-kingdom-200507.mp3"
                      )
                    }
                  ></button>
                </div>
              </div>
              <div className="img-hover-shadow">
                <div className="center">
                  <img
                    src={song4.src}
                    style={{
                      padding: "15px",
                      boxSizing: "border-box",
                      borderRadius: "20px",
                    }}
                    alt="Song 4 Image"
                  />
                  <p className="song-names">Walk Together</p>
                  <button
                    className="bi bi-play-circle-fill button-hover-grow"
                    onClick={() =>
                      handlePlayButton(
                        "./data/newSongs/walk-together-123281.mp3"
                      )
                    }
                  ></button>
                </div>
              </div>
              <div className="img-hover-shadow">
                <div className="center">
                  <img
                    src={song5.src}
                    style={{
                      padding: "15px",
                      boxSizing: "border-box",
                      borderRadius: "20px",
                    }}
                    alt="Song 3 Image"
                  />
                  <p className="song-names">LoFi Chill</p>
                  <button
                    className="bi bi-play-circle-fill button-hover-grow"
                    onClick={() =>
                      handlePlayButton(
                        "./data/newSongs/lofi-chill-medium-version-159456.mp3"
                      )
                    }
                  ></button>
                </div>
              </div>
            </div>
            <br />
          </div>
          <br />
          <div className="box">
            <div className="heading">Trending products</div>
            <div className="all-images">
              <div className="img-hover-shadow">
                <div className="center">
                  <img
                    src={product1.src}
                    style={{
                      padding: "15px",
                      boxSizing: "border-box",
                      borderRadius: "20px",
                    }}
                    alt="Song 1 Image"
                  />
                  <p className="song-names">Crochet Duck</p>
                  <button className="bi bi-cart-plus button-hover-grow"></button>
                </div>
              </div>
              <div className="img-hover-shadow">
                <div className="center">
                  <img
                    src={product2.src}
                    style={{
                      padding: "15px",
                      boxSizing: "border-box",
                      borderRadius: "20px",
                    }}
                    alt="Song 2 Image"
                  />
                  <p className="song-names">Sweater</p>
                  <button className="bi bi-cart-plus button-hover-grow"></button>
                </div>
              </div>
              <div className="img-hover-shadow">
                <div className="center">
                  <img
                    src={product3.src}
                    style={{
                      padding: "15px",
                      boxSizing: "border-box",
                      borderRadius: "20px",
                    }}
                    alt="Song 1 Image"
                  />
                  <p className="song-names">Ring</p>
                  <button className="bi bi-cart-plus button-hover-grow"></button>
                </div>
              </div>
              <div className="img-hover-shadow">
                <div className="center">
                  <img
                    src={product4.src}
                    style={{
                      padding: "15px",
                      boxSizing: "border-box",
                      borderRadius: "20px",
                    }}
                    alt="Song 2 Image"
                  />
                  <p className="song-names">Art Print</p>
                  <button className="bi bi-cart-plus button-hover-grow"></button>
                </div>
              </div>
              <div className="img-hover-shadow">
                <div className="center">
                  <img
                    src={product5.src}
                    style={{
                      padding: "15px",
                      boxSizing: "border-box",
                      borderRadius: "20px",
                    }}
                    alt="Song 2 Image"
                  />
                  <p className="song-names">Teddy Bear</p>
                  <button className="bi bi-cart-plus button-hover-grow"></button>
                </div>
              </div>
            </div>
            <br />
          </div>
        </div>
        <p>Current Audio Source: {audioSrc}</p>
      </Panel>
      <br />
      <br />
      <br />
      <br />
      <Footer audioSrc={audioSrc}></Footer>
    </>
  );
}
