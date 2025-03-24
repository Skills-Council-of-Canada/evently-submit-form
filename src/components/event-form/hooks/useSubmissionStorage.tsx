
import { useState, useEffect } from "react";

/**
 * Custom hook to manage form submission state persistence to localStorage and sessionStorage
 */
export function useSubmissionStorage() {
  // Check localStorage first, then fall back to sessionStorage for better persistence
  const [isSuccess, setIsSuccess] = useState(() => {
    return localStorage.getItem('formSubmissionSuccess') === 'true' || 
           sessionStorage.getItem('formSubmissionSuccess') === 'true';
  });
  
  const [submissionError, setSubmissionError] = useState<string | null>(() => {
    return localStorage.getItem('submissionError') || 
           sessionStorage.getItem('submissionError') || 
           null;
  });

  // Save submission state to both sessionStorage and localStorage when it changes
  useEffect(() => {
    if (isSuccess) {
      sessionStorage.setItem('formSubmissionSuccess', 'true');
      localStorage.setItem('formSubmissionSuccess', 'true');
    } else {
      sessionStorage.removeItem('formSubmissionSuccess');
      localStorage.removeItem('formSubmissionSuccess');
    }
    
    if (submissionError) {
      sessionStorage.setItem('submissionError', submissionError);
      localStorage.setItem('submissionError', submissionError);
    } else {
      sessionStorage.removeItem('submissionError');
      localStorage.removeItem('submissionError');
    }
  }, [isSuccess, submissionError]);

  const clearSubmissionStorage = () => {
    localStorage.removeItem('formSubmissionSuccess');
    sessionStorage.removeItem('formSubmissionSuccess');
    localStorage.removeItem('submissionError');
    sessionStorage.removeItem('submissionError');
    localStorage.removeItem('eventFormState');
    sessionStorage.removeItem('eventFormState');
    localStorage.removeItem('lastUploadedImageUrl');
    localStorage.removeItem('lastSubmittedRecordId');
  };

  return {
    isSuccess,
    setIsSuccess,
    submissionError,
    setSubmissionError,
    clearSubmissionStorage
  };
}
