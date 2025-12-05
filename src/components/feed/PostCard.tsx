import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post, useFeedStore } from '@/stores/feedStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const { likePost, unlikePost, savePost, unsavePost, deletePost } = useFeedStore();
  const { user } = useAuthStore();
  const [showHeart, setShowHeart] = useState(false);

  const isOwnPost = user?.uid === post.userId;

  const handleLike = () => {
    if (post.isLiked) {
      unlikePost(post.id);
    } else {
      likePost(post.id);
    }
  };

  const handleDoubleTap = () => {
    if (!post.isLiked) {
      likePost(post.id);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
  };

  const handleSave = () => {
    if (post.isSaved) {
      unsavePost(post.id);
    } else {
      savePost(post.id);
    }
  };

  const handleDelete = () => {
    deletePost(post.id);
    toast.success('Post deleted');
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w`;
  };

  return (
    <article className="animate-fade-in border-b border-divider">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link to={`/user/${post.username}`} className="flex items-center gap-3">
          <div className="h-8 w-8 overflow-hidden rounded-full">
            <img
              src={post.userImage}
              alt={post.username}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{post.username}</span>
            {post.location && (
              <span className="text-xs text-muted-foreground">{post.location}</span>
            )}
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isOwnPost && (
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>Share to...</DropdownMenuItem>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Image */}
      <div 
        className="relative aspect-square bg-muted"
        onDoubleClick={handleDoubleTap}
      >
        <img
          src={post.mediaUrl}
          alt={post.caption}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Heart className="h-24 w-24 fill-white text-white drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <motion.button
              onClick={handleLike}
              whileTap={{ scale: 0.85 }}
              className="p-2 -ml-2"
            >
              <Heart
                className={cn(
                  'h-6 w-6 transition-colors',
                  post.isLiked && 'fill-destructive text-destructive animate-heart'
                )}
              />
            </motion.button>
            <Button variant="ghost" size="icon-sm">
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <Send className="h-6 w-6" />
            </Button>
          </div>
          <motion.button
            onClick={handleSave}
            whileTap={{ scale: 0.85 }}
            className="p-2 -mr-2"
          >
            <Bookmark
              className={cn(
                'h-6 w-6 transition-colors',
                post.isSaved && 'fill-foreground'
              )}
            />
          </motion.button>
        </div>

        {/* Likes */}
        <button className="text-sm font-semibold">
          {formatCount(post.likesCount)} likes
        </button>

        {/* Caption */}
        <div className="mt-1">
          <span className="text-sm">
            <Link to={`/user/${post.username}`} className="font-semibold">
              {post.username}
            </Link>{' '}
            {post.caption}
          </span>
        </div>

        {/* View Comments */}
        {post.commentsCount > 0 && (
          <button className="mt-1 text-sm text-muted-foreground">
            View all {post.commentsCount} comments
          </button>
        )}

        {/* Timestamp */}
        <p className="mt-1 text-xs text-muted-foreground uppercase">
          {timeAgo(post.createdAt)}
        </p>
      </div>
    </article>
  );
};
