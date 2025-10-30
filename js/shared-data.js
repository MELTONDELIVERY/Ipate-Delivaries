// Shared Data Management for IPATE Deliveries
const IPATEData = {
    // Initialize sample data
    init() {
        if (!localStorage.getItem('ipate_products')) {
            const sampleProducts = [
                {
                    id: 'PROD001',
                    name: 'Fresh Organic Vegetables',
                    description: 'A selection of fresh organic vegetables delivered to your doorstep.',
                    price: 850,
                    stock: 15,
                    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                    sellerId: 'seller001',
                    sellerName: 'Sarah'\''s Kitchen',
                    category: 'Food',
                    rating: 4.5
                },
                {
                    id: 'PROD002',
                    name: 'Premium Coffee Beans',
                    description: 'High-quality Arabica coffee beans from local Kenyan farms.',
                    price: 1200,
                    stock: 8,
                    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                    sellerId: 'seller001',
                    sellerName: 'Sarah'\''s Kitchen',
                    category: 'Beverages',
                    rating: 4.8
                },
                {
                    id: 'PROD003',
                    name: 'Artisanal Bread Basket',
                    description: 'Freshly baked bread selection with a variety of flavors.',
                    price: 650,
                    stock: 12,
                    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                    sellerId: 'seller001',
                    sellerName: 'Sarah'\''s Kitchen',
                    category: 'Food',
                    rating: 4.6
                }
            ];
            localStorage.setItem('ipate_products', JSON.stringify(sampleProducts));
        }
        
        if (!localStorage.getItem('ipate_orders')) {
            localStorage.setItem('ipate_orders', JSON.stringify([]));
        }
    },
    
    // Product management
    getProducts() {
        return JSON.parse(localStorage.getItem('ipate_products') || '[]');
    },
    
    getProduct(id) {
        const products = this.getProducts();
        return products.find(p => p.id === id);
    },
    
    updateProductStock(productId, quantity) {
        const products = this.getProducts();
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex !== -1) {
            products[productIndex].stock -= quantity;
            localStorage.setItem('ipate_products', JSON.stringify(products));
            return true;
        }
        return false;
    },
    
    // Order management
    getOrders() {
        return JSON.parse(localStorage.getItem('ipate_orders') || '[]');
    },
    
    getOrdersByUser(userId, role) {
        const orders = this.getOrders();
        if (role === 'customer') {
            return orders.filter(order => order.customerId === userId);
        } else if (role === 'seller') {
            return orders.filter(order => order.sellerId === userId);
        } else if (role === 'rider') {
            return orders.filter(order => order.riderId === userId);
        }
        return [];
    },
    
    createOrder(orderData) {
        const orders = this.getOrders();
        const newOrder = {
            id: 'ORD' + Date.now(),
            ...orderData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            timeline: {
                ordered: new Date().toISOString(),
                accepted: null,
                ready: null,
                assigned: null,
                picked: null,
                delivered: null
            }
        };
        
        orders.unshift(newOrder);
        localStorage.setItem('ipate_orders', JSON.stringify(orders));
        return newOrder;
    },
    
    updateOrderStatus(orderId, status, updates = {}) {
        const orders = this.getOrders();
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = status;
            orders[orderIndex].updatedAt = new Date().toISOString();
            orders[orderIndex].timeline[status] = new Date().toISOString();
            
            // Apply additional updates
            Object.keys(updates).forEach(key => {
                orders[orderIndex][key] = updates[key];
            });
            
            localStorage.setItem('ipate_orders', JSON.stringify(orders));
            return true;
        }
        return false;
    },
    
    // Cart management
    getCart() {
        const user = JSON.parse(localStorage.getItem('ipate_simple_user') || '{}');
        return JSON.parse(localStorage.getItem(ipate_cart_) || '[]');
    },
    
    saveCart(cart) {
        const user = JSON.parse(localStorage.getItem('ipate_simple_user') || '{}');
        localStorage.setItem(ipate_cart_, JSON.stringify(cart));
    },
    
    clearCart() {
        const user = JSON.parse(localStorage.getItem('ipate_simple_user') || '{}');
        localStorage.removeItem(ipate_cart_);
    }
};

// Initialize data when script loads
IPATEData.init();
