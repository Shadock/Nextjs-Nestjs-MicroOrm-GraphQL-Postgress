'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export function useAuth(protectedRoute: boolean) {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');

    if (protectedRoute && !token) {
      router.push('/login');
    }

    if (!protectedRoute && token) {
      router.push('/dashboard');
    }
  }, []);
}