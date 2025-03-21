
import EventForm from "@/components/event-form/EventForm";
import EventsTable from "@/components/event-display/EventsTable";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">School Events Portal</h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Events</h2>
          <EventsTable />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Submit a New Event</h2>
          <EventForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
