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

  const [formState, setFormState] = useState(null);
  let [error, setError] = useState(null);

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

  let sameBill = true;
  let sameSelect = 0;
  let devPaymentSelect = 0;

  useEffect(() => {}, []);

  const handleChange = (event) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
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
      <Link className="button button-small cancel" href="/cart">
        Return to shopping cart
      </Link>
      <br />
      <div>
        <h2 className="text-xl mb-4">Summary</h2>
      </div>
      <div>
        <h2 className="text-xl mb-4">Shipping Address</h2>
      </div>
      <div>
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
          <br />

          <div>
            <h2 className="text-xl mb-4">Delivery</h2>
          </div>
          <input type="radio" id="Standard Shipping" name="shippingOpt"></input>
          <label>Standard Shipping</label>
          <br />
          <input type="radio" id="Express Shipping" name="shippingOpt"></input>
          <label>Express Shipping</label>
          <br />
          <br />

          <div>
            <h2 className="text-xl mb-4">Payment</h2>
          </div>
          <input
            type="checkbox"
            id="Development Payment"
            value="Development Payment"
            onChange={handleDevPayment}
          ></input>
          <label>Development Payment</label>
          <br />
          <br />
          <div>
            <h2 className="text-xl mb-4">Billing Address</h2>
          </div>
          <p>
            <label>
              <input
                type="text"
                placeholder="First Name"
                name="bilFirstName"
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
                name="bilEmail"
                onChange={handleChange}
              />
            </label>
            <label>
              <input
                type="text"
                placeholder="Phone Number"
                name="bilPhoneNumber"
                onChange={handleChange}
              />
            </label>
          </p>
          <br />
          <br />
          <div>
            <div>
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
          </div>
          <div className="flex items-center justify-center">
            <button className="button change-hue">Place Order</button>
          </div>
        </form>
      </div>
    </Panel>
  );
}
