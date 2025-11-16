"use client";

import { useAuthContext } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { hasPermission, Permission } from '@/lib/auth-context';

const withRole = (resource: string, action: Permission['action']) => <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const { user, loading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      if (!loading && (!user || !hasPermission(user, resource, action))) {
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user || !hasPermission(user, resource, action)) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-bold">403</h1>
          <p className="text-lg">Unauthorized</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withRole;
