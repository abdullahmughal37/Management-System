# How to Run ElectraStore After Downloading

## Step-by-Step Guide

### 1. Extract the ZIP File
After downloading the zip file:
- **Windows**: Right-click the zip file → "Extract All" → Choose destination folder
- **Linux/Mac**: Use terminal or file manager to extract
  ```bash
  unzip electrastore.zip
  cd electrastore
  ```

### 2. Install Prerequisites
Make sure you have Node.js installed:
- Download from [nodejs.org](https://nodejs.org/) (v14 or higher)
- npm comes automatically with Node.js

**Check if installed:**
```bash
node --version
npm --version
```

### 3. Navigate to Project Directory
Open terminal/command prompt in the extracted folder:
```bash
cd path/to/extracted/electrastore
```

### 4. Run the Application

#### Option A: Quick Start (Linux/Mac)
```bash
chmod +x start.sh
./start.sh
```

#### Option B: Manual Steps (All platforms)
```bash
# Install dependencies
npm install

# Initialize database
npm run init-db

# Start the server
npm start
```

### 5. Access the Application
- Open your web browser
- Go to: `http://localhost:3000`
- Use demo credentials:
  - **Admin**: `admin` / `admin123`
  - **Staff**: `staff` / `staff123`
  - **Cashier**: `cashier` / `cashier123`

## What Happens During Setup

1. **Dependencies Installation**: Downloads required Node.js packages
2. **Database Initialization**: Creates SQLite database with sample data
3. **Server Start**: Launches the web application on port 3000

## Troubleshooting

### Common Issues:

**"Port 3000 already in use"**
- Stop other applications using port 3000
- Or change port in `server.js` (line 13)

**"Permission denied" (Linux/Mac)**
```bash
chmod +x start.sh
```

**"Module not found"**
```bash
rm -rf node_modules
npm install
```

**Database errors**
```bash
rm database/electrastore.db
npm run init-db
```

### System Requirements:
- **Node.js**: v14 or higher
- **RAM**: 512MB minimum (1GB recommended)
- **Storage**: 100MB for application + data
- **Browser**: Modern web browser

## Features Available After Setup:
- ✅ Customer Management
- ✅ Product Inventory
- ✅ Sales Processing
- ✅ Payment Tracking
- ✅ Return Management
- ✅ CSV Import/Export
- ✅ Reports Generation
- ✅ User Authentication

## Next Steps:
1. Login with admin credentials
2. Configure company settings
3. Import sample data from `sample-data/` folder
4. Start managing your electronics store!

---
**Need help?** Check `INSTALLATION.md` and `README.md` for detailed documentation.