# Backend API - NestJS + GraphQL

## 📋 Overview

The backend service built with **NestJS**, a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. This API provides GraphQL endpoints for the Task Manager application.

### 🎯 Key Responsibilities

- GraphQL API for frontend queries and mutations
- User authentication with JWT
- Data persistence with PostgreSQL via MikroORM
- Business logic for workspaces, boards, tasks, and comments
- User authorization and access control

## 🚀 Getting Started

### Prerequisites

- Node.js v24.15.0+
- npm v11.12.1+
- PostgreSQL (or Docker)

### Installation

```bash
cd apps/api
npm install --legacy-peer-deps
```

### Start Development Server

```bash
npm run start:dev
```

The API will be available at: `http://localhost:4000`  
GraphQL Playground: `http://localhost:4000/graphql`

## 🛠️ Available Scripts

```bash
# Development (with hot reload)
npm run start:dev

# Debug mode
npm run start:debug

# Production
npm run build
npm run start:prod

# Testing
npm test                    # Unit tests
npm run test:watch         # Watch mode
npm run test:cov           # Coverage report
npm run test:e2e           # End-to-end tests

# Linting & Formatting
npm run lint               # Run ESLint
npm run lint -- --fix      # Auto-fix issues
npm run format             # Format with Prettier

# Database Migrations
npm run mikro-orm -- migration:create --name <name>
npm run mikro-orm -- migration:up
npm run mikro-orm -- migration:down
```

## 📁 Project Structure

```
apps/api/
├── main.ts                      # Application entry point
├── app.module.ts               # Root module
├── app.service.ts              # Main service
├── app.controller.ts           # Main controller
├── src/
│   ├── auth/                   # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.resolver.ts
│   │   ├── jwt.strategy.ts
│   │   └── dto/
│   ├── users/                  # User management module
│   ├── workspaces/             # Workspace module
│   ├── boards/                 # Board module
│   ├── tasks/                  # Task module
│   ├── comments/               # Comment module
│   └── schema.gql              # Generated GraphQL schema
├── test/                       # E2E tests
├── mikro-orm.config.ts        # Database configuration
├── nest-cli.json              # NestJS CLI config
├── tsconfig.json              # TypeScript config
├── tsconfig.build.json        # Build TypeScript config
└── package.json               # Dependencies
```

## ⚙️ Configuration

### Environment Variables

Create `.env` file in the API directory:

```bash
# Server
PORT=4000
NODE_ENV=development

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=app_db
POSTGRES_HOST=db
POSTGRES_PORT=5432

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=1d

# CORS
CORS_ORIGIN=http://localhost:3000
```

See `.env.example` for reference.

### MikroORM Configuration

Database configuration is in `mikro-orm.config.ts`:

```typescript
const config: Options<PostgreSqlDriver> = {
  driver: PostgreSqlDriver,
  dbName: 'app_db',
  user: 'postgres',
  password: 'postgres',
  host: 'db',
  port: 5432,
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
};
```

## 🔗 API Endpoints

### GraphQL Endpoint

**Base URL**: `http://localhost:4000`

**GraphQL**: `POST /graphql`

**Playground**: `GET /graphql` (development only)

### Example Queries

```graphql
# Get all workspaces
query {
  workspaces {
    id
    name
    description
  }
}

# Get workspace with boards
query {
  workspace(id: 1) {
    id
    name
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

### Example Mutations

```graphql
# Login
mutation {
  login(email: "user@example.com", password: "password") {
    token
    user {
      id
      email
    }
  }
}

# Create workspace
mutation {
  createWorkspace(input: {
    name: "My Workspace"
    description: "Workspace description"
  }) {
    id
    name
  }
}

# Create task
mutation {
  createTask(input: {
    title: "Task title"
    description: "Task description"
    boardId: 1
    status: "todo"
  }) {
    id
    title
    status
  }
}
```

## 🏗️ Modules

### Auth Module

Handles authentication and authorization.

**Key Features**:
- User registration
- User login with JWT token
- Token validation via JwtStrategy
- Protected resolvers with `@UseGuards(JwtAuthGuard)`

**Resolvers**:
- `login(email, password)` → JWT token
- `register(email, password)` → User + JWT token

### Users Module

Manages user data and profiles.

**Resolvers**:
- `getUser(id)` → User details
- `getCurrentUser()` → Current authenticated user
- `updateUser(input)` → Updated user

### Workspaces Module

Manages workspaces and collaboration spaces.

**Resolvers**:
- `workspaces()` → List of user's workspaces
- `workspace(id)` → Workspace details
- `createWorkspace(input)` → New workspace
- `updateWorkspace(id, input)` → Updated workspace
- `deleteWorkspace(id)` → Deletion confirmation

### Boards Module

Manages task boards within workspaces.

**Resolvers**:
- `boards(workspaceId)` → List of workspace boards
- `board(id)` → Board details with tasks
- `createBoard(input)` → New board
- `updateBoard(id, input)` → Updated board
- `deleteBoard(id)` → Deletion confirmation

### Tasks Module

Manages individual tasks on boards.

**Resolvers**:
- `tasks(boardId)` → List of board tasks
- `task(id)` → Task details with comments
- `createTask(input)` → New task
- `updateTask(id, input)` → Updated task
- `deleteTask(id)` → Deletion confirmation
- `updateTaskStatus(id, status)` → Status change

### Comments Module

Manages comments on tasks.

**Resolvers**:
- `comments(taskId)` → List of task comments
- `createComment(input)` → New comment
- `deleteComment(id)` → Comment deletion

## 🔐 Authentication

### JWT Strategy

Tokens are validated using the JWT strategy:

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

### Protecting Routes

Use the `@UseGuards(JwtAuthGuard)` decorator on resolvers:

```typescript
@UseGuards(JwtAuthGuard)
@Query(() => [Workspace])
getWorkspaces(@CurrentUser() user: User) {
  return this.workspaceService.findByUser(user);
}
```

## 💾 Database

### Entities

The application uses MikroORM with the following entities:

- **User**: User accounts with email and password
- **Workspace**: Collaboration spaces
- **Board**: Task collections within workspaces
- **Task**: Individual work items
- **Comment**: Comments on tasks

### Migrations

Create a migration:
```bash
npm run mikro-orm -- migration:create --name AddFieldToUser
```

Run migrations:
```bash
npm run mikro-orm -- migration:up
```

Revert a migration:
```bash
npm run mikro-orm -- migration:down
```

## 🧪 Testing

### Unit Tests

```bash
npm test
```

Test files: `*.spec.ts` in each module directory.

### E2E Tests

```bash
npm run test:e2e
```

Test files in `test/` directory.

### Test Coverage

```bash
npm run test:cov
```

Generates coverage report in `coverage/` directory.

## ✨ Code Quality

### Linting

```bash
npm run lint
npm run lint -- --fix  # Auto-fix issues
```

### Formatting

```bash
npm run format
```

Uses Prettier for consistent code style.

## 🚀 Building

### Development Build

```bash
npm run build
```

Output in `dist/` directory.

### Production Build

```bash
npm run build
npm run start:prod
```

## 📊 Database Debugging

### Connect to Database

```bash
psql -U postgres -h localhost -d app_db
```

### List Tables

```sql
\dt
```

### View Table Schema

```sql
\d table_name
```

## ⚠️ Common Issues

### Port Already in Use

```bash
# Find process on port 4000
lsof -i :4000

# Kill it
kill -9 <PID>
```

### Database Connection Error

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Or connect manually
psql -U postgres -h localhost
```

### TypeScript Compilation Error

```bash
# Clear and rebuild
rm -rf dist node_modules
npm install --legacy-peer-deps
npm run build
```

### Dependencies Won't Install

Use `--legacy-peer-deps` flag:
```bash
npm install --legacy-peer-deps
```

## 🔒 Security Considerations

1. **JWT Secret**: Use a strong random string in production
2. **Passwords**: Always hash with bcrypt before storing
3. **Input Validation**: Use DTOs with class-validator
4. **CORS**: Configure for specific origins only
5. **Environment Variables**: Never commit `.env` files
6. **Database Credentials**: Use environment variables
7. **Error Messages**: Don't leak sensitive information

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [GraphQL Documentation](https://graphql.org/learn/)
- [MikroORM Documentation](https://mikro-orm.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io) - JWT token inspection

## 🤝 Contributing

1. Follow TypeScript and NestJS best practices
2. Write tests for new features
3. Update documentation
4. Run linting and formatting before commit

## 📝 Notes

- GraphQL schema is auto-generated from resolvers
- Playground available only in development
- CORS currently configured for localhost:3000
- JWT tokens expire after 1 day

---

For more detailed information, see the [Backend Documentation](../../howTo/02-BACKEND.md) and [Architecture Guide](../../howTo/04-ARCHITECTURE.md).
