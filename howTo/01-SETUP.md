# Project Setup Guide

## Overview

This is a full-stack application built with:
- **Backend**: NestJS with GraphQL and MikroORM
- **Frontend**: Next.js with Apollo Client
- **Database**: PostgreSQL
- **Architecture**: Monorepo with Docker support

## Prerequisites

Before setting up the project, ensure you have:
- **Node.js**: v24.15.0 or later
- **npm**: v11.12.1 or later
- **Docker**: (Optional, for database and containerized setup)
- **PostgreSQL**: (If not using Docker)
- **Git**: For version control

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Nextjs-Nestjs-MicroOrm-GraphQL-Postgress
```

### 2. Install Dependencies

#### Backend (API)
```bash
cd apps/api
npm install --legacy-peer-deps
cd ../..
```

#### Frontend (Web)
```bash
cd apps/web
npm install
cd ../..
```

**Note**: The `--legacy-peer-deps` flag is required for the API due to peer dependency conflicts between NestJS packages.

### 3. Environment Configuration

Create `.env` file in the root directory with the following variables:

```bash
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=app_db

# API Configuration
PORT=4000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-this-in-production

# Frontend Configuration
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

Copy the template files for reference:
- Backend: See `.env.example` in `/apps/api`
- Frontend: See `.env.example` in `/apps/web`

## Running the Project

### Option 1: Docker Compose (Recommended for Development)

The easiest way to run the entire application with all services:

```bash
docker-compose up -d
```

This will:
- Start PostgreSQL database on port 5432
- Start the API server on port 4000
- Start the Next.js frontend on port 3000

**Stop services:**
```bash
docker-compose down
```

**View logs:**
```bash
docker-compose logs -f [service_name]  # api, web, or db
```

### Option 2: Local Development (Manual Setup)

#### Start PostgreSQL

Using Docker:
```bash
docker run --name postgres-app \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=app_db \
  -p 5432:5432 \
  -d postgres:16
```

Or use your local PostgreSQL installation.

#### Start API Server

```bash
cd apps/api
npm run start:dev
```

The API will be available at: `http://localhost:4000`
GraphQL Playground: `http://localhost:4000/graphql`

#### Start Frontend

In a new terminal:

```bash
cd apps/web
npm run dev
```

The frontend will be available at: `http://localhost:3000`

## Database Setup

### Migrations with MikroORM

The database is automatically initialized when the API starts. Entity files are defined in `apps/api/src/**/*.entity.ts`.

To generate migrations:
```bash
cd apps/api
npm run mikro-orm -- migration:create --name <migration_name>
```

To run pending migrations:
```bash
cd apps/api
npm run mikro-orm -- migration:up
```

## Building the Project

### Build Backend
```bash
cd apps/api
npm run build
```

### Build Frontend
```bash
cd apps/web
npm run build
```

## Linting and Testing

### API
```bash
cd apps/api

# Lint
npm run lint

# Run tests
npm test

# Run with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

### Frontend
```bash
cd apps/web

# Lint
npm run lint

# Build check
npm run build
```

## Troubleshooting

### Dependency Installation Issues

If you encounter peer dependency errors:

```bash
npm install --legacy-peer-deps
```

### Database Connection Issues

1. Verify PostgreSQL is running:
   ```bash
   psql -U postgres -h localhost -d app_db
   ```

2. Check environment variables match your setup

3. Ensure database container has started:
   ```bash
   docker ps | grep postgres
   ```

### GraphQL Playground Not Loading

1. Verify API is running: `http://localhost:4000`
2. Check GraphQL endpoint: `http://localhost:4000/graphql`
3. Verify CORS settings in `apps/api/main.ts`

### Frontend Apollo Client Errors

1. Ensure API is accessible from frontend
2. Check `NEXT_PUBLIC_GRAPHQL_URL` environment variable
3. Verify token is properly set in cookies

## Development Tips

- **Hot Reload**: Both API and frontend support hot reload in development mode
- **GraphQL Schema**: Generated at `apps/api/src/schema.gql`
- **TypeScript**: Full TypeScript support for type safety
- **Apollo DevTools**: Install Chrome extension for GraphQL debugging

## Next Steps

- Read [Backend Documentation](./02-BACKEND.md)
- Read [Frontend Documentation](./03-FRONTEND.md)
- Read [Architecture Guide](./04-ARCHITECTURE.md)
