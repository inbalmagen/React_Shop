import axios from 'axios';

export async function getAllProducts() {
  const response = await axios.get('http://localhost:5000/products');
  return response.data;
}