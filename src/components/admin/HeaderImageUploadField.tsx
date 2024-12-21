import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { PageConfig } from "@/types/page-config";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Image, Upload } from "lucide-react";

type HeaderImageUploadFieldProps = {
  form: UseFormReturn<PageConfig>;
};

export const HeaderImageUploadField = ({ form }: HeaderImageUploadFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('page-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('page-images')
        .getPublicUrl(fileName);

      // Update form
      form.setValue('header_image_url', publicUrl);
      
      toast({
        title: "Success",
        description: "Header image uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="header_image_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Header Image</FormLabel>
          <FormControl>
            <div className="space-y-4">
              {field.value && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={field.value}
                    alt="Header image"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Image URL"
                  {...field}
                  className="flex-1"
                />
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Upload className="animate-spin" />
                    ) : (
                      <Image />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};