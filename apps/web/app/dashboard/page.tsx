
'use client';
import DashboardView from './components/DashboardView';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
  useAuth(true);
  return <DashboardView />;
}