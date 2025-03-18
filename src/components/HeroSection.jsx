import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/login');
  };

  const sectionStyles = {
    paddingTop: '6rem',
    paddingBottom: '3rem',
    position: 'relative'
  };

  const gradientBgStyles = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, var(--white), var(--blue-50))',
    overflow: 'hidden'
  };

  const containerStyles = {
    padding: '0 1.5rem',
    margin: '0 auto',
    maxWidth: '80rem',
    position: 'relative',
    zIndex: 10
  };

  const headerContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '4rem'
  };

  const badgeStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    border: '1px solid var(--gray-200)',
    gap: '0.5rem',
    marginBottom: '2rem',
    background: 'var(--gray-50)'
  };

  const checkIconStyles = {
    background: 'rgba(var(--primary-rgb), 0.2)',
    color: 'var(--primary)',
    height: '1.5rem',
    width: '1.5rem',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const headingStyles = {
    fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    marginBottom: '1.5rem',
    background: 'linear-gradient(to bottom, var(--black), var(--gray-700))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  const descriptionStyles = {
    fontSize: '1.125rem',
    color: 'var(--gray-600)',
    maxWidth: '42rem',
    margin: '0 auto',
    marginBottom: '2.5rem'
  };

  const imageContainerStyles = {
    position: 'relative',
    width: '100%',
    maxWidth: '64rem',
    margin: '0 auto',
    aspectRatio: '16/9',
    overflow: 'hidden',
    borderRadius: '0.75rem',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)'
  };

  return (
    <section style={sectionStyles}>
      <div style={gradientBgStyles}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'var(--grid-pattern)',
          backgroundPosition: 'center',
          maskImage: 'linear-gradient(to bottom, black, transparent)'
        }} />
      </div>
      
      <div style={containerStyles}>
        <div style={headerContainerStyles}>
          <div style={badgeStyles}>
            <div style={checkIconStyles}>
              <Check style={{ height: '0.875rem', width: '0.875rem' }} />
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-600)' }}>
              Easy medication management
            </span>
          </div>
          
          <h1 style={headingStyles}>
            Never Miss a Pill <br style={{ display: 'none', '@media (min-width: 640px)': { display: 'block' } }} />
            <span style={{ color: 'var(--primary)' }}>Stay Healthy</span>
          </h1>
          
          <p style={descriptionStyles}>
            PillPal helps you manage medications, track doses, and stay on top of refills with smart reminders and a simple tracking system.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', '@media (min-width: 640px)': { flexDirection: 'row' } }}>
            <Button 
              onClick={handleGetStarted}
              style={{
                borderRadius: '9999px',
                fontSize: '1rem',
                padding: '0 2rem',
                height: '3.5rem',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)'
              }}
            >
              Get Started
              <ArrowRight style={{ marginLeft: '0.5rem', height: '1.25rem', width: '1.25rem' }} />
            </Button>
            <Button 
              variant="outline" 
              style={{
                borderRadius: '9999px',
                fontSize: '1rem',
                padding: '0 2rem',
                height: '3.5rem',
                borderWidth: '1.5px'
              }}
            >
              How It Works
            </Button>
          </div>
        </div>
        
        <div style={imageContainerStyles}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom right, rgba(var(--primary-rgb), 0.05), rgba(var(--primary-rgb), 0.2))'
          }}></div>
          <img
            src="/placeholder.svg"
            alt="PillPal Dashboard Preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0.75rem'
          }}></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;