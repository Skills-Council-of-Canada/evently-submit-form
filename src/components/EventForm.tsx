import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Clock, Image, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  submitEventToAirtable, 
  checkEventExists, 
  EventRecord 
} from "@/services/airtableService";

const formSchema = z.object({
  eventName: z.string().min(3, {
    message: "Event name must be at least 3 characters.",
  }),
  eventDate: z.date({
    required_error: "Event date is required.",
  }),
  eventTime: z.string().min(1, {
    message: "Event time is required.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, {
    message: "Description cannot exceed 500 characters.",
  }),
  schoolName: z.string().min(3, {
    message: "School name must be at least 3 characters.",
  }),
  contactName: z.string().min(3, {
    message: "Contact name must be at least 3 characters.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  audienceType: z.string({
    required_error: "Please select an audience type.",
  }),
  eventImage: z.instanceof(FileList).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EventForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      description: "",
      schoolName: "",
      contactName: "",
      contactEmail: "",
      eventTime: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      const isDuplicate = await checkEventExists(
        data.eventName,
        data.eventDate,
        data.schoolName
      );
      
      if (isDuplicate) {
        setSubmissionError("An event with the same name, date, and school already exists. Please check your submission.");
        toast({
          title: "Duplicate Event",
          description: "This event appears to already exist in our database.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      const recordId = await submitEventToAirtable(data as EventRecord);
      
      if (recordId) {
        setIsSuccess(true);
        toast({
          title: "Event Submitted!",
          description: "Your event has been successfully added to our database.",
        });
        
        form.reset();
        setPreviewImage(null);
      } else {
        throw new Error("Failed to save event to database");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionError("There was a problem submitting your event. Please try again.");
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setSubmissionError(null);
    form.reset();
    setPreviewImage(null);
  };

  return (
    <div className="form-container">
      {isSuccess ? (
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
          <Button onClick={handleReset} className="bg-event-purple hover:bg-event-dark-purple">
            Submit Another Event
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

            <div className="form-section">
              <h2 className="form-subtitle">Event Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="eventName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required="true">
                        Event Name *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Spring Science Fair" {...field} />
                      </FormControl>
                      <FormDescription>
                        The official name of your event
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel aria-required="true">
                        Event Date *
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        When the event will take place
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="eventTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required="true">
                        Event Time *
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="6:00 PM - 8:00 PM"
                            {...field}
                          />
                        </FormControl>
                        <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                      <FormDescription>
                        The start and end time of your event
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="audienceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required="true">
                        Audience Type *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select audience type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="students">Students</SelectItem>
                          <SelectItem value="parents">Parents</SelectItem>
                          <SelectItem value="faculty">Faculty</SelectItem>
                          <SelectItem value="community">Community</SelectItem>
                          <SelectItem value="all">All</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Who is the event intended for
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required="true">
                        Event Description *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide details about your event..."
                          className="resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe what the event is about (500 characters max)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="form-section">
              <h2 className="form-subtitle">School & Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="schoolName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required="true">
                        School Name *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Washington High School" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required="true">
                        Contact Person *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required="true">
                        Contact Email *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="jsmith@school.edu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="form-section">
              <h2 className="form-subtitle">Event Image</h2>
              
              <FormField
                control={form.control}
                name="eventImage"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Event Image (Optional)</FormLabel>
                    <FormControl>
                      <div className="grid w-full gap-1.5">
                        <label 
                          htmlFor="picture" 
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Image className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG or GIF (MAX. 2MB)
                            </p>
                          </div>
                          <Input
                            id="picture"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              onChange(e.target.files);
                              handleImageChange(e);
                            }}
                            {...fieldProps}
                          />
                        </label>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload an image to represent your event
                    </FormDescription>
                    <FormMessage />
                    
                    {previewImage && (
                      <Card className="mt-2 overflow-hidden">
                        <CardContent className="p-2">
                          <div className="relative aspect-video">
                            <img
                              src={previewImage}
                              alt="Event preview"
                              className="object-cover rounded-md w-full h-full"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-4 border-t flex justify-end">
              <Button 
                type="submit" 
                className="bg-event-purple hover:bg-event-dark-purple w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Submitting..." : "Submit Event"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default EventForm;
