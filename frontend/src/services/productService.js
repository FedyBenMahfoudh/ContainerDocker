import axios from "axios";
const BASE_URL = "http://localhost:5000"; // Update this if your backend runs on a different port

// Fetch all products or search by term
export async function getProductList(searchTerm) {
  const url = searchTerm
    ? `${BASE_URL}/products?search=${encodeURIComponent(searchTerm)}`
    : `${BASE_URL}/products`;

  try {
    const response = await axios.get(url);
    console.log(response); // axios directly returns the data in response.data
    return response.data.products; // Return the actual data
  } catch (error) {
    throw { message: error.message, status: error.response?.status };
  }
}

// Fetch a specific product by ID
export async function getProduct(id) {
  try {
    const response = await axios.get(`${BASE_URL}/product/${id}`); // Send request to backend
    return response.data; // Return the product data
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}
// Fetch featured products
export async function getFeaturedList() {
  try {
    const response = await axios.get(`${BASE_URL}/featured_products`);
    console.log(response);
    return response.data.products;
  } catch (error) {
    throw { message: error.message, status: error.response?.status };
  }
}
