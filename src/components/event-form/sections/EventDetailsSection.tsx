
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";
import InlineTimeField from "../components/InlineTimeField";
import { 
  EventNameField, 
  EventDateField, 
  EventLocationField,
  AudienceTypeField,
  EstimatedAttendanceField,
  EventDescriptionField
} from "../components/event-details";

export const EventDetailsSection = ({ form }: { form: UseFormReturn<FormValues> }) => {
  // Make sure the eventTime has a default value if it's not set
  useEffect(() => {
    const currentTime = form.getValues("eventTime");
    if (!currentTime) {
      const defaultTime = "8:00 AM - 9:00 AM";
      form.setValue("eventTime", defaultTime);
      console.log("Set default event time:", defaultTime);
    }
  }, [form]);

  return (
    <div className="form-section">
      <h2 className="form-subtitle">Event Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EventNameField form={form} />
        <EventDateField form={form} />
        <InlineTimeField form={form} />
        <EventLocationField form={form} />
        <AudienceTypeField form={form} />
        <EstimatedAttendanceField form={form} />
      </div>
      
      <div className="mt-6">
        <EventDescriptionField form={form} />
      </div>
    </div>
  );
};
