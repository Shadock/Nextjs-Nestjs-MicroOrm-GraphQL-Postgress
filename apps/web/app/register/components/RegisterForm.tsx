'use client';
import * as Label from '@radix-ui/react-label';
import { useState } from 'react';
import { useRegister } from '../hooks/useRegister';


export default function RegisterForm() {
  const { register, loading, error } = useRegister();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      await register(email, password);
      window.location.href = '/login';
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">

        <h1 className="text-2xl font-semibold mb-6 text-center">
          Create account
        </h1>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label.Root className="text-sm font-medium">
              Email
            </Label.Root>

            <input
              type="email"
              placeholder="user@test.com"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

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

          <button
            onClick={handleSubmit}
            className="mt-4 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            {loading ? 'Creating...' : 'Sign up'}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center">
              Registration failed
            </p>
          )}

          <p className="text-sm text-center">
            Already have an account?{' '}
            <a href="/login" className="underline">
              Login
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}
