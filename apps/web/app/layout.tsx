'use client';

import { ApolloProvider } from '@apollo/client/react';
import { client } from '../lib/apolloClient';
import "./globals.css";
import Navbar from './components/Navbar';


// REVIEW: éviter `any` ici ; typer via `React.PropsWithChildren` pour garder la sûreté TypeScript.
export default function RootLayout({ children }: any) {
  return (
    <html>
      <body>
        <ApolloProvider client={client}>
          <Navbar />
          {children}
        </ApolloProvider>
      </body>
    </html>
  );
}