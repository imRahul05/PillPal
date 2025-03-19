import { Bell, Search, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const Navigations = ({ navigate }) => {
  const navItems = [
    { name: 'Dashboard', icon: Bell, active: true, path: '/dashboard' },
    { name: 'All Medications', icon: Search, path: '/medications' },
    { name: 'Schedule', icon: Calendar, path: '/dashboard' },
    { name: 'Reports', icon: RefreshCw, path: '/dashboard' }
  ];

  return (
    <Card className="border-gray-200 dark:border-gray-800 shadow-glass-sm">
      <CardContent className="p-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant={item.active ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-left h-10 rounded-lg",
                item.active ? "font-medium" : "font-normal"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Navigations;
