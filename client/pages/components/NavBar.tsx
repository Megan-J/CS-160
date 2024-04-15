// NavBar.tsx

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";

type NavBarProps = {
  children: React.ReactNode;
  initials?: string;
};

const NavBar = ({ children }: NavBarProps) => {
  let [me, setMe] = useState(null);
  let [initials, setInitials] = useState(null);

  useEffect(() => {
    let userObj = sessionStorage.getItem("user");
    let user = userObj ? JSON.parse(userObj) : null;
    // write user to console as JSON
    console.log(user);
    if (user && user.vchFirstName !== null) {
      let s = null;
      if (user.vchUsername != null) {
        s = user.vchFirstName.charAt(0) + user.vchLastName.charAt(0);
        s = s.toUpperCase();
      }
      setInitials(s);
      setMe(user);
    }
  }, []);
  return (
    <nav className="main">
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        {me ? (
          <>
            <li>
              <Link href="/stores">Stores</Link>
            </li>
            <li>
              <Link href="/logout">Logout</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/signup">Sign Up</Link>
            </li>
            <li>
              <Link href="/login">Login</Link>
            </li>
          </>
        )}
        {initials ? (
          <li className="right">
            <div className="initials">{initials}</div>
          </li>
        ) : (
          ""
        )}
        <li className="right">
          <input className="search" type="text" placeholder="Search" />
        </li>
        <li className="right">
          <Link href="/checkout">Checkout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
