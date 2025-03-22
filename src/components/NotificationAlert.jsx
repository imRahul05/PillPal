import React, { useEffect, useState } from 'react';
import { Check, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMedications } from '@/hooks/useMedications';

const NotificationAlert = ({ notification, onClose }) => {
    const [timeLeft, setTimeLeft] = useState(30);
    const { markMedicationAsTaken } = useMedications();
    
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => clearInterval(timer);
    }, [onClose]);
    
    const handleTakeMedication = async () => {
        await markMedicationAsTaken(notification.medicationId);
        onClose();
    };
    
    return (
        <div className="fixed top-20 right-4 z-50 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 animate-slide-in-right">
            <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-full">
                    <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-semibold">Medication Reminder</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Time to take your medicine
                    </p>
                </div>
            </div>
            
            <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <p className="font-medium">{notification.medicationName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dosage: {notification.dosage}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Time: {notification.time}</p>
            </div>
            
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Closes in {timeLeft}s</span>
                <Button size="sm" onClick={handleTakeMedication} className="bg-green-500 hover:bg-green-600">
                    <Check className="mr-1 h-4 w-4" /> Take Now
                </Button>
            </div>
        </div>
    );
};
export default NotificationAlert;