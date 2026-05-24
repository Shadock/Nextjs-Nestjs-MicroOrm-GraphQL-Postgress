
'use client';

import LoginForm from './components/LoginForm';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  useAuth(false);
  return <LoginForm />;
}