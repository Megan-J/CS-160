import React, { useState, useEffect } from "react";

interface Track {
  track_id: number;
  title: string;
  hearted: boolean;
  vchTrackPath: string;
}

function Listen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/tracks');
        const data = await response.json();
        setTracks(data.tracks);
      } catch (error) {
        console.error('Failed to fetch tracks:', error);
      }
    };
    fetchTracks();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/track?query=${encodeURIComponent(searchQuery)}');
      const data = await response.json();
      setTracks(data.results);
    } catch (error) {
      console.error('Error searching for tracks:', error);
    }
  };

  const toggleHeart = async (trackId: number) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/heart/${trackId}', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //
        body: JSON.stringify({user_id: 123}) //replace 123 with userId
        //
      });
      if (response.ok) {
        const data = await response.json();
        setTracks(prevTracks => prevTracks.map(track => 
          track.track_id === trackId ? {...track, hearted: data.hearted } : track
        ));
      } else {
        console.error('Failed to toggle heart status');
      }
    } catch (error) {
      console.error('Error toggling heart:', error);
    }
  };

  const handleShare = async (trackId: number) => {
    const url = 'http://127.0.0.1:5000/track/${trackId}';
    if(navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this song!',
          url: url,
        });
        console.log("Shared successfully!");
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      }, (err) => {
        console.error('Could not copy text: ', err);
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <nav className="main">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="stores">Stores</a>
            </li>
            <li>
              <a href="listen">Listen</a>
            </li>
            <li>
              <a href="upload">Upload Music</a>
            </li>
            <li>
              <a href="login">Login</a>
            </li>
            <li>
              <a href="signup">Sign Up</a>
            </li>
            <li>
              <a href="/checkout">Checkout</a>
            </li>
          </ul>
        </nav>
        <h1 className="text-2x1 font-semibold mb-4">Listen</h1>
        <p>Listen to music!</p>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search for music..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-lg px-4 py-2 mt-4 mb-2 block w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Search
          </button>
        </form>
        <div>
          {tracks.map((track) => (
            <div key={track.track_id}>
              <p>{track.title}</p>
              <button onClick={() => toggleHeart(track.track_id)}>{track.hearted ? '♥' : '♡'}</button>
              <button onClick={() => handleShare(track.track_id)}>Share</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Listen;
