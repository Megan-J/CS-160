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
              <a href="stores">Stores</a>
            </li>
            <li>
              <a href="upload">Upload Music</a>
            </li>
            <li>
              <a href="login">Login</a>
            </li>
            <li>
              <a href="signup">Signup</a>
            </li>
            <li>
              <a href="order">Cart</a>
            </li>
          </ul>
        </nav>
        <h1 className="text-2xl font-semibold mb-4"></h1>
        <div>
          <div>
            <h2 className="text-xl mb-4">Order</h2>

            <div>
              <form>
                <label>
                  Contact
                  <input type="text" placeholder="email" name="email" />
                </label>
                <label>
                  Shipping address
                  <input type="text" name="lastName" />
                </label>
                <label>
                  Email
                  <input type="text" name="email" />
                </label>
                <label>
                  Password
                  <input type="text" name="password" />
                </label>
                <br />
                <input type="submit" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
