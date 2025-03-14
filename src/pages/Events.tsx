
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Airtable configuration
const AIRTABLE_API_KEY = "YOUR_AIRTABLE_API_KEY"; // Replace with your Airtable API key
const AIRTABLE_BASE_ID = "YOUR_AIRTABLE_BASE_ID"; // Replace with your Airtable base ID
const AIRTABLE_TABLE_NAME = "Event Submissions";

interface Event {
  id: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  description: string;
  schoolName: string;
  contactName: string;
  contactEmail: string;
  audienceType: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }

        const data = await response.json();
        
        // Transform Airtable records to our Event interface
        const formattedEvents = data.records.map((record: any) => ({
          id: record.id,
          eventName: record.fields["Event Name"] || "",
          eventDate: record.fields["Event Date"] || "",
          eventTime: record.fields["Event Time"] || "",
          description: record.fields["Description"] || "",
          schoolName: record.fields["School Name"] || "",
          contactName: record.fields["Contact Name"] || "",
          contactEmail: record.fields["Contact Email"] || "",
          audienceType: record.fields["Audience Type"] || "",
        }));

        setEvents(formattedEvents);
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
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="bg-event-purple text-white">
                <CardTitle className="truncate">{event.eventName}</CardTitle>
                <CardDescription className="text-white opacity-90">
                  {event.schoolName}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">Date & Time</p>
                  <p className="text-gray-700">
                    {event.eventDate && format(new Date(event.eventDate), "PPP")} at {event.eventTime}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-gray-700 line-clamp-3">{event.description}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">Audience</p>
                  <p className="text-gray-700 capitalize">{event.audienceType}</p>
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
