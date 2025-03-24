
import { useState, useEffect } from "react";
import EventForm from "@/components/event-form/EventForm";
import BenefitBoxes from "@/components/BenefitBoxes";
import CollapsibleIntro from "@/components/CollapsibleIntro";
import { useLocation } from "react-router-dom";

const Index = () => {
  // Track if component has been mounted before to preserve state
  const [hasBeenMounted, setHasBeenMounted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Set the flag when the component mounts for the first time
    if (!hasBeenMounted) {
      setHasBeenMounted(true);
      
      // Store in session storage that the page has been visited
      sessionStorage.setItem('indexPageVisited', 'true');
    }
    
    // Scroll to top when navigating to this page
    window.scrollTo(0, 0);
  }, [hasBeenMounted, location]);

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
