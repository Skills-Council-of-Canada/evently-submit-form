
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { submitEvent, checkEventExists, EventRecord } from "@/services/eventService";
import { FormValues } from "../schema";

export function useFormSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const submitForm = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      const isDuplicate = await checkEventExists(
        data.eventName,
        data.eventDate,
        data.schoolName
      );
      
      if (isDuplicate) {
        setSubmissionError("An event with the same name, date, and school already exists. Please check your submission.");
        toast({
          title: "Duplicate Event",
          description: "This event appears to already exist in our database.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return null;
      }
      
      const recordId = await submitEvent(data as EventRecord);
      
      if (recordId) {
        setIsSuccess(true);
        toast({
          title: "Event Submitted!",
          description: "Your event has been successfully added to our database.",
        });
        return recordId;
      } else {
        throw new Error("Failed to save event to database");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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
