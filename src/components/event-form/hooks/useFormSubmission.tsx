
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { submitEvent, checkEventExists, EventRecord } from "@/services/events";
import { uploadEventImage } from "@/services/imageService";
import { FormValues } from "../schema";

export function useFormSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const submitForm = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      console.log("⭐ Starting form submission process");
      console.log("Form data received:", JSON.stringify(data, null, 2));
      
      // Handle image upload if an image was selected
      let imageUrl = null;
      if (data.eventImage && data.eventImage.length > 0) {
        const imageFile = data.eventImage[0];
        console.log("⭐ Uploading image:", imageFile.name);
        imageUrl = await uploadEventImage(imageFile);
        console.log("⭐ Image uploaded successfully. URL:", imageUrl);
      } else {
        console.log("⭐ No image to upload");
      }
      
      // Format the date properly - this is critical
      const eventDate = data.eventDate instanceof Date ? data.eventDate : new Date(data.eventDate);
      console.log("⭐ Formatted event date:", eventDate.toISOString());
      
      // Ensure eventTime is properly formatted
      console.log("⭐ Event time from form:", data.eventTime);
      if (!data.eventTime || typeof data.eventTime !== 'string') {
        console.error("⭐ Event time is invalid:", data.eventTime);
        throw new Error("Invalid event time format");
      }
      
      // Validate time format
      const timePattern = /(\d{1,2}):(\d{2}) (AM|PM) - (\d{1,2}):(\d{2}) (AM|PM)/;
      if (!timePattern.test(data.eventTime)) {
        console.error("⭐ Event time format doesn't match expected pattern:", data.eventTime);
        console.log("⭐ Expected format: 'HH:MM AM/PM - HH:MM AM/PM'");
      }
      
      // Check for duplicate event with properly formatted date
      console.log("⭐ Checking for duplicate event");
      const isDuplicate = await checkEventExists(
        data.eventName,
        eventDate,
        data.schoolName
      );
      
      if (isDuplicate) {
        console.log("⭐ Duplicate event detected");
        setSubmissionError("An event with the same name, date, and school already exists. Please check your submission.");
        toast({
          title: "Duplicate Event",
          description: "This event appears to already exist in our database.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return null;
      }
      
      // Prepare event data including the image URL
      const eventData: EventRecord = {
        eventName: data.eventName,
        eventDate: eventDate,
        eventTime: data.eventTime,
        description: data.description,
        schoolName: data.schoolName,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        audienceType: data.audienceType,
        imageUrl: imageUrl
      };
      
      console.log("⭐ Submitting event to database:", JSON.stringify(eventData, null, 2));
      
      // Submit the event with image URL
      const recordId = await submitEvent(eventData);
      
      if (recordId) {
        console.log("⭐ Event submitted successfully with ID:", recordId);
        setIsSuccess(true);
        toast({
          title: "Event Submitted!",
          description: "Your event has been successfully added to our database.",
        });
        return recordId;
      } else {
        console.error("⭐ No record ID returned from submitEvent");
        throw new Error("Failed to save event to database");
      }
    } catch (error) {
      console.error("⭐ Error submitting form:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("⭐ Error details:", errorMessage);
      setSubmissionError("There was a problem submitting your event. Please try again.");
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your event. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSubmission = () => {
    setIsSuccess(false);
    setSubmissionError(null);
  };

  return {
    isSubmitting,
    isSuccess,
    submissionError,
    submitForm,
    resetSubmission
  };
}
