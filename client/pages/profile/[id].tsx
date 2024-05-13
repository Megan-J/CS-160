import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Panel from '../components/Panel';
import Modal from '../components/Modal';
import { backend } from '../components/Constants';
import {AudioPlayerControlSprite, Audio} from 'react-audio-player-pro';
import reactAudioPlayerProStyle from 'react-audio-player-pro/dist/style.css';

interface ModalStates {
    uploadTrackModal: boolean;
    secondModal: boolean;
}

export default function profile() {

    const router = useRouter();
    const the_id = parseInt(router.query.id);

    let [user, setUser] = useState({} as any);
    let [userid, setUserID] = useState(0);
    let [profile, setProfile] = useState({} as any);
    let [store, setStore] = useState({} as any);
    let [tracks, setTracks] = useState({} as any);
    let [genres, setGenres] = useState({} as any);
    let [music, setMusic] = useState({} as any);
    let [orders, setOrders] = useState({} as any);
    let [products, setProducts] = useState([]);
    let [following, setFollowing] = useState([]);
    let [followers, setFollowers] = useState([]);
    let [isFollowing, setIsFollowing] = useState(false);

    let [theStoreName, setTheStoreName] = useState("");
    let [theStoreDescription, setTheStoreDescription] = useState("");
    let [editStoreName, setEditStoreName] = useState("");
    let [editStoreDescription, setEditStoreDescription] = useState("");
    let [loaded, setLoaded] = useState(false);

    if (the_id && !loaded) {
        fetch(`${backend}/get-user/${the_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
       .then(res => {
            return res.json();
        })
       .then(data => {
            console.log("profile data: ", data);
            // profile = data.user;
            // music = data.music;
            // tracks = data.tracks;
            // store = data.store;
            // products = data.products;
            // orders = data.orders;
            // genres = data.genres;
            // following = data.following;
            // followers = data.followers;
            setProfile(data.user);
            setMusic(data.music);
            setTracks(data.tracks);
            setStore(data.store);
            setProducts(data.products);
            setOrders(data.orders);
            setGenres(data.genres);
            setFollowing(data.following);
            setFollowers(data.followers);

            // sessionStorage.setItem("profile", JSON.stringify(data.user));
            // sessionStorage.setItem("store", JSON.stringify(data.store));
            // sessionStorage.setItem("products", JSON.stringify(data.products));
            // sessionStorage.setItem("genres", JSON.stringify(data.genres));
            // sessionStorage.setItem("orders", JSON.stringify(data.orders));
            // sessionStorage.setItem("music", JSON.stringify(data.music));
            // sessionStorage.setItem("tracks", JSON.stringify(data.tracks));
            // sessionStorage.setItem("followers", JSON.stringify(data.followers));
            // sessionStorage.setItem("following", JSON.stringify(data.following));
            setLoaded(true);
        })
       .catch(error => {
            console.error(error);
        });
    }
    
    useEffect(() => {
        //console.log("sessionStorage:", sessionStorage);
        let userJson = sessionStorage.getItem("user");
        let profileJson = sessionStorage.getItem("profile");
        let storeJson = sessionStorage.getItem("store");
        let tracksJson = sessionStorage.getItem("tracks");
        let genresJson = sessionStorage.getItem("genres");
        let musicJson = sessionStorage.getItem("music");
        let productsJson = sessionStorage.getItem("products");
        let followingJson = sessionStorage.getItem("following");
        let followersJson = sessionStorage.getItem("followers");

        let user = userJson ? JSON.parse(userJson) : null;
        console.log("user inside profile:", user);
        setUserID(user.aID);
        // user = userJson ? JSON.parse(userJson) : null;
        // profile = profileJson ? JSON.parse(profileJson) : null;
        // store = storeJson ? JSON.parse(storeJson) : null;
        // genres = genresJson ? JSON.parse(genresJson) : null;
        // tracks = tracksJson ? JSON.parse(tracksJson) : null;
        // music = musicJson ? JSON.parse(musicJson) : null;
        // products = productsJson ? JSON.parse(productsJson) : null;  
        // following = followingJson ? JSON.parse(followingJson) : null;
        // followers = followersJson ? JSON.parse(followersJson) : null;

        //setUser(user);
        console.log("user inside profile:", user);
        //setProfile(user);
        console.log("profile:");
        console.log(profile);
        console.log("genres:");
        console.log(genres);
        if (storeJson) setStore(store);
        if (store) {
            editStoreName = theStoreName = store.vchName;
            editStoreDescription = theStoreDescription = store.txtDescription;
        }
        if (tracksJson) setTracks(tracks);
        if (musicJson) setMusic(music);
        if (genresJson) setGenres(genres);
        if (productsJson) setProducts(products);
        if (followingJson) setFollowing(following);
        if (followersJson) setFollowers(followers);

        let isFollowingFlag = false;
        if (following && following.length > 0) {
            for (let i = 0; i < following.length; i++) {
                if (following[i].nFollowingID == the_id) {
                    isFollowingFlag = true;
                    break;
                }
            }
        }
        if (isFollowingFlag) {
            setIsFollowing("Unfollow");
        } else {
            setIsFollowing("Follow");
        }
    }, []);

    let firstName, lastName, userID, profilepic;
    firstName = profile.vchFirstName;
    lastName = profile.vchLastName;
    profilepic = 'http://127.0.0.1:5000/file/' + profile.vchProfilePicPath;

    let storeID, storeName, storeDescription, initStoreName, initStoreDescription;
    try {
        storeID = store.aID;
        editStoreName = theStoreName = storeName = initStoreName = store.vchName;
        editStoreDescription = theStoreDescription = storeDescription = initStoreDescription = store.txtDescription;
    } catch (e) {
        storeID = "";
        editStoreName = storeName = initStoreName = "";
        editStoreDescription = storeDescription = initStoreDescription = "";
    }

    function toggleFollow() {
        if (isFollowing == "Follow") {
            setIsFollowing("Unfollow");
            let data = {
                nUserID: userid,
                nFollowingID: the_id
            };
            console.log("follow data:", data);
            fetch(`${backend}/user/follow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
        } else {
            setIsFollowing("Follow");
            let data = {
                nUserID: userid,
                nFollowingID: the_id,
            };
            console.log("unfollow data:", data);
            fetch(`${backend}/user/unfollow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
        }
    }
    return (
<Panel title={`Profile for ${profile.vchFirstName} ${profile.vchLastName}`}>
    <div className="button button-small small-width center pointer" onClick={toggleFollow}>{isFollowing}</div>
    <div className="profile-pic"><img src={profilepic} alt="profile pic"/></div>
    { 
    store && Array.isArray(products) && products.length > 0 && 
    <><div className="box container bluebg">
        <div className="heading">My Store</div>
        <div className="indent store-name">{theStoreName || 'No Store Name'}&nbsp;</div>
        <div className="indent store-description">{theStoreDescription || 'No Store Description'}&nbsp;</div>
        <div className="box container no-shadow">
            <div className="heading subheading light-gray">My Products</div>
            <div className="all-products flex">
                    { products.map((t, i) => {
                        return (
                            <div className="product" key={t.aID || i}>
                                <div className="product-image-div" id={`product-${t.aID}`} data-key={t.aID}>
                                    { t.vchImagePath != "" ? <img className="product-image" src={`http://127.0.0.1:5000/file/${t.vchImagePath}`} /> : <img className="product-image" src="product-placeholder.png" /> }
                                </div>
                                <div className="product-name">{t.vchName || 'No Name'}&nbsp;</div>
                                <div className="product-description">{t.txtDescription || 'No Description'}&nbsp;</div>
                                <div className="product-price">Price: $ {t.fPrice ? t.fPrice.toFixed(2) : '0.00'}&nbsp;</div>
                                <div className="product-shipping">Shipping: $ {t.fShipping ? t.fShipping.toFixed(2) : '0.00'}&nbsp;</div>
                                <div className="product-inventory">Stock: {t.nInventory ? t.nInventory.toFixed(0) : '0'}&nbsp;</div>
                            </div>
                        );
                    })}
            </div>
        </div>
    </div></>
}
     <div className="box greenbg">
         <div className="heading green">My Music</div>
         { music && music.length > 0 ? music.map((t, i) => (
             <>
             <div className="track" key={t.aID}>
                 <div className="track-title">{t.vchTitle}</div>
                 <div className="track-description">{t.txtDescription}</div>
                 <div className="track-url">{t.vchAudioURL}</div>
                 <div className="track-artist">{t.vchArtist}</div>
                 <div className="audio-player-container">
                     <AudioPlayerControlSprite/>
                     <Audio
                         src={`http://127.0.0.1:5000/file/${t.vchAudioURL}`}
                         preload="auto"
                         duration={0}
                         className={`audio-player change-hue`}
                         onDidMount={console.log}
                         downloadFileName={t.vchAudioURL}
                         useRepeatButton={true}
                     />
                 </div>
             </div>
             </>
         ))
         : <div className="indent bottom-margin">No music uploaded yet.</div>
     }
     </div>
    
    {/* <div className="box">
        <div className="heading">Following</div>
    { following && following.length > 0 ? following.map((t, i) => (
            <div className="following" key={i}>
                <div className="following-name">{`${t.vchFirstName} ${t.vchLastName} (${t.vchUsername})`}</div>
                <button className="button button-small" onClick={unfollow}>Unfollow</button>
            </div>
        ))
        : <><div className="indent bottom-margin">You are not following anyone.</div></>
    }
    </div>
    <div className="box">
        <div className="heading">Followers</div>
    { followers && followers.length > 0 ? followers.map((t, i) => (
        <div className="follower" key={i}>
            <div className="follower-name">{t.vchTrackName}</div>
            <div className="track-description">{t.txtDescription}</div>
            <div className="track-url">{t.vchAudioUrl}</div>
            <button className="button button-small" onClick={unfollow}>Unfollow</button>
        </div>
    ))
    : <><div className="indent bottom-margin">Nobody is following you.</div></>
}
    </div> */}
</Panel>
    );
}
