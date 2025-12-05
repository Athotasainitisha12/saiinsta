import { useFeedStore } from '@/stores/feedStore';
import { PostCard } from './PostCard';
import { StoryBar } from '../stories/StoryBar';

export const Feed = () => {
  const { posts, loading } = useFeedStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <StoryBar />
      
      <div className="flex flex-col">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">No posts yet</p>
        </div>
      )}
    </div>
  );
};
