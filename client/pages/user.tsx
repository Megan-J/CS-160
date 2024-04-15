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

  let [creatingStore, setCreatingStore] = useState(null);
  let [editingStore, setEditingStore] = useState(null);
  let [addingProduct, setAddingProduct] = useState(null);

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

  const cancelCreateStore = () => {
    setCreatingStore(false);
  };

  const editStoreClicked = () => {
    setEditingStore(true);
  };

  const cancelEditStore = () => {
    setEditingStore(false);
  };

  const deleteTrack = () => {
    console.log("delete track " + 1);
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
    let userJson = sessionStorage.getItem("user");
    let storeJson = sessionStorage.getItem("store");
    let tracksJson = sessionStorage.getItem("tracks");
    let musicJson = sessionStorage.getItem("music");
    let productsJson = sessionStorage.getItem("products");
    let followingJson = sessionStorage.getItem("following");
    let followersJson = sessionStorage.getItem("followers");

    let user = userJson ? JSON.parse(userJson) : null;
    let store = storeJson ? JSON.parse(storeJson) : null;
    let tracks = tracksJson ? JSON.parse(tracksJson) : null;
    let music = musicJson ? JSON.parse(musicJson) : null;
    let products = productsJson ? JSON.parse(productsJson) : null;
    let following = followingJson ? JSON.parse(followingJson) : null;
    let followers = followersJson ? JSON.parse(followersJson) : null;

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
    }
  }, []);

  const onFileUpload = (event: any) => {
    //var name = document.getElementById("file-upload");
    //alert("Selected file: " + name.files.item(0).name);
    console.log("file uploaded");
  };

  let firstName, lastName, userID;
  try {
    userID = user.aID;
    firstName = user.vchFirstName;
    lastName = user.vchLastName;
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

  const fileUploadButton = () => {
    document.getElementById("fileButton").click();
    document.getElementById("fileButton").onchange = () => {
      this.setFile({
        fileUploadState: document.getElementById("fileButton").value,
      });
    };
  };

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
                            {music && music.length > 0 ? (
                              music.map((t, i) => (
                                <div className="track" key={i}>
                                  <div className="track-title">
                                    {t.vchTrackName}
                                  </div>
                                  <div className="track-description">
                                    {t.txtDescription}
                                  </div>
                                  <div className="track-url">
                                    {t.vchAudioUrl}
                                  </div>
                                  <button
                                    className="button button-small"
                                    onClick={deleteTrack}
                                  >
                                    Delete
                                  </button>
                                </div>
                              ))
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
              <div className="track-title">{t.vchTrackName}</div>
              <div className="track-description">{t.txtDescription}</div>
              <div className="track-url">{t.vchAudioUrl}</div>
              <div className="track-artist">{t.vchArtist}</div>
              <button className="button button-small" onClick={deleteTrack}>
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
          <input type="file" name="file" id="file-upload" />
          <br />
          <label htmlFor="file-upload">
            <button
              className="indent bottom-margin top-indent button button-small"
              onClick={onFileUpload}
            >
              Upload a Track
            </button>
          </label>
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
    </Panel>
  );
}
