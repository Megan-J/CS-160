import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Panel from "./components/Panel";
import { backend } from './components/Constants';


// interface Product {
//     id: number;
//     name: string;
//     description: string;
//     price: number;
//   }
//key={product.id}
export default function Cart() {
    const [products, setProducts] = useState([]);
    let [bans, setBans] = useState(null);
    let [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
      let userJson = sessionStorage.getItem("user");
      let productsJson = sessionStorage.getItem("products");

      let user = userJson ? JSON.parse(userJson) : null;
      let products = productsJson ? JSON.parse(productsJson) : null;  

      setUser(user);
      console.log("user:");
      console.log(user);
      if (user && user.vchUsername !== null) {
          let initials = '';
          if (user.vchUsername != null) {
              initials = user.vchFirstName.charAt(0) + user.vchLastName.charAt(0);
              initials = initials.toUpperCase();
          }
          
          fetchBanRequests();
      }
  }, []);

  const fetchBanRequests = () => {

    // Fetch ban requests from the backend
    fetch(`${backend}/cart/1`)
        .then(res => res.json())
        .then(data => {
            setBans(data);
            console.log(data);
        })
        .catch(error => console.error('Error fetching ban requests:', error));
    };

    const handleProceedToCheckout = () => {
        // Redirect to the "/checkout" page when the button is clicked
     router.push('/checkout');
    };

    function deleteItem(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, aID: any): void {
        throw new Error("Function not implemented.");
    }

//<div className="product-price">Price: $ {`${t.fPrice.toFixed(2)}`}</div>
//<div className="product-shipping">Shipping: $ {`${t.fShipping.toFixed(2)}`}</div>
                                  
  return (
    <Panel title = "Store">
      <div className="box">
        <div className="heading"> Cart</div>  
            {
                bans && bans.length > 0 ? 
                        <div className="all-products flex">
                            {
                                bans.map((t, i) => (
                                  <div className="product" key={i}>
                                  <div className="product-name">Store: {t.store_name}</div>
                                  <div className="product-description">Product: {t.product_name}</div>
                                   <div className="product-inventory">Quantity: {t.quantity}</div>
                                  <button className="delete-product-button button button-small" onClick={(event) => deleteItem(event, t.aID)} key={t.aID}>Delete Product</button>
                              </div>
                                ))
                            }
                        </div>
                : <>
                <div className="indent bottom-margin">No Items in Cart</div>
                </>
            }
       </div>
       <div>
        <button className="delete-product-button button button-small" onClick={handleProceedToCheckout}> Proceed to Checkout</button>
       </div>
        
        </Panel>
    
  );
}