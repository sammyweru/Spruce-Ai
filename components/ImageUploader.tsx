import React, { useCallback, useState } from 'react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  onImageUpload: (file: ImageFile) => void;
  disabled: boolean;
  children: React.ReactNode;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, disabled, children, className }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        onImageUpload({
          base64: base64String,
          mimeType: file.type,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, [disabled, onImageUpload]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const disabledClasses = "cursor-not-allowed opacity-50";
  const draggingClasses = "scale-105 shadow-xl";
  const idleClasses = "hover:scale-105";

  return (
      <label
        htmlFor="file-upload"
        className={`relative inline-block transition-all duration-300 ${className} ${disabled ? disabledClasses : isDragging ? draggingClasses : idleClasses}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {children}
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          accept="image/*"
          onChange={handleInputChange}
          disabled={disabled}
        />
      </label>
  );
};

export default ImageUploader;