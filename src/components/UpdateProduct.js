import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getProductById, updateProduct } from '../api';

const UpdateProduct = ({ fetchProducts }) => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await getProductById(id);
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      id,
      name,
      price: parseFloat(price),
      image,
    };
    await updateProduct(updatedProduct);
    fetchProducts(); // Fetch the updated list of products
    navigate('/'); // Navigate back to the home page
  };

  return (
    <div className="update-product">
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Product</button>
      </form>
      <Link to="/">
        <button>Cancel</button>
      </Link>
    </div>
  );
};

export default UpdateProduct;