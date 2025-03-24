
import React from "react";
import { Form } from "@/components/ui/form";
import { 
  EventDetailsSection, 
  ContactInfoSection, 
  EventImageSection,
  SubmissionDateSection,
  ParticipationHighlightsSection,
  MediaMessagingSection,
  TonePreferencesSection
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
    // Prevent default form submission to avoid page refresh
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
      return; // Stop form submission if invalid
    }
    
    // Log current form values
    const values = form.getValues();
    console.log("🔶 Current form values:", JSON.stringify(values, null, 2));
    
    // Proceed with form submission
    // Using onSubmit directly instead of form.handleSubmit to ensure preventDefault is respected
    onSubmit(values);
  };

  return (
    <div className="form-container">
      {isSuccess ? (
        <SuccessMessage onReset={handleReset} />
      ) : (
        <Form {...form}>
          {/* Use onSubmit instead of form's native submit to prevent refresh */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <FormHeader submissionError={submissionError} />

            <div className="section-bg">
              <EventDetailsSection form={form} />
            </div>
            
            <div className="section-bg">
              <ParticipationHighlightsSection form={form} />
            </div>
            
            <div className="section-bg">
              <EventImageSection 
                form={form} 
                handleImageChange={handleImageChange} 
                previewImage={previewImage} 
              />
            </div>
            
            <div className="section-bg">
              <MediaMessagingSection form={form} />
            </div>
            
            <div className="section-bg">
              <TonePreferencesSection form={form} />
            </div>
            
            <div className="section-bg">
              <SubmissionDateSection form={form} />
            </div>
            
            <div className="section-bg">
              <ContactInfoSection form={form} />
            </div>
            
            <SubmitButton isSubmitting={isSubmitting} />
          </form>
        </Form>
      )}
    </div>
  );
};

export default EventForm;
