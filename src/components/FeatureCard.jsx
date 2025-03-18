import { useState } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const FeatureCard = ({ icon: Icon, title, description, className, iconClassName, style }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden group rounded-2xl transition-all duration-500 p-6 backdrop-blur-sm
      bg-white/70 dark:bg-gray-900/40 hover:bg-white/90 dark:hover:bg-gray-900/60
      border border-gray-200/50 dark:border-gray-800/50
      shadow-glass-sm hover:shadow-glass ${className}`}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 opacity-0 bg-gradient-to-br from-primary/5 to-accent/5 
        ${isHovered ? "opacity-100" : ""}`}
      />
      
      {/* Icon */}
      <div
        className={`relative mb-4 inline-flex items-center justify-center
        w-12 h-12 rounded-xl bg-primary/10 text-primary
        transition-all duration-500 ease-out
        ${isHovered ? "scale-110 bg-primary text-white" : ""} ${iconClassName}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      
      {/* Content */}
      <div className="relative">
        <h3 className="text-xl font-semibold mb-2 tracking-tight">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
      
      {/* Bottom highlight line */}
      <div
        className={`absolute bottom-0 left-0 h-1 bg-primary transition-all duration-500 ease-out 
        ${isHovered ? "w-full" : "w-0"}`}
      />
    </div>
  );
};

export default FeatureCard;
