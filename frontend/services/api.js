const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {};

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(payload?.message || 'Request failed');
  }

  return payload;
}

export function registerUser(data) {
  return request('/auth/register', {
    method: 'POST',
    body: data
  });
}

export function loginUser(data) {
  return request('/auth/login-user', {
    method: 'POST',
    body: data
  });
}

export function loginAdmin(data) {
  return request('/auth/login-admin', {
    method: 'POST',
    body: data
  });
}

export function fetchCurrentUser(token) {
  return request('/auth/me', { token });
}

export function createOrder(data, token) {
  return request('/orders', {
    method: 'POST',
    body: data,
    token
  });
}

export function fetchMyOrders(token) {
  return request('/orders/my', { token });
}

export function fetchOrderByNumber(orderNumber, token) {
  return request(`/orders/track/${encodeURIComponent(orderNumber)}`, { token });
}

export function fetchAdminOrders(token, status = '') {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return request(`/orders${query}`, { token });
}

export function updateOrderStatus(orderId, data, token) {
  return request(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: data,
    token
  });
}

export function fetchFlockRecords(token) {
  return request('/flock-records', { token });
}

export function addFlockRecord(data, token) {
  return request('/flock-records', {
    method: 'POST',
    body: data,
    token
  });
}

export function submitEnquiry(data) {
  return request('/enquiries', {
    method: 'POST',
    body: data
  });
}

export function fetchAdminEnquiries(token) {
  return request('/enquiries', { token });
}

export function fetchTransactions(token, archived = false) {
  return request(`/transactions?archived=${archived}`, { token });
}

export function fetchTransactionsSummary(token, archived = false) {
  return request(`/transactions/summary?archived=${archived}`, { token });
}

export function addTransaction(data, token) {
  return request('/transactions', {
    method: 'POST',
    body: data,
    token
  });
}

export function updateTransaction(id, data, token) {
  return request(`/transactions/${id}`, {
    method: 'PUT',
    body: data,
    token
  });
}

export function deleteTransaction(id, token) {
  return request(`/transactions/${id}`, {
    method: 'DELETE',
    token
  });
}

export function archiveAllTransactions(token) {
  return request('/transactions/archive-all', {
    method: 'POST',
    token
  });
}

export function fetchAttendance(token, date) {
  const query = date ? `?date=${encodeURIComponent(date)}` : '';
  return request(`/attendance${query}`, { token });
}

export function addAttendance(data, token) {
  return request('/attendance', {
    method: 'POST',
    body: data,
    token
  });
}

export function fetchProducts() {
  return request('/products');
}

export function addProduct(data, token) {
  return request('/products', {
    method: 'POST',
    body: data,
    token
  });
}

export function updateProduct(id, data, token) {
  return request(`/products/${id}`, {
    method: 'PUT',
    body: data,
    token
  });
}

export function deleteProduct(id, token) {
  return request(`/products/${id}`, {
    method: 'DELETE',
    token
  });
}

// ==========================================
// TOOLS MANAGEMENT API
// ==========================================
export function fetchTools(token) {
  return request('/inventory/tools', { token });
}

export function addTool(data, token) {
  return request('/inventory/tools', {
    method: 'POST',
    body: data,
    token
  });
}

export function updateTool(id, data, token) {
  return request(`/inventory/tools/${id}`, {
    method: 'PUT',
    body: data,
    token
  });
}

export function deleteTool(id, token) {
  return request(`/inventory/tools/${id}`, {
    method: 'DELETE',
    token
  });
}

// ==========================================
// FEED MANAGEMENT API
// ==========================================
export function fetchFeeds(token) {
  return request('/inventory/feed', { token });
}

export function addFeed(data, token) {
  return request('/inventory/feed', {
    method: 'POST',
    body: data,
    token
  });
}

export function updateFeed(id, data, token) {
  return request(`/inventory/feed/${id}`, {
    method: 'PUT',
    body: data,
    token
  });
}

export function deleteFeed(id, token) {
  return request(`/inventory/feed/${id}`, {
    method: 'DELETE',
    token
  });
}

// ==========================================
// FARM ACCESSORIES API
// ==========================================
export function fetchAccessories(token) {
  return request('/inventory/accessories', { token });
}

export function addAccessory(data, token) {
  return request('/inventory/accessories', {
    method: 'POST',
    body: data,
    token
  });
}

export function updateAccessory(id, data, token) {
  return request(`/inventory/accessories/${id}`, {
    method: 'PUT',
    body: data,
    token
  });
}

export function deleteAccessory(id, token) {
  return request(`/inventory/accessories/${id}`, {
    method: 'DELETE',
    token
  });
}

// ==========================================
// VACCINATION SCHEDULE API
// ==========================================
export function fetchVaccinations(token) {
  return request('/health-mgmt/vaccinations', { token });
}

export function addVaccination(data, token) {
  return request('/health-mgmt/vaccinations', {
    method: 'POST',
    body: data,
    token
  });
}

export function updateVaccination(id, data, token) {
  return request(`/health-mgmt/vaccinations/${id}`, {
    method: 'PUT',
    body: data,
    token
  });
}

export function deleteVaccination(id, token) {
  return request(`/health-mgmt/vaccinations/${id}`, {
    method: 'DELETE',
    token
  });
}

// ==========================================
// DISEASE & TREATMENT RECORDS API
// ==========================================
export function fetchTreatments(token) {
  return request('/health-mgmt/treatments', { token });
}

export function addTreatment(data, token) {
  return request('/health-mgmt/treatments', {
    method: 'POST',
    body: data,
    token
  });
}

export function updateTreatment(id, data, token) {
  return request(`/health-mgmt/treatments/${id}`, {
    method: 'PUT',
    body: data,
    token
  });
}

export function deleteTreatment(id, token) {
  return request(`/health-mgmt/treatments/${id}`, {
    method: 'DELETE',
    token
  });
}

// ==========================================
// VETERINARY MANAGEMENT API
// ==========================================
export function fetchVetVisits(token) {
  return request('/health-mgmt/vet-visits', { token });
}

export function addVetVisit(data, token) {
  return request('/health-mgmt/vet-visits', {
    method: 'POST',
    body: data,
    token
  });
}

export function updateVetVisit(id, data, token) {
  return request(`/health-mgmt/vet-visits/${id}`, {
    method: 'PUT',
    body: data,
    token
  });
}

export function deleteVetVisit(id, token) {
  return request(`/health-mgmt/vet-visits/${id}`, {
    method: 'DELETE',
    token
  });
}
