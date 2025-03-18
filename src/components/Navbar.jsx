import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import '../index.css';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard', protected: true },
    { name: 'Medications', path: '/medications', protected: true },
    { name: 'Profile', path: '/profile', protected: true },
  ];

  const filteredNavItems = navItems.filter(item => !item.protected || (item.protected && currentUser));

  const getInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }
    return 'U';
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 p-4 md:p-6 
        ${isScrolled 
          ? 'bg-white/80 dark:bg-[hsl(var(--background))/0.8] backdrop-blur-lg border-b border-[hsl(var(--border))] shadow-sm' 
          : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-primary">
          <span className="relative inline-flex">
            <span className="h-4 w-4 bg-primary rounded-full animate-pulse"></span>
          </span>
          <span>PillPal</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {filteredNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative font-medium transition-colors duration-300 
                ${location.pathname === item.path ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}
            >
              {item.name}
              <span className={`absolute bottom-[-4px] left-0 h-[2px] bg-primary transition-all duration-300 
                ${location.pathname === item.path ? 'w-full' : 'w-0'}`} />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" onClick={toggleDarkMode} className="rounded-full p-2">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarFallback className="bg-primary text-white">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="p-2 flex flex-col">
                  <span className="font-medium">{currentUser.displayName}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{currentUser.email}</span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => navigate('/login')} className="rounded-full">
                Sign In
              </Button>
              <Button onClick={() => navigate('/signup')} className="rounded-full shadow-md">
                Sign Up
              </Button>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div
        className={`fixed inset-0 bg-[hsl(var(--background))/0.95] backdrop-blur-sm z-40 transition-all duration-300 md:hidden
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col p-8 pt-20">
          {filteredNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-2xl font-medium mb-6 
                ${location.pathname === item.path ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}
            >
              {item.name}
            </Link>
          ))}
          
          {currentUser ? (
            <Button 
              onClick={handleLogout}
              variant="destructive"
              className="mt-4 rounded-full"
            >
              <LogOut className="mr-2" /> 
              Logout
            </Button>
          ) : (
            <div className="flex flex-col gap-4 mt-4">
              <Button 
                variant="outline"
                onClick={() => navigate('/login')}
                className="rounded-full"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/signup')}
                className="rounded-full"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;