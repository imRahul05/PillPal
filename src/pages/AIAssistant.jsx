
import { useState, useEffect } from 'react';
import { Send, VenetianMask, PanelRightOpen, PanelRightClose, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useMedications } from '@/hooks/useMedications';
import { queryGemini, generateAdherenceInsights, generateInteractionWarnings, generateDosageOptimizations } from '@/lib/gemini';

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarTab, setSidebarTab] = useState('insights');
  const [insights, setInsights] = useState({
    text: '', loading: true
  });
  const [interactions, setInteractions] = useState({
    text: '', loading: true
  });
  const [optimizations, setOptimizations] = useState({
    text: '', loading: true
  });

  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { medications, loading: medsLoading } = useMedications();

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          content: "Hello! I'm your PillPal AI Assistant. I can help answer questions about your medications, provide insights on your medication regimen, or offer general health advice. How can I assist you today?",
          role: 'assistant',
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Load AI insights when medications are available
  useEffect(() => {
    if (!medsLoading && medications.length > 0) {
      loadAllInsights();
    }
  }, [medsLoading, medications]);

  const loadAllInsights = async () => {
    const medicationsForAI = medications.filter(med => med.status === 'active').map(med => ({
      name: med.name,
      dosage: med.dosage,
      category: med.category,
      schedule: med.schedule,
      startDate: med.startDate,
      renewalDate: med.renewalDate,
      endDate: med.endDate,
      time: med.time,
      reason: med.reason
    }));

    const takenCount = medications.filter(med => med.taken).length;
    const missedCount = medications.filter(med => med.missed).length;

    loadInsights(medicationsForAI, takenCount, missedCount);
    loadInteractions(medicationsForAI);
    loadOptimizations(medicationsForAI);
  };

  const loadInsights = async (medicationsForAI, takenCount, missedCount) => {
    setInsights({ text: '', loading: true });
    try {
      const response = await generateAdherenceInsights(medicationsForAI, takenCount, missedCount);
      setInsights({ 
        text: response.error ? 'Unable to generate insights at this time. Please try again later.' : response.text, 
        loading: false 
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights({ 
        text: 'Unable to generate insights at this time. Please try again later.', 
        loading: false 
      });
    }
  };

  const loadInteractions = async (medicationsForAI) => {
    setInteractions({ text: '', loading: true });
    try {
      const response = await generateInteractionWarnings(medicationsForAI);
      setInteractions({ 
        text: response.error ? 'Unable to analyze medication interactions at this time. Please try again later.' : response.text, 
        loading: false 
      });
    } catch (error) {
      console.error('Error generating interaction warnings:', error);
      setInteractions({ 
        text: 'Unable to analyze medication interactions at this time. Please try again later.', 
        loading: false 
      });
    }
  };

  const loadOptimizations = async (medicationsForAI) => {
    setOptimizations({ text: '', loading: true });
    try {
      const response = await generateDosageOptimizations(medicationsForAI);
      setOptimizations({ 
        text: response.error ? 'Unable to generate optimization suggestions at this time. Please try again later.' : response.text, 
        loading: false 
      });
    } catch (error) {
      console.error('Error generating dosage optimizations:', error);
      setOptimizations({ 
        text: 'Unable to generate optimization suggestions at this time. Please try again later.', 
        loading: false 
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Format active medications for context
      const medicationsForAI = medications
        .filter(med => med.status === 'active')
        .map(med => ({
          name: med.name,
          dosage: med.dosage,
          category: med.category,
          schedule: med.schedule,
          startDate: med.startDate,
          renewalDate: med.renewalDate,
          endDate: med.endDate,
          time: med.time,
          reason: med.reason
        }));

      const response = await queryGemini(userMessage.content, medicationsForAI);

      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
        
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.",
            role: 'assistant',
            timestamp: new Date(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: response.text,
            role: 'assistant',
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error querying Gemini:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "I'm sorry, I encountered an error while processing your question. Please try again.",
          role: 'assistant',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshInsights = () => {
    const activeMedications = medications.filter(med => med.status === 'active').map(med => ({
      name: med.name,
      dosage: med.dosage,
      category: med.category,
      schedule: med.schedule,
      startDate: med.startDate,
      renewalDate: med.renewalDate,
      endDate: med.endDate,
      time: med.time,
      reason: med.reason
    }));

    const takenCount = medications.filter(med => med.taken).length;
    const missedCount = medications.filter(med => med.missed).length;

    if (sidebarTab === 'insights') {
      loadInsights(activeMedications, takenCount, missedCount);
    } else if (sidebarTab === 'interactions') {
      loadInteractions(activeMedications);
    } else if (sidebarTab === 'optimizations') {
      loadOptimizations(activeMedications);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-red-100 border-l-4 border-yellow-500 text-red-700 p-4 mt-10.5" role="alert">
        <p className="font-bold">Under Construction</p>
        <p>This feature is currently under development. Please check back later for updates.</p>
      </div>
      <main className="flex-1 pt-20 pb-12 flex">
        
        <div className="flex flex-1 overflow-hidden">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            <div className="px-4 md:px-6 flex-1 max-w-5xl mx-auto w-full">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-semibold flex items-center">
                    <VenetianMask className="mr-2 h-6 w-6 text-primary" /> 
                    AI Medication Assistant
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    Ask questions about your medications and get AI-powered insights
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleSidebar}
                  className="h-10 w-10 rounded-full md:hidden"
                >
                  {showSidebar ? <PanelRightClose /> : <PanelRightOpen />}
                </Button>
              </div>
              
              <div className="bg-card border rounded-lg h-[calc(100vh-240px)] flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex items-start gap-3 rounded-lg p-4",
                        message.role === 'assistant'
                          ? "bg-muted/50"
                          : "bg-primary-foreground"
                      )}
                    >
                      {message.role === 'assistant' ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" alt="AI" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1">
                        <div className="font-medium mb-1">
                          {message.role === 'assistant' ? 'PillPal AI' : 'You'}
                        </div>
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex items-start gap-3 rounded-lg p-4 bg-muted/50">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="AI" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[350px]" />
                        <Skeleton className="h-4 w-[300px]" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t">
                  <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <Input
                      placeholder="Ask about your medications..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Sidebar for AI Insights */}
          <div 
            className={cn(
              "w-80 border-l bg-card transition-all duration-300 ease-in-out overflow-hidden",
              showSidebar ? "translate-x-0" : "translate-x-full md:translate-x-0 md:w-0"
            )}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">AI Insights</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshInsights}
                  disabled={
                    (sidebarTab === 'insights' && insights.loading) ||
                    (sidebarTab === 'interactions' && interactions.loading) ||
                    (sidebarTab === 'optimizations' && optimizations.loading)
                  }
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              
              <Tabs value={sidebarTab} onValueChange={setSidebarTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="interactions">Interactions</TabsTrigger>
                  <TabsTrigger value="optimizations">Timing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="insights" className="mt-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Adherence Insights</CardTitle>
                      <CardDescription className="text-xs">
                        Based on your medication patterns
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-2 text-sm">
                      {insights.loading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-[65%]" />
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{insights.text}</div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="interactions" className="mt-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Potential Interactions</CardTitle>
                      <CardDescription className="text-xs">
                        Analysis of your medication combinations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-2 text-sm">
                      {interactions.loading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-[65%]" />
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{interactions.text}</div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="optimizations" className="mt-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Timing Suggestions</CardTitle>
                      <CardDescription className="text-xs">
                        Optimize when you take your medications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-2 text-sm">
                      {optimizations.loading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-[65%]" />
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{optimizations.text}</div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Note: AI insights are generated based on your medication data and general medical knowledge. Always consult your healthcare provider before making any changes to your medication regimen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    
    </div>
  );
};

export default AIAssistant;