# Frontend - Next.js + React + Apollo Client

## 📋 Overview

The frontend application built with **Next.js 16**, a React framework for production applications. It provides a modern, responsive user interface for the Task Manager application with GraphQL integration via Apollo Client.

### 🎯 Key Features

- **Next.js 13+ App Router**: File-based routing with layouts
- **React 19**: Latest React features and hooks
- **Apollo Client**: GraphQL queries and mutations
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-friendly interface
- **Authentication**: JWT-based user authentication
- **Drag & Drop**: Intuitive task management

## 🚀 Getting Started

### Prerequisites

- Node.js v24.15.0+
- npm v11.12.1+
- Backend API running at `http://localhost:4000` (optional for build)

### Installation

```bash
cd apps/web
npm install
```

### Start Development Server

```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

## 🛠️ Available Scripts

```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint
```

## 🔗 Quick Links

- **[Frontend Documentation](../../howTo/03-FRONTEND.md)** - Detailed frontend guide
- **[Backend Documentation](../../howTo/02-BACKEND.md)** - Backend API details
- **[Setup Guide](../../howTo/01-SETUP.md)** - Complete setup instructions
- **[Architecture Guide](../../howTo/04-ARCHITECTURE.md)** - System design

## 📁 Project Structure

```
apps/web/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout with Apollo Provider
│   ├── login/page.tsx     # Login page
│   ├── register/page.tsx  # Registration page
│   ├── dashboard/page.tsx # Dashboard
│   ├── board/[id]/page.tsx # Board detail
│   ├── components/        # Reusable components
│   └── hooks/            # Custom GraphQL hooks
├── lib/
│   └── apolloClient.ts   # Apollo Client setup
├── public/               # Static assets
└── package.json         # Dependencies
```

## ⚙️ Configuration

### Environment Variables

```bash
# GraphQL API endpoint
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

## 🎨 Technology Stack

- **Next.js 16.2.6** - React framework
- **React 19** - UI library
- **Apollo Client 4.2.0** - GraphQL client
- **Tailwind CSS 4.3.0** - Styling
- **TypeScript** - Type safety

## 📚 Documentation

See the comprehensive guides in the `howTo` directory:
- [01-SETUP.md](../../howTo/01-SETUP.md) - Complete setup instructions
- [03-FRONTEND.md](../../howTo/03-FRONTEND.md) - Frontend details
- [04-ARCHITECTURE.md](../../howTo/04-ARCHITECTURE.md) - System architecture

## 🚀 Running the Application

### Using Docker Compose (Recommended)

```bash
cd ../..
docker-compose up -d
```

### Local Development

```bash
npm install
npm run dev
```

Access at `http://localhost:3000`

## 🔗 API Connection

The frontend connects to the GraphQL API at:
- **Development**: `http://localhost:4000/graphql`
- **Production**: Update `NEXT_PUBLIC_GRAPHQL_URL` in environment

## 🧪 Testing & Quality

```bash
# Linting
npm run lint

# Build check
npm run build
```

## 📖 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

For more information, see the [howTo documentation](../../howTo/)
