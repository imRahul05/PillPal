// src/components/MedicationForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, isBefore, startOfDay } from 'date-fns';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { DatePicker } from '@/components/ui/DatePicker'; // Import the new DatePicker

// Validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Medication name must be at least 2 characters" }),
  dosage: z.string().min(1, { message: "Dosage is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  schedule: z.string().min(1, { message: "Schedule is required" }),
  startDate: z.date({ required_error: "Start date is required" })
    .refine(date => !isBefore(date, startOfDay(new Date())), {
      message: "Start date cannot be in the past",
    }),
  status: z.enum(["active", "inactive"]),
  time: z.string().min(1, { message: "Time is required for scheduling reminders" }),
  inventory: z.string().optional(),
  refills: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  renewalDate: z.date().optional()
    .refine(date => !date || !isBefore(date, new Date()), {
      message: "Renewal date cannot be in the past",
    }),
  endDate: z.date({ required_error: "End date is required" })
    .refine(date => !isBefore(date, new Date()), {
      message: "End date cannot be in the past",
    }),
  reason: z.string().optional(),
});

const MedicationForm = ({ isOpen, onClose, onSubmit, initialData, mode }) => {
  const { toast } = useToast();
  const today = new Date();
  
  // Calculate default end date (30 days from today)
  const defaultEndDate = new Date();
  defaultEndDate.setDate(today.getDate() + 30);
  
  // Set default values
  const defaultValues = {
    name: '',
    dosage: '',
    category: '',
    schedule: '',
    status: 'active',
    startDate: today,
    endDate: defaultEndDate,
    ...initialData,
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmitForm = (data) => {
    // Additional validation for time if it's today
    if (data.startDate && 
        format(data.startDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') && 
        data.time) {
      const [hours, minutes] = data.time.split(':').map(Number);
      const selectedTime = new Date();
      selectedTime.setHours(hours, minutes, 0, 0);
      
      if (selectedTime < today) {
        toast({
          title: "Invalid Time",
          description: "The selected time cannot be in the past",
          variant: "destructive",
        });
        return;
      }
    }
    
    onSubmit(data);
    form.reset();
  };

  // List of medication categories
  const categories = [
    "Blood Pressure", 
    "Diabetes", 
    "Cholesterol", 
    "Blood Thinner", 
    "Thyroid", 
    "Pain Relief", 
    "Antibiotic", 
    "Acid Reflux", 
    "Asthma",
    "Mental Health",
    "Allergy",
    "Other"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-[hsl(var(--card))] text-[hsl(var(--foreground))]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Medication' : 'Edit Medication'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medication Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Lisinopril" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dosage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dosage</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 10mg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))] z-[60]">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="schedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 1 pill, daily" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => isBefore(date, startOfDay(today))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="time"
                        {...field} 
                        value={field.value || ''} 
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Set time for medication reminder
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => isBefore(date, today)}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Medicine will automatically be removed after this date
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="inventory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inventory</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 30 pills left" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="refills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Refills</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="e.g. 3" 
                        {...field} 
                        value={field.value === undefined ? '' : field.value} 
                        onChange={(e) => field.onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="renewalDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Next Renewal Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => isBefore(date, today)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))] z-[60]">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('status') === 'inactive' && (
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Discontinuation</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g. Completed treatment course, switched medications, etc."
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{mode === 'add' ? 'Add Medication' : 'Save Changes'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationForm;