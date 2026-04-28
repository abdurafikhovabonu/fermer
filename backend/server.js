const express = require('express');
const cors = require('cors');  // FAQAT BIR MARTA!
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS sozlamalari - FAQAT BIR MARTA!
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// JSON fayllarni o'qish/yozish
const readData = (fileName) => {
    try {
        const filePath = path.join(__dirname, 'data', fileName);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([]));
            return [];
        }
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        console.error(`Error reading ${fileName}:`, error);
        return [];
    }
};

const writeData = (fileName, data) => {
    try {
        fs.writeFileSync(path.join(__dirname, 'data', fileName), JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${fileName}:`, error);
        return false;
    }
};

// ============ ROOT ENDPOINT ============
app.get('/', (req, res) => {
    res.json({ 
        message: 'Fermerlar Maktabi API ishlayapti!',
        endpoints: {
            users: '/api/users',
            register: '/api/register',
            login: '/api/login',
            fertilizers: '/api/fertilizers',
            orders: '/api/orders',
            lands: '/api/lands',
            landRequests: '/api/land-requests',
            stats: '/api/stats',
            messages: '/api/messages'
        }
    });
});

// ============ FOYDALANUVCHILAR (USERS) ============
app.get('/api/users', (req, res) => {
    console.log('GET /api/users');
    const users = readData('users.json');
    res.json(users);
});

app.post('/api/register', (req, res) => {
    console.log('POST /api/register', req.body);
    const { firstName, lastName, phone } = req.body;
    
    if (!firstName || !lastName || !phone) {
        return res.status(400).json({ error: 'Ism, familiya va telefon raqam majburiy' });
    }
    
    const users = readData('users.json');
    const existingUser = users.find(u => u.phone === phone);
    if (existingUser) {
        return res.status(400).json({ error: 'Bu telefon raqam allaqachon ro\'yxatdan o\'tgan' });
    }
    
    const newUser = {
        id: Date.now(),
        firstName,
        lastName,
        phone,
        role: 'user',
        createdAt: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=2d5a27&color=fff`
    };
    
    users.push(newUser);
    writeData('users.json', users);
    
    res.json({ success: true, user: newUser });
});

app.post('/api/login', (req, res) => {
    console.log('POST /api/login', req.body);
    const { phone } = req.body;
    
    const users = readData('users.json');
    let user = users.find(u => u.phone === phone);
    
    if (!user) {
        user = {
            id: Date.now(),
            firstName: 'Fermer',
            lastName: 'User',
            phone: phone,
            role: 'user',
            createdAt: new Date().toISOString(),
            avatar: `https://ui-avatars.com/api/?name=Fermer+User&background=2d5a27&color=fff`
        };
        users.push(user);
        writeData('users.json', users);
    }
    
    res.json({ success: true, user: user });
});

app.put('/api/users/:id', (req, res) => {
    console.log(`PUT /api/users/${req.params.id}`, req.body);
    const users = readData('users.json');
    const index = users.findIndex(u => u.id == req.params.id);
    
    if (index !== -1) {
        users[index] = { ...users[index], ...req.body };
        writeData('users.json', users);
        res.json({ success: true, user: users[index] });
    } else {
        res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    }
});

// ============ O'G'ITLAR ============
app.get('/api/fertilizers', (req, res) => {
    console.log('GET /api/fertilizers');
    const fertilizers = readData('fertilizers.json');
    res.json(fertilizers);
});

app.post('/api/fertilizers', (req, res) => {
    console.log('POST /api/fertilizers', req.body);
    const fertilizers = readData('fertilizers.json');
    const newFertilizer = { id: Date.now(), ...req.body };
    fertilizers.push(newFertilizer);
    writeData('fertilizers.json', fertilizers);
    res.json(newFertilizer);
});

// ============ BUYURTMALAR ============
app.get('/api/orders', (req, res) => {
    console.log('GET /api/orders');
    const orders = readData('orders.json');
    res.json(orders);
});

app.post('/api/orders', (req, res) => {
    console.log('POST /api/orders', req.body);
    const orders = readData('orders.json');
    const newOrder = {
        id: Date.now(),
        orderNumber: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        status: 'pending',
        ...req.body
    };
    orders.push(newOrder);
    writeData('orders.json', orders);
    res.json({ success: true, order: newOrder });
});

app.put('/api/orders/:id', (req, res) => {
    console.log(`PUT /api/orders/${req.params.id}`, req.body);
    const orders = readData('orders.json');
    const index = orders.findIndex(o => o.id == req.params.id);
    if (index !== -1) {
        orders[index] = { ...orders[index], ...req.body };
        writeData('orders.json', orders);
        res.json({ success: true, order: orders[index] });
    } else {
        res.status(404).json({ error: 'Buyurtma topilmadi' });
    }
});

app.delete('/api/orders/:id', (req, res) => {
    console.log(`DELETE /api/orders/${req.params.id}`);
    let orders = readData('orders.json');
    orders = orders.filter(o => o.id != req.params.id);
    writeData('orders.json', orders);
    res.json({ success: true });
});

// ============ YERLAR ============
app.get('/api/lands', (req, res) => {
    console.log('GET /api/lands');
    const lands = readData('lands.json');
    res.json(lands);
});

app.post('/api/lands', (req, res) => {
    console.log('POST /api/lands', req.body);
    const lands = readData('lands.json');
    const newLand = { id: Date.now(), ...req.body };
    lands.push(newLand);
    writeData('lands.json', lands);
    res.json(newLand);
});

app.delete('/api/lands/:id', (req, res) => {
    console.log(`DELETE /api/lands/${req.params.id}`);
    let lands = readData('lands.json');
    lands = lands.filter(l => l.id != req.params.id);
    writeData('lands.json', lands);
    res.json({ success: true });
});

// ============ YER ZAPROSLARI ============
app.get('/api/land-requests', (req, res) => {
    console.log('GET /api/land-requests');
    const requests = readData('land_requests.json');
    res.json(requests);
});

app.post('/api/land-requests', (req, res) => {
    console.log('POST /api/land-requests', req.body);
    const requests = readData('land_requests.json');
    const newRequest = {
        id: Date.now(),
        requestNumber: `REQ-${Date.now()}`,
        date: new Date().toISOString(),
        status: 'pending',
        ...req.body
    };
    requests.push(newRequest);
    writeData('land_requests.json', requests);
    res.json({ success: true, request: newRequest });
});

app.put('/api/land-requests/:id', (req, res) => {
    console.log(`PUT /api/land-requests/${req.params.id}`, req.body);
    const requests = readData('land_requests.json');
    const index = requests.findIndex(r => r.id == req.params.id);
    if (index !== -1) {
        requests[index] = { ...requests[index], ...req.body };
        writeData('land_requests.json', requests);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Zapros topilmadi' });
    }
});

app.delete('/api/land-requests/:id', (req, res) => {
    console.log(`DELETE /api/land-requests/${req.params.id}`);
    let requests = readData('land_requests.json');
    requests = requests.filter(r => r.id != req.params.id);
    writeData('land_requests.json', requests);
    res.json({ success: true });
});

// ============ XABARLAR (MESSAGES) ============
app.get('/api/messages', (req, res) => {
    console.log('GET /api/messages');
    const messages = readData('messages.json');
    res.json(messages);
});

app.post('/api/messages', (req, res) => {
    console.log('POST /api/messages', req.body);
    const { name, phone, message } = req.body;
    
    if (!name || !phone) {
        return res.status(400).json({ error: 'Ism va telefon raqam majburiy' });
    }
    
    const messages = readData('messages.json');
    const newMessage = {
        id: Date.now(),
        messageNumber: `MSG-${Date.now()}`,
        name: name,
        phone: phone,
        message: message || '',
        status: 'unread',
        createdAt: new Date().toISOString()
    };
    
    messages.push(newMessage);
    writeData('messages.json', messages);
    res.json({ success: true, message: newMessage });
});

app.put('/api/messages/:id', (req, res) => {
    console.log(`PUT /api/messages/${req.params.id}`, req.body);
    const messages = readData('messages.json');
    const index = messages.findIndex(m => m.id == req.params.id);
    if (index !== -1) {
        messages[index] = { ...messages[index], ...req.body };
        writeData('messages.json', messages);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Xabar topilmadi' });
    }
});

app.delete('/api/messages/:id', (req, res) => {
    console.log(`DELETE /api/messages/${req.params.id}`);
    let messages = readData('messages.json');
    messages = messages.filter(m => m.id != req.params.id);
    writeData('messages.json', messages);
    res.json({ success: true });
});

// ============ STATISTIKA ============
app.get('/api/stats', (req, res) => {
    console.log('GET /api/stats');
    const users = readData('users.json');
    const orders = readData('orders.json');
    const lands = readData('lands.json');
    const requests = readData('land_requests.json');
    const fertilizers = readData('fertilizers.json');
    const messages = readData('messages.json');
    
    res.json({
        users: users.length,
        orders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        lands: lands.length,
        landRequests: requests.length,
        fertilizers: fertilizers.length,
        messages: messages.length,
        totalIncome: orders.reduce((sum, o) => sum + (o.total || 0), 0)
    });
});

// ============ SERVERNI ISHGA TUSHIRISH ============
app.listen(PORT, () => {
    console.log(`✅ Server ishlayapti: https://fermer-6ta5.onrender.com`);
    console.log(`📊 API test: https://fermer-6ta5.onrender.com/api/lands`);
});