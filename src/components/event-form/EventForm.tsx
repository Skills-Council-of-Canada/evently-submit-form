
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

  // Custom submission handler that doesn't rely on form events
  const handleCustomSubmit = (e: React.MouseEvent) => {
    // Completely prevent any default behavior
    e.preventDefault();
    e.stopPropagation();
    
    console.log("🔴 Custom submit handler triggered - completely bypassing form submission");
    
    // Get form values
    const values = form.getValues();
    const isValid = form.formState.isValid;
    
    console.log("🔴 Form validation status:", isValid);
    
    if (!isValid) {
      console.log("🔴 Form validation failed with errors:", form.formState.errors);
      toast({
        title: "Form Validation Error",
        description: "Please check all required fields are filled correctly.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("🔴 Form is valid, proceeding with submission");
    console.log("🔴 Form values:", JSON.stringify(values, null, 2));
    
    // Directly call onSubmit with the values
    onSubmit(values);
  };

  const preventKeydownSubmission = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      console.log("🔴 Enter key pressed - preventing default behavior");
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="form-container" onKeyDown={preventKeydownSubmission}>
      {isSuccess ? (
        <SuccessMessage onReset={handleReset} />
      ) : (
        // Using Form from shadcn-ui but ensuring it doesn't behave like an HTML form
        <div className="no-form-wrapper">
          <Form {...form}>
            <div className="space-y-8">
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
              
              {/* Use a regular div with onClick instead of button */}
              <div onClick={handleCustomSubmit} className="submit-button-container">
                <SubmitButton isSubmitting={isSubmitting} />
              </div>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default EventForm;
