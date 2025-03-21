
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

  // Correctly handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission triggered");
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
