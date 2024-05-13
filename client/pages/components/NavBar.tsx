// NavBar.tsx

import React from 'react';
import { useRouter } from "next/router";
import { useState, useEffect } from 'react';
import Link from 'next/link';

type NavBarProps = {
    children: React.ReactNode;
    initials?: string;
};

const NavBar = ({ children }: NavBarProps) => {
    let router = useRouter();
    let [me, setMe] = useState(null);
    let [initials, setInitials] = useState(null);

    useEffect(() => {
        let userJson = sessionStorage.getItem("user");
        let user = userJson ? JSON.parse(userJson) : null;
        // write user to console as JSON
        console.log("nav user", user);
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

    const searchChanged = (event) => {
        let search = event.target.value;
        let key = event.key;
        if (key === "Enter") {
            console.log("search", search);
            router.push(`/search/${search}`);
        }
    };

    return (
        <nav className="main">
            <ul>
                <li><Link href="/">Home</Link></li>
                {
                  me ?
                       <><li><Link href="/stores">Stores</Link></li>
                         <li><Link href="/profile/11">Profile</Link></li>
                         <li><Link href="/logout">Logout</Link></li>
                       </>
                     : <>
                          <li><Link href="/signup">Sign Up</Link></li>
                          <li><Link href="/login">Login</Link></li>
                       </>
                }
                {
                 initials ?
                     <li className="right"><Link href="/user"><div className="initials">{initials}</div></Link></li>
                   : ""
                }
                <li className="right"><input id="search" className="search" type="text" placeholder="Search" onKeyUp={searchChanged} /></li>
                <li className="right"><Link href="/checkout">Checkout</Link></li>
            </ul>
        </nav>
    );
};

export default NavBar;