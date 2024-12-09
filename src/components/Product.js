import React from 'react';
import { Link } from 'react-router-dom'

const Product = ({ product, addToCart }) => {
  return (
    <div className="product">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>₪{product.price.toFixed(2)}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
      <Link to={`/update-product/${product.id}`}>
        <button>Edit</button>
      </Link>
    </div>
  );
};

export default Product;