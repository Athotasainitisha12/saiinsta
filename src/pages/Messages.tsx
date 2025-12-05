import { useState } from 'react';
import { ArrowLeft, Edit, Search, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  user: {
    username: string;
    fullName: string;
    image: string;
  };
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
  online: boolean;
}

const Messages = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const conversations: Conversation[] = [];
  
  const filteredConversations = searchQuery
    ? conversations.filter(
        (conv) =>
          conv.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-divider bg-background px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="md:hidden">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold">{user?.username}</h1>
        </div>
        <Button variant="ghost" size="icon">
          <Edit className="h-6 w-6" />
        </Button>
      </header>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex flex-col">
        <div className="px-4 py-2">
          <h2 className="font-semibold">Messages</h2>
        </div>

        {filteredConversations.map((conversation, index) => (
          <motion.button
            key={conversation.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-interactive-hover"
          >
            <div className="relative">
              <img
                src={conversation.user.image}
                alt={conversation.user.username}
                className="h-14 w-14 rounded-full object-cover"
              />
              {conversation.online && (
                <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background bg-success" />
              )}
            </div>
            
            <div className="flex flex-1 flex-col items-start">
              <span className={cn('text-sm', conversation.unread && 'font-semibold')}>
                {conversation.user.username}
              </span>
              <span className={cn(
                'text-sm',
                conversation.unread ? 'font-semibold text-foreground' : 'text-muted-foreground'
              )}>
                {conversation.lastMessage} · {formatTime(conversation.timestamp)}
              </span>
            </div>

            {conversation.unread && (
              <Circle className="h-2 w-2 fill-info text-info" />
            )}
          </motion.button>
        ))}

        {filteredConversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-muted-foreground">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
