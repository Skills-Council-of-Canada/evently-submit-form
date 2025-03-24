
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

  // Prevent default form submission behavior completely
  const handleSubmit = (e: React.FormEvent) => {
    // This is critical - prevent default form submission which causes page refresh
    e.preventDefault();
    e.stopPropagation(); // Also stop propagation to be extra safe
    
    console.log("🔶 Form submission handler triggered");
    
    // Get and validate form values
    const values = form.getValues();
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
    console.log("🔶 Current form values:", JSON.stringify(values, null, 2));
    
    // Call the onSubmit function directly with form values
    onSubmit(values);
  };

  return (
    <div className="form-container">
      {isSuccess ? (
        <SuccessMessage onReset={handleReset} />
      ) : (
        <Form {...form}>
          {/* Use the custom handleSubmit to ensure no page refresh */}
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
