import { useState } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface OfferFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function OfferField({ value, onChange }: OfferFieldProps) {
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);

  const handleChange = async (newValue: string) => {
    onChange(newValue);
    
    // Check if the input looks like a URL
    if (newValue.startsWith('http') && newValue.includes('.')) {
      setIsScrapingUrl(true);
      try {
        const { data, error } = await supabase.functions.invoke('scrape-url', {
          body: { url: newValue }
        });

        if (error) throw error;
        
        if (data.content) {
          // Update the textarea with the scraped content
          onChange(data.content);
        }
      } catch (error) {
        console.error('Error scraping URL:', error);
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
        placeholder={isScrapingUrl ? "Analyzing website content..." : "e.g. https://yourwebsite.com or describe your main offer"}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="min-h-[120px] bg-card border-border/50 text-foreground placeholder:text-muted/60"
        required
        disabled={isScrapingUrl}
      />
    </div>
  );
}