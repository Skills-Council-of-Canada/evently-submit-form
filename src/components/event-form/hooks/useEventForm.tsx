
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "../schema";
import { useImageUpload } from "./useImageUpload";
import { useFormSubmission } from "./useFormSubmission";
import { useToast } from "@/hooks/use-toast";

export function useEventForm() {
  const { toast } = useToast();
  
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
  });

  const { 
    previewImage, 
    handleImageChange, 
    resetImage 
  } = useImageUpload();
  
  const { 
    isSubmitting, 
    isSuccess, 
    submissionError, 
    submitForm, 
    resetSubmission 
  } = useFormSubmission();

  const onSubmit = async (data: FormValues) => {
    // Prevent the function from proceeding if already submitting
    if (isSubmitting) {
      console.log("Already submitting, skipping duplicate submission");
      return;
    }
    
    console.log("onSubmit called with data:", data);
    
    try {
      // Validate data against schema before submitting
      const validationResult = formSchema.safeParse(data);
      if (!validationResult.success) {
        console.error("Form validation failed:", validationResult.error);
        toast({
          title: "Validation Error",
          description: "Please check all required fields are filled correctly.",
          variant: "destructive",
        });
        return;
      }
      
      const recordId = await submitForm(data);
      
      if (recordId) {
        console.log("Form submitted successfully with record ID:", recordId);
        form.reset();
        resetImage();
      } else {
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    resetSubmission();
    form.reset();
    resetImage();
  };

  return {
    form,
    isSubmitting,
    isSuccess,
    previewImage,
    submissionError,
    handleImageChange,
    onSubmit,
    handleReset
  };
}
