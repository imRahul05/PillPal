import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Renewals = ({ upcomingRenewals, navigate }) => {
  return (
    <Card className="border-gray-200 dark:border-gray-800 shadow-glass-sm">
      <CardHeader>
        <CardTitle>Upcoming Prescription Renewals</CardTitle>
        <CardDescription>Prescriptions that need to be renewed soon</CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingRenewals.length === 0 ? (
          <div className="text-center py-6">
            <Check className="h-10 w-10 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">All prescriptions are up to date</h3>
            <p className="text-gray-500 dark:text-gray-400">
              You don't have any prescriptions that need renewal soon.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingRenewals.map((rx) => {
              const renewalDate = new Date(rx.renewalDate || '');
              const today = new Date();
              const diffTime = renewalDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              return (
                <div 
                  key={rx.id}
                  className="p-4 rounded-xl border border-amber-100 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-900/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div>
                    <h4 className="font-medium">{rx.name} {rx.dosage}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Category: {rx.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      Expires in {diffDays} {diffDays === 1 ? 'day' : 'days'}
                    </span>
                    <Button 
                      size="sm" 
                      className="rounded-lg"
                      onClick={() => navigate('/medications')}
                    >
                      Renew
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Renewals;
