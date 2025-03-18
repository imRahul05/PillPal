import { 
    Bell, 
    Calendar, 
    Clock, 
    LayoutDashboard, 
    Repeat, 
    Search, 
    User, 
    Wifi, 
    MessageSquare 
  } from "lucide-react";
  import FeatureCard from "./FeatureCard";
  
  const features = [
    {
      icon: LayoutDashboard,
      title: "Medication Dashboard",
      description: "View all your medications, schedules, and upcoming renewals in one organized place."
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Receive timely alerts to take your medications, with options to snooze or mark as taken."
    },
    {
      icon: Repeat,
      title: "Easy Renewals",
      description: "Request prescription renewals with a single click and get notified when they're about to expire."
    },
    {
      icon: Search,
      title: "Medication History",
      description: "Track your complete medication history with powerful search and filtering capabilities."
    },
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description: "Set custom schedules for each medication with adjustable dosages and timing."
    },
    {
      icon: User,
      title: "Health Profile",
      description: "Store your health details, allergies, and healthcare provider information securely."
    },
    {
      icon: Clock,
      title: "Progress Tracking",
      description: "Monitor your medication adherence with visual charts and earned achievements."
    },
    {
      icon: Wifi,
      title: "Offline Access",
      description: "Access your medication information and receive reminders even without an internet connection."
    },
    {
      icon: MessageSquare,
      title: "Help & Support",
      description: "Get guidance with comprehensive help resources and responsive support."
    }
  ];
  
  const FeatureSection = () => {
    return (
      <section className="py-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute bottom-1/3 -left-20 h-80 w-80 rounded-full bg-accent/5 blur-3xl"></div>
        </div>
  
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 tracking-tight">
              Everything you need to manage your medications
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              A comprehensive set of features designed to simplify your medication routine
            </p>
          </div>
  
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
  
         
        </div>
      </section>
    );
  };
  
  export default FeatureSection;
  