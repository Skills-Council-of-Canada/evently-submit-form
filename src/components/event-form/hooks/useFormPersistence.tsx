
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";

export function useFormPersistence(form: UseFormReturn<FormValues>, isSuccess: boolean) {
  // Load persisted form values from storage
  const getSavedFormState = (): Partial<FormValues> => {
    try {
      // Try localStorage first, then sessionStorage as fallback
      const savedState = localStorage.getItem('eventFormState') || 
                         sessionStorage.getItem('eventFormState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Convert string dates to Date objects
        if (parsedState.submissionDate && typeof parsedState.submissionDate === 'string') {
          parsedState.submissionDate = new Date(parsedState.submissionDate);
        }
        if (parsedState.eventDate && typeof parsedState.eventDate === 'string') {
          parsedState.eventDate = new Date(parsedState.eventDate);
        }
        
        return parsedState;
      }
    } catch (e) {
      console.error('Error restoring form state:', e);
    }
    return {};
  };

  // Save form values to storage whenever they change
  useEffect(() => {
    const saveFormState = () => {
      if (isSuccess) return; // Don't save if form was successfully submitted
      
      // Get current form values
      const formValues = form.getValues();
      
      // Ensure proper serialization by handling Date objects
      const formValuesToSave = { ...formValues };
      
      // Save to both storage types for redundancy
      if (Object.keys(formValuesToSave).length > 0) {
        const formStateJSON = JSON.stringify(formValuesToSave);
        localStorage.setItem('eventFormState', formStateJSON);
        sessionStorage.setItem('eventFormState', formStateJSON);
      }
    };
    
    // Save form state every 2 seconds if it's dirty
    const intervalId = setInterval(() => {
      if (form.formState.isDirty) {
        saveFormState();
      }
    }, 2000);
    
    // Save immediately when values change
    const subscription = form.watch(() => {
      if (form.formState.isDirty) {
        saveFormState();
      }
    });
    
    // Also save on beforeunload event
    const handleBeforeUnload = () => {
      saveFormState();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      clearInterval(intervalId);
      subscription.unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveFormState(); // Save on unmount
    };
  }, [form, isSuccess]);

  // Restore form state on mount
  useEffect(() => {
    // Only restore if not already successful
    if (!isSuccess) {
      const savedState = getSavedFormState();
      if (Object.keys(savedState).length > 0) {
        // Reset form with saved values
        Object.keys(savedState).forEach(key => {
          if (key !== 'eventImage') { // Skip file inputs
            form.setValue(key as any, savedState[key as keyof FormValues], {
              shouldValidate: true,
              shouldDirty: false, // Don't mark as dirty when restoring
            });
          }
        });
      }
    }
  }, [form, isSuccess]);

  // Function to clear stored form data
  const clearStoredFormData = () => {
    localStorage.removeItem('eventFormState');
    sessionStorage.removeItem('eventFormState');
  };

  return {
    getSavedFormState,
    clearStoredFormData
  };
}
