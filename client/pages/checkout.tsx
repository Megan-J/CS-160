import React, { useState, useEffect } from "react";

interface Inputs {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <nav className="main">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/stores">Stores</a>
            </li>
            <li>
              <a href="/upload">Upload Music</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
            <li>
              <a href="/signup">Signup</a>
            </li>
            <li>
              <a href="/placeOrder">Checkout</a>
            </li>
          </ul>
        </nav>
        <h1 className="text-2xl font-semibold mb-4"></h1>
        <div>
          <div>
            <h2 className="text-xl mb-4">Order</h2>
            <div>
              <form className="contact">
                <a className="font-semibold">Contact</a>
                <br />
                <label>
                  <input type="text" placeholder="Email" name="email" />
                  <br />
                  <br />
                </label>
                <a className="font-semibold">Shipping Address</a>
                <br />
                <label>
                  Country/Region
                  <select>
                    <option value={"United States"}>United States</option>
                  </select>
                </label>
                <br />
                <label>
                  <input type="text" placeholder="Email" name="email" />
                </label>
                <p>
                  <label>
                    <input
                      type="text"
                      placeholder="First Name"
                      name="firstName"
                    />
                  </label>

                  <label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      name="lastName"
                    />
                  </label>
                </p>
                <p>
                  <label>
                    <input type="text" placeholder="Address" name="address" />
                  </label>
                </p>
                <p>
                  <label>
                    <input type="text" placeholder="City" name="city" />
                  </label>
                  <label>
                    <input type="text" placeholder="State" name="state" />
                  </label>
                  <label>
                    <input type="text" placeholder="ZIP Code" name="zip" />
                  </label>
                </p>
                <p>
                  <label>
                    <input
                      type="text"
                      placeholder="Phone Number"
                      name="phoneNumber"
                    />
                  </label>
                </p>
                <br />
                <br />
                <a className="font-semibold">Payment</a>
                <br />
                <p>
                  <label>
                    <input
                      type="text"
                      placeholder="Card Number"
                      name="cardNumber"
                    />
                  </label>
                </p>
                <p>
                  <label>
                    <input
                      type="text"
                      placeholder="Name on Card"
                      name="nameOnCard"
                    />
                  </label>
                </p>
                <p>
                  <label>
                    <input
                      type="text"
                      placeholder="Expiration date (MM/YY)"
                      name="expirationDate"
                    />
                  </label>
                  <label>
                    <input
                      type="text"
                      placeholder="Security Code"
                      name="securityCode"
                    />
                  </label>
                </p>
                <br />
                <br />
                <a className="font-semibold">Billing Address</a>
                <br />
                <label>
                  Country/Region
                  <select>
                    <option value={"United States"}>United States</option>
                  </select>
                </label>
                <br />
                <label>
                  <input type="text" placeholder="Email" name="email" />
                </label>
                <p>
                  <label>
                    <input
                      type="text"
                      placeholder="First Name"
                      name="firstName"
                    />
                  </label>

                  <label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      name="lastName"
                    />
                  </label>
                </p>
                <p>
                  <label>
                    <input type="text" placeholder="Address" name="address" />
                  </label>
                </p>
                <p>
                  <label>
                    <input type="text" placeholder="City" name="city" />
                  </label>
                  <label>
                    <input type="text" placeholder="State" name="state" />
                  </label>
                  <label>
                    <input type="text" placeholder="ZIP Code" name="zip" />
                  </label>
                </p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
