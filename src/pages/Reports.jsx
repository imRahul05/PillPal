
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, FileText, Calendar, Clock, Filter, RefreshCw,
  Loader, FileHeart, BarChart3
} from 'lucide-react';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useMedications } from '@/hooks/useMedications';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';


const Reports = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { medications } = useMedications();
  const { toast } = useToast();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState("7");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pdfGenerating, setPdfGenerating] = useState(false);
  
  useEffect(() => {
    const fetchHistory = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        const response = await fetch(`https://pillpal-84c9a-default-rtdb.firebaseio.com/users/${currentUser.uid}/medicationHistory.json`);
        const data = await response.json();
        
        if (data) {
          const historyList = Object.entries(data).map(([id, entry]) => ({
            id,
            ...(entry),
          }));
          
          historyList.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          
          setHistory(historyList);
        } else {
          setHistory([]);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
        toast({
          title: "Error",
          description: "Failed to load medication history",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [currentUser, toast]);
  
  const filteredHistory = history.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    const today = new Date();
    
    if (filterPeriod === "all") return true;
    
    const days = parseInt(filterPeriod);
    const startDate = subDays(today, days);
    
    return entryDate >= startDate;
  });
  
  const dayHistory = history.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return isWithinInterval(entryDate, {
      start: startOfDay(selectedDate),
      end: endOfDay(selectedDate)
    });
  });
  
  const calculateAdherence = (entries) => {
    if (entries.length === 0) return 0;
    
    const takenCount = entries.filter(entry => entry.action === "Taken").length;
    return Math.round((takenCount / entries.length) * 100);
  };
  
  const generatePDF = async () => {
    setPdfGenerating(true);
    
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text("Medication Report", 105, 15, { align: "center" });
      
      const periodText = filterPeriod === "all" 
        ? "All Time" 
        : `Last ${filterPeriod} days`;
      doc.text(`Report Period: ${periodText}`, 105, 25, { align: "center" });
      doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 105, 32, { align: "center" });
      
      const adherenceRate = calculateAdherence(filteredHistory);
      doc.text(`Adherence Rate: ${adherenceRate}%`, 105, 39, { align: "center" });
      
      const tableData = filteredHistory.map(entry => [
        format(new Date(entry.timestamp), 'PPP'),
        format(new Date(entry.timestamp), 'p'),
        entry.medicationName,
        entry.dosage,
        entry.action
      ]);
      
      autoTable(doc, {
        head: [['Date', 'Time', 'Medication', 'Dosage', 'Status']],
        body: tableData,
        startY: 45,
        headStyles: { fillColor: [41, 128, 185] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        theme: 'grid'
      });
      
      doc.save(`medication-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      toast({
        title: "Success",
        description: "Report downloaded successfully",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive",
      });
    } finally {
      setPdfGenerating(false);
    }
  };

  const renderStatCardSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <Card key={index}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  const renderHistorySkeletons = () => {
    return Array(5).fill(0).map((_, index) => (
      <div key={index} className="p-4 rounded-xl border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex flex-col items-end">
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    ));
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold">Medication Reports</h1>
                <p className="text-gray-500 dark:text-gray-400">Track your medication history and adherence</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter period" />
                  </SelectTrigger>
                  <SelectContent  className="bg-[hsl(var(--card))] border-[hsl(var(--border))] z-[60]">
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="14">Last 14 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={generatePDF}
                  className="bg-primary"
                  disabled={pdfGenerating || loading || filteredHistory.length === 0}
                >
                  {pdfGenerating ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Download PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {loading ? (
                renderStatCardSkeletons()
              ) : (
                <>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                          <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total Medications</p>
                          <p className="text-2xl font-semibold">{medications.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                          <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Adherence Rate</p>
                          <p className="text-2xl font-semibold">{calculateAdherence(filteredHistory)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-full">
                          <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total Records</p>
                          <p className="text-2xl font-semibold">{filteredHistory.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
            
            <Tabs defaultValue="history">
              <TabsList className="grid w-full grid-cols-1 mb-6" aria-label="Tabs">
                
                <TabsTrigger value="history">History Log</TabsTrigger>
                {/* <TabsTrigger value="calendar">Calendar View</TabsTrigger> */}
              </TabsList>
              
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Medication History</CardTitle>
                    <CardDescription>
                      Your medication log for the selected period
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {renderHistorySkeletons()}
                      </div>
                    ) : filteredHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <RefreshCw className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium mb-2">No history found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          You haven't logged any medication for this period.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredHistory.map((entry) => (
                          <div
                            key={entry.id}
                            className={cn(
                              "p-4 rounded-xl border",
                              entry.action === "Taken" 
                                ? "bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800/30" 
                                : "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/30"
                            )}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <h4 className="font-medium">{entry.medicationName}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {entry.dosage}
                                </p>
                              </div>
                              <div className="flex flex-col items-end">
                                <span 
                                  className={cn(
                                    "text-sm font-medium",
                                    entry.action === "Taken" 
                                      ? "text-green-600 dark:text-green-400" 
                                      : "text-red-600 dark:text-red-400"
                                  )}
                                >
                                  {entry.action}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {format(new Date(entry.timestamp), 'PPP')} at {format(new Date(entry.timestamp), 'p')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="calendar">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <Card className="md:col-span-5">
                    <CardHeader>
                      <CardTitle>Calendar</CardTitle>
                      <CardDescription>
                        Select a date to view medication history
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <Skeleton className="h-64 w-full rounded-md" />
                      ) : (
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          className="rounded-md border shadow-sm"
                        />
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="md:col-span-7">
                    <CardHeader>
                      <CardTitle>{format(selectedDate, 'PPP')}</CardTitle>
                      <CardDescription>
                        Medication log for selected date
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="space-y-4">
                          {renderHistorySkeletons().slice(0, 3)}
                        </div>
                      ) : dayHistory.length === 0 ? (
                        <div className="text-center py-8">
                          <Calendar className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                          <h3 className="text-lg font-medium mb-2">No entries for this date</h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            No medication was logged on this day.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {dayHistory.map((entry) => (
                            <div
                              key={entry.id}
                              className={cn(
                                "p-4 rounded-xl border",
                                entry.action === "Taken" 
                                  ? "bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800/30" 
                                  : "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/30"
                              )}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">{entry.medicationName}</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {entry.dosage}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span 
                                    className={cn(
                                      "text-sm font-medium",
                                      entry.action === "Taken" 
                                        ? "text-green-600 dark:text-green-400" 
                                        : "text-red-600 dark:text-red-400"
                                    )}
                                  >
                                    {entry.action}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {format(new Date(entry.timestamp), 'p')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Reports;