import React, { useState, useEffect } from "react";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
  }
//key={product.id}
export default function HardRockCafe() {
      // Fetch all stores
      const [products, setProducts] = useState<Product[]>([]);

      useEffect(() => {
          const fetchProducts = async () => {
              try {
                  const response = await fetch("http://127.0.0.1:8080/product/2");
                  if (!response.ok) {
                      throw new Error("Failed to fetch products.");
                  }
                  const productsData = await response.json();
                  setProducts(productsData);
              } catch (error) {
                  console.error(error);
              }
          };
          fetchProducts();
      }, []);
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <nav className="main">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/stores">Stores</a>
            </li>
            <li>
              <a href="/upload">Upload Music</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
            <li>
              <a href="/signup">Signup</a>
            </li>
          </ul>
        </nav>
        <nav className="main">
            <ul>
                <li>
                    <a href="/">Store Home</a>
                </li>
                <li>
                    <a href="/cart">View Cart</a>
                </li>
            </ul>
        </nav>
            <div className="title">
                <h2 className="text-xl mb-4">Hard Rock Cafe</h2>
                <p> Buy all our products below!</p>
            <div>
            <div className="body">
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
      </div>
    </div>
  );
}
