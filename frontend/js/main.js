// Bosh sahifa uchun xizmatlar
const features = [
    { icon: '🌾', title: 'Hosildorlik kalkulyatori', desc: 'Tuproq tahlili va hosil prognozi' },
    { icon: '💊', title: 'O\'g\'itlar', desc: 'Mineral va organik o\'g\'itlar katalogi' },
    { icon: '🏞️', title: 'Yer ijarasi', desc: 'Ijara e\'lonlari va zapros qoldirish' },
    { icon: '📚', title: 'Fermerlik yo\'nalishlari', desc: '6+ yo\'nalish bo\'yicha qo\'llanmalar' }
];

function displayFeatures() {
    const grid = document.getElementById('featuresGrid');
    if (grid) {
        grid.innerHTML = features.map(f => `
            <div class="feature-card">
                <div class="feature-icon">${f.icon}</div>
                <h3>${f.title}</h3>
                <p>${f.desc}</p>
            </div>
        `).join('');
    }
}

displayFeatures();