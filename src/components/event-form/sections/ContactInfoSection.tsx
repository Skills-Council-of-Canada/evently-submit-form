
import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";
import { School } from "@/services/schoolService";
import { Skeleton } from "@/components/ui/skeleton";

interface ContactInfoSectionProps {
  form: UseFormReturn<FormValues>;
  schools: School[];
  isLoadingSchools: boolean;
}

export const ContactInfoSection = ({ form, schools, isLoadingSchools }: ContactInfoSectionProps) => {
  const [selectedSchoolInfo, setSelectedSchoolInfo] = useState<School | null>(null);
  const [debugMessage, setDebugMessage] = useState<string>("");

  // Log schools data when it changes for debugging
  useEffect(() => {
    console.log("Schools data:", schools);
    console.log("Loading state:", isLoadingSchools);
    setDebugMessage(`Schools loaded: ${schools.length}`);
  }, [schools, isLoadingSchools]);

  // Update school info when school name changes
  useEffect(() => {
    const currentSchoolName = form.watch("schoolName");
    if (currentSchoolName && schools.length > 0) {
      const school = schools.find(s => s.school_name === currentSchoolName);
      setSelectedSchoolInfo(school || null);
    } else {
      setSelectedSchoolInfo(null);
    }
  }, [form.watch("schoolName"), schools]);

  return (
    <div className="form-section">
      <h2 className="form-subtitle">School & Contact Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="schoolName"
            render={({ field }) => (
              <FormItem>
                <FormLabel aria-required="true">
                  School Name *
                </FormLabel>
                <FormControl>
                  {isLoadingSchools ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        const school = schools.find(s => s.school_name === value);
                        setSelectedSchoolInfo(school || null);
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a school" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {schools.length === 0 ? (
                          <SelectItem value="no-schools" disabled>No schools available</SelectItem>
                        ) : (
                          schools
                            .filter(school => school && school.school_name && school.school_name.trim() !== "")
                            .sort((a, b) => a.school_name.localeCompare(b.school_name))
                            .map((school) => (
                              <SelectItem 
                                key={school.id || school.school_name} 
                                value={school.school_name}
                              >
                                {school.school_name}
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
                <FormMessage />
                {debugMessage && (
                  <p className="text-xs text-muted-foreground mt-1">{debugMessage}</p>
                )}
              </FormItem>
            )}
          />
          
          {selectedSchoolInfo && (
            <div className="text-sm text-muted-foreground mt-1 ml-1">
              {selectedSchoolInfo.panel || ''}
              {selectedSchoolInfo.panel && selectedSchoolInfo.municipality && ' • '}
              {selectedSchoolInfo.municipality || ''}
              {(selectedSchoolInfo.panel || selectedSchoolInfo.municipality) && selectedSchoolInfo.school_type && ' • '}
              {selectedSchoolInfo.school_type || ''}
            </div>
          )}
        </div>
        
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
