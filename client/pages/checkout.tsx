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
  const [inputs, setInputs] = useState<Inputs>({});

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
      <button className="button button-small cancel">
        Return to shopping cart
      </button>
      <br />
      <div>
        <h2 className="text-xl mb-4">Shipping Address</h2>
      </div>
      <div>
        <form>
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
                placeholder="Email"
                name="email"
                value={inputs.email || ""}
                onChange={handleChange}
              />
            </label>
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
        </form>
      </div>
      <br />
      <br />
      <div>
        <h2 className="text-xl mb-4">Delivery</h2>
      </div>
      <div>
        <form>
          <input
            type="radio"
            id="Standard Shipping"
            value="Standard Shipping"
          ></input>
          <label>Standard Shipping</label>
          <br />
          <input
            type="radio"
            id="Express Shipping"
            value="Express Shipping"
          ></input>
          <label>Express Shipping</label>
        </form>
      </div>
      <br />
      <br />
      <div>
        <h2 className="text-xl mb-4">Payment</h2>
      </div>
      <div className="payment-form">
        <PaymentForm
          applicationId="sq0idp-vcdvrG8K6y53ItYMyBFfsQ"
          cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
            console.log("token:", token);
            console.log("verifiedBuyer:", verifiedBuyer);
          }}
          locationId="EAAAl58xwT8s_Esh11rlgbT9Wde0bkLB33DEhpVD0ulvezR9rZmAd2qU8dwbAIs8"
        >
          <CreditCard />
        </PaymentForm>
      </div>
      <div>
        <input
          type="radio"
          id="Development Payment"
          value="Development Payment"
        ></input>
        <label>Development Payment</label>
      </div>
      <br />
      <br />
      <div>
        <h2 className="text-xl mb-4">Review</h2>
        <p>
          By placing your order you agree to our Terms and Conditions, Privacy
          Notice, and Cookie Policy.
        </p>
      </div>
    </Panel>
  );
}
