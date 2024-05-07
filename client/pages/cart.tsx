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
            <div className="all-products flex"></div>
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
