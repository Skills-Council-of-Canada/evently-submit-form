
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormHeaderProps {
  submissionError: string | null;
}

const FormHeader: React.FC<FormHeaderProps> = ({ submissionError }) => {
  return (
    <>
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
    </>
  );
};

export default FormHeader;
