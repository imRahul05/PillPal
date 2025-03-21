import { useNavigate } from 'react-router-dom';
import { Bell, Search, Calendar, RefreshCw, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Navigations from './Navigations';
import QuickStats from './QuickStats';
import { useState, useEffect, useRef } from 'react';

const SideBar = ({ currentUser, profile, activeMedications, takenToday, missedToday, upcomingRenewals }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarRef = useRef(null);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="lg:col-span-3 relative h-full" ref={sidebarRef}>
      {/* Toggle button that's always visible */}
      <button 
        className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-r-lg shadow-lg z-10 flex items-center justify-center"
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setIsExpanded(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar content that expands/collapses */}
      <div 
        className={cn(
          "fixed top-0 left-0 h-full pt-20 pb-6 bg-background border-r shadow-lg transition-all duration-300 ease-in-out z-10 overflow-y-auto",
          isExpanded ? "w-80 opacity-100" : "w-0 opacity-0"
        )}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="sticky top-24 space-y-6 px-4 w-80">
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
    </div>
  );
};

export default SideBar;