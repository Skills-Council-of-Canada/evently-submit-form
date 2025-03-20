
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { School } from "@/services/schoolService";

export function useSchoolSearch() {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchSchoolsCallback = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSchools([]);
      return;
    }

    setIsLoading(true);
    try {
      // Direct Supabase query without going through an API
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .or(`school_name.ilike.%${query}%, school.ilike.%${query}%`)
        .order('school_name', { ascending: true })
        .limit(20); // Limiting results for better performance
      
      if (error) {
        throw error;
      }
      
      setSchools(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error searching schools:", error);
      toast({
        title: "Error searching schools",
        description: "Please try again or enter the school name manually.",
        variant: "destructive",
      });
      setSchools([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    schools: schools || [], // Ensure we always return a valid array
    isLoading,
    searchSchools: searchSchoolsCallback
  };
}
