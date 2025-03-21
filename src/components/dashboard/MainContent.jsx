import { Plus, Calendar, Check, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Renewals from './Renewals';
import DraggableMedicationList from '@/components/dashboard/DraggableMedicationList';
import { useState, useEffect } from 'react';

const MainContent = ({ 
  activeMedications: initialMedications, 
  takenToday, 
  medsLoading, 
  markMedicationAsTaken, 
  markMedicationAsMissed,
  setIsAddMedicationOpen,
  navigate,
  upcomingRenewals
}) => {
  // State to manage local medication order
  const [medications, setMedications] = useState([]);

  // Initialize medications from props
  useEffect(() => {
    setMedications(initialMedications);
  }, [initialMedications]);


  const handleReorder = (newOrder) => {
    setMedications(newOrder);
 
  };

  // Function to get status-specific styles
  const getStatusStyles = (medication) => {
    if (medication.taken) {
      return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-100 dark:border-green-800/30',
        text: 'text-green-600 dark:text-green-400',
        buttonBg: 'bg-green-500',
        icon: Check
      };
    } else if (medication.missed) {
      return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-100 dark:border-red-800/30',
        text: 'text-red-600 dark:text-red-400',
        buttonBg: 'bg-red-500',
        icon: X
      };
    } else {
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-100 dark:border-blue-800/30',
        text: 'text-blue-600 dark:text-blue-400',
        buttonBg: 'bg-blue-500',
        icon: Clock
      };
    }
  };

  return (
    <div className="lg:col-span-9 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Medications Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Track and manage your medications</p>
        </div>
        <Button 
          className="md:w-auto w-full rounded-lg shadow-glass-sm"
          onClick={() => setIsAddMedicationOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Medication
        </Button>
      </div>
      
      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { name: "Today's Medications", count: `${takenToday}/${medications.length}`, color: "bg-blue-500", icon: Calendar },
          { name: "Taken Today", count: takenToday.toString(), color: "bg-green-500", icon: Check },
          { name: "Missed", count: (medications.filter(med => med.missed).length).toString(), color: "bg-red-500", icon: X }
        ].map((stat, index) => (
          <Card key={index} className="border-gray-200 dark:border-gray-800 shadow-glass-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.name}</p>
                <p className="text-2xl font-semibold">{stat.count}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Medication List */}
      <Card className="border-gray-200 dark:border-gray-800 shadow-glass-sm">
        <CardHeader>
          <CardTitle>Today's Medications</CardTitle>
          <CardDescription>
            Drag to reorder and prioritize your medications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {medsLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : medications.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No medications scheduled</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You haven't added any medications to track yet.
              </p>
              <Button
                onClick={() => setIsAddMedicationOpen(true)}
                className="mx-auto"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Medication
              </Button>
            </div>
          ) : (
            <DraggableMedicationList
              medications={medications}
              onReorder={handleReorder}
              markMedicationAsTaken={markMedicationAsTaken}
              markMedicationAsMissed={markMedicationAsMissed}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Upcoming Renewals */}
      <Renewals upcomingRenewals={upcomingRenewals} navigate={navigate} />
    </div>
  );
};

export default MainContent;