import { create } from 'zustand';

export interface Post {
  id: string;
  userId: string;
  username: string;
  userImage: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  hashtags: string[];
  location?: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: Date;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  userImage: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  createdAt: Date;
  expiresAt: Date;
  viewedBy: string[];
}

export interface Reel {
  id: string;
  userId: string;
  username: string;
  userImage: string;
  mediaUrl: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: Date;
  audio: string;
}

interface FeedState {
  posts: Post[];
  stories: Story[];
  reels: Reel[];
  loading: boolean;
  setPosts: (posts: Post[]) => void;
  setStories: (stories: Story[]) => void;
  setReels: (reels: Reel[]) => void;
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  savePost: (postId: string) => void;
  unsavePost: (postId: string) => void;
  addPost: (post: Post) => void;
  deletePost: (postId: string) => void;
  addStory: (story: Story) => void;
  deleteStory: (storyId: string) => void;
  cleanupExpiredStories: () => void;
  addReel: (reel: Reel) => void;
  deleteReel: (reelId: string) => void;
  likeReel: (reelId: string) => void;
  unlikeReel: (reelId: string) => void;
  saveReel: (reelId: string) => void;
  unsaveReel: (reelId: string) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  posts: [],
  stories: [],
  reels: [],
  loading: false,
  
  setPosts: (posts) => set({ posts }),
  setStories: (stories) => set({ stories }),
  setReels: (reels) => set({ reels }),
  
  likePost: (postId) => set((state) => ({
    posts: state.posts.map((post) =>
      post.id === postId
        ? { ...post, isLiked: true, likesCount: post.likesCount + 1 }
        : post
    ),
  })),
  
  unlikePost: (postId) => set((state) => ({
    posts: state.posts.map((post) =>
      post.id === postId
        ? { ...post, isLiked: false, likesCount: post.likesCount - 1 }
        : post
    ),
  })),
  
  savePost: (postId) => set((state) => ({
    posts: state.posts.map((post) =>
      post.id === postId ? { ...post, isSaved: true } : post
    ),
  })),
  
  unsavePost: (postId) => set((state) => ({
    posts: state.posts.map((post) =>
      post.id === postId ? { ...post, isSaved: false } : post
    ),
  })),
  
  addPost: (post) => set((state) => ({
    posts: [post, ...state.posts],
  })),
  
  deletePost: (postId) => set((state) => ({
    posts: state.posts.filter((post) => post.id !== postId),
  })),
  
  addStory: (story) => set((state) => ({
    stories: [story, ...state.stories],
  })),
  
  deleteStory: (storyId) => set((state) => ({
    stories: state.stories.filter((story) => story.id !== storyId),
  })),
  
  cleanupExpiredStories: () => set((state) => ({
    stories: state.stories.filter((story) => {
      const expiresAt = new Date(story.expiresAt);
      return expiresAt > new Date();
    }),
  })),
  
  addReel: (reel) => set((state) => ({
    reels: [reel, ...state.reels],
  })),
  
  deleteReel: (reelId) => set((state) => ({
    reels: state.reels.filter((reel) => reel.id !== reelId),
  })),
  
  likeReel: (reelId) => set((state) => ({
    reels: state.reels.map((reel) =>
      reel.id === reelId
        ? { ...reel, isLiked: true, likesCount: reel.likesCount + 1 }
        : reel
    ),
  })),
  
  unlikeReel: (reelId) => set((state) => ({
    reels: state.reels.map((reel) =>
      reel.id === reelId
        ? { ...reel, isLiked: false, likesCount: reel.likesCount - 1 }
        : reel
    ),
  })),
  
  saveReel: (reelId) => set((state) => ({
    reels: state.reels.map((reel) =>
      reel.id === reelId ? { ...reel, isSaved: true } : reel
    ),
  })),
  
  unsaveReel: (reelId) => set((state) => ({
    reels: state.reels.map((reel) =>
      reel.id === reelId ? { ...reel, isSaved: false } : reel
    ),
  })),
}));
