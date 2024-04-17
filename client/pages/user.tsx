import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Panel from "./components/Panel";
import { backend } from "./components/Constants";

export default function index() {
  const router = useRouter();
  let [user, setUser] = useState(null);
  let [store, setStore] = useState(null);
  let [tracks, setTracks] = useState(null);
  let [music, setMusic] = useState(null);
  let [products, setProducts] = useState(null);
  let [following, setFollowing] = useState(null);
  let [followers, setFollowers] = useState(null);
  let [bans, setBans] = useState(null);

  let [creatingStore, setCreatingStore] = useState(null);
  let [editingStore, setEditingStore] = useState(null);
  let [addingProduct, setAddingProduct] = useState(null);
  let [addingTrack, setAddingTrack] = useState(null);
  let [addingBan, setAddingBan] = useState(null);

  let [theStoreName, setTheStoreName] = useState("");
  let [theStoreDescription, setTheStoreDescription] = useState("");
  let [createStoreName, setCreateStoreName] = useState("");
  let [createStoreDescription, setCreateStoreDescription] = useState("");
  let [editStoreName, setEditStoreName] = useState("");
  let [editStoreDescription, setEditStoreDescription] = useState("");

  let [newProductName, setNewProductName] = useState("");
  let [newProductDescription, setNewProductDescription] = useState("");
  let [newProductPrice, setNewProductPrice] = useState("");
  let [newProductShipping, setNewProductShipping] = useState("");
  let [newProductInventory, setNewProductInventory] = useState("");

  let [newTrackName, setNewTrackName] = useState("");
  let [newTrackDescription, setNewTrackDescription] = useState("");
  let [newTrackAudioURL, setNewTrackAudioURL] = useState("");
  let [newTrackImagePath, setNewTrackImagePath] = useState("");
  let [newTrackGenreID, setNewTrackGenreID] = useState("");
  let [newTrackUpdate, setNewTrackUpdate] = useState("");
  let [newTrackInsert, setNewTrackInsert] = useState("");
  const sprint2Tracks = [
    { id: 1, title: "song1" },
    { id: 2, title: "song2" },
    { id: 3, title: "song3" },
  ];

  let [newBanReason, setNewBanReason] = useState("");
  let [newRequestedID, setNewRequestedID] = useState("");

  const handleChangeCreateStoreName = (event) => {
    setCreateStoreName(event.target.value);
  };

  const handleChangeCreateStoreDescription = (event) => {
    setCreateStoreDescription(event.target.value);
  };

  const handleChangeEditStoreName = (event) => {
    setEditStoreName(event.target.value);
    //editStoreName = event.target.value;
  };

  const handleChangeEditStoreDescription = (event) => {
    setEditStoreDescription(event.target.value);
    //editStoreDescription = event.target.value;
  };

  const handleStorePress = () => {
    setCreatingStore(true);
  };

  const handleAddProduct = () => {
    setAddingProduct(true);
  };

  const cancelAddProduct = () => {
    setAddingProduct(false);
  };

  const handleAddTrack = () => {
    setAddingTrack(true);
  };

  const handleAddBan = () => {
    setAddingBan(true);
  };

  const cancelAddBan = () => {
    setAddingBan(false);
  };

  const createStore = (e) => {
    e.preventDefault();
    let success = false;
    fetch(`${backend}/create-store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nUserID: user.aID,
        vchName: createStoreName,
        txtDescription: createStoreDescription,
      }),
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
          sessionStorage.setItem("store", JSON.stringify(data));
          setCreatingStore(false);
          setEditStoreName(data.vchName);
          setEditStoreDescription(data.txtDescription);
          setStore(data);
        }
        return data;
      });
  };

  const updateStore = (e) => {
    e.preventDefault();
    let success = false;
    console.log(e);
    console.log("sending:");
    let result = {
      aID: store.aID,
      nUserID: user.aID,
      vchName: e.target.vchName.value,
      txtDescription: e.target.txtDescription.value,
    };
    fetch(`${backend}/update-store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
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
          sessionStorage.setItem("store", JSON.stringify(data));
          setStore(data);
          setEditStoreName(data.vchName);
          setEditStoreDescription(data.txtDescription);
          console.log("store updated");
          console.log(data);
          setEditingStore(false);
        }
        return data;
      });
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();
    let success = false;
    let data = {
      nUserID: user.aID,
      nStoreID: store.aID,
      vchName: newProductName,
      txtDescription: newProductDescription,
      fPrice: newProductPrice,
      fShipping: newProductShipping,
      nInventory: newProductInventory,
      vchPrice: newProductPrice,
      vchImagePath: "",
    };
    fetch(`${backend}/add-product`, {
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
          setNewProductName("");
          setNewProductDescription("");
          setNewProductPrice("");
          setNewProductShipping("");
          setNewProductInventory("");
        }
        return res.json();
      })
      .then((data) => {
        console.log("returned:");
        console.log(data);
        if (success) {
          setProducts(data.products);
          console.log("products updated");
          console.log(data);
          setAddingProduct(false);
        }
        return data;
      });
  };

  const handleSubmitTrack = (e) => {
    e.preventDefault();
    let success = false;
    let data = {
      nUserID: user.aID,
      vchTitle: newTrackName,
      txtDescription: newTrackDescription,
      vchAudioURL: newTrackAudioURL,
      vchImagePath: newTrackImagePath,
      nGenreID: newTrackGenreID,
      dtUpdateDate: newTrackUpdate,
      dtInsertDate: newTrackInsert,
    };
    fetch(`${backend}/add-track`, {
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
          setNewTrackName("");
          setNewTrackDescription("");
          setNewTrackAudioURL("");
          setNewTrackImagePath("");
          setNewTrackGenreID("");
          setNewTrackUpdate("");
          setNewTrackInsert("");
        }
        return res.json();
      })
      .then((data) => {
        console.log("returned:");
        console.log(data);
        if (success) {
          setTracks(data.products);
          console.log("tracks updated");
          console.log(data);
          setAddingTrack(false);
        }
        return data;
      });
  };

  const cancelCreateStore = () => {
    setCreatingStore(false);
  };

  const editStoreClicked = () => {
    setEditingStore(true);
  };

  const cancelEditStore = () => {
    setEditingStore(false);
  };

  const deleteTrack = (event, aID) => {
    console.log("delete track " + 1);
    event.preventDefault();
    let success = false;
    let data = {
      aID: aID,
      nUserID: user.aID,
      nStoreID: store.aID,
    };
    console.log("sending to delete:");
    console.log(data);
    fetch(`${backend}/delete-track`, {
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
          setTracks(data.tracks);
          console.log("tracks updated");
          console.log(data);
        }
        return data;
      });
  };

  const unfollow = () => {
    console.log("unfollow " + 1);
  };

  const deleteProduct = (event, aID) => {
    console.log("delete product " + 1);
    event.preventDefault();
    let success = false;
    let data = {
      aID: aID,
      nUserID: user.aID,
      nStoreID: store.aID,
    };
    console.log("sending to delete:");
    console.log(data);
    fetch(`${backend}/delete-product`, {
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
          setProducts(data.products);
          console.log("products updated");
          console.log(data);
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
      if (tracksJson) setTracks(tracks);
      if (musicJson) setMusic(music);
      if (productsJson) setProducts(products);
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

  let firstName, lastName, userID: number;
  try {
    userID = user.aID;
    firstName = user.vchFirstName;
    lastName = user.vchLastName;
    console.log(user);
  } catch (e) {
    userID = "";
    firstName = "";
    lastName = "";
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
    <Panel title="My Radar">
      <p>Welcome{firstName && `, ${firstName} ${lastName}`}!</p>

      <div className="box container bluebg">
        <div className="heading">My Store</div>
        {store && storeName != null ? (
          editingStore ? (
            <>
              <div className="edit-store">
                <form onSubmit={updateStore}>
                  <input type="hidden" name="nUserID" value={userID} />
                  <input type="hidden" name="aID" value={storeID} />
                  <input
                    className="indent input"
                    name="vchName"
                    defaultValue={editStoreName}
                    type="text"
                    placeholder="Store Name"
                    onChange={(e) => {
                      setTheStoreName(e.target.value);
                    }}
                  />
                  <input
                    className="indent input larger"
                    name="txtDescription"
                    type="text"
                    defaultValue={editStoreDescription}
                    placeholder="Store Description"
                    onChange={(e) => {
                      setTheStoreDescription(e.target.value);
                    }}
                  />
                  <input
                    type="submit"
                    className="button button-small"
                    value="Update Store"
                  />
                  <button
                    className="button button-small right right-indent  cancel"
                    onClick={cancelEditStore}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <div className="indent store-name">{theStoreName}&nbsp;</div>
              <div className="indent store-description">
                {theStoreDescription}&nbsp;
              </div>
              <button
                className="edit-store-button button button-small change-hue"
                onClick={editStoreClicked}
              >
                Edit Store
              </button>
            </>
          )
        ) : creatingStore ? (
          <>
            <div className="create-store">
              <form onSubmit={createStore}>
                <input type="hidden" name="nUserID" value={userID} />
                <input type="hidden" name="aID" value={storeID} />
                <input
                  className="indent input"
                  name="vchName"
                  type="text"
                  placeholder="Store Name"
                  onChange={handleChangeCreateStoreName}
                />
                <input
                  className="indent input larger"
                  name="txtDescription"
                  type="text"
                  placeholder="Store Description"
                  onChange={handleChangeCreateStoreDescription}
                />
                <input
                  type="submit"
                  className="button button-small"
                  value="Create Store"
                />
                <button
                  className="cancel button-small indent-right"
                  onClick={cancelCreateStore}
                >
                  Cancel
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="center">
            <button
              className="indent button button-small"
              onClick={handleStorePress}
            >
              Create Your Store
            </button>
          </div>
        )}
        {store && store.vchName != null ? (
          <>
            <div className="box container no-shadow">
              <div className="heading subheading light-gray">My Products</div>
              {products && products.length > 0 ? (
                <>
                  <div className="all-products flex">
                    {products.map((t, i) => {
                      return (
                        <>
                          <div className="product" key={i}>
                            <div className="product-name">{t.vchName}</div>
                            <div className="product-description">
                              {t.txtDescription}
                            </div>
                            <div className="product-price">
                              Price: $ {`${t.fPrice.toFixed(2)}`}
                            </div>
                            <div className="product-shipping">
                              Shipping: $ {`${t.fShipping.toFixed(2)}`}
                            </div>
                            <div className="product-inventory">
                              Stock: {t.nInventory}
                            </div>
                            <button
                              className="delete-product-button button button-small"
                              onClick={(event) => deleteProduct(event, t.aID)}
                              key={t.aID}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div className="indent">No products yet.</div>
                </>
              )}
              {addingProduct ? (
                <>
                  <div className="div-center">
                    <div className="product-box box container new-product-container no-shadow">
                      <div className="heading subheading gray">
                        Add a Product
                      </div>
                      <form onSubmit={handleSubmitProduct}>
                        <div className="new-product-pane">
                          <div>
                            <input
                              className="new-product-name input"
                              type="text"
                              name="newProductName"
                              value={newProductName}
                              onChange={(e) =>
                                setNewProductName(e.target.value)
                              }
                              placeholder="Name"
                            />
                            <textarea
                              className="new-product-description input"
                              name="newProductDescription"
                              value={newProductDescription}
                              onChange={(e) =>
                                setNewProductDescription(e.target.value)
                              }
                              placeholder="Description"
                            />
                            <input
                              type="number"
                              className="new-product-price input"
                              name="newProductPrice"
                              value={newProductPrice}
                              onChange={(e) =>
                                setNewProductPrice(e.target.value)
                              }
                              placeholder="Price"
                            />
                            <input
                              type="number"
                              className="new-product-shipping input"
                              name="newProductShipping"
                              value={newProductShipping}
                              onChange={(e) =>
                                setNewProductShipping(e.target.value)
                              }
                              placeholder="Shipping Cost"
                            />
                            <input
                              type="number"
                              className="new-product-inventory input"
                              name="newProductInventory"
                              value={newProductInventory}
                              onChange={(e) =>
                                setNewProductInventory(e.target.value)
                              }
                              placeholder="Inventory Count"
                            />
                            <label>Add audio: </label>
                            {tracks && tracks.length > 0 ? (
                              <select>
                                <option value="None">None</option>
                                {tracks.map((t, i) => (
                                  <option value={t.vchTitle}>
                                    {t.vchTitle}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <>
                                <div className="indent">
                                  Upload audio to enhance product!
                                </div>
                              </>
                            )}
                          </div>

                          <div className="product-submit-margin-top">
                            <button
                              className="button button-small"
                              type="submit"
                            >
                              Submit
                            </button>
                            <button
                              className="button button-small cancel"
                              onClick={cancelAddProduct}
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
                      onClick={handleAddProduct}
                    >
                      Add Product
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="box container no-shadow">
              <div className="heading subheading gray">My Orders</div>
              <div className="orders indent">No pending orders.</div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>

      <div className="box greenbg">
        <div className="heading green">Tracks</div>
        {tracks && tracks.length > 0 ? (
          tracks.map((t, i) => (
            <div className="track" key={i}>
              <div className="track-title">{t.vchTitle}</div>
              <div className="track-description">{t.txtDescription}</div>
              <div className="track-url">{t.vchAudioUrl}</div>
              <button
                className="button button-small"
                onClick={(event) => deleteTrack(event, t.aID)}
                key={t.aID}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <div className="indent bottom-margin">No tracks yet.</div>
        )}
      </div>

      <div className="box">
        <div className="heading orange">My Music</div>
        {music && music.length > 0 ? (
          music.map((t, i) => (
            <div className="track" key={i}>
              <div className="track-title">{t.vchTrackName}</div>
              <div className="track-description">{t.txtDescription}</div>
              <div className="track-url">{t.vchAudioUrl}</div>
              <button className="button button-small" onClick={deleteTrack}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <>
            <div className="indent">No uploaded music yet.</div>
          </>
        )}
        <div className="center">
          <form onSubmit={handleSubmitTrack}>
            <input type="file" name="file" id="file-upload" />
            <br />
            <button
              className="indent bottom-margin top-indent button button-small"
              type="submit"
            >
              Upload a Track
            </button>
          </form>
        </div>
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
      </div>

      <div className="box">
        <div className="heading"> Make Playlists</div>
      </div>
    </Panel>
  );
}
