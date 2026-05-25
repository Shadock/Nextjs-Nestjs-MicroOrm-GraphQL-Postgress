'use client';

import Link from 'next/link';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [token, setToken] = useState<string | undefined>();

  useEffect(() => {
    // REVIEW: eslint react-hooks/set-state-in-effect remonte ce setState synchrone.
    // En plus, stocker le JWT en cookie lisible JS augmente la surface XSS.
    setToken(Cookies.get('token'));
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
          MyApp
        </Link>

        {token && (
          <Link href="/dashboard" className="text-sm text-gray-600">
            Dashboard
          </Link>
        )}
      </div>

      {/* Right */}
      <div className="flex gap-4">

        {!token && (
          <>
            <Link href="/login" className="text-sm">
              Login
            </Link>

            <Link href="/register" className="text-sm">
              Register
            </Link>
          </>
        )}

        {token && (
          <button
            onClick={handleLogout}
            className="text-sm text-red-500"
          >
            Logout
          </button>
        )}

      </div>
    </div>
  );
}