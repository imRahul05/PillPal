import { useState, useEffect } from 'react';
import { BrainCircuit, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useMedications } from '@/hooks/useMedications';
import { generateAdherenceInsights } from '@/lib/gemini';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const MarkdownComponents = {
  p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc ml-5 mb-2 space-y-1" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal ml-5 mb-2 space-y-1" {...props} />,
  li: ({ node, ...props }) => <li className="leading-relaxed pl-1" {...props} />,
  h1: ({ node, ...props }) => <h1 className="text-base font-bold mb-2 mt-3 text-foreground" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-[15px] font-semibold mb-2 mt-3 text-foreground" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-sm font-medium mb-1 mt-2 text-foreground" {...props} />,
  a: ({ node, ...props }) => <a className="text-primary hover:underline font-medium" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-semibold text-foreground dark:text-gray-100" {...props} />,
  code: ({ node, inline, ...props }) => 
    inline 
      ? <code className="bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded text-xs font-mono text-primary" {...props} />
      : <div className="bg-black/5 dark:bg-white/5 p-2 mb-2 rounded-md overflow-x-auto"><code className="text-xs font-mono" {...props} /></div>,
  blockquote: ({ node, ...props }) => <blockquote className="border-l-3 border-primary/40 pl-3 italic text-muted-foreground my-2" {...props} />
};

const AIInsightsCard = () => {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(true);
  const { medications } = useMedications();
  const navigate = useNavigate();

  useEffect(() => {
    if (medications.length > 0) {
      loadInsights();
    } else {
      setInsights('Add medications to receive AI-powered insights about your medication routine.');
      setLoading(false);
    }
  }, [medications]);

  const loadInsights = async () => {
    setLoading(true);
    
    const activeMedications = medications
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
      
    const takenCount = medications.filter(med => med.taken).length;
    const missedCount = medications.filter(med => med.missed).length;
    
    if (activeMedications.length === 0) {
      setInsights('Add active medications to receive AI-powered insights about your medication routine.');
      setLoading(false);
      return;
    }

    try {
      const response = await generateAdherenceInsights(activeMedications, takenCount, missedCount);
      setInsights(response.error 
        ? 'Unable to generate insights at this time. Please try again later.' 
        : response.text
      );
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights('Unable to generate insights at this time. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3 bg-muted/30 border-b flex-shrink-0">
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-lg mr-3">
              <BrainCircuit className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base md:text-lg">AI Medication Insights</CardTitle>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-muted-foreground/10" 
            onClick={loadInsights}
            disabled={loading}
            title="Refresh Insights"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin text-muted-foreground")} />
          </Button>
        </div>
        <CardDescription className="mt-2 text-xs md:text-sm">
          Personalized recommendations based on your medication patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 md:p-5">
        {loading ? (
          <div className="space-y-3 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-[60%] mt-2" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-start w-full">
            <div className="text-sm md:text-[15px] mb-6 flex-1 w-full text-foreground/90 overflow-hidden break-words">
              <ReactMarkdown components={MarkdownComponents}>
                {insights}
              </ReactMarkdown>
            </div>
            
            <Button 
              size="sm" 
              className="w-full mt-auto rounded-full gap-2 shadow-sm"
              onClick={() => navigate('/ai-assistant')}
            >
              <BrainCircuit className="h-4 w-4" />
              Open AI Assistant
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsCard;