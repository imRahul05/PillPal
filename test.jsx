
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



//

// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { format, isBefore, startOfDay } from 'date-fns';
// import * as z from 'zod';
// import { Calendar as CalendarIcon, Check, X } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Calendar } from '@/components/ui/calendar';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { cn } from '@/lib/utils';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { useToast } from '@/components/ui/use-toast';

// // Validation schema
// const formSchema = z.object({
//   name: z.string().min(2, { message: "Medication name must be at least 2 characters" }),
//   dosage: z.string().min(1, { message: "Dosage is required" }),
//   category: z.string().min(1, { message: "Category is required" }),
//   schedule: z.string().min(1, { message: "Schedule is required" }),
//   startDate: z.date({ required_error: "Start date is required" })
//     .refine(date => !isBefore(date, startOfDay(new Date())), {
//       message: "Start date cannot be in the past",
//     }),
//   status: z.enum(["active", "inactive"]),
//   time: z.string().optional(),
//   inventory: z.string().optional(),
//   refills: z.preprocess(
//     (val) => (val === '' ? undefined : Number(val)),
//     z.number().min(0).optional()
//   ),
//   renewalDate: z.date().optional()
//     .refine(date => !date || !isBefore(date, new Date()), {
//       message: "Renewal date cannot be in the past",
//     }),
//   endDate: z.date().optional()
//     .refine(date => !date || !isBefore(date, new Date()), {
//       message: "End date cannot be in the past",
//     }),
//   reason: z.string().optional(),
// });


// const MedicationForm = ({ isOpen, onClose, onSubmit, initialData, mode }) => {
//   const { toast } = useToast();
//    const today = new Date();
   
//   const defaultValues = {
//     name: '',
//     dosage: '',
//     category: '',
//     schedule: '',
//     status: 'active',
//     startDate: today,
//     ...initialData,
//   };

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues,
//   });

//   const handleSubmitForm = (data) => {
//      // Additional validation for time if it's today
//      if (data.startDate && 
//       format(data.startDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') && 
//       data.time) {
//     const [hours, minutes] = data.time.split(':').map(Number);
//     const selectedTime = new Date();
//     selectedTime.setHours(hours, minutes, 0, 0);
    
//     if (selectedTime < today) {
//       toast({
//         title: "Invalid Time",
//         description: "The selected time cannot be in the past",
//         variant: "destructive",
//       });
//       return;
//     }
//   }
  
//     onSubmit(data);
//     form.reset();
//   };

//   const categories = [
//     "Blood Pressure", 
//     "Diabetes", 
//     "Cholesterol", 
//     "Blood Thinner", 
//     "Thyroid", 
//     "Pain Relief", 
//     "Antibiotic", 
//     "Acid Reflux", 
//     "Asthma",
//     "Mental Health",
//     "Allergy",
//     "Other"
//   ];

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>{mode === 'add' ? 'Add New Medication' : 'Edit Medication'}</DialogTitle>
//         </DialogHeader>
        
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6 pt-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Medication Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="e.g. Lisinopril" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name="dosage"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Dosage</FormLabel>
//                     <FormControl>
//                       <Input placeholder="e.g. 10mg" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="category"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Category</FormLabel>
//                     <Select 
//                       onValueChange={field.onChange} 
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select a category" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {categories.map((category) => (
//                           <SelectItem key={category} value={category}>
//                             {category}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name="schedule"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Schedule</FormLabel>
//                     <FormControl>
//                       <Input placeholder="e.g. 1 pill, daily" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="startDate"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col">
//                     <FormLabel>Start Date</FormLabel>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <FormControl>
//                           <Button
//                             variant={"outline"}
//                             className={cn(
//                               "pl-3 text-left font-normal",
//                               !field.value && "text-muted-foreground"
//                             )}
//                           >
//                             {field.value ? (
//                               format(field.value, 'PPP')
//                             ) : (
//                               <span>Pick a date</span>
//                             )}
//                             <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                           </Button>
//                         </FormControl>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0" align="start">
//                         <Calendar
//                           mode="single"
//                           selected={field.value}
//                           onSelect={field.onChange}
//                           disabled={(date) => isBefore(date, startOfDay(today))}
//                           initialFocus
//                           className={cn("p-3 pointer-events-auto")}
//                         />
//                       </PopoverContent>
//                     </Popover>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name="time"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Time</FormLabel>
//                     <FormControl>
//                       <Input 
//                         type="time"
//                         {...field} 
//                         value={field.value || ''} 
//                       />
//                     </FormControl>
//                     <FormDescription className="text-xs">
//                       Set time for medication reminder
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="inventory"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Inventory</FormLabel>
//                     <FormControl>
//                       <Input placeholder="e.g. 30 pills left" {...field} value={field.value || ''} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name="refills"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Refills</FormLabel>
//                     <FormControl>
//                       <Input 
//                         type="number" 
//                         min="0"
//                         placeholder="e.g. 3" 
//                         {...field} 
//                         value={field.value === undefined ? '' : field.value} 
//                         onChange={(e) => field.onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <FormField
//               control={form.control}
//               name="renewalDate"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>Next Renewal Date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "pl-3 text-left font-normal",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value ? (
//                             format(field.value, 'PPP')
//                           ) : (
//                             <span>Pick a date</span>
//                           )}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         disabled={(date) => isBefore(date, today)}
//                         initialFocus
//                         className={cn("p-3 pointer-events-auto")}
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="status"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Status</FormLabel>
//                   <Select 
//                     onValueChange={field.onChange} 
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select status" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="active">Active</SelectItem>
//                       <SelectItem value="inactive">Inactive</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {form.watch('status') === 'inactive' && (
//               <>
//                 <FormField
//                   control={form.control}
//                   name="endDate"
//                   render={({ field }) => (
//                     <FormItem className="flex flex-col">
//                       <FormLabel>End Date</FormLabel>
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <FormControl>
//                             <Button
//                               variant={"outline"}
//                               className={cn(
//                                 "pl-3 text-left font-normal",
//                                 !field.value && "text-muted-foreground"
//                               )}
//                             >
//                               {field.value ? (
//                                 format(field.value, 'PPP')
//                               ) : (
//                                 <span>Pick a date</span>
//                               )}
//                               <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                             </Button>
//                           </FormControl>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-auto p-0" align="start">
//                           <Calendar
//                             mode="single"
//                             selected={field.value}
//                             onSelect={field.onChange}
//                             disabled={(date) => isBefore(date, today)}
//                             initialFocus
//                             className={cn("p-3 pointer-events-auto")}
//                           />
//                         </PopoverContent>
//                       </Popover>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="reason"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Reason for Discontinuation</FormLabel>
//                       <FormControl>
//                         <Textarea 
//                           placeholder="e.g. Completed treatment course, switched medications, etc."
//                           {...field}
//                           value={field.value || ''}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </>
//             )}

//             <div className="flex justify-end space-x-2 pt-4">
//               <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
//               <Button type="submit">{mode === 'add' ? 'Add Medication' : 'Save Changes'}</Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default MedicationForm;


//calendeer.jsx



// // src/components/ui/calendar.jsx
// import * as React from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { DayPicker } from "react-day-picker";

// import { cn } from "@/lib/utils";
// import { buttonVariants } from "@/components/ui/button";

// function Calendar({
//   className,
//   classNames,
//   showOutsideDays = true,
//   ...props
// }) {
//   return (
//     <DayPicker
//       showOutsideDays={showOutsideDays}
//       className={cn("p-2", className)} // Increased padding
//       classNames={{
//         months: "flex flex-col sm:flex-row gap-2",
//         month: "flex flex-col gap-4",
//         caption: "items-center w-full py-2 px-4", // Adjusted for better alignment
//         caption_label: "text-base font-medium", // Larger font for month/year
//         // nav: "flex items-center gap-1",
//         // nav_button: cn(
//         //   buttonVariants({ variant: "outline" }),
//         //   "size-8 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-full" // Larger buttons, rounded
//         // ),
//         nav_button_previous: "relative", // Removed absolute positioning
//         nav_button_next: "relative", // Removed absolute positioning
//         table: "w-full border-collapse",
//         head_row: "flex gap-1", // Added gap between day names
//         // head_cell: "text-muted-foreground rounded-md w-10 h-10 flex items-center justify-center font-normal text-sm", // Larger cells for day names
//         row: "flex w-full mt-1 gap-1", // Added gap between rows
//         // cell: cn(
//         //   "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
//         //   "[&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
//         //   props.mode === "range"
//         //     ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
//         //     : "[&:has([aria-selected])]:rounded-md"
//         // ),
//         day: cn(
//           buttonVariants({ variant: "ghost" }),
//           "size-10 p-0 font-normal aria-selected:opacity-100 rounded-full" // Larger day cells, rounded
//         ),
//         day_range_start:
//           "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
//         day_range_end:
//           "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
//         day_selected:
//           "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
//         day_today: "bg-accent text-accent-foreground font-semibold", // Highlight today
//         day_outside:
//           "day-outside text-muted-foreground opacity-50", // Faded outside days
//         day_disabled: "text-muted-foreground opacity-30", // More faded disabled days
//         day_range_middle:
//           "aria-selected:bg-accent aria-selected:text-accent-foreground",
//         day_hidden: "invisible",
//         ...classNames,
//       }}
//       components={{
//         IconLeft: ({ className, ...props }) => (
//           <ChevronLeft className={cn("size-5", className)} {...props} />
//         ),
//         IconRight: ({ className, ...props }) => (
//           <ChevronRight className={cn("size-5", className)} {...props} />
//         ),
//       }}
//       {...props}
//     />
//   );
// }

// export { Calendar };


//geminijs


// import { useToast } from "@/components/ui/use-toast";
// import process from "process";

// const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// const API_URL = import.meta.env.VITE_API_URL;


// export async function queryGemini(
//   prompt,
//   medications
// ){
//   try {
//     let content = prompt;
    
//     if (medications && medications.length > 0) {
//       content = `
// I need information about the following medications I'm taking:
// ${medications.map(med => `- ${med.name} (${med.dosage}) for ${med.category}, taken ${med.schedule}`).join('\n')}

// My question is: ${prompt}
//       `;
//     }

//     const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [
//               {
//                 text: content,
//               },
//             ],
//           },
//         ],
//         generationConfig: {
//           temperature: 0.4,
//           topK: 32,
//           topP: 0.95,
//           maxOutputTokens: 800,
//         },
//         safetySettings: [
//           {
//             category: "HARM_CATEGORY_HARASSMENT",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE",
//           },
//           {
//             category: "HARM_CATEGORY_HATE_SPEECH",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE",
//           },
//           {
//             category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE",
//           },
//           {
//             category: "HARM_CATEGORY_DANGEROUS_CONTENT",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE",
//           },
//         ],
//       }),
//     });

//     const data = await response.json();
    
//     if (data.error) {
//       console.error("Gemini API error:", data.error);
//       return {
//         text: "",
//         error: data.error.message || "Failed to get response from AI"
//       };
//     }

//     const text = data.candidates[0].content.parts[0].text;
//     return { text };
//   } catch (error) {
//     console.error("Error querying Gemini:", error);
//     return { 
//       text: "",
//       error: "Failed to connect to AI service. Please try again later."
//     };
//   }
// }

// export async function generateAdherenceInsights(
//   medications,
//   takenCount,
//   missedCount
// ) {
//   const adherenceRate = medications.length > 0 
//     ? Math.round((takenCount / (takenCount + missedCount)) * 100) || 0
//     : 0;
  
//   const prompt = `
// I'm using a medication tracking app called PillPal. Based on my current medication data:
// - Total active medications: ${medications.length}
// - Doses taken: ${takenCount}
// - Doses missed: ${missedCount}
// - Current adherence rate: ${adherenceRate}%

// ${medications.map(med => `- ${med.name} (${med.dosage}) for ${med.category}, taken ${med.schedule}`).join('\n')}

// Please analyze this data and provide 2-3 brief, personalized insights to help me improve my medication adherence. 
// Keep your response under 150 words and focus on practical advice.
//   `;
  
//   return queryGemini(prompt);
// }

// export async function generateInteractionWarnings(
//   medications
// ) {
//   if (medications.length < 2) {
//     return { text: "No potential interactions to analyze with only one medication." };
//   }
  
//   const prompt = `
// I'm taking the following medications:
// ${medications.map(med => `- ${med.name} (${med.dosage}) for ${med.category}`).join('\n')}

// Are there any common or serious interactions between these medications that I should be aware of? 
// Focus only on significant interactions and keep your response under 150 words. 
// If there are no significant known interactions, please state that briefly.
//   `;
  
//   return queryGemini(prompt);
// }

// export async function generateDosageOptimizations(
//   medications
// ) {
//   const prompt = `
// I'm taking the following medications with these schedules:
// ${medications.map(med => `- ${med.name} (${med.dosage}) for ${med.category}, currently taken ${med.schedule}${med.time ? ` at ${med.time}` : ''}`).join('\n')}

// Based on general medication best practices, can you provide brief suggestions for optimizing when I take these medications during the day?
// Focus on practical advice about timing related to meals, sleep, or other medications.
// Keep your response under 150 words and make it easily scannable.
//   `;
  
//   return queryGemini(prompt);
// }
