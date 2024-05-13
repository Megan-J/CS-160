import React, { useState, useEffect } from "react";
import Panel from "../components/Panel";
import { backend } from '../components/Constants';
import { useRouter } from 'next/router';

import {
    BrowserRouter,
    useParams,
    Route,
    Routes,
    Link,
    useNavigate,
    useLocation,
  } from "react-router-dom";


// interface Product {
//     id: number;
//     name: string;
//     description: string;
//     price: number;
//   }
//key={product.id}
export default function MyLittleStore() {
     const router = useRouter();
      // Fetch all stores
      
      let [user, setUser] = useState(null);
      let [bans, setBans] = useState(null);
    //   const [addingProducts, setAddingProducts] = useState(null);
     
      const { storeID } = router.query; // Access storeID from router query
  
//    const handleAddProducts = () => {
//     setAddingProducts(true);
//   };

   const AddProductToCart = (event, aID) => {
    event.preventDefault();
    let success = false;
    let data = {
        nUserID: user.aID,
        nProductID: aID,
        nStoreID: storeID,
        nQuantity: 1
    };
    console.log(data);
    fetch(`${backend}/cart/add`, {
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
        console.log("returned:");
        console.log(data);
        if (success) {
            setBans(data.bans);
            console.log("Add product to cart!");
            console.log(data);
            // setAddingProducts(false);
        }
        return data;
    });
}

      useEffect(() => {
        let userJson = sessionStorage.getItem("user");
        let productsJson = sessionStorage.getItem("products");
 
        let user = userJson ? JSON.parse(userJson) : null;
        let products = productsJson ? JSON.parse(productsJson) : null;  

        setUser(user);
        console.log("user:");
        console.log(user);
        if (user && user.vchUsername !== null) {
            // let initials = '';
            // if (user.vchUsername != null) {
            //     initials = user.vchFirstName.charAt(0) + user.vchLastName.charAt(0);
            //     initials = initials.toUpperCase();
            // }
        
            fetchBanRequests();
        }
    }, []);

    const fetchBanRequests = () => {
        // Fetch ban requests from the backend
        if (!storeID) {
            console.error("Store information is not available");
            return;
        }
        //console.log(storeID); //checks that value is set
        fetch(`${backend}/product/${storeID}`)
            .then(res => res.json())
            .then(data => {
                setBans(data);
                console.log(data);
            })
            .catch(error => console.error('Error fetching ban requests:', error));
    };

  return (
    <Panel title = "My Little Store">
      <div className="box">
        <div className="heading"> Products</div>  
            {
                bans && bans.length > 0 ? 
                        <div className="all-products flex">
                            {
                                bans.map((t, i) => (
                                  <div className="product" key={i}>
                                  <div className="product-name">{t.vchName}</div>
                                  <div className="product-description">{t.txtDescription}</div>
                                  <div className="product-price">Price: $ {`${t.fPrice.toFixed(2)}`}</div>
                                  <div className="product-shipping">Shipping: $ {`${t.fShipping.toFixed(2)}`}</div>
                                  <div className="product-inventory">Stock: {t.nInventory}</div>
                                  <button className="delete-product-button button button-small" onClick={(event) => AddProductToCart(event, t.aID)} key={t.aID}>Add Product</button>
                              </div>
                                ))
                            }
                        </div>
                : <>
                <div className="indent bottom-margin">No Items in shop</div>
                </>
            }
       </div>
        
        </Panel>
    
  );
}