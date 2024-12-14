import { useState, useEffect } from "react";
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

  const subscribeToConvertKit = async (email: string, data: FormData) => {
    try {
      const { error } = await supabase.functions.invoke('subscribe-convertkit', {
        body: { 
          email,
          fields: {
            offer_desc: data.offer,
            ppl_ask_help_with: data.helpRequests,
            primary_revenue_from: data.revenueSource,
          }
        }
      });

      if (error) throw error;
      
      console.log('Successfully subscribed to newsletter');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: "Newsletter Subscription Error",
        description: "Failed to subscribe to the newsletter, but your analysis was generated.",
        variant: "destructive",
      });
    }
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

          // Subscribe to ConvertKit after successful form submission
          await subscribeToConvertKit(formData.email, {
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
    // Subscribe to ConvertKit after successful form submission
    await subscribeToConvertKit(formData.email, formData);
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
