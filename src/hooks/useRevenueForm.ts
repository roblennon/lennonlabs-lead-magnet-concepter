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

  const processSubmission = async (data: FormData) => {
    // First trigger the form submission to show loading state
    onSubmit(data);

    // Then handle URL scraping if needed
    if (isValidUrl(data.offer)) {
      try {
        const { data: scrapeData, error } = await supabase.functions.invoke('scrape-url', {
          body: { url: data.offer }
        });

        if (error) throw error;
        
        if (scrapeData?.content) {
          const updatedFormData = {
            ...data,
            offer: `${data.offer}\n\n<website-content>\n${scrapeData.content}\n</website-content>`
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await processSubmission(formData);
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && formData.email) {
      e.preventDefault();
      await processSubmission(formData);
    }
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    handleKeyPress
  };
}