import { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  username: string;
  fullName: string;
  image: string;
  followers: number;
}

interface TrendingHashtag {
  tag: string;
  posts: number;
}

const Search = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const searchResults: SearchResult[] = [];
  const trendingHashtags: TrendingHashtag[] = [];
  
  const filteredResults = query
    ? searchResults.filter(
        (user) =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.fullName.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="sticky top-0 z-40 border-b border-divider bg-background/95 backdrop-blur-lg">
        <div className="px-4 py-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="pl-10 pr-10"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-muted p-0.5"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <AnimatePresence mode="wait">
        {query && filteredResults.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="divide-y divide-divider"
          >
            {filteredResults.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-interactive-hover"
              >
                <img
                  src={user.image}
                  alt={user.username}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.fullName}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatNumber(user.followers)} followers
                </p>
              </motion.div>
            ))}
          </motion.div>
        ) : query ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <p className="text-muted-foreground">No results found</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Trending Hashtags */}
            <div className="px-4 py-4">
              <h2 className="mb-4 text-lg font-semibold">Trending</h2>
              <div className="flex flex-col gap-4">
                {trendingHashtags.map((hashtag, index) => (
                  <motion.div
                    key={hashtag.tag}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold">#{hashtag.tag}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatNumber(hashtag.posts)} posts
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {trendingHashtags.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">No trending hashtags</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;
