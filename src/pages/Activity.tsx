import { Heart, UserPlus, MessageCircle, AtSign, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type NotificationType = 'like' | 'follow' | 'comment' | 'mention' | 'repost';

interface Notification {
  id: string;
  type: NotificationType;
  user: {
    username: string;
    image: string;
  };
  content?: string;
  postImage?: string;
  timestamp: Date;
  isRead: boolean;
}

const notifications: Notification[] = [];

const notificationIcons: Record<NotificationType, typeof Heart> = {
  like: Heart,
  follow: UserPlus,
  comment: MessageCircle,
  mention: AtSign,
  repost: Repeat,
};

const notificationColors: Record<NotificationType, string> = {
  like: 'text-destructive',
  follow: 'text-info',
  comment: 'text-success',
  mention: 'text-warning',
  repost: 'text-info',
};

const Activity = () => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return `${Math.floor(days / 7)}w`;
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return 'liked your photo.';
      case 'follow':
        return 'started following you.';
      case 'comment':
        return notification.content;
      case 'mention':
        return notification.content;
      case 'repost':
        return 'reposted your photo.';
      default:
        return '';
    }
  };

  const todayNotifications = notifications.filter(
    (n) => new Date().getTime() - n.timestamp.getTime() < 86400000
  );
  
  const thisWeekNotifications = notifications.filter(
    (n) => {
      const diff = new Date().getTime() - n.timestamp.getTime();
      return diff >= 86400000 && diff < 604800000;
    }
  );

  const renderNotification = (notification: Notification, index: number) => {
    const Icon = notificationIcons[notification.type];
    
    return (
      <motion.div
        key={notification.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className={cn(
          'flex items-center gap-3 px-4 py-3 transition-colors hover:bg-interactive-hover',
          !notification.isRead && 'bg-info/5'
        )}
      >
        <div className="relative">
          <img
            src={notification.user.image}
            alt={notification.user.username}
            className="h-11 w-11 rounded-full object-cover"
          />
          <div className={cn(
            'absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background',
            notificationColors[notification.type]
          )}>
            <Icon className="h-3 w-3" fill="currentColor" />
          </div>
        </div>

        <div className="flex flex-1 items-center gap-2">
          <p className="text-sm">
            <span className="font-semibold">{notification.user.username}</span>{' '}
            <span className="text-muted-foreground">{getNotificationText(notification)}</span>{' '}
            <span className="text-muted-foreground">{formatTime(notification.timestamp)}</span>
          </p>
        </div>

        {notification.postImage && (
          <img
            src={notification.postImage}
            alt="Post"
            className="h-11 w-11 rounded object-cover"
          />
        )}

        {notification.type === 'follow' && (
          <button className="rounded-lg bg-info px-4 py-1.5 text-sm font-semibold text-primary-foreground">
            Follow
          </button>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-divider bg-background px-4 py-3 md:hidden">
        <h1 className="text-lg font-semibold">Notifications</h1>
      </header>

      <div className="flex flex-col">
        {todayNotifications.length > 0 && (
          <>
            <h2 className="px-4 py-3 font-semibold">Today</h2>
            {todayNotifications.map((n, i) => renderNotification(n, i))}
          </>
        )}

        {thisWeekNotifications.length > 0 && (
          <>
            <h2 className="px-4 py-3 font-semibold">This Week</h2>
            {thisWeekNotifications.map((n, i) => renderNotification(n, i + todayNotifications.length))}
          </>
        )}

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Heart className="mb-4 h-16 w-16 text-muted-foreground" strokeWidth={1} />
            <p className="text-lg font-semibold">Activity On Your Posts</p>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              When someone likes or comments on one of your posts, you'll see it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
