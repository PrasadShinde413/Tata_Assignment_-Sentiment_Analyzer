'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardComponent from '@/components/Dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      router.push('/');
    } else if (role !== 'admin' && role !== 'analyst') {
      router.push('/');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <main>
      <DashboardComponent />
    </main>
  );
}
