
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "../schema";
import { useImageUpload } from "./useImageUpload";
import { useFormSubmission } from "./useFormSubmission";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function useEventForm() {
  const { toast } = useToast();
  // Track if submission is in progress to prevent duplicate submissions
  const [isSubmitting, setLocalSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      description: "",
      schoolName: "",
      contactName: "",
      contactEmail: "",
      eventLocation: "",
      estimatedAttendance: "",
      participants: "",
      keyHighlights: "",
      specialGuests: "",
      notableAchievements: "",
      imagePermission: false,
      suggestedCaption: "",
      contentHighlight: "",
    },
    mode: "onChange", // Validate on change to catch errors early
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

  const onSubmit = async (data: FormValues) => {
    // Double protection against duplicate submissions
    if (isSubmitting || apiSubmitting) {
      console.log("⛔ Submission already in progress, preventing duplicate");
      return;
    }
    
    // Local submission state for UI feedback
    setLocalSubmitting(true);
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
        return;
      }
      
      console.log("✅ Form validation passed, submitting to API");
      const recordId = await submitForm(data);
      
      if (recordId) {
        console.log("✅ Form submitted successfully with record ID:", recordId);
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
    }
  };

  const handleReset = () => {
    resetSubmission();
    form.reset();
    resetImage();
  };

  // Combine local and API submission states
  const combinedIsSubmitting = isSubmitting || apiSubmitting;

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
