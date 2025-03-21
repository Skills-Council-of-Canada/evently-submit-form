
import React, { useRef } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Image, Camera } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";
import { useIsMobile } from "@/hooks/use-mobile";

export const EventImageSection = ({ 
  form, 
  handleImageChange, 
  previewImage 
}: { 
  form: UseFormReturn<FormValues>,
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  previewImage: string | null
}) => {
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

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
                {isMobile ? (
                  <div className="flex flex-row justify-center gap-4 w-full">
                    <div 
                      onClick={handleUploadClick}
                      className="flex flex-col items-center justify-center w-1/2 h-32 border-2 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Image className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="text-xs text-gray-500">Upload Image</p>
                      </div>
                    </div>
                    
                    <div 
                      onClick={handleCameraClick}
                      className="flex flex-col items-center justify-center w-1/2 h-32 border-2 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="text-xs text-gray-500">Take Photo</p>
                      </div>
                    </div>
                    
                    <Input
                      ref={fileInputRef}
                      id="upload-picture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        onChange(e.target.files);
                        handleImageChange(e);
                      }}
                      {...fieldProps}
                    />
                    
                    <Input
                      ref={cameraInputRef}
                      id="camera-picture"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        onChange(e.target.files);
                        handleImageChange(e);
                      }}
                      {...fieldProps}
                    />
                  </div>
                ) : (
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
                )}
              </div>
            </FormControl>
            <FormDescription>
              {isMobile 
                ? "Take a photo or upload an image for your event" 
                : "Upload an image to represent your event"}
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
