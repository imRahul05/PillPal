import React from 'react'
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../contexts/ThemeContext";
import { cn } from "@/lib/utils";

const CallToAction = () => {
  const { isDarkMode } = useTheme();

  return (
    <section className="py-12 md:py-16 lg:py-20 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl"  />
      
      {/* Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "rounded-3xl shadow-xl overflow-hidden",
          isDarkMode ? "bg-card" : "bg-white"
        )}>
          {/* Content */}
          <div className="relative px-6 py-10 md:p-12 lg:p-16 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-4 md:mb-6">
                Ready to simplify your medication routine?
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 md:mb-10">
                Get started with PillPal today and experience the easiest way to manage your medications.
              </p>
              
              {/* Buttons - Stack on mobile, side by side on larger screens */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="rounded-full h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base shadow-md"
                  size="lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="rounded-full h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base"
                  size="lg"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;