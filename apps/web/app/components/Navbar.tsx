'use client';

import Link from 'next/link';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [token, setToken] = useState<string | undefined>();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const t = Cookies.get('token');
    setToken(t);

    if (t) {
      try {
        const payload = JSON.parse(atob(t.split('.')[1]));
        setIsAdmin(payload.role === 'GLOBAL_ADMIN');
      } catch {
        // ignore malformed token
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/login';
  };

  return (
    <div className="w-full bg-white border-b px-6 py-4 flex justify-between items-center">

      {/* Left */}
      <div className="flex gap-4 items-center">
        <Link href="/" className="font-bold text-lg">
          WorkspaceApp
        </Link>

        {token && (
          <Link href="/dashboard" className="text-sm text-gray-600">
            Dashboard
          </Link>
        )}

        {token && isAdmin && (
          <Link href="/admin" className="text-sm text-purple-600 font-medium">
            Admin
          </Link>
        )}
      </div>

      {/* Right */}
      <div className="flex gap-4">

        {!token && (
          <>
            <Link href="/login" className="text-sm">
              Connexion
            </Link>

            <Link href="/register" className="text-sm">
              S&apos;inscrire
            </Link>
          </>
        )}

        {token && (
          <button
            onClick={handleLogout}
            className="text-sm text-red-500"
          >
            Déconnexion
          </button>
        )}

      </div>
    </div>
  );
}