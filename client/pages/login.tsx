import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

interface Credentials {
  username?: string;
  password?: string;
}

export default function Login() {
  const [inputs, setInputs] = useState<Credentials>({});

  const existingUsers: Credentials = {
    username: "user1",
    password: "password",
  };

  const handleChange = (event: { target: { name: string; value: string } }) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log(inputs);

    const inputUsername = inputs.username;
    const inputPassword = inputs.password;

    const usernameInDatabase =
      Object.values(existingUsers).includes(inputUsername);
    const passwordInDatabase =
      Object.values(existingUsers).includes(inputPassword);

    // if both exist, then redirect them to the home page
    if (usernameInDatabase && passwordInDatabase) {
      console.log("logged in");
      const toHome = true;
    } else {
      console.log("User doesn't exist");
    }
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
              <a href="/checkout">Checkout</a>
            </li>
          </ul>
        </nav>
        <br />
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <div>
          <div>
            <form>
              <p>
                <label>
                  Username
                  <input
                    type="text"
                    name="username"
                    value={inputs.username || ""}
                    onChange={handleChange}
                  />
                </label>
              </p>
              <p>
                <label>
                  Password
                  <input
                    type="text"
                    name="password"
                    value={inputs.password || ""}
                    onChange={handleChange}
                  />
                </label>
              </p>
              <br />
              <button onClick={handleSubmit}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
