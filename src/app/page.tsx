'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import SplashScreen from '@/components/shared/SplashScreen';

export default function Home() {
  const router = useRouter();
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = storage.getSession();
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
      setIsBooting(false);
    }, 1200); // Between 800ms and 2000ms

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
