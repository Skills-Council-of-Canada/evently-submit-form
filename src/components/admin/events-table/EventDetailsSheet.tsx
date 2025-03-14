
import React from "react";
import { format } from "date-fns";
import { Calendar, Building, Users } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { EventDetailsSheetProps } from "./types";
import { StatusBadge } from "./StatusBadge";

export function EventDetailsSheet({
  open,
  onOpenChange,
  event,
  onApprove,
  onPublish,
}: EventDetailsSheetProps) {
  if (!event) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{event.eventName}</SheetTitle>
          <SheetDescription>Event details</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Date & Time</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(event.eventDate), "PPP")} at {event.eventTime}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Building className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">School</p>
              <p className="text-sm text-muted-foreground">{event.schoolName}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Audience</p>
              <p className="text-sm text-muted-foreground">{event.audienceType}</p>
            </div>
          </div>
          
          <div>
            <p className="font-medium mb-1">Description</p>
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>
          
          <div>
            <p className="font-medium mb-1">Contact Information</p>
            <p className="text-sm text-muted-foreground">
              {event.contactName} - {event.contactEmail}
            </p>
          </div>
          
          <div className="pt-4">
            <p className="font-medium mb-2">Current Status</p>
            <div className="flex items-center gap-2">
              <StatusBadge status={event.status} />
              
              {event.status === "pending" ? (
                <Button 
                  size="sm" 
                  className="ml-2"
                  onClick={() => {
                    onApprove(event.id);
                    onOpenChange(false);
                  }}
                >
                  Approve Event
                </Button>
              ) : event.status === "approved" ? (
                <Button 
                  size="sm" 
                  className="ml-2"
                  onClick={() => {
                    onPublish(event.id);
                    onOpenChange(false);
                  }}
                >
                  Publish Event
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
