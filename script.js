// Electronics Store Dashboard JavaScript - Enhanced Version

// Data Storage and Management
class ElectronicsStore {
    constructor() {
        this.customers = JSON.parse(localStorage.getItem('customers')) || [];
        this.products = JSON.parse(localStorage.getItem('products')) || this.getDefaultProducts();
        this.orders = JSON.parse(localStorage.getItem('orders')) || this.getDefaultOrders();
        this.bills = JSON.parse(localStorage.getItem('bills')) || [];
        this.messages = JSON.parse(localStorage.getItem('messages')) || this.getDefaultMessages();
        this.returns = JSON.parse(localStorage.getItem('returns')) || [];
        this.users = JSON.parse(localStorage.getItem('users')) || this.getDefaultUsers();
        this.settings = JSON.parse(localStorage.getItem('settings')) || this.getDefaultSettings();
        this.reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        this.salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
        
        this.currentCustomerId = null;
        this.currentOrderId = null;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.currentProductId = null;
        
        this.init();
    }

    init() {
        if (!this.currentUser) {
            this.showLoginModal();
            return;
        }
        this.setupEventListeners();
        this.renderDashboard();
        this.initializeCharts();
        this.loadRecentActivities();
        this.setupNavigation();
        this.checkLowStock();
        this.checkPaymentReminders();
        this.checkReturnReminders();
    }

    // Default Data
    getDefaultProducts() {
        return [
            {
                id: 1,
                name: "iPhone 15 Pro",
                category: "smartphones",
                price: 999.99,
                stock: 25,
                sold: 45,
                image: "📱",
                lowStockThreshold: 10,
                warranty: 12
            },
            {
                id: 2,
                name: "Samsung Galaxy S24",
                category: "smartphones", 
                price: 849.99,
                stock: 18,
                sold: 38,
                image: "📱",
                lowStockThreshold: 10,
                warranty: 12
            },
            {
                id: 3,
                name: "MacBook Pro 16\"",
                category: "laptops",
                price: 2399.99,
                stock: 8,
                sold: 15,
                image: "💻",
                lowStockThreshold: 5,
                warranty: 24
            },
            {
                id: 4,
                name: "AirPods Pro 2",
                category: "audio",
                price: 249.99,
                stock: 42,
                sold: 78,
                image: "🎧",
                lowStockThreshold: 15,
                warranty: 6
            },
            {
                id: 5,
                name: "iPad Pro 12.9\"",
                category: "tablets",
                price: 1199.99,
                stock: 15,
                sold: 22,
                image: "📱",
                lowStockThreshold: 8,
                warranty: 12
            },
            {
                id: 6,
                name: "Samsung 65\" QLED TV",
                category: "tvs",
                price: 1299.99,
                stock: 8,
                sold: 15,
                image: "📺",
                lowStockThreshold: 3,
                warranty: 36
            }
        ];
    }

    getDefaultOrders() {
        return [
            {
                id: 1001,
                customerId: 1,
                customerName: "John Doe",
                products: [
                    { productId: 1, name: "iPhone 15 Pro", quantity: 1, price: 999.99 }
                ],
                total: 999.99,
                paid: 999.99,
                remaining: 0,
                status: "delivered",
                date: new Date().toISOString(),
                paymentMethod: "card"
            },
            {
                id: 1002,
                customerId: 2,
                customerName: "Jane Smith",
                products: [
                    { productId: 4, name: "AirPods Pro 2", quantity: 2, price: 249.99 }
                ],
                total: 499.98,
                paid: 250.00,
                remaining: 249.98,
                status: "pending",
                date: new Date(Date.now() - 86400000).toISOString(),
                paymentMethod: "cash"
            },
            {
                id: 1003,
                customerId: 3,
                customerName: "Mike Johnson",
                products: [
                    { productId: 3, name: "MacBook Pro 16\"", quantity: 1, price: 2399.99 }
                ],
                total: 2399.99,
                paid: 1200.00,
                remaining: 1199.99,
                status: "processing",
                date: new Date(Date.now() - 172800000).toISOString(),
                paymentMethod: "installment"
            }
        ];
    }

    getDefaultMessages() {
        return [
            {
                id: 1,
                sender: "John Doe",
                message: "When will my iPhone be delivered?",
                time: "2 minutes ago",
                avatar: "JD"
            },
            {
                id: 2,
                sender: "Jane Smith", 
                message: "I need a receipt for my purchase",
                time: "15 minutes ago",
                avatar: "JS"
            },
            {
                id: 3,
                sender: "Mike Johnson",
                message: "Can I pay the remaining amount tomorrow?",
                time: "1 hour ago",
                avatar: "MJ"
            }
        ];
    }

    getDefaultUsers() {
        return [
            {
                id: 1,
                username: "admin",
                password: "admin123",
                role: "admin",
                name: "Administrator",
                email: "admin@electrastore.com",
                permissions: ["all"]
            },
            {
                id: 2,
                username: "staff",
                password: "staff123",
                role: "staff",
                name: "Staff Member",
                email: "staff@electrastore.com",
                permissions: ["sales", "customers", "products"]
            }
        ];
    }

    getDefaultSettings() {
        return {
            taxRate: 6.0,
            returnDays: 7,
            invoiceFormat: "standard",
            companyName: "ElectraStore",
            companyAddress: "123 Electronics Street, Tech City, TC 12345",
            companyPhone: "(555) 123-4567",
            companyEmail: "info@electrastore.com",
            theme: "default",
            autoBackup: true,
            lowStockAlert: true,
            paymentReminders: true,
            emailInvoices: false
        };
    }

    // Authentication
    showLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Login to ElectraStore</h2>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="username">Username:</label>
                        <input type="text" id="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password:</label>
                        <input type="password" id="password" required>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Login</button>
                    </div>
                </form>
                <div class="login-help">
                    <p>Demo Credentials:</p>
                    <p>Admin: admin / admin123</p>
                    <p>Staff: staff / staff123</p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });
    }

    login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            document.querySelector('.modal').remove();
            this.updateUserProfile();
            this.init();
        } else {
            alert('Invalid credentials');
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        location.reload();
    }

    updateUserProfile() {
        const userNameElement = document.getElementById('currentUserName');
        const userRoleElement = document.getElementById('currentUserRole');
        
        if (userNameElement && userRoleElement && this.currentUser) {
            userNameElement.textContent = this.currentUser.name;
            userRoleElement.textContent = this.currentUser.role.charAt(0).toUpperCase() + this.currentUser.role.slice(1);
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(e.target.getAttribute('href'));
            });
        });

        // Modal controls
        this.setupModalEvents();
        
        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Forms
        this.setupFormEvents();
    }

    setupModalEvents() {
        // Get all modals
        const customerModal = document.getElementById('customerModal');
        const productModal = document.getElementById('productModal');
        const returnModal = document.getElementById('returnModal');
        const salesModal = document.getElementById('salesModal');
        const importModal = document.getElementById('importModal');
        
        // Close modals
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) modal.style.display = 'none';
            });
        });

        // Cancel buttons
        document.getElementById('cancelCustomer')?.addEventListener('click', () => {
            customerModal.style.display = 'none';
        });

        document.getElementById('cancelProduct')?.addEventListener('click', () => {
            productModal.style.display = 'none';
        });

        document.getElementById('cancelReturn')?.addEventListener('click', () => {
            returnModal.style.display = 'none';
        });

        document.getElementById('cancelSale')?.addEventListener('click', () => {
            salesModal.style.display = 'none';
        });

        document.getElementById('cancelImport')?.addEventListener('click', () => {
            importModal.style.display = 'none';
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target === customerModal) customerModal.style.display = 'none';
            if (e.target === productModal) productModal.style.display = 'none';
            if (e.target === returnModal) returnModal.style.display = 'none';
            if (e.target === salesModal) salesModal.style.display = 'none';
            if (e.target === importModal) importModal.style.display = 'none';
        });
    }

    setupFormEvents() {
        // Customer form
        const customerForm = document.getElementById('customerForm');
        if (customerForm) {
            customerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveCustomer();
            });
        }

        // Product form
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProduct();
            });
        }

        // Return form
        const returnForm = document.getElementById('returnForm');
        if (returnForm) {
            returnForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processReturn();
            });
        }

        // Sales form
        const salesForm = document.getElementById('salesForm');
        if (salesForm) {
            salesForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.completeSale();
            });
        }

        // Import form
        const importForm = document.getElementById('importForm');
        if (importForm) {
            importForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.importCSV();
            });
        }
    }

    // Navigation
    handleNavigation(section) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to clicked item
        const clickedItem = document.querySelector(`a[href="${section}"]`).parentElement;
        clickedItem.classList.add('active');

        // Update main content based on section
        this.renderSection(section);
    }

    setupNavigation() {
        // Default dashboard view
        this.renderSection('#dashboard');
    }

    renderSection(section) {
        const mainContent = document.querySelector('.main-content');
        
        switch(section) {
            case '#dashboard':
                this.renderDashboard();
                break;
            case '#customers':
                this.renderCustomersPage();
                break;
            case '#products':
                this.renderProductsPage();
                break;
            case '#orders':
                this.renderOrdersPage();
                break;
            case '#billing':
                this.renderBillingPage();
                break;
            case '#inventory':
                this.renderInventoryPage();
                break;
            case '#returns':
                this.renderReturnsPage();
                break;
            case '#reports':
                this.renderReportsPage();
                break;
            case '#reminders':
                this.renderRemindersPage();
                break;
            case '#settings':
                this.renderSettingsPage();
                break;
            default:
                this.renderDashboard();
        }
    }

    // Dashboard Rendering
    renderDashboard() {
        this.updateStats();
        this.loadRecentActivities();
    }

    updateStats() {
        const totalOrders = this.orders.length;
        const totalSales = this.orders.reduce((sum, order) => sum + order.paid, 0);
        const totalRevenue = this.orders.reduce((sum, order) => sum + order.total, 0);
        const totalVisitors = 3254214; // Sample data

        // Update stat cards
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards.length >= 4) {
            statCards[0].querySelector('.stat-number').textContent = totalOrders.toLocaleString();
            statCards[1].querySelector('.stat-number').textContent = `$${totalSales.toLocaleString()}`;
            statCards[2].querySelector('.stat-number').textContent = totalVisitors.toLocaleString();
            statCards[3].querySelector('.stat-number').textContent = `$${totalRevenue.toLocaleString()}`;
        }
    }

    // Charts
    initializeCharts() {
        this.initCustomerChart();
        this.initDonutChart();
    }

    initCustomerChart() {
        const ctx = document.getElementById('customerChart');
        if (!ctx) return;

        // Sample data for customer overview
        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Visitors',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 42000],
                borderColor: '#FF6B35',
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                fill: true,
                tension: 0.4
            }]
        };

        new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    initDonutChart() {
        const ctx = document.getElementById('customerDonutChart');
        if (!ctx) return;

        const data = {
            labels: ['Current Customer', 'New Customer', 'VIP Customer'],
            datasets: [{
                data: [60, 25, 15],
                backgroundColor: ['#3182CE', '#FF6B35', '#38A169'],
                borderWidth: 0
            }]
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Recent Activities
    loadRecentActivities() {
        this.loadMessages();
        this.loadBestSelling();
        this.loadRecentOrders();
    }

    loadMessages() {
        const messageList = document.getElementById('messageList');
        if (!messageList) return;

        messageList.innerHTML = this.messages.map(message => `
            <div class="message-item">
                <div class="item-avatar">${message.avatar}</div>
                <div class="item-info">
                    <div class="item-name">${message.sender}</div>
                    <div class="item-details">${message.message}</div>
                </div>
                <div class="item-meta">
                    <div class="item-time">${message.time}</div>
                </div>
            </div>
        `).join('');
    }

    loadBestSelling() {
        const bestSellingList = document.getElementById('bestSellingList');
        if (!bestSellingList) return;

        const sortedProducts = [...this.products].sort((a, b) => b.sold - a.sold).slice(0, 3);

        bestSellingList.innerHTML = sortedProducts.map(product => `
            <div class="product-item">
                <div class="item-avatar">${product.image}</div>
                <div class="item-info">
                    <div class="item-name">${product.name}</div>
                    <div class="item-details">${product.category} • ${product.sold} sold</div>
                </div>
                <div class="item-meta">
                    <div class="item-price">$${product.price}</div>
                </div>
            </div>
        `).join('');
    }

    loadRecentOrders() {
        const recentOrdersList = document.getElementById('recentOrdersList');
        if (!recentOrdersList) return;

        const recentOrders = [...this.orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);

        recentOrdersList.innerHTML = recentOrders.map(order => `
            <div class="order-item">
                <div class="item-avatar">${order.customerName.split(' ').map(n => n[0]).join('')}</div>
                <div class="item-info">
                    <div class="item-name">${order.products[0].name}</div>
                    <div class="item-details">${order.customerName}</div>
                </div>
                <div class="item-meta">
                    <div class="item-price">$${order.total}</div>
                    <div class="item-status status-${order.status}">${order.status}</div>
                </div>
            </div>
        `).join('');
    }

    // Customer Management
    renderCustomersPage() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <header class="header">
                <div class="header-left">
                    <h1>Customer Management</h1>
                </div>
                <div class="header-right">
                    <button class="btn-primary" onclick="store.showCustomerModal()">
                        <i class="fas fa-plus"></i> Add Customer
                    </button>
                </div>
            </header>
            
            <section class="customers-section">
                <div class="activity-card">
                    <div class="activity-header">
                        <h3>All Customers</h3>
                        <div class="customer-stats">
                            <span>Total: ${this.customers.length}</span>
                        </div>
                    </div>
                    <div class="customer-list" id="customerList">
                        ${this.renderCustomerList()}
                    </div>
                </div>
            </section>
        `;
    }

    renderCustomerList() {
        return this.customers.map(customer => `
            <div class="customer-item" data-customer-id="${customer.id}">
                <div class="item-avatar">${customer.name.split(' ').map(n => n[0]).join('')}</div>
                <div class="item-info">
                    <div class="item-name">${customer.name}</div>
                    <div class="item-details">${customer.email} • ${customer.phone}</div>
                </div>
                <div class="item-meta">
                    <div class="customer-actions">
                        <button class="btn-secondary" onclick="store.editCustomer(${customer.id})">Edit</button>
                        <button class="btn-secondary" onclick="store.viewCustomerBills(${customer.id})">Bills</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showCustomerModal(customerId = null) {
        const modal = document.getElementById('customerModal');
        const form = document.getElementById('customerForm');
        
        if (customerId) {
            const customer = this.customers.find(c => c.id === customerId);
            if (customer) {
                document.getElementById('customerName').value = customer.name;
                document.getElementById('customerEmail').value = customer.email;
                document.getElementById('customerPhone').value = customer.phone;
                document.getElementById('customerAddress').value = customer.address || '';
                this.currentCustomerId = customerId;
            }
        } else {
            form.reset();
            this.currentCustomerId = null;
        }
        
        modal.style.display = 'block';
    }

    saveCustomer() {
        const name = document.getElementById('customerName').value;
        const email = document.getElementById('customerEmail').value;
        const phone = document.getElementById('customerPhone').value;
        const address = document.getElementById('customerAddress').value;

        const customerData = {
            name,
            email,
            phone,
            address,
            createdAt: new Date().toISOString()
        };

        if (this.currentCustomerId) {
            // Update existing customer
            const index = this.customers.findIndex(c => c.id === this.currentCustomerId);
            if (index !== -1) {
                this.customers[index] = { ...this.customers[index], ...customerData };
            }
        } else {
            // Add new customer
            customerData.id = Date.now();
            this.customers.push(customerData);
        }

        this.saveToLocalStorage();
        document.getElementById('customerModal').style.display = 'none';
        
        // Refresh customer list if on customers page
        if (document.querySelector('.customers-section')) {
            this.renderCustomersPage();
        }
        
        this.showNotification('Customer saved successfully!');
    }

    editCustomer(customerId) {
        this.showCustomerModal(customerId);
    }

    viewCustomerBills(customerId) {
        const customer = this.customers.find(c => c.id === customerId);
        const customerOrders = this.orders.filter(o => o.customerId === customerId);
        
        // Show customer billing details
        alert(`Bills for ${customer.name}:\n${customerOrders.map(order => 
            `Order #${order.id}: Total $${order.total}, Paid $${order.paid}, Remaining $${order.remaining}`
        ).join('\n')}`);
    }

    // Product Management
    renderProductsPage() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <header class="header">
                <div class="header-left">
                    <h1>Product Management</h1>
                </div>
                <div class="header-right">
                    <button class="btn-primary" onclick="store.showProductModal()">
                        <i class="fas fa-plus"></i> Add Product
                    </button>
                </div>
            </header>
            
            <section class="products-section">
                <div class="activity-card">
                    <div class="activity-header">
                        <h3>All Products</h3>
                        <div class="product-stats">
                            <span>Total: ${this.products.length}</span>
                        </div>
                    </div>
                    <div class="product-grid" id="productGrid">
                        ${this.renderProductGrid()}
                    </div>
                </div>
            </section>
        `;
    }

    renderProductGrid() {
        return this.products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">${product.image}</div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="product-category">${product.category}</p>
                    <div class="product-price">$${product.price}</div>
                    <div class="product-stock">Stock: ${product.stock}</div>
                    <div class="product-sold">Sold: ${product.sold}</div>
                </div>
                <div class="product-actions">
                    <button class="btn-secondary" onclick="store.editProduct(${product.id})">Edit</button>
                    <button class="btn-secondary" onclick="store.addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `).join('');
    }

    showProductModal(productId = null) {
        const modal = document.getElementById('productModal');
        const form = document.getElementById('productForm');
        
        if (productId) {
            const product = this.products.find(p => p.id === productId);
            if (product) {
                document.getElementById('productName').value = product.name;
                document.getElementById('productCategory').value = product.category;
                document.getElementById('productPrice').value = product.price;
                document.getElementById('productStock').value = product.stock;
                this.currentProductId = productId;
            }
        } else {
            form.reset();
            this.currentProductId = null;
        }
        
        modal.style.display = 'block';
    }

    saveProduct() {
        const name = document.getElementById('productName').value;
        const category = document.getElementById('productCategory').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const stock = parseInt(document.getElementById('productStock').value);

        const productData = {
            name,
            category,
            price,
            stock,
            image: this.getCategoryEmoji(category),
            sold: 0
        };

        if (this.currentProductId) {
            // Update existing product
            const index = this.products.findIndex(p => p.id === this.currentProductId);
            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...productData };
            }
        } else {
            // Add new product
            productData.id = Date.now();
            this.products.push(productData);
        }

        this.saveToLocalStorage();
        document.getElementById('productModal').style.display = 'none';
        
        // Refresh product list if on products page
        if (document.querySelector('.products-section')) {
            this.renderProductsPage();
        }
        
        this.showNotification('Product saved successfully!');
    }

    getCategoryEmoji(category) {
        const emojis = {
            smartphones: '📱',
            tablets: '📱',
            laptops: '💻',
            accessories: '🔌',
            audio: '🎧'
        };
        return emojis[category] || '📦';
    }

    editProduct(productId) {
        this.showProductModal(productId);
    }

    addToCart(productId) {
        // Implement add to cart functionality
        this.showNotification('Product added to cart!');
    }

    // Billing and Orders
    renderBillingPage() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <header class="header">
                <div class="header-left">
                    <h1>Billing & Orders</h1>
                </div>
                <div class="header-right">
                    <button class="btn-primary" onclick="store.createNewOrder()">
                        <i class="fas fa-plus"></i> New Order
                    </button>
                </div>
            </header>
            
            <section class="billing-section">
                <div class="billing-grid">
                    <div class="activity-card">
                        <div class="activity-header">
                            <h3>Recent Orders</h3>
                        </div>
                        <div class="order-list" id="allOrdersList">
                            ${this.renderAllOrders()}
                        </div>
                    </div>
                    
                    <div class="activity-card">
                        <div class="activity-header">
                            <h3>Payment Reminders</h3>
                        </div>
                        <div class="reminder-list" id="reminderList">
                            ${this.renderPaymentReminders()}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    renderAllOrders() {
        return this.orders.map(order => `
            <div class="order-item detailed" data-order-id="${order.id}">
                <div class="order-header">
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-status status-${order.status}">${order.status}</div>
                </div>
                <div class="order-details">
                    <div class="customer-name">${order.customerName}</div>
                    <div class="order-products">
                        ${order.products.map(p => `${p.name} (${p.quantity})`).join(', ')}
                    </div>
                    <div class="order-amounts">
                        <span>Total: $${order.total}</span>
                        <span>Paid: $${order.paid}</span>
                        <span class="remaining">Remaining: $${order.remaining}</span>
                    </div>
                </div>
                <div class="order-actions">
                    <button class="btn-secondary" onclick="store.viewOrderDetails(${order.id})">View</button>
                    <button class="btn-secondary" onclick="store.updatePayment(${order.id})">Payment</button>
                    ${order.remaining > 0 ? `<button class="btn-secondary" onclick="store.sendReminder(${order.id})">Remind</button>` : ''}
                </div>
            </div>
        `).join('');
    }

    renderPaymentReminders() {
        const pendingOrders = this.orders.filter(order => order.remaining > 0);
        
        return pendingOrders.map(order => `
            <div class="reminder-item">
                <div class="reminder-customer">${order.customerName}</div>
                <div class="reminder-amount">$${order.remaining} pending</div>
                <div class="reminder-date">${new Date(order.date).toLocaleDateString()}</div>
                <button class="btn-primary" onclick="store.sendReminder(${order.id})">Send Reminder</button>
            </div>
        `).join('');
    }

    createNewOrder() {
        // Implement new order creation
        this.showNotification('New order creation feature coming soon!');
    }

    updatePayment(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const payment = prompt(`Current remaining amount: $${order.remaining}\nEnter payment amount:`);
        if (payment && !isNaN(payment)) {
            const paymentAmount = parseFloat(payment);
            if (paymentAmount <= order.remaining) {
                order.paid += paymentAmount;
                order.remaining -= paymentAmount;
                
                if (order.remaining <= 0) {
                    order.status = 'delivered';
                    order.remaining = 0;
                }
                
                this.saveToLocalStorage();
                this.renderBillingPage();
                this.showNotification('Payment updated successfully!');
            } else {
                alert('Payment amount cannot exceed remaining amount!');
            }
        }
    }

    sendReminder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        // Simulate sending reminder
        this.showNotification(`Reminder sent to ${order.customerName} for $${order.remaining} pending payment.`);
    }

    // Enhanced Customer Management
    filterCustomers() {
        const search = document.getElementById('customerSearch').value.toLowerCase();
        const filter = document.getElementById('customerFilter').value;
        
        let filteredCustomers = this.customers;
        
        if (search) {
            filteredCustomers = filteredCustomers.filter(customer => 
                customer.name.toLowerCase().includes(search) ||
                customer.email.toLowerCase().includes(search) ||
                customer.phone.includes(search)
            );
        }
        
        if (filter === 'active') {
            filteredCustomers = filteredCustomers.filter(customer => {
                const recentOrders = this.orders.filter(o => 
                    o.customerId === customer.id && 
                    new Date(o.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                );
                return recentOrders.length > 0;
            });
        } else if (filter === 'inactive') {
            filteredCustomers = filteredCustomers.filter(customer => {
                const recentOrders = this.orders.filter(o => 
                    o.customerId === customer.id && 
                    new Date(o.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                );
                return recentOrders.length === 0;
            });
        }
        
        document.getElementById('customerList').innerHTML = this.renderFilteredCustomerList(filteredCustomers);
    }

    renderFilteredCustomerList(customers) {
        return customers.map(customer => {
            const customerOrders = this.orders.filter(o => o.customerId === customer.id);
            const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
            const remainingAmount = customerOrders.reduce((sum, order) => sum + order.remaining, 0);
            
            return `
                <div class="customer-item">
                    <div class="customer-info">
                        <h4>${customer.name}</h4>
                        <p>${customer.email}</p>
                        <p>${customer.phone}</p>
                        <p class="customer-address">${customer.address || 'No address provided'}</p>
                    </div>
                    <div class="customer-stats">
                        <div class="stat-item">
                            <span class="stat-label">Total Spent</span>
                            <span class="stat-value">$${totalSpent.toFixed(2)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Remaining</span>
                            <span class="stat-value ${remainingAmount > 0 ? 'negative' : ''}">$${remainingAmount.toFixed(2)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Orders</span>
                            <span class="stat-value">${customerOrders.length}</span>
                        </div>
                    </div>
                    <div class="customer-actions">
                        <button class="btn-secondary" onclick="store.editCustomer(${customer.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-secondary" onclick="store.viewCustomerBills(${customer.id})">
                            <i class="fas fa-file-invoice"></i> Bills
                        </button>
                        <button class="btn-secondary" onclick="store.viewCustomerHistory(${customer.id})">
                            <i class="fas fa-history"></i> History
                        </button>
                        ${this.currentUser.role === 'admin' ? `
                            <button class="btn-danger" onclick="store.deleteCustomer(${customer.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    deleteCustomer(customerId) {
        if (confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
            this.customers = this.customers.filter(c => c.id !== customerId);
            this.saveToLocalStorage();
            this.renderCustomersPage();
            this.showNotification('Customer deleted successfully!');
        }
    }

    // Orders Management
    renderOrdersPage() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <header class="header">
                <div class="header-left">
                    <h1>Orders Management</h1>
                </div>
                <div class="header-right">
                    <button class="btn-primary" onclick="store.showSalesModal()">
                        <i class="fas fa-plus"></i> New Sale
                    </button>
                </div>
            </header>
            
            <section class="orders-section">
                <div class="filter-bar">
                    <select id="orderStatusFilter" onchange="store.filterOrders()">
                        <option value="">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="processing">Processing</option>
                    </select>
                    <input type="date" id="orderDateFilter" onchange="store.filterOrders()">
                    <input type="text" id="orderSearchFilter" placeholder="Search orders..." onkeyup="store.filterOrders()">
                </div>
                
                <div class="activity-card">
                    <div class="activity-header">
                        <h3>All Orders (${this.orders.length})</h3>
                        <div class="order-stats">
                            <span>Total Revenue: $${this.orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="order-list" id="orderList">
                        ${this.renderOrdersList()}
                    </div>
                </div>
            </section>
        `;
    }

    renderOrdersList() {
        return this.orders.map(order => `
            <div class="order-item detailed">
                <div class="order-header">
                    <span class="order-id">Order #${order.id}</span>
                    <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <div class="order-details">
                    <div class="customer-name">${order.customerName}</div>
                    <div class="order-products">
                        ${order.products.map(p => `${p.name} x${p.quantity}`).join(', ')}
                    </div>
                    <div class="order-amounts">
                        <span>Total: $${order.total.toFixed(2)}</span>
                        <span>Paid: $${order.paid.toFixed(2)}</span>
                        <span class="remaining ${order.remaining > 0 ? 'negative' : ''}">Remaining: $${order.remaining.toFixed(2)}</span>
                    </div>
                </div>
                <div class="order-actions">
                    <button class="btn-secondary" onclick="store.viewOrderDetails(${order.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn-secondary" onclick="store.printInvoice(${order.id})">
                        <i class="fas fa-print"></i> Print
                    </button>
                    ${order.remaining > 0 ? `
                        <button class="btn-primary" onclick="store.recordPayment(${order.id})">
                            <i class="fas fa-dollar-sign"></i> Payment
                        </button>
                    ` : ''}
                    ${this.currentUser.role === 'admin' ? `
                        <button class="btn-danger" onclick="store.deleteOrder(${order.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    printInvoice(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            this.generateInvoice(order);
        }
    }

    deleteOrder(orderId) {
        if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            this.orders = this.orders.filter(o => o.id !== orderId);
            this.saveToLocalStorage();
            this.renderOrdersPage();
            this.showNotification('Order deleted successfully!');
        }
    }

    // Inventory Management
    renderInventoryPage() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <header class="header">
                <div class="header-left">
                    <h1>Inventory Management</h1>
                </div>
                <div class="header-right">
                    <button class="btn-primary" onclick="store.showProductModal()">
                        <i class="fas fa-plus"></i> Add Product
                    </button>
                    <button class="btn-secondary" onclick="store.showImportModal('products')">
                        <i class="fas fa-upload"></i> Import Products
                    </button>
                </div>
            </header>
            
            <section class="inventory-section">
                <div class="filter-bar">
                    <select id="categoryFilter" onchange="store.filterInventory()">
                        <option value="">All Categories</option>
                        <option value="smartphones">Smartphones</option>
                        <option value="tablets">Tablets</option>
                        <option value="laptops">Laptops</option>
                        <option value="audio">Audio</option>
                        <option value="tvs">TVs</option>
                        <option value="accessories">Accessories</option>
                    </select>
                    <select id="stockFilter" onchange="store.filterInventory()">
                        <option value="">All Stock</option>
                        <option value="low">Low Stock</option>
                        <option value="out">Out of Stock</option>
                        <option value="available">Available</option>
                    </select>
                    <input type="text" id="productSearchFilter" placeholder="Search products..." onkeyup="store.filterInventory()">
                </div>
                
                <div class="inventory-alerts">
                    ${this.renderInventoryAlerts()}
                </div>
                
                <div class="activity-card">
                    <div class="activity-header">
                        <h3>Product Inventory (${this.products.length})</h3>
                        <div class="inventory-stats">
                            <span>Total Value: $${this.products.reduce((sum, p) => sum + (p.stock * p.price), 0).toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="inventory-grid" id="inventoryGrid">
                        ${this.renderInventoryGrid()}
                    </div>
                </div>
            </section>
        `;
    }

    renderInventoryAlerts() {
        const lowStockProducts = this.products.filter(p => p.stock <= (p.lowStockThreshold || 10));
        const outOfStockProducts = this.products.filter(p => p.stock === 0);
        
        let alerts = '';
        
        if (outOfStockProducts.length > 0) {
            alerts += `
                <div class="alert danger">
                    <i class="fas fa-exclamation-circle"></i>
                    <strong>Out of Stock:</strong> ${outOfStockProducts.length} products are out of stock
                </div>
            `;
        }
        
        if (lowStockProducts.length > 0) {
            alerts += `
                <div class="alert warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>Low Stock:</strong> ${lowStockProducts.length} products are running low
                </div>
            `;
        }
        
        return alerts;
    }

    renderInventoryGrid() {
        return this.products.map(product => `
            <div class="inventory-item ${product.stock === 0 ? 'out-of-stock' : product.stock <= (product.lowStockThreshold || 10) ? 'low-stock' : ''}">
                <div class="product-image">${product.image}</div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="product-category">${product.category}</p>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-stock ${product.stock === 0 ? 'out' : product.stock <= (product.lowStockThreshold || 10) ? 'low' : ''}">
                        Stock: ${product.stock}
                    </div>
                    <div class="product-sold">Sold: ${product.sold}</div>
                    <div class="product-value">Value: $${(product.stock * product.price).toFixed(2)}</div>
                </div>
                <div class="product-actions">
                    <button class="btn-secondary" onclick="store.editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-secondary" onclick="store.adjustStock(${product.id})">
                        <i class="fas fa-boxes"></i> Stock
                    </button>
                    ${this.currentUser.role === 'admin' ? `
                        <button class="btn-danger" onclick="store.deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    adjustStock(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const adjustment = prompt(`Current stock: ${product.stock}\nEnter stock adjustment (positive to add, negative to remove):`);
        if (adjustment !== null) {
            const adjustmentValue = parseInt(adjustment);
            if (!isNaN(adjustmentValue)) {
                product.stock = Math.max(0, product.stock + adjustmentValue);
                this.saveToLocalStorage();
                this.renderInventoryPage();
                this.showNotification(`Stock adjusted for ${product.name}`);
            }
        }
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            this.products = this.products.filter(p => p.id !== productId);
            this.saveToLocalStorage();
            this.renderInventoryPage();
            this.showNotification('Product deleted successfully!');
        }
    }

    viewCustomerHistory(customerId) {
        const customer = this.customers.find(c => c.id === customerId);
        const customerOrders = this.orders.filter(o => o.customerId === customerId);
        const customerReturns = this.returns.filter(r => r.customerId === customerId);
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content large-modal">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>Customer History - ${customer.name}</h2>
                
                <div class="tabs">
                    <button class="tab-button active" onclick="store.switchTab(event, 'orders-tab')">Orders</button>
                    <button class="tab-button" onclick="store.switchTab(event, 'returns-tab')">Returns</button>
                    <button class="tab-button" onclick="store.switchTab(event, 'payments-tab')">Payments</button>
                </div>
                
                <div id="orders-tab" class="tab-content active">
                    <h3>Order History</h3>
                    ${customerOrders.map(order => `
                        <div class="order-item detailed">
                            <div class="order-header">
                                <span class="order-id">Order #${order.id}</span>
                                <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
                            </div>
                            <div class="order-details">
                                <div class="order-products">
                                    ${order.products.map(p => `${p.name} x${p.quantity}`).join(', ')}
                                </div>
                                <div class="order-amounts">
                                    <span>Total: $${order.total.toFixed(2)}</span>
                                    <span>Paid: $${order.paid.toFixed(2)}</span>
                                    <span class="remaining">Remaining: $${order.remaining.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div id="returns-tab" class="tab-content">
                    <h3>Return History</h3>
                    ${customerReturns.map(ret => `
                        <div class="return-item">
                            <div class="return-header">
                                <span class="return-id">Return #${ret.id}</span>
                                <span class="return-date">${new Date(ret.date).toLocaleDateString()}</span>
                            </div>
                            <div class="return-details">
                                <div class="return-product">${ret.productName}</div>
                                <div class="return-reason">Reason: ${ret.reason}</div>
                                <div class="return-amount">Amount: $${ret.amount.toFixed(2)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div id="payments-tab" class="tab-content">
                    <h3>Payment History</h3>
                    ${customerOrders.filter(o => o.paid > 0).map(order => `
                        <div class="payment-item">
                            <div class="payment-header">
                                <span class="payment-order">Order #${order.id}</span>
                                <span class="payment-date">${new Date(order.date).toLocaleDateString()}</span>
                            </div>
                            <div class="payment-details">
                                <div class="payment-method">Method: ${order.paymentMethod}</div>
                                <div class="payment-amount">Amount: $${order.paid.toFixed(2)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    switchTab(event, tabName) {
        const tabContents = document.querySelectorAll('.tab-content');
        const tabButtons = document.querySelectorAll('.tab-button');
        
        tabContents.forEach(tab => tab.classList.remove('active'));
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        document.getElementById(tabName).classList.add('active');
        event.target.classList.add('active');
    }

    // Returns Management
    renderReturnsPage() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <header class="header">
                <div class="header-left">
                    <h1>Returns & Replacements</h1>
                </div>
                <div class="header-right">
                    <button class="btn-primary" onclick="store.showReturnModal()">
                        <i class="fas fa-plus"></i> Process Return
                    </button>
                </div>
            </header>
            
            <section class="returns-section">
                <div class="activity-card">
                    <div class="activity-header">
                        <h3>Recent Returns</h3>
                        <div class="return-stats">
                            <span>Total: ${this.returns.length}</span>
                        </div>
                    </div>
                    <div class="return-list">
                        ${this.renderReturnsList()}
                    </div>
                </div>
            </section>
        `;
    }

    renderReturnsList() {
        return this.returns.map(ret => `
            <div class="return-item">
                <div class="return-header">
                    <span class="return-id">Return #${ret.id}</span>
                    <span class="return-date">${new Date(ret.date).toLocaleDateString()}</span>
                </div>
                <div class="return-details">
                    <div class="return-product">${ret.productName}</div>
                    <div class="return-customer">Customer: ${ret.customerName}</div>
                    <div class="return-reason">Reason: ${ret.reason}</div>
                    <div class="return-amount">Amount: $${ret.amount.toFixed(2)}</div>
                    <div class="return-status">Status: ${ret.status}</div>
                </div>
                <div class="return-actions">
                    ${ret.status === 'pending' ? `
                        <button class="btn-primary" onclick="store.approveReturn(${ret.id})">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="btn-danger" onclick="store.rejectReturn(${ret.id})">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    showReturnModal() {
        const modal = document.getElementById('returnModal');
        const orderSelect = document.getElementById('returnOrderId');
        const productSelect = document.getElementById('returnProduct');
        
        // Populate order options
        orderSelect.innerHTML = '<option value="">Select Order</option>';
        this.orders.forEach(order => {
            orderSelect.innerHTML += `<option value="${order.id}">Order #${order.id} - ${order.customerName}</option>`;
        });
        
        // Handle order selection
        orderSelect.addEventListener('change', (e) => {
            const orderId = parseInt(e.target.value);
            const order = this.orders.find(o => o.id === orderId);
            
            if (order) {
                productSelect.innerHTML = '<option value="">Select Product</option>';
                order.products.forEach(product => {
                    productSelect.innerHTML += `<option value="${product.id}">${product.name} - $${product.price}</option>`;
                });
            }
        });
        
        modal.style.display = 'block';
    }

    processReturn() {
        const orderId = parseInt(document.getElementById('returnOrderId').value);
        const productId = parseInt(document.getElementById('returnProduct').value);
        const reason = document.getElementById('returnReason').value;
        const notes = document.getElementById('returnNotes').value;
        
        const order = this.orders.find(o => o.id === orderId);
        const product = order.products.find(p => p.id === productId);
        
        if (order && product) {
            const returnData = {
                id: Date.now(),
                orderId: orderId,
                customerId: order.customerId,
                customerName: order.customerName,
                productId: productId,
                productName: product.name,
                amount: product.price * product.quantity,
                reason: reason,
                notes: notes,
                date: new Date().toISOString(),
                status: 'pending'
            };
            
            this.returns.push(returnData);
            this.saveToLocalStorage();
            
            document.getElementById('returnModal').style.display = 'none';
            this.renderReturnsPage();
            this.showNotification('Return request submitted successfully!');
        }
    }

    approveReturn(returnId) {
        const returnItem = this.returns.find(r => r.id === returnId);
        if (returnItem) {
            returnItem.status = 'approved';
            
            // Update stock
            const product = this.products.find(p => p.id === returnItem.productId);
            if (product) {
                product.stock += 1;
            }
            
            this.saveToLocalStorage();
            this.renderReturnsPage();
            this.showNotification('Return approved and stock updated!');
        }
    }

    rejectReturn(returnId) {
        const returnItem = this.returns.find(r => r.id === returnId);
        if (returnItem) {
            returnItem.status = 'rejected';
            this.saveToLocalStorage();
            this.renderReturnsPage();
            this.showNotification('Return rejected!');
        }
    }

    // Notifications and Reminders
    checkLowStock() {
        const lowStockProducts = this.products.filter(p => p.stock <= (p.lowStockThreshold || 10));
        
        if (lowStockProducts.length > 0 && this.settings.lowStockAlert) {
            lowStockProducts.forEach(product => {
                this.addReminder({
                    type: 'low_stock',
                    title: 'Low Stock Alert',
                    message: `${product.name} is running low (${product.stock} remaining)`,
                    productId: product.id,
                    date: new Date().toISOString()
                });
            });
        }
    }

    checkPaymentReminders() {
        const overdueOrders = this.orders.filter(order => {
            return order.remaining > 0 && 
                   order.dueDate && 
                   new Date(order.dueDate) < new Date();
        });
        
        if (overdueOrders.length > 0 && this.settings.paymentReminders) {
            overdueOrders.forEach(order => {
                this.addReminder({
                    type: 'payment_due',
                    title: 'Payment Overdue',
                    message: `Payment of $${order.remaining.toFixed(2)} is overdue for ${order.customerName}`,
                    orderId: order.id,
                    customerId: order.customerId,
                    date: new Date().toISOString()
                });
            });
        }
    }

    checkReturnReminders() {
        const returnExpiring = this.orders.filter(order => {
            const returnDeadline = new Date(order.date);
            returnDeadline.setDate(returnDeadline.getDate() + this.settings.returnDays);
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            return returnDeadline <= tomorrow && returnDeadline > new Date();
        });
        
        returnExpiring.forEach(order => {
            this.addReminder({
                type: 'return_expiring',
                title: 'Return Period Expiring',
                message: `Return period for Order #${order.id} expires tomorrow`,
                orderId: order.id,
                customerId: order.customerId,
                date: new Date().toISOString()
            });
        });
    }

    addReminder(reminder) {
        // Check if reminder already exists
        const exists = this.reminders.find(r => 
            r.type === reminder.type && 
            r.orderId === reminder.orderId && 
            r.productId === reminder.productId
        );
        
        if (!exists) {
            reminder.id = Date.now();
            this.reminders.push(reminder);
            this.saveToLocalStorage();
        }
    }

    // Import/Export functionality
    showImportModal(type) {
        const modal = document.getElementById('importModal');
        const typeSelect = document.getElementById('importType');
        const formatDiv = document.getElementById('csvFormat');
        
        if (type) {
            typeSelect.value = type;
            this.updateCSVFormat(type);
        }
        
        typeSelect.addEventListener('change', (e) => {
            this.updateCSVFormat(e.target.value);
        });
        
        modal.style.display = 'block';
    }

    updateCSVFormat(type) {
        const formatDiv = document.getElementById('csvFormat');
        
        if (type === 'customers') {
            formatDiv.innerHTML = `
                <strong>Customer CSV Format:</strong><br>
                name,email,phone,address<br>
                "John Doe","john@example.com","555-1234","123 Main St"
            `;
        } else if (type === 'products') {
            formatDiv.innerHTML = `
                <strong>Product CSV Format:</strong><br>
                name,category,price,stock,warranty,lowStockThreshold<br>
                "iPhone 15","smartphones",999.99,25,12,10
            `;
        } else {
            formatDiv.innerHTML = 'Select import type to see format';
        }
    }

    importCSV() {
        const type = document.getElementById('importType').value;
        const fileInput = document.getElementById('importFile');
        const file = fileInput.files[0];
        
        if (!file) {
            alert('Please select a CSV file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const csv = e.target.result;
            const lines = csv.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            
            let imported = 0;
            
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
                
                if (type === 'customers') {
                    const customer = {
                        id: Date.now() + i,
                        name: values[0],
                        email: values[1],
                        phone: values[2],
                        address: values[3] || '',
                        createdAt: new Date().toISOString()
                    };
                    this.customers.push(customer);
                    imported++;
                } else if (type === 'products') {
                    const product = {
                        id: Date.now() + i,
                        name: values[0],
                        category: values[1],
                        price: parseFloat(values[2]) || 0,
                        stock: parseInt(values[3]) || 0,
                        warranty: parseInt(values[4]) || 12,
                        lowStockThreshold: parseInt(values[5]) || 10,
                        sold: 0,
                        image: this.getProductIcon(values[1])
                    };
                    this.products.push(product);
                    imported++;
                }
            }
            
            this.saveToLocalStorage();
            document.getElementById('importModal').style.display = 'none';
            this.showNotification(`Successfully imported ${imported} ${type}`);
            
            // Refresh current page
            if (type === 'customers') {
                this.renderCustomersPage();
            } else if (type === 'products') {
                this.renderProductsPage();
            }
        };
        
        reader.readAsText(file);
    }

    getProductIcon(category) {
        const icons = {
            smartphones: '📱',
            tablets: '📱',
            laptops: '💻',
            audio: '🎧',
            tvs: '📺',
            accessories: '🔌'
        };
        return icons[category] || '📦';
    }

    // Sales Management
    showSalesModal() {
        const modal = document.getElementById('salesModal');
        const customerSelect = document.getElementById('saleCustomer');
        const dateInput = document.getElementById('saleDate');
        
        // Populate customers
        customerSelect.innerHTML = '<option value="">Select Customer</option>';
        this.customers.forEach(customer => {
            customerSelect.innerHTML += `<option value="${customer.id}">${customer.name}</option>`;
        });
        
        // Set today's date
        dateInput.value = new Date().toISOString().split('T')[0];
        
        // Setup product rows
        this.setupProductRows();
        
        modal.style.display = 'block';
    }

    setupProductRows() {
        const addProductBtn = document.getElementById('addProduct');
        const saleProducts = document.getElementById('saleProducts');
        
        // Setup initial product row
        this.updateProductSelects();
        
        // Add product button handler
        addProductBtn.addEventListener('click', () => {
            const newRow = document.createElement('div');
            newRow.className = 'product-row';
            newRow.innerHTML = `
                <select class="product-select" required>
                    <option value="">Select Product</option>
                    ${this.products.map(p => `<option value="${p.id}" data-price="${p.price}">${p.name} - $${p.price}</option>`).join('')}
                </select>
                <input type="number" class="quantity-input" placeholder="Qty" min="1" required>
                <input type="number" class="price-input" placeholder="Price" step="0.01" readonly>
                <button type="button" class="btn-danger remove-product">Remove</button>
            `;
            saleProducts.appendChild(newRow);
            
            // Add event listeners for new row
            this.setupProductRowEvents(newRow);
        });
        
        // Setup existing rows
        document.querySelectorAll('.product-row').forEach(row => {
            this.setupProductRowEvents(row);
        });
    }

    setupProductRowEvents(row) {
        const productSelect = row.querySelector('.product-select');
        const quantityInput = row.querySelector('.quantity-input');
        const priceInput = row.querySelector('.price-input');
        const removeBtn = row.querySelector('.remove-product');
        
        productSelect.addEventListener('change', (e) => {
            const selectedOption = e.target.selectedOptions[0];
            const price = selectedOption.dataset.price;
            priceInput.value = price || '';
            this.calculateSaleTotal();
        });
        
        quantityInput.addEventListener('input', () => {
            this.calculateSaleTotal();
        });
        
        removeBtn.addEventListener('click', () => {
            if (document.querySelectorAll('.product-row').length > 1) {
                row.remove();
                this.calculateSaleTotal();
            }
        });
    }

    updateProductSelects() {
        document.querySelectorAll('.product-select').forEach(select => {
            select.innerHTML = '<option value="">Select Product</option>';
            this.products.forEach(product => {
                select.innerHTML += `<option value="${product.id}" data-price="${product.price}">${product.name} - $${product.price}</option>`;
            });
        });
    }

    calculateSaleTotal() {
        const productRows = document.querySelectorAll('.product-row');
        let subtotal = 0;
        
        productRows.forEach(row => {
            const quantity = parseFloat(row.querySelector('.quantity-input').value) || 0;
            const price = parseFloat(row.querySelector('.price-input').value) || 0;
            subtotal += quantity * price;
        });
        
        const discount = parseFloat(document.getElementById('saleDiscount').value) || 0;
        const discountAmount = subtotal * (discount / 100);
        const afterDiscount = subtotal - discountAmount;
        const tax = afterDiscount * (this.settings.taxRate / 100);
        const total = afterDiscount + tax;
        const amountPaid = parseFloat(document.getElementById('saleAmountPaid').value) || 0;
        const remaining = Math.max(0, total - amountPaid);
        
        document.getElementById('saleSubtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('saleDiscountAmount').textContent = `$${discountAmount.toFixed(2)}`;
        document.getElementById('saleTax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('saleTotal').textContent = `$${total.toFixed(2)}`;
        document.getElementById('saleRemaining').textContent = `$${remaining.toFixed(2)}`;
    }

    completeSale() {
        const customerId = parseInt(document.getElementById('saleCustomer').value);
        const date = document.getElementById('saleDate').value;
        const discount = parseFloat(document.getElementById('saleDiscount').value) || 0;
        const paymentMethod = document.getElementById('salePaymentMethod').value;
        const amountPaid = parseFloat(document.getElementById('saleAmountPaid').value) || 0;
        
        const customer = this.customers.find(c => c.id === customerId);
        if (!customer) {
            alert('Please select a customer');
            return;
        }
        
        const products = [];
        const productRows = document.querySelectorAll('.product-row');
        
        productRows.forEach(row => {
            const productId = parseInt(row.querySelector('.product-select').value);
            const quantity = parseInt(row.querySelector('.quantity-input').value);
            const price = parseFloat(row.querySelector('.price-input').value);
            
            if (productId && quantity && price) {
                const product = this.products.find(p => p.id === productId);
                if (product) {
                    products.push({
                        id: productId,
                        name: product.name,
                        quantity: quantity,
                        price: price
                    });
                    
                    // Update product stock and sales
                    product.stock -= quantity;
                    product.sold += quantity;
                }
            }
        });
        
        if (products.length === 0) {
            alert('Please add at least one product');
            return;
        }
        
        const subtotal = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
        const discountAmount = subtotal * (discount / 100);
        const afterDiscount = subtotal - discountAmount;
        const tax = afterDiscount * (this.settings.taxRate / 100);
        const total = afterDiscount + tax;
        const remaining = Math.max(0, total - amountPaid);
        
        const order = {
            id: Date.now(),
            customerId: customerId,
            customerName: customer.name,
            products: products,
            subtotal: subtotal,
            discount: discountAmount,
            tax: tax,
            total: total,
            paid: amountPaid,
            remaining: remaining,
            status: remaining > 0 ? 'pending' : 'completed',
            paymentMethod: paymentMethod,
            date: new Date(date).toISOString(),
            dueDate: remaining > 0 ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null
        };
        
        this.orders.push(order);
        this.saveToLocalStorage();
        
        document.getElementById('salesModal').style.display = 'none';
        this.showNotification('Sale completed successfully!');
        
        // Generate invoice
        this.generateInvoice(order);
    }

    generateInvoice(order) {
        const invoice = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #667eea; margin: 0;">${this.settings.companyName}</h1>
                    <p style="margin: 5px 0; color: #666;">${this.settings.companyAddress}</p>
                    <p style="margin: 5px 0; color: #666;">${this.settings.companyPhone} | ${this.settings.companyEmail}</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">INVOICE</h2>
                    <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                        <div>
                            <p><strong>Invoice #:</strong> ${order.id}</p>
                            <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                        </div>
                        <div style="text-align: right;">
                            <p><strong>Bill To:</strong></p>
                            <p>${order.customerName}</p>
                        </div>
                    </div>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <thead>
                        <tr style="background: #f8f9fa;">
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Product</th>
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Qty</th>
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Price</th>
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.products.map(product => `
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 12px;">${product.name}</td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${product.quantity}</td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$${product.price.toFixed(2)}</td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$${(product.quantity * product.price).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div style="margin-left: auto; width: 300px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>Subtotal:</span>
                        <span>$${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>Discount:</span>
                        <span>-$${order.discount.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>Tax (${this.settings.taxRate}%):</span>
                        <span>$${order.tax.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold; font-size: 16px; border-top: 1px solid #ddd; padding-top: 5px;">
                        <span>Total:</span>
                        <span>$${order.total.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>Paid:</span>
                        <span>$${order.paid.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: ${order.remaining > 0 ? '#e53e3e' : '#38a169'}; font-weight: bold;">
                        <span>Remaining:</span>
                        <span>$${order.remaining.toFixed(2)}</span>
                    </div>
                </div>
                
                <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
                    <p>Thank you for your business!</p>
                    <p>Return Policy: Items can be returned within ${this.settings.returnDays} days of purchase.</p>
                </div>
            </div>
        `;
        
        // Open invoice in new window
        const invoiceWindow = window.open('', '_blank');
        invoiceWindow.document.write(invoice);
        invoiceWindow.document.close();
        invoiceWindow.print();
    }

    // Reports Management
    renderReportsPage() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <header class="header">
                <div class="header-left">
                    <h1>Reports & Analytics</h1>
                </div>
                <div class="header-right">
                    <button class="btn-primary" onclick="store.generateReport()">
                        <i class="fas fa-download"></i> Generate Report
                    </button>
                </div>
            </header>
            
            <section class="reports-section">
                <div class="filter-bar">
                    <select id="reportType">
                        <option value="daily">Daily Sales</option>
                        <option value="weekly">Weekly Sales</option>
                        <option value="monthly">Monthly Sales</option>
                        <option value="customer">Customer Summary</option>
                        <option value="product">Product Performance</option>
                    </select>
                    <input type="date" id="reportStartDate" value="${new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0]}">
                    <input type="date" id="reportEndDate" value="${new Date().toISOString().split('T')[0]}">
                    <button class="btn-secondary" onclick="store.filterReports()">Filter</button>
                </div>
                
                <div class="reports-grid">
                    <div class="activity-card">
                        <div class="activity-header">
                            <h3>Sales Summary</h3>
                        </div>
                        <div class="report-content" id="salesSummary">
                            ${this.generateSalesSummary()}
                        </div>
                    </div>
                    
                    <div class="activity-card">
                        <div class="activity-header">
                            <h3>Top Customers</h3>
                        </div>
                        <div class="report-content" id="topCustomers">
                            ${this.generateTopCustomers()}
                        </div>
                    </div>
                    
                    <div class="activity-card">
                        <div class="activity-header">
                            <h3>Product Performance</h3>
                        </div>
                        <div class="report-content" id="productPerformance">
                            ${this.generateProductPerformance()}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    generateSalesSummary() {
        const totalSales = this.orders.reduce((sum, order) => sum + order.total, 0);
        const totalPaid = this.orders.reduce((sum, order) => sum + order.paid, 0);
        const totalRemaining = this.orders.reduce((sum, order) => sum + order.remaining, 0);
        
        return `
            <div class="summary-stats">
                <div class="stat-item">
                    <span class="stat-label">Total Sales</span>
                    <span class="stat-value">$${totalSales.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total Paid</span>
                    <span class="stat-value">$${totalPaid.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Outstanding</span>
                    <span class="stat-value negative">$${totalRemaining.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Orders</span>
                    <span class="stat-value">${this.orders.length}</span>
                </div>
            </div>
        `;
    }

    generateTopCustomers() {
        const customerStats = this.customers.map(customer => {
            const customerOrders = this.orders.filter(o => o.customerId === customer.id);
            const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
            return { ...customer, totalSpent, orderCount: customerOrders.length };
        }).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

        return customerStats.map(customer => `
            <div class="customer-stat">
                <div class="customer-info">
                    <h4>${customer.name}</h4>
                    <p>${customer.email}</p>
                </div>
                <div class="customer-metrics">
                    <span class="metric">$${customer.totalSpent.toFixed(2)}</span>
                    <span class="metric-label">${customer.orderCount} orders</span>
                </div>
            </div>
        `).join('');
    }

    generateProductPerformance() {
        const sortedProducts = [...this.products].sort((a, b) => b.sold - a.sold).slice(0, 5);
        
        return sortedProducts.map(product => `
            <div class="product-stat">
                <div class="product-info">
                    <span class="product-icon">${product.image}</span>
                    <div>
                        <h4>${product.name}</h4>
                        <p>${product.category}</p>
                    </div>
                </div>
                <div class="product-metrics">
                    <span class="metric">${product.sold} sold</span>
                    <span class="metric-label">$${(product.price * product.sold).toFixed(2)} revenue</span>
                </div>
            </div>
        `).join('');
    }

    // Reminders Management
    renderRemindersPage() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <header class="header">
                <div class="header-left">
                    <h1>Reminders & Notifications</h1>
                </div>
                <div class="header-right">
                    <button class="btn-secondary" onclick="store.markAllRead()">
                        <i class="fas fa-check"></i> Mark All Read
                    </button>
                </div>
            </header>
            
            <section class="reminders-section">
                <div class="activity-card">
                    <div class="activity-header">
                        <h3>Active Reminders (${this.reminders.length})</h3>
                    </div>
                    <div class="reminder-list">
                        ${this.renderRemindersList()}
                    </div>
                </div>
            </section>
        `;
    }

    renderRemindersList() {
        if (this.reminders.length === 0) {
            return '<p class="no-reminders">No active reminders</p>';
        }

        return this.reminders.map(reminder => `
            <div class="reminder-item ${reminder.type}">
                <div class="reminder-icon">
                    <i class="fas ${this.getReminderIcon(reminder.type)}"></i>
                </div>
                <div class="reminder-content">
                    <h4>${reminder.title}</h4>
                    <p>${reminder.message}</p>
                    <span class="reminder-date">${new Date(reminder.date).toLocaleDateString()}</span>
                </div>
                <div class="reminder-actions">
                    <button class="btn-secondary" onclick="store.dismissReminder(${reminder.id})">
                        <i class="fas fa-times"></i> Dismiss
                    </button>
                </div>
            </div>
        `).join('');
    }

    getReminderIcon(type) {
        const icons = {
            low_stock: 'fa-exclamation-triangle',
            payment_due: 'fa-dollar-sign',
            return_expiring: 'fa-undo',
            birthday: 'fa-birthday-cake'
        };
        return icons[type] || 'fa-bell';
    }

    dismissReminder(reminderId) {
        this.reminders = this.reminders.filter(r => r.id !== reminderId);
        this.saveToLocalStorage();
        this.renderRemindersPage();
    }

    markAllRead() {
        this.reminders = [];
        this.saveToLocalStorage();
        this.renderRemindersPage();
        this.showNotification('All reminders marked as read');
    }

    // Settings Management
    renderSettingsPage() {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <header class="header">
                <div class="header-left">
                    <h1>Settings & Configuration</h1>
                </div>
                <div class="header-right">
                    <button class="btn-primary" onclick="store.saveSettings()">
                        <i class="fas fa-save"></i> Save Settings
                    </button>
                </div>
            </header>
            
            <section class="settings-section">
                <div class="settings-grid">
                    <div class="activity-card">
                        <div class="activity-header">
                            <h3>Business Settings</h3>
                        </div>
                        <div class="settings-form">
                            <div class="form-group">
                                <label for="companyName">Company Name:</label>
                                <input type="text" id="companyName" value="${this.settings.companyName}">
                            </div>
                            <div class="form-group">
                                <label for="companyAddress">Address:</label>
                                <textarea id="companyAddress" rows="3">${this.settings.companyAddress}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="companyPhone">Phone:</label>
                                <input type="tel" id="companyPhone" value="${this.settings.companyPhone}">
                            </div>
                            <div class="form-group">
                                <label for="companyEmail">Email:</label>
                                <input type="email" id="companyEmail" value="${this.settings.companyEmail}">
                            </div>
                        </div>
                    </div>
                    
                    <div class="activity-card">
                        <div class="activity-header">
                            <h3>System Settings</h3>
                        </div>
                        <div class="settings-form">
                            <div class="form-group">
                                <label for="taxRate">Tax Rate (%):</label>
                                <input type="number" id="taxRate" step="0.1" value="${this.settings.taxRate}">
                            </div>
                            <div class="form-group">
                                <label for="returnDays">Return Period (days):</label>
                                <input type="number" id="returnDays" value="${this.settings.returnDays}">
                            </div>
                            <div class="form-group">
                                <label for="theme">Theme:</label>
                                <select id="theme">
                                    <option value="default" ${this.settings.theme === 'default' ? 'selected' : ''}>Default</option>
                                    <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                                    <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>Light</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="activity-card">
                        <div class="activity-header">
                            <h3>Notification Settings</h3>
                        </div>
                        <div class="settings-form">
                            <div class="form-group checkbox-group">
                                <label>
                                    <input type="checkbox" id="lowStockAlert" ${this.settings.lowStockAlert ? 'checked' : ''}>
                                    Low Stock Alerts
                                </label>
                            </div>
                            <div class="form-group checkbox-group">
                                <label>
                                    <input type="checkbox" id="paymentReminders" ${this.settings.paymentReminders ? 'checked' : ''}>
                                    Payment Reminders
                                </label>
                            </div>
                            <div class="form-group checkbox-group">
                                <label>
                                    <input type="checkbox" id="emailInvoices" ${this.settings.emailInvoices ? 'checked' : ''}>
                                    Email Invoices
                                </label>
                            </div>
                            <div class="form-group checkbox-group">
                                <label>
                                    <input type="checkbox" id="autoBackup" ${this.settings.autoBackup ? 'checked' : ''}>
                                    Auto Backup
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="activity-card">
                        <div class="activity-header">
                            <h3>Data Management</h3>
                        </div>
                        <div class="settings-form">
                            <div class="form-group">
                                <button class="btn-secondary" onclick="store.exportData()">
                                    <i class="fas fa-download"></i> Export All Data
                                </button>
                            </div>
                            <div class="form-group">
                                <button class="btn-warning" onclick="store.backupData()">
                                    <i class="fas fa-save"></i> Backup Data
                                </button>
                            </div>
                            <div class="form-group">
                                <button class="btn-danger" onclick="store.clearAllData()">
                                    <i class="fas fa-trash"></i> Clear All Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    saveSettings() {
        this.settings = {
            companyName: document.getElementById('companyName').value,
            companyAddress: document.getElementById('companyAddress').value,
            companyPhone: document.getElementById('companyPhone').value,
            companyEmail: document.getElementById('companyEmail').value,
            taxRate: parseFloat(document.getElementById('taxRate').value),
            returnDays: parseInt(document.getElementById('returnDays').value),
            theme: document.getElementById('theme').value,
            lowStockAlert: document.getElementById('lowStockAlert').checked,
            paymentReminders: document.getElementById('paymentReminders').checked,
            emailInvoices: document.getElementById('emailInvoices').checked,
            autoBackup: document.getElementById('autoBackup').checked
        };
        
        this.saveToLocalStorage();
        this.showNotification('Settings saved successfully!');
    }

    exportData() {
        const data = {
            customers: this.customers,
            products: this.products,
            orders: this.orders,
            returns: this.returns,
            settings: this.settings
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `electrastore_backup_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showNotification('Data exported successfully!');
    }

    backupData() {
        const backup = {
            timestamp: new Date().toISOString(),
            data: {
                customers: this.customers,
                products: this.products,
                orders: this.orders,
                returns: this.returns,
                settings: this.settings
            }
        };
        
        localStorage.setItem('electrastore_backup', JSON.stringify(backup));
        this.showNotification('Data backed up successfully!');
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            localStorage.clear();
            location.reload();
        }
    }

    // Utility Functions
    saveToLocalStorage() {
        localStorage.setItem('customers', JSON.stringify(this.customers));
        localStorage.setItem('products', JSON.stringify(this.products));
        localStorage.setItem('orders', JSON.stringify(this.orders));
        localStorage.setItem('bills', JSON.stringify(this.bills));
        localStorage.setItem('messages', JSON.stringify(this.messages));
        localStorage.setItem('returns', JSON.stringify(this.returns));
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('settings', JSON.stringify(this.settings));
        localStorage.setItem('reminders', JSON.stringify(this.reminders));
        localStorage.setItem('salesHistory', JSON.stringify(this.salesHistory));
    }

    handleSearch(query) {
        if (!query) return;
        
        // Search across customers, products, and orders
        console.log('Searching for:', query);
        // Implement search functionality
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #FF6B35, #F7931E);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize the store when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.store = new ElectronicsStore();
});

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    
    .product-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }
    
    .product-card:hover {
        transform: translateY(-5px);
    }
    
    .product-image {
        font-size: 40px;
        text-align: center;
        margin-bottom: 15px;
    }
    
    .product-info h4 {
        margin-bottom: 8px;
        color: #2D3748;
    }
    
    .product-category {
        color: #718096;
        font-size: 12px;
        text-transform: uppercase;
        margin-bottom: 8px;
    }
    
    .product-price {
        font-size: 18px;
        font-weight: 600;
        color: #FF6B35;
        margin-bottom: 8px;
    }
    
    .product-stock, .product-sold {
        font-size: 12px;
        color: #4A5568;
        margin-bottom: 4px;
    }
    
    .product-actions {
        display: flex;
        gap: 8px;
        margin-top: 15px;
    }
    
    .product-actions button {
        flex: 1;
        padding: 8px 12px;
        font-size: 12px;
    }
    
    .billing-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 24px;
    }
    
    .order-item.detailed {
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
    }
    
    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }
    
    .order-id {
        font-weight: 600;
        color: #2D3748;
    }
    
    .order-details {
        margin-bottom: 12px;
    }
    
    .customer-name {
        font-weight: 500;
        color: #4A5568;
        margin-bottom: 4px;
    }
    
    .order-products {
        font-size: 12px;
        color: #718096;
        margin-bottom: 8px;
    }
    
    .order-amounts {
        display: flex;
        gap: 16px;
        font-size: 12px;
    }
    
    .order-amounts .remaining {
        color: #E53E3E;
        font-weight: 600;
    }
    
    .order-actions {
        display: flex;
        gap: 8px;
    }
    
    .order-actions button {
        padding: 6px 12px;
        font-size: 12px;
    }
    
    .reminder-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        margin-bottom: 12px;
    }
    
    .reminder-customer {
        font-weight: 600;
        color: #2D3748;
    }
    
    .reminder-amount {
        color: #E53E3E;
        font-weight: 500;
    }
    
    .reminder-date {
        font-size: 12px;
        color: #718096;
    }
    
    .customer-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        margin-bottom: 12px;
    }
    
    .customer-actions {
        display: flex;
        gap: 8px;
    }
    
    .customer-actions button {
        padding: 6px 12px;
        font-size: 12px;
    }
`;
document.head.appendChild(style);