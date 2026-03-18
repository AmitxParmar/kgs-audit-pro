# KGS Audit Pro

A comprehensive audit management system built with modern web technologies for managing ISO certifications, audit lifecycles, and compliance documentation.

## 🏗️ Architecture

This project uses a monorepo structure with the following applications:

- **Client**: React SPA with Vite, TypeScript, and Tailwind CSS
- **Server**: Express.js API with TypeScript and Supabase
- **Shared Types**: Common TypeScript types and Zod schemas
- **Database**: Supabase (PostgreSQL) with Row Level Security

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router v6** for routing
- **TanStack Query** for data fetching
- **Zustand** for state management
- **React Hook Form** with Zod validation
- **shadcn/ui** component library

### Backend
- **Node.js** with Express and TypeScript
- **Supabase** for database and authentication
- **Zod** for schema validation
- **JWT** for authentication
- **Multer** for file uploads
- **Nodemailer** for email notifications

### Database
- **PostgreSQL** via Supabase
- **Row Level Security (RLS)** for data access control
- **Database migrations** and seed data

### DevOps
- **Turborepo** for monorepo management
- **GitHub Actions** for CI/CD
- **ESLint** and **TypeScript** for code quality

## 📁 Project Structure

```
kgs-audit-pro/
├── apps/
│   ├── client/                 # React SPA
│   │   ├── src/
│   │   │   ├── components/     # UI components
│   │   │   ├── features/       # Feature modules
│   │   │   ├── hooks/          # Custom hooks
│   │   │   ├── lib/            # Utilities
│   │   │   └── pages/          # Route pages
│   │   └── package.json
│   └── server/                 # Express API
│       ├── src/
│       │   ├── config/         # App configuration
│       │   ├── middleware/     # Express middleware
│       │   ├── modules/        # Feature modules
│       │   └── shared/         # Shared utilities
│       └── package.json
├── packages/
│   └── shared-types/           # Common types
├── supabase/
│   ├── migrations/             # Database migrations
│   └── seed/                  # Sample data
└── .github/workflows/          # CI/CD pipelines
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kgs-audit-pro
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration (see Environment Variables section below)
```

### Environment Variables

#### Development Environment
Create a `.env` file in the root directory with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_minimum_32_characters

# Email Configuration (optional, for notifications)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,png,jpg,jpeg

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000
```

#### UAT Environment
Create UAT environment files for testing:

**Client UAT (.env.uat):**
```bash
VITE_SUPABASE_URL=https://your-uat-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-uat-supabase-anon-key
VITE_API_URL=https://your-uat-api-url.com
```

**Server UAT (.env.uat):**
```bash
NODE_ENV=uat
PORT=3002
SUPABASE_URL=https://your-uat-supabase-url.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-uat-supabase-service-role-key
JWT_SECRET=your-uat-jwt-secret-key-minimum-32-characters
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-uat-email@gmail.com
SMTP_PASS=your-uat-app-password
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,png,jpg,jpeg
ALLOWED_ORIGINS=https://your-uat-frontend-url.com
```

### Development

Start all applications in development mode:
```bash
npm run dev
```

**Development URLs:**
- **Client**: http://localhost:3000
- **Server**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### UAT Environment

Start all applications in UAT mode:
```bash
npm run uat
```

**UAT URLs:**
- **Client**: http://localhost:3000 (UAT mode)
- **Server**: http://localhost:3002 (UAT mode)
- **Health Check**: http://localhost:3002/health

### Individual Services

You can also start individual services:

#### Development
```bash
# Client only
npm run dev:client

# Server only
npm run dev:server
```

#### UAT
```bash
# Client only (UAT mode)
npm run uat:client

# Server only (UAT mode)
npm run uat:server
```

### Building

#### Production Build
Build all applications for production:
```bash
npm run build
```

#### UAT Build
Build all applications for UAT:
```bash
npm run build:uat
```

#### Individual Builds
```bash
# Client production build
npm run build:client

# Client UAT build
npm run build:uat

# Server production build
npm run build:server

# Server UAT build
npm run build:uat
```

### Production Start

#### Development Production
Start production servers with development build:
```bash
npm run start
```

#### UAT Production
Start production servers with UAT build:
```bash
npm run start:uat
```

#### Individual Production Starts
```bash
# Client only
npm run start:client

# Server only
npm run start:server

# Client UAT only
npm run start:uat

# Server UAT only
npm run start:uat
```

### Testing

Run all tests:
```bash
npm run test
```

### Linting & Type Checking

```bash
# Run linting (all packages)
npm run lint

# Run type checking (all packages)
npm run type-check

# Clean build artifacts
npm run clean
```

## 🚀 Command Reference

| Environment | Command | Purpose | Ports |
|------------|----------|---------|--------|
| **Development** | `npm run dev` | Start both services | 3000/3001 |
| **Development** | `npm run dev:client` | Client only | 3000 |
| **Development** | `npm run dev:server` | Server only | 3001 |
| **UAT** | `npm run uat` | Start both UAT services | 3000/3002 |
| **UAT** | `npm run uat:client` | Client UAT only | 3000 |
| **UAT** | `npm run uat:server` | Server UAT only | 3002 |
| **Production** | `npm run build` | Build for production | N/A |
| **UAT** | `npm run build:uat` | Build for UAT | N/A |
| **Production** | `npm run start` | Start production | N/A |
| **UAT** | `npm run start:uat` | Start UAT production | N/A |

### Environment Files

| Environment | Client File | Server File | Description |
|------------|--------------|-------------|-------------|
| Development | `apps/client/.env` | `apps/server/.env` | Local development |
| UAT | `apps/client/.env.uat` | `apps/server/.env.uat` | User acceptance testing |

### Quick Start Guide

#### 1. Development Setup
```bash
cd kgs-audit-pro
npm install
npm run dev
```

#### 2. UAT Setup
```bash
cd kgs-audit-pro
# Configure .env.uat files
npm run uat
```

#### 3. Production Deployment
```bash
cd kgs-audit-pro
npm run build
npm run start
```

## 📊 Features

### Audit Lifecycle Management
- Client onboarding and audit planning
- Audit execution with checklists
- Non-conformity tracking and resolution
- Report review and certificate generation

### Auditor Competency
- Auditor profiles and certifications
- Training records and CPD tracking
- Competency assessments
- Staff enrollment and management

### Accreditation
- Document management system
- Accreditation audit workflows
- Review and approval processes
- Standard compliance tracking

### Administration
- User access management with RBAC
- Audit standards configuration
- User activity logging
- System settings and recycle bin

## 🔐 Security

- **Row Level Security** in Supabase for data access control
- **JWT-based authentication** with refresh tokens
- **Role-based access control** (RBAC)
- **Input validation** with Zod schemas
- **Rate limiting** and CORS protection
- **Audit logging** for all data changes

## 🚀 Deployment

### Production Deployment

The project is configured for automatic deployment via GitHub Actions:

1. **Frontend** deploys to Vercel
2. **Backend** deploys to Railway
3. **Database** migrations run automatically

### Manual Deployment

1. Build the applications:
```bash
npm run build
```

2. Deploy client to Vercel:
```bash
cd apps/client
vercel --prod
```

3. Deploy server to Railway:
```bash
cd apps/server
railway up
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
npm run dev	Development (both)	3000/3001
npm run uat	UAT (both)	3000/3002
npm run build	Production build	N/A
npm run build:uat	UAT build	N/A
npm run start	Production start	N/A
npm run start:uat	UAT production start	N/A
npm run dev:client	Client only	3000
npm run dev:server	Server only	3001
npm run uat:client	Client UAT only	3000
npm run uat:server	Server UAT only	3002