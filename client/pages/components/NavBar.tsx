// NavBar.tsx

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import SearchStores from "./searchStores";

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
          <Link href="/ted">Home</Link>
        </li>
        <li>
          <Link href="/stores">Stores</Link>
        </li>
        <li>
          <input className="search" type="text" placeholder="Search" />
        </li>
        <li>
          <Link href="/cart">Cart</Link>
        </li>
        {me ? (
          <>
            <li>
              <Link href="/logout">Logout</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login">Sign In</Link>
            </li>
            <li>
              <Link href="/signup">Create account</Link>
            </li>
          </>
        )}
        {initials ? (
          <li className="right">
            <Link className="initials" href="/user">
              {initials}
            </Link>
          </li>
        ) : (
          ""
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
