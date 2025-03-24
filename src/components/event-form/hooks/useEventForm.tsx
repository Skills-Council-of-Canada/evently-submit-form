import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "../schema";
import { useImageUpload } from "./useImageUpload";
import { useFormSubmission } from "./useFormSubmission";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";

export function useEventForm() {
  const { toast } = useToast();
  // Track if submission is in progress to prevent duplicate submissions
  const [isSubmitting, setLocalSubmitting] = useState(false);
  
  // Add a ref to track submission state to prevent race conditions
  const submissionInProgressRef = useRef(false);
  
  // Load persisted form values from storage
  const getSavedFormState = (): Partial<FormValues> => {
    try {
      // Try localStorage first, then sessionStorage as fallback
      const savedState = localStorage.getItem('eventFormState') || 
                         sessionStorage.getItem('eventFormState');
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (e) {
      console.error('Error restoring form state:', e);
    }
    return {};
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...getSavedFormState(), // Load saved values
      eventName: getSavedFormState().eventName || "",
      description: getSavedFormState().description || "",
      schoolName: getSavedFormState().schoolName || "",
      contactName: getSavedFormState().contactName || "",
      contactEmail: getSavedFormState().contactEmail || "",
      eventLocation: getSavedFormState().eventLocation || "",
      estimatedAttendance: getSavedFormState().estimatedAttendance || "",
      participants: getSavedFormState().participants || "",
      keyHighlights: getSavedFormState().keyHighlights || "",
      specialGuests: getSavedFormState().specialGuests || "",
      notableAchievements: getSavedFormState().notableAchievements || "",
      imagePermission: getSavedFormState().imagePermission || false,
      suggestedCaption: getSavedFormState().suggestedCaption || "",
      contentHighlight: getSavedFormState().contentHighlight || "",
    },
    mode: "onChange", // Validate on change to catch errors early
    // Prevent form from resetting on component unmount
    shouldUnregister: false,
  });

  const { 
    previewImage, 
    handleImageChange, 
    resetImage 
  } = useImageUpload();
  
  const { 
    isSubmitting: apiSubmitting, 
    isSuccess, 
    submissionError, 
    submitForm, 
    resetSubmission 
  } = useFormSubmission();

  // Save form values to storage whenever they change
  useEffect(() => {
    const saveFormState = () => {
      if (isSuccess) return; // Don't save if form was successfully submitted
      
      // Get current form values
      const formValues = form.getValues();
      
      // Save to both storage types for redundancy
      if (Object.keys(formValues).length > 0) {
        const formStateJSON = JSON.stringify(formValues);
        localStorage.setItem('eventFormState', formStateJSON);
        sessionStorage.setItem('eventFormState', formStateJSON);
      }
    };
    
    // Save form state every 2 seconds if it's dirty
    const intervalId = setInterval(() => {
      if (form.formState.isDirty) {
        saveFormState();
      }
    }, 2000);
    
    // Save immediately when values change
    const subscription = form.watch(() => {
      if (form.formState.isDirty) {
        saveFormState();
      }
    });
    
    // Also save on beforeunload event
    const handleBeforeUnload = () => {
      saveFormState();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      clearInterval(intervalId);
      subscription.unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveFormState(); // Save on unmount
    };
  }, [form, isSuccess]);

  // Restore form state on mount if needed
  useEffect(() => {
    // Only restore if not already successful
    if (!isSuccess) {
      const savedState = getSavedFormState();
      if (Object.keys(savedState).length > 0) {
        // Reset form with saved values
        Object.keys(savedState).forEach(key => {
          if (key !== 'eventImage') { // Skip file inputs
            form.setValue(key as any, savedState[key as keyof FormValues], {
              shouldValidate: true,
              shouldDirty: false, // Don't mark as dirty when restoring
            });
          }
        });
      }
    }
  }, [form, isSuccess]);

  const onSubmit = async (data: FormValues) => {
    // Triple protection against duplicate submissions using both state and ref
    if (isSubmitting || apiSubmitting || submissionInProgressRef.current) {
      console.log("⛔ Submission already in progress, preventing duplicate submission");
      return;
    }
    
    // Set both state and ref
    setLocalSubmitting(true);
    submissionInProgressRef.current = true;
    
    console.log("✅ Starting form submission with data:", JSON.stringify(data, null, 2));
    
    try {
      // Validate data against schema before submitting
      const validationResult = formSchema.safeParse(data);
      if (!validationResult.success) {
        console.error("❌ Form validation failed:", validationResult.error);
        toast({
          title: "Validation Error",
          description: "Please check all required fields are filled correctly.",
          variant: "destructive",
        });
        setLocalSubmitting(false);
        submissionInProgressRef.current = false;
        return;
      }
      
      console.log("✅ Form validation passed, submitting to API");
      const recordId = await submitForm(data);
      
      if (recordId) {
        console.log("✅ Form submitted successfully with record ID:", recordId);
        // Clear form state in storage on successful submission
        localStorage.removeItem('eventFormState');
        sessionStorage.removeItem('eventFormState');
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
      setLocalSubmitting(false);
      submissionInProgressRef.current = false;
    }
  };

  const handleReset = () => {
    resetSubmission();
    form.reset();
    resetImage();
    // Clear form state in storage
    localStorage.removeItem('eventFormState');
    sessionStorage.removeItem('eventFormState');
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
