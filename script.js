// Dashboard JavaScript for Electronics Store Management

// Global variables for data management
let dashboardData = {
    customers: [],
    products: [],
    orders: [],
    messages: [],
    kpis: {
        totalOrders: 3265,
        totalSales: 752210.00,
        totalVisitors: 3254214,
        revenue: 901142.00
    }
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    loadMockData();
    initializeCharts();
    startRealTimeUpdates();
});

// Initialize dashboard components
function initializeDashboard() {
    updateCurrentDate();
    updateKPIs();
    populateMessages();
    populateBestSelling();
    populateRecentOrders();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', handleSearch);

    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    // Chart period selector
    const chartPeriod = document.querySelector('.chart-period');
    if (chartPeriod) {
        chartPeriod.addEventListener('change', handleChartPeriodChange);
    }

    // Notification click
    const notification = document.querySelector('.notification');
    if (notification) {
        notification.addEventListener('click', handleNotificationClick);
    }

    // User profile click
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', handleUserProfileClick);
    }
}

// Update current date
function updateCurrentDate() {
    const currentDate = new Date();
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    document.getElementById('current-date').textContent = formattedDate;
}

// Update KPI values with animation
function updateKPIs() {
    const kpiElements = {
        'total-orders': dashboardData.kpis.totalOrders,
        'total-sales': dashboardData.kpis.totalSales,
        'total-visitors': dashboardData.kpis.totalVisitors,
        'revenue': dashboardData.kpis.revenue
    };

    Object.keys(kpiElements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            animateNumber(element, 0, kpiElements[id], 1000);
        }
    });
}

// Animate number counting
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const startValue = start;
    const endValue = end;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = startValue + (endValue - startValue) * progress;
        
        if (element.id === 'total-sales' || element.id === 'revenue') {
            element.textContent = '$' + currentValue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        } else {
            element.textContent = Math.floor(currentValue).toLocaleString('en-US');
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Initialize charts using Chart.js
function initializeCharts() {
    initializeCustomerOverviewChart();
    initializeCustomerChart();
}

// Customer Overview Line Chart
function initializeCustomerOverviewChart() {
    const ctx = document.getElementById('customerOverviewChart');
    if (!ctx) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const visitorData = [120000, 150000, 180000, 182021, 200000, 220000, 250000, 280000, 300000, 320000, 350000, 380000];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Visitors',
                data: visitorData,
                borderColor: '#FF6B35',
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#FF6B35',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#FF6B35',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Visitors: ' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#666'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#666',
                        callback: function(value) {
                            return (value / 1000) + 'K';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Customer Distribution Donut Chart
function initializeCustomerChart() {
    const ctx = document.getElementById('customerChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Current Customer', 'New Customer', 'Lost Customer'],
            datasets: [{
                data: [65, 25, 10],
                backgroundColor: [
                    '#FF6B35',
                    '#3B82F6',
                    '#10B981'
                ],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#FF6B35',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            },
            elements: {
                arc: {
                    borderWidth: 0
                }
            }
        }
    });
}

// Load mock data for demonstration
function loadMockData() {
    // Mock messages
    dashboardData.messages = [
        {
            id: 1,
            name: 'Jerome Bell',
            avatar: 'JB',
            message: 'Amat minim mollit non deserunt...',
            time: '7 minutes ago'
        },
        {
            id: 2,
            name: 'Darrell Steward',
            avatar: 'DS',
            message: 'Amat minim mollit non deserunt...',
            time: '25 minutes ago'
        },
        {
            id: 3,
            name: 'Marvin McKinney',
            avatar: 'MM',
            message: 'Amat minim mollit non deserunt...',
            time: '45 minutes ago'
        }
    ];

    // Mock best selling products
    dashboardData.products = [
        {
            id: 1,
            name: 'Heading Phone',
            image: '🎧',
            quantity: '1521 Pcs/month',
            price: 94.75
        },
        {
            id: 2,
            name: 'Airpod Pro 2',
            image: '🎧',
            quantity: '1200 Pcs/month',
            price: 88.49
        },
        {
            id: 3,
            name: 'Wired Earbuds',
            image: '🎧',
            quantity: '980 Pcs/month',
            price: 13.47
        }
    ];

    // Mock recent orders
    dashboardData.orders = [
        {
            id: 'A0BIC042',
            name: 'Airpod Pro 3',
            image: '🎧',
            time: '1 second ago'
        },
        {
            id: 'A0BIC043',
            name: 'Airpod Pro 2',
            image: '🎧',
            time: '8 seconds ago'
        },
        {
            id: 'A0BIC044',
            name: 'Airpod 2',
            image: '🎧',
            time: '15 seconds ago'
        },
        {
            id: 'A0BIC045',
            name: 'Heading Phone',
            image: '🎧',
            time: '19 seconds ago'
        }
    ];
}

// Populate messages list
function populateMessages() {
    const messageList = document.getElementById('message-list');
    if (!messageList) return;

    messageList.innerHTML = '';
    
    dashboardData.messages.forEach(message => {
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item fade-in';
        messageItem.innerHTML = `
            <div class="message-avatar">${message.avatar}</div>
            <div class="message-content">
                <div class="message-name">${message.name}</div>
                <div class="message-text">${message.message}</div>
                <div class="message-time">${message.time}</div>
            </div>
        `;
        messageList.appendChild(messageItem);
    });
}

// Populate best selling products
function populateBestSelling() {
    const productList = document.getElementById('best-selling-list');
    if (!productList) return;

    productList.innerHTML = '';
    
    dashboardData.products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item fade-in';
        productItem.innerHTML = `
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-stats">${product.quantity}</div>
            </div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
        `;
        productList.appendChild(productItem);
    });
}

// Populate recent orders
function populateRecentOrders() {
    const orderList = document.getElementById('recent-orders-list');
    if (!orderList) return;

    orderList.innerHTML = '';
    
    dashboardData.orders.forEach(order => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item fade-in';
        orderItem.innerHTML = `
            <div class="order-image">${order.image}</div>
            <div class="order-info">
                <div class="order-name">${order.name}</div>
                <div class="order-id">#${order.id}</div>
                <div class="order-time">${order.time}</div>
            </div>
        `;
        orderList.appendChild(orderItem);
    });
}

// Handle search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    
    // Search through messages
    const messageItems = document.querySelectorAll('.message-item');
    messageItems.forEach(item => {
        const messageName = item.querySelector('.message-name').textContent.toLowerCase();
        const messageText = item.querySelector('.message-text').textContent.toLowerCase();
        
        if (messageName.includes(searchTerm) || messageText.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });

    // Search through products
    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach(item => {
        const productName = item.querySelector('.product-name').textContent.toLowerCase();
        
        if (productName.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });

    // Search through orders
    const orderItems = document.querySelectorAll('.order-item');
    orderItems.forEach(item => {
        const orderName = item.querySelector('.order-name').textContent.toLowerCase();
        const orderId = item.querySelector('.order-id').textContent.toLowerCase();
        
        if (orderName.includes(searchTerm) || orderId.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Handle navigation
function handleNavigation(event) {
    event.preventDefault();
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked item
    event.currentTarget.classList.add('active');
    
    // Here you would typically load different content based on the navigation
    const navText = event.currentTarget.querySelector('span').textContent;
    console.log('Navigating to:', navText);
    
    // Update dashboard title
    document.querySelector('.header-left h1').textContent = navText;
}

// Handle chart period change
function handleChartPeriodChange(event) {
    const period = event.target.value;
    console.log('Chart period changed to:', period);
    
    // Here you would typically reload chart data based on the selected period
    // For now, we'll just log the change
}

// Handle notification click
function handleNotificationClick() {
    console.log('Notifications clicked');
    // Here you would typically show a notifications panel
    alert('Notifications: 3 new messages, 2 pending orders, 1 low stock alert');
}

// Handle user profile click
function handleUserProfileClick() {
    console.log('User profile clicked');
    // Here you would typically show a user profile panel
    alert('User Profile: Marvin McKinney\nRole: Store Manager\nEmail: marvin@hatoru.com');
}

// Start real-time updates
function startRealTimeUpdates() {
    // Simulate real-time order updates
    setInterval(() => {
        addNewOrder();
    }, 10000); // Add new order every 10 seconds

    // Simulate real-time KPI updates
    setInterval(() => {
        updateKPIRandomly();
    }, 30000); // Update KPIs every 30 seconds
}

// Add new order to the list
function addNewOrder() {
    const newOrder = {
        id: 'A0BIC' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
        name: dashboardData.products[Math.floor(Math.random() * dashboardData.products.length)].name,
        image: '🎧',
        time: 'just now'
    };

    dashboardData.orders.unshift(newOrder);
    
    // Keep only the latest 4 orders
    if (dashboardData.orders.length > 4) {
        dashboardData.orders.pop();
    }

    populateRecentOrders();
    
    // Update total orders KPI
    dashboardData.kpis.totalOrders++;
    document.getElementById('total-orders').textContent = dashboardData.kpis.totalOrders.toLocaleString('en-US');
}

// Update KPIs randomly for demonstration
function updateKPIRandomly() {
    const changes = [
        { kpi: 'totalSales', change: Math.random() * 1000 },
        { kpi: 'revenue', change: Math.random() * 500 },
        { kpi: 'totalVisitors', change: Math.floor(Math.random() * 1000) }
    ];

    changes.forEach(({ kpi, change }) => {
        dashboardData.kpis[kpi] += change;
        
        const element = document.getElementById(kpi === 'totalSales' ? 'total-sales' : 
                                               kpi === 'revenue' ? 'revenue' : 'total-visitors');
        
        if (element) {
            if (kpi === 'totalSales' || kpi === 'revenue') {
                element.textContent = '$' + dashboardData.kpis[kpi].toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            } else {
                element.textContent = Math.floor(dashboardData.kpis[kpi]).toLocaleString('en-US');
            }
        }
    });
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Utility function to format numbers
function formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
}

// Export functions for external use (if needed)
window.dashboardFunctions = {
    updateKPIs,
    populateMessages,
    populateBestSelling,
    populateRecentOrders,
    formatCurrency,
    formatNumber
};