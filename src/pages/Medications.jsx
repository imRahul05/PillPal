
import { useEffect, useState } from 'react';
import { 
  Plus, Search, Filter, CheckCircle, Clock, X, Calendar, 
  AlertTriangle, Edit, Trash2, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMedications } from '@/hooks/useMedications';
import MedicationForm from '@/components/MedicationForm';
import { format } from 'date-fns';
import DraggableMedicationList from '@/components/dashboard/DraggableMedicationList';


const Medications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const { 
    medications, 
    loading, 
    addMedication, 
    updateMedication, 
    deleteMedication,
    markMedicationAsTaken,
    markMedicationAsMissed
  } = useMedications();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAddSubmit = async (data) => {
    // Format dates to ISO strings for storage
    const formattedData = {
      ...data,
      startDate: data.startDate ? format(data.startDate, 'MMM d, yyyy') : '',
      renewalDate: data.renewalDate ? format(data.renewalDate, 'MMM d, yyyy') : '',
      endDate: data.endDate ? format(data.endDate, 'MMM d, yyyy') : '',
      // Assign a color based on category
      color: getCategoryColor(data.category),
    };
    
    await addMedication(formattedData);
    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = async (data) => {
    if (!selectedMedication) return;
    
    // Format dates to ISO strings for storage
    const formattedData = {
      ...data,
      startDate: data.startDate ? format(data.startDate, 'MMM d, yyyy') : '',
      renewalDate: data.renewalDate ? format(data.renewalDate, 'MMM d, yyyy') : '',
      endDate: data.endDate ? format(data.endDate, 'MMM d, yyyy') : '',
      // Keep the same color or assign a new one if category changed
      color: selectedMedication.category !== data.category 
        ? getCategoryColor(data.category) 
        : selectedMedication.color,
    };
    
    await updateMedication(selectedMedication.id, formattedData);
    setIsEditDialogOpen(false);
    setSelectedMedication(null);
  };

  const handleDelete = async () => {
    if (!selectedMedication) return;
    
    await deleteMedication(selectedMedication.id);
    setIsDeleteDialogOpen(false);
    setSelectedMedication(null);
  };

  const handleEditClick = (medication) => {
    setSelectedMedication(medication);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (medication) => {
    setSelectedMedication(medication);
    setIsDeleteDialogOpen(true);
  };

  const handleTakeNow = async (medication) => {
    await markMedicationAsTaken(medication.id);
  };

  // Filter medications based on search term
  const filteredMedications = medications.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get color based on medication category
  const getCategoryColor = (category) => {
    const colorMap = {
      'Blood Pressure': 'bg-blue-500',
      'Diabetes': 'bg-green-500',
      'Cholesterol': 'bg-purple-500',
      'Blood Thinner': 'bg-red-500',
      'Thyroid': 'bg-amber-500',
      'Pain Relief': 'bg-pink-500',
      'Antibiotic': 'bg-cyan-500',
      'Acid Reflux': 'bg-orange-500',
      'Asthma': 'bg-teal-500',
      'Mental Health': 'bg-indigo-500',
      'Allergy': 'bg-yellow-500',
    };
    
    return colorMap[category] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-semibold">Medications</h1>
              <p className="text-gray-500 dark:text-gray-400">Manage and track all your medications</p>
            </div>
            <Button 
              className="md:w-auto w-full rounded-lg shadow-glass-sm"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Medication
            </Button>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search medications..." 
                className="pl-10 rounded-lg border-gray-200 dark:border-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="rounded-lg border-gray-200 dark:border-gray-800">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          
          {/* Empty State */}
          {!loading && medications.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">No medications yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                You haven't added any medications to track. Start by adding your first medication.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Medication
              </Button>
            </div>
          )}
          
          {/* Tabs for Active/Inactive */}
          {!loading && medications.length > 0 && (
            <Tabs defaultValue="active" className="mb-8">
              <TabsList className="grid w-full md:w-80 grid-cols-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <TabsTrigger 
                  value="active" 
                  className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Active
                </TabsTrigger>
                <TabsTrigger 
                  value="inactive"
                  className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
                >
                  <Clock className="mr-2 h-4 w-4" /> Inactive
                </TabsTrigger>
              </TabsList>
              
              {/* Active Medications */}
              <TabsContent value="active" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMedications
                    .filter(med => med.status === 'active')
                    .map((med) => (
                    <Card 
                      key={med.id} 
                      className="border-gray-200 dark:border-gray-800 shadow-glass-sm hover:shadow-glass transition-shadow overflow-hidden"
                    >
                      <div className={cn("h-2", med.color)} />
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{med.name} {med.dosage}</CardTitle>
                            <CardDescription>{med.category}</CardDescription>
                          </div>
                          {med.warningLow && (
                            <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-2 text-amber-600 dark:text-amber-400">
                              <AlertTriangle className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Schedule</p>
                              <p className="font-medium">{med.schedule}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Inventory</p>
                              <p className={cn("font-medium", med.warningLow ? "text-amber-600 dark:text-amber-400" : "")}>
                                {med.inventory || 'Not tracked'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Refills Left</p>
                              <p className="font-medium">{med.refills !== undefined ? med.refills : 'Not tracked'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Next Renewal</p>
                              <p className="font-medium">{med.renewalDate || 'Not set'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 rounded-lg"
                              onClick={() => handleEditClick(med)}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex-1 rounded-lg"
                              onClick={() => handleTakeNow(med)}
                            >
                              <Check className="h-4 w-4 mr-1" /> Take Now
                            </Button>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                            onClick={() => handleDeleteClick(med)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <DraggableMedicationList
                    medications={activeMedications}
                    onReorder={handleReorderActiveMedications}
                    renderItem={renderActiveMedicationCard}
                    droppableId="active-medications"
                  />
                </div>
              </TabsContent>
              
              {/* Inactive Medications */}
              <TabsContent value="inactive" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMedications
                    .filter(med => med.status === 'inactive')
                    .map((med) => (
                    <Card 
                      key={med.id} 
                      className="border-gray-200 dark:border-gray-800 shadow-glass-sm hover:shadow-glass transition-shadow overflow-hidden opacity-80"
                    >
                      <div className={cn("h-2", med.color || 'bg-gray-500')} />
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{med.name} {med.dosage}</CardTitle>
                            <CardDescription>{med.category}</CardDescription>
                          </div>
                          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 text-gray-500">
                            <X className="h-4 w-4" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Schedule (Previous)</p>
                            <p className="font-medium">{med.schedule}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                              <p className="font-medium">{med.startDate || 'Not recorded'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">End Date</p>
                              <p className="font-medium">{med.endDate || 'Not recorded'}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Reason</p>
                            <p className="font-medium">{med.reason || 'No reason provided'}</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 rounded-lg"
                              onClick={() => handleEditClick(med)}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                              onClick={() => handleDeleteClick(med)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <DraggableMedicationList
                    medications={inactiveMedications}
                    onReorder={handleReorderInactiveMedications}
                    renderItem={renderInactiveMedicationCard}
                    droppableId="inactive-medications"
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      


      {/* Add Medication Dialog */}
      <MedicationForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddSubmit}
        mode="add"
      />

      {/* Edit Medication Dialog */}
      {selectedMedication && (
        <MedicationForm
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedMedication(null);
          }}
          onSubmit={handleEditSubmit}
          initialData={{
            ...selectedMedication,
            // Convert string dates back to Date objects for the form
            startDate: selectedMedication.startDate
              ? new Date(selectedMedication.startDate)
              : undefined,
            renewalDate: selectedMedication.renewalDate
              ? new Date(selectedMedication.renewalDate)
              : undefined,
            endDate: selectedMedication.endDate
              ? new Date(selectedMedication.endDate)
              : undefined,
          }}
          mode="edit"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedMedication?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Medications;