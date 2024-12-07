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