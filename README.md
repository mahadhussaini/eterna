# ❤️ Eterna - Find Your Perfect Match

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)](https://prisma.io/)
[![PWA](https://img.shields.io/badge/PWA-Ready-FF6B6B)](https://web.dev/progressive-web-apps/)

**A modern, AI-powered dating app built with Next.js 15, featuring real-time chat, swipe matching, and premium PWA capabilities.**

[🚀 Live Demo](https://eterna-dating.vercel.app) • [📱 PWA Features](#pwa-features) • [💡 Features](#features)

![Eterna App Preview](./public/app-preview.png)

</div>

## ✨ Overview

**Eterna** is a comprehensive dating application that combines modern web technologies with native app-like experiences. Built with **Next.js 15** and **TypeScript**, it offers seamless user authentication, intelligent matching algorithms, real-time messaging, and premium features wrapped in a beautiful, responsive Progressive Web App (PWA).

## 🎯 Key Highlights

- 🎨 **Beautiful UI/UX** - Modern design with smooth animations
- 📱 **Full PWA Support** - Installable on any device with offline capabilities
- 💬 **Real-time Chat** - Instant messaging with typing indicators
- 🎯 **Smart Matching** - AI-powered compatibility scoring
- 🔒 **Secure & Private** - End-to-end security with authentication
- ⚡ **High Performance** - Optimized for speed and scalability
- 📊 **Analytics Ready** - Built-in monitoring and insights

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[Radix UI](https://www.radix-ui.com/)** - Accessible UI components

### Backend & Database
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Serverless backend
- **[Prisma ORM](https://prisma.io/)** - Database toolkit
- **[SQLite](https://sqlite.org/)** - Local database (development)
- **[PostgreSQL](https://postgresql.org/)** - Production database
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication

### Real-time & Communication
- **[Socket.io](https://socket.io/)** - Real-time messaging
- **[Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)** - Push notifications
- **Service Workers** - Background processing & offline support

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[Commitlint](https://commitlint.js.org/)** - Commit message linting

## 🌟 Features

### 👤 User Authentication & Profiles
- **Email/Password Authentication** - Secure login system
- **Social Login** - Google OAuth integration
- **Profile Creation** - Comprehensive user profiles with photos
- **Photo Management** - Upload, reorder, and manage profile pictures
- **Location Services** - GPS-based location matching
- **Privacy Controls** - Granular privacy settings

### 🎯 Smart Matching System
- **Swipe Interface** - Tinder-like card swiping
- **Advanced Filters** - Age, location, interests, and preferences
- **AI Matching** - Compatibility scoring algorithm
- **Mutual Likes** - Match creation on mutual interest
- **Discovery Settings** - Customizable search preferences

### 💬 Real-time Communication
- **One-on-One Chat** - Private messaging system
- **Typing Indicators** - Real-time typing status
- **Read Receipts** - Message delivery confirmation
- **Message History** - Persistent chat history
- **Emoji Support** - Rich text messaging

### 🔔 Notifications & Activity
- **Push Notifications** - Real-time alerts (PWA)
- **In-App Notifications** - Activity feed
- **Match Alerts** - New match notifications
- **Message Notifications** - Chat activity alerts
- **Customizable Preferences** - Notification settings

### 💎 Premium Features
- **Premium Subscriptions** - Multiple pricing tiers
- **Advanced Matching** - Priority in matching algorithm
- **Boost Profiles** - Increased visibility
- **Super Likes** - Enhanced like system
- **Read Receipts** - Advanced message features

### 📱 PWA Features
- **Installable App** - Add to home screen on any device
- **Offline Support** - Core functionality works offline
- **Background Sync** - Sync data when back online
- **Push Notifications** - Native notification support
- **App-like Experience** - Full-screen, native feel

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+**
- **npm/yarn/pnpm**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/eterna.git
   cd eterna
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # Authentication
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"

   # OAuth (Optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Push Notifications (Optional)
   VAPID_PUBLIC_KEY="your-vapid-public-key"
   VAPID_PRIVATE_KEY="your-vapid-private-key"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push

   # (Optional) Seed database
   npx prisma db seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Start exploring Eterna!

## 📱 PWA Installation

### Android/Chrome
1. Open the app in Chrome
2. Tap the **"Install"** button in the address bar
3. Follow the installation prompts

### iOS/Safari
1. Open the app in Safari
2. Tap the **Share button** (📤)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"** to confirm

### Desktop
1. Open the app in Chrome/Edge
2. Click the **install icon** in the address bar
3. Follow the installation prompts

## 🏗️ Project Structure

```
eterna/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Main app pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # UI components (Radix/Shadcn)
│   ├── layout/           # Layout components
│   ├── chat/             # Chat components
│   ├── swipe/            # Swipe interface
│   ├── pwa/              # PWA components
│   └── ...
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication config
│   ├── prisma.ts         # Database client
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema
│   ├── schema.prisma     # Prisma schema
│   └── migrations/       # Database migrations
├── public/               # Static assets
│   ├── icons/            # App icons (SVG)
│   ├── manifest.json     # PWA manifest
│   └── sw.js            # Service worker
└── hooks/                # Custom React hooks
```

## 🗄️ Database Schema

The application uses **Prisma ORM** with a comprehensive database schema including:

- **Users** - User accounts and authentication
- **Profiles** - Detailed user profiles with photos
- **Matches** - User matching relationships
- **Messages** - Chat message history
- **Notifications** - Push notification data
- **Subscriptions** - Premium subscription management
- **Photos** - Profile photo management

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run preview      # Preview production build

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:migrate   # Create migration
npm run db:studio    # Open Prisma Studio

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect your repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel
   ```

2. **Environment Variables**
   Set your environment variables in Vercel dashboard

3. **Database**
   Use a cloud database like **PlanetScale** or **Railway**

### Other Platforms
- **Netlify** - Static deployment
- **Railway** - Full-stack deployment
- **Heroku** - Traditional hosting
- **AWS/DigitalOcean** - Custom infrastructure

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Next.js](https://nextjs.org/)** - The React framework for production
- **[Prisma](https://prisma.io/)** - Next-generation ORM
- **[Tailwind CSS](https://tailwindcss.com/)** - A utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Low-level UI primitives
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready motion library

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/eterna/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/eterna/discussions)
- **Email**: support@eterna-dating.com

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

<div align="center">

**Made with ❤️ by the Eterna Team**

[⭐ Star us on GitHub](https://github.com/your-username/eterna) • [🐛 Report a bug](https://github.com/your-username/eterna/issues) • [💡 Request a feature](https://github.com/your-username/eterna/discussions)

</div>
