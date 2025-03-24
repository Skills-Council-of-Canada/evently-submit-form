
import { useState, useEffect } from "react";
import EventForm from "@/components/event-form/EventForm";
import BenefitBoxes from "@/components/BenefitBoxes";
import CollapsibleIntro from "@/components/CollapsibleIntro";
import { useLocation } from "react-router-dom";

const Index = () => {
  // Create a more persistent state approach
  const [hasBeenMounted, setHasBeenMounted] = useState(() => {
    // Check session storage on initial render only
    return sessionStorage.getItem('indexPageVisited') === 'true';
  });
  const location = useLocation();

  useEffect(() => {
    // Only run this effect once, when the component first mounts
    if (!hasBeenMounted) {
      setHasBeenMounted(true);
      
      // Store in session storage that the page has been visited
      sessionStorage.setItem('indexPageVisited', 'true');
    }
    
    // Avoid scrolling to top on each render
    // Only scroll to top when the location path changes
    if (location.pathname === '/') {
      window.scrollTo(0, 0);
    }
  }, [hasBeenMounted, location.pathname]);

  // Prevent the component from re-rendering unnecessarily
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
