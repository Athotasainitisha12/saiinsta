import { Home, Search, Compass, Film, MessageCircle, Heart, PlusSquare, Menu, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, path: '/', label: 'Home' },
  { icon: Search, path: '/search', label: 'Search' },
  { icon: Compass, path: '/explore', label: 'Explore' },
  { icon: Film, path: '/reels', label: 'Reels' },
  { icon: MessageCircle, path: '/messages', label: 'Messages' },
  { icon: Heart, path: '/activity', label: 'Notifications' },
  { icon: PlusSquare, path: '/create', label: 'Create' },
];

export const Sidebar = () => {
  const { user } = useAuthStore();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[72px] flex-col border-r border-divider bg-background px-3 py-6 md:flex xl:w-[244px]">
      <NavLink to="/" className="mb-8 flex items-center px-3">
        <motion.h1 
          className="hidden text-xl font-bold tracking-tight xl:block"
          whileHover={{ scale: 1.02 }}
        >
          STRANGER THINGS
        </motion.h1>
        <span className="text-2xl font-bold xl:hidden">ST</span>
      </NavLink>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ icon: Icon, path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-4 rounded-lg px-3 py-3 transition-all duration-200',
                isActive
                  ? 'bg-secondary font-semibold'
                  : 'hover:bg-interactive-hover'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn(
                    'h-6 w-6 transition-transform group-hover:scale-105',
                    isActive && 'fill-current'
                  )}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <span className="hidden xl:block">{label}</span>
              </>
            )}
          </NavLink>
        ))}

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              'group flex items-center gap-4 rounded-lg px-3 py-3 transition-all duration-200',
              isActive
                ? 'bg-secondary font-semibold'
                : 'hover:bg-interactive-hover'
            )
          }
        >
          {({ isActive }) => (
            <>
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.username}
                  className={cn(
                    'h-6 w-6 rounded-full object-cover ring-2 transition-all',
                    isActive ? 'ring-foreground' : 'ring-transparent'
                  )}
                />
              ) : (
                <User className="h-6 w-6" strokeWidth={1.5} />
              )}
              <span className="hidden xl:block">Profile</span>
            </>
          )}
        </NavLink>
      </nav>

      <Button variant="ghost" className="mt-auto justify-start gap-4 px-3">
        <Menu className="h-6 w-6" strokeWidth={1.5} />
        <span className="hidden xl:block">More</span>
      </Button>
    </aside>
  );
};
