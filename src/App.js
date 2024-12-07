import React, { useState, useEffect } from "react";
import "./App.css";
import { getAllProducts } from "./api";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  async function fetchProducts() {
    const products = await getAllProducts();
    setProducts(products);
  }
  async function fetchCart() {
    const response = await fetch("http://localhost:5000/cart");
    const cart = await response.json();
    setCart(cart);
  }
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = async (product) => {
    let existingProduct;
    const response = await fetch(`http://localhost:5000/cart/${product.id}`);
    if (response.status === 404) {
      existingProduct = null;
    } else {
      existingProduct = await response.json();
    }
    if (existingProduct) {
      // If it exists, update the quantity
      existingProduct.quantity += 1;
      await fetch(`http://localhost:5000/cart/${existingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(existingProduct),
      });
    } else {
      // If it doesn't exist, add the product with quantity 1
      product.quantity = 1;
      await fetch("http://localhost:5000/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
    }
    await fetchCart();
  };

  const removeFromCart = async (productId) => {
    await fetch(`http://localhost:5000/cart/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    await fetchCart();
    // console.log("Removing product with id:", productId);
    // const updatedCart = cart.filter((product) => product.id !== productId);
    // console.log("Updated cart:", updatedCart);
    // setCart(updatedCart);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to my React Shop</h1>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="products">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product">
              <img src={product.image} alt={product.name} />
              <h2>{product.name}</h2>
              <p>₪{product.price.toFixed(2)}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </header>
      <footer className="App-footer">
        <h2>Shopping Cart</h2>
        <div className="cart">
          {cart.map((product) => (
            <div key={product.id} className="cart-item">
              <img src={product.image} alt={product.name} />
              <h2>{product.name}</h2>
              <p>${product.price.toFixed(2)}</p>
              <button
                onClick={() => {
                  console.log("Clicked remove for product id:", product.id);
                  removeFromCart(product.id);
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default App;
