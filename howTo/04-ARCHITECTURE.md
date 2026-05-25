# Project Architecture

## Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client Layer                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Next.js Frontend (apps/web)                      │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ React Components + Hooks                                │ │  │
│  │  │ - Dashboard, Board, Workspace, Login/Register          │ │  │
│  │  │ - Apollo hooks for GraphQL queries/mutations           │ │  │
│  │  │ - Tailwind CSS for styling                             │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ Apollo Client                                           │ │  │
│  │  │ - GraphQL HTTP link (localhost:4000/graphql)          │ │  │
│  │  │ - JWT token injection via auth link                   │ │  │
│  │  │ - In-memory cache                                     │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │  HTTP/HTTPS (GraphQL API)  │
                    └─────────────┬──────────────┘
                                  │
┌─────────────────────────────────────────────────────────────────────┐
│                      Application Layer                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │            NestJS Backend (apps/api)                         │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │ GraphQL API (Apollo Server)                          │   │  │
│  │  │ - Resolvers for Queries and Mutations               │   │  │
│  │  │ - Schema auto-generation                            │   │  │
│  │  │ - Playground at /graphql                            │   │  │
│  │  │ - CORS enabled for localhost:3000                   │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │ Modules                                              │   │  │
│  │  │ ├── Auth Module (JWT strategy, auth service)        │   │  │
│  │  │ ├── Users Module (User CRUD)                        │   │  │
│  │  │ ├── Workspaces Module (Workspace management)        │   │  │
│  │  │ ├── Boards Module (Board management)                │   │  │
│  │  │ ├── Tasks Module (Task management)                  │   │  │
│  │  │ └── Comments Module (Comment management)            │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │ NestJS Components                                    │   │  │
│  │  │ - Controllers & Resolvers                           │   │  │
│  │  │ - Services (business logic)                         │   │  │
│  │  │ - Guards & Decorators (auth)                        │   │  │
│  │  │ - DTOs (data validation)                            │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │  PostgreSQL Connection    │
                    └─────────────┬──────────────┘
                                  │
┌─────────────────────────────────────────────────────────────────────┐
│                       Data Layer                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         PostgreSQL Database                                   │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │ MikroORM                                             │   │  │
│  │  │ - Entity mapping (TypeScript → Database)            │   │  │
│  │  │ - Query builder & migrations                        │   │  │
│  │  │ - Connection pooling                                │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │ Tables                                               │   │  │
│  │  │ ├── users (user accounts)                           │   │  │
│  │  │ ├── workspaces (collaboration spaces)              │   │  │
│  │  │ ├── boards (task collections)                      │   │  │
│  │  │ ├── tasks (work items)                             │   │  │
│  │  │ └── comments (task comments)                       │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 16.2.6 (React 19)
- **State Management**: Apollo Client 4.2.0
- **Styling**: Tailwind CSS 4.3.0
- **Language**: TypeScript
- **Additional**: 
  - js-cookie (for token storage)
  - @hello-pangea/dnd (drag and drop)
  - @radix-ui (UI components)

### Backend
- **Framework**: NestJS 11.0.1
- **API**: GraphQL (Apollo)
- **ORM**: MikroORM 6.6.14
- **Database**: PostgreSQL 16
- **Authentication**: JWT
- **Language**: TypeScript

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Environment**: Node.js v24.15.0

## Data Flow

### 1. User Authentication Flow

```
1. User enters credentials
   ↓
2. Frontend sends mutation via Apollo Client
   ↓
3. NestJS AuthResolver processes login
   ↓
4. AuthService validates credentials
   ↓
5. JWT token generated
   ↓
6. Token returned to frontend
   ↓
7. Token stored in cookies (js-cookie)
   ↓
8. User redirected to dashboard
```

### 2. GraphQL Query Flow

```
1. User navigates to dashboard
   ↓
2. useWorkspaces hook triggers query
   ↓
3. Apollo Client adds JWT token to headers
   ↓
4. Query sent to http://localhost:4000/graphql
   ↓
5. NestJS receives request
   ↓
6. JwtStrategy validates token
   ↓
7. Resolver executes business logic
   ↓
8. MikroORM queries database
   ↓
9. Data returned to frontend
   ↓
10. Apollo cache updated
   ↓
11. Component re-renders with data
```

### 3. Mutation Flow (Create Task)

```
1. User clicks create task
   ↓
2. Form submitted with task data
   ↓
3. useTasks mutation hook triggered
   ↓
4. Apollo Client sends mutation with JWT
   ↓
5. NestJS TaskResolver receives mutation
   ↓
6. TaskService validates input
   ↓
7. MikroORM persists to database
   ↓
8. New task returned to frontend
   ↓
9. Apollo cache updated
   ↓
10. UI updates optimistically
```

## Module Responsibilities

### Frontend Modules

#### `app/` - Pages & Routes
- Each folder represents a route
- Dynamic routes use `[param]` syntax
- Server components for layout, client components for interactivity

#### `app/components/` - Reusable Components
- Navbar, TaskCard, WorkspaceCard, etc.
- Tailwind CSS styling
- Props-based configuration

#### `app/hooks/` - Custom Hooks
- GraphQL queries & mutations
- State management
- API integration

#### `lib/apolloClient.ts` - API Client
- Apollo Client configuration
- Authentication link (JWT injection)
- HTTP link (GraphQL endpoint)
- In-memory cache

### Backend Modules

#### `auth/` - Authentication
- **AuthService**: Login/register logic, JWT generation
- **AuthResolver**: GraphQL mutations (login, register)
- **JwtStrategy**: Token validation
- **Decorators**: @CurrentUser, @UseGuards

#### `users/` - User Management
- **UserEntity**: Database schema
- **UserService**: User operations
- **UserResolver**: GraphQL queries for user data

#### `workspaces/` - Collaboration Spaces
- **WorkspaceEntity**: Database schema
- **WorkspaceService**: CRUD operations
- **WorkspaceResolver**: GraphQL queries/mutations
- Handles workspace membership

#### `boards/` - Task Collections
- **BoardEntity**: Database schema
- **BoardService**: Board operations
- **BoardResolver**: GraphQL queries/mutations
- Associated with workspaces

#### `tasks/` - Work Items
- **TaskEntity**: Database schema
- **TaskService**: Task operations
- **TaskResolver**: GraphQL queries/mutations
- Status management (todo, in-progress, done)

#### `comments/` - Task Comments
- **CommentEntity**: Database schema
- **CommentService**: Comment operations
- **CommentResolver**: GraphQL queries/mutations
- Associated with tasks

## Entity Relationships

```
User
├── owns multiple Workspaces
├── creates multiple Tasks
└── creates multiple Comments

Workspace
├── has multiple Boards
└── has multiple Users (members)

Board
├── has multiple Tasks
└── belongs to one Workspace

Task
├── has multiple Comments
├── belongs to one Board
├── assigned to one User
└── created by one User

Comment
├── belongs to one Task
└── created by one User
```

## API Endpoints

### GraphQL Endpoint
- **URL**: `http://localhost:4000/graphql`
- **Method**: POST (queries/mutations), GET (schema)
- **Playground**: Interactive at `http://localhost:4000/graphql`
- **Content-Type**: application/json
- **Authentication**: ****** in Authorization header

### REST Endpoints
- None currently (GraphQL is the primary API)

## Authentication & Authorization

### JWT Flow
1. User logs in with credentials
2. Backend generates JWT token (expires in 1 day)
3. Frontend stores token in cookies
4. Token automatically included in GraphQL requests
5. Backend validates token with JwtStrategy
6. User context available in resolvers

### Protected Resolvers
```typescript
@UseGuards(JwtAuthGuard)
@Query(() => [Workspace])
myWorkspaces(@CurrentUser() user: User) {
  return this.workspaceService.findByUser(user);
}
```

## Database Schema

### users
- `id` (PK)
- `email` (unique)
- `password` (hashed)
- `createdAt`
- `updatedAt`

### workspaces
- `id` (PK)
- `name`
- `description`
- `createdAt`
- `updatedAt`

### boards
- `id` (PK)
- `name`
- `description`
- `workspaceId` (FK)
- `createdAt`
- `updatedAt`

### tasks
- `id` (PK)
- `title`
- `description`
- `status` (todo, in-progress, done)
- `boardId` (FK)
- `assignedTo` (FK to user)
- `createdBy` (FK to user)
- `createdAt`
- `updatedAt`

### comments
- `id` (PK)
- `text`
- `taskId` (FK)
- `userId` (FK)
- `createdAt`
- `updatedAt`

## Error Handling

### Frontend
- Apollo Client error handling
- Try-catch blocks in components
- User-friendly error messages
- Network error detection

### Backend
- Custom exception filters
- GraphQL error formatting
- Input validation with DTOs
- Database constraint errors

## Performance Considerations

### Frontend
- Code splitting per route
- Image optimization with Next.js
- Apollo caching strategy
- Lazy loading of components

### Backend
- Query pagination for large datasets
- Database indexing on foreign keys
- Connection pooling with MikroORM
- GraphQL query complexity analysis

## Deployment Architecture

### Production Setup
```
Load Balancer
    ↓
┌─────────────────┐
│ Next.js Frontend│ (Vercel or Docker)
└────────┬────────┘
         ↓ (GraphQL)
┌─────────────────┐
│ NestJS Backend  │ (Docker/Cloud)
└────────┬────────┘
         ↓
┌─────────────────┐
│ PostgreSQL DB   │ (Managed service)
└─────────────────┘
```

### Environment Configurations
- **Development**: Docker Compose (local)
- **Staging**: Docker containers (test environment)
- **Production**: Managed services + containers

## Security Measures

1. **Authentication**: JWT tokens with expiration
2. **Authorization**: Guards on protected resolvers
3. **CORS**: Limited to specific origins
4. **Input Validation**: DTOs with decorators
5. **Database**: Environment variables for credentials
6. **Secrets**: JWT_SECRET in environment variables

## Scaling Considerations

### Horizontal Scaling
- Stateless services (no session affinity needed)
- Redis for distributed caching
- Database read replicas

### Vertical Scaling
- Connection pooling optimization
- Query optimization
- Caching layers

### Future Enhancements
- Real-time updates with WebSockets
- Image uploads with cloud storage
- Full-text search
- Advanced analytics

## Next Steps for Development

1. Review [Setup Guide](./01-SETUP.md)
2. Read [Backend Documentation](./02-BACKEND.md)
3. Read [Frontend Documentation](./03-FRONTEND.md)
4. Start the project with `docker-compose up -d`
5. Explore GraphQL at `http://localhost:4000/graphql`
