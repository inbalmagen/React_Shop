import React, { useState, useEffect } from 'react';
import './App.css';
import { getAllProducts } from './api';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const products = await getAllProducts();
      setProducts(products);
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = product => {
    setCart([...cart, product]);
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(product => product.id !== productId));
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to my React Shop</h1>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />        
        <div className="products">
          {filteredProducts.map(product => (
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
          {cart.map(product => (
            <div key={product.id} className="cart-item">
              <img src={product.image} alt={product.name} />
              <h2>{product.name}</h2>
              <p>${product.price.toFixed(2)}</p>
              <button onClick={() => removeFromCart(product.id)}>Remove</button>
            </div>
          ))}
        </div>
      </footer>

    </div>
  );
}

export default App;