import { useFeedStore } from '@/stores/feedStore';
import { useAuthStore } from '@/stores/authStore';
import { StoryAvatar } from './StoryAvatar';
import { useState } from 'react';
import { StoryViewer } from './StoryViewer';
import { StoryUpload } from './StoryUpload';
import { useStoryCleanup } from '@/hooks/useStoryCleanup';

export const StoryBar = () => {
  const { stories } = useFeedStore();
  const { user } = useAuthStore();
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  
  // Auto-cleanup expired stories
  useStoryCleanup();

  // Check if current user has an active story
  const userStory = stories.find((s) => s.userId === user?.uid);

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
  };

  const handleCloseViewer = () => {
    setSelectedStoryIndex(null);
  };

  const handleYourStoryClick = () => {
    if (userStory) {
      // If user has a story, show it
      const index = stories.findIndex((s) => s.userId === user?.uid);
      if (index !== -1) {
        setSelectedStoryIndex(index);
      }
    } else {
      // Otherwise, open upload modal
      setShowUpload(true);
    }
  };

  return (
    <>
      <div className="border-b border-divider bg-background py-4">
        <div className="hide-scrollbar flex gap-4 overflow-x-auto px-4">
          {/* Your Story */}
          <StoryAvatar
            imageUrl={user?.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=you'}
            username="Your story"
            hasStory={!!userStory}
            isOwn={true}
            onClick={handleYourStoryClick}
          />

          {/* Other Stories (excluding current user's) */}
          {stories
            .filter((story) => story.userId !== user?.uid)
            .map((story, index) => (
              <StoryAvatar
                key={story.id}
                imageUrl={story.userImage}
                username={story.username}
                hasStory={true}
                isViewed={story.viewedBy.includes(user?.uid || '')}
                onClick={() => {
                  const actualIndex = stories.findIndex((s) => s.id === story.id);
                  handleStoryClick(actualIndex);
                }}
              />
            ))}
        </div>
      </div>

      {selectedStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={selectedStoryIndex}
          onClose={handleCloseViewer}
        />
      )}

      <StoryUpload isOpen={showUpload} onClose={() => setShowUpload(false)} />
    </>
  );
};
