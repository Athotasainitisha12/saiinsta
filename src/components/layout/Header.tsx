import { MessageCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-divider bg-background/95 backdrop-blur-lg">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center">
          <motion.h1 
            className="text-xl font-bold tracking-tight"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            STRANGER THINGS
          </motion.h1>
        </Link>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/create">
              <Plus className="h-6 w-6" strokeWidth={1.5} />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/messages">
              <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
