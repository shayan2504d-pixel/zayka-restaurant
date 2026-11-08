const BASE_URL = '/api';

export async function apiRequest(endpoint, method = 'GET', data = null, customHeaders = {}) {
  const token = localStorage.getItem('zayka_token');
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `Request failed with status ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error(`API Error on [${method}] ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  get: (endpoint) => apiRequest(endpoint, 'GET'),
  post: (endpoint, data) => apiRequest(endpoint, 'POST', data),
  put: (endpoint, data) => apiRequest(endpoint, 'PUT', data),
  delete: (endpoint) => apiRequest(endpoint, 'DELETE'),
};

export default api;
