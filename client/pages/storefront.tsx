import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Panel from "./components/Panel";
import { backend } from "./components/Constants";
import Link from "next/link";

export default function Storefront() {
  //should hold the store id
  let urlString, url, storeID;

  let [products, setProducts] = useState("");
  let [bans, setBans] = useState(null);
  let [user, setUser] = useState(null);
  let [error, setError] = useState("");
  let [storeName, setStoreName] = useState("");
  let [storeDescription, setDescriptionName] = useState("");
  let [owner, setOwner] = useState("");
  let [ownerId, setOwnerId] = useState("");

  useEffect(() => {
    urlString = window.location.href;
    url = new URL(urlString);
    storeID = url.searchParams.get("storeID");
    //console.log(storeID);

    getStoreAttributes();
    getStoreProducts();

    let userJson = sessionStorage.getItem("user");

    let user = userJson ? JSON.parse(userJson) : null;

    setUser(user);

    if (user && user.vchUsername !== null) {
      fetchBanRequests();
    }
  }, []);

  const getStoreAttributes = () => {
    let success = false;
    fetch(`${backend}/storefront/owner/${storeID}`, {
      method: "GET",
    })
      .then((res) => {
        if (res.status === 200) {
          success = true;
        } else {
          setError("No store found");
        }
        return res.json();
      })
      .then((data) => {
        if (success) {
          console.log(data);
          setStoreName(data.name);
          setDescriptionName(data.description);
          setOwnerId(data.ownerID);
          setOwner(data.ownerName);
        }
      });
  };

  const getStoreProducts = () => {
    let success = false;
    fetch(`${backend}/products/${storeID}`, {
      method: "GET",
    })
      .then((res) => {
        if (res.status === 200) {
          success = true;
        } else {
          setError("Couldn't find products");
        }
        return res.json();
      })
      .then((data) => {
        if (success) {
          setProducts(data);
        }
      });
  };

  const AddProductToCart = (event, aID) => {
    event.preventDefault();
    let success = false;
    let data = {
      nUserID: user.aID,
      nProductID: aID,
      nStoreID: 1,
      nQuantity: 1,
    };
    //console.log(data);
    fetch(`${backend}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        //console.log(res);
        if (res.status === 200 || res.status === 201) {
          success = true;
        }
        return res.json();
      })
      .then((data) => {
        //console.log("returned:");
        //console.log(data);
        if (success) {
          setProducts(data.products);
          //console.log("Add product to cart!");
          //console.log(data);
        }
        return data;
      });
  };

  // this doesn't work
  const fetchBanRequests = () => {
    // Fetch ban requests from the backend
    fetch(`${backend}/product/1`)
      .then((res) => res.json())
      .then((data) => {
        setBans(data);
        //console.log(data);
      })
      .catch((error) => console.error("Error fetching ban requests:", error));
  };

  return (
    <Panel title={storeName}>
      <div className="bold-text">
        <Link href="/user-profile" as={`/user-profile?userID=${ownerId}`}>
          {owner}
        </Link>
      </div>
      <div>
        <p>{storeDescription}</p>
      </div>
      <div className="box">
        <div className="heading">Products</div>
        {products && products.length > 0 ? (
          <div className="all-products flex">
            {products.map((t, i) => (
              <div className="product" key={i}>
                <div className="product-name">{t.vchName}</div>
                <div className="product-description">{t.txtDescription}</div>
                <div className="product-price">
                  Price: $ {`${t.fPrice.toFixed(2)}`}
                </div>
                <div className="product-inventory">Stock: {t.nInventory}</div>
                <button
                  className="delete-product-button button button-small"
                  onClick={(event) => AddProductToCart(event, t.aID)}
                  key={t.aID}
                >
                  Add Product
                </button>
                <Link classname="report-icon" href="/report">
                  <i class="bi bi-exclamation-circle"></i>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="indent bottom-margin">Products Coming Soon!</div>
          </>
        )}
      </div>
      <div>
        <Link className="report-icon" href="/report">
          <i class="bi bi-exclamation-circle"></i>
        </Link>
      </div>
    </Panel>
  );
}
