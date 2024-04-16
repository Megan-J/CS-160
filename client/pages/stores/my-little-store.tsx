import React, { useState, useEffect } from "react";
import Panel from "../components/Panel";
import { backend } from '../components/Constants';


// interface Product {
//     id: number;
//     name: string;
//     description: string;
//     price: number;
//   }
//key={product.id}
export default function MyLittleStore() {
      // Fetch all stores
      const [products, setProducts] = useState([]);


  
      const fetchBanRequests = (user: any) => {
        // Fetch ban requests from the backend
        fetch(`${backend}/store/${user}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                console.log(data);
            })
            .catch(error => console.error('Error fetching ban requests:', error));
    };

  return (
    <Panel title = "Store">
            <div className="title">
                <h2 className="text-xl mb-4">My Little Cafe</h2>
                <p> Buy all our products below!</p>
            <div>
            <div className="all-products flex">
                {products.map((product) => (
                    <div className="body_item">
                     <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>Price: {product.price}</p>
                    <button className="create-store-button">Add to Cart</button>
                    </div>
                ))}
            </div>
          </div>
        </div>
        </Panel>
    
  );
}