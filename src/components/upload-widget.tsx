import { useEffect, useRef, useState } from 'react';
import { UploadWidgetValue } from "@/Types";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/lib/constant";

const UploadWidget = ({ value = null, onChange, disabled = false }: any) => {
  const widgetRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);

  const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
  const [deleteToken, setDeleteToken] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  // Triggering CodeRabbit Review

  // 1. Value sync
  useEffect(() => {
    setPreview(value);
    if (!value) setDeleteToken(null);
  }, [value]);

  // 2. OnChange ref sync
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // 3. Widget Initialization with Interval
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeWidget = () => {
      // @ts-ignore
      if (!window.cloudinary || widgetRef.current) return false;

      // @ts-ignore
      widgetRef.current = window.cloudinary.createUploadWidget({
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        multiple: false,
        folder: 'uploads',
        maxFileSize: 5000000,
        clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
      }, (error: any, result: any) => {
        if (!error && result.event === 'success') {
          const payload: UploadWidgetValue = {
            url: result.info.secure_url,
            publicId: result.info.public_id,
          };
          setPreview(payload);
          setDeleteToken(result.info.delete_token ?? null);
          onChangeRef.current?.(payload);
        }
      });
      return true;
    };

    if (initializeWidget()) return;

    const intervalId = window.setInterval(() => {
      if (initializeWidget()) {
        window.clearInterval(intervalId);
      }
    }, 500);

    return () => window.clearInterval(intervalId);
  }, []);

  const openWidget = () => {
    if (!disabled) widgetRef.current?.open();
  };

  const removeFromCloudinary = async () => {
    setIsRemoving(true);
    setPreview(null);
    onChangeRef.current?.(null);
    setIsRemoving(false);
  };

  return (
    <div className="space-y-2">
      {preview ? (
        // IMAGE 40: Added proper class and alt text
        <div className="upload-preview relative border rounded-md overflow-hidden">
          <img 
            src={preview.url} 
            alt="Uploaded file" 
            className="h-40 w-full object-cover" 
          />
          <Button 
             type="button" 
             onClick={removeFromCloudinary} 
             variant="destructive" 
             size="sm"
             className="mt-2 ml-2 mb-2"
             disabled={isRemoving}
          >
            Remove Image
          </Button>
        </div>
      ) : (
        <div 
          className="upload-dropzone border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition"
          role="button"
          tabIndex={0}
          onClick={openWidget}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              openWidget();
            }
          }}
        >
          <div className="upload-prompt flex flex-col items-center">
            <UploadCloud className="h-10 w-10 mb-2 text-muted-foreground" />
            <p className="font-medium text-sm">Click to upload photo</p>
            <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadWidget;
// Force change for CodeRabbit review