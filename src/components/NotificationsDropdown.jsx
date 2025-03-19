// src/components/NotificationsDropdown.jsx
import React from 'react';
import { Bell, Check, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { useMedicationNotifications } from '@/hooks/useMedicationNotifications';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const NotificationsDropdown = () => {
  const navigate = useNavigate();
  const { notifications, markAsRead, getUnreadCount } = useMedicationNotifications();
  const unreadCount = getUnreadCount();

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const handleNotificationClick = (notificationId) => {
    markAsRead(notificationId);
    navigate(`/medications/${notificationId}`); // Adjust the path as needed
  };
  return (
    <DropdownMenu  onClick={() => handleNotificationClick(notification.id)}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full relative hover:bg-accent dark:hover:bg-accent/70"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          "w-80 bg-[hsl(var(--card))] border-[hsl(var(--border))] shadow-lg z-[60]", // Added background, border, shadow, and z-index
          "text-[hsl(var(--foreground))]" // Ensure text color adapts to theme
        )}
      >
        <DropdownMenuLabel className="text-[hsl(var(--foreground))]">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[hsl(var(--border))]" />
        {notifications.length === 0 ? (
          <div className="py-4 px-2 text-center text-sm text-[hsl(var(--muted-foreground))]">
            No notifications
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex flex-col items-start p-3 cursor-pointer", // Changed to cursor-pointer
                  !notification.read && "bg-blue-50 dark:bg-blue-900/30" // Increased opacity for dark mode
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex w-full justify-between">
                  <span className="font-medium">{notification.medicationName}</span>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {formatTimestamp(notification.timestamp)}
                  </span>
                </div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">
                  {notification.dosage} at {notification.time}
                </div>
                <div className="flex items-center mt-2 text-xs">
                  {notification.read ? (
                    <span className="text-green-600 dark:text-green-400 flex items-center">
                      <Check className="h-3 w-3 mr-1" /> Seen
                    </span>
                  ) : (
                    <span className="text-blue-600 dark:text-blue-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> New
                    </span>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;