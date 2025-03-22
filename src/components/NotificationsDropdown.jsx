// src/components/NotificationsDropdown.jsx
import React, { useState } from 'react';
import { Bell, Check, Clock, Trash2 } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

const NotificationsDropdown = () => {
  const { notifications, markAsRead, getUnreadCount, clearAllNotifications } = useMedicationNotifications();
  const unreadCount = getUnreadCount();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleClearAll = async () => {
    const success = await clearAllNotifications();
    
    if (success) {
      toast({
        title: "Notifications cleared",
        description: "All notifications have been removed",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to clear notifications. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
    
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
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
          "w-80 bg-[hsl(var(--card))] border-[hsl(var(--border))] shadow-lg z-[60]", 
          "text-[hsl(var(--foreground))]"
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
        <DropdownMenuSeparator className="bg-[hsl(var(--border))]" />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className={cn(
                "block w-full text-left py-3 px-4 text-sm text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]",
                notifications.length === 0 && "opacity-50 cursor-not-allowed"
              )}
              disabled={notifications.length === 0}
            >
              <div className="flex items-center">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </div>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] z-[70]">
            <AlertDialogHeader>
              <AlertDialogTitle>Clear All Notifications</AlertDialogTitle>
              <AlertDialogDescription className="text-[hsl(var(--muted-foreground))]">
                Are you sure you want to clear all notifications? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-[hsl(var(--border))]">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearAll}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;