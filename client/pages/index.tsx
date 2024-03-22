/*MAIN PAGE*/
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Panel from "./components/Panel";

export default function index() {
  const router = useRouter();
  let user = null;

  useEffect(() => {
    user = sessionStorage.getItem("user");
    user = user ? JSON.parse(user) : null;

    if (user && user.vchUsername !== null) {
      router.push("/user");
    }
  }, []);

  return (
    <Panel title="Welcome!">
      <p>Start Listening today!</p>
    </Panel>
  );
}
