import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Panel from './components/Panel';
import { backend } from './components/Constants';

// This is the verify page. It is used to verify the user's email address.
// The page is accessed by clicking on the link sent to the user's email address.
// The URL contains a token that must be passed to the backend to verify the user's email address.

export default function verify() {
  const router = useRouter();
  const [message, setMessage] = useState("Verifying email address...");

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search)
    const token = queryParameters.get("token")
    console.log(queryParameters);
    console.log(`in block with ${token}`)
    if (token) {
      fetch(`${backend}/verify/${token}`)
        .then((response) => response.json())
        .then((data) => {
            console.log("Got token ", data);
            router.push("/login");
        });
    }
  }, []);

  return (
    <Panel title="Verify Email Address">
      <div>
        <p>{message}</p>
      </div>
    </Panel>
  );
}
