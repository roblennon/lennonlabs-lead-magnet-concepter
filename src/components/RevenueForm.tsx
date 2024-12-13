import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Send } from "lucide-react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8">
      <div className="space-y-2.5">
        <Label htmlFor="email" className="text-base font-medium text-foreground">
          Your email address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email to receive the analysis"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="h-12 bg-card border-border/50 text-foreground placeholder:text-muted/60"
          required
        />
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="offer" className="text-base font-medium text-foreground">
          Paste your website URL or main offer description
        </Label>
        <Textarea
          id="offer"
          placeholder="e.g. https://yourwebsite.com or describe your main offer"
          value={formData.offer}
          onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
          className="min-h-[120px] bg-card border-border/50 text-foreground placeholder:text-muted/60"
          required
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium text-foreground">
          What's currently making you the most money?
        </Label>
        <RadioGroup
          value={formData.revenueSource}
          onValueChange={(value) => setFormData({ ...formData, revenueSource: value })}
          className="space-y-0.75"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="services" id="services" className="border-primary/30 text-muted" />
            <Label htmlFor="services" className="text-base font-normal text-muted">1:1 Services</Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="products" id="products" className="border-primary/30 text-muted" />
            <Label htmlFor="products" className="text-base font-normal text-muted">Digital Products</Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="programs" id="programs" className="border-primary/30 text-muted" />
            <Label htmlFor="programs" className="text-base font-normal text-muted">Group Programs</Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="other" id="other" className="border-primary/30 text-muted" />
            <Label htmlFor="other" className="text-base font-normal text-muted">Other</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="helpRequests" className="text-base font-medium text-foreground">
          What do people most often ask you for help with?
        </Label>
        <Textarea
          id="helpRequests"
          placeholder="Share the common questions or requests you receive..."
          value={formData.helpRequests}
          onChange={(e) => setFormData({ ...formData, helpRequests: e.target.value })}
          className="min-h-[120px] bg-card border-border/50 text-foreground placeholder:text-muted/60"
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium"
        disabled={isLoading}
      >
        {isLoading ? "Analyzing..." : "Generate Revenue Opportunities"}
        {!isLoading && <Send className="ml-2" />}
      </Button>
    </form>
  );
}