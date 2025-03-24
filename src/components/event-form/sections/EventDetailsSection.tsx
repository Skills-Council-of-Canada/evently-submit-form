
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";
import { 
  EventNameField, 
  EventDateField, 
  EventLocationField,
  AudienceTypeField,
  EstimatedAttendanceField,
  EventDescriptionField
} from "../components/event-details";

export const EventDetailsSection = ({ form }: { form: UseFormReturn<FormValues> }) => {
  return (
    <div className="form-section">
      <h2 className="form-subtitle">Event Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <EventNameField form={form} />
        </div>
        <div className="flex flex-col">
          <EventDateField form={form} />
        </div>
        <div className="flex flex-col">
          <EventLocationField form={form} />
        </div>
        <div className="flex flex-col">
          <AudienceTypeField form={form} />
        </div>
        <div className="flex flex-col">
          <EstimatedAttendanceField form={form} />
        </div>
      </div>
      
      <div className="mt-6">
        <EventDescriptionField form={form} />
      </div>
    </div>
  );
};
