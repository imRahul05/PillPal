import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1 }}>
        <HeroSection />
        <FeatureSection />

        {/* CTA Section */}
        <section style={{ padding: '6rem 0', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: 'linear-gradient(to bottom, var(--bg-gray-50), var(--bg-gray-100))'
          }} />
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
            <div style={{
              background: 'var(--bg-white)',
              borderRadius: '1.5rem',
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'relative', padding: '3rem 4rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '-0.025em' }}>
                    Ready to simplify your medication routine?
                  </h2>
                  <p style={{ fontSize: '1.25rem', color: 'var(--text-gray-600)', marginBottom: '2rem', maxWidth: '42rem', margin: '0 auto' }}>
                    Get started with PillPal today and experience the easiest way to manage your medications.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'center' }}>
                    <Button style={{ borderRadius: '9999px', height: '3.5rem', padding: '0 2rem', fontSize: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                      Get Started <ArrowRight style={{ marginLeft: '0.5rem', height: '1.25rem', width: '1.25rem' }} />
                    </Button>
                    <Button variant="outline" style={{ borderRadius: '9999px', height: '3.5rem', padding: '0 2rem', fontSize: '1rem' }}>
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;