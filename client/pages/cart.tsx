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
  let [idOfUser, setUserId] = useState(null);
  let [products, setProducts] = useState(null);
  let [error, setError] = useState("");
  const router = useRouter();
  let urlString, url, userIdUrl;

  useEffect(() => {
    urlString = window.location.href;
    url = new URL(urlString);
    userIdUrl = url.searchParams.get("userID");

    console.log(sessionStorage);
    let userJson = sessionStorage.getItem("user");
    let user = userJson ? JSON.parse(userJson) : null;

    setUser(user);
    setUserId(userIdUrl);
    getCartItems();
  }, []);

  const handleProceedToCheckout = () => {
    router.push("/checkout");
  };

  const handleProceedToStores = () => {
    router.push("/stores");
  };

  const getCartItems = () => {
    let success = false;
    fetch(`${backend}/cart/${userIdUrl}`, {
      method: "GET",
    })
      .then((res) => {
        if (res.status === 200) {
          success = true;
        } else {
          setError("Can't find cart");
        }
        return res.json();
      })
      .then((data) => {
        if (success) {
          setProducts(data);
          console.log(products);
        }
      });
  };

  const deleteItem = (event, item) => {
    event.preventDefault();
    let success = false;
    let data = {
      userId: item.user_id,
      productId: item.id,
      storeId: item.store_id,
      nQuantity: item.quantity,
      nActive: 1,
    };
    fetch(`${backend}/cart/delete-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status === 200) {
        success = true;
      } else {
        setError("Couldn't delete item");
      }
      return res.json();
    });
  };

  return (
    <Panel title="Cart">
      <div className="box">
        <div className="heading">Your Items</div>
        {products && products.length > 0 ? (
          <>
            <div className="">
              {products.map((t, i) => (
                <div className="product">
                  <div key={i}>
                    <div className="product-name">{t.product_name}</div>
                    <div className="product-description">
                      Quantity: {`${t.quantity}`}
                    </div>
                    <div className="product-price">
                      ${`${(t.product_price * t.quantity).toFixed(2)}`}
                    </div>
                  </div>
                  <button
                    className="delete-product-button button button-small"
                    onClick={(event) => deleteItem(event, t)}
                    key={t.aID}
                  >
                    Remove from Cart
                  </button>
                </div>
              ))}
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
