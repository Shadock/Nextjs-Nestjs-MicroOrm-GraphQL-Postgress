'use client';

import * as Label from '@radix-ui/react-label';
import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';

export default function LoginForm() {
  const { login, loading, error } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      await login(email, password);
      window.location.href = '/dashboard';
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Card */}
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Welcome
        </h1>

        {/* Form */}
        <div className="flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col gap-1">
            <Label.Root className="text-sm font-medium">
              Email
            </Label.Root>

            <input
              type="email"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="admin@test.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <Label.Root className="text-sm font-medium">
              Password
            </Label.Root>

            <input
              type="password"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            className="mt-4 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center">
              Invalid email or password
            </p>
          )}
        </div>
        
<p className="text-sm text-center mt-4">
  Don’t have an account?{' '}
  <a href="/register" className="underline">
    Sign up
  </a>
</p>

      </div>
    </div>
  );
}