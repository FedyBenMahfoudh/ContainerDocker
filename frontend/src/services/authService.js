const BASE_URL = 'http://localhost:5000'; // Backend URL

// Login Service
export async function login(authDetail) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(authDetail),
  };

  const response = await fetch(`${BASE_URL}/login`, requestOptions);
  if (!response.ok) {
    throw { message: response.statusText, status: response.status };
  }

  const data = await response.json();

  // Store token and user ID in session storage
  if (data.accessToken) {
    sessionStorage.setItem('token', data.accessToken);  // Save access token
    sessionStorage.setItem('userId', data.user.id);  // Save user ID
  }

  return data;  // Return user data and token
}

// Register Service
export async function register(authDetail) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(authDetail),
  };

  const response = await fetch(`${BASE_URL}/register`, requestOptions);
  if (!response.ok) {
    throw { message: response.statusText, status: response.status };
  }

  const data = await response.json();

  // Store token and user ID in session storage
  if (data.accessToken) {
    sessionStorage.setItem('token', data.accessToken);  // Save access token
    sessionStorage.setItem('userId', data.user.id);  // Save user ID
  }

  return data;  // Return user data and token
}

// Logout Service
export function logout() {
  // Remove token and user ID from session storage
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('userId');
}
