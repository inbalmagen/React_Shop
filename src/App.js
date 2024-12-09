import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import "./App.css";
import { getAllProducts } from "./api";
import AddProduct from "./components/AddProduct"; // Updated path
import Product from "./components/Product"; // Updated path
import UpdateProduct from "./components/UpdateProduct"; // Import the UpdateProduct component


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
    const response = await fetch(`http://localhost:5000/cart/${productId}`);
    const product = await response.json();
  
    if (product.quantity > 1) {
      product.quantity -= 1;
      await fetch(`http://localhost:5000/cart/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
    } else {
      await fetch(`http://localhost:5000/cart/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    await fetchCart();
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to my React Shop</h1>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Link to="/add-product">
            <button>Add New Product</button>
          </Link>
        </header>
        <Routes>
        <Route path="/add-product" element={<AddProduct fetchProducts={fetchProducts} />} />
        <Route path="/update-product/:id" element={<UpdateProduct fetchProducts={fetchProducts} />} />
        <Route path="/" element={
            <>
              <div className="products">
                {filteredProducts.map((product) => (
                  <Product key={product.id} product={product} addToCart={addToCart} />
                ))}
              </div>
              <footer className="App-footer">
                <h2>Shopping Cart</h2>
                <div className="cart">
                  {cart.map((product) => (
                    <div key={product.id} className="cart-item">
                      <img src={product.image} alt={product.name} />
                      <h2>{product.name}</h2>
                      <p>Quantity: {product.quantity}</p>
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
                <div className="total-price">
                  <h3>Total Price: ₪{calculateTotalPrice().toFixed(2)}</h3>
                </div>
              </footer>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;