'use client';

import React from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { client } from '../lib/apolloClient';
import "./globals.css";
import Navbar from './components/Navbar';


export default function RootLayout({ children }: { children: React.ReactNode }) {
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