import axios from "axios";
const BASE_URL = "http://localhost:5000"; // Backend URL

// Login Service
export async function login(authDetail) {
  const response = await axios.post(`${BASE_URL}/login`, authDetail);

  if (response.statusText !== "OK") {
    throw { message: response.statusText, status: response.status };
  }

  const data = await response.data;

  // Store token and user ID in session storage
  if (data.token) {
    sessionStorage.setItem("token", JSON.stringify(data.token));
    sessionStorage.setItem("cbid", data._id);
    sessionStorage.setItem("email", data.email); // Save access token
  }
  return data; // Return user data and token
}

// Register Service
export async function register(authDetail) {
  const response = await axios.post(`${BASE_URL}/register`, authDetail);

  if (!response.ok) {
    throw { message: response.statusText, status: response.status };
  }

  const data = await response.data;

  // Store token and user ID in session storage
  if (data.token) {
    sessionStorage.setItem("token", JSON.stringify(data.token));
    sessionStorage.setItem("cbid", data._id);
    sessionStorage.setItem("email", data.email); // Save access token
  }

  return data; // Return user data and token
}

// Logout Service
export function logout() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("cbid");
  sessionStorage.removeItem("email");
}
