import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import '../index.css';
import { useTheme } from '../contexts/ThemeContext';
import dashboardImage from '../assets/img.jpg'; // Adjust path and filename as needed
import { useAuth } from '@/contexts/AuthContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const { isDarkMode } = useTheme(); 
 const {currentUser} = useAuth();
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGetStarted = () => {
    console.log(currentUser);
    if(currentUser){
      navigate('/dashboard');
    }else{
    navigate('/login');
    }
  };

  return (
    <section className="relative pt-24 pb-12">
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--blue-50))] overflow-hidden">
        <div className="absolute inset-0 bg-[var(--grid-pattern)] bg-center mask-[linear-gradient(to_bottom,black,transparent)]" />
      </div>
      
      <div className="relative z-10 px-2 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-[hsl(var(--border))] gap-2 mb-8 bg-[hsl(var(--muted))]">
            <div className="flex items-center justify-center h-6 w-6 bg-[rgba(var(--primary-rgb),0.2)] rounded-full">
              <Check className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-[hsl(var(--gray-600))]">
              Easy medication management
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 bg-gradient-to-b from-[hsl(var(--foreground))] to-[hsl(var(--gray-700))] bg-clip-text text-transparent">
            Never Miss a Pill{!isMobile && <br />}
            <span className="text-primary"> Stay Healthy</span>
          </h1>
          
          <p className="text-lg text-[hsl(var(--gray-600))] max-w-3xl mx-auto mb-10">
            PillPal helps you manage medications, track doses, and stay on top of refills with smart reminders and a simple tracking system.
          </p>
          
          <div className={isMobile ? "flex-col" : "flex-row"} style={{ gap: '1rem', display: 'flex' }}>
            <Button 
              onClick={handleGetStarted}
              className="rounded-full text-base px-6 h-14 shadow-md"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="rounded-full text-base px-8 h-14 border-2"
            >
              How It Works
            </Button>
          </div>
        </div>
        
        <div className="relative w-full max-w-4xl mx-auto aspect-video overflow-hidden rounded-xl shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(var(--primary-rgb),0.05)] to-[rgba(var(--primary-rgb),0.2)]" />
          <img
            src={dashboardImage}
            alt="PillPal Dashboard Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 border border-white/10 rounded-xl" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;