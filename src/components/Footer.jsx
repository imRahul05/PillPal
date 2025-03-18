import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isTablet, setIsTablet] = useState(window.innerWidth < 768);
  
  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth < 768);
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
    display: 'grid',
    gridTemplateColumns: isTablet ? '1fr' : 'repeat(4, 1fr)',
    gap: '2.5rem'
  };

  const logoColumnStyles = {
    gridColumn: isTablet ? 'auto' : 'span 2'
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
    maxWidth: '28rem'
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
    flexDirection: isTablet ? 'column' : 'row',
    justifyContent: isTablet ? 'center' : 'space-between',
    alignItems: 'center',
    gap: '1rem'
  };

  const copyrightStyles = {
    color: 'var(--gray-500)',
    fontSize: '0.875rem',
    marginBottom: isTablet ? '1rem' : 0
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
          {/* Logo and Description */}
          <div style={logoColumnStyles}>
            <Link to="/" style={logoStyles}>
              <span style={{ height: '0.75rem', width: '0.75rem', background: 'var(--primary)', borderRadius: '9999px' }}></span>
              <span>PillPal</span>
            </Link>
            <p style={descriptionStyles}>
              Your personal medication assistant. Simplifying medication management to help you stay healthy.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
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