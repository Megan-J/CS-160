import React, { useState, useEffect } from "react";
import Panel from "./components/Panel";

function stores() {
  const [message, setMessage] = useState("Loading");

  return (
    <Panel title="Stores">
      <p>Explore all the stores created by our very own users!</p>
      <p>{message}</p>
    </Panel>
  );
}

export default stores;

// {filteredStores.map(store => (
//   <div key={store.id} className="mt-4 border border-gray-200 p-4 rounded">
//     <h2 className="text-lg font-semibold">{store.name}</h2>
//     {/* Add link to store page */}
//     <a href={`/stores/${store.name}`} className="text-blue-500">Visit Store</a>
//   </div>
// ))}
