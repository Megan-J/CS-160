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
  
  let [user, setUser] = useState(null);
  let [bans, setBans] = useState(null);
  //let [cart, setCart] = useState(null);
  //let [items, setItems] = useState(null);
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
    let products = productsJson ? JSON.parse(productsJson) : null;

    setUser(user);
    console.log("user:");
    console.log(user);
    if (user && user.vchUsername !== null) {
      // let initials = "";
      // if (user.vchUsername != null) {
      //   initials = user.vchFirstName.charAt(0) + user.vchLastName.charAt(0);
      //   initials = initials.toUpperCase();
      // }
      if (productsJson) setProducts(products);
      //if (bansJson) setBans(bans);
      fetchBanRequests();
    }
  }, []);

  const fetchBanRequests = () => {
     // Check if user is available before fetching items
    if (!user || !user.aID) {
      console.error("User information is not available");
      return;
    }
    // Fetch items from the backend
    fetch(`${backend}/cart/${user.aID}`)
      .then((res) => res.json())
      .then((data) => {
        setBans(data);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching user:", error));
  };

  const deleteBan = (event, aID) => {
    event.preventDefault();
    let success = false;
    let data = {
      aID: aID,
      nUserID: user.aID,
    };
    fetch(`${backend}/delete-cart`, {
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
        {bans && bans.length > 0 ? (
          <div className="all-products flex">
          {bans.map((t, i) => (
            <div className="product" key={i}>
              <div className="product-name">Store: {t.store_name}</div>
              <div className="product-description">Product: {t.product_name}</div>
              <div className="product-inventory">Quantity: {t.quantity}</div>
              <div className="product-description">Price: ${t.product_price}</div>
              <button
                className="delete-product-button button button-small"
                onClick={(event) => deleteBan(event, t.cart_id)}
                key={t.aID}
              >
                Delete Product
              </button>
            </div>
          ))}
        </div>
        ) : (
          <>
            <div className="indent bottom-margin">No Items in Cart</div>
            <div>
              <button
                className="button button-small cancel"
                onClick={handleProceedToStores}
              >
                {" "}
                Shop for Products
              </button>
            </div>
          </>
        )}
        
      </div>
      <div>
              <button
                className="button button-small cancel"
                onClick={handleProceedToCheckout}
              >
                {" "}
                Proceed to Checkout
              </button>
        </div>
      
    </Panel>
  );
}
{
 // delete-product-button button button-small
}
