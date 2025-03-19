import { useNavigate } from 'react-router-dom';
import { Bell, Search, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Navigations from './Navigations';
import QuickStats from './QuickStats';

const SideBar = ({ currentUser, profile, activeMedications, takenToday, missedToday, upcomingRenewals }) => {
  const navigate = useNavigate();

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="lg:col-span-3">
      <div className="sticky top-24 space-y-6">
        {/* User Profile Card */}
        <Card className="overflow-hidden border-gray-200 dark:border-gray-800 shadow-glass-sm">
          <div className="bg-primary/10 h-24 relative"></div>
          <div className="px-6 pb-6 pt-0 -mt-12">
            {currentUser ? (
              <>
                <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 mb-4">
                  <AvatarFallback className="text-lg">
                    {profile?.name ? getInitials(profile.name) : currentUser.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-lg mb-1">Welcome back, {profile?.name?.split(' ')[0] || 'User'}!</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{currentUser.email}</p>
                <Button className="w-full rounded-lg" onClick={() => navigate('/profile')}>
                  View Profile
                </Button>
              </>
            ) : (
              <>
                <div className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 mb-4"></div>
                <h3 className="font-medium text-lg mb-1">Welcome back!</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Sign in to access your medications</p>
                <Button className="w-full rounded-lg" onClick={() => navigate('/login')}>Sign In</Button>
              </>
            )}
          </div>
        </Card>
        
        {/* Quick Stats */}
        <QuickStats 
          activeMedications={activeMedications} 
          takenToday={takenToday} 
          missedToday={missedToday} 
          upcomingRenewals={upcomingRenewals} 
        />
        
        {/* Navigation */}
        <Navigations navigate={navigate} />
      </div>
    </div>
  );
};

export default SideBar;
