// ========== SUPABASE CONFIGURATION PLACEHOLDERS ==========
// TODO: Replace with your actual Supabase project credentials
const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-KEY";

// ========== MOCK AUTH CONFIGURATION ==========
// Temporary mock authentication for development
// TODO: Replace with Supabase auth once backend is ready
const MOCK_AUTH_ENABLED = true;

// ========== APPLICATION CONSTANTS ==========
const USER_ROLES = {
    CUSTOMER: 'customer',
    SELLER: 'seller', 
    RIDER: 'rider'
};

const ORDER_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    READY: 'ready',
    ASSIGNED: 'assigned',
    PICKED: 'picked',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};
