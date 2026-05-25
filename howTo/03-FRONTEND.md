# Frontend Documentation

## Overview

The frontend is built with **Next.js**, a React framework for production applications. It uses:

- **React 19** for UI components
- **Apollo Client** for GraphQL data management
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Next.js App Router** for routing

## Project Structure

```
apps/web/
├── app/                       # App Router (Next.js 13+)
│   ├── layout.tsx             # Root layout with providers
│   ├── page.tsx               # Home page
│   ├── globals.css            # Global styles
│   ├── login/                 # Login page
│   ├── register/              # Registration page
│   ├── dashboard/             # Dashboard page
│   ├── board/                 # Board detail page
│   ├── workspace/             # Workspace pages
│   ├── admin/                 # Admin pages
│   ├── components/            # Reusable components
│   └── hooks/                 # Custom hooks
├── lib/                       # Utility functions
│   └── apolloClient.ts        # Apollo Client setup
├── public/                    # Static assets
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── next.config.ts             # Next.js configuration
└── eslint.config.mjs          # ESLint configuration
```

## Directory Breakdown

### `/app` - Next.js App Router

The application uses Next.js 13+ App Router for file-based routing:

- **`layout.tsx`**: Root layout wrapping all pages with Apollo Provider
- **`page.tsx`**: Home page (landing page)
- **`login/page.tsx`**: User login page
- **`register/page.tsx`**: User registration page
- **`dashboard/page.tsx`**: Main dashboard showing workspaces
- **`board/[id]/page.tsx`**: Individual board with tasks
- **`workspace/[id]/page.tsx`**: Workspace management
- **`admin/page.tsx`**: Admin management page

### `/app/components` - Reusable Components

Shared React components used across pages:
- `Navbar.tsx` - Navigation bar
- Task components
- Workspace components
- UI components (buttons, inputs, etc.)

### `/app/hooks` - Custom React Hooks

GraphQL query and mutation hooks using Apollo Client:
- `useWorkspaces.ts` - Workspace queries/mutations
- `useTasks.ts` - Task queries/mutations
- `useLogin.ts` - Login mutation
- `useRegister.ts` - Registration mutation
- `useAdmin.ts` - Admin queries
- Custom authentication hooks

### `/lib` - Utility Functions

- **`apolloClient.ts`**: Apollo Client configuration
  - HTTP link to GraphQL endpoint
  - Auth link for JWT token handling
  - In-memory cache

## Apollo Client Setup

Located in `lib/apolloClient.ts`:

```typescript
'use client';

import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import Cookies from 'js-cookie';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = new ApolloLink((operation, forward) => {
  const token = Cookies.get('token');
  operation.setContext({
    headers: {
      Authorization: token ? `****** : '',
    },
  });
  return forward(operation);
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

**Key Features**:
- Automatic JWT token injection in all requests
- In-memory caching for GraphQL queries
- Handles authentication headers

## Styling with Tailwind CSS

The project uses **Tailwind CSS** for styling:

```bash
# Tailwind files
tailwind.config.ts         # Configuration
postcss.config.mjs         # PostCSS config
app/globals.css            # Global styles
```

Example usage in components:

```tsx
<div className="flex items-center justify-center gap-4 p-6 bg-blue-500 rounded-lg">
  <h1 className="text-2xl font-bold text-white">Title</h1>
</div>
```

## Routing

### File-Based Routing

Next.js automatically creates routes based on file structure:

```
app/
├── page.tsx               → /
├── login/
│   └── page.tsx          → /login
├── dashboard/
│   └── page.tsx          → /dashboard
└── board/
    └── [id]/
        └── page.tsx      → /board/123
```

### Dynamic Routes

Dynamic segments are created with square brackets:

```typescript
// app/board/[id]/page.tsx
export default function BoardPage({ params }: { params: { id: string } }) {
  return <div>Board ID: {params.id}</div>;
}
```

## Working with GraphQL Queries

### Using Custom Hooks

Example from `app/dashboard/hooks/useWorkspaces.ts`:

```typescript
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';

const GET_WORKSPACES = gql`
  query GetWorkspaces {
    workspaces {
      id
      name
      description
    }
  }
`;

export function useWorkspaces() {
  const { data, loading, error } = useQuery(GET_WORKSPACES);
  return { workspaces: data?.workspaces, loading, error };
}
```

### Using in Components

```tsx
'use client';

import { useWorkspaces } from './hooks/useWorkspaces';

export default function Dashboard() {
  const { workspaces, loading, error } = useWorkspaces();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {workspaces?.map(workspace => (
        <div key={workspace.id}>{workspace.name}</div>
      ))}
    </div>
  );
}
```

### Common Apollo Hooks

- **`useQuery`**: Execute GraphQL queries
- **`useMutation`**: Execute GraphQL mutations
- **`useSubscription`**: Subscribe to real-time data
- **`useLazyQuery`**: Execute queries on demand
- **`useApolloClient`**: Access Apollo Client instance

## Authentication Flow

### Login Flow

1. User enters credentials on login page
2. `useLogin` hook sends mutation to backend
3. Backend validates and returns JWT token
4. Token stored in cookies via `js-cookie`
5. Apollo Client automatically includes token in requests
6. User redirected to dashboard

### Protected Routes

Implementation example:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ProtectedPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsReady(true);
    }
  }, []);

  if (!isReady) return null;

  return <div>Protected content</div>;
}
```

## Development

### Start Development Server

```bash
cd apps/web
npm run dev
```

Access at `http://localhost:3000`

**Features**:
- Hot reload on file changes
- Fast refresh for React components
- GraphQL query validation

### Environment Variables

Create `.env.local` or use the root `.env`:

```
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

**Note**: Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Building

### Production Build

```bash
cd apps/web
npm run build
npm run start
```

### Build Analysis

Build process creates optimized bundles:
- Code splitting by route
- Image optimization
- CSS minification
- JavaScript compression

## Testing

### Linting

```bash
cd apps/web
npm run lint
```

### Build Check

Verify the build works:
```bash
npm run build
```

## Performance Optimization

### Image Optimization

Use Next.js Image component:

```tsx
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={100}
  height={100}
/>
```

### Code Splitting

Pages are automatically code-split:
```tsx
import dynamic from 'next/dynamic';

const ExpensiveComponent = dynamic(() => import('./Expensive'), {
  loading: () => <div>Loading...</div>,
});
```

### Apollo Query Optimization

- Use `variables` for dynamic queries
- Implement `useLazyQuery` for on-demand fetching
- Use cache policies: `cache-first`, `network-only`, `no-cache`

## Type Safety

### TypeScript

Full TypeScript support for components:

```tsx
interface Props {
  title: string;
  onClick: () => void;
}

export function Button({ title, onClick }: Props) {
  return <button onClick={onClick}>{title}</button>;
}
```

### GraphQL Type Generation

Install GraphQL Code Generator for automatic types:

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript-react-apollo
```

## Common Issues

### Apollo Client Not Initialized

Ensure `ApolloProvider` wraps your app in `layout.tsx`:

```tsx
<ApolloProvider client={client}>
  {children}
</ApolloProvider>
```

### Token Not Persisting

Ensure `js-cookie` is used consistently for token storage:

```typescript
import Cookies from 'js-cookie';

// Set token
Cookies.set('token', token);

// Get token
const token = Cookies.get('token');

// Remove token
Cookies.remove('token');
```

### CORS Errors

If you see CORS errors:
1. Verify API CORS configuration
2. Check GraphQL endpoint URL
3. Verify API is running and accessible

### GraphQL Query Not Returning Data

1. Check query syntax in Apollo DevTools
2. Verify token is sent (check Network tab)
3. Check backend resolver implementation
4. Review GraphQL schema at `http://localhost:4000/graphql`

## Browser Extensions

### Apollo DevTools

Install Apollo Client DevTools for Chrome:
- Inspect GraphQL cache
- Run queries directly
- Debug mutations
- View query performance

## Deployment

### Vercel (Recommended)

```bash
vercel
```

### Environment Variables for Production

```
NEXT_PUBLIC_GRAPHQL_URL=https://api.example.com/graphql
```

### Docker Build

Already configured in `apps/web/Dockerfile`

## Code Style

- Use `'use client'` for interactive components
- Use TypeScript for type safety
- Follow React 19 best practices
- Use Tailwind CSS for styling
- Keep components functional

## Next Steps

- Read [Backend Documentation](./02-BACKEND.md)
- Read [Architecture Guide](./04-ARCHITECTURE.md)
- Explore Apollo DevTools for debugging
