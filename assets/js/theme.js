// Theme and Common UI Logic

// Theme Management
const themes = {
    1: { primary: '#2563eb', secondary: '#0ea5e9', accent: '#06b6d4', dark: '#1e40af', light: '#f0f9ff', success: '#10b981', warning: '#f59e0b', danger: '#ef4444' },
    2: { primary: '#f97316', secondary: '#fb923c', accent: '#fbbf24', dark: '#ea580c', light: '#fffbeb', success: '#22c55e', warning: '#eab308', danger: '#dc2626' },
    3: { primary: '#059669', secondary: '#10b981', accent: '#34d399', dark: '#047857', light: '#ecfdf5', success: '#10b981', warning: '#d97706', danger: '#dc2626' },
    4: { primary: '#7c3aed', secondary: '#8b5cf6', accent: '#a78bfa', dark: '#5b21b6', light: '#f5f3ff', success: '#10b981', warning: '#f59e0b', danger: '#ef4444' },
    5: { primary: '#1e40af', secondary: '#3b82f6', accent: '#60a5fa', dark: '#1e3a8a', light: '#eff6ff', success: '#10b981', warning: '#f59e0b', danger: '#ef4444' }
};

function initializeTheme() {
    const savedTheme = localStorage.getItem('selectedTheme') || '1';
    setTheme(savedTheme);

    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
            localStorage.setItem('selectedTheme', theme);
        });
    });

    // Sidebar settings menu toggle
    const settingsMenu = document.getElementById('settingsMenu');
    const themeSelector = document.getElementById('themeSelector');
    if (settingsMenu && themeSelector) {
        settingsMenu.addEventListener('click', () => {
            themeSelector.classList.toggle('show');
        });
    }
}

function setTheme(themeId) {
    const theme = themes[themeId];
    if (!theme) return;

    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-theme') === themeId);
    });

    const root = document.documentElement;
    for (const [key, value] of Object.entries(theme)) {
        root.style.setProperty(`--${key}`, value);
    }

    // Set RGB for primary to use in rgba colors
    const r = parseInt(theme.primary.slice(1, 3), 16);
    const g = parseInt(theme.primary.slice(3, 5), 16);
    const b = parseInt(theme.primary.slice(5, 7), 16);
    root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
}

// Toast Notifications
function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Authentication Logic
function checkLoginStatus(redirect = true) {
    const savedEmail = localStorage.getItem('userEmail');
    const isLoginPage = !!document.getElementById('loginPage');

    if (savedEmail) {
        if (isLoginPage) {
            showDashboard(savedEmail);
        } else {
            updateUserUI(savedEmail);
        }
    } else if (redirect && !isLoginPage) {
        window.location.href = 'index.php';
    }
}

function showDashboard(email) {
    const loginPage = document.getElementById('loginPage');
    const dashboard = document.getElementById('dashboard');
    const header = document.getElementById('mainHeader');
    const sidebar = document.getElementById('mainSidebar');

    if (loginPage) loginPage.classList.add('hidden');
    if (dashboard) dashboard.classList.add('active');
    if (header) header.style.display = 'flex';
    if (sidebar) sidebar.style.display = 'block';

    updateUserUI(email);
}

function updateUserUI(email) {
    const name = email.split('@')[0];
    const avatars = document.querySelectorAll('.user-avatar, #userInitial');
    const header = document.getElementById('mainHeader');
    const sidebar = document.getElementById('mainSidebar');

    avatars.forEach(avatar => {
        avatar.textContent = name.charAt(0).toUpperCase();
        avatar.style.background = `linear-gradient(135deg, var(--primary), var(--accent))`;
    });

    if (header) header.style.display = 'flex';
    if (sidebar) sidebar.style.display = 'block';
}

function logout() {
    localStorage.removeItem('userEmail');
    window.location.href = 'index.php';
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            localStorage.setItem('userEmail', email);
            showDashboard(email);
            showToast('Welcome back, ' + email.split('@')[0] + '!', 'success');
        });
    }

    // Check auth status on page load (without redirect on index.php login page)
    checkLoginStatus(false);
});
