import React, { useState, useEffect } from "react";
import Panel from "./components/Panel";
import SearchStores from "./searchStores";
import Footer from "./components/Footer";

function stores() {
  const [message, setMessage] = useState("Loading");

  return (
    <>
      <Panel title="Stores">
        <p>Explore all the stores created by our very own users!</p>
        <div>
          <SearchStores />
        </div>
      </Panel>
      <br />
      <Footer></Footer>
    </>
  );
}

export default stores;
