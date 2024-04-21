import React, { useState } from "react";
import Panel from "./components/Panel";
import { PaymentForm, CreditCard } from "react-square-web-payments-sdk";

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
  require("dotenv").config({ debug: true });

  const [inputs, setInputs] = useState<Inputs>({});

  const dummyOrder = {
    items: [
      { id: 1, name: "Product A", price: 50 },
      { id: 2, name: "Product B", price: 120 },
      { id: 3, name: "Product C", price: 15 },
    ],
  };

  const handleChange = (event: { target: { name: any; value: any } }) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
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

  return (
    <Panel title="Checkout">
      <h2 className="text-xl mb-4">Order</h2>
      <div>
        <ul>
          {dummyOrder.items.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price}
            </li>
          ))}
        </ul>
        <p>Total: $185</p>
      </div>
      <br />
      <div>
        <form className="contact">
          <a className="font-semibold">Contact</a>
          <br />
          <label>
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={inputs.email || ""}
              onChange={handleChange}
            />
            <br />
            <br />
          </label>
          <a className="font-semibold">Shipping Address</a>
          <br />
          <label>
            Country/Region
            <select onChange={handleChange}>
              <option value={"United States" && inputs.country}>
                United States
              </option>
            </select>
          </label>
          <br />
          <p>
            <label>
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={inputs.firstName || ""}
                onChange={handleChange}
              />
            </label>

            <label>
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={inputs.lastName || ""}
                onChange={handleChange}
              />
            </label>
          </p>
          <p>
            <label>
              <input
                type="text"
                placeholder="Address"
                name="address"
                value={inputs.address || ""}
                onChange={handleChange}
              />
            </label>
          </p>
          <p>
            <label>
              <input
                type="text"
                placeholder="City"
                name="city"
                value={inputs.city || ""}
                onChange={handleChange}
              />
            </label>
            <label>
              <input
                type="text"
                placeholder="State"
                name="state"
                value={inputs.state || ""}
                onChange={handleChange}
              />
            </label>
            <label>
              <input
                type="text"
                placeholder="ZIP Code"
                name="zip"
                value={inputs.zip || ""}
                onChange={handleChange}
              />
            </label>
          </p>
          <p>
            <label>
              <input
                type="text"
                placeholder="Phone Number"
                name="phoneNumber"
                value={inputs.phoneNumber || ""}
                onChange={handleChange}
              />
            </label>
          </p>
          <div className="payment-form">
            <PaymentForm
              applicationId={process.env.REACT_APP_applicationIdAPIKey}
              cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
                console.log("token:", token);
                console.log("verifiedBuyer:", verifiedBuyer);
              }}
              locationId={process.env.REACT_APP_locationAPIKey}
            >
              <CreditCard />
            </PaymentForm>
          </div>
          <button onClick={handleSubmit}>Confirm Order</button>
        </form>
        <br />
        <br />
        <br />
        <a>
          By placing your order you agree to Terms and Conditions, Privacy
          Notice, and Cookie Policy.
        </a>
      </div>
    </Panel>
  );
}
