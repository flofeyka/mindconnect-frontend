"use client";

import { Button } from "@nextui-org/react";
import { RefreshCw, Upload } from "lucide-react";
import { useCallback, useState } from "react";

interface PhotoUploadProps {
  image: File | null;
  onImageChange: (image: File | null) => void;
}

export default function PhotoUpload({
  image,
  onImageChange,
}: PhotoUploadProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePhotoUpload = (file: File) => {
    onImageChange(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const resetPhoto = () => {
    onImageChange(null);
    setPhotoPreview(null);
  };

  return (
    <div className="flex items-center justify-center w-[250px] relative">
      {photoPreview ? (
        <>
          <img
            src={photoPreview}
            alt="Upload preview"
            className="max-w-full h-64 object-cover rounded-lg"
          />
          <Button
            type="button"
            size="sm"
            className="absolute top-[-40px] right-2"
            onClick={resetPhoto}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Photo
          </Button>
        </>
      ) : (
        <label
          htmlFor="photo-upload"
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
            isDragging ? "border-blue-500 bg-blue-50" : ""
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
          </div>
          <input
            id="photo-upload"
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handlePhotoUpload(e.target.files[0]);
              }
            }}
            accept="image/*"
          />
        </label>
      )}
    </div>
  );
}
