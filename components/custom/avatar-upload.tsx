'use client';

import { Button } from '@/components/ui/button';
import { TriangleAlert, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface AvatarUploaderProps {
  maxSize?: number;
  className?: string;
  value: File | string | null;
  onChange: (value: File | string | null) => void;
}

export default function AvatarUploader({
  maxSize = 2 * 1024 * 1024, // 2MB
  className,
  value,
  onChange,
}: AvatarUploaderProps) {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (value instanceof File) {
      const imageUrl = URL.createObjectURL(value);
      setImage(imageUrl);
      return () => {
        URL.revokeObjectURL(imageUrl);
      };
    } else if (typeof value === "string") {
      setImage(value);
    } else {
      setImage(null);
    }

    // Clear the input field when value changes (e.g., on reset)
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  }, [value]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Only image files are allowed.");
      return;
    }

    if (file.size > maxSize) {
      toast.error(`File size exceeds ${formatBytes(maxSize)}.`);
      return;
    }

    onChange(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value) return;
    setImage(null);
    onChange(null);
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Only image files are allowed.");
      return;
    }

    if (file.size > maxSize) {
      toast.error(`File size exceeds ${formatBytes(maxSize)}.`);
      return;
    }

    onChange(file);
  };

  const openFileDialog = () => {
    fileInput.current?.click();
  };

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Hidden File Input */}
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Avatar Preview */}
      <div className="relative">
        <div
          className={cn(
            'group/avatar relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border border-dashed transition-colors',
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/20',
            image && 'border-solid',
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          {image ? (
            <img src={image} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="size-6 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Remove Button - only show when file is uploaded */}
        {value && (
          <Button
            size="icon"
            variant="outline"
            onClick={handleRemove}
            className="size-6 absolute end-0 top-0 rounded-full"
            aria-label="Remove avatar"
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="text-center space-y-0.5">
        <p className="text-sm font-medium">{value ? 'Avatar uploaded' : 'Upload avatar'}</p>
        <p className="text-xs text-muted-foreground">PNG, JPG up to {formatBytes(maxSize)}</p>
      </div>
    </div>
  );
}
