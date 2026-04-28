// frontend/js/auth.js
const API_URL = 'https://fermer-6ta5.onrender.com/api';
let currentUser = null;

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        const phone = prompt('Telefon raqamingizni kiriting:');
        if (phone) {
            loginWithPhone(phone);
        }
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

async function loginWithPhone(phone) {
    if (!phone || phone.length < 9) {
        alert('Telefon raqam noto\'g\'ri!');
        return false;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone })
        });
        const result = await response.json();
        
        if (result.success) {
            currentUser = result.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateAuthUI();
            closeLoginModal();
            showToast('✅ Muvaffaqiyatli kirdingiz!');
            return true;
        }
    } catch (error) {
        console.error('Login xatolik:', error);
        showToast('❌ Login xatolik yuz berdi!');
    }

    // Offline fallback
    currentUser = { id: Date.now(), phone: phone, role: 'farmer' };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    closeLoginModal();
    showToast('✅ Muvaffaqiyatli kirdingiz!');
    return true;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showToast('👋 Chiqib ketdingiz');
}

function updateAuthUI() {
    const authSection = document.getElementById('authSection');
    if (!authSection) return;
    
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
        } catch(e) {
            currentUser = null;
        }
    }
    
    if (currentUser && currentUser.phone) {
        const displayName = currentUser.firstName || currentUser.phone.slice(-9);
        authSection.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="color: white;">👋 ${displayName}</span>
                <button onclick="logout()" style="background: #ffd700; color: #2d5a27; border: none; padding: 5px 12px; border-radius: 5px; cursor: pointer;">Chiqish</button>
            </div>
        `;
    } else {
        authSection.innerHTML = '<button onclick="showLoginModal()" style="background: #ffd700; color: #2d5a27; border: none; padding: 5px 12px; border-radius: 5px; cursor: pointer;">Kirish</button>';
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2d5a27;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function getCurrentUser() {
    if (currentUser) return currentUser;
    const saved = localStorage.getItem('currentUser');
    if (saved) {
        currentUser = JSON.parse(saved);
        return currentUser;
    }
    return null;
}

// Sahifa yuklanganda
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAuthUI);
} else {
    updateAuthUI();
}