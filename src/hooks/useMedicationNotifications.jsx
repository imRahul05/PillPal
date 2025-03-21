
import { useState, useEffect } from 'react';
import { ref, onValue, update ,remove} from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';



export function useMedicationNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Fetch and listen to notifications
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }

    const userNotificationsRef = ref(database, `users/${currentUser.uid}/notifications`);
    
    const unsubscribe = onValue(userNotificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notificationsList = Object.entries(data).map(([id, notification]) => ({
          id,
          ...(notification),
        }));
        setNotifications(notificationsList.sort((a, b) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }));
      } else {
        setNotifications([]);
      }
    });
    
    return () => unsubscribe();
  }, [currentUser]);

 
  useEffect(() => {
    if (!currentUser) return;
    
    const medicationsRef = ref(database, `users/${currentUser.uid}/medications`);
    
    const checkMedicationTime = () => {
      const unsubscribe = onValue(medicationsRef, (snapshot) => {
        const now = new Date();
        const data = snapshot.val();
        
        if (!data) return;
        
        Object.entries(data).forEach(([id, medicationData]) => {
          const medication = medicationData;
          
          if (medication.status !== 'active' || !medication.time) return;
          
          const [hours, minutes] = medication.time.split(':').map(Number);
          const medicationDate = new Date();
          medicationDate.setHours(hours, minutes, 0, 0);
          
          // If the time is within the last minute and the medication hasn't been taken or marked as missed
          const isWithinLastMinute = 
            now.getTime() - medicationDate.getTime() < 60000 && 
            now.getTime() >= medicationDate.getTime();
          
          if (isWithinLastMinute && !medication.taken && !medication.missed) {
            // Create a notification if not already created
            const notificationRef = ref(database, `users/${currentUser.uid}/notifications`);
            const newNotification = {
              medicationId: id,
              medicationName: medication.name,
              dosage: medication.dosage,
              time: medication.time,
              read: false,
              timestamp: new Date().toISOString(),
            };
            
            // Check if we already created this notification in the last minute
            const shouldCreateNotification = notifications.every(
              existingNotification => 
                existingNotification.medicationId !== id ||
                now.getTime() - new Date(existingNotification.timestamp).getTime() > 60000
            );
            
            if (shouldCreateNotification) {
              // Add to Firebase
              const newNotificationRef = ref(database, `users/${currentUser.uid}/notifications/${id}_${now.getTime()}`);
              update(newNotificationRef, newNotification);
              
              // Show alert notification
              toast({
                title: "Medication Reminder",
                description: `Time to take ${medication.name} ${medication.dosage}`,
                duration: 30000, // 30 seconds
                variant: "default",
              });
              
              // Set active alert
              setActiveAlert({
                id: `${id}_${now.getTime()}`,
                ...newNotification
              });
              
              // Clear the active alert after 30 seconds
              setTimeout(() => {
                setActiveAlert(null);
              }, 30000);
            }
          }
        });
      });
      
      return unsubscribe;
    };
    
    const unsubscribe = checkMedicationTime();
    const interval = setInterval(() => {
      checkMedicationTime();
    }, 30000); // Check every 30 seconds
    
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [currentUser, notifications, toast]);

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    if (!currentUser) return;
    
    try {
      const notificationRef = ref(database, `users/${currentUser.uid}/notifications/${notificationId}`);
      await update(notificationRef, { read: true });
      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
  };
  const clearAllNotifications = async () => {
    if (!currentUser) return false;
    
    try {
      const userNotificationsRef = ref(database, `users/${currentUser.uid}/notifications`);
      await remove(userNotificationsRef);
      return true;
    } catch (error) {
      console.error("Error clearing notifications:", error);
      return false;
    }
  };

  // Get unread count
  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.read).length;
  };

  return {
    notifications,
    activeAlert,
    markAsRead,
    clearAllNotifications,
    getUnreadCount
  };
}