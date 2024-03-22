import React, { useState, useEffect } from "react";
import Panel from './components/Panel';

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
