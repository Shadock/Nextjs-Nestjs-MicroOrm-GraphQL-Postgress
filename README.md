# Task Manager - Full Stack Application

## 📋 Project Overview

A modern full-stack collaborative task management application built with cutting-edge technologies. The application allows users to create workspaces, organize tasks on boards, and collaborate through comments.

### ✨ Key Features

- **User Authentication**: Secure JWT-based authentication
- **Workspace Management**: Create and manage multiple workspaces
- **Task Boards**: Organize tasks on visual boards
- **Task Management**: Create, update, and track tasks with status
- **Comments**: Collaborate on tasks through comments
- **Drag & Drop**: Intuitive interface with drag-and-drop functionality
- **Real-time Updates**: Apollo Client for optimistic updates
- **Type Safety**: Full TypeScript support

## 🏗️ Architecture

**Frontend**: Next.js 16 + React 19 + Apollo Client  
**Backend**: NestJS + GraphQL + MikroORM  
**Database**: PostgreSQL 16  
**Containerization**: Docker & Docker Compose  

For detailed architecture information, see [Architecture Guide](./howTo/04-ARCHITECTURE.md)

## 🚀 Quick Start

### Prerequisites

- Node.js v24.15.0 or later
- npm v11.12.1 or later
- Docker & Docker Compose (optional but recommended)

### Setup with Docker (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd Nextjs-Nestjs-MicroOrm-GraphQL-Postgress

# Copy environment template
cp .env.example .env

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# GraphQL: http://localhost:4000/graphql
```

### Manual Setup

```bash
# Install Backend Dependencies
cd apps/api
npm install --legacy-peer-deps
npm run start:dev

# In another terminal, Install Frontend Dependencies
cd apps/web
npm install
npm run dev
```

See [Complete Setup Guide](./howTo/01-SETUP.md) for detailed instructions.

## 📚 Documentation

- **[Setup Guide](./howTo/01-SETUP.md)** - How to install and run the project
- **[Backend Documentation](./howTo/02-BACKEND.md)** - NestJS API details
- **[Frontend Documentation](./howTo/03-FRONTEND.md)** - Next.js frontend guide
- **[Architecture Guide](./howTo/04-ARCHITECTURE.md)** - System design and data flow

## 📦 Tech Stack

### Frontend
- **Framework**: Next.js 16.2.6
- **UI Framework**: React 19
- **GraphQL Client**: Apollo Client 4.2.0
- **Styling**: Tailwind CSS 4.3.0
- **Language**: TypeScript
- **UI Components**: @radix-ui, @hello-pangea/dnd

### Backend
- **Framework**: NestJS 11.0.1
- **API**: GraphQL + Apollo Server
- **ORM**: MikroORM 6.6.14
- **Database**: PostgreSQL 16
- **Authentication**: JWT (jsonwebtoken)
- **Language**: TypeScript

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Environment**: Node.js v24.15.0, npm v11.12.1

## 🎯 Project Structure

```
.
├── apps/
│   ├── api/              # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/     # Authentication module
│   │   │   ├── users/    # User management
│   │   │   ├── workspaces/
│   │   │   ├── boards/
│   │   │   ├── tasks/
│   │   │   └── comments/
│   │   └── main.ts       # Application entry
│   └── web/              # Next.js Frontend
│       ├── app/          # Pages & routes
│       ├── lib/          # Utilities (Apollo client)
│       ├── public/       # Static assets
│       └── ...
├── howTo/                # Comprehensive documentation
├── docker-compose.yml
├── .env.example
└── package.json
```

## 🔧 Development

### Running Services

```bash
# All services (Docker Compose)
docker-compose up -d

# Frontend only
cd apps/web && npm run dev

# Backend only
cd apps/api && npm run start:dev
```

### Building

```bash
# Frontend
cd apps/web && npm run build

# Backend
cd apps/api && npm run build
```

### Testing

```bash
# Backend tests
cd apps/api
npm test
npm run test:e2e
npm run test:cov

# Frontend linting
cd apps/web
npm run lint
```

## 🐛 Troubleshooting

### Dependency Issues

```bash
npm install --legacy-peer-deps
```

### Port Already in Use

```bash
# Kill process on port 4000 (API)
lsof -i :4000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 3000 (Frontend)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Database Connection

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Connect manually
psql -U postgres -h localhost -d app_db
```

For more troubleshooting, see [Setup Guide](./howTo/01-SETUP.md)

## 📖 API Documentation

### GraphQL Endpoint

**URL**: `http://localhost:4000/graphql`

### Available Operations

See [Backend Documentation](./howTo/02-BACKEND.md) for detailed GraphQL operations.

### Example Query

```graphql
query GetWorkspaces {
  workspaces {
    id
    name
    description
    boards {
      id
      name
      tasks {
        id
        title
        status
      }
    }
  }
}
```

## 🔒 Security

- JWT-based authentication with expiration
- Password hashing with bcrypt
- CORS protection
- Environment variables for sensitive data
- Input validation with DTOs
- Protected GraphQL resolvers

## 📝 Environment Variables

### Root `.env`

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=app_db
PORT=4000
NODE_ENV=development
JWT_SECRET=your-secret-key
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

See `.env.example` for all available variables.

## 🚀 Deployment

### Docker Build

```bash
docker-compose build
docker-compose up -d
```

### Production Environment

Update environment variables in `.env` for production:
- Change JWT_SECRET to a strong value
- Update database credentials
- Set NODE_ENV=production
- Configure CORS_ORIGIN

## 📞 Support

For issues or questions:

1. Check [Troubleshooting Guide](./howTo/01-SETUP.md#troubleshooting)
2. Review [Backend Documentation](./howTo/02-BACKEND.md)
3. Review [Frontend Documentation](./howTo/03-FRONTEND.md)
4. Check existing GitHub issues

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is licensed under the UNLICENSED license.
