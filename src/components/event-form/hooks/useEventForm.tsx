
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "../schema";
import { useImageUpload } from "./useImageUpload";
import { useFormSubmission } from "./useFormSubmission";
import { useFormPersistence } from "./useFormPersistence";
import { useFormSubmissionState } from "./useFormSubmissionState";
import { useFormDefaultValues } from "./useFormDefaultValues";

export function useEventForm() {
  // Get form submission state management
  const {
    isSubmitting,
    submissionInProgressRef,
    validateFormData,
    setSubmitting,
    isSubmissionInProgress,
    toast
  } = useFormSubmissionState();

  // Get saved form state 
  const getSavedFormState = (): Partial<FormValues> => {
    try {
      // Try localStorage first, then sessionStorage as fallback
      const savedState = localStorage.getItem('eventFormState') || 
                       sessionStorage.getItem('eventFormState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Convert string dates to Date objects
        if (parsedState.submissionDate && typeof parsedState.submissionDate === 'string') {
          parsedState.submissionDate = new Date(parsedState.submissionDate);
        }
        if (parsedState.eventDate && typeof parsedState.eventDate === 'string') {
          parsedState.eventDate = new Date(parsedState.eventDate);
        }
        
        return parsedState;
      }
    } catch (e) {
      console.error('Error restoring form state:', e);
    }
    return {};
  };
  
  // Get default values for the form
  const defaultValues = useFormDefaultValues(getSavedFormState());
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange", // Validate on change to catch errors early
    // Prevent form from resetting on component unmount
    shouldUnregister: false,
  });

  // Get form submission API
  const { 
    isSubmitting: apiSubmitting, 
    isSuccess, 
    submissionError, 
    submitForm, 
    resetSubmission 
  } = useFormSubmission();

  // Setup form persistence
  const { clearStoredFormData } = useFormPersistence(form, isSuccess);
  
  // Setup image upload
  const { 
    previewImage, 
    handleImageChange, 
    resetImage 
  } = useImageUpload();

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    // Triple protection against duplicate submissions using both state and ref
    if (isSubmissionInProgress(apiSubmitting)) {
      console.log("⛔ Submission already in progress, preventing duplicate submission");
      return;
    }
    
    // Set both state and ref
    setSubmitting(true);
    
    console.log("✅ Starting form submission with data:", JSON.stringify(data, null, 2));
    
    try {
      // Validate form data
      if (!validateFormData(data)) {
        setSubmitting(false);
        return;
      }
      
      console.log("✅ Form validation passed, submitting to API");
      const recordId = await submitForm(data);
      
      if (recordId) {
        console.log("✅ Form submitted successfully with record ID:", recordId);
        // Clear form state in storage on successful submission
        clearStoredFormData();
        form.reset();
        resetImage();
      } else {
        console.error("❌ Form submission failed - no record ID returned");
        toast({
          title: "Submission Error",
          description: "Failed to save your event. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("❌ Error in form submission:", error);
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    resetSubmission();
    form.reset();
    resetImage();
    // Clear form state in storage
    clearStoredFormData();
  };

  // Combine local and API submission states
  const combinedIsSubmitting = isSubmitting || apiSubmitting || submissionInProgressRef.current;

  return {
    form,
    isSubmitting: combinedIsSubmitting,
    isSuccess,
    previewImage,
    submissionError,
    handleImageChange,
    onSubmit,
    handleReset
  };
}
