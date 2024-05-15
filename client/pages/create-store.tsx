import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Panel from "./components/Panel";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

export default function Create_Store() {
  const [userID, setUserID] = useState(null);
  const [username, setUsername] = useState(null);
  const [storeName, setStoreName] = useState(null);
  const [storeDescription, setStoreDescription] = useState(null);

  const [formState, setFormState] = useState({
    storeName: "",
    storeDescription: "",
  });
  const router = useRouter();

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    const userID = sessionStorage.getItem("userID");
    if (username !== null) {
      setUsername(username);
      setUserID(userID);
    }
  }, []);

  const handleChange = (event) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formState);

    let success = false;
    formState["userID"] = userID;
    fetch("http://127.0.0.1:5000/make-store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formState),
    })
      .then((res) => {
        if (res.status === 200) {
          success = true;
        }
        console.log(res);
        return res.json();
      })
      .then((data) => {
        console.log("returned:");
        console.log(data);
        if (success) {
          // save the user to session storage
          sessionStorage.setItem("storeName", data.storeName);
          sessionStorage.setItem("storeDescription", data.storeDescription);
          // get aID from the response and save to session storage
          sessionStorage.setItem("storeID", data.aID);
          // push to user page
          router.push("/user");
        }
        return data;
      });
  };

  return (
    <Panel>
      <NavBar />
      <br />
      <h1 className="text-2xl font-semibold mb-4">Create Store</h1>
      <p>Welcome, {username}!</p>
      <br />
      <form onSubmit={handleSubmit}>
        <p>
          <label>Store Name</label>
          <input type="text" name="storeName" onChange={handleChange} />
          <br />
          <label>Description</label>
          <input type="text" name="storeDescription" onChange={handleChange} />
        </p>

        <br />
        <button className="submit">Create Store</button>
      </form>
    </Panel>
  );
}
