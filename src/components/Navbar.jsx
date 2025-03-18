import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, Sun, Moon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Styles
  const navStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    transition: 'all 300ms ease-in-out',
    padding: '1rem 1.5rem',
    background: isScrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
    backdropFilter: isScrolled ? 'blur(8px)' : 'none',
    borderBottom: isScrolled ? '1px solid rgba(229, 231, 235, 0.5)' : 'none',
    boxShadow: isScrolled ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
  };

  const containerStyles = {
    maxWidth: '80rem',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const logoStyles = {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'transform 300ms',
    ':hover': {
      transform: 'scale(1.05)'
    }
  };

  const desktopNavStyles = {
    display: 'none',
    '@media (min-width: 768px)': {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem'
    }
  };

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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

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

  const filteredNavItems = navItems.filter(item => 
    !item.protected || (item.protected && currentUser)
  );

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
    <nav style={navStyles}>
      <div style={containerStyles}>
        <Link to="/" style={logoStyles}>
          <span style={{
            position: 'relative',
            display: 'inline-flex'
          }}>
            <span style={{
              height: '1rem',
              width: '1rem',
              background: 'var(--primary)',
              borderRadius: '9999px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}></span>
          </span>
          <span>PillPal</span>
        </Link>

        {/* Desktop Navigation */}
        <div style={desktopNavStyles}>
          {filteredNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              style={{
                position: 'relative',
                fontWeight: 500,
                color: location.pathname === item.path ? 'var(--primary)' : 'var(--gray-600)',
                transition: 'color 300ms',
                ':hover': {
                  color: 'var(--primary)'
                }
              }}
            >
              {item.name}
              <span style={{
                position: 'absolute',
                bottom: '-4px',
                left: 0,
                width: location.pathname === item.path ? '100%' : '0',
                height: '2px',
                background: 'var(--primary)',
                transition: 'all 300ms'
              }} />
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div style={{
          display: 'none',
          '@media (min-width: 768px)': {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }
        }}>
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            onClick={toggleDarkMode}
            style={{
              borderRadius: '9999px',
              padding: '0.5rem'
            }}
          >
            {isDarkMode ? <Sun style={{ height: '1.25rem', width: '1.25rem' }} /> : 
                         <Moon style={{ height: '1.25rem', width: '1.25rem' }} />}
          </Button>

          {/* User Menu */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar style={{ height: '2.25rem', width: '2.25rem', cursor: 'pointer' }}>
                  <AvatarFallback style={{ background: 'var(--primary)', color: 'white' }}>
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              {/* Dropdown content remains the same */}
            </DropdownMenu>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button 
                variant="ghost"
                onClick={() => navigate('/login')}
                style={{ borderRadius: '9999px' }}
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/signup')}
                style={{ 
                  borderRadius: '9999px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'block',
            '@media (min-width: 768px)': {
              display: 'none'
            }
          }}
        >
          {isOpen ? <X style={{ height: '1.25rem', width: '1.25rem' }} /> : 
                    <Menu style={{ height: '1.25rem', width: '1.25rem' }} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(4px)',
        zIndex: 40,
        transition: 'all 300ms ease-in-out',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        paddingTop: '5rem'
      }}>
        {/* Mobile menu content */}
      </div>
    </nav>
  );
};

export default Navbar;