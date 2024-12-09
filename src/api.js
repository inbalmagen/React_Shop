import axios from "axios";

export async function getAllProducts() {
  const response = await axios.get("http://localhost:5000/products");
  return response.data;
}

export async function addProduct(product) {
  const response = await axios.post("http://localhost:5000/products", product, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function getProductById(id) {
  const response = await axios.get(`http://localhost:5000/products/${id}`);
  return response.data;
}

export async function updateProduct(product) {
  const response = await axios.put(`http://localhost:5000/products/${product.id}`, product, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}