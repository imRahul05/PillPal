import { useState, useEffect, useRef } from "react";
import {
  Send,
  PanelRightOpen,
  PanelRightClose,
  RefreshCw,
  Bot,
  User,
  BrainCircuit
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMedications } from "@/hooks/useMedications";
import {
  loadAllInsights,
  loadInsights,
  loadInteractions,
  loadOptimizations,
  handleAIQuery,
} from "@/lib/Aiassistant";
import ReactMarkdown from "react-markdown";

const MarkdownComponents = {
  p: (props) => (
    <p className="mb-3 last:mb-0 leading-relaxed text-[15px]" {...props} />
  ),
  ul: (props) => (
    <ul className="list-disc ml-5 mb-3 space-y-1" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal ml-5 mb-3 space-y-1" {...props} />
  ),
  li: (props) => (
    <li className="leading-relaxed pl-1" {...props} />
  ),
  strong: (props) => (
    <strong className="font-semibold" {...props} />
  ),
};

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarTab, setSidebarTab] = useState("insights");

  const [insights, setInsights] = useState({ text: "", loading: true });
  const [interactions, setInteractions] = useState({ text: "", loading: true });
  const [optimizations, setOptimizations] = useState({ text: "", loading: true });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { toast } = useToast();
  const { medications, loading: medsLoading } = useMedications();

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setShowSidebar(false);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content:
            "Hello! I'm your AI Medication Assistant. How can I help you today?",
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
    const data = await loadAllInsights(medications);
    setInsights(data.insights);
    setInteractions(data.interactions);
    setOptimizations(data.optimizations);
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

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: response?.message || "Sorry, I couldn't process that.",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const refreshInsights = async () => {
    if (sidebarTab === "insights") {
      setInsights((p) => ({ ...p, loading: true }));
      setInsights(await loadInsights(medications));
    } else if (sidebarTab === "interactions") {
      setInteractions((p) => ({ ...p, loading: true }));
      setInteractions(await loadInteractions(medications));
    } else {
      setOptimizations((p) => ({ ...p, loading: true }));
      setOptimizations(await loadOptimizations(medications));
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-[64px]">
        <div className="h-full grid lg:grid-cols-[1fr_380px]">

          {/* Chat Area */}
          <div className="flex flex-col border-r">
            
            {/* Header */}
            <div className="border-b bg-card">
              <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                  <div>
                    <h1 className="font-semibold text-lg">Medication Assistant</h1>
                    <p className="text-sm text-muted-foreground">
                      AI-powered medication insights
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="lg:hidden"
                >
                  {showSidebar ? <PanelRightClose /> : <PanelRightOpen />}
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="max-w-5xl mx-auto space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" && "flex-row-reverse"
                    )}
                  >
                    <Avatar className="h-9 w-9 flex items-center justify-center border">
                      {message.role === "assistant" ? (
                        <Bot className="h-5 w-5 text-primary" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </Avatar>

                    <div className="max-w-[75%]">
                      <div
                        className={cn(
                          "px-4 py-3 rounded-2xl text-[15px]",
                          message.role === "assistant"
                            ? "bg-card border"
                            : "bg-primary text-primary-foreground"
                        )}
                      >
                        {message.role === "assistant" ? (
                          <ReactMarkdown components={MarkdownComponents}>
                            {message.content}
                          </ReactMarkdown>
                        ) : (
                          message.content
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <Avatar className="h-9 w-9 border">
                      <Bot className="h-5 w-5 text-primary" />
                    </Avatar>
                    <Skeleton className="h-16 w-64 rounded-xl" />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="border-t bg-card">
              <div className="max-w-5xl mx-auto p-4">
                <form onSubmit={handleSubmit} className="relative">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about medications..."
                    className="pr-12 h-12 rounded-xl"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !inputValue.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          {showSidebar && (
            <div className="hidden lg:flex flex-col bg-card border-l">
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">AI Insights</h3>
                </div>
                <Button size="icon" variant="ghost" onClick={refreshInsights}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <Tabs
                value={sidebarTab}
                onValueChange={setSidebarTab}
                className="flex-1 flex flex-col"
              >
                <TabsList className="grid grid-cols-3 m-4">
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="interactions">Interactions</TabsTrigger>
                  <TabsTrigger value="optimizations">Timing</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto px-4 pb-4">
                  <TabsContent value="insights">
                    <Card>
                      <CardContent className="p-4 text-sm">
                        {insights.loading ? (
                          <Skeleton className="h-20 w-full" />
                        ) : (
                          <ReactMarkdown>
                            {insights.text}
                          </ReactMarkdown>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="interactions">
                    <Card>
                      <CardContent className="p-4 text-sm">
                        {interactions.loading ? (
                          <Skeleton className="h-20 w-full" />
                        ) : (
                          <ReactMarkdown>
                            {interactions.text}
                          </ReactMarkdown>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="optimizations">
                    <Card>
                      <CardContent className="p-4 text-sm">
                        {optimizations.loading ? (
                          <Skeleton className="h-20 w-full" />
                        ) : (
                          <ReactMarkdown>
                            {optimizations.text}
                          </ReactMarkdown>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AIAssistant;