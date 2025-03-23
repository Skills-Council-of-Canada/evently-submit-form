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
      messageTone: "",
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
    if (isSubmitting) return;
    
    console.log("onSubmit called with data:", data);
    
    const recordId = await submitForm(data);
    
    if (recordId) {
      console.log("Form submitted successfully with record ID:", recordId);
      form.reset();
      resetImage();
    } else {
      console.error("Form submission failed");
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
