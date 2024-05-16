import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Panel from "./components/Panel";
import { backend } from "./components/Constants";
import "bootstrap-icons/font/bootstrap-icons.css";
import Footer from "./components/Footer";

export default function MyProfile() {
  const router = useRouter();
  let [user, setUser] = useState(null);
  let [store, setStore] = useState(null);
  let [tracks, setTracks] = useState(null);

  let [products, setProducts] = useState(null);
  let [following, setFollowing] = useState(null);
  let [followers, setFollowers] = useState(null);

  let [bans, setBans] = useState(null);

  let [addingBan, setAddingBan] = useState(null);

  let [theStoreName, setTheStoreName] = useState("");
  let [theStoreDescription, setTheStoreDescription] = useState("");

  let [editStoreName, setEditStoreName] = useState("");
  let [editStoreDescription, setEditStoreDescription] = useState("");

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
      if (store) {
        editStoreName = theStoreName = store.vchName;
        editStoreDescription = theStoreDescription = store.txtDescription;
      }

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

  let firstName, lastName, bio, userID: number;
  try {
    userID = user.aID;
    firstName = user.vchFirstName;
    lastName = user.vchLastName;
    bio = user.txtBio;
    console.log(user);
  } catch (e) {
    userID = "";
    firstName = "";
    lastName = "";
    bio = "";
  }
  let storeID, storeName, storeDescription, initStoreName, initStoreDescription;
  try {
    storeID = store.aID;
    editStoreName = theStoreName = storeName = initStoreName = store.vchName;
    editStoreDescription =
      theStoreDescription =
      storeDescription =
      initStoreDescription =
        store.txtDescription;
  } catch (e) {
    storeID = "";
    editStoreName = storeName = initStoreName = "";
    editStoreDescription = storeDescription = initStoreDescription = "";
  }

  return (
    <>
      <Panel title="My Radar">
        <p>Welcome{firstName && `, ${firstName} ${lastName}`}!</p>

        <div className="box">
          <div className="heading">
            Bio <i class="bi bi-pencil-square"></i>
          </div>
          {bio && bio.length > 0 ? (
            <div>
              <div className="indent bottom-margin">{bio}</div>
            </div>
          ) : (
            <>
              <div className="indent bottom-margin"></div>
              <div>Add a bio!</div>
            </>
          )}
        </div>

        <div className="box">
          <div className="heading">Following</div>
          {following && following.length > 0 ? (
            following.map((t, i) => (
              <div className="following" key={i}>
                <div className="following-name">{`${t.vchFirstName} ${t.vchLastName} (${t.vchUsername})`}</div>
                <button className="button button-small" onClick={unfollow}>
                  Unfollow
                </button>
              </div>
            ))
          ) : (
            <>
              <div className="indent bottom-margin">
                You are not following anyone.
              </div>
            </>
          )}
        </div>

        <div className="box">
          <div className="heading">Followers</div>
          {followers && followers.length > 0 ? (
            followers.map((t, i) => (
              <div className="follower" key={i}>
                <div className="follower-name">{t.vchTrackName}</div>
                <div className="track-description">{t.txtDescription}</div>
                <div className="track-url">{t.vchAudioUrl}</div>
                <button className="button button-small" onClick={unfollow}>
                  Unfollow
                </button>
              </div>
            ))
          ) : (
            <>
              <div className="indent bottom-margin">No followers</div>
            </>
          )}
        </div>

        <div className="box">
          <div className="heading"> Ban Requests</div>
          {bans && bans.length > 0 ? (
            <div className="all-products flex">
              {bans.map((t, i) => (
                <div className="product" key={i}>
                  <div className="product-name">
                    Requested by: {t.nRequesterUserID}
                  </div>
                  <div className="requested-user">
                    User to be banned: {t.nRequestedUserID}
                  </div>
                  <div className="reason">Reason: {t.vchReason}</div>
                  <div className="request-date">
                    Request Date: {formatRequestDate(t.dtRequested)}
                  </div>
                  <div className="resolved">Resolved Status: {t.bResolved}</div>
                  <button
                    className="delete-product-button button button-small"
                    onClick={(event) => deleteBan(event, t.aID)}
                    key={t.aID}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="indent bottom-margin">No open ban requests.</div>
            </>
          )}

          {addingBan ? (
            <>
              <div className="div-center">
                <div className="product-box box container new-product-container no-shadow">
                  <div className="heading subheading gray">
                    Create Ban Request
                  </div>
                  <form onSubmit={handleSubmitBan}>
                    <div className="new-product-pane">
                      <div>
                        <input
                          className="new-product-name input"
                          type="text"
                          name="newRequestedID"
                          value={newRequestedID}
                          onChange={(e) => setNewRequestedID(e.target.value)}
                          placeholder="Username/UserID"
                        />
                        <textarea
                          className="new-product-description input"
                          name="newBanReason"
                          value={newBanReason}
                          onChange={(e) => setNewBanReason(e.target.value)}
                          placeholder="Reason"
                        />
                      </div>
                      <div className="product-submit-margin-top">
                        <button className="button button-small" type="submit">
                          Submit
                        </button>
                        <button
                          className="button button-small cancel"
                          onClick={cancelAddBan}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="center">
                <button
                  className="indent bottom-margin top-indent button button-small"
                  onClick={handleAddBan}
                >
                  Create Ban
                </button>
              </div>
            </>
          )}
          <br />
          <br />
          <br />
        </div>
      </Panel>
      <Footer></Footer>
    </>
  );
}
