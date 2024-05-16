import React from "react";

const Footer = ({ audioSrc }) => (
  <footer className="footer">
    <p
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: "20px",
        fontSize: "18px",
        fontWeight: "bold",
      }}
    >
      Now Playing
    </p>
    <div className="center" style={{ maxWidth: "80%", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
          paddingBottom: "25px",
        }}
      >
        <audio
          controls
          autoPlay
          src={audioSrc}
          className="w-1/2 focus:outline-none transition-transform duration-300"
        />
      </div>
    </div>
  </footer>
);

export default Footer;
