
import React from "react";
import { Button } from "@/components/ui/button";

interface SuccessMessageProps {
  onReset: () => void;
}

const SuccessMessage = ({ onReset }: SuccessMessageProps) => {
  return (
    <div className="text-center py-10">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Thank You for Your Submission!
      </h2>
      <p className="text-gray-600 mb-6">
        Your event has been successfully submitted and is pending review.
        You'll receive a confirmation email shortly.
      </p>
      <Button onClick={onReset} className="bg-event-purple hover:bg-event-dark-purple">
        Submit Another Event
      </Button>
    </div>
  );
};

export default SuccessMessage;
