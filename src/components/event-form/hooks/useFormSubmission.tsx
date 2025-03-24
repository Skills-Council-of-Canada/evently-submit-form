
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { FormValues } from "../schema";
import { useSubmissionStorage } from "./useSubmissionStorage";
import { useEventSubmit } from "./useEventSubmit";

/**
 * Main hook for form submission handling that orchestrates the process
 */
export function useFormSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { 
    isSuccess, 
    setIsSuccess, 
    submissionError, 
    setSubmissionError,
    clearSubmissionStorage 
  } = useSubmissionStorage();
  
  const { submitEventData } = useEventSubmit();

  const submitForm = async (data: FormValues) => {
    console.log("📝 Form submission started with data:", JSON.stringify(data, null, 2));
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      const recordId = await submitEventData(data);
      
      if (recordId) {
        setIsSuccess(true);
        
        // Clear any previously stored form data
        localStorage.removeItem('eventFormState');
        sessionStorage.removeItem('eventFormState');
        localStorage.removeItem('previewImage');
        sessionStorage.removeItem('previewImage');
        
        toast({
          title: "Event Submitted!",
          description: "Your event has been successfully added to our database.",
        });
        return recordId;
      } else {
        setSubmissionError("There was a problem submitting your event. Please try again.");
        return null;
      }
    } catch (error) {
      console.error("📝 Error in submitForm:", error);
      setSubmissionError("There was a problem submitting your event. Please try again.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSubmission = () => {
    setIsSuccess(false);
    setSubmissionError(null);
    clearSubmissionStorage();
    
    // Clear all form-related localStorage and sessionStorage items
    localStorage.removeItem('eventFormState');
    sessionStorage.removeItem('eventFormState');
    localStorage.removeItem('previewImage');
    sessionStorage.removeItem('previewImage');
  };

  return {
    isSubmitting,
    isSuccess,
    submissionError,
    submitForm,
    resetSubmission
  };
}
