
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../../schema";
import InlineTimeField from "../InlineTimeField";

interface EventTimeFieldProps {
  form: UseFormReturn<FormValues>;
}

export const EventTimeField = ({ form }: EventTimeFieldProps) => {
  return (
    <div className="w-full">
      <InlineTimeField form={form} />
    </div>
  );
};
