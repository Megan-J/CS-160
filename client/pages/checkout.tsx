import React, { useEffect, useState } from "react";
import Panel from "./components/Panel";
import { useRouter } from "next/router";
import { PaymentForm, CreditCard } from "react-square-web-payments-sdk";
import Link from "next/link";

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
  let showDelivery = true;
  let showPayment = true;
  let showReview = true;
  let sameBill = true;
  let numSelect = 0;

  useEffect(() => {}, []);

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

  const handleShippingAddr = () => {
    showDelivery = false;
    console.log("handled shipping addr");
    console.log(showDelivery);
  };

  const handleSameAddr = () => {
    numSelect++;
    if (numSelect % 2 == 0) {
      console.log("not selected");
    } else {
      console.log("selected");
    }
  };

  const handleDeliveryMethod = () => {
    console.log("handled delivery");
  };

  const handlePayment = () => {};

  const handleDiffAddr = () => {};

  const handlePlaceOrder = () => {};

  return (
    <Panel title="Checkout">
      <Link className="button button-small cancel" href="/cart">
        Return to shopping cart
      </Link>
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
          <br />
          <input
            type="checkbox"
            id="sameBillingAddr"
            name="sameBillingAddr"
            value="sameBillingAddr"
            onChange={handleSameAddr}
          ></input>
          <label>Shipping address is the same as billing address</label>
          <br />
          <br />
        </form>
        <button
          value="Confirm Shipping Address"
          className="center bottom-margin top-indent button button-small"
          onClick={handleShippingAddr}
        >
          Confirm Shipping Address
        </button>
      </div>
      {showDelivery ? (
        <>
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
                name="shippingOpt"
              ></input>
              <label>Standard Shipping</label>
              <br />
              <input
                type="radio"
                id="Express Shipping"
                name="shippingOpt"
              ></input>
              <label>Express Shipping</label>
              <br />
              <br />
            </form>
            <button
              value="Confirm Delivery Method"
              className="center bottom-margin top-indent button button-small"
              onClick={handleDeliveryMethod}
            >
              Confirm Delivery Method
            </button>
          </div>
        </>
      ) : (
        <></>
      )}
      {showPayment ? (
        <>
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
            <form>
              <input
                type="checkbox"
                id="Development Payment"
                value="Development Payment"
              ></input>
              <label>Development Payment</label>
              <br />
              <br />
            </form>
            <button
              value="Confirm Payment"
              className="center bottom-margin top-indent button button-small"
              onClick={handlePayment}
            >
              Confirm Payment
            </button>
          </div>
        </>
      ) : (
        <></>
      )}
      {sameBill ? (
        <>
          <br />
          <br />
          <div>
            <h2 className="text-xl mb-4">Billing Address</h2>
          </div>
          <div>
            <form action={handleShippingAddr}>
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
              <br />
            </form>
            <button
              value="Confirm Billing Address"
              className="center bottom-margin top-indent button button-small"
              onClick={handlePayment}
            >
              Confirm Billing Address
            </button>
          </div>
        </>
      ) : (
        <></>
      )}
      {showReview ? (
        <>
          <br />
          <br />
          <div>
            <h2 className="text-xl mb-4">Review</h2>
            <p>
              By placing your order you agree to Radar's Terms and Conditions,
              Privacy Notice, and Cookie Policy.
            </p>
          </div>
          <br />
          <Link
            className="center bottom-margin top-indent button button-large"
            href="/confirmation"
          >
            Place Order
          </Link>
        </>
      ) : (
        <></>
      )}
    </Panel>
  );
}
