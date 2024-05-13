import React, { useState, useEffect } from "react";
import Panel from "./components/Panel";
import { backend } from "./components/Constants";
import "bootstrap-icons/font/bootstrap-icons.css";
import Link from "next/link";

export default function UserProfile() {
  let urlString, url, profileID;

  // user profile is the user's profile you're viewing
  let [userProfileName, setUserProfileName] = useState(null);
  let [userProfileBio, setUserProfileBio] = useState(null);
  let [userProfileStoreId, setUserProfileStoreId] = useState(null);
  let [userProfileStoreName, setUserProfileStoreName] = useState(null);
  let [userProfileStoreDes, setUserProfileStoreDes] = useState(null);
  let [userProfileTracks, setUserProfileTracks] = useState(null);

  // user is you
  let [user, setUser] = useState(null);
  let [store, setStore] = useState(null);
  let [error, setError] = useState("");

  let [following, setFollowing] = useState(null);
  let [followers, setFollowers] = useState(null);

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
    getUserProfileData();
  }, []);

  const getUserProfileData = () => {
    let success = false;
    fetch(`${backend}/user/data/${profileID}`, {
      method: "GET",
    })
      .then((res) => {
        if (res.status === 200) {
          success = true;
        } else {
          setError("Issue getting profile data");
        }
        return res.json();
      })
      .then((data) => {
        if (success) {
          console.log(data);
          setFollowers(data.followerCount);
          setFollowing(data.followingCount);
          setUserProfileName(data.username);
          setUserProfileBio(data.bio);
          setUserProfileStoreName(data.storeName);
          setUserProfileStoreDes(data.storeDescription);
          setUserProfileStoreId(data.storeID);
          setUserProfileTracks(data.tracksData);
        }
      });
  };

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
    <Panel title={userProfileName}>
      <div>
        {followers} Followers <i class="bi bi-soundwave" /> {following}{" "}
        Following
      </div>
      <br />
      <button className="button">
        Follow
        <i class="bi bi-person-plus-fill"></i>
      </button>
      <br />
      <br />
      <div className="box">
        <div className="heading">Bio</div>
        {userProfileBio && userProfileBio.length > 0 ? (
          <div>
            <div className="indent bottom-margin">{userProfileBio}</div>
          </div>
        ) : (
          <>
            <div className="indent bottom-margin"></div>
            <br />
          </>
        )}
      </div>

      {userProfileStoreName && userProfileStoreName.length > 0 ? (
        <>
          <div className="box">
            <div className="heading">Store</div>
            <Link
              href={`/storefront?storeID=${userProfileStoreId}`}
              className="store-in-profile"
            >
              <div className="center">{userProfileStoreName}</div>
              <div className="center">{userProfileStoreDes}</div>
            </Link>
          </div>
        </>
      ) : (
        <></>
      )}

      {userProfileTracks && userProfileTracks.length > 0 ? (
        <>
          <div className="box">
            <div className="heading">Music</div>
            <div>
              {userProfileTracks.map((t, i) => (
                <div>
                  <div className="indent">{t.trackTitle}</div>
                  <br />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

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
