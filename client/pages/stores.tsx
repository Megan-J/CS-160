import React, { useState, useEffect } from "react";
import Panel from "./components/Panel";
import SearchStores from "./searchStores";
import Footer from "./components/Footer";

function stores() {
  const [message, setMessage] = useState("Loading");
  const [audioSrc, setAudioSrc] = useState("");

  return (
    <>
      <Panel title="Stores">
        <p>Explore all the stores created by our very own users!</p>
        <div>
          <SearchStores setAudioSrc={setAudioSrc} />
        </div>
      </Panel>
      <br />
      <Footer audioSrc={audioSrc}></Footer>
    </>
  );
}

export default stores;
