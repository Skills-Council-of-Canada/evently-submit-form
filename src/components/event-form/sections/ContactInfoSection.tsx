
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";
import { School } from "@/services/schoolService";
import { SearchableSchoolSelect } from "../components/SearchableSchoolSelect";

interface ContactInfoSectionProps {
  form: UseFormReturn<FormValues>;
  schools: School[];
  isLoadingSchools: boolean;
}

export const ContactInfoSection = ({ form, schools, isLoadingSchools }: ContactInfoSectionProps) => {
  const [selectedSchoolInfo, setSelectedSchoolInfo] = useState<School | null>(null);
  
  // Ensure schools is always an array
  const safeSchools = Array.isArray(schools) ? schools : [];

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
                <SearchableSchoolSelect
                  value={field.value}
                  onChange={field.onChange}
                  schools={safeSchools}
                  isLoading={isLoadingSchools}
                  onSchoolSelect={setSelectedSchoolInfo}
                />
                <FormMessage />
                {safeSchools.length === 0 && !isLoadingSchools && (
                  <p className="text-xs text-muted-foreground mt-1">No schools available</p>
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
