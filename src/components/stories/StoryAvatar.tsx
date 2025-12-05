import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StoryAvatarProps {
  imageUrl: string;
  username: string;
  hasStory?: boolean;
  isViewed?: boolean;
  isOwn?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const sizeClasses = {
  sm: { ring: 'p-[2px]', avatar: 'h-8 w-8' },
  md: { ring: 'p-[3px]', avatar: 'h-14 w-14' },
  lg: { ring: 'p-[3px]', avatar: 'h-20 w-20' },
};

export const StoryAvatar = ({
  imageUrl,
  username,
  hasStory = false,
  isViewed = false,
  isOwn = false,
  size = 'md',
  onClick,
}: StoryAvatarProps) => {
  const { ring, avatar } = sizeClasses[size];

  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5"
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={cn(
          'rounded-full',
          ring,
          hasStory && !isViewed && 'story-ring',
          hasStory && isViewed && 'bg-divider-strong',
          !hasStory && isOwn && 'bg-gradient-to-tr from-muted to-muted-foreground/30',
          !hasStory && !isOwn && 'bg-transparent'
        )}
      >
        <div className="rounded-full bg-background p-[2px]">
          <div className="relative">
            <img
              src={imageUrl}
              alt={username}
              className={cn(avatar, 'rounded-full object-cover')}
            />
            {isOwn && !hasStory && (
              <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-info text-primary-foreground">
                <span className="text-xs font-bold">+</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <span className="max-w-[64px] truncate text-xs">
        {isOwn ? 'Your story' : username}
      </span>
    </motion.button>
  );
};
