
import React from "react";
import { Form } from "@/components/ui/form";
import { 
  EventDetailsSection, 
  ContactInfoSection, 
  EventImageSection 
} from "./sections";
import SuccessMessage from "./SuccessMessage";
import FormHeader from "./FormHeader";
import SubmitButton from "./SubmitButton";
import { useEventForm } from "./hooks/useEventForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const EventForm = () => {
  const {
    form,
    isSubmitting,
    isSuccess,
    previewImage,
    submissionError,
    handleImageChange,
    onSubmit,
    handleReset
  } = useEventForm();

  // Add debugging toast to verify form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔶 Form submission triggered");
    
    // Verify form is valid before submitting
    const isValid = form.formState.isValid;
    console.log("🔶 Form is valid:", isValid);
    console.log("🔶 Form errors:", form.formState.errors);
    
    if (!isValid) {
      toast({
        title: "Form Validation Error",
        description: "Please check all required fields are filled correctly.",
        variant: "destructive",
      });
    }
    
    // Log current form values
    const values = form.getValues();
    console.log("🔶 Current form values:", JSON.stringify(values, null, 2));
    
    // Proceed with form submission
    form.handleSubmit(onSubmit)(e);
  };

  return (
    <div className="form-container">
      {isSuccess ? (
        <SuccessMessage onReset={handleReset} />
      ) : (
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <FormHeader submissionError={submissionError} />

            <EventDetailsSection form={form} />
            
            <ContactInfoSection form={form} />
            
            <EventImageSection 
              form={form} 
              handleImageChange={handleImageChange} 
              previewImage={previewImage} 
            />
            
            <SubmitButton isSubmitting={isSubmitting} />
          </form>
        </Form>
      )}
    </div>
  );
};

export default EventForm;
