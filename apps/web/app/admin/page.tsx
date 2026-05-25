'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AdminView from './components/AdminView';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    // Decode JWT payload to check role (without library, simple base64 decode)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'GLOBAL_ADMIN') {
        router.push('/dashboard');
      }
    } catch {
      router.push('/login');
    }
  }, [router]);

  return <AdminView />;
}
