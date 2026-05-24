
'use client';

import RegisterForm from './components/RegisterForm';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  useAuth(false);
  return <RegisterForm />;
}