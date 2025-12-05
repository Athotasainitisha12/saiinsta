import { useState } from 'react';
import { Settings, Grid3X3, Bookmark, UserSquare2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'posts', icon: Grid3X3, label: 'Posts' },
  { id: 'saved', icon: Bookmark, label: 'Saved' },
  { id: 'tagged', icon: UserSquare2, label: 'Tagged' },
];

const Profile = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('posts');

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Link to="/auth" className="text-info">Sign in to view profile</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-divider bg-background px-4 py-3 md:hidden">
        <h1 className="text-lg font-semibold">{user.username}</h1>
        <Link to="/settings">
          <Button variant="ghost" size="icon">
            <Settings className="h-6 w-6" />
          </Button>
        </Link>
      </header>

      {/* Profile Info */}
      <div className="px-4 py-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="shrink-0">
            <img
              src={user.profileImage}
              alt={user.username}
              className="h-20 w-20 rounded-full object-cover md:h-36 md:w-36"
            />
          </div>

          {/* Stats & Actions */}
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-light">{user.username}</h2>
              <Link to="/settings">
                <Button variant="secondary" size="sm" className="hidden md:flex">
                  Edit profile
                </Button>
              </Link>
              <Link to="/settings" className="hidden md:flex">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Stats - Desktop */}
            <div className="hidden gap-8 md:flex">
              <div className="flex gap-1">
                <span className="font-semibold">{user.postsCount}</span>
                <span className="text-muted-foreground">posts</span>
              </div>
              <button className="flex gap-1">
                <span className="font-semibold">{formatCount(user.followersCount)}</span>
                <span className="text-muted-foreground">followers</span>
              </button>
              <button className="flex gap-1">
                <span className="font-semibold">{formatCount(user.followingCount)}</span>
                <span className="text-muted-foreground">following</span>
              </button>
            </div>

            {/* Bio - Desktop */}
            <div className="hidden md:block">
              <p className="font-semibold">{user.fullName}</p>
              {user.bio && <p className="mt-1 text-sm">{user.bio}</p>}
              {user.musicalNote && (
                <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <Music className="h-4 w-4" />
                  {user.musicalNote}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bio - Mobile */}
        <div className="mt-4 md:hidden">
          <p className="font-semibold">{user.fullName}</p>
          {user.bio && <p className="mt-1 text-sm">{user.bio}</p>}
          {user.musicalNote && (
            <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <Music className="h-4 w-4" />
              {user.musicalNote}
            </p>
          )}
        </div>

        {/* Action Buttons - Mobile */}
        <div className="mt-4 flex gap-2 md:hidden">
          <Link to="/settings" className="flex-1">
            <Button variant="secondary" className="w-full">
              Edit profile
            </Button>
          </Link>
          <Button variant="secondary" className="flex-1">
            Share profile
          </Button>
        </div>

        {/* Stats - Mobile */}
        <div className="mt-4 flex justify-around border-y border-divider py-3 md:hidden">
          <div className="flex flex-col items-center">
            <span className="font-semibold">{user.postsCount}</span>
            <span className="text-xs text-muted-foreground">posts</span>
          </div>
          <button className="flex flex-col items-center">
            <span className="font-semibold">{formatCount(user.followersCount)}</span>
            <span className="text-xs text-muted-foreground">followers</span>
          </button>
          <button className="flex flex-col items-center">
            <span className="font-semibold">{formatCount(user.followingCount)}</span>
            <span className="text-xs text-muted-foreground">following</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-14 z-30 flex border-t border-divider bg-background md:top-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'relative flex flex-1 items-center justify-center gap-2 py-3 transition-colors',
              activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            <tab.icon className="h-5 w-5 md:h-4 md:w-4" />
            <span className="hidden text-xs font-semibold uppercase tracking-wider md:block">
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="profileTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Posts Grid - Empty State */}
      <div className="flex flex-col items-center justify-center py-20">
        <Grid3X3 className="mb-4 h-16 w-16 text-muted-foreground" strokeWidth={1} />
        <p className="text-lg font-semibold">Share Photos</p>
        <p className="mt-1 text-sm text-muted-foreground">
          When you share photos, they will appear on your profile.
        </p>
      </div>
    </div>
  );
};

export default Profile;
