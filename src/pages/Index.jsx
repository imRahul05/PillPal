// src/components/Index.jsx
import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { useTheme } from "../contexts/ThemeContext";
import TopButton from "../components/TopButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CallToAction from "../components/CallToAction";

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
      return; 
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    window.scrollTo(0, 0);

    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentUser, navigate]);

  // Move the loading check to the top of the render method
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: isDarkMode ? "hsl(var(--background))" : "var(--bg-gray-50)",
        }}
      >
        <Loader />
      </div>
    );
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <HeroSection />
        <FeatureSection />

       <CallToAction/>
       
      </main>
      <TopButton
        onClick={scrollToTop}
        className={`transition-opacity ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <Footer />
    </div>
  );
};

export default Index;