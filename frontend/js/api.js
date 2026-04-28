// frontend/js/api.js
const API_URL = 'https://fermer-6ta5.onrender.com/api';

console.log('API URL:', API_URL);

async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API xatolik:', error);
        throw error;
    }
}

// ============ O'G'ITLAR ============
async function getFertilizers() {
    return await apiRequest('/fertilizers');
}

async function placeOrder(orderData) {
    return await apiRequest('/orders', 'POST', orderData);
}

async function getOrders() {
    return await apiRequest('/orders');
}

// ============ YER IJARASI ============
async function getLands() {
    console.log('getLands() called');
    return await apiRequest('/lands');
}

async function getLandById(id) {
    const lands = await getLands();
    return lands.find(land => land.id == id);
}

async function sendLandRequest(requestData) {
    console.log('sendLandRequest() called', requestData);
    return await apiRequest('/land-requests', 'POST', requestData);
}

async function getLandRequests() {
    return await apiRequest('/land-requests');
}

async function updateRequestStatus(id, status) {
    return await apiRequest(`/land-requests/${id}`, 'PUT', { status });
}

async function deleteRequest(id) {
    return await apiRequest(`/land-requests/${id}`, 'DELETE');
}

// ============ YO'NALISHLAR ============
async function getCategories() {
    return await apiRequest('/categories');
}

// ============ AUTH ============
async function loginUser(phone) {
    return await apiRequest('/login', 'POST', { phone });
}

async function registerUser(userData) {
    return await apiRequest('/register', 'POST', userData);
}

async function getUsers() {
    return await apiRequest('/users');
}

async function updateUser(id, userData) {
    return await apiRequest(`/users/${id}`, 'PUT', userData);
}

// ============ STATISTIKA ============
async function getStats() {
    return await apiRequest('/stats');
}

// ============ XABARLAR ============
async function sendMessage(messageData) {
    return await apiRequest('/messages', 'POST', messageData);
}

async function getMessages() {
    return await apiRequest('/messages');
}

async function updateMessageStatus(id, status) {
    return await apiRequest(`/messages/${id}`, 'PUT', { status });
}

async function deleteMessage(id) {
    return await apiRequest(`/messages/${id}`, 'DELETE');
}