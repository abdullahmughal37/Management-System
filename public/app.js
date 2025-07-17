// Enhanced ElectraStore Frontend - SQLite Integration
class ElectraStoreApp {
    constructor() {
        this.apiUrl = '/api';
        this.token = localStorage.getItem('authToken');
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.currentPage = 'dashboard';
        
        this.init();
    }

    init() {
        if (!this.token || !this.currentUser) {
            this.showLogin();
            return;
        }

        this.setupEventListeners();
        this.loadDashboard();
        this.setupNavigation();
        this.loadReminders();
    }

    // Authentication Methods
    async login(username, password) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                this.currentUser = data.user;
                localStorage.setItem('authToken', this.token);
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                
                this.hideLogin();
                this.init();
                this.showNotification('Login successful!', 'success');
            } else {
                this.showNotification(data.error || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    async logout() {
        try {
            await fetch(`${this.apiUrl}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        this.showLogin();
    }

    // API Request Helper
    async apiRequest(endpoint, options = {}) {
        const url = `${this.apiUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            ...options
        };

        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (response.status === 401) {
                this.logout();
                return null;
            }

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API request error:', error);
            this.showNotification(error.message, 'error');
            throw error;
        }
    }

    // Dashboard Methods
    async loadDashboard() {
        try {
            const stats = await this.apiRequest('/reports/dashboard');
            this.renderDashboard(stats);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    renderDashboard(stats) {
        const dashboardHTML = `
            <div class="dashboard-content">
                <h2>Dashboard Overview</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">👥</div>
                        <div class="stat-info">
                            <h3>${stats.totalCustomers}</h3>
                            <p>Total Customers</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📦</div>
                        <div class="stat-info">
                            <h3>${stats.totalProducts}</h3>
                            <p>Total Products</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🛒</div>
                        <div class="stat-info">
                            <h3>${stats.totalOrders}</h3>
                            <p>Total Orders</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-info">
                            <h3>$${stats.totalSales?.toFixed(2) || '0.00'}</h3>
                            <p>Total Sales</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💳</div>
                        <div class="stat-info">
                            <h3>$${stats.totalPaid?.toFixed(2) || '0.00'}</h3>
                            <p>Total Paid</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⏰</div>
                        <div class="stat-info">
                            <h3>$${stats.totalDue?.toFixed(2) || '0.00'}</h3>
                            <p>Total Due</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📈</div>
                        <div class="stat-info">
                            <h3>$${stats.todaySales?.toFixed(2) || '0.00'}</h3>
                            <p>Today's Sales</p>
                        </div>
                    </div>
                    <div class="stat-card ${stats.lowStockProducts > 0 ? 'alert' : ''}">
                        <div class="stat-icon">⚠️</div>
                        <div class="stat-info">
                            <h3>${stats.lowStockProducts}</h3>
                            <p>Low Stock Items</p>
                        </div>
                    </div>
                    <div class="stat-card ${stats.pendingReturns > 0 ? 'alert' : ''}">
                        <div class="stat-icon">🔄</div>
                        <div class="stat-info">
                            <h3>${stats.pendingReturns}</h3>
                            <p>Pending Returns</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = dashboardHTML;
    }

    // Customer Methods
    async loadCustomers() {
        try {
            const customers = await this.apiRequest('/customers');
            this.renderCustomers(customers);
        } catch (error) {
            console.error('Error loading customers:', error);
        }
    }

    renderCustomers(customers) {
        const customersHTML = `
            <div class="customers-content">
                <div class="section-header">
                    <h2>Customer Management</h2>
                    <div class="header-actions">
                        <button onclick="app.showAddCustomerModal()" class="btn btn-primary">
                            <i class="fas fa-plus"></i> Add Customer
                        </button>
                        <button onclick="app.showImportCustomersModal()" class="btn btn-secondary">
                            <i class="fas fa-upload"></i> Import CSV
                        </button>
                    </div>
                </div>
                
                <div class="search-bar">
                    <input type="text" id="customerSearch" placeholder="Search customers..." onkeyup="app.searchCustomers()">
                </div>

                <div class="customers-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Total Amount</th>
                                <th>Paid Amount</th>
                                <th>Due Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${customers.map(customer => `
                                <tr>
                                    <td>${customer.name}</td>
                                    <td>${customer.phone}</td>
                                    <td>${customer.email || 'N/A'}</td>
                                    <td>$${customer.total_amount?.toFixed(2) || '0.00'}</td>
                                    <td>$${customer.paid_amount?.toFixed(2) || '0.00'}</td>
                                    <td>$${customer.due_amount?.toFixed(2) || '0.00'}</td>
                                    <td>
                                        <button onclick="app.editCustomer(${customer.id})" class="btn btn-sm btn-secondary">Edit</button>
                                        <button onclick="app.viewCustomerOrders(${customer.id})" class="btn btn-sm btn-info">Orders</button>
                                        ${this.currentUser.role === 'admin' ? `<button onclick="app.deleteCustomer(${customer.id})" class="btn btn-sm btn-danger">Delete</button>` : ''}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = customersHTML;
    }

    async addCustomer(customerData) {
        try {
            await this.apiRequest('/customers', {
                method: 'POST',
                body: customerData
            });
            this.showNotification('Customer added successfully!', 'success');
            this.loadCustomers();
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    }

    // Product Methods
    async loadProducts() {
        try {
            const [products, categories] = await Promise.all([
                this.apiRequest('/products'),
                this.apiRequest('/categories')
            ]);
            this.renderProducts(products, categories);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    renderProducts(products, categories) {
        const productsHTML = `
            <div class="products-content">
                <div class="section-header">
                    <h2>Product Management</h2>
                    <div class="header-actions">
                        <button onclick="app.showAddProductModal()" class="btn btn-primary">
                            <i class="fas fa-plus"></i> Add Product
                        </button>
                        <button onclick="app.showAddCategoryModal()" class="btn btn-secondary">
                            <i class="fas fa-tag"></i> Add Category
                        </button>
                        <button onclick="app.showImportProductsModal()" class="btn btn-secondary">
                            <i class="fas fa-upload"></i> Import CSV
                        </button>
                    </div>
                </div>

                <div class="filters">
                    <select id="categoryFilter" onchange="app.filterProducts()">
                        <option value="">All Categories</option>
                        ${categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('')}
                    </select>
                    <label>
                        <input type="checkbox" id="lowStockFilter" onchange="app.filterProducts()">
                        Show Low Stock Only
                    </label>
                </div>

                <div class="products-grid">
                    ${products.map(product => `
                        <div class="product-card ${product.stock <= product.low_stock_threshold ? 'low-stock' : ''}">
                            <div class="product-header">
                                <h3>${product.name}</h3>
                                <span class="product-category">${product.category_name}</span>
                            </div>
                            <div class="product-info">
                                <p><strong>Price:</strong> $${product.price?.toFixed(2)}</p>
                                <p><strong>Stock:</strong> ${product.stock}</p>
                                <p><strong>Brand:</strong> ${product.brand || 'N/A'}</p>
                                ${product.stock <= product.low_stock_threshold ? '<p class="low-stock-warning">⚠️ Low Stock!</p>' : ''}
                            </div>
                            <div class="product-actions">
                                <button onclick="app.editProduct(${product.id})" class="btn btn-sm btn-secondary">Edit</button>
                                <button onclick="app.adjustStock(${product.id})" class="btn btn-sm btn-info">Stock</button>
                                ${this.currentUser.role === 'admin' ? `<button onclick="app.deleteProduct(${product.id})" class="btn btn-sm btn-danger">Delete</button>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = productsHTML;
    }

    async addProduct(productData) {
        try {
            await this.apiRequest('/products', {
                method: 'POST',
                body: productData
            });
            this.showNotification('Product added successfully!', 'success');
            this.loadProducts();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    }

    async addCategory(categoryData) {
        try {
            await this.apiRequest('/categories', {
                method: 'POST',
                body: categoryData
            });
            this.showNotification('Category added successfully!', 'success');
            this.loadProducts();
        } catch (error) {
            console.error('Error adding category:', error);
        }
    }

    // Order Methods
    async loadOrders() {
        try {
            const orders = await this.apiRequest('/orders');
            this.renderOrders(orders);
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    }

    renderOrders(orders) {
        const ordersHTML = `
            <div class="orders-content">
                <div class="section-header">
                    <h2>Order Management</h2>
                    <div class="header-actions">
                        <button onclick="app.showNewSaleModal()" class="btn btn-primary">
                            <i class="fas fa-plus"></i> New Sale
                        </button>
                    </div>
                </div>

                <div class="orders-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Due</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders.map(order => `
                                <tr>
                                    <td>${order.order_number}</td>
                                    <td>${order.customer_name}</td>
                                    <td>${new Date(order.created_at).toLocaleDateString()}</td>
                                    <td>$${order.total_amount?.toFixed(2)}</td>
                                    <td>$${order.paid_amount?.toFixed(2)}</td>
                                    <td>$${order.due_amount?.toFixed(2)}</td>
                                    <td><span class="status-badge ${order.status}">${order.status}</span></td>
                                    <td>
                                        <button onclick="app.viewOrder(${order.id})" class="btn btn-sm btn-info">View</button>
                                        ${order.due_amount > 0 ? `<button onclick="app.addPayment(${order.id})" class="btn btn-sm btn-success">Pay</button>` : ''}
                                        <button onclick="app.printInvoice(${order.id})" class="btn btn-sm btn-secondary">Print</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = ordersHTML;
    }

    async createOrder(orderData) {
        try {
            const result = await this.apiRequest('/orders', {
                method: 'POST',
                body: orderData
            });
            this.showNotification('Order created successfully!', 'success');
            this.loadOrders();
            return result;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    // Payment Methods
    async addPayment(orderId) {
        const order = await this.apiRequest(`/orders/${orderId}`);
        const amount = prompt(`Enter payment amount (Due: $${order.due_amount?.toFixed(2)}):`);
        
        if (amount && parseFloat(amount) > 0) {
            try {
                await this.apiRequest('/payments', {
                    method: 'POST',
                    body: {
                        order_id: orderId,
                        customer_id: order.customer_id,
                        amount: parseFloat(amount),
                        payment_method: 'cash',
                        notes: 'Payment received'
                    }
                });
                this.showNotification('Payment recorded successfully!', 'success');
                this.loadOrders();
            } catch (error) {
                console.error('Error recording payment:', error);
            }
        }
    }

    // Return Methods
    async loadReturns() {
        try {
            const returns = await this.apiRequest('/returns');
            this.renderReturns(returns);
        } catch (error) {
            console.error('Error loading returns:', error);
        }
    }

    renderReturns(returns) {
        const returnsHTML = `
            <div class="returns-content">
                <div class="section-header">
                    <h2>Return Management</h2>
                </div>

                <div class="returns-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${returns.map(returnItem => `
                                <tr>
                                    <td>${returnItem.order_number}</td>
                                    <td>${returnItem.customer_name}</td>
                                    <td>${returnItem.product_name}</td>
                                    <td>${returnItem.quantity}</td>
                                    <td>${returnItem.reason}</td>
                                    <td><span class="status-badge ${returnItem.status}">${returnItem.status}</span></td>
                                    <td>${new Date(returnItem.return_date).toLocaleDateString()}</td>
                                    <td>
                                        ${returnItem.status === 'pending' && (this.currentUser.role === 'admin' || this.currentUser.role === 'staff') ? 
                                            `<button onclick="app.approveReturn(${returnItem.id})" class="btn btn-sm btn-success">Approve</button>
                                             <button onclick="app.rejectReturn(${returnItem.id})" class="btn btn-sm btn-danger">Reject</button>` : 
                                            'N/A'}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = returnsHTML;
    }

    async approveReturn(returnId) {
        const refundAmount = prompt('Enter refund amount:');
        if (refundAmount && parseFloat(refundAmount) > 0) {
            try {
                await this.apiRequest(`/returns/${returnId}/approve`, {
                    method: 'PUT',
                    body: { refund_amount: parseFloat(refundAmount) }
                });
                this.showNotification('Return approved successfully!', 'success');
                this.loadReturns();
            } catch (error) {
                console.error('Error approving return:', error);
            }
        }
    }

    // Import Methods
    async importCustomers(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${this.apiUrl}/import/customers`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                this.showNotification(result.message, 'success');
                this.loadCustomers();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error importing customers:', error);
            this.showNotification(error.message, 'error');
        }
    }

    async importProducts(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${this.apiUrl}/import/products`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                this.showNotification(result.message, 'success');
                this.loadProducts();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error importing products:', error);
            this.showNotification(error.message, 'error');
        }
    }

    // Settings Methods
    async loadSettings() {
        try {
            const settings = await this.apiRequest('/settings');
            this.renderSettings(settings);
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    renderSettings(settings) {
        const settingsHTML = `
            <div class="settings-content">
                <h2>System Settings</h2>
                
                <form id="settingsForm" onsubmit="app.saveSettings(event)">
                    <div class="settings-section">
                        <h3>Business Information</h3>
                        <div class="form-group">
                            <label>Company Name:</label>
                            <input type="text" name="company_name" value="${settings.company_name || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Company Address:</label>
                            <textarea name="company_address">${settings.company_address || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Company Phone:</label>
                            <input type="text" name="company_phone" value="${settings.company_phone || ''}">
                        </div>
                        <div class="form-group">
                            <label>Company Email:</label>
                            <input type="email" name="company_email" value="${settings.company_email || ''}">
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>System Configuration</h3>
                        <div class="form-group">
                            <label>Tax Rate (%):</label>
                            <input type="number" name="tax_rate" value="${settings.tax_rate || '0'}" step="0.01" min="0" max="100">
                        </div>
                        <div class="form-group">
                            <label>Return Policy (days):</label>
                            <input type="number" name="return_days" value="${settings.return_days || '7'}" min="1" max="365">
                        </div>
                        <div class="form-group">
                            <label>Currency Symbol:</label>
                            <input type="text" name="currency_symbol" value="${settings.currency_symbol || '$'}" maxlength="3">
                        </div>
                        <div class="form-group">
                            <label>Invoice Prefix:</label>
                            <input type="text" name="invoice_prefix" value="${settings.invoice_prefix || 'INV-'}" maxlength="10">
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>Notifications</h3>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" name="low_stock_alert" ${settings.low_stock_alert === '1' ? 'checked' : ''}>
                                Low Stock Alerts
                            </label>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" name="payment_reminder" ${settings.payment_reminder === '1' ? 'checked' : ''}>
                                Payment Reminders
                            </label>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary">Save Settings</button>
                </form>
            </div>
        `;

        document.getElementById('main-content').innerHTML = settingsHTML;
    }

    async saveSettings(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const settings = {};

        for (let [key, value] of formData.entries()) {
            if (key.includes('alert') || key.includes('reminder')) {
                settings[key] = value === 'on' ? '1' : '0';
            } else {
                settings[key] = value;
            }
        }

        try {
            await this.apiRequest('/settings', {
                method: 'PUT',
                body: settings
            });
            this.showNotification('Settings saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    // Reminder Methods
    async loadReminders() {
        try {
            const reminders = await this.apiRequest('/reminders?status=active');
            this.displayReminders(reminders);
        } catch (error) {
            console.error('Error loading reminders:', error);
        }
    }

    displayReminders(reminders) {
        const reminderContainer = document.getElementById('reminders-container');
        if (!reminderContainer) return;

        if (reminders.length === 0) {
            reminderContainer.innerHTML = '<p>No active reminders</p>';
            return;
        }

        const remindersHTML = reminders.map(reminder => `
            <div class="reminder-item ${reminder.priority}">
                <div class="reminder-content">
                    <h4>${reminder.title}</h4>
                    <p>${reminder.message}</p>
                    <small>${new Date(reminder.created_at).toLocaleString()}</small>
                </div>
                <button onclick="app.dismissReminder(${reminder.id})" class="btn btn-sm btn-secondary">Dismiss</button>
            </div>
        `).join('');

        reminderContainer.innerHTML = remindersHTML;
    }

    async dismissReminder(reminderId) {
        try {
            await this.apiRequest(`/reminders/${reminderId}`, {
                method: 'PUT',
                body: { status: 'dismissed' }
            });
            this.loadReminders();
        } catch (error) {
            console.error('Error dismissing reminder:', error);
        }
    }

    // UI Helper Methods
    showLogin() {
        document.body.innerHTML = `
            <div class="login-container">
                <div class="login-form">
                    <h2>ElectraStore Login</h2>
                    <form id="loginForm" onsubmit="app.handleLogin(event)">
                        <div class="form-group">
                            <label>Username:</label>
                            <input type="text" name="username" required>
                        </div>
                        <div class="form-group">
                            <label>Password:</label>
                            <input type="password" name="password" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Login</button>
                    </form>
                    <div class="demo-credentials">
                        <p><strong>Demo Credentials:</strong></p>
                        <p>Admin: admin / admin123</p>
                        <p>Staff: staff / staff123</p>
                        <p>Cashier: cashier / cashier123</p>
                    </div>
                </div>
            </div>
        `;
    }

    hideLogin() {
        document.body.innerHTML = `
            <div class="dashboard-container">
                <aside class="sidebar">
                    <div class="logo">
                        <div class="logo-icon">
                            <i class="fas fa-bolt"></i>
                        </div>
                        <span class="logo-text">ElectraStore</span>
                    </div>
                    
                    <nav class="nav-menu">
                        <ul>
                            <li class="nav-item active">
                                <a href="#" onclick="app.showPage('dashboard')" class="nav-link">
                                    <i class="fas fa-th-large"></i>
                                    <span>Dashboard</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="#" onclick="app.showPage('customers')" class="nav-link">
                                    <i class="fas fa-users"></i>
                                    <span>Customers</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="#" onclick="app.showPage('products')" class="nav-link">
                                    <i class="fas fa-mobile-alt"></i>
                                    <span>Products</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="#" onclick="app.showPage('orders')" class="nav-link">
                                    <i class="fas fa-shopping-cart"></i>
                                    <span>Orders</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="#" onclick="app.showPage('returns')" class="nav-link">
                                    <i class="fas fa-undo"></i>
                                    <span>Returns</span>
                                </a>
                            </li>
                            ${this.currentUser.role === 'admin' ? `
                            <li class="nav-item">
                                <a href="#" onclick="app.showPage('settings')" class="nav-link">
                                    <i class="fas fa-cog"></i>
                                    <span>Settings</span>
                                </a>
                            </li>
                            ` : ''}
                        </ul>
                    </nav>
                </aside>

                <main class="main-content">
                    <header class="header">
                        <div class="user-info">
                            <span class="user-name">${this.currentUser.name}</span>
                            <span class="user-role">${this.currentUser.role}</span>
                            <button onclick="app.logout()" class="btn btn-secondary">Logout</button>
                        </div>
                    </header>

                    <div id="main-content" class="content">
                        <!-- Page content will be loaded here -->
                    </div>

                    <div id="reminders-container" class="reminders-container">
                        <!-- Reminders will be loaded here -->
                    </div>
                </main>
            </div>

            <div id="notification-container" class="notification-container"></div>
        `;
    }

    handleLogin(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');
        this.login(username, password);
    }

    showPage(page) {
        this.currentPage = page;
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelector(`[onclick="app.showPage('${page}')"]`).closest('.nav-item').classList.add('active');

        // Load page content
        switch (page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'customers':
                this.loadCustomers();
                break;
            case 'products':
                this.loadProducts();
                break;
            case 'orders':
                this.loadOrders();
                break;
            case 'returns':
                this.loadReturns();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" class="notification-close">&times;</button>
        `;

        container.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    setupEventListeners() {
        // Add any global event listeners here
    }

    setupNavigation() {
        // Navigation is handled by showPage method
    }

    // Modal Methods (placeholder - implement as needed)
    showAddCustomerModal() {
        // Implement customer add modal
        console.log('Show add customer modal');
    }

    showAddProductModal() {
        // Implement product add modal
        console.log('Show add product modal');
    }

    showAddCategoryModal() {
        // Implement category add modal
        console.log('Show add category modal');
    }

    showNewSaleModal() {
        // Implement new sale modal
        console.log('Show new sale modal');
    }

    showImportCustomersModal() {
        // Implement import customers modal
        console.log('Show import customers modal');
    }

    showImportProductsModal() {
        // Implement import products modal
        console.log('Show import products modal');
    }
}

// Initialize the application
const app = new ElectraStoreApp();