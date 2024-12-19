const BASE_URL = "http://localhost:5000"; // Update this if your backend runs on a different port

// Fetch all products or search by term
export async function getProductList(searchTerm) {
  const url = searchTerm
    ? `${BASE_URL}/products?search=${encodeURIComponent(searchTerm)}`
    : `${BASE_URL}/products`;

  const response = await fetch(url);
  if (!response.ok) {
    throw { message: response.statusText, status: response.status };
  }
  const data = await response.json();
  return data; // Direct response from Express backend
}

// Fetch a specific product by ID
export async function getProduct(id) {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw { message: response.statusText, status: response.status };
  }
  const data = await response.json();
  return data; // Product is returned directly
}

// Fetch featured products
export async function getFeaturedList() {
  const response = await fetch(`${BASE_URL}/featured_products`);
  if (!response.ok) {
    throw { message: response.statusText, status: response.status };
  }
  const data = await response.json();
  return data; // Returns the limited product list
}
