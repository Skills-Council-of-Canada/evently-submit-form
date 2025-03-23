
import React from "react";
import { format } from "date-fns";
import { Calendar, Building, Users, MapPin, User, Mail, Image, FileText } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

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
      <SheetContent className="sm:max-w-md overflow-y-auto max-h-screen">
        <SheetHeader>
          <SheetTitle>{event.eventName}</SheetTitle>
          <SheetDescription>Event details</SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {/* Basic Event Details */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Event Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.eventDate), "PPP")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {event.eventLocation || "Not specified"}
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
              
              {event.estimatedAttendance && (
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Estimated Attendance</p>
                    <p className="text-sm text-muted-foreground">{event.estimatedAttendance}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
            <p className="text-sm">{event.description}</p>
          </div>
          
          <Separator />
          
          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">{event.contactName}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{event.contactEmail}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Participation & Highlights Section */}
          {(event.participants || event.keyHighlights || event.specialGuests || event.notableAchievements) && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Participation & Highlights</h3>
                <div className="space-y-3">
                  {event.participants && (
                    <div>
                      <p className="font-medium">Participants</p>
                      <p className="text-sm text-muted-foreground">{event.participants}</p>
                    </div>
                  )}
                  
                  {event.keyHighlights && (
                    <div>
                      <p className="font-medium">Key Highlights</p>
                      <p className="text-sm text-muted-foreground">{event.keyHighlights}</p>
                    </div>
                  )}
                  
                  {event.specialGuests && (
                    <div>
                      <p className="font-medium">Special Guests</p>
                      <p className="text-sm text-muted-foreground">{event.specialGuests}</p>
                    </div>
                  )}
                  
                  {event.notableAchievements && (
                    <div>
                      <p className="font-medium">Notable Achievements</p>
                      <p className="text-sm text-muted-foreground">{event.notableAchievements}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          
          {/* Media & Messaging Section */}
          {(event.imagePermission !== undefined || event.suggestedCaption || event.contentHighlight) && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Media & Messaging</h3>
                <div className="space-y-3">
                  {event.imagePermission !== undefined && (
                    <div>
                      <p className="font-medium">Image Permission</p>
                      <p className="text-sm text-muted-foreground">
                        {event.imagePermission ? "Yes" : "No"}
                      </p>
                    </div>
                  )}
                  
                  {event.suggestedCaption && (
                    <div>
                      <p className="font-medium">Suggested Caption</p>
                      <p className="text-sm text-muted-foreground">{event.suggestedCaption}</p>
                    </div>
                  )}
                  
                  {event.contentHighlight && (
                    <div>
                      <p className="font-medium">Content Highlight</p>
                      <p className="text-sm text-muted-foreground">{event.contentHighlight}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          
          {/* Tone Preferences */}
          {event.messageTone && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Tone Preferences</h3>
                <div>
                  <p className="font-medium">Message Tone</p>
                  <p className="text-sm text-muted-foreground">{event.messageTone}</p>
                </div>
              </div>
            </>
          )}
          
          {/* Event Image */}
          {event.imageUrl && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Event Image</h3>
                <div className="mt-2">
                  <div className="relative aspect-video rounded-md overflow-hidden">
                    <img 
                      src={event.imageUrl} 
                      alt={event.eventName}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Status Section */}
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
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
