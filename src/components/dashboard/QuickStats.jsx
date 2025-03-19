import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const QuickStats = ({ activeMedications, takenToday, missedToday, upcomingRenewals }) => {
  return (
    <Card className="border-gray-200 dark:border-gray-800 shadow-glass-sm">
      <CardHeader>
        <CardTitle className="text-base">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Adherence Rate</span>
          <span className="text-sm font-medium">
            {activeMedications.length === 0 ? 'N/A' : 
              `${Math.round((takenToday / (takenToday + missedToday || 1)) * 100)}%`}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Active Medications</span>
          <span className="text-sm font-medium">{activeMedications.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Upcoming Renewals</span>
          <span className="text-sm font-medium text-amber-500">{upcomingRenewals.length}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStats;
