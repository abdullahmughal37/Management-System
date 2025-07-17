# ElectraStore - Comprehensive Electronics Store Management System

A complete electronics store management dashboard built with HTML, CSS, and JavaScript. This system provides all the essential features needed to manage an electronics store including customer management, inventory tracking, billing, sales, returns, and comprehensive reporting.

## 🚀 Features Overview

### 🔐 User Authentication & Roles
- **Login System**: Secure authentication with role-based access
- **Admin Role**: Full access to all features including deletion and settings
- **Staff Role**: Limited access to sales, customers, and products
- **Demo Credentials**:
  - Admin: `admin` / `admin123`
  - Staff: `staff` / `staff123`

### 👥 Customer Management
- **Add New Customer**: Name, contact information, and address
- **View/Edit/Delete Customer**: Full CRUD operations
- **Customer Search & Filtering**: Search by name, email, or phone
- **Customer History**: View complete order, payment, and return history
- **Customer Statistics**: Track total spent, remaining balance, and order count
- **Active/Inactive Filtering**: Filter customers by recent activity
- **CSV Import**: Bulk import customer data from CSV files

### 📦 Product & Inventory Management
- **Add/Edit/Delete Products**: Complete product management
- **Product Categories**: Smartphones, Tablets, Laptops, TVs, Audio, Accessories
- **Stock Management**: Track available stock and sales
- **Low Stock Alerts**: Automatic notifications when stock runs low
- **Stock Adjustments**: Easy stock level modifications
- **Product Performance**: Track sales and revenue per product
- **Warranty Tracking**: Manage product warranties
- **Bulk Product Import**: CSV import for multiple products
- **Product Categories**: Organized product classification

### 💸 Sales & Order Management
- **New Sales Interface**: Intuitive multi-product sales form
- **Invoice Generation**: Professional invoice creation and printing
- **Automatic Calculations**: Tax, discount, and total calculations
- **Payment Methods**: Cash, Card, and Installment options
- **Order Tracking**: Complete order history and status tracking
- **Customer Selection**: Easy customer assignment to orders
- **Stock Updates**: Automatic stock reduction on sales
- **Order Filtering**: Filter by status, date, and customer

### 🧾 Billing & Payment System
- **Bill Generation**: Auto-calculate totals with tax and discounts
- **Payment Tracking**: Monitor paid and remaining amounts
- **Payment Methods**: Support for multiple payment types
- **Due Date Management**: Track payment due dates
- **Payment Reminders**: Automated reminder system
- **Payment History**: Complete payment tracking per customer
- **Outstanding Balance**: Track pending payments

### 🔁 Return & Replacement Handling
- **Return Processing**: Easy return request management
- **Return Reasons**: Categorized return reasons (defective, wrong item, etc.)
- **Return Time Limits**: Configurable return period (default 7 days)
- **Stock Updates**: Automatic stock restoration on approved returns
- **Return History**: Complete return tracking per customer
- **Return Status**: Pending, approved, rejected status tracking
- **Return Notifications**: Admin notifications for return requests

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
- **Date Range Filtering**: Custom date range reports
- **Export Functionality**: Export reports to PDF/Excel format

### ⚙️ Settings & Configuration
- **Business Settings**: Company information and contact details
- **Tax Configuration**: Configurable tax rates
- **Return Policy**: Set return period days
- **Notification Settings**: Enable/disable various alerts
- **Theme Options**: Multiple theme choices
- **Data Management**: Backup, export, and restore data
- **Invoice Customization**: Customize invoice format and branding

### 🔄 Data Management
- **CSV Import/Export**: Bulk data operations
- **Data Backup**: Automatic and manual backup options
- **Data Export**: Export all data in JSON format
- **Data Restoration**: Restore from backup files
- **Local Storage**: Client-side data persistence

## 🛠️ Technical Features

### 🎨 User Interface
- **Modern Design**: Beautiful gradient design with glassmorphism effects
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Interactive Charts**: Customer analytics and sales visualization
- **Real-time Updates**: Dynamic content updates without page refresh
- **Intuitive Navigation**: Easy-to-use sidebar navigation
- **Modal Dialogs**: Clean modal interfaces for forms and details

### 🔧 System Architecture
- **Client-Side Application**: Pure HTML, CSS, and JavaScript
- **Local Storage**: Browser-based data persistence
- **Modular Design**: Well-organized code structure
- **Event-Driven**: Responsive user interactions
- **No Backend Required**: Runs entirely in the browser

### 📱 Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Perfect tablet experience
- **Desktop Optimized**: Full desktop functionality
- **Touch-Friendly**: Large buttons and touch targets
- **Adaptive Layout**: Flexible grid systems

## 🚀 Getting Started

### Installation
1. Clone or download the repository
2. Open `index.html` in a web browser
3. Use demo credentials to log in:
   - Admin: `admin` / `admin123`
   - Staff: `staff` / `staff123`

### First Time Setup
1. **Login**: Use admin credentials for full access
2. **Configure Settings**: Set up company information and tax rates
3. **Add Products**: Import or manually add your product catalog
4. **Add Customers**: Import or add customer information
5. **Start Selling**: Begin processing sales and managing inventory

## 📋 Usage Guide

### Creating a Sale
1. Navigate to **Orders** → **New Sale**
2. Select customer from dropdown
3. Add products with quantities
4. Apply discounts if needed
5. Choose payment method
6. Enter amount paid
7. Complete sale and print invoice

### Managing Inventory
1. Go to **Inventory** section
2. View stock levels and alerts
3. Add new products or adjust existing stock
4. Monitor low stock alerts
5. Import products via CSV for bulk additions

### Processing Returns
1. Navigate to **Returns** section
2. Click **Process Return**
3. Select order and product
4. Choose return reason
5. Add notes if needed
6. Submit for approval

### Generating Reports
1. Go to **Reports** section
2. Select report type and date range
3. Apply filters as needed
4. View analytics and summaries
5. Export reports if required

## 🔧 Configuration

### System Settings
- **Tax Rate**: Configure applicable tax percentage
- **Return Days**: Set return policy period
- **Company Info**: Business name, address, contact details
- **Notifications**: Enable/disable various alerts

### User Management
- **Admin Users**: Full system access
- **Staff Users**: Limited access to sales and customers
- **Role Permissions**: Configurable user permissions

## 💾 Data Management

### Backup & Restore
- **Auto Backup**: Automatic data backup on changes
- **Manual Backup**: On-demand backup creation
- **Export Data**: Download complete data in JSON format
- **Import Data**: Restore from backup files

### CSV Import Formats

#### Customer Import Format
```csv
name,email,phone,address
"John Doe","john@example.com","555-1234","123 Main St"
```

#### Product Import Format
```csv
name,category,price,stock,warranty,lowStockThreshold
"iPhone 15","smartphones",999.99,25,12,10
```

## 🎯 Key Benefits

- **Complete Solution**: All-in-one electronics store management
- **No Installation**: Browser-based, no server required
- **User-Friendly**: Intuitive interface for all skill levels
- **Scalable**: Handles growing business needs
- **Secure**: Role-based access control
- **Customizable**: Configurable settings and preferences
- **Mobile-Ready**: Works on all devices
- **Professional**: Print-ready invoices and reports

## 🔮 Future Enhancements

- **Cloud Integration**: Online data synchronization
- **Email Notifications**: Automated email alerts
- **Advanced Analytics**: More detailed reporting
- **Multi-Store Support**: Manage multiple locations
- **API Integration**: Connect with external systems
- **Advanced Inventory**: Batch tracking and expiration dates

## 📞 Support

This is a demonstration system built for educational and small business purposes. The system uses local storage for data persistence, making it perfect for single-user or small team environments.

## 🏗️ File Structure

```
electronics-store-dashboard/
├── index.html          # Main HTML structure and modals
├── style.css           # Complete styling and responsive design
├── script.js           # JavaScript functionality and data management
└── README.md           # This documentation file
```

## 🎨 Design Features

- **Glassmorphism Effects**: Modern transparent design elements
- **Gradient Backgrounds**: Beautiful color gradients
- **Smooth Animations**: Engaging user interactions
- **Professional Typography**: Clean, readable fonts
- **Consistent Iconography**: FontAwesome icons throughout
- **Color-Coded Status**: Visual status indicators
- **Responsive Grid**: Flexible layout system

---

**ElectraStore** - Powering your electronics business with comprehensive management tools! 🚀📱💻
