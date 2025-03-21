
import { useState, useEffect } from "react";
import EventForm from "@/components/event-form/EventForm";
import EventsTable from "@/components/event-display/EventsTable";
import { useEvents } from "@/components/event-display/hooks/useEvents";
import BenefitBoxes from "@/components/BenefitBoxes";
import CollapsibleIntro from "@/components/CollapsibleIntro";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const { events, isLoading, error } = useEvents();
  const [showEvents, setShowEvents] = useState(false);
  
  useEffect(() => {
    // Only show the events section if we have events to display
    if (!isLoading && events && events.length > 0) {
      setShowEvents(true);
      console.log("Events available to display:", events.length);
    } else if (!isLoading) {
      setShowEvents(false);
      console.log("No events available to display");
    }
  }, [events, isLoading]);

  const renderHeader = () => (
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
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {renderHeader()}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {renderHeader()}
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              There was a problem loading events. Please try again later.
            </AlertDescription>
          </Alert>
        )}
        
        {showEvents && events && events.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Events</h2>
            <EventsTable events={events} isLoading={isLoading} error={error} />
          </div>
        ) : !isLoading && (
          <div className="mb-12">
            <Alert className="mb-6">
              <AlertDescription>
                No published events found. Events will appear here after they are approved.
              </AlertDescription>
            </Alert>
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
