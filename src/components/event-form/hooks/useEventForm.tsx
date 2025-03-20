
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "../schema";
import { useImageUpload } from "./useImageUpload";
import { useFormSubmission } from "./useFormSubmission";
import { useState, useEffect } from "react";
import { getAllSchools, School } from "@/services/schoolService";
import { useToast } from "@/hooks/use-toast";

export function useEventForm() {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(true);
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

  // Fetch schools from Supabase when component mounts
  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoadingSchools(true);
      try {
        console.log("Fetching schools...");
        const schoolsData = await getAllSchools();
        console.log("Schools fetched:", schoolsData.length);
        setSchools(schoolsData);
        
        if (schoolsData.length === 0) {
          console.warn("No schools were fetched from the database");
          toast({
            title: "Warning",
            description: "Unable to load school list. Please try again later.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
        toast({
          title: "Error",
          description: "Failed to load schools. Please refresh the page and try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingSchools(false);
      }
    };

    fetchSchools();
  }, [toast]);

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
    handleReset,
    schools,
    isLoadingSchools
  };
}
