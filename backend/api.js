// frontend/js/api.js
const API_URL = 'https://fermer-production.up.railway.app/api'; // Ensure this URL is correct and the backend is running

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

async function getLands() {
    console.log('Fetching lands...');
    return await apiRequest('/lands');
}

async function sendLandRequest(requestData) {
    console.log('Sending land request...');
    return await apiRequest('/land-requests', 'POST', requestData);
}

async function getFertilizers() {
    return await apiRequest('/fertilizers');
}

async function placeOrder(orderData) {
    return await apiRequest('/orders', 'POST', orderData);
}

async function getCategories() {
    return await apiRequest('/categories');
}

async function loginUser(phone) {
    return await apiRequest('/login', 'POST', { phone });
}

// Agar backend ishlamasa, demo ma'lumotlar
async function getLandsWithFallback() {
    try {
        return await getLands();
    } catch (error) {
        console.log('Backend ishlamayapti, demo ma\'lumotlar ishlatiladi');
        return [
            {
                id: 1,
                location: "Toshkent viloyati",
                address: "Quyi Chirchiq tumani",
                area: 5.5,
                price_per_hectare: 1200000,
                duration: "12 oy",
                owner: "Alisher R.",
                owner_phone: "+998901234567",
                soil_type: "O'rtacha",
                water_source: "Nasos"
            },
            {
                id: 2,
                location: "Samarqand",
                address: "Jomboy tumani",
                area: 12,
                price_per_hectare: 950000,
                duration: "24 oy",
                owner: "Bobur N.",
                owner_phone: "+998998887766",
                soil_type: "Unumdor",
                water_source: "Kanal"
            }
        ];
    }
}