import { useState, useEffect } from "react";
import {
  Send,
  VenetianMask,
  PanelRightOpen,
  PanelRightClose,
  RefreshCw,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useMedications } from "@/hooks/useMedications";
import {
  loadAllInsights,
  loadInsights,
  loadInteractions,
  loadOptimizations,
  handleAIQuery,
} from "@/lib/Aiassistant";

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarTab, setSidebarTab] = useState("insights");
  const [insights, setInsights] = useState({ text: "", loading: true });
  const [interactions, setInteractions] = useState({ text: "", loading: true });
  const [optimizations, setOptimizations] = useState({ text: "", loading: true });

  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { medications, loading: medsLoading } = useMedications();

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content:
            "Hello! I'm your PillPal AI Assistant. I can help answer questions about your medications, provide insights on your medication regimen, or offer general health advice. How can I assist you today?",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (!medsLoading && medications.length > 0) {
      loadAllInsightsData();
    }
  }, [medsLoading, medications]);

  const loadAllInsightsData = async () => {
    const {
      insights: insightsData,
      interactions: interactionsData,
      optimizations: optimizationsData,
    } = await loadAllInsights(medications);

    setInsights(insightsData);
    setInteractions(interactionsData);
    setOptimizations(optimizationsData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await handleAIQuery(inputValue, medications);
      if (response.error) {
        toast({
          title: "Error",
          description: "Failed to get AI response",
          variant: "destructive",
        });
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: response.message,
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshInsights = async () => {
    if (sidebarTab === "insights") {
      const data = await loadInsights(medications);
      setInsights(data);
    } else if (sidebarTab === "interactions") {
      const data = await loadInteractions(medications);
      setInteractions(data);
    } else if (sidebarTab === "optimizations") {
      const data = await loadOptimizations(medications);
      setOptimizations(data);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div
        className="bg-orange-100 border-l-4 border-yellow-500 text-black-700 p-4 mt-[42px]"
        role="alert"
      >
        <p className="font-bold">Not responsive</p>
        <p>
          This feature is currently under development. Works but some issue is on design, working on that and will fix ASAP.
        </p>
      </div>

      <main className="flex-1 flex flex-col md:flex-row pt-20 pb-12">
        {/* Main Content */}
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 md:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold flex items-center">
                <VenetianMask className="mr-2 h-6 w-6 text-primary" />
                AI Medication Assistant
              </h1>
              <p className="text-gray-500 text-sm">
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

          {/* Chat UI */}
          <div className="bg-card border rounded-lg flex flex-col h-[calc(100vh-240px)] overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3 rounded-xl p-4",
                    message.role === "assistant"
                      ? "bg-muted/50"
                      : "bg-primary-foreground"
                  )}
                >
                  {message.role === "assistant" ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="h-8 w-8 bg-primary text-white">
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1">
                    <div className="font-medium mb-1">
                      {message.role === "assistant" ? "PillPal AI" : "You"}
                    </div>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-3 rounded-xl p-4 bg-muted/50">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://img.icons8.com/?size=100&id=YOfa3pzgqoin&format=png&color=000000"
                      alt="AI"
                    />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2 mt-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[350px]" />
                    <Skeleton className="h-4 w-[300px]" />
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Input */}
            <div className="p-4 border-t bg-background sticky bottom-0 z-10">
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

        {/* Sidebar */}
        <div
          className={cn(
            "md:w-80 w-full max-w-[320px] border-l bg-card transition-transform duration-300 ease-in-out overflow-y-auto",
            showSidebar
              ? "translate-x-0"
              : "translate-x-full md:translate-x-0 md:w-0"
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
                  (sidebarTab === "insights" && insights.loading) ||
                  (sidebarTab === "interactions" && interactions.loading) ||
                  (sidebarTab === "optimizations" && optimizations.loading)
                }
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <Tabs
              value={sidebarTab}
              onValueChange={setSidebarTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="interactions">Interactions</TabsTrigger>
                <TabsTrigger value="optimizations">Timing</TabsTrigger>
              </TabsList>

              {/* Insights Tab */}
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

              {/* Interactions Tab */}
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

              {/* Optimizations Tab */}
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
              <p className="text-xs text-gray-500">
                Note: AI insights are generated based on your medication data and general medical knowledge. Always consult your healthcare provider before making any changes to your medication regimen.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIAssistant;
