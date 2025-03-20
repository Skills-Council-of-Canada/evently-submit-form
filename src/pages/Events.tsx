
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2, Calendar, Users, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllEvents, EventRecord } from "@/services/eventService";

const Events = () => {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getAllEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-event-purple" />
        <span className="ml-2 text-lg">Loading events...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">School Events</h1>
      
      {events.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No events have been submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
              {event.imageUrl && (
                <div className="relative h-48 w-full">
                  <img 
                    src={event.imageUrl} 
                    alt={event.eventName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className={`${event.imageUrl ? 'bg-white' : 'bg-event-purple text-white'}`}>
                <CardTitle className={`truncate ${event.imageUrl ? 'text-gray-800' : 'text-white'}`}>
                  {event.eventName}
                </CardTitle>
                <CardDescription className={event.imageUrl ? 'text-gray-500' : 'text-white opacity-90'}>
                  {event.schoolName}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 flex-grow">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-event-purple mr-2" />
                    <div>
                      <p className="text-gray-700">
                        {format(new Date(event.eventDate), "PPP")} at {event.eventTime}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-event-purple mr-2 mt-1" />
                    <div>
                      <p className="text-gray-700">{event.schoolName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-event-purple mr-2" />
                    <p className="text-gray-700 capitalize">{event.audienceType}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                    <p className="text-gray-700 line-clamp-3">{event.description}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 text-sm text-gray-500">
                Contact: {event.contactName}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
