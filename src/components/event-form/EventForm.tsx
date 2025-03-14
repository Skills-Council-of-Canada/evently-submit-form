
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { 
  submitEventToAirtable, 
  checkEventExists, 
  EventRecord 
} from "@/services/airtableService";
import { 
  EventDetailsSection, 
  ContactInfoSection, 
  EventImageSection, 
  formSchema, 
  FormValues 
} from "./FormSections";
import SuccessMessage from "./SuccessMessage";

const EventForm = () => {
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

  return (
    <div className="form-container">
      {isSuccess ? (
        <SuccessMessage onReset={handleReset} />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <h1 className="form-title">School Event Submission Form</h1>
            
            <Alert className="bg-blue-50 border-blue-200 mb-6">
              <AlertTitle className="text-blue-800">Before you begin</AlertTitle>
              <AlertDescription className="text-blue-700">
                Please complete all required fields marked with an asterisk (*). Be sure to review your information before submitting.
              </AlertDescription>
            </Alert>

            {submissionError && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{submissionError}</AlertDescription>
              </Alert>
            )}

            <EventDetailsSection 
              form={form} 
              handleImageChange={handleImageChange} 
              previewImage={previewImage} 
            />
            
            <ContactInfoSection form={form} />
            
            <EventImageSection 
              form={form} 
              handleImageChange={handleImageChange} 
              previewImage={previewImage} 
            />
            
            <div className="pt-4 border-t flex justify-end">
              <Button 
                type="submit" 
                className="bg-event-purple hover:bg-event-dark-purple w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Submitting..." : "Submit Event"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default EventForm;
