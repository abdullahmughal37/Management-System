// Electronics Store Dashboard JavaScript

// Data Storage and Management
class ElectronicsStore {
    constructor() {
        this.customers = JSON.parse(localStorage.getItem('customers')) || [];
        this.products = JSON.parse(localStorage.getItem('products')) || this.getDefaultProducts();
        this.orders = JSON.parse(localStorage.getItem('orders')) || this.getDefaultOrders();
        this.bills = JSON.parse(localStorage.getItem('bills')) || [];
        this.messages = JSON.parse(localStorage.getItem('messages')) || this.getDefaultMessages();
        
        this.currentCustomerId = null;
        this.currentOrderId = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderDashboard();
        this.initializeCharts();
        this.loadRecentActivities();
        this.setupNavigation();
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
                image: "📱"
            },
            {
                id: 2,
                name: "Samsung Galaxy S24",
                category: "smartphones", 
                price: 849.99,
                stock: 18,
                sold: 38,
                image: "📱"
            },
            {
                id: 3,
                name: "MacBook Pro 16\"",
                category: "laptops",
                price: 2399.99,
                stock: 8,
                sold: 15,
                image: "💻"
            },
            {
                id: 4,
                name: "AirPods Pro 2",
                category: "audio",
                price: 249.99,
                stock: 42,
                sold: 78,
                image: "🎧"
            },
            {
                id: 5,
                name: "iPad Pro 12.9\"",
                category: "tablets",
                price: 1199.99,
                stock: 15,
                sold: 22,
                image: "📱"
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
        // Customer modal
        const customerModal = document.getElementById('customerModal');
        const productModal = document.getElementById('productModal');
        
        // Close modals
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                customerModal.style.display = 'none';
                productModal.style.display = 'none';
            });
        });

        // Cancel buttons
        document.getElementById('cancelCustomer')?.addEventListener('click', () => {
            customerModal.style.display = 'none';
        });

        document.getElementById('cancelProduct')?.addEventListener('click', () => {
            productModal.style.display = 'none';
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target === customerModal) customerModal.style.display = 'none';
            if (e.target === productModal) productModal.style.display = 'none';
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

    // Utility Functions
    saveToLocalStorage() {
        localStorage.setItem('customers', JSON.stringify(this.customers));
        localStorage.setItem('products', JSON.stringify(this.products));
        localStorage.setItem('orders', JSON.stringify(this.orders));
        localStorage.setItem('bills', JSON.stringify(this.bills));
        localStorage.setItem('messages', JSON.stringify(this.messages));
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