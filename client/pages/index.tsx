/*MAIN PAGE*/
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Panel from "./components/Panel";
import Link from "next/link";
import { backend } from "./components/Constants";

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

  const uploadFile = async (e) => {
    /*console.log("UPLOADING FILE");
    const file = e.target.files[0];
    if (file != null) {
      const data = new FormData();
      data.append("file_from_react", file);

      let response = await fetch(`${backend}/url_route`, {
        method: "POST",
        body: data,
      });

      let res = await response.json();
      if (res.status !== 1) {
        alert("Error uploading file");
      } else {
        router.push("/");
      }
    }*/

    const file = e.target.files[0];
    if (file != null) {
      fetch(`https://api.escuelajs.co/api/v1/files/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: {
          file: e,
        },
      });
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

  return (
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
        <div className="box">
          <div className="heading">Discover new songs</div>
        </div>
        <div className="box">
          <div className="heading">Trending products</div>
        </div>
      </div>
      <br />
      <div>
        {user ? (
          <div>
            <div className="box">
              <div className="heading">My Playlists</div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </Panel>
  );
}
