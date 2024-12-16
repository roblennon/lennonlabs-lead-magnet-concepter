import { useState, useEffect } from "react";
import { EmailField } from "./revenue-form/EmailField";
import { OfferField } from "./revenue-form/OfferField";
import { RevenueSourceField } from "./revenue-form/RevenueSourceField";
import { HelpRequestsField } from "./revenue-form/HelpRequestsField";
import { SubmitButton } from "./revenue-form/SubmitButton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type FormData = {
  email: string;
  offer: string;
  revenueSource: string;
  helpRequests: string;
};

interface RevenueFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
  initialEmail?: string;
}

export function RevenueForm({ onSubmit, isLoading, initialEmail }: RevenueFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: initialEmail || "",
    offer: "",
    revenueSource: "services",
    helpRequests: "",
  });
  const { toast } = useToast();

  // Update email field if initialEmail changes
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
    
    // If it's a URL, scrape it first
    if (isValidUrl(formData.offer)) {
      try {
        const { data, error } = await supabase.functions.invoke('scrape-url', {
          body: { url: formData.offer }
        });

        if (error) throw error;
        
        if (data.content) {
          // Update the form data with scraped content
          const updatedFormData = {
            ...formData,
            offer: formData.offer + "\n\n" + data.content
          };
          setFormData(updatedFormData);
          
          toast({
            title: "Website content extracted",
            description: "Successfully analyzed your website content.",
          });
          
          // Submit the updated form data
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
    
    // Submit the form with current data if not a URL or if scraping failed
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8">
      <OfferField
        value={formData.offer}
        onChange={(value) => setFormData(prev => ({ ...prev, offer: value }))}
      />
      
      <RevenueSourceField
        value={formData.revenueSource}
        onChange={(value) => setFormData(prev => ({ ...prev, revenueSource: value }))}
      />
      
      <HelpRequestsField
        value={formData.helpRequests}
        onChange={(value) => setFormData(prev => ({ ...prev, helpRequests: value }))}
      />
      
      <div>
        <EmailField 
          value={formData.email}
          onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
          required={true}
        />
      </div>
      
      <div className="!mt-10">
        <SubmitButton isLoading={isLoading} />
      </div>
      
      <p className="text-[0.65rem] text-muted-foreground mx-8">
        *Subscribe to the Lennon Labs newsletter to use this free resource. I deeply respect your privacy. Unsubscribe at any time.
      </p>
    </form>
  );
}