
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { submitEvent, checkEventExists, EventRecord } from "@/services/events";
import { uploadEventImage } from "@/services/imageService";
import { FormValues } from "../schema";

export function useFormSubmission() {
  // Check localStorage first, then fall back to sessionStorage for better persistence
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(() => {
    return localStorage.getItem('formSubmissionSuccess') === 'true' || 
           sessionStorage.getItem('formSubmissionSuccess') === 'true';
  });
  const [submissionError, setSubmissionError] = useState<string | null>(() => {
    return localStorage.getItem('submissionError') || 
           sessionStorage.getItem('submissionError') || 
           null;
  });

  // Save submission state to both sessionStorage and localStorage when it changes
  useEffect(() => {
    if (isSuccess) {
      sessionStorage.setItem('formSubmissionSuccess', 'true');
      localStorage.setItem('formSubmissionSuccess', 'true');
    } else {
      sessionStorage.removeItem('formSubmissionSuccess');
      localStorage.removeItem('formSubmissionSuccess');
    }
    
    if (submissionError) {
      sessionStorage.setItem('submissionError', submissionError);
      localStorage.setItem('submissionError', submissionError);
    } else {
      sessionStorage.removeItem('submissionError');
      localStorage.removeItem('submissionError');
    }
  }, [isSuccess, submissionError]);

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
        
        // Save submission success to both storage methods
        localStorage.setItem('formSubmissionSuccess', 'true');
        sessionStorage.setItem('formSubmissionSuccess', 'true');
        localStorage.setItem('lastSubmittedRecordId', recordId);
        
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
      
      // Save error to storage
      localStorage.setItem('submissionError', "There was a problem submitting your event. Please try again.");
      sessionStorage.setItem('submissionError', "There was a problem submitting your event. Please try again.");
      
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
    // Clear all storage when resetting
    localStorage.removeItem('formSubmissionSuccess');
    sessionStorage.removeItem('formSubmissionSuccess');
    localStorage.removeItem('submissionError');
    sessionStorage.removeItem('submissionError');
    localStorage.removeItem('eventFormState');
    sessionStorage.removeItem('eventFormState');
    localStorage.removeItem('lastUploadedImageUrl');
    localStorage.removeItem('lastSubmittedRecordId');
  };

  return {
    isSubmitting,
    isSuccess,
    submissionError,
    submitForm,
    resetSubmission
  };
}
