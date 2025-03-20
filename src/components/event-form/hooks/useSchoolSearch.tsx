
import { useState, useCallback } from "react";
import { searchSchools, School } from "@/services/schoolService";
import { useToast } from "@/hooks/use-toast";

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
      const results = await searchSchools(query);
      setSchools(Array.isArray(results) ? results : []);
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
