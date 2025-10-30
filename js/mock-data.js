// ========== MOCK DATA FOR DEVELOPMENT ==========
// TODO: Replace with Supabase database queries once backend is ready

const MockData = {
    users: [
        {
            id: 'user001',
            email: 'customer@example.com',
            password: 'password123',
            name: 'John Doe',
            role: 'customer',
            phone: '+254712345678',
            avatar: 'JD'
        },
        {
            id: 'user002',
            email: 'seller@example.com',
            password: 'password123',
            name: 'Sarah\'s Kitchen',
            role: 'seller',
            phone: '+254723456789',
            avatar: 'SK'
        },
        {
            id: 'user003',
            email: 'rider@example.com',
            password: 'password123',
            name: 'Michael Kimani',
            role: 'rider',
            phone: '+254734567890',
            avatar: 'MK'
        }
    ],

    products: [
        {
            id: 'PROD001',
            name: 'Fresh Organic Vegetables',
            description: 'A selection of fresh organic vegetables delivered to your doorstep.',
            price: 850,
            stock: 15,
            image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            sellerId: 'user002',
            sellerName: 'Sarah\'s Kitchen',
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
            sellerId: 'user002',
            sellerName: 'Sarah\'s Kitchen',
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
            sellerId: 'user002',
            sellerName: 'Sarah\'s Kitchen',
            category: 'Food',
            rating: 4.6
        }
    ],

    orders: [
        {
            id: 'ORD001',
            customerId: 'user001',
            customerName: 'John Doe',
            items: [
                { productId: 'PROD001', name: 'Fresh Organic Vegetables', price: 850, quantity: 2 },
                { productId: 'PROD002', name: 'Premium Coffee Beans', price: 1200, quantity: 1 }
            ],
            total: 2900,
            status: 'ready',
            paymentMethod: 'cash',
            deliveryAddress: '123 Main Street, Nairobi',
            deliveryNotes: 'Please call before delivery',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            riderId: 'user003',
            riderName: 'Michael Kimani',
            timeline: {
                ordered: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                accepted: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
                ready: new Date().toISOString(),
                assigned: null,
                picked: null,
                delivered: null
            }
        }
    ],

    notifications: [
        {
            id: 'NOTIF001',
            userId: 'user001',
            title: 'Order Confirmed',
            message: 'Your order #ORD001 has been confirmed by the seller.',
            type: 'success',
            read: false,
            createdAt: new Date().toISOString()
        }
    ]
};

const MockAPI = {
    async login(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = MockData.users.find(u => u.email === email && u.password === password);
                if (user) {
                    const { password: _, ...userWithoutPassword } = user;
                    resolve({ user: userWithoutPassword, error: null });
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 1000);
        });
    },

    async register(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const existingUser = MockData.users.find(u => u.email === userData.email);
                if (existingUser) {
                    reject(new Error('User already exists'));
                } else {
                    const newUser = {
                        id: 'user' + Date.now(),
                        name: userData.name,
                        email: userData.email,
                        password: userData.password,
                        role: userData.role || 'customer',
                        phone: userData.phone || '',
                        avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
                        createdAt: new Date().toISOString()
                    };
                    MockData.users.push(newUser);
                    
                    console.log('DEBUG: New user created with role:', newUser.role);
                    
                    const { password: _, ...userWithoutPassword } = newUser;
                    resolve({ user: userWithoutPassword, error: null });
                }
            }, 1000);
        });
    },

    async getProducts() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MockData.products);
            }, 500);
        });
    },

    async getOrders(userId, userRole) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let orders = [];
                if (userRole === 'customer') {
                    orders = MockData.orders.filter(order => order.customerId === userId);
                } else if (userRole === 'seller') {
                    orders = MockData.orders.filter(order => 
                        order.items.some(item => {
                            const product = MockData.products.find(p => p.id === item.productId);
                            return product && product.sellerId === userId;
                        })
                    );
                } else if (userRole === 'rider') {
                    orders = MockData.orders.filter(order => order.riderId === userId);
                }
                resolve(orders);
            }, 500);
        });
    }
};