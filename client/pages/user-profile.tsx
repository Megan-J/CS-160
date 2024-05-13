import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Panel from "./components/Panel";
import { backend } from "./components/Constants";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function UserProfile() {
  const router = useRouter();
  let [user, setUser] = useState(null);
  let [store, setStore] = useState(null);

  let [following, setFollowing] = useState(null);
  let [followers, setFollowers] = useState(null);

  let [bans, setBans] = useState(null);

  let [addingBan, setAddingBan] = useState(null);

  let [theStoreName, setTheStoreName] = useState("");
  let [theStoreDescription, setTheStoreDescription] = useState("");

  let [newBanReason, setNewBanReason] = useState("");
  let [newRequestedID, setNewRequestedID] = useState("");

  const handleAddBan = () => {
    setAddingBan(true);
  };

  const cancelAddBan = () => {
    setAddingBan(false);
  };

  const unfollow = () => {
    console.log("unfollow " + 1);
  };

  const handleSubmitBan = (e) => {
    e.preventDefault();
    let success = false;
    let data = {
      nRequesterUserID: user.aID,
      nRequestedUserID: newRequestedID,
      vchReason: newBanReason,
    };
    fetch(`${backend}/add-ban`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        console.log(res);
        if (res.status === 200 || res.status === 201) {
          success = true;
          // clear the form
          setNewRequestedID("");
          setNewBanReason("");
        }
        return res.json();
      })
      .then((data) => {
        console.log("returned:");
        console.log(data);
        if (success) {
          sessionStorage.setItem("bans", JSON.stringify(data));
          setBans(data.bans);
          console.log("bans updated");
          console.log(data);
          setAddingBan(false);
        }
        return data;
      });
  };

  useEffect(() => {
    console.log(sessionStorage);
    let userJson = sessionStorage.getItem("user");
    let storeJson = sessionStorage.getItem("store");
    let tracksJson = sessionStorage.getItem("tracks");
    let musicJson = sessionStorage.getItem("music");
    let productsJson = sessionStorage.getItem("products");
    let followingJson = sessionStorage.getItem("following");
    let followersJson = sessionStorage.getItem("followers");
    //let bansJson = sessionStorage.getItem("bans");
    //console.log(bansJson);
    //is null

    let user = userJson ? JSON.parse(userJson) : null;
    let store = storeJson ? JSON.parse(storeJson) : null;
    let tracks = tracksJson ? JSON.parse(tracksJson) : null;
    let music = musicJson ? JSON.parse(musicJson) : null;
    let products = productsJson ? JSON.parse(productsJson) : null;
    let following = followingJson ? JSON.parse(followingJson) : null;
    let followers = followersJson ? JSON.parse(followersJson) : null;
    //let bans = bansJson ? JSON.parse(bansJson) : null;

    setUser(user);
    console.log("user:");
    console.log(user);
    if (user && user.vchUsername !== null) {
      let initials = "";
      if (user.vchUsername != null) {
        initials = user.vchFirstName.charAt(0) + user.vchLastName.charAt(0);
        initials = initials.toUpperCase();
      }
      if (storeJson) setStore(store);

      if (followingJson) setFollowing(following);
      if (followersJson) setFollowers(followers);
      //if (bansJson) setBans(bans);
      fetchBanRequests(user.aID);
    }
  }, []);

  const fetchBanRequests = (user: any) => {
    // Fetch ban requests from the backend
    fetch(`${backend}/bans/${user}`)
      .then((res) => res.json())
      .then((data) => {
        setBans(data);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching ban requests:", error));
  };

  const deleteBan = (event, aID) => {
    event.preventDefault();
    let success = false;
    let data = {
      aID: aID,
      nRequesterUserID: user.aID,
    };
    fetch(`${backend}/delete-ban`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        console.log(res);
        if (res.status === 200 || res.status === 201) {
          success = true;
        }
        return res.json();
      })
      .then((data) => {
        console.log("returned:");
        console.log(data);
        if (success) {
          setBans(data.bans);
          console.log("bans updated");
          console.log(data);
        }
        return data;
      });
  };

  function formatRequestDate(dateString: string | number | Date) {
    // Create a Date object from the provided date string
    const date = new Date(dateString);

    // Get the day, month, and year
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    // Get the time
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Format the time with leading zeros if necessary
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    // Construct the human-readable date string
    const humanReadableDate = `${month} ${day}, ${year} ${formattedTime}`;

    return humanReadableDate;
  }

  let firstName, lastName, bio, userID: number, username;
  try {
    userID = user.aID;
    firstName = user.vchFirstName;
    lastName = user.vchLastName;
    bio = user.txtBio;
    username = user.vchUsername;
    console.log(user);
  } catch (e) {
    userID = "";
    firstName = "";
    lastName = "";
    bio = "";
    username = "";
  }

  let storeID, storeName, storeDescription, initStoreName, initStoreDescription;
  try {
    storeID = store.aID;
  } catch (e) {
    storeID = "";
  }

  let order_prod_id: number | null = null;
  let order_prod_name: string | null = null;

  return (
    <Panel title={username}>
      <div>
        Followers <i class="bi bi-radar"></i> Following
      </div>
      <button>Follow</button>
      <br />

      <div className="box">
        <div className="heading">Bio</div>
        {bio && bio.length > 0 ? (
          <div>
            <div className="indent bottom-margin">{bio}</div>
          </div>
        ) : (
          <>
            <div className="indent bottom-margin"></div>
            <br />
          </>
        )}
      </div>

      {bio && bio.length > 0 ? (
        <>
          <div className="box">
            <div className="heading">Store</div>
          </div>
        </>
      ) : (
        <></>
      )}

      {bio && bio.length > 0 ? (
        <>
          <div className="box">
            <div className="heading">Music</div>
          </div>
        </>
      ) : (
        <></>
      )}

      {bio && bio.length > 0 ? (
        <>
          <div className="box">
            <div className="heading">Playlists</div>
          </div>
        </>
      ) : (
        <></>
      )}
    </Panel>
  );
}
