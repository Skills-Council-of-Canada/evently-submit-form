
import { useState, useEffect } from "react";

export function useImageUpload() {
  // Initialize state from sessionStorage if available
  const [previewImage, setPreviewImage] = useState<string | null>(() => {
    const savedImage = sessionStorage.getItem('previewImage');
    return savedImage || null;
  });

  // Save preview image to sessionStorage when it changes
  useEffect(() => {
    if (previewImage) {
      sessionStorage.setItem('previewImage', previewImage);
    } else {
      sessionStorage.removeItem('previewImage');
    }
  }, [previewImage]);

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

  const resetImage = () => {
    setPreviewImage(null);
    sessionStorage.removeItem('previewImage');
  };

  return {
    previewImage,
    handleImageChange,
    resetImage
  };
}
