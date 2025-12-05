import { Feed } from '@/components/feed/Feed';
import { useAuthStore } from '@/stores/authStore';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Index = () => {
  const { user, initialized, loading } = useAuthStore();
  const [timeout, setTimeout_] = useState(false);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeout_(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if ((!initialized || loading) && !timeout) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted-foreground border-t-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Feed />;
};

export default Index;
