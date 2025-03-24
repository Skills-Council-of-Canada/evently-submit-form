
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

  // Complete prevention of form submission behavior
  const handleSubmit = (e: React.FormEvent) => {
    // These two lines are critical to prevent page refresh
    e.preventDefault();
    e.stopPropagation();
    
    console.log("🚨 Form submission handler triggered - default behavior prevented");
    
    // Get form values
    const values = form.getValues();
    const isValid = form.formState.isValid;
    
    console.log("🚨 Form validation status:", isValid);
    
    if (!isValid) {
      console.log("🚨 Form validation failed with errors:", form.formState.errors);
      toast({
        title: "Form Validation Error",
        description: "Please check all required fields are filled correctly.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("🚨 Form is valid, proceeding with submission");
    console.log("🚨 Form values:", JSON.stringify(values, null, 2));
    
    // Call onSubmit directly with the values
    onSubmit(values);
  };

  // Prevent any possible keydown-related submissions
  const preventEnterKeySubmission = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      console.log("🚨 Enter key pressed in input field - preventing default");
      e.preventDefault();
    }
  };

  return (
    <div className="form-container">
      {isSuccess ? (
        <SuccessMessage onReset={handleReset} />
      ) : (
        <Form {...form}>
          {/* Use div instead of form to completely avoid native form behavior */}
          <div className="space-y-8" onKeyDown={preventEnterKeySubmission}>
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
            
            {/* Use a button with onClick instead of submit type */}
            <div onClick={handleSubmit}>
              <SubmitButton isSubmitting={isSubmitting} />
            </div>
          </div>
        </Form>
      )}
    </div>
  );
};

export default EventForm;
