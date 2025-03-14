
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { submitEventToAirtable, checkEventExists, EventRecord } from "@/services/airtableService";
import { formSchema, FormValues } from "../schema";

export function useEventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const onSubmit = async (data: FormValues) => {
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
        return;
      }
      
      const recordId = await submitEventToAirtable(data as EventRecord);
      
      if (recordId) {
        setIsSuccess(true);
        toast({
          title: "Event Submitted!",
          description: "Your event has been successfully added to our database.",
        });
        
        form.reset();
        setPreviewImage(null);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setSubmissionError(null);
    form.reset();
    setPreviewImage(null);
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
