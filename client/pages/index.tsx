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
  let user = null;
  const [text, setText] = React.useState("");

  const [userList, setUserList] = useState<Track[]>([]);

  useEffect(() => {
    fetchStores();
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

  return (
    <Panel title="Welcome!">
      <div>
        <p>Start Listening today!</p>
      </div>

      <div>
        <div className="input_wrapper">
          <input
            type="text"
            placeholder="Search Music: In Progress"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button disabled={!text}>Search</button>
        </div>
        <div className="all-products flex"></div>
      </div>
      <br />
      <div>
        <Link href="/report" className="button">
          Report an Issue
        </Link>
      </div>
    </Panel>
  );
}
