let allLands = [];
    let currentFilter = 'all';
    let selectedLand = null;
    let regions = [];

    // Viloyatlar ro'yxati (unique)
    function extractRegions(lands) {
        const regionSet = new Set(lands.map(land => land.location));
        return Array.from(regionSet).sort();
    }

    // Filter tugmalarini yaratish
    function createRegionButtons() {
        const container = document.getElementById('regionButtons');
        if (!container) return;
        
        container.innerHTML = '<button class="region-btn active" data-region="all">Barchasi</button>';
        
        regions.forEach(region => {
            const btn = document.createElement('button');
            btn.className = 'region-btn';
            btn.dataset.region = region;
            btn.textContent = region;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = region;
                filterLands();
            });
            container.appendChild(btn);
        });
    }

    // Yerlarni API dan yuklash
    async function loadLands() {
        const container = document.getElementById('landsList');
        if (!container) return;

        container.innerHTML = '<div class="loading">⏳ Yerlar yuklanmoqda...</div>';

        try {
            console.log('API ga so\'rov yuborilmoqda...');
            allLands = await getLands(); // Ensure this function is defined in api.js
            console.log('Yuklangan yerlar:', allLands);

            if (!allLands || allLands.length === 0) {
                container.innerHTML = '<div class="no-lands">😔 Hozircha yer mavjud emas</div>';
                return;
            }

            regions = extractRegions(allLands);
            createRegionButtons();
            filterLands();

        } catch (error) {
            console.error('Yuklash xatosi:', error);
            container.innerHTML = `
                <div class="error">
                    ❌ Yerlarni yuklashda xatolik!<br>
                    <small>${error.message}</small><br><br>
                    <button onclick="loadLands()" class="refresh-btn">🔄 Qayta urunish</button>
                    <button onclick="useDemoData()" class="refresh-btn">📱 Demo ma'lumotlar</button>
                </div>
            `;
        }
    }

    // Demo ma'lumotlar (backend ishlamasa)
    function useDemoData() {
        allLands = [
            {
                id: 1,
                location: "Toshkent viloyati",
                address: "Quyi Chirchiq tumani, O'rtasaroy MFY",
                area: 5.5,
                price_per_hectare: 1200000,
                duration: "12 oy",
                owner: "Alisher R.",
                owner_phone: "+998901234567",
                soil_type: "O'rtacha unumdor",
                water_source: "Nasos stansiyasi",
                status: "active"
            },
            {
                id: 2,
                location: "Samarqand",
                address: "Jomboy tumani, Bog'bon mahallasi",
                area: 12,
                price_per_hectare: 950000,
                duration: "24 oy",
                owner: "Bobur N.",
                owner_phone: "+998998887766",
                soil_type: "Unumdor",
                water_source: "Kanal",
                status: "active"
            },
            {
                id: 3,
                location: "Farg'ona",
                address: "Quva tumani, Navbahor MFY",
                area: 8,
                price_per_hectare: 1100000,
                duration: "36 oy",
                owner: "Dilshod M.",
                owner_phone: "+998933334455",
                soil_type: "Yumshoq",
                water_source: "Bulok",
                status: "active"
            }
        ];
        
        regions = extractRegions(allLands);
        createRegionButtons();
        filterLands();
        showToast('⚠️ Demo ma\'lumotlar ishlatilmoqda');
    }

    // Yerlarni filter qilish
    function filterLands() {
        if (currentFilter === 'all') {
            displayLands(allLands);
        } else {
            const filtered = allLands.filter(land => land.location === currentFilter);
            displayLands(filtered);
        }
    }

    // Yerlarni ko'rsatish
    function displayLands(lands) {
        const container = document.getElementById('landsList');
        
        if (!container) return;
        
        if (lands.length === 0) {
            container.innerHTML = '<div class="no-lands">😔 Hech qanday yer topilmadi</div>';
            return;
        }
        
        container.innerHTML = lands.map(land => `
            <div class="land-card ${selectedLand?.id === land.id ? 'selected' : ''}" onclick="selectLand(${land.id})">
                <div class="land-image">
                    <div class="land-icon">🌾</div>
                    <div class="land-badge">Ijara uchun</div>
                </div>
                <div class="land-info">
                    <div class="land-location">
                        📍 ${land.location}
                    </div>
                    <div class="land-address">
                        🏠 ${land.address}
                    </div>
                    <div class="land-details">
                        <div class="detail-item">
                            <div class="detail-label">Maydon</div>
                            <div class="detail-value">${land.area} ga</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Muddati</div>
                            <div class="detail-value">${land.duration}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Tuproq</div>
                            <div class="detail-value">${land.soil_type}</div>
                        </div>
                    </div>
                    <div class="land-details">
                        <div class="detail-item">
                            <div class="detail-label">Suv manbai</div>
                            <div class="detail-value">${land.water_source}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Egasiga</div>
                            <div class="detail-value">${land.owner}</div>
                        </div>
                    </div>
                    <div class="land-price">
                        💰 ${land.price_per_hectare.toLocaleString()} so'm/gektar
                    </div>
                    <div class="select-hint">
                        👆 Yerni tanlang va zapros yuboring
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Yerni tanlash
    function selectLand(landId) {
        selectedLand = allLands.find(l => l.id === landId);
        displayLands(allLands);
        showRequestModal();
    }

    // Zapros modalini ochish
    function showRequestModal() {
        if (!selectedLand) return;
        
        const modal = document.getElementById('requestModal');
        const infoDiv = document.getElementById('selectedLandInfo');
        
        if (!modal || !infoDiv) return;
        
        infoDiv.innerHTML = `
            <strong>📍 ${selectedLand.location}</strong><br>
            🏠 ${selectedLand.address}<br>
            🌾 Maydon: ${selectedLand.area} gektar<br>
            💰 Narx: ${selectedLand.price_per_hectare.toLocaleString()} so'm/gektar<br>
            👤 Egasi: ${selectedLand.owner}<br>
            📞 Ega telefoni: ${selectedLand.owner_phone}
        `;
        
        modal.style.display = 'flex';
    }

    function closeRequestModal() {
        const modal = document.getElementById('requestModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Zapros yuborish
    async function submitLandRequest(event) {
        event.preventDefault();
        
        if (!selectedLand) {
            alert('Iltimos, avval yerni tanlang!');
            return;
        }
        
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        
        const requestData = {
            landId: selectedLand.id,
            landLocation: selectedLand.location,
            landAddress: selectedLand.address,
            landArea: selectedLand.area,
            landOwner: selectedLand.owner,
            landOwnerPhone: selectedLand.owner_phone,
            price_per_hectare: selectedLand.price_per_hectare,
            farmerName: document.getElementById('fullName').value,
            farmerPhone: document.getElementById('phoneNumber').value,
            farmerId: currentUser.id || null,
            additionalInfo: document.getElementById('additionalInfo').value
        };
        
        if (!requestData.farmerName || !requestData.farmerPhone) {
            alert('Iltimos, ism va telefon raqamni to\'ldiring!');
            return;
        }
        
        try {
            if (typeof sendLandRequest === 'function') {
                const result = await sendLandRequest(requestData);
                if (result.success) {
                    showToast('✅ Zapros muvaffaqiyatli yuborildi!');
                    closeRequestModal();
                    document.getElementById('landRequestForm').reset();
                    selectedLand = null;
                    displayLands(allLands);
                }
            } else {
                // LocalStorage ga saqlash
                let requests = JSON.parse(localStorage.getItem('landRequests') || '[]');
                requests.push({ ...requestData, id: Date.now(), date: new Date().toISOString() });
                localStorage.setItem('landRequests', JSON.stringify(requests));
                showToast('✅ Zapros saqlandi (offline rejim)');
                closeRequestModal();
                document.getElementById('landRequestForm').reset();
                selectedLand = null;
                displayLands(allLands);
            }
        } catch (error) {
            console.error('Xatolik:', error);
            showToast('❌ Xatolik yuz berdi, qaytadan urinib ko\'ring');
        }
    }

    // Toast xabar
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #2d5a27;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Login modal
    function showLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    
    function closeLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    async function login() {
        const phone = document.getElementById('phoneInput').value;
        if (!phone) {
            alert('Telefon raqam kiriting');
            return;
        }
        
        try {
            if (typeof loginUser === 'function') {
                const result = await loginUser(phone);
                if (result.success) {
                    localStorage.setItem('user', JSON.stringify(result.user));
                    closeLoginModal();
                    updateAuthUI();
                    showToast('Muvaffaqiyatli kirdingiz!');
                }
            } else {
                localStorage.setItem('user', JSON.stringify({ id: Date.now(), phone, role: 'farmer' }));
                closeLoginModal();
                updateAuthUI();
                showToast('Muvaffaqiyatli kirdingiz!');
            }
        } catch (error) {
            localStorage.setItem('user', JSON.stringify({ id: Date.now(), phone, role: 'farmer' }));
            closeLoginModal();
            updateAuthUI();
            showToast('Muvaffaqiyatli kirdingiz! (offline)');
        }
    }

    function updateAuthUI() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const authSection = document.getElementById('authSection');
        if (authSection) {
            if (user.phone) {
                authSection.innerHTML = `<span>👋 ${user.phone}</span>`;
            } else {
                authSection.innerHTML = '<button onclick="showLoginModal()">Kirish</button>';
            }
        }
    }

    // Sahifa yuklanganda
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Sahifa yuklandi');
        loadLands();
        updateAuthUI();
        
        // Zapros form
        const form = document.getElementById('landRequestForm');
        if (form) {
            form.addEventListener('submit', submitLandRequest);
        }
        
        // Modalni tashqaridan bosganda yopish
        window.onclick = function(event) {
            const modal = document.getElementById('requestModal');
            const loginModal = document.getElementById('loginModal');
            if (event.target === modal) closeRequestModal();
            if (event.target === loginModal) closeLoginModal();
        };
    });