# LV Capital Partners

[![Deploy Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/lv-capital-partners/deploys)
[![GitHub Workflow Status](https://github.com/your-username/lv-capital-partners/workflows/Deploy%20to%20Netlify/badge.svg)](https://github.com/your-username/lv-capital-partners/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A sophisticated real estate investment platform designed for high-net-worth individuals and accredited investors. LV Capital Partners provides a comprehensive suite of tools for investment management, portfolio tracking, and investor relations.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Clerk for secure user management
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **Email**: Resend for transactional emails
- **Analytics**: Google Analytics 4 with consent management
- **Deployment**: Netlify with automated CI/CD
- **Package Manager**: Bun for fast dependency management

## ✨ Features

### 🔐 Authentication & Security
- Secure user authentication with Clerk
- Accredited investor verification system
- Row-level security (RLS) in database
- Document upload and secure storage
- Multi-factor authentication support

### 📊 Investment Management
- Real-time portfolio tracking and analytics
- Investment opportunity showcase
- Deal flow management
- Performance metrics and IRR calculations
- Document generation (PDF reports)

### 💼 Investor Dashboard
- Interactive portfolio analytics with charts
- Real-time notifications system
- Advanced search and filtering
- Export capabilities (PDF/Excel)
- Dark/light theme support

### 📧 Communication
- Automated email notifications
- Quarterly performance reports
- Investment opportunity alerts
- Document sharing capabilities

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Git
- A Supabase account
- A Clerk account
- A Resend account (for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/lv-capital-partners.git
   cd lv-capital-partners
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your actual values:
   ```env
   # Authentication - Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_WEBHOOK_SECRET=your_webhook_secret

   # Database - Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Email - Resend
   RESEND_API_KEY=your_resend_api_key
   RESEND_FROM_EMAIL=noreply@yourdomain.com

   # Analytics
   NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX

   # Application URLs
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. **Set up the database**
   ```bash
   # Run migrations in Supabase
   # Navigate to your Supabase dashboard > SQL Editor
   # Run the migration files in order from /supabase/migrations/
   ```

5. **Start the development server**
   ```bash
   bun dev
   ```

   The application will be available at `http://localhost:3000`

## 🗄️ Database Setup

### Supabase Configuration

1. Create a new Supabase project
2. Run the SQL migrations in order:
   - `001_initial_schema.sql` - Core database structure
   - `002_sample_data.sql` - Sample investment data
   - `003_production_rls_policies.sql` - Security policies
   - `004_sample_data_production.sql` - Additional sample data

3. Enable Row Level Security (RLS) on all tables
4. Configure authentication providers in Supabase Auth

### Sample Data

The project includes comprehensive sample data for demonstration:
- 5+ realistic investment opportunities
- Sample user portfolios with performance metrics
- Distribution history and financial projections
- Document templates and reports

## 🎯 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_test_...` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGci...` |
| `RESEND_API_KEY` | Resend API key | `re_...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_GA_TRACKING_ID` | Google Analytics tracking ID | - |
| `RESEND_FROM_EMAIL` | From email address | `noreply@yourdomain.com` |
| `NEXTAUTH_SECRET` | NextAuth secret | Auto-generated |

## 📦 Development

### Available Scripts

```bash
# Start development server
bun dev

# Build for production
bun build

# Start production server
bun start

# Run linting
bun lint

# Format code
bun format
```

### Code Quality

The project uses:
- **TypeScript** for type safety
- **Biome** for linting and formatting
- **ESLint** for additional code quality checks
- **Prettier** (via Biome) for consistent formatting

### Project Structure

```
lv-capital-partners/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   └── verification/   # Investor verification components
│   ├── lib/                # Utility functions and configurations
│   │   ├── analytics/      # Google Analytics integration
│   │   ├── database/       # Database schemas and helpers
│   │   ├── email/          # Email templates and functions
│   │   ├── hooks/          # Custom React hooks
│   │   └── pdf/            # PDF generation utilities
│   └── types/              # TypeScript type definitions
├── supabase/
│   └── migrations/         # Database migration files
├── public/                 # Static assets
└── .github/
    └── workflows/          # GitHub Actions CI/CD
```

## 🚀 Deployment

### Netlify Deployment

The project is configured for automatic deployment to Netlify via GitHub Actions.

#### Manual Deployment

1. Build the project:
   ```bash
   bun build
   ```

2. Deploy to Netlify:
   ```bash
   netlify deploy --prod --dir=.next
   ```

#### Automated CI/CD

The GitHub Actions workflow automatically:
- Runs linting and type checking
- Builds the application
- Deploys to Netlify on push to `main`
- Creates preview deployments for pull requests
- Runs security scans

### Environment Variables for Production

Set these secrets in your GitHub repository (Settings > Secrets and variables > Actions):

- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`
- All environment variables listed in the Environment Variables section

## 🔒 Security

### Authentication
- JWT-based authentication with Clerk
- Secure session management
- Multi-factor authentication support

### Data Protection
- Row-level security in Supabase
- Encrypted sensitive data storage
- GDPR-compliant data handling

### API Security
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration

## 📊 Analytics

The platform includes comprehensive analytics:
- Google Analytics 4 integration
- Custom event tracking for investments
- User journey analytics
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## 📋 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Project Wiki](https://github.com/your-username/lv-capital-partners/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/lv-capital-partners/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/lv-capital-partners/discussions)

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Advanced portfolio analytics
- [ ] Integration with additional data providers
- [ ] Multi-language support
- [ ] Enhanced document management
- [ ] API for third-party integrations

---

**Built with ❤️ for the real estate investment community**
