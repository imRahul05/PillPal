import { useState, useEffect } from 'react';
import { ref, set, get, update, remove, onValue, push } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';


export function useMedications() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // Fetch medications when component mounts or user changes
  useEffect(() => {
    if (!currentUser) {
      setMedications([]);
      setLoading(false);
      return;
    }
    
    const userMedicationsRef = ref(database, `users/${currentUser.uid}/medications`);
    
    // Real-time listener for medications
    const unsubscribe = onValue(userMedicationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const medicationsList = Object.entries(data).map(([id, medication]) => ({
          id,
          ...medication
        }));
        setMedications(medicationsList);
      } else {
        setMedications([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching medications:", error);
      toast({
        title: "Error",
        description: "Failed to load medications. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [currentUser, toast]);

  const addMedication = async (medication) => {
    if (!currentUser) return null;
    
    try {
      const userMedicationsRef = ref(database, `users/${currentUser.uid}/medications`);
      const newMedicationRef = push(userMedicationsRef);

       // Check if a time was set to generate future notifications
       if (medication.time) {
        // Schedule reminder notification for this medication
        const now = new Date();
        const [hours, minutes] = medication.time.split(':').map(Number);
        const scheduleTime = new Date();
        scheduleTime.setHours(hours, minutes, 0, 0);
        
        // If the time is in the past for today, don't schedule
        if (scheduleTime > now) {
          console.log(`Medication scheduled for today at ${medication.time}`);
        }
      }
      
      await set(newMedicationRef, medication);
      
      toast({
        title: "Success",
        description: "Medication added successfully",
      });
      
      return newMedicationRef.key;
    } catch (error) {
      console.error("Error adding medication:", error);
      toast({
        title: "Error",
        description: "Failed to add medication. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  const updateMedication = async (id, updates) => {
    if (!currentUser) return false;
    
    try {
      const medicationRef = ref(database, `users/${currentUser.uid}/medications/${id}`);
      await update(medicationRef, updates);
      
      toast({
        title: "Success",
        description: "Medication updated successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error updating medication:", error);
      toast({
        title: "Error",
        description: "Failed to update medication. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteMedication = async (id) => {
    if (!currentUser) return false;
    
    try {
      const medicationRef = ref(database, `users/${currentUser.uid}/medications/${id}`);
      await remove(medicationRef);
      
      toast({
        title: "Success",
        description: "Medication deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast({
        title: "Error",
        description: "Failed to delete medication. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  

  const markMedicationAsTaken = async (id) => {
    if (!currentUser) return false;
    
    try {
      const medication = medications.find(med => med.id === id);
      if (!medication) return false;
      
      const medicationRef = ref(database, `users/${currentUser.uid}/medications/${id}`);
      await update(medicationRef, { 
        taken: true,
        missed: false
      });
      
      // Add to history
      const historyRef = ref(database, `users/${currentUser.uid}/medicationHistory`);
      const newHistoryRef = push(historyRef);
      await set(newHistoryRef, {
        medicationId: id,
        medicationName: medication.name,
        dosage: medication.dosage,
        action: "Taken",
        timestamp: new Date().toISOString(),
      });
      
          // Mark any related notifications as read
          const notificationsRef = ref(database, `users/${currentUser.uid}/notifications`);
          get(notificationsRef).then((snapshot) => {
            const data = snapshot.val();
            if (data) {
              Object.entries(data).forEach(([notificationId, notification]) => {
                // @ts-ignore
                if (notification.medicationId === id && !notification.read) {
                  update(ref(database, `users/${currentUser.uid}/notifications/${notificationId}`), {
                    read: true
                  });
                }
              });
            }
          });
      toast({
        title: "Success",
        description: `Marked ${medication.name} as taken`,
      });
      
      return true;
    } catch (error) {
      console.error("Error marking medication as taken:", error);
      toast({
        title: "Error",
        description: "Failed to update medication status. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  

  const markMedicationAsMissed = async (id) => {
    if (!currentUser) return false;
    
    try {
      const medication = medications.find(med => med.id === id);
      if (!medication) return false;
      
      const medicationRef = ref(database, `users/${currentUser.uid}/medications/${id}`);
      await update(medicationRef, { 
        taken: false,
        missed: true
      });
      
      // Add to history
      const historyRef = ref(database, `users/${currentUser.uid}/medicationHistory`);
      const newHistoryRef = push(historyRef);
      await set(newHistoryRef, {
        medicationId: id,
        medicationName: medication.name,
        dosage: medication.dosage,
        action: "Missed",
        timestamp: new Date().toISOString(),
      });
      
      toast({
        title: "Noted",
        description: `Marked ${medication.name} as missed`,
      });
      
      return true;
    } catch (error) {
      console.error("Error marking medication as missed:", error);
      toast({
        title: "Error",
        description: "Failed to update medication status. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return {
    medications,
    loading,
    addMedication,
    updateMedication,
    deleteMedication,
    markMedicationAsTaken,
    markMedicationAsMissed
  };
}