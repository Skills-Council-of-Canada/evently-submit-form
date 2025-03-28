
import { toast } from "@/hooks/use-toast";
import { submitEvent } from "@/services/events";
import { uploadEventImage } from "@/services/imageService";
import { FormValues } from "../schema";
import { EventRecord } from "@/services/events";

/**
 * Custom hook to handle the actual event submission logic
 */
export function useEventSubmit() {
  const submitEventData = async (data: FormValues) => {
    try {
      // Handle image upload if an image was selected
      let imageUrl = null;
      if (data.eventImage && data.eventImage.length > 0) {
        const imageFile = data.eventImage[0];
        console.log("📝 Uploading image:", imageFile.name);
        imageUrl = await uploadEventImage(imageFile);
        console.log("📝 Image uploaded successfully. URL:", imageUrl);
        
        // Save the image URL to localStorage in case of refresh
        if (imageUrl) {
          localStorage.setItem('lastUploadedImageUrl', imageUrl);
        }
      } else {
        console.log("📝 No image to upload");
        // Check if we have a previously uploaded image URL
        const savedImageUrl = localStorage.getItem('lastUploadedImageUrl');
        if (savedImageUrl) {
          imageUrl = savedImageUrl;
          console.log("📝 Using previously uploaded image URL:", imageUrl);
        }
      }
      
      // Format the date properly - this is critical
      console.log("📝 Original event date:", data.eventDate);
      const eventDate = data.eventDate instanceof Date ? data.eventDate : new Date(data.eventDate);
      console.log("📝 Formatted event date:", eventDate.toISOString());
      
      // Ensure eventTime is properly formatted or provide a default value
      console.log("📝 Event time from form:", data.eventTime);
      
      // Set a default time if none is provided
      let eventTime = "12:00 PM - 1:00 PM";
      
      if (data.eventTime && typeof data.eventTime === 'string' && data.eventTime.trim() !== '') {
        // Validate time format
        const timePattern = /(\d{1,2}):(\d{2}) (AM|PM) - (\d{1,2}):(\d{2}) (AM|PM)/;
        if (timePattern.test(data.eventTime)) {
          eventTime = data.eventTime;
          console.log("📝 Using provided event time:", eventTime);
        } else {
          console.log("📝 Event time format invalid, using default instead:", eventTime);
          toast({
            title: "Time Format Notice",
            description: "The provided event time format was invalid. Using a default time of 12:00 PM - 1:00 PM.",
          });
        }
      } else {
        console.log("📝 No event time provided, using default:", eventTime);
      }
      
      console.log("📝 Bypassing duplicate check for testing");
      
      // Prepare event data including the image URL
      const eventData: EventRecord = {
        eventName: data.eventName,
        eventDate: eventDate,
        eventTime: eventTime,
        description: data.description,
        schoolName: data.schoolName,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        audienceType: data.audienceType,
        submissionDate: data.submissionDate,
        imageUrl: imageUrl,
        // New fields
        eventLocation: data.eventLocation,
        estimatedAttendance: data.estimatedAttendance,
        participants: data.participants,
        keyHighlights: data.keyHighlights,
        specialGuests: data.specialGuests,
        notableAchievements: data.notableAchievements,
        imagePermission: data.imagePermission,
        suggestedCaption: data.suggestedCaption,
        contentHighlight: data.contentHighlight
      };
      
      console.log("📝 Submitting event to database:", JSON.stringify(eventData, null, 2));
      
      // Submit the event with image URL
      const recordId = await submitEvent(eventData);
      
      if (recordId) {
        console.log("📝 Event submitted successfully with ID:", recordId);
        localStorage.setItem('lastSubmittedRecordId', recordId);
        
        // Clear the image URL from localStorage to prevent reuse in new submissions
        localStorage.removeItem('lastUploadedImageUrl');
        
        return recordId;
      } else {
        console.error("📝 No record ID returned from submitEvent");
        throw new Error("Failed to save event to database");
      }
    } catch (error) {
      console.error("📝 Error submitting form:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("📝 Error details:", errorMessage);
      
      toast({
        title: "Submission Error",
        description: errorMessage || "There was a problem submitting your event. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  return { submitEventData };
}
