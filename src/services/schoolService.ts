
import { supabase } from "@/integrations/supabase/client";

export interface School {
  id?: string;
  municipality?: string;
  school: string;
  school_type?: string;
  panel?: string;
  street_number?: string;
  street_name?: string;
  full_address?: string;
  postal_code?: string;
  grades?: string;
  family?: string;
  school_name: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch all schools from the database
 */
export const getAllSchools = async (): Promise<School[]> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('school_name', { ascending: true });
    
    if (error) {
      console.error("Error fetching schools:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Failed to fetch schools:", error);
    return [];
  }
};

/**
 * Fetch schools by municipality
 */
export const getSchoolsByMunicipality = async (municipality: string): Promise<School[]> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .ilike('municipality', `%${municipality}%`)
      .order('school_name', { ascending: true });
    
    if (error) {
      console.error("Error fetching schools by municipality:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Failed to fetch schools by municipality:", error);
    return [];
  }
};

/**
 * Search schools by name
 */
export const searchSchools = async (query: string): Promise<School[]> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .or(`school_name.ilike.%${query}%, school.ilike.%${query}%`)
      .order('school_name', { ascending: true });
    
    if (error) {
      console.error("Error searching schools:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Failed to search schools:", error);
    return [];
  }
};

/**
 * Get a single school by ID
 */
export const getSchoolById = async (id: string): Promise<School | null> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching school:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Failed to fetch school:", error);
    return null;
  }
};

/**
 * Create a new school
 */
export const createSchool = async (school: School): Promise<School | null> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .insert([school])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating school:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Failed to create school:", error);
    return null;
  }
};

/**
 * Update an existing school
 */
export const updateSchool = async (id: string, school: Partial<School>): Promise<School | null> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .update(school)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating school:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Failed to update school:", error);
    return null;
  }
};

/**
 * Delete a school
 */
export const deleteSchool = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting school:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Failed to delete school:", error);
    return false;
  }
};
