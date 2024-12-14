import { useState } from "react";
import { EmailField } from "./revenue-form/EmailField";
import { OfferField } from "./revenue-form/OfferField";
import { RevenueSourceField } from "./revenue-form/RevenueSourceField";
import { HelpRequestsField } from "./revenue-form/HelpRequestsField";
import { SubmitButton } from "./revenue-form/SubmitButton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type FormData = {
  email: string;
  offer: string;
  revenueSource: string;
  helpRequests: string;
};

interface RevenueFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export function RevenueForm({ onSubmit, isLoading }: RevenueFormProps) {
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
          // Append the scraped content to any existing content
          const updatedOffer = formData.offer + "\n\n" + data.content;
          setFormData(prev => ({ ...prev, offer: updatedOffer }));
          
          toast({
            title: "Website content extracted",
            description: "Successfully analyzed your website content.",
          });
          
          // Submit the form with the updated offer
          onSubmit({
            ...formData,
            offer: updatedOffer
          });
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
    
    // If no URL or scraping failed, submit the form with current data
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8">
      <OfferField
        value={formData.offer}
        onChange={(value) => setFormData({ ...formData, offer: value })}
      />
      
      <RevenueSourceField
        value={formData.revenueSource}
        onChange={(value) => setFormData({ ...formData, revenueSource: value })}
      />
      
      <HelpRequestsField
        value={formData.helpRequests}
        onChange={(value) => setFormData({ ...formData, helpRequests: value })}
      />
      
      <div>
        <EmailField 
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          required={true}
        />
      </div>
      
      <SubmitButton isLoading={isLoading} />
      
      <p className="text-[0.65rem] text-muted-foreground">
        *Subscribe to the Lennon Labs newsletter to use this free resource. I deeply respect your privacy. Unsubscribe at any time.
      </p>
    </form>
  );
}