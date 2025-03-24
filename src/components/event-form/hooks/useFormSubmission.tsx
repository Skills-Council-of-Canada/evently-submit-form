
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { submitEvent, checkEventExists, EventRecord } from "@/services/events";
import { uploadEventImage } from "@/services/imageService";
import { FormValues } from "../schema";

export function useFormSubmission() {
  // Check session storage for any saved submission state on initialization
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(() => {
    return sessionStorage.getItem('formSubmissionSuccess') === 'true';
  });
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Save submission state to sessionStorage when it changes
  useEffect(() => {
    if (isSuccess) {
      sessionStorage.setItem('formSubmissionSuccess', 'true');
    } else {
      sessionStorage.removeItem('formSubmissionSuccess');
    }
  }, [isSuccess]);

  const submitForm = async (data: FormValues) => {
    console.log("📝 Form submission started with data:", JSON.stringify(data, null, 2));
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      // Handle image upload if an image was selected
      let imageUrl = null;
      if (data.eventImage && data.eventImage.length > 0) {
        const imageFile = data.eventImage[0];
        console.log("📝 Uploading image:", imageFile.name);
        imageUrl = await uploadEventImage(imageFile);
        console.log("📝 Image uploaded successfully. URL:", imageUrl);
      } else {
        console.log("📝 No image to upload");
      }
      
      // Format the date properly - this is critical
      console.log("📝 Original event date:", data.eventDate);
      const eventDate = data.eventDate instanceof Date ? data.eventDate : new Date(data.eventDate);
      console.log("📝 Formatted event date:", eventDate.toISOString());
      
      // Ensure eventTime is properly formatted
      console.log("📝 Event time from form:", data.eventTime);
      if (!data.eventTime || typeof data.eventTime !== 'string') {
        console.error("📝 Event time is invalid:", data.eventTime);
        throw new Error("Invalid event time format");
      }
      
      // Validate time format
      const timePattern = /(\d{1,2}):(\d{2}) (AM|PM) - (\d{1,2}):(\d{2}) (AM|PM)/;
      if (!timePattern.test(data.eventTime)) {
        console.error("📝 Event time format doesn't match expected pattern:", data.eventTime);
        console.log("📝 Expected format: 'HH:MM AM/PM - HH:MM AM/PM'");
      }
      
      // TEMPORARILY BYPASSING DUPLICATE CHECK - we'll go straight to submission
      console.log("📝 Bypassing duplicate check for testing");
      
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
        submissionDate: data.submissionDate,
        imageUrl: imageUrl
      };
      
      console.log("📝 Submitting event to database:", JSON.stringify(eventData, null, 2));
      
      // Submit the event with image URL
      const recordId = await submitEvent(eventData);
      
      if (recordId) {
        console.log("📝 Event submitted successfully with ID:", recordId);
        setIsSuccess(true);
        toast({
          title: "Event Submitted!",
          description: "Your event has been successfully added to our database.",
        });
        return recordId;
      } else {
        console.error("📝 No record ID returned from submitEvent");
        throw new Error("Failed to save event to database");
      }
    } catch (error) {
      console.error("📝 Error submitting form:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("📝 Error details:", errorMessage);
      setSubmissionError("There was a problem submitting your event. Please try again.");
      toast({
        title: "Submission Error",
        description: errorMessage || "There was a problem submitting your event. Please try again.",
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
    // Also clear sessionStorage when resetting
    sessionStorage.removeItem('formSubmissionSuccess');
  };

  return {
    isSubmitting,
    isSuccess,
    submissionError,
    submitForm,
    resetSubmission
  };
}
