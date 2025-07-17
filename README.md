# ElectraStore - Comprehensive Electronics Store Management System

A complete electronics store management system built with Node.js, Express, SQLite, and modern web technologies. This system provides all the essential features needed to manage an electronics store including customer management, inventory tracking, billing, sales, returns, and comprehensive reporting.

## 🚀 Features Overview

### 🔐 User Authentication & Roles
- **Login System**: Secure JWT-based authentication
- **Admin Role**: Full access to all features including deletion and settings
- **Staff Role**: Access to sales, customers, products, and returns
- **Cashier Role**: Limited access to sales and payment collection with admin password requirement for special actions

### 👥 Customer Management
- **Add New Customer**: Name, contact information, address, and financial tracking
- **View/Edit/Delete Customer**: Full CRUD operations with role-based permissions
- **Customer Search & Filtering**: Search by name, email, or phone
- **Customer History**: View complete order, payment, and return history
- **Customer Statistics**: Track total spent, remaining balance, and order count
- **CSV Import**: Bulk import customer data from CSV files
- **Automatic Customer Creation**: When processing sales, new customers are automatically added

### 📦 Product & Inventory Management
- **Add/Edit/Delete Products**: Complete product management with categories
- **Product Categories**: Smartphones, Tablets, Laptops, TVs, Audio, Accessories, Refrigerators, Washing Machines, Air Conditioners, Kitchen Appliances
- **Dynamic Category Creation**: New categories automatically created during CSV import
- **Stock Management**: Track available stock and sales
- **Low Stock Alerts**: Automatic notifications when stock runs low
- **Stock Movements**: Complete audit trail of all stock changes
- **Warranty Tracking**: Manage product warranties with expiration dates
- **Bulk Product Import**: CSV import for multiple products with auto-category creation

### 💸 Sales & Order Management
- **New Sales Interface**: Intuitive multi-product sales form
- **Invoice Generation**: Professional invoice creation with company branding
- **Automatic Calculations**: Tax, discount, and total calculations
- **Payment Methods**: Cash, Card, and Installment options
- **Order Tracking**: Complete order history and status tracking
- **Customer Assignment**: Easy customer selection and automatic addition
- **Stock Updates**: Automatic stock reduction on sales
- **Order Filtering**: Filter by status, date, and customer

### 🧾 Billing & Payment System
- **Bill Generation**: Auto-calculate totals with tax and discounts
- **Payment Tracking**: Monitor paid and remaining amounts
- **Payment Methods**: Support for multiple payment types
- **Due Date Management**: Track payment due dates
- **Payment History**: Complete payment tracking per customer
- **Outstanding Balance**: Track pending payments
- **Partial Payments**: Support for installment payments

### 🔁 Return & Replacement Handling
- **Return Processing**: Easy return request management
- **Return Reasons**: Categorized return reasons (defective, wrong item, etc.)
- **Return Time Limits**: Configurable return period (default 7 days)
- **Stock Updates**: Automatic stock restoration on approved returns
- **Return History**: Complete return tracking per customer
- **Return Status**: Pending, approved, rejected status tracking
- **Admin Approval**: Return requests require admin/staff approval

### 🔔 Reminders & Notifications
- **Payment Due Reminders**: Automatic overdue payment alerts
- **Low Stock Notifications**: Alerts when products run low
- **Return Expiry Reminders**: Notify when return period expires
- **System Notifications**: Real-time notification system
- **Reminder Management**: Mark as read, dismiss, or clear all

### 📊 Reports & Analytics
- **Sales Reports**: Daily, weekly, and monthly sales analysis
- **Customer Reports**: Top customers and purchase summaries
- **Product Performance**: Best-selling products and revenue tracking
- **Financial Summary**: Total sales, paid amounts, and outstanding balances
- **Dashboard Analytics**: Real-time business metrics
- **Date Range Filtering**: Custom date range reports

### ⚙️ Settings & Configuration
- **Business Settings**: Company information and contact details
- **Tax Configuration**: Configurable tax rates
- **Return Policy**: Set return period days
- **Notification Settings**: Enable/disable various alerts
- **Invoice Customization**: Customize invoice format and branding
- **User Management**: Add/edit/delete users with role assignments
- **Database Backup**: Automatic and manual backup options

### 🔄 Data Management
- **SQLite Database**: Reliable local database storage
- **CSV Import/Export**: Bulk data operations
- **Data Backup**: Automatic and manual backup options
- **Data Integrity**: Foreign key constraints and data validation
- **Stock Movements**: Complete audit trail of inventory changes
- **Transaction Support**: Database transactions for data consistency

## 🛠️ Technical Features

### 🎨 User Interface
- **Modern Design**: Beautiful gradient design with glassmorphism effects
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Dynamic content updates without page refresh
- **Intuitive Navigation**: Easy-to-use sidebar navigation
- **Fast Actions**: Optimized for quick operations as requested

### 🔧 System Architecture
- **Node.js Backend**: Express.js server with RESTful API
- **SQLite Database**: Reliable local database with full ACID compliance
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Granular permissions system
- **Modular Design**: Well-organized code structure

### 📱 Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Perfect tablet experience
- **Desktop Optimized**: Full desktop functionality
- **Touch-Friendly**: Large buttons and touch targets
- **Adaptive Layout**: Flexible grid systems

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone or Download the Project**
   ```bash
   # If using git
   git clone <repository-url>
   cd electrastore
   
   # Or extract from zip file
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Initialize Database**
   ```bash
   npm run init-db
   ```

4. **Start the Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the Application**
   - Open your browser and go to `http://localhost:3000`
   - Use the demo credentials to log in

### Demo Credentials
- **Admin**: `admin` / `admin123`
- **Staff**: `staff` / `staff123`
- **Cashier**: `cashier` / `cashier123`

## 📋 Usage Guide

### First Time Setup
1. **Login**: Use admin credentials for full access
2. **Configure Settings**: Set up company information and tax rates
3. **Add Categories**: Create product categories or they'll be auto-created during import
4. **Add Products**: Import or manually add your product catalog
5. **Add Customers**: Import or add customer information
6. **Start Selling**: Begin processing sales and managing inventory

### Creating a Sale
1. Navigate to **Orders** → **New Sale**
2. Select customer from dropdown or add new customer
3. Add products with quantities
4. Apply discounts if needed
5. Choose payment method
6. Enter amount paid
7. Complete sale and print invoice

### Managing Inventory
1. Go to **Products** section
2. View stock levels and alerts
3. Add new products or adjust existing stock
4. Monitor low stock alerts
5. Import products via CSV for bulk additions

### Processing Returns
1. Navigate to **Returns** section
2. Customer requests return (within return period)
3. Admin/Staff reviews and approves/rejects
4. Stock automatically updated on approval
5. Refund processed if applicable

### Importing Data

#### Customer CSV Format
```csv
name,email,phone,address,total_amount,paid_amount,due_amount
"John Doe","john@example.com","555-1234","123 Main St",1000.00,800.00,200.00
```

#### Product CSV Format
```csv
name,category,price,stock,warranty_months,low_stock_threshold
"iPhone 15 Pro","smartphones",999.99,25,12,10
"Samsung TV 55\"","tvs",1299.99,15,24,5
```

## 🔧 Configuration

### System Settings
- **Tax Rate**: Configure applicable tax percentage
- **Return Days**: Set return policy period
- **Company Info**: Business name, address, contact details
- **Notifications**: Enable/disable various alerts

### User Roles & Permissions
- **Admin**: Full system access, can delete data and manage settings
- **Staff**: Can manage products, customers, orders, and returns
- **Cashier**: Limited to sales and payment collection, requires admin password for special actions

### Database Configuration
The system uses SQLite database stored in the `database/` directory. The database includes:
- Users and authentication
- Products and categories
- Customers and orders
- Payments and returns
- Settings and reminders
- Stock movements and audit trail

## 🎯 Key Benefits

- **Complete Solution**: All-in-one electronics store management
- **Reliable Database**: SQLite provides ACID compliance and data integrity
- **Fast Performance**: Optimized for quick operations and fast actions
- **User-Friendly**: Intuitive interface for all skill levels
- **Scalable**: Handles growing business needs
- **Secure**: Role-based access control and JWT authentication
- **Mobile-Ready**: Works on all devices
- **Professional**: Print-ready invoices and reports

## 🔮 Advanced Features

### Cashier Mode
- Limited interface for cashier role
- Admin password required for:
  - Receiving payments from old customers
  - Processing returns
  - Accessing customer management
  - Viewing detailed reports

### Admin Panel
- Complete system control
- User management
- System settings
- Data backup and restore
- Comprehensive reporting

### Fast Actions
- Optimized for quick button clicks
- Minimal loading times
- Keyboard shortcuts support
- Batch operations
- Real-time updates

## 📞 Support & Maintenance

### Database Backup
- Automatic daily backups
- Manual backup option in settings
- Export data in JSON format
- Restore from backup files

### Troubleshooting
- Check server logs for errors
- Verify database connectivity
- Ensure proper file permissions
- Check port availability (default: 3000)

### Performance Optimization
- Database indexes for fast queries
- Efficient API endpoints
- Optimized frontend rendering
- Minimal resource usage

## 🏗️ File Structure

```
electrastore/
├── server.js                 # Main server file
├── package.json              # Dependencies and scripts
├── scripts/
│   └── init-database.js      # Database initialization
├── database/
│   └── electrastore.db       # SQLite database
├── public/
│   ├── index.html            # Main HTML file
│   ├── app.js                # Frontend JavaScript
│   └── app.css               # Styling
├── uploads/                  # File upload directory
└── README.md                 # This file
```

---

**ElectraStore** - Powering your electronics business with comprehensive management tools! 🚀📱💻

*Built with modern web technologies for reliability, performance, and ease of use.*
