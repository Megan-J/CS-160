import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Panel from '../components/Panel';
import { backend } from '../components/Constants';


export default function Query() {
    const router = useRouter();

    let [users, setUsers] = useState(null);
    let [tracks, setTracks] = useState(null);
    let [stores, setStores] = useState(null);
    let [products, setProducts] = useState(null);
    let [search_string, setSearchString] = useState(router.query.q);
    
    useEffect(() => {
        fetch(`${backend}/search/${search_string}`)
        .then((res) => {
            console.log(res);
            return res.json();
        })
        .then((data) => {
            setUsers(data.users);
            setTracks(data.tracks);
            setStores(data.stores);
            setProducts(data.products);
            console.log("returned:");
            console.log(data);
            return data;
        });
    }, []);

    return (
        <Panel title="Search Results">
            <p>Search results for: {search_string}</p>
            <div>Users</div>
            { users && users.map((user) => {
                return (
                    <div><Link href={`/profile/${user.aID}`}>{user.vchFirstName} {user.vchLastName}</Link></div>
                );
            })}
            <div>Tracks</div>
            { tracks && tracks.map((track) => {
                return (
                    <div><Link href={`/profile/${track.nArtistID}`}>{track.vchTrackName}</Link></div>
                );
            })}
            <div>Stores</div>
            { stores && stores.map((store) => {
                return (
                    <div><Link href={`/profile/${store.nUserID}`}>{store.vchStoreName}</Link></div>
                );
            })}
            <div>Products</div>
            { products && products.map((product) => {
                return (
                    <div>{product.vchProductName}</div>
                );
            })}
        </Panel>
    );
}

