// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, LogOut, Bell } from "lucide-react";
import { cn } from "@/lib/utils"; // Add this import
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import NotificationAlert from "@/components/NotificationAlert";
import { useMedicationNotifications } from "@/hooks/useMedicationNotifications";
import "../index.css";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { activeAlert } = useMedicationNotifications();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navItems = [
    { name: "Home", path: "/", hideWhenLoggedIn: true },
    { name: "Dashboard", path: "/dashboard", protected: true },
    { name: "Medications", path: "/medications", protected: true },
    { name: "Reports", path: "/reports", protected: true },
    { name: "Profile", path: "/profile", protected: true },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (currentUser && item.hideWhenLoggedIn) {
      return false;
    }
    if (item.protected) {
      return currentUser ? true : false;
    }

    return true;
  });

  const getInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return "U";
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 py-4",
          isScrolled
            ? "bg-white/80 dark:bg-[hsl(var(--background))/0.8] backdrop-blur-lg border-b border-[hsl(var(--border))] shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to={currentUser ? "/dashboard" : "/"}
            className="text-xl font-semibold text-primary flex items-center gap-2 transition-transform hover:scale-105"
          >
            <span className="relative inline-flex">
              <span className="h-4 w-4 bg-primary rounded-full animate-pulse-subtle"></span>
              <span className="absolute -inset-0.5 bg-primary/20 rounded-full animate-ping"></span>
            </span>
            <span>PillPal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "relative font-medium group",
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-300"
                )}
              >
                {item.name}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
                    location.pathname === item.path ? "w-full" : ""
                  )}
                />
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-accent dark:hover:bg-accent/70"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {currentUser && <NotificationsDropdown />}

            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarImage
                      src={currentUser.photoURL}
                      alt={currentUser.displayName}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className={cn(
                    "w-50 bg-[hsl(var(--card))] border-[hsl(var(--border))] shadow-lg z-[60]",
                    "text-[hsl(var(--foreground))]"
                  )}
                >
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {currentUser.displayName && (
                        <p className="font-medium">{currentUser.displayName}</p>
                      )}
                      {currentUser.email && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {currentUser.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/reports" className="cursor-pointer">
                      Reports
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  className="rounded-full hover:bg-accent dark:hover:bg-accent/70"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
                <Button
                  className="rounded-full shadow-glass-sm"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center space-x-4 md:hidden relative z-[60]">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-accent dark:hover:bg-accent/70"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {currentUser && <NotificationsDropdown />}

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-accent dark:hover:bg-accent/70"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={cn(
            "md:hidden fixed inset-0 bg-[hsl(var(--background))/0.95] backdrop-blur-sm z-40 transition-all duration-300 ease-in-out pt-20",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="flex flex-col space-y-6 p-8">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "text-2xl font-medium py-2 transition-colors animate-slide-in-left",
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-gray-600 dark:text-gray-400"
                )}
                style={{
                  animationDelay: `${filteredNavItems.indexOf(item) * 0.05}s`,
                }}
              >
                {item.name}
              </Link>
            ))}

            {currentUser ? (
              <Button
                onClick={handleLogout}
                className="rounded-full w-full shadow-glass-sm animate-slide-in-up"
                variant="destructive"
                style={{ animationDelay: "0.3s" }}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            ) : (
              <div className="flex flex-col gap-3 pt-4">
                <Button
                  onClick={() => navigate("/login")}
                  className="rounded-full w-full shadow-glass-sm animate-slide-in-up"
                  variant="outline"
                  style={{ animationDelay: "0.3s" }}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate("/signup")}
                  className="rounded-full w-full shadow-glass-sm animate-slide-in-up"
                  style={{ animationDelay: "0.4s" }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Active Medication Alert */}
      {activeAlert && (
        <NotificationAlert notification={activeAlert} onClose={() => {}} />
      )}
    </>
  );
};

export default Navbar;
