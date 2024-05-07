import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Panel from "./components/Panel";
import { backend } from "./components/Constants";

export default function Signup() {
  const [formState, setFormState] = useState(null);
  let [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (event) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formState);

    let success = false;
    fetch(`${backend}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formState),
    })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          success = true;
        } else {
          setError("Username already taken. Please try another.");
        }
        console.log(res);
        return res.json();
      })
      .then((data) => {
        console.log("returned:");
        console.log(data);
        if (success) {
          sessionStorage.setItem("user", JSON.stringify(data));
          router.push("/user");
        }
        return data;
      });
  };

  return (
    <Panel title="Sign Up">
      <div>
        <div>
          <div className="flex items-center justify-center">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <label>First Name</label>
                <input type="text" name="firstName" onChange={handleChange} />
                <label>Last Name</label>
                <input type="text" name="lastName" onChange={handleChange} />
              </div>
              <div className="row">
                <label>Email</label>
                <input type="text" name="email" onChange={handleChange} />
              </div>
              <div className="row">
                <label>Username</label>
                <input type="text" name="username" onChange={handleChange} />
              </div>
              <div className="row">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                />
              </div>
              <div>
                {error ? (
                  <div className="error">{error}</div>
                ) : (
                  <div>&nbsp;</div>
                )}
              </div>
              <div className="flex items-center justify-center">
                <button className="button change-hue">Sign Up</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Panel>
  );
}
