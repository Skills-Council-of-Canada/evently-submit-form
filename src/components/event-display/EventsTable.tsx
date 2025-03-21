
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, Clock, Users, MapPin } from "lucide-react";
import { EventRecord } from "@/services/eventService";

// Update the component to accept events as props
interface EventsTableProps {
  events: EventRecord[];
  isLoading: boolean;
  error: Error | null;
}

const EventsTable = ({ events, isLoading, error }: EventsTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <p className="text-red-500">Error loading events: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="bg-slate-50">
        <CardContent className="p-6 text-center">
          <p className="text-slate-500">No published events found. Be the first to submit an event!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="md:flex">
              {event.imageUrl && (
                <div className="md:w-1/3 h-48 md:h-auto">
                  <img 
                    src={event.imageUrl} 
                    alt={event.eventName} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className={`p-6 ${event.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.eventName}</h3>
                
                <div className="flex flex-wrap gap-y-2 mb-4 text-sm text-gray-500">
                  <div className="flex items-center mr-4">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(event.eventDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center mr-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{event.eventTime}</span>
                  </div>
                  
                  <div className="flex items-center mr-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{event.schoolName}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="capitalize">{event.audienceType}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-2 line-clamp-3">{event.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EventsTable;
