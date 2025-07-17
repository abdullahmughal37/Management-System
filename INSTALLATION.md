# ElectraStore Installation Guide

## Quick Start

### Prerequisites
- Node.js (v14 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)

### Installation Steps

1. **Extract the project files** to your desired directory

2. **Open terminal/command prompt** in the project directory

3. **Run the startup script** (Linux/Mac):
   ```bash
   ./start.sh
   ```

   **Or manually** (Windows/Linux/Mac):
   ```bash
   npm install
   npm run init-db
   npm start
   ```

4. **Access the application** at `http://localhost:3000`

### Demo Credentials
- **Admin**: `admin` / `admin123`
- **Staff**: `staff` / `staff123`
- **Cashier**: `cashier` / `cashier123`

## Features Overview

### ✅ What's Included
- **SQLite Database**: Reliable local storage
- **User Authentication**: Role-based access control
- **Customer Management**: Add, edit, delete, import customers
- **Product Management**: Full inventory management with categories
- **Sales Processing**: Complete order management system
- **Payment Tracking**: Track payments and due amounts
- **Return Management**: Handle returns and refunds
- **CSV Import**: Bulk import customers and products
- **Reports**: Sales and inventory reports
- **Settings**: Configurable system settings

### 🔧 System Requirements
- **RAM**: 512MB minimum (1GB recommended)
- **Storage**: 100MB for application + data storage
- **Browser**: Modern web browser (Chrome, Firefox, Safari, Edge)
- **OS**: Windows, macOS, or Linux

## Usage

### First Time Setup
1. Login with admin credentials
2. Configure company settings
3. Import or add products
4. Import or add customers
5. Start processing sales

### Sample Data
Sample CSV files are provided in the `sample-data/` directory:
- `customers.csv` - Sample customer data
- `products.csv` - Sample product data

### Key Features

#### Customer Management
- Add customers with contact details
- Track total purchases and due amounts
- Import from CSV files
- Search and filter customers

#### Product Management
- Add products with categories
- Track stock levels
- Low stock alerts
- Import from CSV with auto-category creation

#### Sales Processing
- Quick sale interface
- Multiple payment methods
- Automatic stock updates
- Invoice generation

#### Role-Based Access
- **Admin**: Full system access
- **Staff**: Sales, customers, products, returns
- **Cashier**: Limited to sales processing

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change port in `server.js` (line 13)
   - Or stop other services using port 3000

2. **Database errors**
   - Delete `database/electrastore.db` and run `npm run init-db`

3. **Permission errors**
   - Ensure write permissions in project directory

4. **Module not found**
   - Run `npm install` again

### Support
- Check the main `README.md` for detailed documentation
- Ensure all dependencies are installed
- Verify Node.js version compatibility

## Security Notes
- Change default passwords after first login
- Use HTTPS in production environments
- Regular database backups recommended
- Keep Node.js and dependencies updated

---

**ElectraStore** - Your complete electronics store management solution! 🚀