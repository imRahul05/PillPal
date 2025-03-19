
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   ArrowRight, Plus, Bell, Check, X, Calendar, Clock, 
//   Search, RefreshCw, AlertTriangle, Edit
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import Navbar from '@/components/Navbar';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { useToast } from '@/components/ui/use-toast';
// import { cn } from '../lib/utils';
// import { useAuth } from '@/contexts/AuthContext';
// import { useMedications } from '@/hooks/useMedications';
// import { useUserProfile } from '@/hooks/useUserProfile';
// import MedicationForm from '@/components/MedicationForm';


// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { currentUser } = useAuth();
//   const { toast } = useToast();
//   const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);
  
//   const { medications, loading: medsLoading, addMedication, markMedicationAsTaken, markMedicationAsMissed } = useMedications();
//   const { profile, loading: profileLoading } = useUserProfile();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   // Calculate stats
//   const activeMedications = medications.filter(med => med.status === 'active');
//   const takenToday = activeMedications.filter(med => med.taken).length;
//   const missedToday = activeMedications.filter(med => med.missed).length;
//   const upcomingToday = activeMedications.length - takenToday - missedToday;
  
//   // Medications that need renewal soon (within 30 days)
//   const upcomingRenewals = activeMedications.filter(med => {
//     if (!med.renewalDate) return false;
//     const renewalDate = new Date(med.renewalDate);
//     const today = new Date();
//     const diffTime = renewalDate.getTime() - today.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays <= 30 && diffDays > 0;
//   });

//   // Function to get status-specific styles
//   const getStatusStyles = (medication) => {
//     if (medication.taken) {
//       return {
//         bg: 'bg-green-50 dark:bg-green-900/20',
//         border: 'border-green-100 dark:border-green-800/30',
//         text: 'text-green-600 dark:text-green-400',
//         buttonBg: 'bg-green-500',
//         icon: Check
//       };
//     } else if (medication.missed) {
//       return {
//         bg: 'bg-red-50 dark:bg-red-900/20',
//         border: 'border-red-100 dark:border-red-800/30',
//         text: 'text-red-600 dark:text-red-400',
//         buttonBg: 'bg-red-500',
//         icon: X
//       };
//     } else {
//       return {
//         bg: 'bg-blue-50 dark:bg-blue-900/20',
//         border: 'border-blue-100 dark:border-blue-800/30',
//         text: 'text-blue-600 dark:text-blue-400',
//         buttonBg: 'bg-blue-500',
//         icon: Clock
//       };
//     }
//   };

//   const handleAddMedication = async (data) => {
//     // Format dates properly for storage
//     const formattedData = {
//       ...data,
//       startDate: data.startDate ? data.startDate.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       }) : '',
//       renewalDate: data.renewalDate ? data.renewalDate.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       }) : '',
//       endDate: data.endDate ? data.endDate.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       }) : '',
//       color: getColorForCategory(data.category),
//       taken: false,
//       missed: false
//     };
    
//     await addMedication(formattedData);
//     setIsAddMedicationOpen(false);
//   };

//   const getColorForCategory = (category) => {
//     const colorMap = {
//       'Blood Pressure': 'bg-blue-500',
//       'Diabetes': 'bg-green-500',
//       'Cholesterol': 'bg-purple-500',
//       'Blood Thinner': 'bg-red-500',
//       'Thyroid': 'bg-amber-500',
//       'Pain Relief': 'bg-pink-500',
//       'Antibiotic': 'bg-cyan-500',
//       'Acid Reflux': 'bg-orange-500',
//       'Asthma': 'bg-teal-500',
//       'Mental Health': 'bg-indigo-500',
//       'Allergy': 'bg-yellow-500',
//     };
    
//     return colorMap[category] || 'bg-gray-500';
//   };

//   const getInitials = (name) => {
//     return name
//       .split(' ')
//       .map(n => n[0])
//       .join('')
//       .toUpperCase();
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
      
//       <main className="flex-1 pt-20 pb-12">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//             {/* Sidebar */}
//             <div className="lg:col-span-3">
//               <div className="sticky top-24 space-y-6">
//                 {/* User Profile Card */}
//                 <Card className="overflow-hidden border-gray-200 dark:border-gray-800 shadow-glass-sm">
//                   <div className="bg-primary/10 h-24 relative"></div>
//                   <div className="px-6 pb-6 pt-0 -mt-12">
//                     {currentUser ? (
//                       <>
//                         <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 mb-4">
//                           <AvatarFallback className="text-lg">
//                             {profile?.name ? getInitials(profile.name) : currentUser.email?.charAt(0).toUpperCase()}
//                           </AvatarFallback>
//                         </Avatar>
//                         <h3 className="font-medium text-lg mb-1">Welcome back, {profile?.name?.split(' ')[0] || 'User'}!</h3>
//                         <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{currentUser.email}</p>
//                         <Button className="w-full rounded-lg" onClick={() => navigate('/profile')}>
//                           View Profile
//                         </Button>
//                       </>
//                     ) : (
//                       <>
//                         <div className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 mb-4"></div>
//                         <h3 className="font-medium text-lg mb-1">Welcome back!</h3>
//                         <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Sign in to access your medications</p>
//                         <Button className="w-full rounded-lg" onClick={() => navigate('/login')}>Sign In</Button>
//                       </>
//                     )}
//                   </div>
//                 </Card>
                
//                 {/* Quick Stats */}
//                 <Card className="border-gray-200 dark:border-gray-800 shadow-glass-sm">
//                   <CardHeader>
//                     <CardTitle className="text-base">Quick Stats</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-500 dark:text-gray-400">Adherence Rate</span>
//                       <span className="text-sm font-medium">
//                         {activeMedications.length === 0 ? 'N/A' : 
//                           `${Math.round((takenToday / (takenToday + missedToday || 1)) * 100)}%`}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-500 dark:text-gray-400">Active Medications</span>
//                       <span className="text-sm font-medium">{activeMedications.length}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-500 dark:text-gray-400">Upcoming Renewals</span>
//                       <span className="text-sm font-medium text-amber-500">{upcomingRenewals.length}</span>
//                     </div>
//                   </CardContent>
//                 </Card>
                
//                 {/* Navigation */}
//                 <Card className="border-gray-200 dark:border-gray-800 shadow-glass-sm">
//                   <CardContent className="p-2">
//                     <div className="space-y-1">
//                       {[
//                         { name: 'Dashboard', icon: Bell, active: true, path: '/dashboard' },
//                         { name: 'All Medications', icon: Search, path: '/medications' },
//                         { name: 'Schedule', icon: Calendar, path: '/dashboard' },
//                         { name: 'Reports', icon: RefreshCw, path: '/dashboard' }
//                       ].map((item) => (
//                         <Button
//                           key={item.name}
//                           variant={item.active ? "secondary" : "ghost"}
//                           className={cn(
//                             "w-full justify-start text-left h-10 rounded-lg",
//                             item.active ? "font-medium" : "font-normal"
//                           )}
//                           onClick={() => navigate(item.path)}
//                         >
//                           <item.icon className="mr-2 h-4 w-4" />
//                           {item.name}
//                         </Button>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
            
//             {/* Main Content */}
//             <div className="lg:col-span-9 space-y-6">
//               {/* Header */}
//               <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
//                 <div>
//                   <h1 className="text-2xl font-semibold">Medications Dashboard</h1>
//                   <p className="text-gray-500 dark:text-gray-400">Track and manage your medications</p>
//                 </div>
//                 <Button 
//                   className="md:w-auto w-full rounded-lg shadow-glass-sm"
//                   onClick={() => setIsAddMedicationOpen(true)}
//                 >
//                   <Plus className="mr-2 h-4 w-4" /> Add Medication
//                 </Button>
//               </div>
              
//               {/* Status Cards */}
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 {[
//                   { name: "Today's Medications", count: `${takenToday}/${activeMedications.length}`, color: "bg-blue-500", icon: Calendar },
//                   { name: "Taken Today", count: takenToday.toString(), color: "bg-green-500", icon: Check },
//                   { name: "Missed", count: missedToday.toString(), color: "bg-red-500", icon: X }
//                 ].map((stat, index) => (
//                   <Card key={index} className="border-gray-200 dark:border-gray-800 shadow-glass-sm">
//                     <CardContent className="p-6 flex items-center gap-4">
//                       <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white ${stat.color}`}>
//                         <stat.icon className="h-6 w-6" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500 dark:text-gray-400">{stat.name}</p>
//                         <p className="text-2xl font-semibold">{stat.count}</p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
              
//               {/* Medication List */}
//               <Card className="border-gray-200 dark:border-gray-800 shadow-glass-sm">
//                 <CardHeader>
//                   <CardTitle>Today's Medications</CardTitle>
//                   <CardDescription>Your medication schedule for today</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {medsLoading ? (
//                     <div className="flex justify-center items-center h-40">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//                     </div>
//                   ) : activeMedications.length === 0 ? (
//                     <div className="text-center py-8">
//                       <Clock className="h-10 w-10 text-gray-400 mx-auto mb-3" />
//                       <h3 className="text-lg font-medium mb-2">No medications scheduled</h3>
//                       <p className="text-gray-500 dark:text-gray-400 mb-4">
//                         You haven't added any medications to track yet.
//                       </p>
//                       <Button
//                         onClick={() => setIsAddMedicationOpen(true)}
//                         className="mx-auto"
//                       >
//                         <Plus className="mr-2 h-4 w-4" /> Add Medication
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="space-y-3">
//                       {activeMedications.map((med) => {
//                         const styles = getStatusStyles(med);
//                         return (
//                           <div 
//                             key={med.id}
//                             className={cn(
//                               "p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-4 transition-all",
//                               styles.bg, styles.border
//                             )}
//                           >
//                             <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", styles.buttonBg, "text-white")}>
//                               <styles.icon className="h-5 w-5" />
//                             </div>
//                             <div className="flex-1">
//                               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//                                 <div>
//                                   <h4 className="font-medium">{med.name} {med.dosage}</h4>
//                                   <p className="text-sm text-gray-500 dark:text-gray-400">{med.schedule}</p>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                   <span className={cn("text-sm font-medium", styles.text)}>{med.time || 'Anytime'}</span>
//                                   <div className="flex space-x-1">
//                                     {!med.taken && !med.missed && (
//                                       <>
//                                         <Button 
//                                           size="sm" 
//                                           variant="outline" 
//                                           className="h-8 rounded-lg"
//                                           onClick={() => markMedicationAsMissed(med.id)}
//                                         >
//                                           Skip
//                                         </Button>
//                                         <Button 
//                                           size="sm" 
//                                           className="h-8 rounded-lg"
//                                           onClick={() => markMedicationAsTaken(med.id)}
//                                         >
//                                           Take
//                                         </Button>
//                                       </>
//                                     )}
//                                     {med.taken && (
//                                       <Button 
//                                         size="sm" 
//                                         variant="outline" 
//                                         className="h-8 rounded-lg"
//                                         onClick={() => markMedicationAsMissed(med.id)}
//                                       >
//                                         Mark Missed
//                                       </Button>
//                                     )}
//                                     {med.missed && (
//                                       <Button 
//                                         size="sm" 
//                                         variant="outline" 
//                                         className="h-8 rounded-lg"
//                                         onClick={() => markMedicationAsTaken(med.id)}
//                                       >
//                                         Take Late
//                                       </Button>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
              
//               {/* Upcoming Renewals */}
//               <Card className="border-gray-200 dark:border-gray-800 shadow-glass-sm">
//                 <CardHeader>
//                   <CardTitle>Upcoming Prescription Renewals</CardTitle>
//                   <CardDescription>Prescriptions that need to be renewed soon</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {upcomingRenewals.length === 0 ? (
//                     <div className="text-center py-6">
//                       <Check className="h-10 w-10 text-green-500 mx-auto mb-3" />
//                       <h3 className="text-lg font-medium mb-2">All prescriptions are up to date</h3>
//                       <p className="text-gray-500 dark:text-gray-400">
//                         You don't have any prescriptions that need renewal soon.
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="space-y-3">
//                       {upcomingRenewals.map((rx) => {
//                         const renewalDate = new Date(rx.renewalDate || '');
//                         const today = new Date();
//                         const diffTime = renewalDate.getTime() - today.getTime();
//                         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        
//                         return (
//                           <div 
//                             key={rx.id}
//                             className="p-4 rounded-xl border border-amber-100 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-900/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
//                           >
//                             <div>
//                               <h4 className="font-medium">{rx.name} {rx.dosage}</h4>
//                               <p className="text-sm text-gray-500 dark:text-gray-400">Category: {rx.category}</p>
//                             </div>
//                             <div className="flex items-center gap-3">
//                               <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
//                                 Expires in {diffDays} {diffDays === 1 ? 'day' : 'days'}
//                               </span>
//                               <Button 
//                                 size="sm" 
//                                 className="rounded-lg"
//                                 onClick={() => navigate('/medications')}
//                               >
//                                 Renew
//                               </Button>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </main>
      
//       {/* Add Medication Dialog */}
//       <MedicationForm
//         isOpen={isAddMedicationOpen}
//         onClose={() => setIsAddMedicationOpen(false)}
//         onSubmit={handleAddMedication}
//         mode="add"
//       />
//     </div>
//   );
// };

// export default Dashboard;