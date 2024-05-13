import React, { useState, useEffect } from "react";
import Panel from "./components/Panel";
import { backend } from "./components/Constants";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function UserProfile() {
  let urlString, url, profileID;

  // user profile is the user's profile you're viewing
  let [userProfile, setUserProfile] = useState(null);

  // user is you
  let [user, setUser] = useState(null);
  let [store, setStore] = useState(null);

  let [following, setFollowing] = useState(null);
  let [followers, setFollowers] = useState(null);

  let [theStoreName, setTheStoreName] = useState("");
  let [theStoreDescription, setTheStoreDescription] = useState("");

  const unfollow = () => {
    console.log("unfollow " + 1);
  };

  useEffect(() => {
    urlString = window.location.href;
    url = new URL(urlString);
    profileID = url.searchParams.get("userID");

    let userJson = sessionStorage.getItem("user");
    let user = userJson ? JSON.parse(userJson) : null;

    setUser(user);
    //getOwner;
  }, []);

  //  const getUserProfileData;

  let userID: number;
  try {
    userID = user.aID;
  } catch (e) {
    userID = "";
  }

  let storeID, storeName;
  try {
    storeID = store.aID;
    storeName = store.vchName;
  } catch (e) {
    storeID = "";
    storeName = "";
  }

  return (
    <Panel title="hello">
      <div>
        Followers <i class="bi bi-radar"></i> Following
      </div>
      <button>Follow</button>
      <br />

      <div className="box">
        <div className="heading">Bio</div>
        {/*
        bio && bio.length > 0 ? (
          <div>
            <div className="indent bottom-margin">{bio}</div>
          </div>
        ) : (
          <>
            <div className="indent bottom-margin"></div>
            <br />
          </>
        )*/}
      </div>

      {/*bio && bio.length > 0 ? (
        <>
          <div className="box">
            <div className="heading">Store</div>
          </div>
        </>
      ) : (
        <></>
      )*/}

      {/*bio && bio.length > 0 ? (
        <>
          <div className="box">
            <div className="heading">Music</div>
          </div>
        </>
      ) : (
        <></>
      )*/}

      {/*bio && bio.length > 0 ? (
        <>
          <div className="box">
            <div className="heading">Playlists</div>
          </div>
        </>
      ) : (
        <></>
      )*/}
    </Panel>
  );
}
