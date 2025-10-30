// ========== CORE INTEGRATION LOGIC ==========
// Lightweight integration without changing UI
// TODO: Replace with Supabase integration later

class IPATEIntegration {
    constructor() {
        this.currentUser = null;
        this.isInitialized = false;
    }

    initialize() {
        if (this.isInitialized) return;
        
        this.loadUserFromStorage();
        this.setupGlobalEventListeners();
        this.isInitialized = true;
        
        console.log('IPATE Integration initialized');
    }

    loadUserFromStorage() {
        try {
            const userData = localStorage.getItem('ipate_current_user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
        } catch (error) {
            console.error('Error loading user from storage:', error);
            this.currentUser = null;
        }
    }

    saveUserToStorage(user) {
        try {
            if (user) {
                localStorage.setItem('ipate_current_user', JSON.stringify(user));
                this.currentUser = user;
            } else {
                localStorage.removeItem('ipate_current_user');
                this.currentUser = null;
            }
        } catch (error) {
            console.error('Error saving user to storage:', error);
        }
    }

    setupGlobalEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-logout]')) {
                e.preventDefault();
                this.logout();
            }
        });

        this.protectDashboardPages();
    }

    protectDashboardPages() {
        const dashboardPages = ['customer.html', 'seller.html', 'rider.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (dashboardPages.includes(currentPage) && !this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        if (this.currentUser && currentPage === 'index.html') {
            this.redirectToDashboard();
        }
    }

    redirectToDashboard() {
        if (!this.currentUser) return;

        const dashboardMap = {
            'customer': 'customer.html',
            'seller': 'seller.html', 
            'rider': 'rider.html'
        };

        const dashboard = dashboardMap[this.currentUser.role];
        if (dashboard && !window.location.pathname.includes(dashboard)) {
            window.location.href = dashboard;
        }
    }

    async login(email, password) {
        try {
            if (MOCK_AUTH_ENABLED) {
                const result = await MockAPI.login(email, password);
                this.saveUserToStorage(result.user);
                return { user: result.user, error: null };
            } else {
                throw new Error('Supabase auth not configured yet');
            }
        } catch (error) {
            return { user: null, error: error.message };
        }
    }

    async register(userData) {
        try {
            if (MOCK_AUTH_ENABLED) {
                const result = await MockAPI.register(userData);
                this.saveUserToStorage(result.user);
                return { user: result.user, error: null };
            } else {
                throw new Error('Supabase auth not configured yet');
            }
        } catch (error) {
            return { user: null, error: error.message };
        }
    }

    logout() {
        this.saveUserToStorage(null);
        window.location.href = 'index.html';
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getUserRole() {
        return this.currentUser ? this.currentUser.role : null;
    }

    async loadDashboardData() {
        if (!this.currentUser) return null;

        try {
            const [products, orders] = await Promise.all([
                MockAPI.getProducts(),
                MockAPI.getOrders(this.currentUser.id, this.currentUser.role)
            ]);

            return {
                products,
                orders,
                user: this.currentUser
            };
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            return null;
        }
    }

    showNotification(message, type = 'success') {
        if (typeof UIHelper !== 'undefined' && UIHelper.showNotification) {
            UIHelper.showNotification(message, type);
        } else if (typeof riderDashboard !== 'undefined' && riderDashboard.showToast) {
            riderDashboard.showToast(message, type);
        } else {
            alert(`${type.toUpperCase()}: ${message}`);
        }
    }
}

const IPATEApp = new IPATEIntegration();

document.addEventListener('DOMContentLoaded', function() {
    IPATEApp.initialize();
});
