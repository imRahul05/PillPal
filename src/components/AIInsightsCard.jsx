
import { useState, useEffect } from 'react';
import { BrainCircuit, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useMedications } from '@/hooks/useMedications';
import { generateAdherenceInsights } from '@/lib/gemini';
import { useNavigate } from 'react-router-dom';

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
    <Card className="border-gray-200 dark:border-gray-800 shadow-glass-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center">
            <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
            <CardTitle>AI Medication Insights</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={loadInsights}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Personalized recommendations based on your medication patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm whitespace-pre-wrap">{insights}</div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate('/ai-assistant')}
            >
              <BrainCircuit className="mr-2 h-4 w-4" />
              Open AI Assistant
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsCard;