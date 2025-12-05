import { Home, Search, Film, Heart, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, path: '/', label: 'Home' },
  { icon: Search, path: '/search', label: 'Search' },
  { icon: Film, path: '/reels', label: 'Reels' },
  { icon: Heart, path: '/activity', label: 'Activity' },
  { icon: User, path: '/profile', label: 'Profile' },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-divider bg-background/95 backdrop-blur-lg md:hidden">
      <div className="flex h-14 items-center justify-around px-4">
        {navItems.map(({ icon: Icon, path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'relative flex h-full flex-1 items-center justify-center transition-colors',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )
            }
          >
            {({ isActive }) => (
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative flex items-center justify-center"
              >
                <Icon
                  className={cn(
                    'h-6 w-6 transition-all',
                    isActive && 'fill-current'
                  )}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                {isActive && (
                  <motion.div
                    layoutId="bottomNav"
                    className="absolute -bottom-3 h-1 w-1 rounded-full bg-foreground"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
