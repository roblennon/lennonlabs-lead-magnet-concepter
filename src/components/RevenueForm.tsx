import { useState } from "react";
import { EmailField } from "./revenue-form/EmailField";
import { OfferField } from "./revenue-form/OfferField";
import { RevenueSourceField } from "./revenue-form/RevenueSourceField";
import { HelpRequestsField } from "./revenue-form/HelpRequestsField";
import { SubmitButton } from "./revenue-form/SubmitButton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FormConfig } from "@/types/database";

export type FormData = {
  email: string;
  offer: string;
  revenueSource: string;
  helpRequests: string;
};

interface RevenueFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
  config: FormConfig;
}

export function RevenueForm({ onSubmit, isLoading, config }: RevenueFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    offer: "",
    revenueSource: "services",
    helpRequests: "",
  });
  const { toast } = useToast();

  const isValidUrl = (text: string): boolean => {
    const urlPattern = /^(https?:\/\/)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
    return urlPattern.test(text.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if the offer field contains a URL
    if (isValidUrl(formData.offer)) {
      try {
        const { data, error } = await supabase.functions.invoke('scrape-url', {
          body: { url: formData.offer }
        });

        if (error) throw error;
        
        if (data.content) {
          // Update the form data with the scraped content
          setFormData(prev => ({
            ...prev,
            offer: data.content
          }));
          
          toast({
            title: "Website content extracted",
            description: "Successfully analyzed your website content.",
          });
          return; // Don't submit the form yet
        }
      } catch (error) {
        console.error('Error scraping URL:', error);
        toast({
          title: "Error",
          description: "Failed to analyze website content. Please enter your offer manually.",
          variant: "destructive",
        });
        return; // Don't submit if there was an error
      }
    }
    
    // Submit the form with current data
    onSubmit(formData);
  };

  const { fields } = config;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8">
      <EmailField 
        value={formData.email}
        onChange={(value) => setFormData({ ...formData, email: value })}
        config={fields.email}
      />
      
      <OfferField
        value={formData.offer}
        onChange={(value) => setFormData({ ...formData, offer: value })}
        config={fields.offer}
      />
      
      <RevenueSourceField
        value={formData.revenueSource}
        onChange={(value) => setFormData({ ...formData, revenueSource: value })}
        config={fields.revenueSource}
      />
      
      <HelpRequestsField
        value={formData.helpRequests}
        onChange={(value) => setFormData({ ...formData, helpRequests: value })}
        config={fields.helpRequests}
      />
      
      <SubmitButton 
        isLoading={isLoading} 
        config={config.buttonConfig}
      />
    </form>
  );
}