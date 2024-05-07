import React, { useState, useEffect } from "react";
import Panel from "./components/Panel";
import SearchStores from "./components/searchStores";

function stores() {
  const [message, setMessage] = useState("Loading");

  return (
    <Panel title="Stores">
      <p>Explore all the stores created by our very own users!</p>
      <div>
        <SearchStores />
      </div>
    </Panel>
  );
}

export default stores;
