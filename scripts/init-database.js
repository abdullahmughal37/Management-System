const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// Create database directory if it doesn't exist
const fs = require('fs');
const dbDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'electrastore.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('Connected to SQLite database.');
});

// Initialize database tables
const initializeTables = () => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin', 'staff', 'cashier')),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Categories table
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        icon TEXT,
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        cost_price DECIMAL(10,2),
        stock INTEGER NOT NULL DEFAULT 0,
        low_stock_threshold INTEGER DEFAULT 10,
        warranty_months INTEGER DEFAULT 0,
        description TEXT,
        brand TEXT,
        model TEXT,
        image_url TEXT,
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id)
    )`);

    // Customers table
    db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT NOT NULL,
        address TEXT,
        city TEXT,
        state TEXT,
        zip_code TEXT,
        total_amount DECIMAL(10,2) DEFAULT 0.00,
        paid_amount DECIMAL(10,2) DEFAULT 0.00,
        due_amount DECIMAL(10,2) DEFAULT 0.00,
        active INTEGER DEFAULT 1,
        birthday DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        order_number TEXT UNIQUE NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        tax_amount DECIMAL(10,2) DEFAULT 0.00,
        discount_amount DECIMAL(10,2) DEFAULT 0.00,
        total_amount DECIMAL(10,2) NOT NULL,
        paid_amount DECIMAL(10,2) DEFAULT 0.00,
        due_amount DECIMAL(10,2) DEFAULT 0.00,
        payment_method TEXT,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'cancelled', 'refunded')),
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Order Items table
    db.run(`CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        warranty_expiry DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
    )`);

    // Payments table
    db.run(`CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        customer_id INTEGER NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_method TEXT NOT NULL,
        payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        created_by INTEGER NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (customer_id) REFERENCES customers (id),
        FOREIGN KEY (created_by) REFERENCES users (id)
    )`);

    // Returns table
    db.run(`CREATE TABLE IF NOT EXISTS returns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        order_item_id INTEGER NOT NULL,
        customer_id INTEGER NOT NULL,
        reason TEXT NOT NULL,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
        quantity INTEGER NOT NULL,
        refund_amount DECIMAL(10,2),
        notes TEXT,
        return_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        approved_by INTEGER,
        approved_date DATETIME,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (order_item_id) REFERENCES order_items (id),
        FOREIGN KEY (customer_id) REFERENCES customers (id),
        FOREIGN KEY (approved_by) REFERENCES users (id)
    )`);

    // Stock movements table
    db.run(`CREATE TABLE IF NOT EXISTS stock_movements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        movement_type TEXT NOT NULL CHECK(movement_type IN ('in', 'out', 'adjustment')),
        quantity INTEGER NOT NULL,
        reference_type TEXT, -- 'sale', 'return', 'adjustment', 'initial'
        reference_id INTEGER,
        notes TEXT,
        created_by INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (id),
        FOREIGN KEY (created_by) REFERENCES users (id)
    )`);

    // Settings table
    db.run(`CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        description TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Reminders table
    db.run(`CREATE TABLE IF NOT EXISTS reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK(type IN ('payment_due', 'low_stock', 'return_expiry', 'birthday')),
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        reference_id INTEGER,
        reference_type TEXT,
        status TEXT DEFAULT 'active' CHECK(status IN ('active', 'dismissed', 'completed')),
        priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
        due_date DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log('Database tables created successfully!');
};

// Insert default data
const insertDefaultData = async () => {
    try {
        // Default admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        const staffPassword = await bcrypt.hash('staff123', 10);
        const cashierPassword = await bcrypt.hash('cashier123', 10);

        // Insert default users
        db.run(`INSERT OR IGNORE INTO users (username, password, role, name, email) VALUES 
            ('admin', ?, 'admin', 'Administrator', 'admin@electrastore.com'),
            ('staff', ?, 'staff', 'Staff Member', 'staff@electrastore.com'),
            ('cashier', ?, 'cashier', 'Cashier', 'cashier@electrastore.com')`, 
            [adminPassword, staffPassword, cashierPassword]);

        // Insert default categories
        db.run(`INSERT OR IGNORE INTO categories (name, description, icon) VALUES 
            ('smartphones', 'Mobile phones and accessories', '📱'),
            ('tablets', 'Tablets and e-readers', '📱'),
            ('laptops', 'Laptops and notebooks', '💻'),
            ('tvs', 'Televisions and displays', '📺'),
            ('audio', 'Audio equipment and accessories', '🎧'),
            ('accessories', 'Various electronic accessories', '🔌'),
            ('refrigerators', 'Refrigerators and cooling appliances', '❄️'),
            ('washing_machines', 'Washing machines and laundry', '🧺'),
            ('air_conditioners', 'Air conditioning systems', '🌡️'),
            ('kitchen_appliances', 'Kitchen and cooking appliances', '🍳')`);

        // Insert default settings
        db.run(`INSERT OR IGNORE INTO settings (key, value, description) VALUES 
            ('tax_rate', '18.0', 'Default tax rate percentage'),
            ('return_days', '7', 'Number of days for return policy'),
            ('company_name', 'ElectraStore', 'Company name'),
            ('company_address', '123 Electronics Street, Tech City, TC 12345', 'Company address'),
            ('company_phone', '+1-555-ELECTRA', 'Company phone number'),
            ('company_email', 'info@electrastore.com', 'Company email'),
            ('low_stock_alert', '1', 'Enable low stock alerts'),
            ('payment_reminder', '1', 'Enable payment reminders'),
            ('currency_symbol', '$', 'Currency symbol'),
            ('invoice_prefix', 'INV-', 'Invoice number prefix')`);

        console.log('Default data inserted successfully!');
    } catch (error) {
        console.error('Error inserting default data:', error);
    }
};

// Initialize database
db.serialize(() => {
    initializeTables();
    insertDefaultData();
    
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database initialization completed successfully!');
        }
    });
});