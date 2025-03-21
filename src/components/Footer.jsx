import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const footerStyles = {
    background: 'var(--gray-50)',
    borderTop: '1px solid var(--gray-200)'
  };

  const containerStyles = {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '3rem 1.5rem'
  };

  const gridStyles = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '2.5rem'
  };

  const logoColumnStyles = {
    flexBasis: isMobile ? '100%' : '50%',
    textAlign: isMobile ? 'center' : 'left', // Center align on mobile
    display: 'flex',
    flexDirection: 'column',
    alignItems: isMobile ? 'center' : 'flex-start' // Center items on mobile
  };

  const linksGridStyles = {
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
    gap: '2rem',
    width: isMobile ? '100%' : '50%'
  };

  const logoStyles = {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    textDecoration: 'none'
  };

  const descriptionStyles = {
    color: 'var(--gray-600)',
    marginBottom: '1.5rem',
    maxWidth: isMobile ? '100%' : '28rem', // Full width on mobile for better centering
    textAlign: isMobile ? 'center' : 'left' // Center text on mobile
  };

  const socialButtonStyles = {
    borderRadius: '9999px',
    color: 'var(--gray-600)'
  };

  const sectionTitleStyles = {
    fontWeight: 500,
    fontSize: '1.125rem',
    marginBottom: '1rem'
  };

  const linkStyles = {
    color: 'var(--gray-600)',
    textDecoration: 'none'
  };

  const footerBottomStyles = {
    borderTop: '1px solid var(--gray-200)',
    marginTop: '3rem',
    paddingTop: '2rem',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: isMobile ? 'center' : 'space-between',
    alignItems: 'center',
    gap: '1rem'
  };

  const copyrightStyles = {
    color: 'var(--gray-500)',
    fontSize: '0.875rem',
    marginBottom: isMobile ? '1rem' : 0
  };

  const creditStyles = {
    color: 'var(--gray-500)',
    fontSize: '0.875rem'
  };

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Medications', path: '/medications' },
    { name: 'Profile', path: '/profile' },
    { name: 'Help', path: '/help' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
    { name: 'HIPAA Compliance', path: '/hipaa' }
  ];

  return (
    <footer style={footerStyles}>
      <div style={containerStyles}>
        <div style={gridStyles}>
          {/* Logo and Description - Centered on mobile */}
          <div style={logoColumnStyles}>
            <Link to="/" style={logoStyles}>
            <span className="relative inline-flex">
              <span className="h-4 w-4 bg-primary rounded-full animate-pulse-subtle"></span>
              <span className="absolute -inset-0.5 bg-primary/20 rounded-full animate-ping"></span>
            </span>
              <span>PillPal</span>
            </Link>
            <p style={descriptionStyles}>
              Your personal medication assistant. Simplifying medication management to help you stay healthy.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: isMobile ? 'center' : 'flex-start' }}>
              <Button 
                variant="ghost" 
                style={socialButtonStyles}
              >
                <Twitter style={{ height: '1.25rem', width: '1.25rem' }} />
              </Button>
              <Button 
                variant="ghost" 
                style={socialButtonStyles}
              >
                <Instagram style={{ height: '1.25rem', width: '1.25rem' }} />
              </Button>
              <Button 
                variant="ghost" 
                style={socialButtonStyles}
              >
                <Github style={{ height: '1.25rem', width: '1.25rem' }} />
              </Button>
            </div>
          </div>

          {/* Two column grid for Quick Links and Legal on mobile */}
          <div style={linksGridStyles}>
            {/* Quick Links */}
            <div>
              <h3 style={sectionTitleStyles}>Quick Links</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} style={linkStyles}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 style={sectionTitleStyles}>Legal</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} style={linkStyles}>
                      <span>{link.name}</span>
                      <ExternalLink style={{ 
                        height: '0.75rem', 
                        width: '0.75rem', 
                        display: 'inline-block',
                        marginLeft: '0.25rem',
                        verticalAlign: 'middle'
                      }} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div style={footerBottomStyles}>
          <p style={copyrightStyles}>
            © {currentYear} PillPal. All rights reserved.
          </p>
          <div style={creditStyles}>
            <span>Crafted with care for better health</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;