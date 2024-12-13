import { useState } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OfferFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function OfferField({ value, onChange }: OfferFieldProps) {
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);
  const { toast } = useToast();

  const isValidUrl = (text: string): boolean => {
    // Basic URL pattern that matches domains with or without http(s)://
    const urlPattern = /^(https?:\/\/)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
    return urlPattern.test(text.trim());
  };

  const handleChange = async (newValue: string) => {
    onChange(newValue);
    
    // Check if the input looks like a URL
    if (isValidUrl(newValue)) {
      setIsScrapingUrl(true);
      try {
        const { data, error } = await supabase.functions.invoke('scrape-url', {
          body: { url: newValue }
        });

        if (error) throw error;
        
        if (data.content) {
          // Update the textarea with the scraped content
          onChange(data.content);
          toast({
            title: "Website content extracted",
            description: "Successfully analyzed your website content.",
          });
        }
      } catch (error) {
        console.error('Error scraping URL:', error);
        toast({
          title: "Error",
          description: "Failed to analyze website content. Please try entering your offer description manually.",
          variant: "destructive",
        });
      } finally {
        setIsScrapingUrl(false);
      }
    }
  };

  return (
    <div className="space-y-2.5">
      <Label htmlFor="offer" className="text-base font-medium text-foreground">
        Paste your website URL or main offer description
      </Label>
      <Textarea
        id="offer"
        placeholder={isScrapingUrl ? "Analyzing website content..." : "e.g. aicontentreactor.com or describe your main offer"}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="min-h-[120px] bg-card border-border/50 text-foreground placeholder:text-muted/60"
        required
        disabled={isScrapingUrl}
      />
    </div>
  );
}