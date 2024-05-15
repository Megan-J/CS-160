import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from 'next/link';
import Panel from './components/Panel';
import Modal from './components/Modal';
import { backend } from './components/Constants';
import Uppy from '@uppy/core';
import Form from '@uppy/form';
import { DragDrop } from '@uppy/react';
import XHRUpload from '@uppy/xhr-upload';
import {AudioPlayerControlSprite, Audio} from 'react-audio-player-pro';
import reactAudioPlayerProStyle from 'react-audio-player-pro/dist/style.css';
import '@uppy/core/dist/style.css';
//import '@uppy/drag-drop/dist/style.css';

interface ModalStates {
    uploadTrackModal: boolean;
    secondModal: boolean;
}

export default function index() {
    const router = useRouter();
    const [uppy, setUppy] = useState(null);
    const [modalStates, setModalStates] = useState({
        uploadTrackModal: false,
        secondModal: false,
    });
    const toggleModal = (modalKey: keyof ModalStates): void => {
        setModalStates({ ...modalStates, [modalKey]: !modalStates[modalKey] });
    }
    let [user, setUser] = useState({} as any);
    let [store, setStore] = useState({} as any);
    let [tracks, setTracks] = useState({} as any);
    let [genres, setGenres] = useState({} as any);
    let [music, setMusic] = useState({} as any);
    let [orders, setOrders] = useState({} as any);
    let [products, setProducts] = useState([]);
    let [following, setFollowing] = useState([]);
    let [followers, setFollowers] = useState([]);
    let [orderItem1, setOrderItem1] = useState(true);
    let [orderItem2, setOrderItem2] = useState(true);
    let [orderItem3, setOrderItem3] = useState(true);

    let [creatingStore, setCreatingStore] = useState(null);
    let [addingProduct, setAddingProduct] = useState(null);

    let [theStoreName, setTheStoreName] = useState("");
    let [theStoreDescription, setTheStoreDescription] = useState("");
    let [createStoreName, setCreateStoreName] = useState("");
    let [createStoreDescription, setCreateStoreDescription] = useState("");
    let [editStoreName, setEditStoreName] = useState("");
    let [editStoreDescription, setEditStoreDescription] = useState("");
    let [isEditingStoreName, setIsEditingStoreName] = useState(false);
    let [isEditingStoreDescription, setIsEditingStoreDescription] = useState(false);

    let [newProductName, setNewProductName] = useState("");
    let [newProductDescription, setNewProductDescription] = useState("");
    let [newProductPrice, setNewProductPrice] = useState("");
    let [newProductShipping, setNewProductShipping] = useState("");
    let [newProductInventory, setNewProductInventory] = useState("");
    let [isEditingProductName, setIsEditingProductName] = useState(false);
    let [isEditingProductDescription, setIsEditingProductDescription] = useState(false);
    let [isEditingProductPrice, setIsEditingProductPrice] = useState(false);
    let [isEditingProductShipping, setIsEditingProductShipping] = useState(false);
    let [isEditingProductInventory, setIsEditingProductInventory] = useState(false);
    let [isEditingProductID, setIsEditingProductID] = useState(0);

    const handleChangeCreateStoreName = (event) => {
        setCreateStoreName(event.target.value);
    };

    const handleChangeCreateStoreDescription = (event) => {
        setCreateStoreDescription(event.target.value);
    };

    const handleStorePress = () => {
        setCreatingStore(true);
    }

    const handleAddProduct = () => {
        setAddingProduct(true);
    }

    const cancelAddProduct = () => {
        setAddingProduct(false);
    }

    const createStore = (e) => {
        e.preventDefault();
        let success = false;
        fetch(`${backend}/store/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nUserID: user.aID,
                vchName: createStoreName, 
                txtDescription: createStoreDescription
            }),
        })
        .then(res => {
            console.log(res);
            if (res.status === 200 || res.status === 201) {
                success = true;
            }
            return res.json();
        })
        .then(data => {
            console.log("returned3:");
            console.log(data);
            if (success) {
                sessionStorage.setItem("store", JSON.stringify(data));
                setCreatingStore(false);
                setEditStoreName(data.vchName);
                setEditStoreDescription(data.txtDescription);
                setStore(data);
            }
            return data;
        });
    }

    const handleSubmitProduct = (e) => {
        e.preventDefault();
        let success = false;
        let data = {
            'nUserID': user.aID,
            'nStoreID': store.aID,
            'vchName': newProductName,
            'txtDescription': newProductDescription,
            'fPrice': newProductPrice,
            'fShipping': newProductShipping,
            'nInventory': newProductInventory,
            'vchPrice': newProductPrice,
            'vchImagePath': '',
        };
        fetch(`${backend}/product/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(res => {
            console.log(res);
            if (res.status === 200 || res.status === 201) {
                success = true;
                // clear the form
                setNewProductName("");
                setNewProductDescription("");
                setNewProductPrice("");
                setNewProductShipping("");
                setNewProductInventory("");
            }
            return res.json();
        })
        .then(data => { 
            console.log("returned4:");
            console.log(data);
            if (success) {
                setProducts(data.products);
                console.log("products updated");
                console.log(data);
                setAddingProduct(false);
            }
            return data;
            })
    }

    const cancelCreateStore = () => {
        setCreatingStore(false);
    }

    const deleteTrack = () => {
        console.log("delete track " + 1);
    }

    const unfollow = () => {
        console.log("unfollow " + 1);
    }

    const deleteProduct = (event, aID) => {
        console.log("delete product " + 1);
        event.preventDefault();
        let success = false;
        let data = {
            'aID': aID,
            'nUserID': user.aID,
            'nStoreID': store.aID,
        };
        console.log("sending to delete:");
        console.log(data);
        fetch(`${backend}/product/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(res => {
            console.log(res);
            if (res.status === 200 || res.status === 201) {
                success = true;
            }
            return res.json();
        })
        .then(data => {
            console.log("returned5:");
            console.log(data);
            if (success) {
                setProducts(data.products);
                console.log("products updated");
                console.log(data);
            }
            return data;
        });
    }

    const updateStoreEdit = (e, field) => {
        console.log("update store edit");
        console.log("target value: " + e.target.value);
        console.log("store name:" + theStoreName);
        let success = false;
        let result = {
            'aID': store.aID,
            'nUserID': user.aID,
            'vchName': editStoreName,
            'txtDescription': editStoreDescription,
        };
        result[field] = e.target.value;
        console.log('result')
        console.log(result);
        fetch(`${backend}/store/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(result),
        })
        .then(res => {
            console.log(res);
            if (res.status === 200 || res.status === 201) {
                success = true;
            }
            return res.json();
        })
        .then(data => {
            console.log("returned6:");
            console.log(data);
            if (success) {
                sessionStorage.setItem("store", JSON.stringify(data));
                setStore(data);
                setEditStoreName(data.vchName);
                setEditStoreDescription(data.txtDescription);
                console.log("store updated");
                console.log(data);
            }
            return data;
        });
    }

    const updateProductEdit = (e, id, field) => {
        console.log("update product edit: "+ id + ", " + field);
        console.log("target value: " + e.target.value);
        let success = false;
        console.log(products)
        let p = products[id] as any;
        let result = {
            'aID': p.aID,
            'nStoreID': store.aID,
            'vchName': p.vchName,
            'txtDescription': p.txtDescription,
            'fPrice': p.fPrice,
            'fShipping': p.fShipping,
            'nInventory': p.nInventory,
            'vchImagePath': '',
        };
        result[field] = e.target.value;
        console.log('sending:')
        console.log(result);
        fetch(`${backend}/product/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(result),
        })
        .then(res => {
            console.log(res);
            if (res.status === 200 || res.status === 201) {
                success = true;
            }
            return res.json();
        })
        .then(data => {
            console.log("returned1:");
            console.log(data);
            if (success) {
//                sessionStorage.setItem("products", JSON.stringify(data));
                setProducts(data);
                console.log("product updated");
                console.log(data);
            }
            return data;
        });
    }

    let product_key;

    function uploadProductImage(event: FormEvent<HTMLInputElement>) {
        //const fileInput = event.target;
        const filename = fileInput.current.files[0].name;
        const formData = new FormData();
        formData.append('aID', product_key);
        formData.append('nStoreID', store.aID);
        formData.append('vchFilename', filename);
        formData.append('file', fileInput.current.files[0]);
        fetch(`${backend}/product/image/upload`, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setProducts(data.products);
        })
        .catch((error) => console.error('Error:', error));
    };

    const fileInput = useRef(null);

    useEffect(() => {
        function getUppy() {
            return new Uppy({
                target: '#upload-music-form',
                restrictions: {
                    'maxFileSize': 8000000,
                    'maxNumberOfFiles': 1,
                    allowedFileTypes: [
                        'audio/mpeg', // MP3
                        'audio/wav', 'audio/x-wav', // WAV
                        'audio/aac', // AAC
                        'audio/ogg', 'application/ogg', // OGG
                        'audio/flac', // FLAC
                        'audio/aiff', 'audio/x-aiff', // AIFF
                        'audio/x-ms-wma', // WMA
                        'audio/mp4', 'audio/x-m4a', // M4A
                        'audio/opus', // Opus
                        'audio/webm' // WebM audio
                    ]            
                },
                autoProceed: false,
            });
        }

        let uppyInstance = getUppy();
        setUppy(uppyInstance);

        uppyInstance.use(XHRUpload, {
            endpoint: `${backend}/track/upload`, 
            fieldName: 'files', // Field name to use for uploaded files
            formData: true,
            headers: {},
          });

        uppyInstance.on('file-added', (file) => {
            console.log('File added:', file);
        });

        uppyInstance.on('upload-success', (file, result) => {
            console.log('upload success');
            console.log(uppyInstance);
            console.log('form');
            let form = document.querySelector(uppyInstance.opts.target);
            console.log(form);
            console.log(document.querySelector('#upload-music-form'));
            console.log('file', file);
            console.log('result', result);
            let title = (form.querySelector('.track-title') as HTMLInputElement);
            console.log('title', title);
            console.log('title value', title.value);
            let description = (form.querySelector('.track-description') as HTMLInputElement);
            console.log('description', description);
            console.log('description value', description.value);
            let genre = (form.querySelector('.track-genre') as HTMLSelectElement);
            console.log('genre', genre);
            console.log('genre value', genre.value);
            let user_id = user.aID;
            console.log('user_id', user_id);
            let data = {
                'nUserID': user_id,
                'nArtistID': user_id,
                'vchTitle': title.value,
                'txtDescription': description.value,
                'nGenreID': parseInt(genre.value),
                'vchAudioURL': result.body.filename,
            };
            console.log('data', data);
            fetch(`${backend}/track/upload/link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }).then((res) => {
                console.log('did track-upload-link', res);
                setMusic(res['music']);
                music = JSON.parse(res['music']);
                console.log("res", res);
                uppyInstance.close();
                uppyInstance = getUppy();
                setUppy(uppyInstance);
                toggleModal('uploadTrackModal');
            });
        });
       
        uppyInstance.on('error', (error) => {
            console.error('Error:', error);
        });
        
        let uploadProductImage = (event) => {
            const fileInput = event.target;
            const id = fileInput.getAttribute('key');
            const filename = fileInput.files[0].name;
            fetch(`${backend}/product/upload/image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'nProductID': id,
                    'nStoreID': store.aID,
                    aId: user.aID,
                    'vchFilename': filename,
                }),
            }).then(res => {
                console.log('did upload-product-image');
                console.log(res);
                setProducts(res['products']);
            });
        };

        let userJson = sessionStorage.getItem("user");
        let storeJson = sessionStorage.getItem("store");
        let tracksJson = sessionStorage.getItem("tracks");
        let genresJson = sessionStorage.getItem("genres");
        let musicJson = sessionStorage.getItem("music");
        let productsJson = sessionStorage.getItem("products");
        let followingJson = sessionStorage.getItem("following");
        let followersJson = sessionStorage.getItem("followers");

        let user = userJson ? JSON.parse(userJson) : null;
        let store = storeJson ? JSON.parse(storeJson) : null;
        let genres = genresJson ? JSON.parse(genresJson) : null;
        let tracks = tracksJson ? JSON.parse(tracksJson) : null;
        let music = musicJson ? JSON.parse(musicJson) : null;
        let products = productsJson ? JSON.parse(productsJson) : null;  
        let following = followingJson ? JSON.parse(followingJson) : null;
        let followers = followersJson ? JSON.parse(followersJson) : null;

        setUser(user);
        console.log("user:");
        console.log(user);
        console.log("genres:");
        console.log(genres);
        let id;
        if (user && user.vchUsername !== null) {
            let initials = '';
            id = user.aID;
            if (user.vchUsername != null) {
                initials = user.vchFirstName.charAt(0) + user.vchLastName.charAt(0);
                initials = initials.toUpperCase();
            }
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
        }
        if (id) {
            fetch(`${backend}/get-user/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
           .then(res => {
                if (res.ok) {
                    // todo: we should get back a single object
                    // due to limitations we'll grab it from an array
                    const data = res.json();
                    return data;
                } else {
                    throw new Error('Failed to load user');
                }
            })
           .then(data => {
                setUser(data.user);
                setMusic(data.music);
                setTracks(data.tracks);
                setStore(data.store);
                setProducts(data.products);
                setOrders(data.orders);
                setGenres(data.genres);
                setFollowing(data.following);
                setFollowers(data.followers);
                console.log("user data: ", data)
            })
           .catch(error => {
                console.error(error);
            });
        }

    }, []);

    let firstName, lastName, userID, profilepic;
    user = user || {};
    try {
        userID = user.aID;
        firstName = user.vchFirstName;
        lastName = user.vchLastName;
        profilepic = 'http://127.0.0.1:5000/file/' + user.vchProfilePicPath;
    } catch (e) {
        userID = "";
        firstName ="";
        lastName = "";
        profilepic = "";
    }
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

    function do_upload(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        uppy.upload();
    }

    function handleImageClick(event: MouseEvent): void {
        event.preventDefault();
        console.log('image clicked', event.target);
        console.log('parent', event.target.parentElement);
        console.log('parent id', event.target.parentElement.id);
        let id = event.target.parentElement.id;
        console.log('id', id);
        let key = event.target.parentElement.getAttribute('data-key');
        product_key = key;
        console.log('key', key);
        //let fileInput = document.querySelector(`input[name=file-${id}`);
        console.log('fileInput', fileInput);
        fileInput.current.click();
    }

    function productFileChange(event: FormEvent<HTMLInputElement>): void {
        event.preventDefault();
        console.log('product file change', event.target);
        console.log('product key', product_key);
        uploadProductImage(event);
    }

    return (
<Panel title="My Radar">
    <p>Welcome{firstName && `, ${firstName} ${lastName}`}!</p>
    <div className="profile-pic"><img src="placeholder1.png"></img></div>
    <div className="profile-pic"><img src={profilepic} alt="profile pic"/></div>
    <Modal isOpen={modalStates.uploadTrackModal} toggleModal={() => toggleModal('uploadTrackModal')}>
        <form id="upload-music-form" className="upload-music-form" onSubmit={do_upload}>
            <input type="hidden" name="nArtistID" value="{userID}"/>
            <div className="uploadResult"></div>
            <div className="">Title: <input type="text" className="input track-title" name="vchTitle" placeholder="Title"/></div>
            <div className="">Description: <textarea className="input track-description" name="txtDescription" placeholder="Description"/></div>
            <div className="">Genre: <select name="nGenreID" className="track-genre">
                <option value="">Select a Genre</option>
                    { genres && Array.isArray(genres) && genres.map((g, i) => (
                        <option value={g.aID} key={g.aID}>{g.vchName}</option>
                    ))} 
                </select>
            </div>
            { uppy && 
                <div className="drag-drop">
                    <DragDrop uppy={uppy} />
                </div>
            }
            <button type="submit" className="button medium-width button-small">Upload</button>
        </form>
    </Modal>
    <div className="box container bluebg">
        <div className="heading">My Store</div>
    { store && storeName != null ?
        <><div className="indent store-name" onDoubleClick={() => setIsEditingStoreName(true)}>
        { isEditingStoreName ? 
            <input className="indent input"
                name="vchName"
                defaultValue={editStoreName}
                type="text"
                placeholder="Store Name"
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        updateStoreEdit(e, 'vchName');
                        setIsEditingStoreName(false);
                    } else if (e.key === 'Escape') {
                        setIsEditingStoreName(false);
                    }
                }}
            />
            : <>{theStoreName}&nbsp;</>
        }
        </div>
        <div className="indent store-description" onDoubleClick={() => setIsEditingStoreDescription(true)}>
        { isEditingStoreDescription ? 
            <input className="indent input"
                name="vchDescription"
                defaultValue={editStoreDescription}
                type="text"
                placeholder="Store Description"
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        updateStoreEdit(e, 'txtDescription');
                        setIsEditingStoreDescription(false);
                    } else if (e.key === 'Escape') {
                        setIsEditingStoreDescription(false);
                    }
                }}
            />
            : <>{theStoreDescription}&nbsp;</>
        }
        </div></>
    : creatingStore ?
        <><div className="create-store">
            <form onSubmit={createStore}>
                <input type="hidden" name="nUserID" value={userID}/>
                <input type="hidden" name="aID" value={storeID}/>
                <input className="indent input" name="vchName" type="text" placeholder="Store Name" onChange={handleChangeCreateStoreName}/>
                <input className="indent input larger" name="txtDescription" type="text" placeholder="Store Description" onChange={handleChangeCreateStoreDescription}/>
                <input type="submit" className="button button-small" value="Create Store"/>
                <button className="cancel button-small indent-right" onClick={cancelCreateStore}>Cancel</button>
            </form>
        </div></>
    :   <div className="center"><button className="indent button button-small" onClick={handleStorePress}>Create Your Store</button></div>
    }
    { store && store.vchName != null ?
        <><div className="box container no-shadow">
            <div className="heading subheading light-gray">My Products</div>
            <input type="file" style={{display:'none'}} id="file-product" name="file-product" ref={fileInput} onChange={productFileChange}/>
    { products && products.length > 0 ? 
            <><div className="all-products flex">
    { products.map((t, i) => {
            return (
                <><div className="product" key={t.aID}>
                    <div className="product-image-div" id={`product-${t.aID}`} data-key={t.aID} onClick={handleImageClick}>
                    { t.vchImagePath != "" ? <img className="product-image" src={`http://127.0.0.1:5000/file/${t.vchImagePath}`} /> : <img className="product-image" src="product-placeholder.png" /> }
                     </div>
                    {/* { !image && <form><input type="file" className="upload-image button button-small small-width" key={t.aID} onClick={uploadProductImage} value="Upload Image"/></form>> } */}
                    <div className="product-name" onDoubleClick={() => {
                        setIsEditingProductID(i);
                        setIsEditingProductName(true);
                    }}>
                { isEditingProductName && isEditingProductID == i ? 
                        <input className="indent input"
                            name="vchName"
                            defaultValue={t.vchName}
                            type="text"
                            placeholder="Product Name"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    updateProductEdit(e, i, 'vchName');
                                    setIsEditingProductName(false);
                                } else if (e.key === 'Escape') {
                                    setIsEditingProductName(false);
                                }
                            }}
                        />
                    : <>{t.vchName}&nbsp;</>
                }
                </div>
                <div className="product-description" onDoubleClick={() => {
                    setIsEditingProductID(i);
                    setIsEditingProductDescription(true);
                }}>
            { isEditingProductDescription && isEditingProductID == i  ? 
                    <input className="indent input"
                        name="txtDescription"
                        defaultValue={t.txtDescription}
                        type="text"
                        placeholder="Product Description"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                updateProductEdit(e, i, 'txtDescription');
                                setIsEditingProductDescription(false);
                            } else if (e.key === 'Escape') {
                                setIsEditingProductDescription(false);
                            }
                        }}
                    />
                : <>{t.txtDescription}&nbsp;</>
            }
                </div>
                <div className="product-price" onDoubleClick={() => {
                    setIsEditingProductID(i);
                    setIsEditingProductPrice(true);
                }}>Price: $ 
            { isEditingProductPrice && isEditingProductID == i ? 
                    <input className="indent input short-input"
                        name="fPrice"
                        defaultValue={t.fPrice.toFixed(2)}
                        type="text"
                        placeholder="Price"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                updateProductEdit(e, i, 'fPrice');
                                setIsEditingProductPrice(false);
                            } else if (e.key === 'Escape') {
                                setIsEditingProductPrice(false);
                            }
                        }}
                    />
                : <>{t.fPrice.toFixed(2)}&nbsp;</>
            }
                </div>
                <div className="product-shipping" onDoubleClick={() => {
                    setIsEditingProductID(i);
                    setIsEditingProductShipping(true);
                }}>Shipping: $ 
            { isEditingProductShipping && isEditingProductID == i ? 
                    <input className="indent input short-input"
                        name="fShipping"
                        defaultValue={t.fShipping.toFixed(2)}
                        type="text"
                        placeholder="Shipping"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                updateProductEdit(e, i, 'fShipping');
                                setIsEditingProductShipping(false);
                                setIsEditingProductID(null);
                            } else if (e.key === 'Escape') {
                                setIsEditingProductShipping(false);
                                setIsEditingProductID(null);
                            }
                        }}
                    />
                : <>{t.fShipping.toFixed(2)}&nbsp;</>
            }
                </div>
                <div className="product-inventory" onDoubleClick={() => {
                    setIsEditingProductID(i);
                    setIsEditingProductInventory(true);
                }}>Stock:  
            { isEditingProductInventory ? 
                    <input className="indent input short-input"
                        name="nInventory"
                        defaultValue={t.nInventory}
                        type="text"
                        placeholder="Inventory"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                updateProductEdit(e, i, 'nInventory');
                                setIsEditingProductInventory(false);
                                setIsEditingProductID(null);
                            } else if (e.key === 'Escape') {
                                setIsEditingProductInventory(false);
                                setIsEditingProductID(null);
                            }
                        }}
                    />
                : <>{t.nInventory.toFixed(0)}&nbsp;</>
            }
                </div>
                <button className="delete-product-button button button-small" onClick={(event) => deleteProduct(event, t.aID)} key={t.aID}>Delete</button>
            </div></>)
            })
        }
    </div></>
:   <><div className="indent">No products yet.</div></>
}
{ addingProduct ? 
    <><div className="div-center">
        <div className="product-box box container new-product-container no-shadow">
            <div className="heading subheading gray">Add a Product</div>
            <form onSubmit={handleSubmitProduct}>
                <div className="new-product-pane">
                    <div>
                        <input
                            className="new-product-name input"
                            type="text"
                            name="newProductName"
                            value={newProductName}
                            onChange={(e) => setNewProductName(e.target.value)}
                            placeholder="Name"
                        />
                        <textarea
                            className="new-product-description input"
                            name="newProductDescription"
                            value={newProductDescription}
                            onChange={(e) => setNewProductDescription(e.target.value)}
                            placeholder="Description"
                        />
                        <input
                            type="number"
                            className="new-product-price input"
                            name="newProductPrice"
                            value={newProductPrice}
                            onChange={(e) => setNewProductPrice(e.target.value)}
                            placeholder="Price"
                        />
                        <input
                            type="number"
                            className="new-product-shipping input"
                            name="newProductShipping"
                            value={newProductShipping}
                            onChange={(e) => setNewProductShipping(e.target.value)}
                            placeholder="Shipping Cost"
                        />
                        <input
                            type="number"
                            className="new-product-inventory input"
                            name="newProductInventory"
                            value={newProductInventory}
                            onChange={(e) => setNewProductInventory(e.target.value)}
                            placeholder="Inventory Count"
                        />
                    </div>
                    <div className="product-submit-margin-top">
                        <button className="button button-small" type="submit">Submit</button>
                        <button className="button button-small cancel" onClick={cancelAddProduct}>Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    </div></>
:   <><div className="center"><button className="indent bottom-margin top-indent button button-small" onClick={handleAddProduct}>Add Product</button></div></>
}
    </div>
    <div className="box container no-shadow">
        <div className="heading subheading gray">My Orders</div>
        <div className="orders indent">
    { orderItem1 && orderItem2 && orderItem3 &&
            <div className="order">
                <div className="order-date header">Date</div>
                <div className="order-product-name header">Product</div>
                <div className="order-quantity header">Quantity</div>
                <div className="order-total header">Total</div>
            </div>
    }    
    { !orderItem1 && !orderItem2 && !orderItem3 &&
            <div className="indent bottom-margin">No orders yet.</div>
    }    
    { orderItem1 &&
            <div className="order">
                <div className="order-date ">4/12/24</div>
                <div className="order-product-name ">Klaatu CD</div>
                <div className="order-quantity ">3</div>
                <div className="order-total ">$32.50</div>
                <div className="cancel-order button" onClick={(e) => {
                    setOrderItem1(false);
                }}>Cancel</div>
            </div>
    }
    { orderItem2 &&
            <div className="order">
                <div className="order-date ">4/14/24</div>
                <div className="order-product-name ">Autographed photo of Tom Petty</div>
                <div className="order-quantity ">1</div>
                <div className="order-total ">$10.00</div>
                <div className="cancel-order button" onClick={(e) => {
                    setOrderItem2(false);
                }}>Cancel</div>
            </div>
    }
    { orderItem3 &&
            <div className="order">
                <div className="order-date ">4/16/24</div>
                <div className="order-product-name ">Tesla Model S</div>
                <div className="order-quantity ">1</div>
                <div className="order-total ">$122,000.00</div>
                <div className="cancel-order button" onClick={(e) => {
                    setOrderItem3(false);
                }}>Cancel</div>
            </div>
    }
    {/* {
        orders && orders.length > 0
        ? orders.map((t, i) => {
            console.log("order:");
            console.log(t);
            let order_prod_id = t.nItemID;
            let product = products.find(p => p.aID == order_prod_id);
            let order_prod_name = product ? product.vchName : "";
            console.log("order product name: " + order_prod_name);
            return (
                <div className="order" key={i}>
                    <div className="order-date">{t.insertDate}</div>
                    <div className="order-product-name">{order_prod_name}</div>
                    <div className="order-quantity">{t.nItemCount}</div>
                    <div className="order-total">${t.fGrandTotal.toFixed(2)}</div>
                </div>
            );
        }) }
        : */
        // <div className="indent bottom-margin">No orders yet.</div>
    }
        </div>
    </div></>
    : ""
    }
    </div>
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
    <div className="center"><button onClick={() => toggleModal('uploadTrackModal')} className="button button-small">Add a Track</button></div>
    </div>
    <div className="box">
        <div className="heading orange">Tracks and Playlists</div>
{ tracks && tracks.length > 0 ? tracks.map((t, i) => (
        <div className="track" key={t.aID}>
            <div className="track-title">{t.vchTitle}</div>
            <div className="track-description">{t.txtDescription}</div>
            <div className="track-url">{t.vchAudioUrl}</div>
            <button className="button button-small" onClick={deleteTrack}>Delete</button>
        </div>
    ))
    : <><div className="indent">No tracks added yet.</div></>
}
    </div>
    <div className="box">
        <div className="heading">Following</div>
    { following && following.length > 0 ? following.map((t, i) => (
            <div className="following" key={i}>
                <div className="following-name"><Link href={ `http://127.0.0.1:3000/profile/${t.aID}` }>{t.vchFirstName} {t.vchLastName} ({t.vchUsername})</Link></div>
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
    </div>
</Panel>
    );
}