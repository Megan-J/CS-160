import React from "react";

const PlayButton = ({ songName }) => {
  const handleClick = () => {
    // Logic to handle play action
    console.log(songName);
  };

  return (
    <div>
      <button
        className="bi bi-play-circle-fill button-hover-grow"
        onClick={handleClick}
      ></button>
    </div>
  );
};

export default PlayButton;
