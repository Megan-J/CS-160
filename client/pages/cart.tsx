import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Panel from "./components/Panel";
import { backend } from "./components/Constants";

// interface Product {
//     id: number;
//     name: string;
//     description: string;
//     price: number;
//   }
//key={product.id}
export default function Cart() {
  let [bans, setBans] = useState(null);
  let [user, setUser] = useState(null);
  let [cart, setCart] = useState(null);
  let [items, setItems] = useState(null);
  let [products, setProducts] = useState(null);
  const router = useRouter();

  useEffect(() => {
    console.log("IN THE CART");
    console.log(sessionStorage);
    let userJson = sessionStorage.getItem("user");
    let productsJson = sessionStorage.getItem("products");
    let cartJson = sessionStorage.getItem("cart");
    let storeJson = sessionStorage.getItem("store");

    let user = userJson ? JSON.parse(userJson) : null;
    let cart = cartJson ? JSON.parse(cartJson) : null;
    let store = storeJson ? JSON.parse(storeJson) : null;

    setUser(user);
    console.log("user:");
    console.log(user);
    if (user && user.vchUsername !== null) {
      let initials = "";
      if (user.vchUsername != null) {
        initials = user.vchFirstName.charAt(0) + user.vchLastName.charAt(0);
        initials = initials.toUpperCase();
      }
      let products = productsJson ? JSON.parse(productsJson) : null;
      //if (bansJson) setBans(bans);
      fetchBanRequests(user.aID);
    }
  }, []);

  const fetchBanRequests = () => {
    // Fetch ban requests from the backend
    fetch(`${backend}/cart/1`)
      .then((res) => res.json())
      .then((data) => {
        setBans(data);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching ban requests:", error));
  };

  const handleProceedToCheckout = () => {
    router.push("/checkout");
  };

  const handleProceedToStores = () => {
    router.push("/stores");
  };

  function deleteItem(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    aID: any
  ): void {
    throw new Error("Function not implemented.");
  }

  let cartID: number, storeID: number, productID: number, quantity: number;
  try {
    cartID = cart.aID;
    storeID = cart.nStoreID;
    productID = cart.nStoreID;
    quantity = cart.nQuantity;
  } catch (e) {
    cartID = "";
    storeID = "";
    productID = "";
    quantity = "";
  }

  return (
    <Panel title="Cart">
      <div className="box">
        <div className="heading"> Your Items</div>
        {products && products.length > 0 ? (
          <>
            <div className="all-products flex">
              {products.map((t, i) => {
                return (
                  <>
                    <div className="product" key={i}>
                      <div
                        className="product-name"
                        onDoubleClick={() => {
                          setIsEditingProductID(i);
                          setIsEditingProductName(true);
                        }}
                      >
                        {isEditingProductName && isEditingProductID == i ? (
                          <input
                            className="indent input"
                            name="vchName"
                            defaultValue={t.vchName}
                            type="text"
                            placeholder="Product Name"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                updateProductEdit(e, i, "vchName");
                                setIsEditingProductName(false);
                              } else if (e.key === "Escape") {
                                setIsEditingProductName(false);
                              }
                            }}
                          />
                        ) : (
                          <>{t.vchName}&nbsp;</>
                        )}
                      </div>
                      <div
                        className="product-description"
                        onDoubleClick={() => {
                          setIsEditingProductID(i);
                          setIsEditingProductDescription(true);
                        }}
                      >
                        {isEditingProductDescription &&
                        isEditingProductID == i ? (
                          <input
                            className="indent input"
                            name="txtDescription"
                            defaultValue={t.txtDescription}
                            type="text"
                            placeholder="Product Description"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                updateProductEdit(e, i, "txtDescription");
                                setIsEditingProductDescription(false);
                              } else if (e.key === "Escape") {
                                setIsEditingProductDescription(false);
                              }
                            }}
                          />
                        ) : (
                          <>{t.txtDescription}&nbsp;</>
                        )}
                      </div>
                      <div
                        className="product-price"
                        onDoubleClick={() => {
                          setIsEditingProductID(i);
                          setIsEditingProductPrice(true);
                        }}
                      >
                        Price: $
                        {isEditingProductPrice && isEditingProductID == i ? (
                          <input
                            className="indent input short-input"
                            name="fPrice"
                            defaultValue={t.fPrice.toFixed(2)}
                            type="text"
                            placeholder="Price"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                updateProductEdit(e, i, "fPrice");
                                setIsEditingProductPrice(false);
                              } else if (e.key === "Escape") {
                                setIsEditingProductPrice(false);
                              }
                            }}
                          />
                        ) : (
                          <>{t.fPrice.toFixed(2)}&nbsp;</>
                        )}
                      </div>
                      <div
                        className="product-shipping"
                        onDoubleClick={() => {
                          setIsEditingProductID(i);
                          setIsEditingProductShipping(true);
                        }}
                      >
                        Shipping: $
                        {isEditingProductShipping && isEditingProductID == i ? (
                          <input
                            className="indent input short-input"
                            name="fShipping"
                            defaultValue={t.fShipping.toFixed(2)}
                            type="text"
                            placeholder="Shipping"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                updateProductEdit(e, i, "fShipping");
                                setIsEditingProductShipping(false);
                                setIsEditingProductID(null);
                              } else if (e.key === "Escape") {
                                setIsEditingProductShipping(false);
                                setIsEditingProductID(null);
                              }
                            }}
                          />
                        ) : (
                          <>{t.fShipping.toFixed(2)}&nbsp;</>
                        )}
                      </div>
                      <div
                        className="product-inventory"
                        onDoubleClick={() => {
                          setIsEditingProductID(i);
                          setIsEditingProductInventory(true);
                        }}
                      >
                        Stock:
                        {isEditingProductInventory ? (
                          <input
                            className="indent input short-input"
                            name="nInventory"
                            defaultValue={t.nInventory}
                            type="text"
                            placeholder="Inventory"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                updateProductEdit(e, i, "nInventory");
                                setIsEditingProductInventory(false);
                                setIsEditingProductID(null);
                              } else if (e.key === "Escape") {
                                setIsEditingProductInventory(false);
                                setIsEditingProductID(null);
                              }
                            }}
                          />
                        ) : (
                          <>{t.nInventory.toFixed(0)}&nbsp;</>
                        )}
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
            <div>
              <button
                className="delete-product-button button button-small"
                onClick={handleProceedToCheckout}
              >
                {" "}
                Proceed to Checkout
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="indent bottom-margin">No Items in Cart</div>
            <div>
              <button
                className="delete-product-button button button-small"
                onClick={handleProceedToStores}
              >
                {" "}
                Shop for Products
              </button>
            </div>
          </>
        )}
      </div>
    </Panel>
  );
}
