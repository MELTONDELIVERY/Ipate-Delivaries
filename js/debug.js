// DEBUG SCRIPT - Check if integration is working
console.log("🔧 DEBUG: debug.js loaded successfully");

// Wait for IPATEApp to be available
function initializeDebug() {
    if (typeof IPATEApp !== 'undefined') {
        console.log("🔧 DEBUG: IPATEApp found:", IPATEApp);
        
        // Override the showNotification to show alerts
        const originalShowNotification = IPATEApp.showNotification;
        IPATEApp.showNotification = function(message, type = 'success') {
            console.log(`🔧 DEBUG Notification: ${type} - ${message}`);
            alert(`${type.toUpperCase()}: ${message}`);
            return originalShowNotification.call(this, message, type);
        };

        // Add debug logging to login
        const originalLogin = IPATEApp.login;
        IPATEApp.login = async function(email, password) {
            console.log(`🔧 DEBUG: Login attempt with ${email}`);
            try {
                const result = await originalLogin.call(this, email, password);
                console.log('🔧 DEBUG: Login result:', result);
                return result;
            } catch (error) {
                console.error('🔧 DEBUG: Login error:', error);
                throw error;
            }
        };

        console.log("🔧 DEBUG: Debug features initialized");
    } else {
        console.error("🔧 DEBUG: IPATEApp not found!");
        // Try again in a moment
        setTimeout(initializeDebug, 100);
    }
}

// Start initialization
initializeDebug();
