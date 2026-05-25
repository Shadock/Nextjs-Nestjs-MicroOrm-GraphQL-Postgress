# Backend API Documentation

## Overview

The backend is built with **NestJS**, a progressive Node.js framework for building efficient and scalable server-side applications. It uses:

- **GraphQL** for API queries and mutations
- **MikroORM** for database ORM and migrations
- **JWT** for authentication
- **PostgreSQL** for data persistence

## Project Structure

```
apps/api/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module
├── app.service.ts             # Main service
├── app.controller.ts           # Main controller
├── src/
│   ├── auth/                  # Authentication module
│   ├── users/                 # User management
│   ├── workspaces/            # Workspace management
│   ├── boards/                # Board management
│   ├── tasks/                 # Task management
│   ├── comments/              # Comment management
│   └── schema.gql             # Generated GraphQL schema
├── test/                      # E2E tests
├── package.json               # Dependencies
├── mikro-orm.config.ts        # Database configuration
├── nest-cli.json              # NestJS CLI config
└── tsconfig.json              # TypeScript configuration
```

## Module Structure

Each domain module follows NestJS best practices:

```
domain/
├── domain.module.ts           # Module definition
├── domain.service.ts          # Business logic
├── domain.resolver.ts         # GraphQL resolver
├── domain.entity.ts           # Database entity
└── dto/                       # Data transfer objects
    ├── create-domain.dto.ts
    └── update-domain.dto.ts
```

## Core Modules

### 1. Auth Module
Handles user authentication and JWT token management.

**Files**:
- `auth.module.ts` - Module definition
- `auth.service.ts` - Authentication logic
- `auth.resolver.ts` - GraphQL operations
- `jwt.strategy.ts` - JWT validation strategy

**Key Features**:
- User registration
- User login with JWT
- Token refresh
- JWT protection via guards

### 2. Users Module
Manages user profiles and information.

**Key Operations**:
- Get user profile
- Update user information
- User deletion

### 3. Workspaces Module
Manages collaborative workspaces where users can organize their work.

**Key Operations**:
- Create workspace
- List workspaces
- Update workspace
- Delete workspace
- Add/remove members

### 4. Boards Module
Boards are collections of tasks within a workspace.

**Key Operations**:
- Create board
- List boards in workspace
- Update board
- Delete board

### 5. Tasks Module
Individual work items within boards.

**Key Operations**:
- Create task
- List tasks in board
- Update task status
- Update task details
- Delete task
- Assign tasks to users

### 6. Comments Module
Comments on tasks for collaboration.

**Key Operations**:
- Create comment on task
- List task comments
- Update comment
- Delete comment

## Database Configuration

### MikroORM Setup

Configuration is in `mikro-orm.config.ts`:

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

**Environment Override**:
- Database host: `POSTGRES_HOST` (default: `db`)
- Database port: `POSTGRES_PORT` (default: `5432`)
- Database name: `POSTGRES_DB` (default: `app_db`)
- Database user: `POSTGRES_USER` (default: `postgres`)
- Database password: `POSTGRES_PASSWORD` (default: `postgres`)

### Creating an Entity

```typescript
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class User {
  @PrimaryKey()
  id: number;

  @Property()
  email: string;

  @Property()
  password: string;

  @Property()
  createdAt: Date = new Date();
}
```

### Migrations

Create a migration:
```bash
npm run mikro-orm -- migration:create --name AddFieldToUser
```

Run migrations:
```bash
npm run mikro-orm -- migration:up
```

Revert migration:
```bash
npm run mikro-orm -- migration:down
```

## GraphQL Schema

### Generated Schema

The GraphQL schema is automatically generated from resolvers and saved to `src/schema.gql`.

### Accessing GraphQL Playground

When running the API in development:
1. Navigate to `http://localhost:4000/graphql`
2. Use the Playground to:
   - Write queries and mutations
   - Explore the schema
   - Test operations
   - Debug with variables

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
    }
  }
}
```

### Example Mutation

```graphql
mutation CreateBoard($name: String!, $workspaceId: Int!) {
  createBoard(input: { name: $name, workspaceId: $workspaceId }) {
    id
    name
    workspace {
      id
      name
    }
  }
}
```

## Authentication

### JWT Strategy

JWT tokens are validated using the `JwtStrategy`:

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

### Protecting Resolvers

Use the `@UseGuards(JwtAuthGuard)` decorator:

```typescript
@UseGuards(JwtAuthGuard)
@Query(() => User)
getProfile(@CurrentUser() user: User) {
  return user;
}
```

## Running the API

### Development Mode (with hot reload)

```bash
cd apps/api
npm run start:dev
```

### Debug Mode

```bash
cd apps/api
npm run start:debug
```

Attach your debugger to port 9229.

### Production Mode

```bash
cd apps/api
npm run build
npm run start:prod
```

## Building

```bash
cd apps/api
npm run build
```

Output is generated in the `dist/` directory.

## Testing

### Unit Tests

```bash
cd apps/api
npm test
```

### Watch Mode

```bash
cd apps/api
npm run test:watch
```

### Coverage

```bash
cd apps/api
npm run test:cov
```

### E2E Tests

```bash
cd apps/api
npm run test:e2e
```

## Linting

```bash
cd apps/api
npm run lint
```

Auto-fix issues:
```bash
npm run lint -- --fix
```

## Code Formatting

```bash
cd apps/api
npm run format
```

Uses Prettier for code formatting.

## Environment Variables

Required environment variables in `.env`:

```
# Port
PORT=4000

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=app_db
POSTGRES_HOST=db

# JWT
JWT_SECRET=your-secret-key-here

# Node
NODE_ENV=development
```

## Common Issues

### Port Already in Use

If port 4000 is already in use:

```bash
npm run start:dev -- --port 5000
```

Or kill the existing process:
```bash
lsof -i :4000
kill -9 <PID>
```

### Database Connection Error

Check if PostgreSQL is running:
```bash
docker ps | grep postgres
```

Or connect with psql:
```bash
psql -U postgres -h localhost -d app_db
```

### TypeScript Compilation Error

Clear build and reinstall:
```bash
rm -rf dist node_modules
npm install --legacy-peer-deps
npm run build
```

## Performance Optimization

- Use DataLoader for batch loading to avoid N+1 queries
- Implement query pagination for large datasets
- Add database indexes on frequently queried fields
- Use connection pooling for database connections

## Security Best Practices

1. **Secret Management**:
   - Use strong JWT_SECRET in production
   - Never commit `.env` files
   - Use environment-specific configurations

2. **Input Validation**:
   - Use DTOs with class-validator
   - Validate all GraphQL inputs
   - Sanitize data before saving

3. **CORS**:
   - Restrict allowed origins
   - Currently allows `http://localhost:3000` in development

4. **Rate Limiting**:
   - Implement rate limiting for GraphQL queries
   - Add throttling for mutations

## Next Steps

- Read [Frontend Documentation](./03-FRONTEND.md)
- Read [Architecture Guide](./04-ARCHITECTURE.md)
- Explore GraphQL at `http://localhost:4000/graphql`
