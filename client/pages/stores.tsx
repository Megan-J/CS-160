import React, { useState, useEffect } from "react";
import Panel from "./components/Panel";
import SearchStores from "./searchStores";
import Footer from "./components/Footer";

function stores() {
  const [message, setMessage] = useState("Loading");
  const [audioSrc, setAudioSrc] = useState("");
  const [songName, setSongName] = useState("");

  return (
    <>
      <Panel title="Stores">
        <p>Explore all the stores created by our very own users!</p>
        <div>
          <SearchStores setAudioSrc={setAudioSrc} setSongName={setSongName} />
        </div>
      </Panel>
      <br />
      <Footer audioSrc={audioSrc} songName={songName}></Footer>
    </>
  );
}

export default stores;
