
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { FormValues } from "../schema";
import { formSchema } from "../schema";

export function useFormSubmissionState() {
  const { toast } = useToast();
  // Track if submission is in progress to prevent duplicate submissions
  const [isSubmitting, setLocalSubmitting] = useState(false);
  
  // Add a ref to track submission state to prevent race conditions
  const submissionInProgressRef = useRef(false);

  // Validate form data before submission
  const validateFormData = (data: FormValues) => {
    // Ensure submissionDate is a Date object before validation
    if (data.submissionDate && typeof data.submissionDate === 'string') {
      data.submissionDate = new Date(data.submissionDate);
    }
    
    // Validate data against schema before submitting
    const validationResult = formSchema.safeParse(data);
    if (!validationResult.success) {
      console.error("❌ Form validation failed:", validationResult.error);
      toast({
        title: "Validation Error",
        description: "Please check all required fields are filled correctly.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  // Set submission state
  const setSubmitting = (value: boolean) => {
    setLocalSubmitting(value);
    submissionInProgressRef.current = value;
  };

  // Check if submission is already in progress
  const isSubmissionInProgress = (apiSubmitting: boolean) => {
    return isSubmitting || apiSubmitting || submissionInProgressRef.current;
  };

  return {
    isSubmitting,
    submissionInProgressRef,
    validateFormData,
    setSubmitting,
    isSubmissionInProgress,
    toast
  };
}
