import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type FormData = {
  email: string;
  offer: string;
};

export function useRevenueForm(onSubmit: (data: FormData) => void, initialEmail?: string) {
  const [formData, setFormData] = useState<FormData>({
    email: initialEmail || "",
    offer: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (initialEmail) {
      setFormData(prev => ({ ...prev, email: initialEmail }));
    }
  }, [initialEmail]);

  const isValidUrl = (text: string): boolean => {
    const urlPattern = /^(https?:\/\/)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
    return urlPattern.test(text.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isValidUrl(formData.offer)) {
      try {
        const { data, error } = await supabase.functions.invoke('scrape-url', {
          body: { url: formData.offer }
        });

        if (error) throw error;
        
        if (data.content) {
          const updatedFormData = {
            ...formData,
            offer: `${formData.offer}\n\n<website-content>\n${data.content}\n</website-content>`
          };
          setFormData(updatedFormData);
          
          toast({
            title: "Website content extracted",
            description: "Successfully analyzed your website content.",
          });
          
          onSubmit(updatedFormData);
          return;
        }
      } catch (error) {
        console.error('Error scraping URL:', error);
        toast({
          title: "Error",
          description: "Failed to analyze website content. Proceeding with form submission.",
          variant: "destructive",
        });
      }
    }
    
    onSubmit(formData);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && formData.email) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    handleKeyPress
  };
}