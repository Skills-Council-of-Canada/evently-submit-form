
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <div className="pt-4 border-t flex justify-end">
      <Button 
        className="bg-event-purple hover:bg-event-dark-purple w-full md:w-auto"
        disabled={isSubmitting}
        type="button" // Explicitly set to button not submit
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSubmitting ? "Submitting..." : "Submit Event"}
      </Button>
    </div>
  );
};

export default SubmitButton;
