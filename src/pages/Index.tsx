
import React from "react";
import EventForm from "@/components/event-form/EventForm";
import { EventsTable } from "@/components/events-display/EventsTable";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <EventsTable />
        <EventForm />
      </div>
    </div>
  );
};

export default Index;
