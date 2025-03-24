
import { useState, useEffect } from "react";

export function useImageUpload() {
  // Try to retrieve image from both localStorage and sessionStorage
  const [previewImage, setPreviewImage] = useState<string | null>(() => {
    const savedImageLocal = localStorage.getItem('previewImage');
    const savedImageSession = sessionStorage.getItem('previewImage');
    return savedImageLocal || savedImageSession || null;
  });

  // Save preview image to both storage types when it changes
  useEffect(() => {
    if (previewImage) {
      sessionStorage.setItem('previewImage', previewImage);
      localStorage.setItem('previewImage', previewImage);
    } else {
      sessionStorage.removeItem('previewImage');
      localStorage.removeItem('previewImage');
    }
  }, [previewImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        // Save immediately to both storage methods
        localStorage.setItem('previewImage', result);
        sessionStorage.setItem('previewImage', result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
      localStorage.removeItem('previewImage');
      sessionStorage.removeItem('previewImage');
    }
  };

  const resetImage = () => {
    setPreviewImage(null);
    sessionStorage.removeItem('previewImage');
    localStorage.removeItem('previewImage');
  };

  return {
    previewImage,
    handleImageChange,
    resetImage
  };
}
