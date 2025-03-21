
import { useState, useEffect } from "react";
import EventForm from "@/components/event-form/EventForm";
import EventsTable from "@/components/event-display/EventsTable";
import { useEvents } from "@/components/event-display/hooks/useEvents";
import BenefitBoxes from "@/components/BenefitBoxes";
import CollapsibleIntro from "@/components/CollapsibleIntro";

const Index = () => {
  const { events, isLoading } = useEvents();
  const [showEvents, setShowEvents] = useState(false);
  
  useEffect(() => {
    // Only show the events section if we have events to display
    if (!isLoading && events.length > 0) {
      setShowEvents(true);
    } else {
      setShowEvents(false);
    }
  }, [events, isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/lovable-uploads/c368798b-3714-434f-88b4-7f1f86a2fa1f.png" 
            alt="Peel District School Board Logo" 
            className="max-w-full h-auto mb-4"
            style={{ maxHeight: "72px" }}
          />
          <CollapsibleIntro />
        </div>
        
        <BenefitBoxes />
        
        {showEvents && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Events</h2>
            <EventsTable />
          </div>
        )}
        
        <div>
          <EventForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
