const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const xlsx = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
const dbPath = path.join(__dirname, 'database', 'electrastore.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('Connected to SQLite database.');
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Role-based authorization middleware
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};

// Utility functions
const generateOrderNumber = () => {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
};

const updateCustomerTotals = (customerId, callback) => {
    const query = `
        UPDATE customers 
        SET total_amount = (
            SELECT COALESCE(SUM(total_amount), 0) 
            FROM orders 
            WHERE customer_id = ? AND status != 'cancelled'
        ),
        paid_amount = (
            SELECT COALESCE(SUM(paid_amount), 0) 
            FROM orders 
            WHERE customer_id = ? AND status != 'cancelled'
        ),
        due_amount = (
            SELECT COALESCE(SUM(due_amount), 0) 
            FROM orders 
            WHERE customer_id = ? AND status != 'cancelled'
        )
        WHERE id = ?
    `;
    
    db.run(query, [customerId, customerId, customerId, customerId], callback);
};

// AUTH ROUTES
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ? AND active = 1', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                name: user.name,
                email: user.email
            }
        });
    });
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

// USER ROUTES
app.get('/api/users', authenticateToken, authorizeRole(['admin']), (req, res) => {
    db.all('SELECT id, username, role, name, email, phone, active, created_at FROM users ORDER BY created_at DESC', (err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(users);
    });
});

app.post('/api/users', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    const { username, password, role, name, email, phone } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(
            'INSERT INTO users (username, password, role, name, email, phone) VALUES (?, ?, ?, ?, ?, ?)',
            [username, hashedPassword, role, name, email, phone],
            function(err) {
                if (err) {
                    if (err.code === 'SQLITE_CONSTRAINT') {
                        return res.status(400).json({ error: 'Username or email already exists' });
                    }
                    return res.status(500).json({ error: 'Database error' });
                }
                res.json({ id: this.lastID, message: 'User created successfully' });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// CATEGORY ROUTES
app.get('/api/categories', authenticateToken, (req, res) => {
    db.all('SELECT * FROM categories WHERE active = 1 ORDER BY name', (err, categories) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(categories);
    });
});

app.post('/api/categories', authenticateToken, authorizeRole(['admin', 'staff']), (req, res) => {
    const { name, description, icon } = req.body;

    db.run(
        'INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)',
        [name, description, icon],
        function(err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(400).json({ error: 'Category already exists' });
                }
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ id: this.lastID, message: 'Category created successfully' });
        }
    );
});

app.put('/api/categories/:id', authenticateToken, authorizeRole(['admin', 'staff']), (req, res) => {
    const { name, description, icon } = req.body;
    const categoryId = req.params.id;

    db.run(
        'UPDATE categories SET name = ?, description = ?, icon = ? WHERE id = ?',
        [name, description, icon, categoryId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json({ message: 'Category updated successfully' });
        }
    );
});

app.delete('/api/categories/:id', authenticateToken, authorizeRole(['admin']), (req, res) => {
    const categoryId = req.params.id;

    db.run('UPDATE categories SET active = 0 WHERE id = ?', [categoryId], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    });
});

// PRODUCT ROUTES
app.get('/api/products', authenticateToken, (req, res) => {
    const { category, lowStock } = req.query;
    let query = `
        SELECT p.*, c.name as category_name, c.icon as category_icon
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.active = 1
    `;
    const params = [];

    if (category) {
        query += ' AND c.name = ?';
        params.push(category);
    }

    if (lowStock === 'true') {
        query += ' AND p.stock <= p.low_stock_threshold';
    }

    query += ' ORDER BY p.name';

    db.all(query, params, (err, products) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(products);
    });
});

app.post('/api/products', authenticateToken, authorizeRole(['admin', 'staff']), (req, res) => {
    const { name, category_id, price, cost_price, stock, low_stock_threshold, warranty_months, description, brand, model } = req.body;

    db.run(
        'INSERT INTO products (name, category_id, price, cost_price, stock, low_stock_threshold, warranty_months, description, brand, model) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [name, category_id, price, cost_price, stock, low_stock_threshold, warranty_months, description, brand, model],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            // Record stock movement
            db.run(
                'INSERT INTO stock_movements (product_id, movement_type, quantity, reference_type, notes, created_by) VALUES (?, ?, ?, ?, ?, ?)',
                [this.lastID, 'in', stock, 'initial', 'Initial stock', req.user.id]
            );

            res.json({ id: this.lastID, message: 'Product created successfully' });
        }
    );
});

app.put('/api/products/:id', authenticateToken, authorizeRole(['admin', 'staff']), (req, res) => {
    const { name, category_id, price, cost_price, stock, low_stock_threshold, warranty_months, description, brand, model } = req.body;
    const productId = req.params.id;

    // Get current stock to calculate difference
    db.get('SELECT stock FROM products WHERE id = ?', [productId], (err, currentProduct) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!currentProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const stockDifference = stock - currentProduct.stock;

        db.run(
            'UPDATE products SET name = ?, category_id = ?, price = ?, cost_price = ?, stock = ?, low_stock_threshold = ?, warranty_months = ?, description = ?, brand = ?, model = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [name, category_id, price, cost_price, stock, low_stock_threshold, warranty_months, description, brand, model, productId],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }

                // Record stock movement if stock changed
                if (stockDifference !== 0) {
                    const movementType = stockDifference > 0 ? 'in' : 'out';
                    const quantity = Math.abs(stockDifference);
                    
                    db.run(
                        'INSERT INTO stock_movements (product_id, movement_type, quantity, reference_type, notes, created_by) VALUES (?, ?, ?, ?, ?, ?)',
                        [productId, movementType, quantity, 'adjustment', 'Stock adjustment', req.user.id]
                    );
                }

                res.json({ message: 'Product updated successfully' });
            }
        );
    });
});

app.delete('/api/products/:id', authenticateToken, authorizeRole(['admin']), (req, res) => {
    const productId = req.params.id;

    db.run('UPDATE products SET active = 0 WHERE id = ?', [productId], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    });
});

// CUSTOMER ROUTES
app.get('/api/customers', authenticateToken, (req, res) => {
    const { search, active } = req.query;
    let query = 'SELECT * FROM customers WHERE 1=1';
    const params = [];

    if (search) {
        query += ' AND (name LIKE ? OR phone LIKE ? OR email LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (active !== undefined) {
        query += ' AND active = ?';
        params.push(active === 'true' ? 1 : 0);
    }

    query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, customers) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(customers);
    });
});

app.post('/api/customers', authenticateToken, (req, res) => {
    const { name, email, phone, address, city, state, zip_code, birthday } = req.body;

    db.run(
        'INSERT INTO customers (name, email, phone, address, city, state, zip_code, birthday) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, email, phone, address, city, state, zip_code, birthday],
        function(err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(400).json({ error: 'Email already exists' });
                }
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ id: this.lastID, message: 'Customer created successfully' });
        }
    );
});

app.put('/api/customers/:id', authenticateToken, (req, res) => {
    const { name, email, phone, address, city, state, zip_code, birthday } = req.body;
    const customerId = req.params.id;

    db.run(
        'UPDATE customers SET name = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, zip_code = ?, birthday = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, email, phone, address, city, state, zip_code, birthday, customerId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Customer not found' });
            }
            res.json({ message: 'Customer updated successfully' });
        }
    );
});

app.delete('/api/customers/:id', authenticateToken, authorizeRole(['admin']), (req, res) => {
    const customerId = req.params.id;

    db.run('UPDATE customers SET active = 0 WHERE id = ?', [customerId], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json({ message: 'Customer deleted successfully' });
    });
});

// ORDER ROUTES
app.get('/api/orders', authenticateToken, (req, res) => {
    const { customer_id, status, start_date, end_date } = req.query;
    let query = `
        SELECT o.*, c.name as customer_name, c.phone as customer_phone, u.name as created_by_name
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        JOIN users u ON o.user_id = u.id
        WHERE 1=1
    `;
    const params = [];

    if (customer_id) {
        query += ' AND o.customer_id = ?';
        params.push(customer_id);
    }

    if (status) {
        query += ' AND o.status = ?';
        params.push(status);
    }

    if (start_date) {
        query += ' AND DATE(o.created_at) >= ?';
        params.push(start_date);
    }

    if (end_date) {
        query += ' AND DATE(o.created_at) <= ?';
        params.push(end_date);
    }

    query += ' ORDER BY o.created_at DESC';

    db.all(query, params, (err, orders) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(orders);
    });
});

app.get('/api/orders/:id', authenticateToken, (req, res) => {
    const orderId = req.params.id;

    const orderQuery = `
        SELECT o.*, c.name as customer_name, c.phone as customer_phone, c.address as customer_address,
               u.name as created_by_name
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
    `;

    const itemsQuery = `
        SELECT oi.*, p.name as product_name, p.brand, p.model
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
    `;

    db.get(orderQuery, [orderId], (err, order) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        db.all(itemsQuery, [orderId], (err, items) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            res.json({ ...order, items });
        });
    });
});

app.post('/api/orders', authenticateToken, (req, res) => {
    const { customer_id, items, subtotal, tax_amount, discount_amount, total_amount, paid_amount, payment_method, notes } = req.body;

    const orderNumber = generateOrderNumber();
    const due_amount = total_amount - paid_amount;

    db.run('BEGIN TRANSACTION');

    // Insert order
    db.run(
        'INSERT INTO orders (customer_id, user_id, order_number, subtotal, tax_amount, discount_amount, total_amount, paid_amount, due_amount, payment_method, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [customer_id, req.user.id, orderNumber, subtotal, tax_amount, discount_amount, total_amount, paid_amount, due_amount, payment_method, notes, 'completed'],
        function(err) {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Database error' });
            }

            const orderId = this.lastID;

            // Insert order items and update stock
            let itemsProcessed = 0;
            const totalItems = items.length;

            if (totalItems === 0) {
                db.run('ROLLBACK');
                return res.status(400).json({ error: 'No items in order' });
            }

            items.forEach(item => {
                const warrantyExpiry = item.warranty_months ? 
                    new Date(Date.now() + (item.warranty_months * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] : 
                    null;

                // Insert order item
                db.run(
                    'INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, warranty_expiry) VALUES (?, ?, ?, ?, ?, ?)',
                    [orderId, item.product_id, item.quantity, item.unit_price, item.total_price, warrantyExpiry],
                    function(err) {
                        if (err) {
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: 'Database error' });
                        }

                        // Update product stock
                        db.run(
                            'UPDATE products SET stock = stock - ? WHERE id = ?',
                            [item.quantity, item.product_id],
                            function(err) {
                                if (err) {
                                    db.run('ROLLBACK');
                                    return res.status(500).json({ error: 'Database error' });
                                }

                                // Record stock movement
                                db.run(
                                    'INSERT INTO stock_movements (product_id, movement_type, quantity, reference_type, reference_id, notes, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
                                    [item.product_id, 'out', item.quantity, 'sale', orderId, `Sale order ${orderNumber}`, req.user.id]
                                );

                                itemsProcessed++;
                                if (itemsProcessed === totalItems) {
                                    // Record payment if paid amount > 0
                                    if (paid_amount > 0) {
                                        db.run(
                                            'INSERT INTO payments (order_id, customer_id, amount, payment_method, created_by) VALUES (?, ?, ?, ?, ?)',
                                            [orderId, customer_id, paid_amount, payment_method, req.user.id]
                                        );
                                    }

                                    // Update customer totals
                                    updateCustomerTotals(customer_id, () => {
                                        db.run('COMMIT');
                                        res.json({ 
                                            id: orderId, 
                                            order_number: orderNumber,
                                            message: 'Order created successfully' 
                                        });
                                    });
                                }
                            }
                        );
                    }
                );
            });
        }
    );
});

// PAYMENT ROUTES
app.post('/api/payments', authenticateToken, (req, res) => {
    const { order_id, customer_id, amount, payment_method, notes } = req.body;

    db.run('BEGIN TRANSACTION');

    // Insert payment
    db.run(
        'INSERT INTO payments (order_id, customer_id, amount, payment_method, notes, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        [order_id, customer_id, amount, payment_method, notes, req.user.id],
        function(err) {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Database error' });
            }

            // Update order paid amount
            db.run(
                'UPDATE orders SET paid_amount = paid_amount + ?, due_amount = due_amount - ? WHERE id = ?',
                [amount, amount, order_id],
                function(err) {
                    if (err) {
                        db.run('ROLLBACK');
                        return res.status(500).json({ error: 'Database error' });
                    }

                    // Update customer totals
                    updateCustomerTotals(customer_id, () => {
                        db.run('COMMIT');
                        res.json({ 
                            id: this.lastID, 
                            message: 'Payment recorded successfully' 
                        });
                    });
                }
            );
        }
    );
});

app.get('/api/payments', authenticateToken, (req, res) => {
    const { customer_id, order_id } = req.query;
    let query = `
        SELECT p.*, c.name as customer_name, o.order_number, u.name as created_by_name
        FROM payments p
        JOIN customers c ON p.customer_id = c.id
        JOIN orders o ON p.order_id = o.id
        JOIN users u ON p.created_by = u.id
        WHERE 1=1
    `;
    const params = [];

    if (customer_id) {
        query += ' AND p.customer_id = ?';
        params.push(customer_id);
    }

    if (order_id) {
        query += ' AND p.order_id = ?';
        params.push(order_id);
    }

    query += ' ORDER BY p.payment_date DESC';

    db.all(query, params, (err, payments) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(payments);
    });
});

// RETURN ROUTES
app.get('/api/returns', authenticateToken, (req, res) => {
    const { status, customer_id } = req.query;
    let query = `
        SELECT r.*, c.name as customer_name, o.order_number, p.name as product_name,
               u.name as approved_by_name
        FROM returns r
        JOIN customers c ON r.customer_id = c.id
        JOIN orders o ON r.order_id = o.id
        JOIN order_items oi ON r.order_item_id = oi.id
        JOIN products p ON oi.product_id = p.id
        LEFT JOIN users u ON r.approved_by = u.id
        WHERE 1=1
    `;
    const params = [];

    if (status) {
        query += ' AND r.status = ?';
        params.push(status);
    }

    if (customer_id) {
        query += ' AND r.customer_id = ?';
        params.push(customer_id);
    }

    query += ' ORDER BY r.return_date DESC';

    db.all(query, params, (err, returns) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(returns);
    });
});

app.post('/api/returns', authenticateToken, (req, res) => {
    const { order_id, order_item_id, customer_id, reason, quantity, notes } = req.body;

    db.run(
        'INSERT INTO returns (order_id, order_item_id, customer_id, reason, quantity, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [order_id, order_item_id, customer_id, reason, quantity, notes],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ id: this.lastID, message: 'Return request created successfully' });
        }
    );
});

app.put('/api/returns/:id/approve', authenticateToken, authorizeRole(['admin', 'staff']), (req, res) => {
    const returnId = req.params.id;
    const { refund_amount } = req.body;

    db.run('BEGIN TRANSACTION');

    // Get return details
    db.get(`
        SELECT r.*, oi.product_id, oi.unit_price
        FROM returns r
        JOIN order_items oi ON r.order_item_id = oi.id
        WHERE r.id = ?
    `, [returnId], (err, returnItem) => {
        if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Database error' });
        }

        if (!returnItem) {
            db.run('ROLLBACK');
            return res.status(404).json({ error: 'Return not found' });
        }

        // Update return status
        db.run(
            'UPDATE returns SET status = ?, refund_amount = ?, approved_by = ?, approved_date = CURRENT_TIMESTAMP WHERE id = ?',
            ['approved', refund_amount, req.user.id, returnId],
            function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: 'Database error' });
                }

                // Update product stock
                db.run(
                    'UPDATE products SET stock = stock + ? WHERE id = ?',
                    [returnItem.quantity, returnItem.product_id],
                    function(err) {
                        if (err) {
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: 'Database error' });
                        }

                        // Record stock movement
                        db.run(
                            'INSERT INTO stock_movements (product_id, movement_type, quantity, reference_type, reference_id, notes, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            [returnItem.product_id, 'in', returnItem.quantity, 'return', returnId, `Return approved`, req.user.id]
                        );

                        db.run('COMMIT');
                        res.json({ message: 'Return approved successfully' });
                    }
                );
            }
        );
    });
});

// CSV IMPORT ROUTES
app.post('/api/import/customers', authenticateToken, authorizeRole(['admin', 'staff']), upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const customers = [];
    const errors = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => {
            // Validate required fields
            if (!row.name || !row.phone) {
                errors.push(`Missing required fields for row: ${JSON.stringify(row)}`);
                return;
            }

            customers.push({
                name: row.name,
                email: row.email || null,
                phone: row.phone,
                address: row.address || null,
                total_amount: parseFloat(row.total_amount) || 0,
                paid_amount: parseFloat(row.paid_amount) || 0,
                due_amount: parseFloat(row.due_amount) || 0
            });
        })
        .on('end', () => {
            if (errors.length > 0) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ errors });
            }

            let processed = 0;
            const total = customers.length;

            if (total === 0) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ error: 'No valid customers found in file' });
            }

            customers.forEach(customer => {
                db.run(
                    'INSERT INTO customers (name, email, phone, address, total_amount, paid_amount, due_amount) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [customer.name, customer.email, customer.phone, customer.address, customer.total_amount, customer.paid_amount, customer.due_amount],
                    function(err) {
                        if (err && err.code !== 'SQLITE_CONSTRAINT') {
                            errors.push(`Error inserting customer ${customer.name}: ${err.message}`);
                        }
                        
                        processed++;
                        if (processed === total) {
                            fs.unlinkSync(req.file.path);
                            res.json({ 
                                message: `Imported ${total - errors.length} customers successfully`,
                                errors: errors.length > 0 ? errors : undefined
                            });
                        }
                    }
                );
            });
        });
});

app.post('/api/import/products', authenticateToken, authorizeRole(['admin', 'staff']), upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const products = [];
    const errors = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => {
            // Validate required fields
            if (!row.name || !row.category || !row.price) {
                errors.push(`Missing required fields for row: ${JSON.stringify(row)}`);
                return;
            }

            products.push({
                name: row.name,
                category: row.category,
                price: parseFloat(row.price),
                stock: parseInt(row.stock) || 0,
                warranty_months: parseInt(row.warranty_months) || 0,
                low_stock_threshold: parseInt(row.low_stock_threshold) || 10
            });
        })
        .on('end', () => {
            if (errors.length > 0) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ errors });
            }

            let processed = 0;
            const total = products.length;

            if (total === 0) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ error: 'No valid products found in file' });
            }

            products.forEach(product => {
                // First, get or create category
                db.get('SELECT id FROM categories WHERE name = ?', [product.category], (err, category) => {
                    if (err) {
                        errors.push(`Error finding category ${product.category}: ${err.message}`);
                        processed++;
                        if (processed === total) {
                            fs.unlinkSync(req.file.path);
                            res.json({ 
                                message: `Imported ${total - errors.length} products successfully`,
                                errors: errors.length > 0 ? errors : undefined
                            });
                        }
                        return;
                    }

                    let categoryId = category ? category.id : null;

                    const insertProduct = () => {
                        db.run(
                            'INSERT INTO products (name, category_id, price, stock, warranty_months, low_stock_threshold) VALUES (?, ?, ?, ?, ?, ?)',
                            [product.name, categoryId, product.price, product.stock, product.warranty_months, product.low_stock_threshold],
                            function(err) {
                                if (err) {
                                    errors.push(`Error inserting product ${product.name}: ${err.message}`);
                                } else if (product.stock > 0) {
                                    // Record initial stock movement
                                    db.run(
                                        'INSERT INTO stock_movements (product_id, movement_type, quantity, reference_type, notes, created_by) VALUES (?, ?, ?, ?, ?, ?)',
                                        [this.lastID, 'in', product.stock, 'initial', 'Initial stock from import', req.user.id]
                                    );
                                }
                                
                                processed++;
                                if (processed === total) {
                                    fs.unlinkSync(req.file.path);
                                    res.json({ 
                                        message: `Imported ${total - errors.length} products successfully`,
                                        errors: errors.length > 0 ? errors : undefined
                                    });
                                }
                            }
                        );
                    };

                    if (!categoryId) {
                        // Create category if it doesn't exist
                        db.run(
                            'INSERT INTO categories (name, description) VALUES (?, ?)',
                            [product.category, `Auto-created category for ${product.category}`],
                            function(err) {
                                if (err) {
                                    errors.push(`Error creating category ${product.category}: ${err.message}`);
                                    processed++;
                                    if (processed === total) {
                                        fs.unlinkSync(req.file.path);
                                        res.json({ 
                                            message: `Imported ${total - errors.length} products successfully`,
                                            errors: errors.length > 0 ? errors : undefined
                                        });
                                    }
                                    return;
                                }
                                categoryId = this.lastID;
                                insertProduct();
                            }
                        );
                    } else {
                        insertProduct();
                    }
                });
            });
        });
});

// REPORTS ROUTES
app.get('/api/reports/sales', authenticateToken, (req, res) => {
    const { start_date, end_date, period } = req.query;
    
    let dateFilter = '';
    const params = [];

    if (start_date && end_date) {
        dateFilter = 'AND DATE(o.created_at) BETWEEN ? AND ?';
        params.push(start_date, end_date);
    } else if (period) {
        switch (period) {
            case 'today':
                dateFilter = 'AND DATE(o.created_at) = DATE("now")';
                break;
            case 'week':
                dateFilter = 'AND DATE(o.created_at) >= DATE("now", "-7 days")';
                break;
            case 'month':
                dateFilter = 'AND DATE(o.created_at) >= DATE("now", "-30 days")';
                break;
        }
    }

    const query = `
        SELECT 
            DATE(o.created_at) as date,
            COUNT(*) as total_orders,
            SUM(o.total_amount) as total_sales,
            SUM(o.paid_amount) as total_paid,
            SUM(o.due_amount) as total_due
        FROM orders o
        WHERE o.status = 'completed' ${dateFilter}
        GROUP BY DATE(o.created_at)
        ORDER BY date DESC
    `;

    db.all(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

app.get('/api/reports/dashboard', authenticateToken, (req, res) => {
    const queries = {
        totalCustomers: 'SELECT COUNT(*) as count FROM customers WHERE active = 1',
        totalProducts: 'SELECT COUNT(*) as count FROM products WHERE active = 1',
        totalOrders: 'SELECT COUNT(*) as count FROM orders WHERE status = "completed"',
        totalSales: 'SELECT SUM(total_amount) as total FROM orders WHERE status = "completed"',
        totalPaid: 'SELECT SUM(paid_amount) as total FROM orders WHERE status = "completed"',
        totalDue: 'SELECT SUM(due_amount) as total FROM orders WHERE status = "completed"',
        todaySales: 'SELECT SUM(total_amount) as total FROM orders WHERE status = "completed" AND DATE(created_at) = DATE("now")',
        lowStockProducts: 'SELECT COUNT(*) as count FROM products WHERE stock <= low_stock_threshold AND active = 1',
        pendingReturns: 'SELECT COUNT(*) as count FROM returns WHERE status = "pending"'
    };

    const results = {};
    let completed = 0;
    const total = Object.keys(queries).length;

    Object.entries(queries).forEach(([key, query]) => {
        db.get(query, (err, result) => {
            if (err) {
                results[key] = 0;
            } else {
                results[key] = result.count !== undefined ? result.count : (result.total || 0);
            }
            
            completed++;
            if (completed === total) {
                res.json(results);
            }
        });
    });
});

// SETTINGS ROUTES
app.get('/api/settings', authenticateToken, (req, res) => {
    db.all('SELECT * FROM settings ORDER BY key', (err, settings) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        const settingsObj = {};
        settings.forEach(setting => {
            settingsObj[setting.key] = setting.value;
        });
        
        res.json(settingsObj);
    });
});

app.put('/api/settings', authenticateToken, authorizeRole(['admin']), (req, res) => {
    const settings = req.body;
    let processed = 0;
    const total = Object.keys(settings).length;

    if (total === 0) {
        return res.json({ message: 'No settings to update' });
    }

    Object.entries(settings).forEach(([key, value]) => {
        db.run(
            'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
            [key, value],
            function(err) {
                if (err) {
                    console.error(`Error updating setting ${key}:`, err);
                }
                
                processed++;
                if (processed === total) {
                    res.json({ message: 'Settings updated successfully' });
                }
            }
        );
    });
});

// REMINDERS ROUTES
app.get('/api/reminders', authenticateToken, (req, res) => {
    const { type, status } = req.query;
    let query = 'SELECT * FROM reminders WHERE 1=1';
    const params = [];

    if (type) {
        query += ' AND type = ?';
        params.push(type);
    }

    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }

    query += ' ORDER BY priority DESC, created_at DESC';

    db.all(query, params, (err, reminders) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(reminders);
    });
});

app.put('/api/reminders/:id', authenticateToken, (req, res) => {
    const { status } = req.body;
    const reminderId = req.params.id;

    db.run(
        'UPDATE reminders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, reminderId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Reminder not found' });
            }
            res.json({ message: 'Reminder updated successfully' });
        }
    );
});

// Serve static files
app.use(express.static('.'));

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Scheduled tasks
cron.schedule('0 9 * * *', () => {
    console.log('Running daily tasks...');
    
    // Check for low stock
    db.all('SELECT * FROM products WHERE stock <= low_stock_threshold AND active = 1', (err, products) => {
        if (err) return;
        
        products.forEach(product => {
            db.run(
                'INSERT INTO reminders (type, title, message, reference_id, reference_type, priority) VALUES (?, ?, ?, ?, ?, ?)',
                ['low_stock', 'Low Stock Alert', `${product.name} is running low on stock (${product.stock} remaining)`, product.id, 'product', 'high']
            );
        });
    });

    // Check for payment due
    db.all('SELECT * FROM orders WHERE due_amount > 0 AND status = "completed"', (err, orders) => {
        if (err) return;
        
        orders.forEach(order => {
            db.run(
                'INSERT INTO reminders (type, title, message, reference_id, reference_type, priority) VALUES (?, ?, ?, ?, ?, ?)',
                ['payment_due', 'Payment Due', `Payment of $${order.due_amount} is due for order ${order.order_number}`, order.id, 'order', 'medium']
            );
        });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the application at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});