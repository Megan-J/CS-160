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
export default function Confirmation() {
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
    <Panel title="Thank you!">
      <div className="box">
        <div className="heading">Your order was placed successfully</div>
        <div>
          <p>Order date:</p>
          <p>Order number:</p>
        </div>
        <br />
        <div>
          <h2 className="text-xl mb-4">Shipping Address</h2>
        </div>
        <div>
          <h2 className="text-xl mb-4">Delivery</h2>
        </div>
        <div>
          {" "}
          <h2 className="text-xl mb-4">Payment</h2>
        </div>
      </div>
    </Panel>
  );
}
