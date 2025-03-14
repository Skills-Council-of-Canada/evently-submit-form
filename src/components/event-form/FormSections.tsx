
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Clock, Image } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Form schema from the original component
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

export type FormValues = z.infer<typeof formSchema>;

// Event Details Section
export const EventDetailsSection = ({ form, handleImageChange, previewImage }: { 
  form: UseFormReturn<FormValues>, 
  handleImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  previewImage?: string | null
}) => {
  return (
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
  );
};

// School & Contact Information Section
export const ContactInfoSection = ({ form }: { form: UseFormReturn<FormValues> }) => {
  return (
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
  );
};

// Event Image Section
export const EventImageSection = ({ 
  form, 
  handleImageChange, 
  previewImage 
}: { 
  form: UseFormReturn<FormValues>,
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  previewImage: string | null
}) => {
  return (
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
  );
};

export { formSchema };
