# ElectraStore Dashboard

A comprehensive electronics store management dashboard built with HTML, CSS, and JavaScript. This dashboard provides all the essential features needed to manage an electronics store including customer management, inventory tracking, billing, and payment monitoring.

## Features

### 🏪 Store Management
- **Dashboard Overview**: Real-time statistics including total orders, sales, visitors, and revenue
- **Interactive Charts**: Customer overview line chart and customer segmentation donut chart
- **Modern UI**: Beautiful gradient design with glassmorphism effects

### 👥 Customer Management
- Add, edit, and manage customer information
- View customer purchase history and billing details
- Track customer orders and payment status
- Customer search and filtering capabilities

### 📱 Product Management
- Add and manage electronics inventory (smartphones, tablets, laptops, accessories, audio)
- Track stock levels and sales performance
- Product categorization and pricing management
- Best-selling products tracking

### 💰 Billing & Payment System
- Create and manage customer orders
- Track payment status (paid, pending, remaining amounts)
- Payment reminders for outstanding balances
- Multiple payment methods support (cash, card, installments)
- Return and refund management

### 📊 Analytics & Reporting
- Sales performance tracking
- Customer behavior analytics
- Inventory movement reports
- Revenue and profit analysis

### 🔔 Notifications & Reminders
- Payment reminder system for customers with pending payments
- Low stock alerts
- Order status notifications
- Message system for customer communication

## File Structure

```
electronics-store-dashboard/
├── index.html          # Main HTML structure
├── style.css           # Complete styling and responsive design
├── script.js           # JavaScript functionality and data management
└── README.md           # This documentation file
```

## Getting Started

1. **Download the files**: Save all four files (`index.html`, `style.css`, `script.js`, `README.md`) in the same directory.

2. **Open the dashboard**: Open `index.html` in your web browser.

3. **Start using**: The dashboard is ready to use with sample data included.

## How to Use

### Dashboard Overview
- The main dashboard shows key metrics: total orders, sales, visitors, and revenue
- View interactive charts showing customer trends and segmentation
- Check recent messages, best-selling products, and recent orders

### Customer Management
1. Click on "Customers" in the sidebar
2. Use "Add Customer" to register new customers
3. Edit existing customers by clicking "Edit"
4. View customer bills and payment history

### Product Management
1. Navigate to "Products" section
2. Add new products with details like name, category, price, and stock
3. Edit existing products to update pricing or stock levels
4. Monitor which products are selling best

### Billing & Orders
1. Go to "Billing" section to view all orders
2. Create new orders for customers
3. Update payment status when customers make payments
4. Send payment reminders to customers with pending balances

### Payment Tracking
- **Paid Amount**: Track how much customers have paid
- **Remaining Amount**: Monitor outstanding balances
- **Payment Methods**: Support for cash, card, and installment payments
- **Reminders**: Automated reminder system for pending payments

## Data Storage

The dashboard uses browser's `localStorage` to persist data including:
- Customer information
- Product inventory
- Order history
- Payment records
- Messages

Data is automatically saved when you make changes and loaded when you refresh the page.

## Sample Data

The dashboard comes with pre-loaded sample data:
- **Products**: iPhone 15 Pro, Samsung Galaxy S24, MacBook Pro, AirPods Pro, iPad Pro
- **Orders**: Sample orders with different payment statuses
- **Customers**: Sample customer data
- **Messages**: Customer communication examples

## Responsive Design

The dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

The interface adapts to different screen sizes with:
- Collapsible sidebar on mobile
- Responsive grid layouts
- Touch-friendly buttons and controls

## Browser Compatibility

Compatible with all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Customization

### Colors and Themes
- Primary color: Orange gradient (#FF6B35 to #F7931E)
- Secondary color: Blue (#667eea)
- Background: Purple gradient
- Easy to customize in `style.css`

### Adding New Features
The JavaScript is modular and easy to extend:
- Add new product categories
- Implement additional payment methods
- Create custom reports
- Add more customer fields

## Features for Electronics Store

### Inventory Management
- Track stock levels for electronics
- Automatic low stock alerts
- Product categorization (smartphones, laptops, tablets, etc.)
- Sales performance tracking

### Customer Relations
- Complete customer database
- Purchase history tracking
- Payment reminders
- Communication system

### Financial Management
- Track total sales and revenue
- Monitor pending payments
- Payment method analytics
- Profit margin tracking

## Future Enhancements

Potential features to add:
- Barcode scanning integration
- Email notification system
- Advanced reporting with charts
- Multi-store management
- Supplier management
- Warranty tracking
- Customer loyalty programs

## Support

This is a standalone HTML/CSS/JavaScript application that runs entirely in the browser. No server setup or database configuration required.

For customization help or questions, refer to the well-commented code in the JavaScript file.

## License

This project is provided as-is for educational and commercial use. Feel free to modify and customize according to your needs.

---

**ElectraStore Dashboard** - Your complete electronics store management solution!
