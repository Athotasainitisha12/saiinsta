import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Send, Trash2, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Story, useFeedStore } from '@/stores/feedStore';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

export const StoryViewer = ({ stories, initialIndex, onClose }: StoryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const { deleteStory } = useFeedStore();
  const { user } = useAuthStore();
  const currentStory = stories[currentIndex];
  
  const isOwnStory = user?.uid === currentStory?.userId;

  const goToNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  const handleDelete = () => {
    deleteStory(currentStory.id);
    toast.success('Story deleted');
    if (stories.length === 1) {
      onClose();
    } else if (currentIndex === stories.length - 1) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    const duration = 5000; // 5 seconds per story
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNext();
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, goToNext]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      >
        {/* Progress Bars */}
        <div className="absolute left-4 right-4 top-4 z-10 flex gap-1">
          {stories.map((_, index) => (
            <div
              key={index}
              className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"
            >
              <div
                className={cn(
                  'h-full bg-white transition-all duration-100 ease-linear',
                  index < currentIndex && 'w-full',
                  index > currentIndex && 'w-0'
                )}
                style={{
                  width: index === currentIndex ? `${progress}%` : undefined,
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute left-4 right-4 top-8 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentStory.userImage}
              alt={currentStory.username}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-sm font-semibold text-white">
              {currentStory.username}
            </span>
            <span className="text-xs text-white/60">
              {new Date(currentStory.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {isOwnStory && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Story
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Navigation Areas */}
        <button
          className="absolute left-0 top-0 z-10 h-full w-1/3"
          onClick={goToPrev}
          aria-label="Previous story"
        />
        <button
          className="absolute right-0 top-0 z-10 h-full w-1/3"
          onClick={goToNext}
          aria-label="Next story"
        />

        {/* Story Content */}
        <motion.div
          key={currentStory.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative aspect-[9/16] h-full max-h-[90vh] w-auto"
        >
          {currentStory.mediaType === 'video' ? (
            <video
              src={currentStory.mediaUrl}
              className="h-full w-full rounded-lg object-cover"
              autoPlay
              muted
              playsInline
            />
          ) : (
            <img
              src={currentStory.mediaUrl}
              alt="Story"
              className="h-full w-full rounded-lg object-cover"
            />
          )}
        </motion.div>

        {/* Navigation Arrows (Desktop) */}
        {currentIndex > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrev}
            className="absolute left-4 hidden text-white hover:bg-white/10 md:flex"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}
        {currentIndex < stories.length - 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-4 hidden text-white hover:bg-white/10 md:flex"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}

        {/* Reply Input */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center gap-2">
          <Input
            placeholder="Send message"
            className="flex-1 border-white/20 bg-transparent text-white placeholder:text-white/50"
          />
          <Button variant="ghost" size="icon" className="text-white">
            <Heart className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <Send className="h-6 w-6" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
