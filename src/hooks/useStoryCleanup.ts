import { useEffect } from 'react';
import { useFeedStore } from '@/stores/feedStore';

export const useStoryCleanup = () => {
  const { cleanupExpiredStories } = useFeedStore();

  useEffect(() => {
    // Run cleanup immediately on mount
    cleanupExpiredStories();

    // Set up interval to check every minute
    const interval = setInterval(() => {
      cleanupExpiredStories();
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, [cleanupExpiredStories]);
};