"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withRole = (role: string) => <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && user?.role.toLowerCase() !== role) {
        router.push('/dashboard');
      }
    }, [user, loading, router]);

    if (loading || user?.role.toLowerCase() !== role) {
      return <div>Loading...</div>; // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withRole;
