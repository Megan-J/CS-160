import React, { useEffect, useState } from "react";
import Panel from "./components/Panel";
import { useRouter } from "next/router";
import Link from "next/link";
import { backend } from "./components/Constants";

interface Inputs {
  email?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phoneNumber?: string;
  cardNumber?: string;
  nameOnCard?: string;
  expiration?: string;
  securityCode?: string;
}

export default function placeOrder() {
  const router = useRouter();

  const [formState, setFormState] = useState(null);
  let [error, setError] = useState("");
  let [user, setUser] = useState(null);
  let [items, setItems] = useState(null);

  const [inputs, setInputs] = useState<Inputs>({});
  const [shipAddress, setShipAddress] = useState("");
  const [shipFirstName, setShipFirstName] = useState("");
  const [shipLastName, setShipLastName] = useState("");
  const [shipCity, setShipCity] = useState("");
  const [shipState, setShipState] = useState("");
  const [shipZip, setShipZip] = useState("");
  const [shipEmail, setShipEmail] = useState("");
  const [shipPhoneNum, setShipPhoneNum] = useState("");
  const [delivery, setDelivery] = useState("");
  const [billAddress, setBillAddress] = useState("");
  const [billFirstName, setBillFirstName] = useState("");
  const [billLastName, setBillLastName] = useState("");
  const [billCity, setBillCity] = useState("");
  const [billState, setBillState] = useState("");
  const [billZip, setBillZip] = useState("");
  const [billEmail, setBillEmail] = useState("");
  const [billPhoneNum, setBillPhoneNum] = useState("");
  const [total, setTotal] = useState(0);

  let urlString, url, userIdUrl;
  let tax = 0.1;

  let devPaymentSelect = 0;

  useEffect(() => {
    urlString = window.location.href;
    url = new URL(urlString);
    userIdUrl = url.searchParams.get("userID");
    //console.log(storeID);
    let userJson = sessionStorage.getItem("user");
    let user = userJson ? JSON.parse(userJson) : null;
    setTotal(10);

    console.log("HELLO");
    console.log("userID from URL: " + userIdUrl);
    setUser(user);
    console.log("user info: " + user);
    console.log(user);

    if (user && user.vchUsername !== null) {
      getCartData();
      deliveryClick();
    }
  }, []);

  const getCartData = () => {
    let success = false;
    fetch(`${backend}/cart/${userIdUrl}`, {
      method: "GET",
    })
      .then((res) => {
        if (res.status === 200) {
          success = true;
        } else {
          setError("Error in retrieving items in cart");
        }
        return res.json();
      })
      .then((data) => {
        if (success) {
          setItems(data);
        }
      });
  };

  const deliveryClick = () => {
    console.log("I CLICKED IT");
  };

  const handleChange = (event) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
>>>>>>> team/beta-testing
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log(inputs);

    if (
      inputs.email?.trim() != undefined &&
      inputs.firstName?.trim() != undefined &&
      inputs.lastName?.trim() != undefined &&
      inputs.address?.trim() != undefined &&
      inputs.city?.trim() != undefined &&
      inputs.state?.trim() != undefined &&
      inputs.zip?.trim() != undefined &&
      inputs.cardNumber?.trim() != undefined &&
      inputs.nameOnCard?.trim() != undefined &&
      inputs.expiration?.trim() != undefined &&
      inputs.securityCode?.trim() != undefined
    ) {
      alert("Order placed successfully!");
    } else {
      alert("Missing one of the required fields");
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(formState);

    let data = JSON.stringify(formState);
    const lines = data.trim().split("\n");
    const shipVariables: string[] = [];
    const billVariables: string[] = [];

    lines.forEach((line) => {
      const key = line.split(":")[0].trim();

      if (key.startsWith("ship")) {
        shipVariables.push(line);
      } else if (billVariables.push(line)) {
      }
    });

    let shipSuccess = false;
    let billSuccess = false;

    /*fetch(`${backend}/checkout/shipping_address`, {
      method: "POST",
      body: JSON.stringify(shipVariables),
    }).then((res) => {
      console.log(res);
      if (res.status === 200 || res.status === 201) {
        shipSuccess = true;
      } else {
        setError("Invalid shipping address");
      }
    });

    fetch(`${backend}/checkout/billing_address`, {
      method: "POST",
      body: JSON.stringify(billVariables),
    }).then((res) => {
      console.log(res);
      if (res.status === 200 || res.status === 201) {
        billSuccess = true;
      } else {
        setError("Invalid billing address");
      }
    });
    if (shipSuccess && billSuccess) {
      router.push("/confirmation");
    }*/
  };

  const handleDevPayment = () => {
    devPaymentSelect++;
    if (devPaymentSelect % 2 == 0) {
      console.log("not selected");
    } else {
      console.log("selected");
    }
  };

  return (
    <Panel title="Checkout">
      <div className="box">
        <h2 className="heading">Summary</h2>
        <div>
          <div className="product-name indent">Subtotal:</div>
          <div className="indent">${`${total.toFixed(2)}`}</div>
          <div className="product-name indent">Shipping:</div>
          <div className="indent">${`${total.toFixed(2)}`}</div>
          <div className="product-name indent">Taxes:</div>
          <div className="indent">${`${(total * tax).toFixed(2)}`}</div>
          <br />
        </div>
        <h2 className="heading">In Your Cart</h2>
        <div>
          {items && items.length > 0 ? (
            <>
              {items.map((t, i) => (
                <div className="">
                  <div key={i}>
                    <div className="product-name indent">{t.product_name}</div>
                    <div className="product-description indent">
                      Quantity: {`${t.quantity}`}
                    </div>
                    <div className="product-price indent">
                      ${`${(t.product_price * t.quantity).toFixed(2)}`}
                    </div>
                    <br />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="box">
        <div>
          <h2 className="heading">Shipping Address</h2>
        </div>
        <form onSubmit={handleFormSubmit}>
          <p>
            <label>
              <input
                type="text"
                placeholder="First Name"
                name="shipFirstName"
                onChange={handleChange}
              />
            </label>

            <label>
              <input
                type="text"
                placeholder="Last Name"
                name="shipLastName"
                onChange={handleChange}
              />
            </label>
          </p>
          <p>
            <label>
              <input
                type="text"
                placeholder="Address"
                name="shipAddr"
                onChange={handleChange}
              />
            </label>
          </p>
          <p>
            <label>
              <input
                type="text"
                placeholder="City"
                name="shipCity"
                onChange={handleChange}
              />
            </label>
            <label>
              <input
                type="text"
                placeholder="State"
                name="shipState"
                onChange={handleChange}
              />
            </label>
            <label>
              <input
                type="text"
                placeholder="ZIP Code"
                name="shipZip"
                onChange={handleChange}
              />
            </label>
          </p>
          <p>
            <label>
              <input
                type="text"
                placeholder="Email"
                name="shipEmail"
                onChange={handleChange}
              />
            </label>
            <label>
              <input
                type="text"
                placeholder="Phone Number"
                name="shipPhoneNumber"
                onChange={handleChange}
              />
            </label>
          </p>
          <br />

          <div>
            <h2 className="heading">Delivery</h2>
          </div>
          <input
            type="radio"
            id="Standard Shipping"
            className="indent"
            name="shippingOpt"
            value="Standard Shipping"
            onSelect={deliveryClick}
          ></input>
          <label>Standard Shipping: $10</label>
          <br />
          <input
            type="radio"
            id="Express Shipping"
            className="indent"
            name="shippingOpt"
            value="Express Shipping"
            onSelect={deliveryClick}
          ></input>
          <label>Express Shipping: $15</label>
          <br />
          <br />

          <div>
            <h2 className="heading">Payment</h2>
          </div>
          <input
            type="checkbox"
            className="indent"
            id="Development Payment"
            value="Development Payment"
            onChange={handleDevPayment}
          ></input>
          <label>Development Payment</label>
          <br />
          <br />
          <div>
            <h2 className="heading">Billing Address</h2>
          </div>
          <p>
            <label>
              <input
                type="text"
                placeholder="First Name"
                name="billFirstName"
                onChange={handleChange}
              />
            </label>

            <label>
              <input
                type="text"
                placeholder="Last Name"
                name="billLastName"
                onChange={handleChange}
              />
            </label>
          </p>
          <p>
            <label>
              <input
                type="text"
                placeholder="Address"
                name="billAddr"
                onChange={handleChange}
              />
            </label>
          </p>
          <p>
            <label>
              <input
                type="text"
                placeholder="City"
                name="billCity"
                onChange={handleChange}
              />
            </label>
            <label>
              <input
                type="text"
                placeholder="State"
                name="billState"
                onChange={handleChange}
              />
            </label>
            <label>
              <input
                type="text"
                placeholder="ZIP Code"
                name="billZip"
                onChange={handleChange}
              />
            </label>
          </p>
          <p>
            <label>
              <input
                type="text"
                placeholder="Email"
                name="billEmail"
                onChange={handleChange}
              />
            </label>
            <label>
              <input
                type="text"
                placeholder="Phone Number"
                name="billPhoneNumber"
                onChange={handleChange}
              />
            </label>
          </p>
          <br />
        </form>
        <div>
          <div>
            <p style={{ padding: "10px" }}>
              By placing your order you agree to Radar's Terms and Conditions,
              Privacy Notice, and Cookie Policy.
            </p>
          </div>
          <br />
        </div>

        <div className="flex items-center justify-center">
          <button className="button change-hue">Place Order</button>
        </div>
      </div>
    </Panel>
  );
}
