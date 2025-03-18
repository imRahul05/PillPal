import { Link } from 'react-router-dom';
import { ExternalLink, Github, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
    gridTemplateColumns: '1fr',
    gap: '2.5rem',
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(4, 1fr)'
    }
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
    color: 'var(--gray-600)',
    ':hover': {
      color: 'var(--primary)'
    }
  };

  const sectionTitleStyles = {
    fontWeight: 500,
    fontSize: '1.125rem',
    marginBottom: '1rem'
  };

  const linkStyles = {
    color: 'var(--gray-600)',
    ':hover': {
      color: 'var(--primary)',
      transition: 'colors 0.2s ease'
    }
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
          <div style={{ gridColumn: '1 / -1', '@media (min-width: 768px)': { gridColumn: 'span 2' } }}>
            <Link to="/" style={logoStyles}>
              <span style={{ height: '0.75rem', width: '0.75rem', background: 'var(--primary)', borderRadius: '9999px' }}></span>
              <span>PillPal</span>
            </Link>
            <p style={descriptionStyles}>
              Your personal medication assistant. Simplifying medication management to help you stay healthy.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[Twitter, Instagram, Github].map((Icon, index) => (
                <Button 
                  key={index}
                  variant="ghost" 
                  style={socialButtonStyles}
                >
                  <Icon style={{ height: '1.25rem', width: '1.25rem' }} />
                </Button>
              ))}
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
                      transition: 'transform 0.2s ease',
                      ':hover': {
                        transform: 'translate(2px, -2px)'
                      }
                    }} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--gray-200)',
          marginTop: '3rem',
          paddingTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          '@media (min-width: 768px)': {
            flexDirection: 'row',
            justifyContent: 'space-between'
          }
        }}>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
            © {currentYear} PillPal. All rights reserved.
          </p>
          <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
            <span>Crafted with care for better health</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;