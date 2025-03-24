
import { useState, useEffect, useCallback } from "react";
import EventForm from "@/components/event-form/EventForm";
import BenefitBoxes from "@/components/BenefitBoxes";
import CollapsibleIntro from "@/components/CollapsibleIntro";
import { useLocation } from "react-router-dom";

const Index = () => {
  // Use localStorage instead of sessionStorage for more persistence
  const [hasBeenMounted, setHasBeenMounted] = useState(() => {
    return localStorage.getItem('indexPageVisited') === 'true';
  });
  const location = useLocation();

  // Memoize the scroll handler to prevent unnecessary re-renders
  const handleScroll = useCallback(() => {
    if (location.pathname === '/') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [location.pathname]);

  useEffect(() => {
    // Only run this effect once, when the component first mounts
    if (!hasBeenMounted) {
      setHasBeenMounted(true);
      
      // Store in localStorage for better persistence
      localStorage.setItem('indexPageVisited', 'true');
    }
    
    // Handle scroll only when location changes
    handleScroll();
    
    // Add a cleanup function to prevent memory leaks
    return () => {
      // Store current form state when unmounting
      const currentFormState = sessionStorage.getItem('eventFormState');
      if (currentFormState) {
        localStorage.setItem('eventFormBackup', currentFormState);
      }
    };
  }, [hasBeenMounted, handleScroll]);

  // Prevent the component from re-rendering unnecessarily by using React.memo internally
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/lovable-uploads/c368798b-3714-434f-88b4-7f1f86a2fa1f.png" 
            alt="Peel District School Board Logo" 
            className="max-w-full h-auto mb-12"
            style={{ maxHeight: "72px" }}
          />
          
          <div className="mb-10">
            <BenefitBoxes />
          </div>
          
          <CollapsibleIntro />
        </div>
        
        <div>
          <EventForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
