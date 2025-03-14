
import { useState } from "react";

export function useImageUpload() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
  };

  return {
    previewImage,
    handleImageChange,
    resetImage
  };
}
