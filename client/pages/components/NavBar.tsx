// NavBar.tsx

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import SearchStores from "./searchStores";
import "bootstrap-icons/font/bootstrap-icons.css";

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
        <li>
          <Link href="/stores">Stores</Link>
        </li>

        {me ? (
          <>
            <li className="right">
              <Link href="/cart">
                Cart
                <i class="bi bi-cart3"></i>
              </Link>
            </li>
            <li className="right">
              <Link href="/logout">Logout</Link>
            </li>
          </>
        ) : (
          <>
            <li className="right">
              <Link href="/signup">Create account</Link>
            </li>
            <li className="right">
              <Link href="/login">Sign In</Link>
            </li>
          </>
        )}
        {initials ? (
          <>
            <li>
              <Link href="/owner">My store</Link>
            </li>
            <li className="right">
              <Link className="initials" href="/profile">
                {initials}
              </Link>
            </li>
          </>
        ) : (
          ""
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
