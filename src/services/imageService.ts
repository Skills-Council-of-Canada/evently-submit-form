
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Upload an image to Supabase Storage
 * @param file The image file to upload
 * @returns Promise resolving to the public URL of the uploaded image, or null if failed
 */
export const uploadEventImage = async (file: File): Promise<string | null> => {
  try {
    if (!file) {
      return null;
    }

    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file to the bucket
    const { data, error } = await supabase
      .storage
      .from('event-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Error uploading image:", error);
      throw error;
    }

    // Get the public URL for the file
    const { data: { publicUrl } } = supabase
      .storage
      .from('event-images')
      .getPublicUrl(data?.path || "");

    return publicUrl;
  } catch (error) {
    console.error("Error in uploadEventImage:", error);
    return null;
  }
};
