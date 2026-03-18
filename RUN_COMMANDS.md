# KGS Audit Pro - Run Commands

## 🚀 Development Commands

### Full Development (Both Client & Server)
```bash
# From project root
npm run dev

# From project root (client only)
npm run dev:client

# From project root (server only)
npm run dev:server

# From client directory
npm run dev

# From server directory
npm run dev
```

### Development URLs
- **Client**: http://localhost:3000
- **Server**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

---

## 🧪 UAT Commands

### Full UAT (Both Client & Server)
```bash
# From project root
npm run uat

# From project root (client only)
npm run uat:client

# From project root (server only)
npm run uat:server

# From client directory
npm run uat

# From server directory
npm run uat
```

### UAT URLs
- **Client**: http://localhost:3000 (UAT mode)
- **Server**: http://localhost:3002 (UAT mode)
- **Health Check**: http://localhost:3002/health

---

## 🏗️ Build Commands

### Production Build
```bash
# From project root (both)
npm run build

# From project root (client only)
npm run build:client

# From project root (server only)
npm run build:server

# From client directory
npm run build

# From server directory
npm run build
```

### UAT Build
```bash
# From client directory
npm run build:uat

# From server directory
npm run build:uat

# From project root
npm run build:uat
```

---

## 🚀 Production Start Commands

### Production Start
```bash
# From project root (both)
npm run start

# From project root (client only)
npm run start:client

# From project root (server only)
npm run start:server

# From client directory
npm run start

# From server directory
npm run start
```

### UAT Production Start
```bash
# From client directory
npm run start:uat

# From server directory
npm run start:uat

# From project root
npm run start:uat
```

---

## 🛠️ Utility Commands

### Linting
```bash
# From project root (all packages)
npm run lint

# From client directory
npm run lint

# From server directory
npm run lint
```

### Type Checking
```bash
# From project root (all packages)
npm run type-check

# From client directory
npm run type-check

# From server directory
npm run type-check
```

### Testing
```bash
# From project root (all packages)
npm run test

# From server directory
npm run test
```

### Cleaning
```bash
# From project root (all packages)
npm run clean

# From server directory
npm run clean
```

---

## 📁 Environment Configuration

### Development Environment Files
- **Client**: `apps/client/.env`
- **Server**: `apps/server/.env`

### UAT Environment Files
- **Client**: `apps/client/.env.uat`
- **Server**: `apps/server/.env.uat`

### Environment Variables Setup

#### Client (.env/.env.uat)
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=your_api_url
```

#### Server (.env/.env.uat)
```bash
NODE_ENV=development|uat|production
PORT=3001|3002
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret_minimum_32_characters
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,png,jpg,jpeg
ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com
```

---

## 🔧 Quick Start Guide

### 1. Development Setup
```bash
# Navigate to project root
cd kgs-audit-pro

# Install dependencies
npm install

# Start development servers
npm run dev
```

### 2. UAT Setup
```bash
# Configure UAT environment files
# Edit apps/client/.env.uat
# Edit apps/server/.env.uat

# Start UAT servers
npm run uat
```

### 3. Production Deployment
```bash
# Build for production
npm run build

# Start production servers
npm run start
```

---

## 📊 Port Configuration

| Environment | Client Port | Server Port | Description |
|-------------|--------------|--------------|-------------|
| Development | 3000 | 3001 | Local development |
| UAT | 3000 | 3002 | User acceptance testing |
| Production | 80/443 | 80/443 | Production deployment |

---

## 🌐 Mode Differences

### Development Mode
- Hot reload enabled
- Detailed error messages
- Debug logging
- Local database

### UAT Mode
- Production-like build
- UAT database/environment
- Staging configuration
- Performance monitoring

### Production Mode
- Optimized build
- Production database
- Minimal logging
- Security hardening
