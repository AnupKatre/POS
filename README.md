# POS Application - Tauri Desktop App

A modern Point of Sale (POS) application built with **Tauri**, featuring a Next.js frontend and Rust backend. This application provides a complete restaurant management solution with offline-first functionality and cross-platform support.

## 🚀 Features

### Core Functionality
- **Menu Management**: CRUD operations for menu items with categories and pricing
- **Order Processing**: Complete order lifecycle from creation to completion
- **Table Management**: Real-time table status tracking
- **Staff Management**: Employee management with roles and contact information
- **Analytics Dashboard**: Sales reports, order statistics, and performance metrics

### Technical Features
- **Offline-First**: Works completely offline with local SQLite database
- **Cross-Platform**: Windows, macOS, and Linux support
- **Embedded REST API**: Rust backend with Axum web framework
- **Data Synchronization**: Background sync with cloud services (configurable)
- **Modern UI**: Beautiful interface built with Next.js and Tailwind CSS
- **Type Safety**: Full TypeScript and Rust type safety

## 🛠 Technology Stack

### Frontend
- **Next.js 15** - React framework with static export
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend
- **Rust** - Systems programming language
- **Tauri** - Desktop application framework
- **Axum** - Web framework for Rust
- **SQLx** - Async SQL toolkit with SQLite
- **Tokio** - Async runtime
- **Serde** - Serialization framework

### Database
- **SQLite** - Lightweight, serverless database
- **Local Storage** - No internet dependency

## 📋 Prerequisites

Before building the application, ensure you have the following installed:

### Required Software
1. **Node.js** (v18 or higher)
2. **Rust** (latest stable)
3. **Tauri CLI**
4. **System Dependencies** (see below)

### System Dependencies

#### macOS
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

#### Windows
```bash
# Install Visual Studio Build Tools
# Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/

# Install Rust
# Download from: https://rustup.rs/
```

#### Linux (Ubuntu/Debian)
```bash
# Install system dependencies
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd POS
```

### 2. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Install Tauri CLI globally (if not already installed)
npm install -g @tauri-apps/cli
```

### 3. Development Mode
```bash
# Start the development server
npm run tauri:dev
```

This will:
- Build the Next.js frontend
- Start the Rust backend with embedded REST API
- Launch the Tauri desktop application
- Enable hot reloading for both frontend and backend

### 4. Production Build
```bash
# Build for production
npm run tauri:build
```

This creates platform-specific installers in the `src-tauri/target/release/bundle/` directory.

## 📁 Project Structure

```
POS/
├── src/                          # Next.js frontend
│   ├── app/                     # App Router pages
│   ├── components/              # React components
│   ├── data/                    # Static data
│   ├── hooks/                   # Custom React hooks
│   └── lib/                     # Utility functions
├── src-tauri/                   # Tauri backend
│   ├── src/
│   │   ├── main.rs             # Application entry point
│   │   ├── api/                # REST API endpoints
│   │   ├── db/                 # Database operations
│   │   ├── services/           # Business logic
│   │   ├── sync/               # Data synchronization
│   │   ├── utils/              # Utility functions
│   │   └── config.rs           # Configuration management
│   ├── Cargo.toml              # Rust dependencies
│   ├── tauri.conf.json         # Tauri configuration
│   └── build.rs                # Build script
├── package.json                 # Node.js dependencies
├── next.config.ts              # Next.js configuration
└── README.md                   # This file
```

## 🔧 Configuration

### Application Configuration
The application configuration is stored in `src-tauri/src/config.rs` and includes:

- **Database URL**: SQLite database location
- **API Port**: REST API server port (default: 3001)
- **Sync Interval**: Background sync frequency (default: 24 hours)
- **Max Days Without Sync**: Days before blocking access (default: 3)

### Environment Variables
Create a `.env` file in the root directory for environment-specific settings:

```env
# Database
DATABASE_URL=sqlite:pos_app.db

# API Configuration
API_PORT=3001

# Sync Configuration
SYNC_INTERVAL_HOURS=24
MAX_DAYS_WITHOUT_SYNC=3

# Cloud Sync (optional)
CLOUD_SYNC_URL=https://api.example.com/sync
```

## 🗄️ Database Schema

The application uses SQLite with the following main tables:

### Menu Items
```sql
CREATE TABLE menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Orders
```sql
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    table_number INTEGER NOT NULL,
    status TEXT NOT NULL,
    total_amount REAL NOT NULL,
    items TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Staff
```sql
CREATE TABLE staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints

The embedded REST API provides the following endpoints:

### Menu Management
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create new menu item
- `GET /api/menu/:id` - Get specific menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Order Management
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id` - Update order

### Staff Management
- `GET /api/staff` - Get all staff members
- `POST /api/staff` - Create new staff member
- `PUT /api/staff/:id` - Update staff member

### Analytics & Status
- `GET /api/analytics` - Get analytics summary
- `GET /api/status` - Get application status
- `POST /api/sync` - Trigger data synchronization

## 🔄 Data Synchronization

The application includes a robust sync system:

### Features
- **Background Sync**: Automatic periodic synchronization
- **Manual Sync**: On-demand synchronization via API
- **Sync Status Tracking**: Monitor sync health and history
- **Offline Enforcement**: Block access if sync is too old
- **Error Handling**: Graceful handling of sync failures

### Configuration
- **Sync Interval**: Configurable sync frequency
- **Max Days Without Sync**: Days before blocking access
- **Cloud Endpoint**: Configurable sync destination
- **Retry Logic**: Automatic retry on failure

## 🧪 Testing

### Frontend Tests
```bash
# Run TypeScript type checking
npm run typecheck

# Run linting
npm run lint
```

### Backend Tests
```bash
# Run Rust tests
cd src-tauri
cargo test
```

## 📦 Building for Distribution

### Development Build
```bash
npm run tauri:dev
```

### Production Build
```bash
npm run tauri:build
```

### Platform-Specific Builds
```bash
# Build for specific platform
npm run tauri:build -- --target x86_64-apple-darwin  # macOS Intel
npm run tauri:build -- --target aarch64-apple-darwin # macOS Apple Silicon
npm run tauri:build -- --target x86_64-pc-windows-msvc # Windows
npm run tauri:build -- --target x86_64-unknown-linux-gnu # Linux
```

## 🚀 Deployment

### Desktop Distribution
The application creates platform-specific installers:

- **Windows**: `.msi` installer
- **macOS**: `.dmg` disk image
- **Linux**: `.AppImage` and `.deb` packages

### Installation
1. Download the appropriate installer for your platform
2. Run the installer and follow the setup wizard
3. Launch the application from the installed location

## 🔧 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clean and rebuild
npm run clean
npm install
npm run tauri:build
```

#### Database Issues
```bash
# Reset database (development only)
rm src-tauri/pos_app.db
npm run tauri:dev
```

#### Sync Issues
- Check network connectivity
- Verify cloud sync endpoint configuration
- Review sync logs in application

### Logs
Application logs are available in:
- **macOS**: `~/Library/Logs/pos-app/`
- **Windows**: `%APPDATA%\pos-app\logs\`
- **Linux**: `~/.local/share/pos-app/logs/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

## 🔮 Roadmap

- [ ] Mobile app support (React Native)
- [ ] Cloud-based menu management
- [ ] Advanced analytics and reporting
- [ ] Multi-location support
- [ ] Payment processing integration
- [ ] Inventory management
- [ ] Customer loyalty system
- [ ] Advanced printing options

---

**Built with ❤️ using Tauri, Next.js, and Rust**
