
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "../schema";
import { useImageUpload } from "./useImageUpload";
import { useFormSubmission } from "./useFormSubmission";
import { useState } from "react";
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
      eventTime: "",
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
    const recordId = await submitForm(data);
    
    if (recordId) {
      form.reset();
      resetImage();
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
